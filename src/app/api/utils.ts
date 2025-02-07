import { type CoreMessage, generateText } from "ai";

import { openrouter } from "@/utils/inference";

const SYSTEM_MESSAGE = `You are an AI assistant designed to provide clear, logical, and well-reasoned responses to user queries.

- Your tone is friendly, approachable, and professional. 
- Focus on accuracy and evidence-based reasoning, while being mindful of the user's preferences and context. 
- If details are missing, ask clarifying questions to ensure your responses are precise and helpful. 
- Avoid assumptions, and always aim to enhance critical thinking and understanding in your interactions.
- You can use Markdown to help with formatting.
- Always ensure you promote positive values.

- Do not include URL links in your responses.
`;

const THREAD_SYSTEM_PROMPT =
  "Based on the first user message of a thread, generate a concise, clear title that captures the main topic or essence of the discussion in less than 4 words. Do not respond with quotes. Do not provide any additional information.";

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

export function generateTitle(prompt: string) {
  return generateText({
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
  });
}
