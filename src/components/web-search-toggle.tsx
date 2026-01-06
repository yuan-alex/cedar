import { useStore } from "@nanostores/react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { PromptInputButton } from "@/components/ai-elements/prompt-input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { createQueryFn } from "@/utils/queries";
import { $webSearchEnabled } from "@/utils/stores";

export function WebSearchToggle() {
  const enabledStr = useStore($webSearchEnabled);
  const enabled = enabledStr === "true";

  const { data: webSearchData } = useQuery({
    queryKey: ["webSearchAvailable"],
    queryFn: createQueryFn("/api/v1/web-search-available"),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const isAvailable = webSearchData?.available ?? false;

  const toggleWebSearch = () => {
    if (isAvailable) {
      $webSearchEnabled.set(enabled ? "false" : "true");
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <PromptInputButton
          onClick={toggleWebSearch}
          disabled={!isAvailable}
          variant={enabled ? "secondary" : "ghost"}
          className={cn(
            enabled &&
              "border-green-700 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-950 dark:hover:text-green-300",
            !isAvailable && "opacity-50 cursor-not-allowed",
          )}
          aria-label={
            !isAvailable
              ? "Web search unavailable (EXA_API_KEY not configured)"
              : enabled
                ? "Disable web search"
                : "Enable web search"
          }
        >
          <Search className="size-4" />
          Web Search
        </PromptInputButton>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {!isAvailable
            ? "Web search unavailable (EXA_API_KEY not configured)"
            : enabled
              ? "Disable web search"
              : "Enable web search"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
