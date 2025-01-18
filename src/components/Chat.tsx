"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import { VscSparkle } from "react-icons/vsc";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { mutate } from "swr";
import { StickToBottom } from "use-stick-to-bottom";

import { InputBox } from "@/components/InputBox";
import { $prompt } from "@/utils/stores";

export function Chat(props) {
  const { thread } = props;

  const formRef = useRef(null);
  const messagesEndRef = useRef(null);

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

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();

    if ($prompt.value) {
      append({
        role: "user",
        content: $prompt.value,
      });
      $prompt.set("");
    }
  }, [$prompt]);

  return (
    <>
      <StickToBottom
        className="flex-grow overflow-auto w-full"
        resize="smooth"
        initial="instant"
      >
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

const components = {
  code: ({ children }) => <code className="text-xs">{children}</code>,
};

function Message(props) {
  const { message } = props;

  return (
    <div className="flex items-start space-x-4 my-4">
      {message.role === "assistant" && (
        <div className="p-1">
          <VscSparkle className="w-5 h-5" />
        </div>
      )}
      <div
        className={`prose max-w-none dark:prose-invert overflow-x-auto ${message.role === "assistant" ? "" : "px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl ml-auto"}`}
      >
        <Markdown components={components} remarkPlugins={[remarkGfm]}>
          {message.content}
        </Markdown>
      </div>
    </div>
  );
}
