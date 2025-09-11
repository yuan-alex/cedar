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

export function getModels() {
  let models = [];

  function hasRequiredEnvVars(requiredEnvVars: string[]): boolean {
    return requiredEnvVars.every((envVar) => process.env[envVar]);
  }

  for (let provider of Object.values(rawModelsData)) {
    if (!hasRequiredEnvVars(provider.env)) {
      continue;
    }

    const override = config.providers[provider.id];
    if (override?.enabled) {
      // @ts-ignore - TypeScript is overly strict about structural typing here
      provider = { ...provider, ...override };
    }

    for (const modelId of Object.keys(provider.models)) {
      // @ts-ignore - TypeScript infers overly strict literal types from JSON
      const model = provider.models[modelId];
      models.push({
        ...model,
        id: `${provider.id}:${modelId}`,
      });
    }
  }

  return models;
}
