import { useChat } from "@ai-sdk/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router";
import { StickToBottom } from "use-stick-to-bottom";

import { InputBox } from "@/components/InputBox";
import { CedarMessage } from "@/components/Message";
import { createQueryFn } from "@/utils/queries";
import { $model, $prompt } from "@/utils/stores";

export function Chat() {
  const { threadToken } = useParams();
  const queryClient = useQueryClient();

  const { data: thread } = useQuery({
    queryKey: [`thread_${threadToken}`],
    queryFn: createQueryFn(`/api/threads/${threadToken}`),
  });

  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    append,
  } = useChat({
    api: `/api/threads/${threadToken}`,
    id: threadToken,
    experimental_prepareRequestBody: ({ messages }) => {
      return {
        model: $model?.get().id,
        content: messages[messages.length - 1].content,
      };
    },
    experimental_throttle: 50,
    onFinish: () => {
      queryClient.invalidateQueries({ queryKey: ["sidebarThreads"] });
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const prompt = $prompt.value;

    if (threadToken && thread) {
      if (thread.messages.length === 0 && prompt) {
        append({ role: "user", content: prompt });
        $prompt.set("");
      } else {
        setMessages(
          thread.messages.map((msg) => ({
            ...msg,
            id: msg.token,
            role: msg.isAssistant ? "assistant" : "user",
            content: msg.content,
          })),
        );
      }
    }
  }, [thread, threadToken]);

  return (
    <div className="flex divide-x h-full">
      <div className="grow flex flex-col overflow-y-auto">
        <StickToBottom
          className="grow overflow-auto w-full"
          resize="smooth"
          initial="instant"
        >
          <StickToBottom.Content className="flex flex-col max-w-4xl mx-auto space-y-5 p-5">
            {messages.map((msg, i) => (
              <CedarMessage key={msg.id} message={msg} />
            ))}
          </StickToBottom.Content>
        </StickToBottom>
        <div className="basis-0 w-full max-w-4xl mx-auto mb-2">
          <form onSubmit={handleSubmit}>
            <InputBox rows={1} value={input} onChange={handleInputChange} />
          </form>
        </div>
      </div>
    </div>
  );
}
