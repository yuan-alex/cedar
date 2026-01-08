import {
  convertToModelMessages,
  defaultSettingsMiddleware,
  extractReasoningMiddleware,
  smoothStream,
  stepCountIs,
  streamText,
  type ToolSet,
  validateUIMessages,
  wrapLanguageModel,
} from "ai";
import type { Context } from "hono";

import type { AppEnv } from "@/server/types";
import { config } from "@/server/utils/config";
import { generateTitle, getSystemMessage } from "@/server/utils/inference";
import { MCPClientManager } from "@/server/utils/mcp";
import prisma from "@/server/utils/prisma";
import {
  ChatMessageRole,
  ChatMessageStatus,
} from "@/server/utils/prisma-client/client";
import { getModels, registry } from "@/server/utils/providers";
import {
  createCleanedWebSearch,
  isWebSearchAvailable,
} from "@/server/utils/web-search";

const mcpClientManager = new MCPClientManager();

function requireAuth(c: Context<AppEnv>) {
  const user = c.get("user");
  if (!user) throw new Response(null, { status: 401 });
  return user;
}

async function validateThreadAccess(threadToken: string, userId: string) {
  const thread = await prisma.thread.findUnique({
    where: { token: threadToken, isDeleted: false },
  });

  if (!thread || thread.userId !== userId) {
    throw new Response(null, { status: 404 });
  }

  return thread;
}

function setupAIModel(model: string) {
  const models = getModels();
  if (!models.some((m) => m.id === model)) {
    throw new Response("Invalid model", { status: 400 });
  }

  const settingsMiddleware = defaultSettingsMiddleware({
    settings: {
      temperature: config.models.temperature,
      maxOutputTokens: config.models.max_tokens,
      frequencyPenalty: config.models.frequency_penalty,
      presencePenalty: config.models.presence_penalty,
    },
  });

  const reasoningMiddleware = extractReasoningMiddleware({
    tagName: "think",
    separator: "\n",
  });

  return wrapLanguageModel({
    // @ts-expect-error - TypeScript can't infer the exact model ID type, but we validate it exists above
    model: registry.languageModel(model),
    middleware: [reasoningMiddleware, settingsMiddleware],
  });
}

async function createAIResponse(
  model: string,
  messages: any[],
  tools: any,
  threadId: number,
  messageToken?: string,
) {
  const wrappedModel = setupAIModel(model);

  const newMessage = await prisma.chatMessage.create({
    data: {
      token: messageToken,
      role: ChatMessageRole.assistant,
      status: ChatMessageStatus.inProgress,
      uiMessageParts: [],
      threadId,
      provider: model.split(":")[0],
      model: model.split(":")[1],
    },
  });

  const modelMessages = await convertToModelMessages(messages);

  const webSearchEnabled = "webSearch" in tools;

  const result = streamText({
    model: wrappedModel,
    system: getSystemMessage(webSearchEnabled, model),
    messages: modelMessages,
    tools,
    stopWhen: stepCountIs(10),
    experimental_transform: smoothStream({ chunking: "word" }),
    providerOptions: {
      openrouter: {
        provider: {
          sort: "throughput",
        },
      },
    },
    onFinish: (event) => {
      prisma.chatMessage
        .update({
          where: { id: newMessage.id },
          data: { rawEvent: event as any },
        })
        .catch((err) => {
          console.error("Failed to save rawEvent:", err);
        });
    },
  });

  return { result, newMessage };
}

export async function listThreads(c: Context<AppEnv>) {
  try {
    const user = requireAuth(c);

    const take = c.req.query("take")
      ? Number.parseInt(c.req.query("take") as string)
      : undefined;
    const skip = Number.parseInt(c.req.query("skip") || "0");

    const threads = await prisma.thread.findMany({
      where: { userId: user.id, isDeleted: false },
      take,
      skip,
      orderBy: { lastMessagedAt: "desc" },
      select: {
        token: true,
        name: true,
        lastMessagedAt: true,
        createdAt: true,
      },
    });

    return Response.json(threads);
  } catch (error) {
    if (error instanceof Response) return error;
    throw error;
  }
}

export async function createThread(c: Context<AppEnv>) {
  try {
    const user = requireAuth(c);
    const { model, prompt } = await c.req.json();

    if (!prompt || !model) {
      return new Response("invalid parameters", { status: 400 });
    }

    const thread = await prisma.thread.create({
      data: { userId: user.id },
    });

    generateTitle(prompt, config.models.title_generation || model).then(
      async (response) => {
        await prisma.thread.update({
          where: { id: thread.id },
          data: { name: response.text },
        });
      },
    );

    return Response.json(thread);
  } catch (error) {
    if (error instanceof Response) return error;
    throw error;
  }
}

export async function getThread(c: Context<AppEnv>) {
  try {
    const user = requireAuth(c);
    const threadToken = c.req.param("threadToken");

    const thread = await prisma.thread.findUnique({
      where: { token: threadToken, isDeleted: false },
      include: {
        messages: { select: { uiMessageParts: true }, orderBy: { id: "asc" } },
      },
    });

    if (!thread || thread.userId !== user.id) {
      return c.notFound();
    }

    return Response.json(thread);
  } catch (error) {
    if (error instanceof Response) return error;
    throw error;
  }
}

export async function createMessage(c: Context<AppEnv>) {
  try {
    const user = requireAuth(c);
    const threadToken = c.req.param("threadToken");
    const userInput = await c.req.json();
    const { model } = userInput;

    const thread = await validateThreadAccess(threadToken, user.id);

    await prisma.thread.update({
      where: { id: thread.id },
      data: {
        lastMessagedAt: new Date(),
        messages: {
          create: {
            token: userInput.newMessage.id,
            role: ChatMessageRole.user,
            uiMessageParts: userInput.newMessage.parts,
          },
        },
      },
    });

    const tools: ToolSet = {};
    const mcpTools = await mcpClientManager.getAllTools(userInput.mcpServers);
    Object.entries(mcpTools).forEach(([key, tool]) => {
      tools[key] = tool;
    });

    // Always create webSearch tool for validation (needed to validate old messages that used web search)
    const webSearchTool = createCleanedWebSearch({
      type: "fast",
      numResults: 3,
    });
    if (userInput.webSearchEnabled && isWebSearchAvailable()) {
      tools.webSearch = webSearchTool;
    }

    // Always include webSearch in validation tools to allow validation of old messages that used web search
    const validationTools: ToolSet = {
      ...tools,
      webSearch: webSearchTool,
    };

    const validatedMessages = await validateUIMessages({
      metadataSchema: undefined,
      dataSchemas: undefined,
      messages: [...thread.uiMessages, userInput.newMessage],
      tools: Object.fromEntries(
        Object.entries(validationTools).map(([key, tool]) => [
          key,
          tool as any,
        ]),
      ),
    });

    const { result, newMessage } = await createAIResponse(
      model,
      validatedMessages,
      tools,
      thread.id,
    );

    return result.toUIMessageStreamResponse({
      originalMessages: validatedMessages as any,
      generateMessageId: () => newMessage.token,
      onError: (error) => {
        prisma.chatMessage.update({
          where: { id: newMessage.id },
          data: { status: ChatMessageStatus.failed },
        });
        return `Failed to process message: ${error}`;
      },
      onFinish: async ({ messages, responseMessage }) => {
        await prisma.chatMessage.update({
          where: { id: newMessage.id },
          data: {
            uiMessageParts: responseMessage.parts as any,
            status: ChatMessageStatus.completed,
          },
        });

        await prisma.thread.update({
          where: { id: thread.id },
          data: {
            uiMessages: messages as any,
            messages: { connect: { id: newMessage.id } },
          },
        });
      },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    throw error;
  }
}

export async function softDeleteThread(c: Context<AppEnv>) {
  try {
    const user = requireAuth(c);
    const threadToken = c.req.param("threadToken");

    const thread = await validateThreadAccess(threadToken, user.id);

    const deleteMessages = prisma.chatMessage.updateMany({
      where: { threadId: thread.id },
      data: { isDeleted: true, uiMessageParts: [] },
    });
    const deleteThread = prisma.thread.update({
      where: { token: threadToken, userId: user.id },
      data: { isDeleted: true, name: "", uiMessages: [] },
    });

    await prisma.$transaction([deleteMessages, deleteThread]);

    return new Response("ok");
  } catch (error) {
    if (error instanceof Response) return error;
    throw error;
  }
}

export async function regenerateMessage(c: Context<AppEnv>) {
  try {
    const user = requireAuth(c);
    const threadToken = c.req.param("threadToken");
    const userInput = await c.req.json();
    const { model, mcpServers, webSearchEnabled } = userInput;

    // Get the thread with all messages
    const thread = await prisma.thread.findUnique({
      where: { token: threadToken, isDeleted: false },
      include: {
        messages: {
          where: { isDeleted: false },
          orderBy: { id: "desc" },
        },
      },
    });

    if (!thread || thread.userId !== user.id) {
      return c.notFound();
    }

    // Find the latest assistant message
    const latestAssistantMessage = thread.messages.find(
      (msg) => msg.role === ChatMessageRole.assistant,
    );

    if (!latestAssistantMessage) {
      return new Response("No assistant message to regenerate", {
        status: 400,
      });
    }

    // Mark the latest assistant message as deleted
    await prisma.chatMessage.update({
      where: { id: latestAssistantMessage.id },
      data: { isDeleted: true },
    });

    // Remove the latest assistant message from uiMessages
    const updatedUIMessages = thread.uiMessages.slice(0, -1);

    const tools: ToolSet = {};
    const mcpTools = await mcpClientManager.getAllTools(mcpServers);
    Object.entries(mcpTools).forEach(([key, tool]) => {
      tools[key] = tool;
    });

    // Always create webSearch tool for validation (needed to validate old messages that used web search)
    // Only add to actual tools if enabled AND API key is available (prevents model from using it when disabled)
    const webSearchTool = createCleanedWebSearch({
      type: "fast",
      numResults: 3,
    });
    if (webSearchEnabled && isWebSearchAvailable()) {
      tools.webSearch = webSearchTool;
    }

    // Always include webSearch in validation tools to allow validation of old messages that used web search
    // This is necessary even if webSearch is currently disabled or API key is missing, as previous threads might have had it enabled
    const validationTools: ToolSet = {
      ...tools,
      webSearch: webSearchTool,
    };

    const validatedMessages = await validateUIMessages({
      metadataSchema: undefined,
      dataSchemas: undefined,
      messages: updatedUIMessages,
      tools: Object.fromEntries(
        Object.entries(validationTools).map(([key, tool]) => [
          key,
          tool as any,
        ]),
      ),
    });

    const { result, newMessage } = await createAIResponse(
      model,
      validatedMessages,
      tools,
      thread.id,
    );

    return result.toUIMessageStreamResponse({
      originalMessages: validatedMessages as any,
      generateMessageId: () => newMessage.token,
      onError: (error) => {
        prisma.chatMessage.update({
          where: { id: newMessage.id },
          data: { status: ChatMessageStatus.failed },
        });
        return `Failed to regenerate message: ${error}`;
      },
      onFinish: async ({ messages, responseMessage }) => {
        await prisma.chatMessage.update({
          where: { id: newMessage.id },
          data: {
            uiMessageParts: responseMessage.parts as any,
            status: ChatMessageStatus.completed,
          },
        });

        await prisma.thread.update({
          where: { id: thread.id },
          data: {
            uiMessages: messages as any,
            lastMessagedAt: new Date(),
          },
        });
      },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    throw error;
  }
}

export async function bulkSoftDeleteThreads(c: Context<AppEnv>) {
  const user = c.get("user");
  if (!user) return c.body(null, 401);

  const deleteMessages = prisma.chatMessage.updateMany({
    where: {
      thread: {
        userId: user.id,
        isDeleted: false,
      },
    },
    data: { isDeleted: true, uiMessageParts: [] },
  });
  const deleteThreads = prisma.thread.updateMany({
    where: { userId: user.id, isDeleted: false },
    data: { isDeleted: true, name: "", uiMessages: [] },
  });

  await prisma.$transaction([deleteMessages, deleteThreads]);

  return new Response("ok");
}
