"use client";

import { useStore } from "@nanostores/react";
import { Badge, Button, Inset, Popover, Tabs } from "@radix-ui/themes";
import type React from "react";
import { BiBrain } from "react-icons/bi";
import { MdBolt } from "react-icons/md";

import {
  type IModel,
  type IProvider,
  providers,
  simpleModels,
} from "@/utils/inference";
import { $model } from "@/utils/stores";

export default function ModelSelector() {
  const model = useStore($model);

  function onModelSelect(model) {
    $model.set(model.id);
  }

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="soft">{$model.get()}</Button>
      </Popover.Trigger>
      <Popover.Content width="350px">
        <Inset>
          <Tabs.Root defaultValue="simple">
            <Tabs.List>
              <Tabs.Trigger value="simple">Simple</Tabs.Trigger>
              <Tabs.Trigger value="advanced">Advanced</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="simple">
              <div className="p-3 flex flex-col">
                {simpleModels.map((m) => (
                  <ModelItem
                    key={m.id}
                    model={m}
                    isSelected={m.id === model}
                    onModelSelect={onModelSelect}
                  />
                ))}
              </div>
            </Tabs.Content>
            <Tabs.Content value="advanced">
              <div className="p-3 flex flex-col">
                {providers.map((p) => (
                  <span key={p.name}>
                    {p.models.map((m) => (
                      <ModelItem
                        key={m.id}
                        provider={p}
                        model={m}
                        isSelected={m.id === model}
                        onModelSelect={onModelSelect}
                      />
                    ))}
                  </span>
                ))}
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </Inset>
      </Popover.Content>
    </Popover.Root>
  );
}

interface IModelItemProps {
  model: IModel;
  provider?: IProvider;
  isSelected: boolean;
  onModelSelect: (model: IModel) => void;
}

function ModelItem(props: IModelItemProps) {
  const { model, provider, isSelected, onModelSelect } = props;

  return (
    <Popover.Close
      key={model.id}
      className={`px-3 py-2 text-sm rounded cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 ${isSelected ? "bg-zinc-50 dark:bg-zinc-800" : ""}`}
      onClick={() => onModelSelect(model)}
    >
      <div className="flex items-center space-x-3">
        {provider?.icon && <div>{provider.icon}</div>}
        <div>
          <p className="text-sm">{model.name}</p>
          <p className="text-xs text-zinc-400">{model.description}</p>
        </div>
        <div className="grow" />
        {model.fast && (
          <Badge color="orange">
            <MdBolt />
          </Badge>
        )}
        {model.reasoning && (
          <Badge color="blue">
            <BiBrain />
          </Badge>
        )}
      </div>
    </Popover.Close>
  );
}
