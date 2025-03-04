"use client";

import { useChat } from "@ai-sdk/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { mutate } from "swr";
import { StickToBottom } from "use-stick-to-bottom";

import { InputBox } from "@/components/InputBox";
import { Message } from "@/components/Message";
import { $prompt } from "@/utils/stores";

export function Chat(props) {
  const { thread } = props;

  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    api: `/api/threads/${thread.token}`,
    id: thread.token,
    initialMessages: thread.messages.map((msg) =>
      msg.isAssistant
        ? { ...msg, id: msg.token, role: "assistant", content: msg.content }
        : { ...msg, id: msg.token, role: "user", content: msg.content },
    ),
    experimental_prepareRequestBody: ({ messages }) => {
      // e.g. only the text of the last message:
      return messages[messages.length - 1].content;
    },
    experimental_throttle: 50,
    onFinish: () => {
      mutate("/api/threads?take=10");
    },
  });

  useEffect(() => {
    const prompt = localStorage.getItem("prompt");
    if (thread.messages.length === 0 && prompt) {
      append({ role: "user", content: prompt });
      $prompt.set("");
    }

    function listener(event: KeyboardEvent) {
      if (event.key === "Ctrl+k" || (event.metaKey && event.key === "k")) {
        redirect("/");
      }
    }
    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [append, thread.messages.length]);

  return (
    <>
      {process.env.NODE_ENV === "development" && (
        <pre className="fixed p-5 m-3 text-sm bottom-0 right-0 w-60 h-2/3 rounded overflow-auto bg-black text-green-300">
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
            <Message key={msg.id} index={i} thread={thread} message={msg} />
          ))}
        </StickToBottom.Content>
      </StickToBottom>
      <div className="w-full max-w-3xl mx-auto mb-2">
        <form onSubmit={handleSubmit}>
          <InputBox rows={1} value={input} onChange={handleInputChange} />
        </form>
      </div>
    </>
  );
}
