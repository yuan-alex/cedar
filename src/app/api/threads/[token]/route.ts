import { auth } from "@clerk/nextjs/server";
import { smoothStream, streamText } from "ai";
import { notFound } from "next/navigation";

import {
  convertMessagesToOpenAiFormat,
  modelIds,
  openrouter,
} from "@/utils/inference";
import prisma from "@/utils/prisma";

// Create new message in thread
export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  await auth.protect();
  const { userId } = await auth();

  const { token } = await params;
  const userInput = await req.json();

  let { model } = userInput;
  if (model === "cedar/smart") {
    model = "meta-llama/llama-3.3-70b-instruct";
  } else if (model === "cedar/fast") {
    model = "google/gemini-2.0-flash-lite-001";
  } else if (model === "cedar/reasoning") {
    model = "deepseek/deepseek-r1-distill-llama-70b";
  }

  const thread = await prisma.thread.findUnique({
    where: {
      token: token,
    },
  });

  if (!thread || thread.userId !== userId) {
    return notFound();
  }

  if (!userInput.content || !modelIds.includes(model)) {
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
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const { userId } = await auth();

  const thread = await prisma.thread.findUnique({
    where: { token, userId },
  });

  if (!thread) {
    return new Response("not found", { status: 404 });
  }

  const deleteMessages = prisma.chatMessage.updateMany({
    where: { threadId: thread.id },
    data: { isDeleted: true, content: "" },
  });

  const deleteThread = prisma.thread.update({
    where: { token, userId },
    data: { isDeleted: true },
  });

  await prisma.$transaction([deleteMessages, deleteThread]);

  return new Response("ok");
}
