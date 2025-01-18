"use client";

import Form from "next/form";

import { createThreadForMessage } from "@/app/api/threads/actions";
import { InputBox } from "@/components/InputBox";
import { ModelSelector } from "@/components/ModelSelector";
import { $model, $prompt } from "@/utils/stores";

export default function NewChat() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="max-w-2xl w-full">
        <p className="text-3xl font-semibold mb-5">
          What can I do for you today?
        </p>
        <Form action={createThreadForMessage}>
          <InputBox
            name="message"
            onChange={(event) => $prompt.set(event.target.value)}
            rows={3}
          />
          <div className="flex my-3">
            <ModelSelector
              name="model"
              defaultValue={$model.get()}
              onValueChange={(value) => {
                $model.set(value);
              }}
            />
          </div>
        </Form>
      </div>
    </div>
  );
}
