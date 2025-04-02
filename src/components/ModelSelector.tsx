import { useStore } from "@nanostores/react";
import { Badge, Button, Inset, Popover, Tabs } from "@radix-ui/themes";
import { BiBrain } from "react-icons/bi";
import { MdBolt } from "react-icons/md";

import {
  type IModel,
  type IProvider,
  providers,
  simpleModels,
} from "@/utils/inference";
import { $model } from "@/utils/stores";

export function ModelSelector() {
  const model = useStore($model);

  function onModelSelect(model) {
    $model.set({
      id: model.id,
      name: model.name,
    });
  }

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="soft">
          {model.id === "cedar/reasoning" && <BiBrain />}
          {model.id === "cedar/fast" && <MdBolt />}
          {model.name}
        </Button>
      </Popover.Trigger>
      <Popover.Content width="350px" maxHeight="400px">
        <Inset>
          <Tabs.Root defaultValue="simple" className="dark:bg-black">
            <Tabs.List>
              <Tabs.Trigger value="simple">Simple</Tabs.Trigger>
              <Tabs.Trigger value="advanced">Advanced</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content
              value="simple"
              className="grow p-3 flex flex-col overflow-y-auto"
            >
              {simpleModels.map((m) => (
                <ModelItem
                  key={m.id}
                  model={m}
                  isSelected={m.id === model.id}
                  onModelSelect={onModelSelect}
                />
              ))}
            </Tabs.Content>
            <Tabs.Content
              value="advanced"
              className="grow p-3 flex flex-col overflow-y-auto"
            >
              {providers.map((p) => (
                <span key={p.name}>
                  {p.models.map((m) => (
                    <ModelItem
                      key={m.id}
                      provider={p}
                      model={m}
                      isSelected={m.id === model.id}
                      onModelSelect={onModelSelect}
                    />
                  ))}
                </span>
              ))}
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
      className={`px-3 py-2 text-sm rounded cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 ${isSelected ? "bg-zinc-100 dark:bg-zinc-900" : ""}`}
      onClick={() => onModelSelect(model)}
    >
      <div className="flex items-center space-x-3">
        {provider?.icon && <div>{provider.icon}</div>}
        <div>
          <p className="text-sm">{model.name}</p>
          <p className="text-xs text-zinc-500">{model.description}</p>
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
