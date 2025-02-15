"use client";

import { Badge, Button, Popover } from "@radix-ui/themes";
import type React from "react";
import { BiBrain } from "react-icons/bi";
import { MdBolt } from "react-icons/md";

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
      <Popover.Content width="400px" height="600px">
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
                  <div className="flex items-center space-x-1">
                    <p>{model.name}</p>
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
              ))}
            </span>
          ))}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
