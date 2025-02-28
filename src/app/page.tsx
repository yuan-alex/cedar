"use client";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { InputBox } from "@/components/InputBox";
import ModelSelector from "@/components/ModelSelector";
import { $model, $prompt } from "@/utils/stores";

export default function NewChat() {
  function handleCreateThread(event) {
    event.preventDefault();

    fetch("/api/threads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: $model.value,
        prompt: $prompt.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => redirect(`/chat/${data.token}`));
  }

  return (
    <form className="h-full flex flex-col" onSubmit={handleCreateThread}>
      <nav className="p-3 flex">
        <ModelSelector />
      </nav>
      <div className="grow flex items-center justify-center my-10">
        <div className="max-w-2xl w-full">
          <p className="text-4xl text-center font-serif font-semibold mb-8">
            Hello, what can I do for you today?
          </p>
          <InputBox
            name="message"
            rows={3}
            onChange={(event) => $prompt.set(event.target.value)}
          />
        </div>
      </div>
      <footer className="mb-5">
        <p className="text-xs text-center">
          Language models can make critical mistakes.
        </p>
      </footer>
    </form>
  );
}
