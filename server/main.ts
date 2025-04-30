import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import {
  defaultSettingsMiddleware,
  extractReasoningMiddleware,
  smoothStream,
  streamText,
  wrapLanguageModel,
} from "ai";
import { serve } from "bun";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { z } from "zod";

import {
  convertMessagesToOpenAiFormat,
  createSdkModel,
  generateTitle,
} from "@/server/utils/inference";
import prisma from "@/server/utils/prisma";

const app = new Hono();

app.use("/api/*", clerkMiddleware());

app.get("/api/v1/health", async (c) => {
  return c.html("good");
});

// get threads
app.get("/api/v1/threads", async (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.notFound();
  }

  const take = c.req.query("take")
    ? Number.parseInt(c.req.query("take") as string)
    : undefined;
  const skip = Number.parseInt(c.req.query("skip") || "0");

  const threads = await prisma.thread.findMany({
    where: {
      userId: auth?.userId,
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
    const auth = getAuth(c);
    const userId = auth?.userId;

    const { model, prompt } = await c.req.json();

    if (!userId || !prompt || !model) {
      return new Response("invalid parameters", { status: 400 });
    }

    const thread = await prisma.thread.create({
      data: {
        model: model,
        userId,
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
    }),
  ),
  async (c) => {
    const auth = getAuth(c);
    const userId = auth?.userId;

    const threadToken = c.req.param("threadToken");
    const userInput = await c.req.json();

    let { model } = userInput;
    switch (model) {
      case "cedar/auto":
        model = "openrouter/auto";
        break;
      case "cedar/smart":
        model = "mistralai/mistral-small-3.1-24b-instruct";
        break;
      case "cedar/creative":
        model = "google/gemma-3-27b-it";
        break;
      case "cedar/fast":
        model = "google/gemini-2.0-flash-lite-001";
        break;
      case "cedar/reasoning":
        model = "deepseek/deepseek-r1-distill-llama-70b";
        break;
    }

    const thread = await prisma.thread.findUnique({
      where: {
        token: threadToken,
      },
    });

    if (!thread || thread.userId !== userId) {
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
        maxTokens: 2048,
      },
    });

    const wrappedLanguageModel = wrapLanguageModel({
      model: createSdkModel(model),
      middleware: [settingsMiddleware, extractReasoning],
    });

    const result = streamText({
      model: wrappedLanguageModel,
      messages: convertMessagesToOpenAiFormat(messages),
      experimental_transform: smoothStream({ chunking: "word" }),
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
                    reasoning: event.reasoning,
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

    return result.toDataStreamResponse({
      sendReasoning: true,
    });
  },
);

app.delete("/api/v1/threads/:threadToken", async (c) => {
  const { threadToken } = c.req.param();
  const auth = getAuth(c);
  const userId = auth?.userId;

  if (!userId) {
    return c.notFound();
  }

  const thread = await prisma.thread.findUnique({
    where: { token: threadToken, userId },
  });

  if (!thread) {
    return c.notFound();
  }

  const deleteMessages = prisma.chatMessage.updateMany({
    where: { threadId: thread.id },
    data: { isDeleted: true, content: "" },
  });

  const deleteThread = prisma.thread.update({
    where: { token: threadToken, userId },
    data: { isDeleted: true },
  });

  await prisma.$transaction([deleteMessages, deleteThread]);

  return new Response("ok");
});

if (process.env.NODE_ENV === "production") {
  app.get("/*", serveStatic({ root: "./dist/client" }));
}

const server = serve({
  fetch: app.fetch,
  port: Number.parseInt(process.env.PORT || "3001"),
});

console.log(`Listening on ${server.url}`);
