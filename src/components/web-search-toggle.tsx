import { useStore } from "@nanostores/react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={enabled ? "border-primary" : ""}
          onClick={toggleWebSearch}
        >
          <Search className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{enabled ? "Disable" : "Enable"} web search</p>
      </TooltipContent>
    </Tooltip>
  );
}
