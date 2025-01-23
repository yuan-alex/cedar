"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { prisma } from "@/utils/prisma";
import { generateTitle } from "../utils";

const DEFAULT_MODEL = "openai/gpt-4o-mini";

export async function GET() {
  await auth.protect();
  const { userId } = await auth();

  const threads = await prisma.thread.findMany({
    where: {
      userId,
    },
    orderBy: {
      id: "desc",
    },
  });

  return Response.json(threads);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const message = formData.get("message")?.toString();
  const model = formData.get("model")?.toString();

  await auth.protect();
  const { userId } = await auth();

  if (!userId || !message || !model) {
    return new Response("invalid parameters", { status: 400 });
  }

  const thread = await prisma.thread.create({
    data: {
      model: model || DEFAULT_MODEL,
      userId,
      messages: {
        create: {
          content: message,
          isAssistant: false,
        },
      },
    },
  });

  generateTitle(thread.id, message).then(async (response) => {
    await prisma.thread.update({
      where: {
        id: thread.id,
      },
      data: {
        name: response.text,
      },
    });
  });

  redirect(`/chat/${thread.token}`);
}
