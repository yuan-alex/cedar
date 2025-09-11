import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createProviderRegistry } from "ai";
import { deepinfra } from "@ai-sdk/deepinfra";
import { fireworks } from "@ai-sdk/fireworks";

import { config } from "@/server/utils/config";

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
  provider?: string;
  description?: string;
  reasoning?: boolean;
  fast?: boolean;
}

export interface ICedarProvider {
  id: string;
  env: string[];
  name: string;
  models: Record<string, ICedarModel>;
}

export const simpleModels: ICedarModel[] = [
  {
    id: "cedar/auto",
    name: "Auto",
    description: "Auto-select the best model for the task",
  },
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
    id: "cedar/thinking-fast",
    name: "Thinking Fast",
    description: "Fast at thinking",
    reasoning: true,
    fast: true,
  },
  {
    id: "cedar/thinking",
    name: "Thinking",
    description: "Smartest and best for STEM",
    reasoning: true,
  },
];

export const recommendedProviders = [
  {
    name: "OpenAI",
    models: {
      "gpt-5": {
        id: "openai/gpt-5",
        name: "GPT-5",
        reasoning: true,
        providerId: "openai",
      },
      "gpt-5-mini": {
        id: "openai/gpt-5-mini",
        name: "GPT-5 Mini",
        reasoning: true,
        fast: true,
        providerId: "openai",
      },
      "gpt-5-nano": {
        id: "openai/gpt-5-nano",
        name: "GPT-5 Nano",
        reasoning: true,
        fast: true,
        providerId: "openai",
      },
      "gpt-oss-20b": {
        id: "openai/gpt-oss-20b",
        name: "GPT-OSS 20B",
        reasoning: true,
        providerId: "openai",
      },
      "gpt-oss-120b": {
        id: "openai/gpt-oss-120b",
        name: "GPT-OSS 120B",
        reasoning: true,
        providerId: "openai",
      },
    },
  },
  {
    name: "Anthropic",
    models: {
      "claude-opus-4.1": {
        id: "anthropic/claude-opus-4.1",
        name: "Claude Opus 4.1",
        providerId: "anthropic",
      },
      "claude-sonnet-4": {
        id: "anthropic/claude-sonnet-4",
        name: "Claude Sonnet 4",
        providerId: "anthropic",
      },
      "claude-3.5-haiku": {
        id: "anthropic/claude-3.5-haiku",
        name: "Claude 3.5 Haiku",
        providerId: "anthropic",
      },
    },
  },
  {
    name: "Google",
    models: {
      "gemini-2.5-pro": {
        id: "google/gemini-2.5-pro",
        name: "Gemini 2.5 Pro",
        providerId: "google",
      },
      "gemini-2.5-flash": {
        id: "google/gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        fast: true,
        providerId: "google",
      },
      "gemini-2.5-flash-lite": {
        id: "google/gemini-2.5-flash-lite",
        name: "Gemini 2.5 Flash Lite",
        fast: true,
        providerId: "google",
      },
    },
  },
  {
    name: "Gemma",
    models: {
      "gemma-3-27b-it": {
        id: "google/gemma-3-27b-it",
        name: "Gemma 3 27B",
        fast: true,
        providerId: "google",
      },
    },
  },
  {
    name: "DeepSeek",
    models: {
      "deepseek-r1-0528": {
        id: "deepseek/deepseek-r1-0528",
        name: "DeepSeek R1 0528",
        reasoning: true,
        providerId: "deepseek",
      },
      "deepseek-r1-0528-qwen3-8b": {
        id: "deepseek/deepseek-r1-0528-qwen3-8b",
        name: "DeepSeek R1 Qwen 8B",
        reasoning: true,
        providerId: "deepseek",
      },
      "deepseek-chat-v3.1": {
        id: "deepseek/deepseek-chat-v3.1",
        name: "DeepSeek Chat V3.1",
        providerId: "deepseek",
      },
    },
  },
  {
    name: "Moonshot AI",
    models: {
      "kimi-k2": {
        id: "moonshotai/kimi-k2",
        name: "Kimi K2",
        reasoning: true,
        providerId: "moonshotai",
      },
    },
  },
  {
    name: "Meta",
    models: {
      "llama-4-maverick": {
        id: "meta-llama/llama-4-maverick",
        name: "Llama 4 Maverick",
        providerId: "meta-llama",
      },
      "llama-4-scout": {
        id: "meta-llama/llama-4-scout",
        name: "Llama 4 Scout",
        fast: true,
        providerId: "meta-llama",
      },
      "llama-3.3-70b-instruct": {
        id: "meta-llama/llama-3.3-70b-instruct",
        name: "Llama 3.3 70B",
        providerId: "meta-llama",
      },
    },
  },
  {
    name: "Qwen by Alibaba",
    models: {
      "qwen3-235b-a22b-2507": {
        id: "qwen/qwen3-235b-a22b-2507",
        name: "Qwen3 235B A22B",
        providerId: "qwen",
      },
      "qwen3-235b-a22b-thinking-2507": {
        id: "qwen/qwen3-235b-a22b-thinking-2507",
        name: "Qwen3 235B A22B Thinking",
        reasoning: true,
        providerId: "qwen",
      },
      "qwen3-30b-a3b": {
        id: "qwen/qwen3-30b-a3b",
        name: "Qwen3 30B A3B",
        reasoning: true,
        fast: true,
        providerId: "qwen",
      },
      "qwen3-coder": {
        id: "qwen/qwen3-coder",
        name: "Qwen3 Coder",
        reasoning: true,
        providerId: "qwen",
      },
    },
  },
  {
    name: "Mistral AI",
    models: {
      "mistral-small-3.2-24b-instruct": {
        id: "mistralai/mistral-small-3.2-24b-instruct",
        name: "Mistral Small 3.2 24B",
        fast: true,
        providerId: "mistralai",
      },
      "magistral-small-2506": {
        id: "mistralai/magistral-small-2506",
        name: "Magistral Small 3.2 24B",
        fast: true,
        reasoning: true,
        providerId: "mistralai",
      },
    },
  },
  {
    name: "Grok",
    models: {
      "grok-4": {
        id: "x-ai/grok-4",
        name: "Grok 4",
        reasoning: true,
        providerId: "x-ai",
      },
      "grok-code-fast-1": {
        id: "x-ai/grok-code-fast-1",
        name: "Grok Code Fast 1",
        reasoning: true,
        fast: true,
        providerId: "x-ai",
      },
    },
  },
  {
    name: "Perplexity",
    models: {
      "r1-1776": {
        id: "perplexity/r1-1776",
        name: "Perplexity R1 1776",
        reasoning: true,
        providerId: "perplexity",
      },
      "sonar-reasoning-pro": {
        id: "perplexity/sonar-reasoning-pro",
        name: "Sonar Reasoning Pro",
        reasoning: true,
        providerId: "perplexity",
      },
      "sonar-reasoning": {
        id: "perplexity/sonar-reasoning",
        name: "Sonar Reasoning",
        reasoning: true,
        providerId: "perplexity",
      },
      "sonar-pro": {
        id: "perplexity/sonar-pro",
        name: "Sonar Pro",
        providerId: "perplexity",
      },
      sonar: {
        id: "perplexity/sonar",
        name: "Sonar",
        providerId: "perplexity",
      },
    },
  },
];

export function getModels() {
  let models = [];

  function hasRequiredEnvVars(requiredEnvVars: string[]): boolean {
    return requiredEnvVars.every((envVar) => process.env[envVar]);
  }

  for (let provider of Object.values(rawModelsData)) {
    if (!hasRequiredEnvVars(provider.env)) {
      console.warn(
        `Provider ${provider.name} is missing required environment variables: ${provider.env.join(", ")}`,
      );
      continue;
    }

    const override = config.providers[provider.id];
    if (override?.enabled) {
      provider = { ...provider, ...override };
    }

    for (const modelId of Object.keys(provider.models)) {
      const model = provider.models[modelId];
      models.push({
        ...model,
        id: `${provider.id}:${modelId}`,
      });
    }
  }

  return models;
}
