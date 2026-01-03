import { useStore } from "@nanostores/react";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import { PromptInputButton } from "@/components/ai-elements/prompt-input";
import { ModelCommandMenu } from "@/components/model-command-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getModelIconById } from "@/utils/provider-icons";
import { $model } from "@/utils/stores";

export function ModelPopover() {
  const model = useStore($model);
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <PromptInputButton
          role="combobox"
          aria-expanded={open}
          className="justify-between gap-2"
          size="sm"
        >
          {getModelIconById(model.id)}
          <span className="truncate">{model.name}</span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </PromptInputButton>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-0" align="start">
        <ModelCommandMenu handleClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
