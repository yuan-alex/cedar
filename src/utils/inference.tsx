import {
  Claude,
  DeepSeek,
  Gemini,
  Meta,
  Microsoft,
  Mistral,
  OpenAI,
  OpenRouter,
  Perplexity,
  Qwen,
} from "@lobehub/icons";
import type { ReactElement } from "react";

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
    description: "Fastest and lightest model for basic tasks",
    fast: true,
  },
  {
    id: "cedar/reasoning",
    name: "Reasoning",
    description: "Smartest and best for math and science",
    reasoning: true,
  },
];

export const providers: IProvider[] = [
  {
    name: "OpenRouter",
    icon: <OpenRouter />,
    models: [
      {
        id: "openrouter/auto",
        name: "OpenRouter Auto",
      },
      {
        id: "openrouter/quasar-alpha",
        name: "Quasar Alpha",
        fast: true,
        devOnly: true,
      },
    ],
  },
  {
    name: "OpenAI",
    icon: <OpenAI />,
    models: [
      {
        id: "openai/o3-mini",
        name: "o3 mini",
        reasoning: true,
      },
      {
        id: "openai/o3-mini-high",
        name: "o3 mini high",
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
    icon: <Claude.Color />,
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
    icon: <Gemini.Color />,
    models: [
      {
        id: "google/gemini-2.5-pro-preview-03-25",
        name: "Gemini 2.5 Pro Preview",
      },
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
        id: "google/gemma-3-27b-it",
        name: "Gemma 3 27B",
        fast: true,
      },
      {
        id: "google/gemma-3-12b-it",
        name: "Gemma 3 12B",
        fast: true,
        devOnly: true,
      },
      {
        id: "google/gemini-flash-1.5-8b",
        name: "Gemini 1.5 Flash 8B",
        fast: true,
      },
      {
        id: "google/gemma-3-4b-it",
        name: "Gemma 3 4B",
        fast: true,
        devOnly: true,
      },
    ],
  },
  {
    name: "DeepSeek",
    icon: <DeepSeek.Color />,
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
        id: "deepseek/deepseek-chat-v3-0324",
        name: "DeepSeek V3",
      },
    ],
  },
  {
    name: "Meta",
    icon: <Meta.Color />,
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
    icon: <Qwen.Color />,
    models: [
      {
        id: "qwen/qwq-32b",
        name: "QwQ 32b",
        reasoning: true,
      },
      {
        id: "qwen/qwen-2.5-72b-instruct",
        name: "Qwen 2.5 72B",
      },
      {
        id: "qwen/qwen-2.5-coder-32b-instruct",
        name: "Qwen 2.5 Coder 32B",
      },
      {
        id: "qwen/qwen-2.5-7b-instruct",
        name: "Qwen 2.5 7B",
        fast: true,
        devOnly: true,
      },
    ],
  },
  {
    name: "Mistral AI",
    icon: <Mistral.Color />,
    models: [
      {
        id: "mistralai/mistral-small-3.1-24b-instruct-2503",
        name: "Mistral Small 3.1 24B",
        fast: true,
      },
      {
        id: "mistralai/mistral-nemo",
        name: "Mistral Nemo",
        fast: true,
      },
      {
        id: "mistralai/mixtral-8x22b-instruct",
        name: "Mixtral 8x22B",
        fast: true,
        devOnly: true,
      },
      {
        id: "mistralai/mixtral-8x7b-instruct",
        name: "Mixtral 8x7B",
        fast: true,
        devOnly: true,
      },
      {
        id: "mistralai/mistral-7b-instruct",
        name: "Mistral 7B",
        fast: true,
        devOnly: true,
      },
    ],
  },
  {
    name: "Microsoft",
    icon: <Microsoft.Color />,
    models: [
      {
        id: "microsoft/phi-4-multimodal-instruct",
        name: "Phi-4 Multimodal",
      },
      {
        id: "microsoft/phi-4",
        name: "Phi-4",
      },
    ],
  },
  {
    name: "Perplexity",
    icon: <Perplexity.Color />,
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

export const modelIds = [
  ...providers.flatMap((provider) => provider.models.map((model) => model.id)),
  ...simpleModels.map((m) => m.id),
];
