import { useStore } from "@nanostores/react";
import React from "react";
import { BiBrain } from "react-icons/bi";
import { MdBolt } from "react-icons/md";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { findModelById, providers, simpleModels } from "@/utils/inference";
import { $model } from "@/utils/stores";

export function ModelSelector() {
  const model = useStore($model);

  function onModelSelect(modelId: string) {
    const model = findModelById(modelId);
    $model.set({
      id: model.id,
      name: model.name,
    });
  }

  return (
    <Select onValueChange={onModelSelect}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder={model.name} />
      </SelectTrigger>
      <SelectContent className="max-h-[400px]">
        {simpleModels.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name}
          </SelectItem>
        ))}
        {providers.map((provider) => (
          <SelectGroup key={provider.name}>
            <SelectLabel>{provider.name}</SelectLabel>
            {provider.models.map((model) => (
              <SelectItem
                key={model.id}
                className="flex w-full"
                value={model.id}
              >
                {provider?.icon && <div>{provider.icon}</div>}
                <div>
                  <p className={`${model.devOnly ? "text-green-500" : ""}`}>
                    {model.name}
                  </p>
                  <p className="text-xs text-zinc-500">{model.description}</p>
                </div>
                <div className="grow" />
                {model.fast && (
                  <Badge variant="outline" className="text-xs px-1">
                    <MdBolt className="text-yellow-500" />
                  </Badge>
                )}
                {model.reasoning && (
                  <Badge variant="outline" className="text-xs px-1">
                    <BiBrain className="text-blue-500" />
                  </Badge>
                )}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
