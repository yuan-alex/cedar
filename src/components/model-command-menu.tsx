import { useStore } from "@nanostores/react";
import { Brain, Zap } from "lucide-react";
import React from "react";

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
import {
  type IModel,
  type IProvider,
  findModelById,
  providers,
  simpleModels,
} from "@/utils/inference";
import { $model } from "@/utils/stores";

export function ModelCommandMenu(props: {
  handleClose: () => void;
}) {
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
      <CommandInput placeholder="Search model..." />
      <CommandList>
        <CommandEmpty>No model found.</CommandEmpty>
        <CommandGroup>
          {simpleModels.map((model) => (
            <ModelItem
              key={model.id}
              model={model}
              onModelSelect={onModelSelect}
            />
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup>
          {providers.map((provider) => (
            <React.Fragment key={provider.name}>
              {provider.models.map((model) => (
                <ModelItem
                  key={model.id}
                  model={model}
                  provider={provider}
                  onModelSelect={onModelSelect}
                />
              ))}
            </React.Fragment>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function ModelItem(props: {
  model: IModel;
  provider?: IProvider;
  onModelSelect?: (modelId: string) => void;
}) {
  const { model, provider, onModelSelect } = props;

  return (
    <CommandItem
      className="flex w-full"
      value={model.id}
      onSelect={onModelSelect}
    >
      {provider?.icon && <div>{provider.icon}</div>}
      <div>
        <p className={`${model.devOnly ? "text-blue-500" : ""}`}>
          {model.name}
        </p>
        <p className="text-xs text-zinc-500">{model.description}</p>
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
