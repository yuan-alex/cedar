import { auth } from "@clerk/nextjs/server";
import { streamText } from "ai";
import { notFound } from "next/navigation";

import { convertMessagesToOpenAiFormat } from "@/app/api/utils";
import { openrouter } from "@/utils/inference";
import { prisma } from "@/utils/prisma";

// Create new message in thread
export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  await auth.protect();
  const { userId } = await auth();

  const { token } = await params;
  const userInput = await req.json();

  const thread = await prisma.thread.findUnique({
    where: {
      token: token,
    },
  });

  if (!thread || thread.userId !== userId) {
    return notFound();
  }

  await prisma.chatMessage.create({
    data: {
      threadId: thread.id,
      isAssistant: false,
      content: userInput,
    },
  });

  const messages = await prisma.chatMessage.findMany({
    where: {
      threadId: thread.id,
    },
  });

  const result = streamText({
    model: openrouter(thread.model),
    messages: convertMessagesToOpenAiFormat(messages),
    onFinish: async ({ text, reasoning }) => {
      await prisma.chatMessage.create({
        data: {
          threadId: thread.id,
          isAssistant: true,
          content: text,
          reasoning,
        },
      });
    },
  });

  return result.toDataStreamResponse();
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

  const deleteMessages = prisma.chatMessage.deleteMany({
    where: { threadId: thread.id },
  });

  const deleteThread = prisma.thread.delete({
    where: { token, userId },
  });

  await prisma.$transaction([deleteMessages, deleteThread]);

  return new Response("ok");
}
