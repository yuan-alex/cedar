import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { smoothStream, streamText } from "ai";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";

import {
  convertMessagesToOpenAiFormat,
  generateTitle,
  openrouter,
} from "./utils/inference";
import prisma from "./utils/prisma";

const app = new Hono();

app.use("/api/*", clerkMiddleware());

// get threads
app.get("/api/threads", async (c) => {
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
app.post("/api/threads", async (c) => {
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
});

// Get thread
app.get("/api/threads/:threadToken", async (c) => {
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
app.post("/api/threads/:threadToken", async (c) => {
  const auth = getAuth(c);
  const userId = auth?.userId;

  const threadToken = c.req.param("threadToken");
  const userInput = await c.req.json();

  let { model } = userInput;
  if (model === "cedar/auto") {
    model = "openrouter/auto";
  } else if (model === "cedar/smart") {
    model = "mistralai/mistral-small-24b-instruct-2501";
  } else if (model === "cedar/fast") {
    model = "google/gemini-2.0-flash-lite-001";
  } else if (model === "cedar/reasoning") {
    model = "deepseek/deepseek-r1-distill-llama-70b";
  }

  const thread = await prisma.thread.findUnique({
    where: {
      token: threadToken,
    },
  });

  if (!thread || thread.userId !== userId) {
    return c.notFound();
  }

  if (!userInput.content) {
    return new Response("invalid parameters", { status: 400 });
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

  const result = streamText({
    model: openrouter(model),
    maxTokens: 8192,
    messages: convertMessagesToOpenAiFormat(messages),
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
    experimental_transform: smoothStream(),
  });

  return result.toDataStreamResponse({
    sendReasoning: true,
  });
});

app.delete("/api/threads/:threadToken", async (c) => {
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

export default {
  port: process.env.PORT || 3001,
  fetch: app.fetch,
  idleTimeout: 30,
};
