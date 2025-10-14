import {
  BotIcon,
  BrainIcon,
  PaletteIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";
import type { ReactElement } from "react";
import qwenIcon from "../public/images/provider-icons/alibaba.svg";
import anthropicIcon from "../public/images/provider-icons/anthropic.svg";
import deepinfraIcon from "../public/images/provider-icons/deepinfra.svg";
import deepseekIcon from "../public/images/provider-icons/deepseek.svg";
import fireworksIcon from "../public/images/provider-icons/fireworks.svg";
import googleIcon from "../public/images/provider-icons/google.svg";
import llamaIcon from "../public/images/provider-icons/llama.svg";
import mistralIcon from "../public/images/provider-icons/mistral.svg";
import moonshotIcon from "../public/images/provider-icons/moonshotai.svg";
import openaiIcon from "../public/images/provider-icons/openai.svg";
import openrouterIcon from "../public/images/provider-icons/openrouter.svg";
import perplexityIcon from "../public/images/provider-icons/perplexity.svg";
import xaiIcon from "../public/images/provider-icons/xai.svg";
import zaiIcon from "../public/images/provider-icons/zai.svg";

// Centralized icon size configuration
const ICON_SIZE = "w-4 h-4";

// Helper function to create provider icon images
function createProviderIcon(src: string, alt: string) {
  return <img src={src} alt={alt} className={ICON_SIZE} />;
}

// Exact model ids that map to Lucide icons
const EXACT_MODEL_ICONS: Record<string, ReactElement> = {
  "cedar/auto": <BotIcon className={ICON_SIZE} />,
  "cedar/smart": <SparklesIcon className={ICON_SIZE} />,
  "cedar/creative": <PaletteIcon className={ICON_SIZE} />,
  "cedar/fast": <ZapIcon className={ICON_SIZE} />,
  "cedar/thinking-fast": <ZapIcon className={ICON_SIZE} />,
  "cedar/thinking": <BrainIcon className={ICON_SIZE} />,
};

// Provider pattern configuration for image-based icons
type ProviderIconConfig = { pattern: RegExp; src: string; alt: string };

const MODEL_ICON_CONFIGS: ProviderIconConfig[] = [
  { pattern: /cedar\/local/, src: openaiIcon, alt: "Local" },
  { pattern: /anthropic|claude/, src: anthropicIcon, alt: "Claude" },
  { pattern: /deepseek/, src: deepseekIcon, alt: "DeepSeek" },
  { pattern: /google|gemini|gemma/, src: googleIcon, alt: "Gemini" },
  { pattern: /x-ai|grok/, src: xaiIcon, alt: "Grok" },
  { pattern: /llama/, src: llamaIcon, alt: "Meta" },
  { pattern: /mistral/, src: mistralIcon, alt: "Mistral" },
  { pattern: /moonshotai|kimi/, src: moonshotIcon, alt: "Moonshot" },
  { pattern: /openai|gpt/, src: openaiIcon, alt: "OpenAI" },
  { pattern: /perplexity|sonar/, src: perplexityIcon, alt: "Perplexity" },
  { pattern: /qwen/, src: qwenIcon, alt: "Qwen" },
  { pattern: /z-ai|zai|glm/, src: zaiIcon, alt: "Z-AI" },
];

const PROVIDER_ICON_CONFIGS: ProviderIconConfig[] = [
  { pattern: /deepinfra/, src: deepinfraIcon, alt: "DeepInfra" },
  { pattern: /fireworks/, src: fireworksIcon, alt: "Fireworks" },
  { pattern: /openrouter/, src: openrouterIcon, alt: "OpenRouter" },
];

export function getModelIconById(modelId: string) {
  // First check for exact model id match (e.g., cedar/smart)
  const exact = EXACT_MODEL_ICONS[modelId];
  if (exact) return exact;

  // Then match by model-specific provider pattern
  const matchedModelProvider = MODEL_ICON_CONFIGS.find((cfg) =>
    cfg.pattern.test(modelId.toLowerCase()),
  );
  if (matchedModelProvider) {
    return createProviderIcon(
      matchedModelProvider.src,
      matchedModelProvider.alt,
    );
  }

  // Fallback: match against provider icon configs
  const matchedProvider = PROVIDER_ICON_CONFIGS.find((cfg) =>
    cfg.pattern.test(modelId.toLowerCase()),
  );
  if (matchedProvider) {
    return createProviderIcon(matchedProvider.src, matchedProvider.alt);
  }

  return null;
}
