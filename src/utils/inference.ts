import { createOpenRouter } from "@openrouter/ai-sdk-provider";

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
        id: "openai/chatgpt-4o-latest",
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
