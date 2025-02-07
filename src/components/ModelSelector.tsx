"use client";

import { Button, Popover } from "@radix-ui/themes";
import type React from "react";

import { providers } from "@/utils/inference";

interface IProps {
  name?: string;
  model: string;
  onChange: (model: string) => void;
}

export default function ModelSelector(props: IProps) {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="soft">{props.model}</Button>
      </Popover.Trigger>
      <Popover.Content width="300px" height="500px">
        <div className="flex flex-col space-y-2">
          {providers.map((provider) => (
            <span key={provider.name}>
              <p className="text-sm font-medium mb-2">{provider.name}</p>
              {provider.models.map((model) => (
                <Popover.Close
                  key={model.id}
                  className={`px-3 py-2 text-sm rounded cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 ${model.id === props.model ? "bg-zinc-100 dark:bg-zinc-800" : ""}`}
                  onClick={() => props.onChange(model.id)}
                >
                  <p>{model.name}</p>
                </Popover.Close>
              ))}
            </span>
          ))}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
