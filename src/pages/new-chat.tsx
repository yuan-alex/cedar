import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { InputBox } from "@/components/input-box";
import { $model, $prompt } from "@/utils/stores";

export function NewChat() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createThreadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/v1/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: $model.get().id,
          prompt: $prompt.value,
        }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sidebarThreads"] });
      queryClient.invalidateQueries({ queryKey: ["allThreads"] });
      navigate({
        to: "/chat/$threadToken",
        params: { threadToken: data.token },
      });
    },
  });

  function handleCreateThread(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!$prompt.value) {
      return;
    }

    createThreadMutation.mutate();
  }

  return (
    <form
      className="h-full flex flex-col overflow-hidden"
      onSubmit={handleCreateThread}
    >
      <div className="grow flex items-center justify-center overflow-hidden">
        <div className="max-w-4xl w-full px-4 md:px-0">
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="flex items-center space-x-4 mb-4">
              <img className="w-12 h-12" src="/images/cedar.svg" alt="Cedar" />
              <p className="text-5xl font-medium">Cedar</p>
            </div>
          </div>
          <div className="w-full">
            <InputBox
              name="message"
              rows={3}
              onChange={(event) => $prompt.set(event.target.value)}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
