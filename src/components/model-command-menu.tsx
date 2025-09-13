import { useStore } from "@nanostores/react";
import { useQuery } from "@tanstack/react-query";
import { Brain, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { ICedarModel } from "@/server/utils/providers";
import { getModelIconById } from "@/utils/provider-icons";
import { createQueryFn } from "@/utils/queries";
import { $model } from "@/utils/stores";

export function ModelCommandMenu(props: { handleClose: () => void }) {
  const model = useStore($model);

  const { data: modelsData }: { data: ICedarModel[] | undefined } = useQuery({
    queryKey: ["models"],
    queryFn: createQueryFn("/api/v1/models"),
  });

  function onModelSelect(model: ICedarModel) {
    props.handleClose();
    $model.set({
      id: model.id,
      name: model.name,
    });
  }

  return (
    <Command defaultValue={model.id}>
      <CommandInput placeholder="Search model..." autoFocus />
      <CommandList>
        <CommandEmpty>No model found.</CommandEmpty>
        <CommandGroup>
          {modelsData?.map((model) => (
            <ModelItem
              key={model.id}
              model={model}
              onModelSelect={() => onModelSelect(model)}
            />
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function ModelItem(props: {
  model: ICedarModel;
  onModelSelect?: (modelId: string) => void;
}) {
  const { model, onModelSelect } = props;

  return (
    <CommandItem
      className="flex w-full space-x-1 min-h-9"
      value={model.id}
      onSelect={onModelSelect}
    >
      <div>{getModelIconById(model.id)}</div>
      <div>
        <p className={`${model.experimental ? "text-blue-500" : ""}`}>
          {model.name}
        </p>
        <p className="text-xs text-muted-foreground">{model.description}</p>
      </div>
      <div className="grow" />
      {model.fast && (
        <Badge variant="outline" className="text-xs px-1">
          <Zap className="text-yellow-500" />
        </Badge>
      )}
      {model.reasoning && (
        <Badge variant="outline" className="text-xs px-1">
          <Brain className="text-blue-500" />
        </Badge>
      )}
    </CommandItem>
  );
}
