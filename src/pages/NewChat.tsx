import { useNavigate } from "react-router";

import { InputBox } from "@/components/InputBox";
import { $model, $prompt } from "@/utils/stores";

export function NewChat() {
  const navigate = useNavigate();

  function handleCreateThread(event) {
    event.preventDefault();

    fetch("/api/threads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: $model.get().id,
        prompt: $prompt.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => navigate(`/chat/${data.token}`));
  }

  return (
    <form className="h-full flex flex-col" onSubmit={handleCreateThread}>
      <div className="grow flex items-center justify-center my-10">
        <div className="max-w-2xl w-full">
          <div className="flex items-center justify-center mb-5 space-x-3">
            <p className="text-3xl font-medium">Hey there, how can I help?</p>
          </div>
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
