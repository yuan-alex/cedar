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
  createFetchWebContentTool,
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

  // Fetch thread with project to get custom instructions
  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    include: {
      project: {
        select: {
          customInstructions: true,
        },
      },
    },
  });

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
    system: getSystemMessage(
      webSearchEnabled,
      model,
      thread?.project?.customInstructions,
    ),
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

    const takeParam = c.req.query("take");
    const skipParam = c.req.query("skip");
    // Validate and limit pagination parameters to prevent DoS
    const take = takeParam
      ? Math.max(1, Math.min(100, Number.parseInt(takeParam as string) || 20))
      : 20;
    const skip = Math.max(0, Number.parseInt(skipParam as string) || 0);
    const projectIdParam = c.req.query("projectId");
    const projectId = projectIdParam
      ? Math.max(1, Number.parseInt(projectIdParam as string))
      : undefined;
    const projectToken = c.req.query("projectToken");

    let resolvedProjectId = projectId;

    // If projectToken is provided, resolve it to projectId
    if (projectToken) {
      const project = await prisma.project.findUnique({
        where: { token: projectToken, isDeleted: false, userId: user.id },
      });
      if (project) {
        resolvedProjectId = project.id;
      } else {
        // Project not found or doesn't belong to user, return empty paginated response
        return Response.json({
          data: [],
          pagination: {
            total: 0,
            skip: 0,
            take: 0,
          },
        });
      }
    }

    const where: any = { userId: user.id, isDeleted: false };
    if (resolvedProjectId !== undefined) {
      where.projectId = resolvedProjectId;
    }

    // Always get total count for pagination metadata
    const total = await prisma.thread.count({ where });

    const threads = await prisma.thread.findMany({
      where,
      take,
      skip,
      orderBy: { lastMessagedAt: "desc" },
      select: {
        token: true,
        name: true,
        lastMessagedAt: true,
        createdAt: true,
        projectId: true,
        project: {
          select: {
            token: true,
            name: true,
          },
        },
      },
    });

    // Always return paginated response format
    return Response.json({
      data: threads,
      pagination: {
        total,
        skip: skip || 0,
        take: take ?? threads.length,
      },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    throw error;
  }
}

export async function createThread(c: Context<AppEnv>) {
  try {
    const user = requireAuth(c);
    const { model, prompt, projectId } = await c.req.json();

    if (!prompt || !model) {
      return new Response("invalid parameters", { status: 400 });
    }

    // Validate project ownership if projectId is provided
    if (projectId !== undefined) {
      const project = await prisma.project.findUnique({
        where: { id: projectId, isDeleted: false },
      });

      if (!project || project.userId !== user.id) {
        return new Response("project not found or access denied", {
          status: 404,
        });
      }
    }

    const thread = await prisma.thread.create({
      data: {
        userId: user.id,
        projectId: projectId || null,
      },
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
    });
    const fetchWebContentTool = createFetchWebContentTool();

    if (userInput.webSearchEnabled && isWebSearchAvailable()) {
      tools.webSearch = webSearchTool;
      tools.fetchWebContent = fetchWebContentTool;
    }

    // Always include webSearch in validation tools to allow validation of old messages that used web search
    const validationTools: ToolSet = {
      ...tools,
      webSearch: webSearchTool,
      fetchWebContent: fetchWebContentTool,
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

    // Defense in depth: explicitly check userId in message deletion
    const deleteMessages = prisma.chatMessage.updateMany({
      where: {
        threadId: thread.id,
        thread: { userId: user.id },
      },
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
    });
    const fetchWebContentTool = createFetchWebContentTool();

    if (webSearchEnabled && isWebSearchAvailable()) {
      tools.webSearch = webSearchTool;
      tools.fetchWebContent = fetchWebContentTool;
    }

    // Always include webSearch in validation tools to allow validation of old messages that used web search
    // This is necessary even if webSearch is currently disabled or API key is missing, as previous threads might have had it enabled
    const validationTools: ToolSet = {
      ...tools,
      webSearch: webSearchTool,
      fetchWebContent: fetchWebContentTool,
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

export async function updateThread(c: Context<AppEnv>) {
  try {
    const user = requireAuth(c);
    const threadToken = c.req.param("threadToken");
    const { projectId, name } = await c.req.json();

    const thread = await validateThreadAccess(threadToken, user.id);

    const updateData: {
      projectId?: number | null;
      name?: string;
    } = {};

    // Handle projectId update (can be null to remove project, or a number to set project)
    if (projectId !== undefined) {
      if (projectId !== null) {
        // Validate project ownership if projectId is provided
        const project = await prisma.project.findUnique({
          where: { id: projectId, isDeleted: false },
        });

        if (!project || project.userId !== user.id) {
          return new Response("project not found or access denied", {
            status: 404,
          });
        }
      }
      updateData.projectId = projectId;
    }

    if (name !== undefined) {
      updateData.name = name;
    }

    const updatedThread = await prisma.thread.update({
      where: { id: thread.id },
      data: updateData,
      select: {
        token: true,
        name: true,
        projectId: true,
        project: {
          select: {
            token: true,
            name: true,
          },
        },
      },
    });

    return Response.json(updatedThread);
  } catch (error) {
    if (error instanceof Response) return error;
    throw error;
  }
}

export async function bulkSoftDeleteThreads(c: Context<AppEnv>) {
  const user = requireAuth(c);

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

export async function deleteSelectedThreads(c: Context<AppEnv>) {
  try {
    const user = requireAuth(c);
    const body = await c.req.json();
    const { threadTokens } = body;

    if (
      !Array.isArray(threadTokens) ||
      threadTokens.length === 0 ||
      threadTokens.length > 1000
    ) {
      return c.json(
        {
          error:
            "threadTokens must be a non-empty array with a maximum of 1000 items",
        },
        400,
      );
    }

    // First, validate that all threads belong to the user
    const threads = await prisma.thread.findMany({
      where: {
        token: { in: threadTokens },
        userId: user.id,
        isDeleted: false,
      },
    });

    if (threads.length !== threadTokens.length) {
      return c.json({ error: "Some threads not found or access denied" }, 403);
    }

    const threadIds = threads.map((t) => t.id);

    // Delete messages and threads in a transaction
    const deleteMessages = prisma.chatMessage.updateMany({
      where: { threadId: { in: threadIds } },
      data: { isDeleted: true, uiMessageParts: [] },
    });

    const deleteThreads = prisma.thread.updateMany({
      where: { id: { in: threadIds }, userId: user.id },
      data: { isDeleted: true, name: "", uiMessages: [] },
    });

    await prisma.$transaction([deleteMessages, deleteThreads]);

    return new Response("ok");
  } catch (error) {
    if (error instanceof Response) return error;
    throw error;
  }
}
