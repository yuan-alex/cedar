"use client";

import { useStore } from "@nanostores/react";
import { Badge, Button, Popover } from "@radix-ui/themes";
import type React from "react";
import { BiBrain } from "react-icons/bi";
import { MdBolt } from "react-icons/md";

import { providers } from "@/utils/inference";
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
      <Popover.Content width="400px" height="600px">
        <div className="flex flex-col">
          {providers.map((p) => (
            <span key={p.name}>
              {p.models.map((m) => (
                <Popover.Close
                  key={m.id}
                  className={`px-3 py-2 text-sm rounded cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 ${m.id === model ? "bg-zinc-100 dark:bg-zinc-800" : ""}`}
                  onClick={() => onModelSelect(m)}
                >
                  <div className="flex items-center space-x-2">
                    {p.icon ? <div>{p.icon}</div> : <div className="w-4 h-4" />}
                    <p className="">{m.name}</p>
                    <div className="grow" />
                    {m.fast && (
                      <Badge color="orange">
                        <MdBolt />
                      </Badge>
                    )}
                    {m.reasoning && (
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
