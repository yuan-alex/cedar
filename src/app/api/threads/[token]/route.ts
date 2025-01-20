import { auth } from "@clerk/nextjs/server";
import { type CoreMessage, streamText } from "ai";
import { notFound } from "next/navigation";

import { openrouter } from "@/utils/inference";
import { prisma } from "@/utils/prisma";

const SYSTEM_MESSAGE = `You are an AI assistant designed to provide clear, logical, and well-reasoned responses to user queries.

- Your tone is friendly, approachable, and professional. 
- Focus on accuracy and evidence-based reasoning, while being mindful of the user's preferences and context. 
- If details are missing, ask clarifying questions to ensure your responses are precise and helpful. 
- Avoid assumptions, and always aim to enhance critical thinking and understanding in your interactions.
- You can use Markdown to help with formatting.
- Always ensure you promote positive values.

- Do not include URL links in your responses.
`;

async function getMessages(threadId: number): Promise<CoreMessage[]> {
  const messages = await prisma.chatMessage.findMany({
    where: {
      threadId: threadId,
    },
    orderBy: {
      id: "asc",
    },
  });

  return [
    {
      role: "system" as const,
      content: SYSTEM_MESSAGE,
    },
    ...messages.map((message) =>
      message.isAssistant
        ? {
            role: "assistant" as const,
            content: message.content,
          }
        : {
            role: "user" as const,
            content: message.content,
          },
    ),
  ];
}

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

  const result = streamText({
    model: openrouter(thread.model),
    messages: await getMessages(thread.id),
    onFinish: async ({ text }) => {
      await prisma.chatMessage.create({
        data: {
          threadId: thread.id,
          isAssistant: true,
          content: text,
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
