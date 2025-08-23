export interface IProvider {
  name: string;
  models: IModel[];
}

export interface IModel {
  id: string;
  name: string;
  description?: string;
  reasoning?: boolean;
  fast?: boolean;
  devOnly?: boolean;
}

export const simpleModels: IModel[] = [
  {
    id: "cedar/smart",
    name: "Smart",
    description: "Best choice for everyday tasks",
  },
  {
    id: "cedar/creative",
    name: "Creative",
    description: "Best choice for creative writing",
  },
  {
    id: "cedar/fast",
    name: "Fast",
    description: "Fast and best for basic tasks",
    fast: true,
  },
  {
    id: "cedar/reasoning",
    name: "Reasoning",
    description: "Smartest and best for STEM",
    reasoning: true,
  },
];

export const providers: IProvider[] = [
  {
    name: "OpenAI",
    models: [
      {
        id: "openai/gpt-5",
        name: "GPT-5",
        reasoning: true,
      },
      {
        id: "openai/gpt-5-mini",
        name: "GPT-5 Mini",
        reasoning: true,
        fast: true,
      },
      {
        id: "openai/gpt-5-nano",
        name: "GPT-5 Nano",
        reasoning: true,
        fast: true,
      },
      {
        id: "openai/gpt-oss-20b",
        name: "GPT-OSS 20B",
        reasoning: true,
      },
      {
        id: "openai/gpt-oss-120b",
        name: "GPT-OSS 120B",
        reasoning: true,
      },
    ],
  },
  {
    name: "Anthropic",
    models: [
      {
        id: "anthropic/claude-opus-4.1",
        name: "Claude Opus 4.1",
      },
      {
        id: "anthropic/claude-sonnet-4",
        name: "Claude Sonnet 4",
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
        id: "google/gemini-2.5-pro",
        name: "Gemini 2.5 Pro",
      },
      {
        id: "google/gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        fast: true,
      },
      {
        id: "google/gemini-2.5-flash-lite",
        name: "Gemini 2.5 Flash Lite",
        fast: true,
      },
    ],
  },
  {
    name: "Gemma",
    models: [
      {
        id: "google/gemma-3-27b-it",
        name: "Gemma 3 27B",
        fast: true,
      },
    ],
  },
  {
    name: "DeepSeek",
    models: [
      {
        id: "deepseek/deepseek-r1-0528",
        name: "DeepSeek R1 0528",
        reasoning: true,
      },
      {
        id: "deepseek/deepseek-r1-0528-qwen3-8b",
        name: "DeepSeek R1 Qwen 8B",
        reasoning: true,
      },
      {
        id: "deepseek/deepseek-chat-v3.1",
        name: "DeepSeek Chat V3.1",
      },
    ],
  },
  {
    name: "Moonshot AI",
    models: [
      {
        id: "moonshotai/kimi-k2",
        name: "Kimi K2",
        reasoning: true,
      },
    ],
  },
  {
    name: "Meta",
    models: [
      {
        id: "meta-llama/llama-4-maverick",
        name: "Llama 4 Maverick",
      },
      {
        id: "meta-llama/llama-4-scout",
        name: "Llama 4 Scout",
        fast: true,
      },
      {
        id: "meta-llama/llama-3.3-70b-instruct",
        name: "Llama 3.3 70B",
      },
    ],
  },
  {
    name: "Qwen by Alibaba",
    models: [
      {
        id: "qwen/qwen3-235b-a22b-2507",
        name: "Qwen3 235B A22B",
      },
      {
        id: "qwen/qwen3-235b-a22b-thinking-2507",
        name: "Qwen3 235B A22B Thinking",
        reasoning: true,
      },
      {
        id: "qwen/qwen3-30b-a3b",
        name: "Qwen3 30B A3B",
        reasoning: true,
        fast: true,
      },
      {
        id: "qwen/qwen3-coder",
        name: "Qwen3 Coder",
        reasoning: true,
      },
    ],
  },
  {
    name: "Mistral AI",
    models: [
      {
        id: "mistralai/mistral-small-3.2-24b-instruct",
        name: "Mistral Small 3.2 24B",
        fast: true,
      },
      {
        id: "mistralai/magistral-small-2506",
        name: "Magistral Small 3.2 24B",
        fast: true,
        reasoning: true,
      },
    ],
  },
  {
    name: "Grok",
    models: [
      {
        id: "x-ai/grok-4",
        name: "Grok 4",
        reasoning: true,
      },
    ],
  },
  {
    name: "Perplexity",
    models: [
      {
        id: "perplexity/r1-1776",
        name: "Perplexity R1 1776",
        reasoning: true,
      },
      {
        id: "perplexity/sonar-reasoning-pro",
        name: "Sonar Reasoning Pro",
        reasoning: true,
      },
      {
        id: "perplexity/sonar-reasoning",
        name: "Sonar Reasoning",
        reasoning: true,
      },
      {
        id: "perplexity/sonar-pro",
        name: "Sonar Pro",
      },
      {
        id: "perplexity/sonar",
        name: "Sonar",
      },
    ],
  },
];

export const models = [
  ...simpleModels,
  ...providers.flatMap((provider) =>
    provider.models.map((model) => ({
      ...model,
      provider: provider.name,
    })),
  ),
].filter((m) => (process.env.NODE_ENV === "production" ? !m.devOnly : true));

export const modelIds = models.map((m) => m.id);

export function findModelById(id: string) {
  return (
    simpleModels.find((model) => model.id === id) ||
    providers
      .flatMap((provider) => provider.models)
      .find((model) => model.id === id) || { id: "unknown", name: "Unknown" }
  );
}
