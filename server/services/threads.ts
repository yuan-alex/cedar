import {
  convertToModelMessages,
  defaultSettingsMiddleware,
  extractReasoningMiddleware,
  smoothStream,
  stepCountIs,
  streamText,
  validateUIMessages,
  wrapLanguageModel,
} from "ai";
import type { AppEnv } from "@/server/types";
import {
  ChatMessageRole,
  ChatMessageStatus,
} from "@/server/utils/prisma-client";
import { config } from "@/server/utils/config";
import { MCPClientManager } from "@/server/utils/mcp";
import prisma from "@/server/utils/prisma";
import { getModels, registry } from "@/server/utils/providers";
import type { Context } from "hono";
import { generateTitle, getSystemMessage } from "@/server/utils/inference";

const mcpClientManager = new MCPClientManager();

export async function listThreads(c: Context<AppEnv>) {
  const user = c.get("user");
  if (!user) return c.body(null, 401);

  const take = c.req.query("take")
    ? Number.parseInt(c.req.query("take") as string)
    : undefined;
  const skip = Number.parseInt(c.req.query("skip") || "0");

  const threads = await prisma.thread.findMany({
    where: { userId: user.id, isDeleted: false },
    take,
    skip,
    orderBy: { lastMessagedAt: "desc" },
    select: { token: true, name: true, lastMessagedAt: true, createdAt: true },
  });

  return Response.json(threads);
}

export async function createThread(c: Context<AppEnv>) {
  const user = c.get("user");
  if (!user) return c.body(null, 401);

  const { model, prompt } = await c.req.json();
  if (!user.id || !prompt || !model) {
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
}

export async function getThread(c: Context<AppEnv>) {
  const user = c.get("user");
  if (!user) return c.body(null, 401);

  const thread = await prisma.thread.findUnique({
    where: { token: c.req.param("threadToken"), isDeleted: false },
    include: {
      messages: { select: { uiMessageParts: true }, orderBy: { id: "asc" } },
    },
  });

  if (!thread || thread.userId !== user.id) {
    return c.notFound();
  }

  return Response.json(thread);
}

export async function createMessage(c: Context<AppEnv>) {
  const user = c.get("user");
  if (!user) return c.body(null, 401);

  const threadToken = c.req.param("threadToken");
  const userInput = await c.req.json();
  const { model } = userInput;

  const thread = await prisma.thread.findUnique({
    where: { token: threadToken },
  });
  const models = getModels();
  if (
    !thread ||
    thread.userId !== user.id ||
    !models.some((m) => m.id === model)
  ) {
    return c.notFound();
  }

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

  const settingsMiddleware = defaultSettingsMiddleware({
    settings: {
      temperature: config.models.temperature,
      maxOutputTokens: config.models.max_tokens,
    },
  });

  const reasoningMiddleware = extractReasoningMiddleware({
    tagName: "think",
    separator: "\n",
  });

  const wrappedLanguageModel = wrapLanguageModel({
    model: registry.languageModel(model),
    middleware: [reasoningMiddleware, settingsMiddleware],
  });

  const previousMessages = thread.uiMessages;
  const tools = await mcpClientManager.getAllTools(userInput.mcpServers);

  const validatedMessages = await validateUIMessages({
    metadataSchema: undefined,
    dataSchemas: undefined,
    messages: [...previousMessages, userInput.newMessage],
    tools: Object.fromEntries(
      Object.entries(tools).map(([key, tool]) => [key, tool as any]),
    ),
  });

  const newMessage = await prisma.chatMessage.create({
    data: {
      role: ChatMessageRole.assistant,
      status: ChatMessageStatus.inProgress,
      uiMessageParts: [],
      threadId: thread.id,
      provider: model.split(":")[0],
      model: model.split(":")[1],
    },
  });

  const result = streamText({
    model: wrappedLanguageModel,
    system: getSystemMessage(),
    messages: convertToModelMessages(validatedMessages),
    tools,
    stopWhen: stepCountIs(10),
    experimental_transform: smoothStream({ chunking: "word" }),
    onFinish: (event) => {
      prisma.chatMessage.update({
        where: { id: newMessage.id },
        data: { rawEvent: event as any },
      });
    },
  });

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
}

export async function softDeleteThread(c: Context<AppEnv>) {
  const { threadToken } = c.req.param();
  const user = c.get("user");
  if (!user) return c.body(null, 401);

  const thread = await prisma.thread.findUnique({
    where: { token: threadToken, userId: user.id },
  });
  if (!thread) {
    return c.notFound();
  }

  const deleteMessages = prisma.chatMessage.updateMany({
    where: { threadId: thread.id },
    data: { isDeleted: true, uiMessageParts: [] },
  });
  const deleteThread = prisma.thread.update({
    where: { token: threadToken, userId: user.id },
    data: { isDeleted: true, uiMessages: [] },
  });

  await prisma.$transaction([deleteMessages, deleteThread]);

  return new Response("ok");
}
