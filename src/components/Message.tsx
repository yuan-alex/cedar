import { IconButton } from "@radix-ui/themes";
import type { Message } from "ai";
import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";

import { MemoizedMarkdown } from "@/components/memorized-markdown";

interface IMessageProps {
  message: Message;
}

export function CedarMessage(props: IMessageProps) {
  const { message } = props;

  function handleCopyText() {
    navigator.clipboard
      .writeText(message.content)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy text. Please try again.");
      });
  }

  return (
    <div>
      <div className="prose dark:prose-invert max-w-none w-full flex items-start space-x-4">
        <div
          className={`overflow-x-auto ${message.role === "assistant" ? "" : "px-5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl ml-auto"}`}
        >
          {message.parts?.map((part, i) => {
            switch (part.type) {
              case "text":
                return (
                  <MemoizedMarkdown
                    id={message.id}
                    key={message.id}
                    content={part.text}
                  />
                );
              case "reasoning":
                return (
                  <details key={message.id}>
                    <summary>Show reasoning</summary>
                    <div className="text-sm prose max-w-none dark:prose-invert border dark:border-zinc-700 shadow rounded-xl p-5 mb-10sm">
                      <MemoizedMarkdown
                        id={`${message.id}:reasoning`}
                        content={part.reasoning}
                      />
                    </div>
                  </details>
                );
            }
          })}
        </div>
      </div>
      {message.role === "assistant" ? (
        <div className="flex justify-end gap-4 mb-4">
          <IconButton variant="ghost" size="2">
            <FiCopy onClick={handleCopyText} />
          </IconButton>
        </div>
      ) : null}
    </div>
  );
}
