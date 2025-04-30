import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { type CoreMessage, generateText } from "ai";
import { format } from "date-fns";

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL,
  extraBody: {
    sort: "throughput",
  },
});

export function createSdkModel(model: string) {
  if (process.env.NODE_ENV === "development") {
    if (model.startsWith("cedar/lmstudio/")) {
      const lmstudio = createOpenAICompatible({
        name: "lmstudio",
        baseURL: "http://localhost:1234/v1",
      });
      return lmstudio(model.slice("cedar/lmstudio/".length));
    }
  }
  return openrouter(model);
}

const SYSTEM_MESSAGE = `You're Cedar, an AI assistant who provides clear, logical, and well-reasoned responses.

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
- It is currently ${format(new Date(), "PPPPpppp")}.`;

export function convertMessagesToOpenAiFormat(messages): CoreMessage[] {
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
            reasoning: message.reasoning,
          }
        : {
            role: "user" as const,
            content: message.content,
          },
    ),
  ];
}

const THREAD_SYSTEM_PROMPT =
  "Generate a concise, informative title from the first user message that clearly communicates the core topic or request. Use ~3 words in title case format. For questions, preserve the question essence without punctuation. For instructions or commands, focus on the desired outcome. Avoid articles (a, an, the) when possible to maximize information density. Respond with only the title.";

export function generateTitle(prompt: string) {
  return generateText({
    model: openrouter(
      process.env.AI_GATEWAY_TITLE_GENERATION_MODEL || "google/gemma-3-27b-it",
    ),
    messages: [
      {
        role: "system",
        content: THREAD_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
}
