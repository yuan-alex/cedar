import { useChat } from "@ai-sdk/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";
import { useEffect, useState } from "react";
import { StickToBottom } from "use-stick-to-bottom";

import { InputBox } from "@/components/input-box";
import { CedarMessage } from "@/components/message";
import { createQueryFn } from "@/utils/queries";
import { $model, $prompt } from "@/utils/stores";

export function Chat() {
  const { threadToken } = useParams({ from: "/chat/$threadToken" });
  const queryClient = useQueryClient();

  const { data: thread } = useQuery({
    queryKey: [`thread_${threadToken}`],
    queryFn: createQueryFn(`/api/v1/threads/${threadToken}`),
  });

  const [input, setInput] = useState("");
  const { messages, setMessages, sendMessage } = useChat({
    id: threadToken,
    transport: new DefaultChatTransport({
      api: `/api/v1/threads/${threadToken}`,
      credentials: "include",
      prepareSendMessagesRequest: ({ messages }) => ({
        body: {
          model: $model?.get().id,
          content: messages[messages.length - 1].parts[0].text,
        },
      }),
    }),
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
        sendMessage({ text: prompt });
        $prompt.set("");
      } else {
        setMessages(
          thread.messages.map((msg: any) => ({
            ...msg,
            id: msg.token,
            role: msg.isAssistant ? "assistant" : "user",
            parts: [
              ...(msg.reasoning
                ? [{ type: "reasoning", text: msg.reasoning }]
                : []),
              { type: "text", text: msg.content },
            ],
          })),
        );
      }
    }
  }, [thread, threadToken]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <div className="flex flex-col h-full w-full">
      <StickToBottom
        className="grow overflow-auto"
        resize="smooth"
        initial="instant"
      >
        <StickToBottom.Content className="flex flex-col max-w-4xl mx-auto space-y-5 p-5">
          {messages.map((msg) => (
            <CedarMessage key={msg.id} message={msg} />
          ))}
        </StickToBottom.Content>
      </StickToBottom>
      <div className="basis-0 p-2 lg:p-0 w-full max-w-4xl mx-auto mb-2">
        <form onSubmit={handleSubmit}>
          <InputBox
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
