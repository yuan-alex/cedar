import { useNavigate } from "react-router";

import { InputBox } from "@/components/input-box";
import { $model, $prompt } from "@/utils/stores";

export function NewChat() {
  const navigate = useNavigate();

  function handleCreateThread(event) {
    event.preventDefault();

    fetch("/api/v1/threads", {
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
          <div className="flex items-center justify-center mb-5 space-x-4">
            <img className="w-12 h-12" src="/cedar.svg" />
            <p className="text-5xl font-medium">Cedar</p>
          </div>
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto mb-2">
        <InputBox
          name="message"
          rows={3}
          onChange={(event) => $prompt.set(event.target.value)}
        />
      </div>
    </form>
  );
}
