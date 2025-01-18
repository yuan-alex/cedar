"use server";

import { auth } from "@clerk/nextjs/server";
import { generateText } from "ai";
import { redirect } from "next/navigation";

import { openrouter } from "@/utils/inference";
import { prisma } from "@/utils/prisma";

const THREAD_SYSTEM_PROMPT =
  "Based on the first user message of a thread, generate a concise, clear title that captures the main topic or essence of the discussion in less than 4 words. Do not respond with quotes. Do not provide any additional information.";
const DEFAULT_MODEL = "openai/gpt-4o-mini";

function generateTitle(threadId: number, prompt: string) {
  generateText({
    model: openrouter(
      process.env.AI_GATEWAY_TITLE_GENERATION_MODEL ||
        "google/gemini-flash-1.5-8b",
    ),
    messages: [
      {
        role: "system",
        content: THREAD_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: "what is the meaning of life",
      },
      {
        role: "assistant",
        content: "Meaning of Life",
      },
      {
        role: "user",
        content: "twin peaks",
      },
      {
        role: "assistant",
        content: "Twin Peaks Overview",
      },
      {
        role: "user",
        content: "how old is jarvis cocker of the band pulp?",
      },
      {
        role: "assistant",
        content: "Jarvis Cocker Age",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  }).then(async (response) => {
    await prisma.thread.update({
      where: {
        id: threadId,
      },
      data: {
        name: response.text,
      },
    });
  });
}

export async function createThreadForMessage(formData: FormData) {
  await auth.protect();
  const { userId } = await auth();

  const model = formData.get("model")?.toString();
  const message = formData.get("message")?.toString();

  if (!message) {
    return new Response("message not provided", { status: 400 });
  }

  const thread = await prisma.thread.create({
    data: {
      model: model || DEFAULT_MODEL,
      userId,
    },
  });

  generateTitle(thread.id, message);

  redirect(`/chat/${thread.token}`);
}
