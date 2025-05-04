import { useStore } from "@nanostores/react";
import { Brain, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { getModelIconById } from "@/utils/provider-icons";
import {
  type IModel,
  findModelById,
  models,
  simpleModels,
} from "@/utils/providers";
import { $model } from "@/utils/stores";

export function ModelCommandMenu(props: { handleClose: () => void }) {
  const model = useStore($model);

  function onModelSelect(modelId: string) {
    props.handleClose();
    const model = findModelById(modelId);
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
        <CommandGroup heading="Recommended">
          {simpleModels.map((model) => (
            <ModelItem
              key={model.id}
              model={model}
              onModelSelect={onModelSelect}
            />
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="All models">
          {models.map((model) => (
            <ModelItem
              key={model.id}
              model={model}
              onModelSelect={onModelSelect}
            />
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function ModelItem(props: {
  model: IModel;
  onModelSelect?: (modelId: string) => void;
}) {
  const { model, onModelSelect } = props;

  return (
    <CommandItem
      className="flex w-full space-x-1 h-9"
      value={model.id}
      onSelect={onModelSelect}
    >
      <div>{getModelIconById(model.id)}</div>
      <div>
        <p className={`${model.devOnly ? "text-blue-500" : ""}`}>
          {model.name}
        </p>
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
