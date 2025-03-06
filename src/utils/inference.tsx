import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { type CoreMessage, generateText } from "ai";
import type { ReactElement } from "react";
import { RiMixtralFill } from "react-icons/ri";
import {
  SiAlibabacloud,
  SiClaude,
  SiGooglegemini,
  SiMeta,
  SiOpenai,
  SiPerplexity,
} from "react-icons/si";

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL,
  extraBody: {
    include_reasoning: true,
  },
});

export interface IProvider {
  name: string;
  models: IModel[];
  icon?: ReactElement;
}

export interface IModel {
  id: string;
  name: string;
  description?: string;
  reasoning?: boolean;
  fast?: boolean;
}

export const simpleModels: IModel[] = [
  {
    id: "google/gemini-2.0-flash-001",
    name: "Smart",
    description: "Best choice for everyday tasks",
  },
  {
    id: "google/gemini-2.0-flash-lite-001",
    name: "Fast",
    description: "Fastest and lightest model",
    fast: true,
  },
  {
    id: "deepseek/deepseek-r1-distill-llama-70b",
    name: "Reasoning",
    description: "Smartest and best for math and science",
    reasoning: true,
  },
];

export const providers: IProvider[] = [
  {
    name: "OpenRouter",
    models: [
      {
        id: "openrouter/auto",
        name: "OpenRouter Auto",
      },
    ],
  },
  {
    name: "OpenAI",
    icon: <SiOpenai />,
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
    icon: <SiClaude />,
    models: [
      {
        id: "anthropic/claude-3.7-sonnet",
        name: "Claude 3.7 Sonnet",
      },
      {
        id: "anthropic/claude-3.5-haiku",
        name: "Claude 3.5 Haiku",
      },
    ],
  },
  {
    name: "Google",
    icon: <SiGooglegemini />,
    models: [
      {
        id: "google/gemini-2.0-flash-001",
        name: "Gemini 2.0 Flash",
        fast: true,
      },
      {
        id: "google/gemini-2.0-flash-lite-001",
        name: "Gemini 2.0 Flash Lite",
        fast: true,
      },
      {
        id: "google/gemini-pro-1.5",
        name: "Gemini Pro 1.5",
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
        name: "DeepSeek R1 Distill Llama 70B",
        reasoning: true,
      },
      {
        id: "deepseek/deepseek-r1-distill-qwen-32b",
        name: "DeepSeek R1 Distill Qwen 32B",
        reasoning: true,
      },
      {
        id: "deepseek/deepseek-chat",
        name: "DeepSeek V3",
      },
    ],
  },
  {
    name: "Meta",
    icon: <SiMeta />,
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
    ],
  },
  {
    name: "Qwen by Alibaba",
    icon: <SiAlibabacloud />,
    models: [
      {
        id: "qwen/qwq-32b",
        name: "QwQ 32b",
      },
    ],
  },
  {
    name: "Mistral AI",
    icon: <RiMixtralFill />,
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
    name: "Microsoft",
    models: [
      {
        id: "microsoft/phi-4",
        name: "Phi-4",
      },
    ],
  },
  {
    name: "Perplexity",
    icon: <SiPerplexity />,
    models: [
      {
        id: "perplexity/r1-1776",
        name: "Perplexity R1 1776",
        reasoning: true,
      },
      {
        id: "perplexity/sonar-reasoning",
        name: "Sonar Reasoning",
        reasoning: true,
      },
      {
        id: "perplexity/sonar",
        name: "Sonar",
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
