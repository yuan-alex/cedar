import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { type CoreMessage, generateText } from "ai";

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL,
  extraBody: {
    include_reasoning: true,
  },
});

interface IProvider {
  name: string;
  models: IModel[];
}

interface IModel {
  id: string;
  name: string;
  reasoning?: boolean;
  fast?: boolean;
}

export const providers: IProvider[] = [
  {
    name: "OpenAI",
    models: [
      {
        id: "openai/o1",
        name: "o1",
        reasoning: true,
      },
      {
        id: "openai/o3-mini",
        name: "o3 mini",
        reasoning: true,
      },
      {
        id: "openai/gpt-4o",
        name: "GPT-4o",
      },
      {
        id: "openai/gpt-4o-mini",
        name: "GPT-4o mini",
        fast: true,
      },
    ],
  },
  {
    name: "Anthropic",
    models: [
      {
        id: "anthropic/claude-3.5-sonnet",
        name: "Claude 3.5 Sonnet",
      },
      {
        id: "anthropic/claude-3.5-haiku",
        name: "Claude 3.5 Haiku",
      },
    ],
  },
  {
    name: "Google",
    models: [
      {
        id: "google/gemini-2.0-flash-001",
        name: "Gemini 2.0 Flash",
        fast: true,
      },
      {
        id: "google/gemini-pro-1.5",
        name: "Gemini Pro 1.5",
      },
      {
        id: "google/gemini-flash-1.5",
        name: "Gemini Flash 1.5",
        fast: true,
      },
      {
        id: "google/gemini-flash-1.5-8b",
        name: "Gemini Flash 1.5 8B",
        fast: true,
      },
    ],
  },
  {
    name: "DeepSeek",
    models: [
      {
        id: "deepseek/deepseek-r1",
        name: "DeepSeek R1",
        reasoning: true,
      },
      {
        id: "deepseek/deepseek-r1-distill-llama-70b",
        name: "R1 Distill Llama 70B",
        reasoning: true,
      },
      {
        id: "deepseek/deepseek-r1-distill-qwen-32b",
        name: "R1 Distill Qwen 32B",
        reasoning: true,
      },
      {
        id: "deepseek/deepseek-r1-distill-qwen-1.5b",
        name: "R1 Distill Qwen 1.5B",
        reasoning: true,
        fast: true,
      },
      {
        id: "deepseek/deepseek-chat",
        name: "DeepSeek V3",
      },
    ],
  },
  {
    name: "Meta",
    models: [
      {
        id: "meta-llama/llama-3.3-70b-instruct",
        name: "Llama 3.3 70B",
      },
      {
        id: "meta-llama/llama-3.1-8b-instruct",
        name: "Llama 3.1 8B",
        fast: true,
      },
      {
        id: "meta-llama/llama-3.2-3b-instruct",
        name: "Llama 3.2 3B",
        fast: true,
      },
    ],
  },
  {
    name: "Mistral AI",
    models: [
      {
        id: "mistralai/mistral-small-24b-instruct-2501",
        name: "Mistral Small 3",
      },
      {
        id: "mistralai/mistral-nemo",
        name: "Mistral Nemo",
        fast: true,
      },
    ],
  },
  {
    name: "xAI",
    models: [
      {
        id: "x-ai/grok-2-1212",
        name: "Grok 2",
      },
      {
        id: "x-ai/grok-beta",
        name: "Grok Beta",
      },
    ],
  },
  {
    name: "Microsoft",
    models: [
      {
        id: "microsoft/phi-4",
        name: "Phi 4",
        fast: true,
      },
    ],
  },
];

export const modelIds = providers.flatMap((provider) =>
  provider.models.map((model) => model.id),
);

const SYSTEM_MESSAGE = `You are an AI assistant designed to provide clear, logical, and well-reasoned responses to user queries.

- Your tone is friendly, approachable, and professional. 
- Focus on accuracy and evidence-based reasoning, while being mindful of the user's preferences and context. 
- If details are missing, ask clarifying questions to ensure your responses are precise and helpful. 
- Avoid assumptions, and always aim to enhance critical thinking and understanding in your interactions.
- You can use Markdown to help with formatting.
- Always ensure you promote positive values.

- Do not include URL links in your responses.
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
