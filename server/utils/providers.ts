import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createProviderRegistry } from "ai";
import { deepinfra } from "@ai-sdk/deepinfra";
import { fireworks } from "@ai-sdk/fireworks";

import rawModelsData from "./models.json";

export const registry = createProviderRegistry({
  anthropic,
  openai,
  deepinfra,
  fireworks,
  openrouter: createOpenAICompatible({
    name: "OpenRouter",
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL:
      process.env.OPENROUTER_API_BASE_URL || "https://openrouter.ai/api/v1",
  }),
});

export interface IProvider {
  id: string;
  env: string[];
  npm: string;
  api: string;
  name: string;
  doc: string;
  models: Record<string, IModel>;
}

export interface IModel {
  id: string;
  name: string;
  attachment: boolean;
  reasoning: boolean;
  temperature: boolean;
  tool_call: boolean;
  knowledge: string;
  release_date: string;
  last_updated: string;
  modalities: {
    input: string[];
    output: string[];
  };
  open_weights: boolean;
  cost: {
    input: number;
    output: number;
    cache_read: number;
    cache_write: number;
  };
  limit: {
    context: number;
    output: number;
  };
}

export interface ICedarModel {
  id: string;
  name: string;
  providerId: string;
  provider?: string;
  description?: string;
  reasoning?: boolean;
  fast?: boolean;
}

export interface ICedarProvider {
  id: string;
  env: string[];
  name: string;
  models: ICedarModel[];
}

export const simpleModels: ICedarModel[] = [
  {
    id: "cedar/auto",
    name: "Auto",
    providerId: "cedar",
    description: "Auto-select the best model for the task",
  },
  {
    id: "cedar/smart",
    name: "Smart",
    providerId: "cedar",
    description: "Best choice for everyday tasks",
  },
  {
    id: "cedar/creative",
    name: "Creative",
    providerId: "cedar",
    description: "Best choice for creative writing",
  },
  {
    id: "cedar/fast",
    name: "Fast",
    providerId: "cedar",
    description: "Fast and best for basic tasks",
    fast: true,
  },
  {
    id: "cedar/thinking-fast",
    name: "Thinking Fast",
    providerId: "cedar",
    description: "Fast at thinking",
    reasoning: true,
    fast: true,
  },
  {
    id: "cedar/thinking",
    name: "Thinking",
    providerId: "cedar",
    description: "Smartest and best for STEM",
    reasoning: true,
  },
];

export const recommendedProviders = [
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
      {
        id: "x-ai/grok-code-fast-1",
        name: "Grok Code Fast 1",
        reasoning: true,
        fast: true,
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

export function getModels() {
  let models = [];

  function hasRequiredEnvVars(requiredEnvVars: string[]): boolean {
    return requiredEnvVars.every((envVar) => process.env[envVar]);
  }

  for (const provider of Object.values(rawModelsData)) {
    if (!hasRequiredEnvVars(provider.env)) {
      console.warn(
        `Provider ${provider.name} is missing required environment variables: ${provider.env.join(", ")}`,
      );
      continue;
    }
    for (const model of Object.values(provider.models)) {
      models.push({
        ...model,
        id: `${provider.id}:${model.id}`,
      });
    }
  }

  return models;
}
