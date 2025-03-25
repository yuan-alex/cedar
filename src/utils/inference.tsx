import {
  Alibaba,
  Claude,
  Cohere,
  DeepSeek,
  Gemini,
  Meta,
  Microsoft,
  Mistral,
  OpenAI,
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
}

export const simpleModels: IModel[] = [
  {
    id: "cedar/auto",
    name: "Auto",
    description: "Automatically pick the best model",
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
    models: [
      {
        id: "openrouter/auto",
        name: "OpenRouter Auto",
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
        id: "google/gemini-2.0-flash-001",
        name: "Gemini 2.0 Flash",
        fast: true,
      },
      {
        id: "google/gemma-3-27b-it",
        name: "Gemma 3",
        fast: true,
      },
      {
        id: "google/gemini-2.0-flash-lite-001",
        name: "Gemini 2.0 Flash Lite",
        fast: true,
      },
      {
        id: "google/gemini-flash-1.5-8b",
        name: "Gemini 1.5 Flash 8B",
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
        id: "deepseek/deepseek-chat",
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
  {
    name: "Cohere",
    icon: <Cohere.Color />,
    models: [
      {
        id: "cohere/command-r-plus-08-2024",
        name: "Command R+",
      },
      {
        id: "cohere/command-r-08-2024",
        name: "Command R",
      },
      {
        id: "cohere/command-r7b-12-2024",
        name: "Command R 7B",
        fast: true,
      },
    ],
  },
];

export const modelIds = [
  ...providers.flatMap((provider) => provider.models.map((model) => model.id)),
  ...simpleModels.map((m) => m.id),
];
