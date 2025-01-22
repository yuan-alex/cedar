"use client";

import { InputBox } from "@/components/InputBox";
import { ModelSelector } from "@/components/ModelSelector";
import { $model } from "@/utils/stores";

export default function NewChat() {
  return (
    <form className="h-full flex flex-col" action="/api/threads" method="POST">
      <nav className="p-3 flex">
        <ModelSelector
          name="model"
          defaultValue={$model.get()}
          onChange={(value) => {
            $model.set(value.target.value);
          }}
        />
      </nav>
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <p className="text-4xl font-serif font-semibold mb-5">
            👋 What can I do for you today?
          </p>
          <InputBox name="message" rows={3} />
        </div>
      </div>
    </form>
  );
}
