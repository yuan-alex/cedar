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

export function getModelIconById(modelId: string) {
  if (modelId === "cedar/smart") {
    return <SparklesIcon />;
  }
  if (modelId === "cedar/creative") {
    return <PaletteIcon />;
  }
  if (modelId === "cedar/fast") {
    return <ZapIcon />;
  }
  if (modelId === "cedar/reasoning") {
    return <BrainIcon />;
  }

  if (modelId.startsWith("anthropic")) {
    return <Claude.Color />;
  }
  if (modelId.startsWith("openai")) {
    return <OpenAI />;
  }
  if (modelId.startsWith("google/gemini")) {
    return <Gemini.Color />;
  }
  if (modelId.startsWith("google/gemma")) {
    return <Gemma.Color />;
  }
  if (modelId.startsWith("meta-llama")) {
    return <Meta.Color />;
  }
  if (modelId.startsWith("qwen")) {
    return <Qwen.Color />;
  }
  if (modelId.startsWith("mistral")) {
    return <Mistral.Color />;
  }
  if (modelId.startsWith("x-ai")) {
    return <Grok />;
  }
  if (modelId.startsWith("microsoft")) {
    return <Microsoft.Color />;
  }
  if (modelId.startsWith("perplexity")) {
    return <Perplexity.Color />;
  }
  if (modelId.startsWith("deepseek")) {
    return <DeepSeek.Color />;
  }
  if (modelId.startsWith("cedar/local")) {
    return <LmStudio />;
  }

  return null;
}
