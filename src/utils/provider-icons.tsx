import {
  BotIcon,
  BrainIcon,
  PaletteIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";
import type { ReactElement } from "react";

const qwenIcon = "/images/provider-icons/alibaba.svg";
const anthropicIcon = "/images/provider-icons/anthropic.svg";
const deepinfraIcon = "/images/provider-icons/deepinfra.svg";
const deepseekIcon = "/images/provider-icons/deepseek.svg";
const fireworksIcon = "/images/provider-icons/fireworks.svg";
const googleIcon = "/images/provider-icons/google.svg";
const llamaIcon = "/images/provider-icons/llama.svg";
const mistralIcon = "/images/provider-icons/mistral.svg";
const moonshotIcon = "/images/provider-icons/moonshotai.svg";
const openaiIcon = "/images/provider-icons/openai.svg";
const openrouterIcon = "/images/provider-icons/openrouter.svg";
const perplexityIcon = "/images/provider-icons/perplexity.svg";
const xaiIcon = "/images/provider-icons/xai.svg";
const zaiIcon = "/images/provider-icons/zai.svg";

// Centralized icon size configuration
const ICON_SIZE = "w-4 h-4";

// Helper function to create provider icon images
function createProviderIcon(src: string, alt: string) {
  return <img src={src} alt={alt} className={`${ICON_SIZE} dark:invert`} />;
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
