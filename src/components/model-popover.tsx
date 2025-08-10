import { useStore } from "@nanostores/react";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import { ModelCommandMenu } from "@/components/model-command-menu";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { $model } from "@/utils/stores";
import { getModelIconById } from "@/utils/provider-icons";

export function ModelPopover() {
  const model = useStore($model);
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          <div className="flex items-center gap-2">
            {getModelIconById(model.id)}
            {model.name}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-0" align="start">
        <ModelCommandMenu handleClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
