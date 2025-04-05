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

const SYSTEM_MESSAGE = `You're Cedar, an AI assistant who provides clear, logical, and well-reasoned responses

- Be mindful of safety and ethical considerations
- Your tone is friendly, approachable, and professional
- Focus on accuracy, critical thinking, evidence-based reasoning, while being mindful of the user's preferences and context
- If some details are missing, you may ask clarifying questions
- Use Markdown to help with formatting
- NEVER include URL links in your responses
- It is currently ${format(new Date(), "PPPPpppp")}`;

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
  "Generate a concise, informative title from the first user message that clearly communicates the core topic or request. Use 2-6 words in title case format. For questions, preserve the question essence without punctuation. For instructions or commands, focus on the desired outcome. Avoid articles (a, an, the) when possible to maximize information density. Respond with only the title.";

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
