"use server";

import { auth } from "@clerk/nextjs/server";

import { modelIds } from "@/utils/inference";
import { prisma } from "@/utils/prisma";
import { generateTitle } from "../utils";

export async function GET() {
  await auth.protect();
  const { userId } = await auth();

  const threads = await prisma.thread.findMany({
    where: {
      userId,
    },
    orderBy: {
      lastMessagedAt: "desc",
    },
  });

  return Response.json(threads);
}

export async function POST(request: Request) {
  await auth.protect();
  const { userId } = await auth();

  const data = await request.json();
  const { model, prompt } = data;

  if (!userId || !prompt || !model || !modelIds.includes(model)) {
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
}
