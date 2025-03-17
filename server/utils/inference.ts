import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { type CoreMessage, generateText } from "ai";

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL,
  extraBody: {
    include_reasoning: true,
  },
});

const SYSTEM_MESSAGE = `You're Cedar, an AI assistant who provides clear, logical, and well-reasoned responses.

- Your tone is friendly, approachable, and professional.
- Focus on accuracy and evidence-based reasoning, while being mindful of the user's preferences and context.
- If details are missing, ask clarifying questions to ensure your responses are precise and helpful.
- Avoid assumptions, and always aim to enhance critical thinking and understanding in your interactions.
- Use Markdown to help with formatting.
- Always ensure you promote positive values.

- Do not include URL links in your responses.

It is currently ${new Date()}.
`;

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
  "Based on the first user message of a thread, generate a concise, clear title that captures the main topic or essence of the discussion in less than 4 words. Do not respond with quotes. Do not provide any additional information.";

export function generateTitle(prompt: string) {
  return generateText({
    model: openrouter(
      process.env.AI_GATEWAY_TITLE_GENERATION_MODEL ||
        "google/gemini-2.0-flash-lite-001",
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
  });
}
