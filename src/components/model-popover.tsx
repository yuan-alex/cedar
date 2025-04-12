import { useStore } from "@nanostores/react";
import { useState } from "react";

import { ModelCommandMenu } from "@/components/model-command-menu";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { $model } from "@/utils/stores";
import { ChevronsUpDown } from "lucide-react";

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
          className="w-[250px] justify-between"
        >
          {model.name}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <ModelCommandMenu handleClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
