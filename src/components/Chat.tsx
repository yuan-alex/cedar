"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import { mutate } from "swr";
import { StickToBottom } from "use-stick-to-bottom";

import { InputBox } from "@/components/InputBox";
import { Message } from "@/components/Message";
import { $prompt } from "@/utils/stores";

export function Chat(props) {
  const { thread } = props;

  const formRef = useRef(null);

  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    api: `/api/threads/${thread.token}`,
    id: thread.token,
    initialMessages: thread.messages.map((msg) =>
      msg.isAssistant
        ? { id: msg.id, role: "assistant", content: msg.content }
        : { id: msg.id, role: "user", content: msg.content },
    ),
    experimental_prepareRequestBody: ({ messages }) => {
      // e.g. only the text of the last message:
      return messages[messages.length - 1].content;
    },
    onFinish: () => {
      mutate("/api/threads");
    },
  });

  useEffect(() => {
    const prompt = localStorage.getItem("prompt");
    if (thread.messages.length === 0 && prompt) {
      append({ role: "user", content: prompt });
      $prompt.set("");
    }
  }, []);

  return (
    <>
      <StickToBottom
        className="grow overflow-auto w-full"
        resize="smooth"
        initial="instant"
      >
        {process.env.NODE_ENV === "development" && (
          <pre className="p-5 text-sm overflow-auto max-h-52 bg-zinc-800 text-white">{JSON.stringify(messages, undefined, 2)}</pre>
        )}
        <StickToBottom.Content className="flex flex-col w-full max-w-3xl mx-auto my-10">
          {messages.map((msg, i) => (
            <Message key={msg.id} index={i} message={msg} />
          ))}
        </StickToBottom.Content>
      </StickToBottom>
      <div className="w-full max-w-3xl mx-auto mb-2">
        <form ref={formRef} onSubmit={handleSubmit}>
          <InputBox value={input} onChange={handleInputChange} />
        </form>
      </div>
    </>
  );
}
