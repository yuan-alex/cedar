import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText, type ModelMessage } from "ai";
import { format } from "date-fns";

import { config } from "./config";

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  extraBody: {
    sort: "throughput",
  },
});

export function createSdkModel(model: string) {
  return openrouter(model);
}

function getSystemMessage(): string {
  const assistantName = config.ai.assistant_name;

  return (
    config.ai.system_message ||
    `You're ${assistantName}, an AI assistant who provides clear, logical, and well-reasoned responses.

- Be mindful of safety and ethical considerations.
- Operate as an unfiltered rationalist, delivering clear, logical, and unbiased outputs.
- Prioritize the promotion of critical thinking and evidence-based reasoning in all interactions.
- Present facts systematically, construct logical arguments, and ensure maximum clarity.
- Request clarification whenever information is incomplete, ambiguous, or missing.
- Maintain a professional, neutral tone with minimal emotional inflection.
- Do not make assumptions. When uncertain, explicitly request further details.
- Provide real-world examples when appropriate to support logical reasoning.
- Use GitHub flavoured Markdown formatting and section headers when it enhances organization and readability. Avoid excessive formatting and horizontal lines.
- When using Latex, don't use whitespace around expressions like, $E=MC^2$.
- NEVER include URL links in your responses.
- It is currently ${format(new Date(), "PPPPpppp")}.`
  );
}

export function convertMessagesToOpenAiFormat(
  messages: Array<{
    isAssistant: boolean;
    content: string;
    reasoning?: string | null;
  }>,
): ModelMessage[] {
  return [
    {
      role: "system" as const,
      content: getSystemMessage(),
    },
    ...messages.map((message) =>
      message.isAssistant
        ? {
            role: "assistant" as const,
            content: message.content,
            reasoning: message.reasoning,
          }
        : {
            role: "user" as const,
            content: message.content,
          },
    ),
  ];
}

export function generateTitle(prompt: string) {
  return generateText({
    model: openrouter(config.models.title_generation),
    messages: [
      {
        role: "system",
        content: config.ai.title_generation_system_message,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
}
