import {
  BotIcon,
  BrainIcon,
  PaletteIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";
import type { ReactElement } from "react";

import claudeIconUrl from "@lobehub/icons-static-svg/icons/claude-color.svg";
import deepseekIcon from "@lobehub/icons-static-svg/icons/deepseek-color.svg";
import geminiIcon from "@lobehub/icons-static-svg/icons/gemini-color.svg";
import grokIcon from "@lobehub/icons-static-svg/icons/grok.svg";
import metaIcon from "@lobehub/icons-static-svg/icons/meta-color.svg";
import mistralIcon from "@lobehub/icons-static-svg/icons/mistral-color.svg";
import moonshotIcon from "@lobehub/icons-static-svg/icons/moonshot.svg";
import openaiIcon from "@lobehub/icons-static-svg/icons/openai.svg";
import openrouterIcon from "@lobehub/icons-static-svg/icons/openrouter.svg";
import perplexityIcon from "@lobehub/icons-static-svg/icons/perplexity-color.svg";
import qwenIcon from "@lobehub/icons-static-svg/icons/qwen-color.svg";
import zaiIcon from "@lobehub/icons-static-svg/icons/zai.svg";

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

const PROVIDER_ICON_CONFIGS: ProviderIconConfig[] = [
  { pattern: /anthropic/, src: claudeIconUrl, alt: "Claude" },
  { pattern: /openai/, src: openaiIcon, alt: "OpenAI" },
  { pattern: /google/, src: geminiIcon, alt: "Gemini" },
  { pattern: /llama/, src: metaIcon, alt: "Meta" },
  { pattern: /qwen/, src: qwenIcon, alt: "Qwen" },
  { pattern: /mistral/, src: mistralIcon, alt: "Mistral" },
  { pattern: /x-ai/, src: grokIcon, alt: "Grok" },
  { pattern: /perplexity/, src: perplexityIcon, alt: "Perplexity" },
  { pattern: /deepseek/, src: deepseekIcon, alt: "DeepSeek" },
  { pattern: /moonshotai/, src: moonshotIcon, alt: "Moonshot" },
  { pattern: /cedar\/local/, src: openaiIcon, alt: "Local" },
  { pattern: /openrouter/, src: openrouterIcon, alt: "OpenRouter" },
  { pattern: /z-ai|zai/, src: zaiIcon, alt: "Z-AI" },
];

export function getModelIconById(modelId: string) {
  // First check for exact model id match (e.g., cedar/smart)
  const exact = EXACT_MODEL_ICONS[modelId];
  if (exact) return exact;

  // Then match by provider pattern
  const matchedProvider = PROVIDER_ICON_CONFIGS.find((cfg) =>
    cfg.pattern.test(modelId.toLowerCase()),
  );
  if (matchedProvider) {
    return createProviderIcon(matchedProvider.src, matchedProvider.alt);
  }

  return null;
}
