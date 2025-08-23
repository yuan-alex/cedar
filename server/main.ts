import { zValidator } from "@hono/zod-validator";
import {
  defaultSettingsMiddleware,
  extractReasoningMiddleware,
  smoothStream,
  stepCountIs,
  streamText,
  wrapLanguageModel,
} from "ai";
import { Hono } from "hono";
import { z } from "zod";

import { auth } from "@/server/utils/auth";
import { config } from "@/server/utils/config";
import {
  convertMessagesToOpenAiFormat,
  createSdkModel,
  generateTitle,
} from "@/server/utils/inference";
import { MCPClientManager } from "@/server/utils/mcp";
import prisma from "@/server/utils/prisma";
import { modelIds, models } from "@/server/utils/providers";

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

app.get("/api/v1/models", async (c) => {
  return c.json(models);
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
        include: {
          runStep: true,
        },
        orderBy: {
          id: "asc",
        },
      },
      runs: {
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  if (!thread || thread?.userId !== user.id) {
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
      content: z.string(),
      mcpServers: z.array(z.string()),
    }),
  ),
  async (c) => {
    const user = c.get("user");
    if (!user) return c.body(null, 401);

    const threadToken = c.req.param("threadToken");
    const userInput = await c.req.json();

    let { model } = userInput;
    switch (model) {
      case "cedar/auto":
        model = "openrouter/auto";
        break;
      case "cedar/smart":
        model = "google/gemini-2.5-flash";
        break;
      case "cedar/creative":
        model = "moonshotai/kimi-k2";
        break;
      case "cedar/fast":
        model = "google/gemini-2.5-flash-lite";
        break;
      case "cedar/reasoning":
        model = "openai/gpt-oss-120b";
        break;
    }

    const thread = await prisma.thread.findUnique({
      where: {
        token: threadToken,
      },
    });

    if (!thread || thread.userId !== user.id || !modelIds.includes(model)) {
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
            isAssistant: false,
            content: userInput.content,
          },
        },
      },
    });

    const run = await prisma.run.create({
      data: {
        threadId: thread.id,
        status: "inProgress",
      },
    });

    const messages = await prisma.chatMessage.findMany({
      where: {
        threadId: thread.id,
      },
      orderBy: {
        id: "asc",
      },
    });

    const extractReasoning = extractReasoningMiddleware({
      tagName: "think",
      separator: "\n",
    });

    const settingsMiddleware = defaultSettingsMiddleware({
      settings: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    });

    const wrappedLanguageModel = wrapLanguageModel({
      model: createSdkModel(model),
      middleware: [settingsMiddleware, extractReasoning],
    });

    const result = streamText({
      model: wrappedLanguageModel,
      messages: convertMessagesToOpenAiFormat(messages),
      tools: await mcpClientManager.getAllTools(userInput.mcpServers),
      stopWhen: stepCountIs(10),
      experimental_transform: smoothStream({ chunking: "word" }),
      onStepFinish: async (event) => {
        if (!event) {
          return;
        }
        console.log(event);
      },
      onFinish: async (event) => {
        await prisma.run.update({
          where: {
            id: run.id,
          },
          data: {
            status: "completed",
            steps: {
              create: {
                message: {
                  create: {
                    threadId: thread.id,
                    isAssistant: true,
                    content: event.text,
                    reasoning: event.reasoningText,
                  },
                },
                type: "generation",
                generationProviderToken: event.response.id,
                generationModel: event.response.modelId,
              },
            },
          },
        });
      },
    });

    return result.toUIMessageStreamResponse();
  },
);

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
    data: { isDeleted: true, content: "" },
  });

  const deleteThread = prisma.thread.update({
    where: { token: threadToken, userId: user.id },
    data: { isDeleted: true },
  });

  await prisma.$transaction([deleteMessages, deleteThread]);

  return new Response("ok");
});
