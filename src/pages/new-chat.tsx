import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { InputBox } from "@/components/input-box";
import { $model, $prompt } from "@/utils/stores";

const cedarIcon = "/images/cedar.svg";

export function NewChat() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );

  const createThreadMutation = useMutation({
    mutationFn: async () => {
      const body: {
        model: string;
        prompt: string;
        projectId?: number;
      } = {
        model: $model.get().id,
        prompt: $prompt.value,
      };
      if (selectedProjectId !== null) {
        body.projectId = selectedProjectId;
      }

      const response = await fetch("/api/v1/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sidebarThreads"] });
      queryClient.invalidateQueries({ queryKey: ["allThreads"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate({
        to: "/chat/$threadToken",
        params: { threadToken: data.token },
      });
    },
  });

  function handleCreateThread(message: { text: string; files: unknown[] }) {
    if (!message.text) {
      return;
    }

    $prompt.set(message.text);
    createThreadMutation.mutate();
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="grow flex flex-col justify-end md:justify-center md:items-center overflow-hidden">
        <div className="max-w-4xl w-full px-4 md:px-0">
          <div className="hidden md:flex flex-col items-center justify-center mb-10">
            <div className="flex items-center space-x-4 mb-4">
              <img className="w-12 h-12" src={cedarIcon} alt="Cedar" />
              <p className="text-5xl font-medium">Cedar</p>
            </div>
          </div>
          <div className="w-full mb-8 md:mb-0">
            <InputBox
              onSubmit={handleCreateThread}
              selectedProjectId={selectedProjectId}
              onProjectSelect={setSelectedProjectId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
