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
    return <img src={claudeIconUrl} alt="Claude" className="w-4 h-4" />;
  }
  if (modelId.startsWith("openai")) {
    return <img src={openaiIcon} alt="OpenAI" className="w-4 h-4" />;
  }
  if (modelId.startsWith("google/gemini")) {
    return <img src={geminiIcon} alt="Gemini" className="w-4 h-4" />;
  }
  if (modelId.startsWith("google/gemma")) {
    return <img src={gemmaIcon} alt="Gemma" className="w-4 h-4" />;
  }
  if (modelId.startsWith("meta-llama")) {
    return <img src={metaIcon} alt="Meta" className="w-4 h-4" />;
  }
  if (modelId.startsWith("qwen")) {
    return <img src={qwenIcon} alt="Qwen" className="w-4 h-4" />;
  }
  if (modelId.startsWith("mistral")) {
    return <img src={mistralIcon} alt="Mistral" className="w-4 h-4" />;
  }
  if (modelId.startsWith("x-ai")) {
    return <img src={grokIcon} alt="Grok" className="w-4 h-4" />;
  }
  if (modelId.startsWith("perplexity")) {
    return <img src={perplexityIcon} alt="Perplexity" className="w-4 h-4" />;
  }
  if (modelId.startsWith("deepseek")) {
    return <img src={deepseekIcon} alt="DeepSeek" className="w-4 h-4" />;
  }
  if (modelId.startsWith("moonshotai")) {
    return <img src={moonshotIcon} alt="Moonshot" className="w-4 h-4" />;
  }
  if (modelId.startsWith("cedar/local")) {
    return <img src={openaiIcon} alt="Local" className="w-4 h-4" />;
  }

  return null;
}
