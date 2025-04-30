import {
  Claude,
  DeepSeek,
  Gemini,
  Gemma,
  Grok,
  LmStudio,
  Meta,
  Microsoft,
  Mistral,
  OpenAI,
  Perplexity,
  Qwen,
} from "@lobehub/icons";
import { BrainIcon, PaletteIcon, SparklesIcon, ZapIcon } from "lucide-react";
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
  icon?: ReactElement;
}

export const simpleModels: IModel[] = [
  {
    id: "cedar/smart",
    icon: <SparklesIcon />,
    name: "Smart",
    description: "Best choice for everyday tasks",
  },
  {
    id: "cedar/creative",
    icon: <PaletteIcon />,
    name: "Creative",
    description: "Best choice for creative writing",
  },
  {
    id: "cedar/fast",
    icon: <ZapIcon />,
    name: "Fast",
    description: "Fast and best for basic tasks",
    fast: true,
  },
  {
    id: "cedar/reasoning",
    icon: <BrainIcon />,
    name: "Reasoning",
    description: "Smartest and best for STEM",
    reasoning: true,
  },
];

export const providers: IProvider[] = [
  {
    name: "OpenAI",
    icon: <OpenAI />,
    models: [
      {
        id: "openai/o4-mini",
        name: "o4 mini",
        reasoning: true,
      },
      {
        id: "openai/o4-mini-high",
        name: "o4 mini high",
        reasoning: true,
      },
      {
        id: "openai/gpt-4.1",
        name: "GPT-4.1",
      },
      {
        id: "openai/gpt-4.1-mini",
        name: "GPT-4.1 mini",
        fast: true,
      },
      {
        id: "openai/gpt-4.1-nano",
        name: "GPT-4.1 nano",
        fast: true,
      },
      {
        id: "openai/gpt-4o",
        name: "GPT-4o",
      },
    ],
  },
  {
    name: "Anthropic",
    icon: <Claude.Color />,
    models: [
      {
        id: "anthropic/claude-3.7-sonnet:thinking",
        name: "Claude 3.7 Sonnet Thinking",
        reasoning: true,
      },
      {
        id: "anthropic/claude-3.7-sonnet",
        name: "Claude 3.7 Sonnet",
      },
      {
        id: "anthropic/claude-3.5-sonnet",
        name: "Claude 3.5 Sonnet",
      },
      {
        id: "anthropic/claude-3.5-haiku",
        name: "Claude 3.5 Haiku",
        fast: true,
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
        id: "google/gemini-2.5-pro-exp-03-25:free",
        name: "Gemini 2.5 Pro Exp",
        devOnly: true,
      },
      {
        id: "google/gemini-2.5-flash-preview",
        name: "Gemini 2.5 Flash Preview",
        devOnly: true,
      },
      {
        id: "google/gemini-2.5-flash-preview:thinking",
        name: "Gemini 2.5 Flash Thinking",
        devOnly: true,
        reasoning: true,
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
        id: "google/gemini-flash-1.5-8b",
        name: "Gemini 1.5 Flash 8B",
        fast: true,
      },
    ],
  },
  {
    name: "Gemma",
    icon: <Gemma.Color />,
    models: [
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
        name: "DeepSeek R1 Llama 70B",
        reasoning: true,
      },
      {
        id: "deepseek/deepseek-r1-distill-qwen-32b",
        name: "DeepSeek R1 Qwen 32B",
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
        id: "qwen/qwen3-235b-a22b",
        name: "Qwen3 235B A22B",
        reasoning: true,
      },
      {
        id: "qwen/qwen3-30b-a3b",
        name: "Qwen3 30B A3B",
        reasoning: true,
        fast: true,
      },
      {
        id: "qwen/qwen3-32b",
        name: "Qwen3 32B",
        reasoning: true,
      },
      {
        id: "qwen/qwen3-14b",
        name: "Qwen3 14B",
        reasoning: true,
        fast: true,
      },
      {
        id: "qwen/qwen3-8b",
        name: "Qwen3 8B",
        reasoning: true,
        fast: true,
      },
      {
        id: "qwen/qwen3-4b:free",
        name: "Qwen3 4B",
        reasoning: true,
        fast: true,
        devOnly: true,
      },
      {
        id: "qwen/qwen3-1.7b:free",
        name: "Qwen3 1.7B",
        reasoning: true,
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
    name: "Grok",
    icon: <Grok />,
    models: [
      {
        id: "x-ai/grok-3-beta",
        name: "Grok 3 Beta",
      },
      {
        id: "x-ai/grok-3-mini-beta",
        name: "Grok 3 Mini Beta",
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
  {
    name: "LM Studio",
    icon: <LmStudio />,
    models: [
      {
        id: "cedar/lmstudio/qwen3-0.6b",
        name: "Qwen3 0.6B",
        devOnly: true,
        fast: true,
        reasoning: true,
      },
    ],
  },
];

export const models = [
  ...simpleModels.map(({ icon, ...rest }) => rest),
  ...providers.flatMap((provider) =>
    provider.models.map(({ icon, ...rest }) => rest),
  ),
];

export const modelIds = models.map((m) => m.id);

export function findModelById(id: string) {
  return (
    simpleModels.find((model) => model.id === id) ||
    providers
      .flatMap((provider) => provider.models)
      .find((model) => model.id === id) || { id: "unknown", name: "Unknown" }
  );
}
