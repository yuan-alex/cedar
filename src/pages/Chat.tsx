import { useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { StickToBottom } from "use-stick-to-bottom";

import { InputBox } from "@/components/InputBox";
import { CedarMessage } from "@/components/Message";
import { $model, $prompt } from "@/utils/stores";

export function Chat() {
  const navigate = useNavigate();
  const { threadToken } = useParams();
  const queryClient = useQueryClient();

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

    if (threadToken) {
      fetch(`/api/threads/${threadToken}`)
        .then((response) => response.json())
        .then((thread) => {
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
        });
    }
  }, [threadToken]);

  useEffect(() => {
    function listener(event: KeyboardEvent) {
      if (event.key === "Ctrl+k" || (event.metaKey && event.key === "k")) {
        navigate("/");
      }
    }
    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen">
      {process.env.NODE_ENV === "development" && (
        <pre className="fixed p-5 m-3 text-sm bottom-0 right-0 w-60 h-4/5 rounded overflow-auto border bg-black text-green-200">
          {JSON.stringify(messages, undefined, 2)}
        </pre>
      )}
      <StickToBottom
        className="grow overflow-auto w-full"
        resize="smooth"
        initial="instant"
      >
        <StickToBottom.Content className="flex flex-col w-full max-w-3xl mx-auto my-10">
          {messages.map((msg, i) => (
            <CedarMessage key={msg.id} message={msg} />
          ))}
        </StickToBottom.Content>
      </StickToBottom>
      <div className="w-full max-w-3xl mx-auto mb-2">
        <form onSubmit={handleSubmit}>
          <InputBox rows={1} value={input} onChange={handleInputChange} />
        </form>
      </div>
    </div>
  );
}
