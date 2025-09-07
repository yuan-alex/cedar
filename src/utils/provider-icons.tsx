import claudeIconUrl from "@lobehub/icons-static-svg/icons/claude-color.svg";
import deepseekIcon from "@lobehub/icons-static-svg/icons/deepseek-color.svg";
import geminiIcon from "@lobehub/icons-static-svg/icons/gemini-color.svg";
import gemmaIcon from "@lobehub/icons-static-svg/icons/gemma-color.svg";
import grokIcon from "@lobehub/icons-static-svg/icons/grok.svg";
import metaIcon from "@lobehub/icons-static-svg/icons/meta-color.svg";
import mistralIcon from "@lobehub/icons-static-svg/icons/mistral-color.svg";
import moonshotIcon from "@lobehub/icons-static-svg/icons/moonshot.svg";
import openaiIcon from "@lobehub/icons-static-svg/icons/openai.svg";
import perplexityIcon from "@lobehub/icons-static-svg/icons/perplexity-color.svg";
import qwenIcon from "@lobehub/icons-static-svg/icons/qwen-color.svg";
import { BrainIcon, PaletteIcon, SparklesIcon, ZapIcon } from "lucide-react";
import type { ReactElement } from "react";

// Centralized icon size configuration
const ICON_SIZE = "w-4 h-4";

// Helper function to create provider icon images
function createProviderIcon(src: string, alt: string) {
  return <img src={src} alt={alt} className={ICON_SIZE} />;
}

// Exact model ids that map to Lucide icons
const EXACT_MODEL_ICONS: Record<string, ReactElement> = {
  "cedar/smart": <SparklesIcon className={ICON_SIZE} />,
  "cedar/creative": <PaletteIcon className={ICON_SIZE} />,
  "cedar/fast": <ZapIcon className={ICON_SIZE} />,
  "cedar/thinking-fast": <ZapIcon className={ICON_SIZE} />,
  "cedar/thinking": <BrainIcon className={ICON_SIZE} />,
};

// Provider prefix configuration for image-based icons
type ProviderIconConfig = { prefix: string; src: string; alt: string };

const PROVIDER_PREFIX_ICONS: ProviderIconConfig[] = [
  { prefix: "anthropic", src: claudeIconUrl, alt: "Claude" },
  { prefix: "openai", src: openaiIcon, alt: "OpenAI" },
  { prefix: "google/gemini", src: geminiIcon, alt: "Gemini" },
  { prefix: "google/gemma", src: gemmaIcon, alt: "Gemma" },
  { prefix: "meta-llama", src: metaIcon, alt: "Meta" },
  { prefix: "qwen", src: qwenIcon, alt: "Qwen" },
  { prefix: "mistral", src: mistralIcon, alt: "Mistral" },
  { prefix: "x-ai", src: grokIcon, alt: "Grok" },
  { prefix: "perplexity", src: perplexityIcon, alt: "Perplexity" },
  { prefix: "deepseek", src: deepseekIcon, alt: "DeepSeek" },
  { prefix: "moonshotai", src: moonshotIcon, alt: "Moonshot" },
  { prefix: "cedar/local", src: openaiIcon, alt: "Local" },
];

export function getModelIconById(modelId: string) {
  // First check for exact model id match (e.g., cedar/smart)
  const exact = EXACT_MODEL_ICONS[modelId];
  if (exact) return exact;

  // Then match by provider prefix
  const matchedProvider = PROVIDER_PREFIX_ICONS.find((cfg) =>
    modelId.startsWith(cfg.prefix),
  );
  if (matchedProvider) {
    return createProviderIcon(matchedProvider.src, matchedProvider.alt);
  }

  return null;
}
