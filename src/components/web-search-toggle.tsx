import { useStore } from "@nanostores/react";
import { Search } from "lucide-react";

import { PromptInputButton } from "@/components/ai-elements/prompt-input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { $webSearchEnabled } from "@/utils/stores";

export function WebSearchToggle() {
  const enabledStr = useStore($webSearchEnabled);
  const enabled = enabledStr === "true";

  const toggleWebSearch = () => {
    $webSearchEnabled.set(enabled ? "false" : "true");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <PromptInputButton
          onClick={toggleWebSearch}
          variant={enabled ? "default" : "ghost"}
          aria-label={enabled ? "Disable web search" : "Enable web search"}
        >
          <Search className="size-4" />
          Web Search
        </PromptInputButton>
      </TooltipTrigger>
      <TooltipContent>
        <p>{enabled ? "Disable" : "Enable"} web search</p>
      </TooltipContent>
    </Tooltip>
  );
}
