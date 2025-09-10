import { zValidator } from "@hono/zod-validator";
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
import { Hono } from "hono";
import { z } from "zod";

import { auth } from "@/server/utils/auth";
import { config } from "@/server/utils/config";
import { generateTitle, mapModelName } from "@/server/utils/inference";
import { MCPClientManager } from "@/server/utils/mcp";
import prisma from "@/server/utils/prisma";
import {
  ChatMessageRole,
  ChatMessageStatus,
} from "@/server/utils/prisma-client";
import { getModels, registry, simpleModels } from "@/server/utils/providers";

const mcpClientManager = new MCPClientManager();

export const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.get("/api/v1/session", (c) => {
  const session = c.get("session");
  const user = c.get("user");

  if (!user) return c.body(null, 401);

  return c.json({
    session,
    user,
  });
});

app.get("/api/v1/health", async (c) => {
  return c.html("good");
});

const models = getModels();

app.get("/api/v1/models/simple", async (c) => {
  return c.json(simpleModels);
});

app.get("/api/v1/models", async (c) => {
  return c.json([...simpleModels, ...models]);
});

app.get("/api/v1/mcp/servers", async (c) => {
  return c.json(config.mcpServers);
});

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

// get threads
app.get("/api/v1/threads", async (c) => {
  const user = c.get("user");
  if (!user) return c.body(null, 401);

  const take = c.req.query("take")
    ? Number.parseInt(c.req.query("take") as string)
    : undefined;
  const skip = Number.parseInt(c.req.query("skip") || "0");

  const threads = await prisma.thread.findMany({
    where: {
      userId: user.id,
      isDeleted: false,
    },
    take,
    skip,
    orderBy: {
      lastMessagedAt: "desc",
    },
    select: {
      token: true,
      name: true,
      lastMessagedAt: true,
      createdAt: true,
    },
  });

  return Response.json(threads);
});

// create thread
app.post(
  "/api/v1/threads",
  zValidator(
    "json",
    z.object({
      model: z.string(),
      prompt: z.string(),
    }),
  ),
  async (c) => {
    const user = c.get("user");
    if (!user) return c.body(null, 401);

    const { model, prompt } = await c.req.json();

    if (!user.id || !prompt || !model) {
      return new Response("invalid parameters", { status: 400 });
    }

    const thread = await prisma.thread.create({
      data: {
        model: model,
        userId: user.id,
      },
    });

    generateTitle(prompt).then(async (response) => {
      await prisma.thread.update({
        where: {
          id: thread.id,
        },
        data: {
          name: response.text,
        },
      });
    });

    return Response.json(thread);
  },
);

// Get thread
app.get("/api/v1/threads/:threadToken", async (c) => {
  const user = c.get("user");
  if (!user) return c.body(null, 401);

  const thread = await prisma.thread.findUnique({
    where: {
      token: c.req.param("threadToken"),
      isDeleted: false,
    },
    include: {
      messages: {
        select: {
          uiMessageParts: true,
        },
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  if (!thread || thread.userId !== user.id) {
    return c.notFound();
  }

  return Response.json(thread);
});

// Create new message in thread
app.post(
  "/api/v1/threads/:threadToken",
  zValidator(
    "json",
    z.object({
      model: z.string(),
      newMessage: z.any(),
      mcpServers: z.array(z.string()),
    }),
  ),
  async (c) => {
    const user = c.get("user");
    if (!user) return c.body(null, 401);

    const threadToken = c.req.param("threadToken");
    const userInput = await c.req.json();

    let { model } = userInput;
    model = mapModelName(model);

    const thread = await prisma.thread.findUnique({
      where: {
        token: threadToken,
      },
    });

    if (
      !thread ||
      thread.userId !== user.id ||
      !models.some((m) => m.id === model)
    ) {
      return c.notFound();
    }

    await prisma.thread.update({
      where: {
        id: thread.id,
      },
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
      },
    });

    const result = streamText({
      model: wrappedLanguageModel,
      messages: convertToModelMessages(validatedMessages),
      tools,
      stopWhen: stepCountIs(10),
      experimental_transform: smoothStream({
        chunking: "word",
      }),
      onFinish: (event) => {
        prisma.chatMessage.update({
          where: { id: newMessage.id },
          data: {
            rawEvent: event as any,
          },
        });
      },
    });

    return result.toUIMessageStreamResponse({
      originalMessages: validatedMessages as any,
      generateMessageId: () => newMessage.token,
      onError: (error) => {
        prisma.chatMessage.update({
          where: { id: newMessage.id },
          data: {
            status: ChatMessageStatus.failed,
          },
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
            messages: {
              connect: {
                id: newMessage.id,
              },
            },
          },
        });
      },
    });
  },
);

// Delete thread
app.delete("/api/v1/threads/:threadToken", async (c) => {
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
});
