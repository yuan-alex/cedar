import type { Message } from "ai";
import { FiCopy } from "react-icons/fi";
import { toast } from "sonner";

import { MemoizedMarkdown } from "@/components/memorized-markdown";
import { Button } from "@/components/ui/button";

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
          className={`overflow-x-auto ${
            message.role === "assistant"
              ? "w-full"
              : "px-5 border rounded-2xl ml-auto"
          }`}
        >
          {message.parts?.map((part, i) => {
            switch (part.type) {
              case "text":
                return (
                  <MemoizedMarkdown
                    key={i}
                    id={message.id}
                    content={part.text}
                  />
                );
              case "reasoning":
                return (
                  <details key={i}>
                    <summary>Show reasoning</summary>
                    <div className="p-8 text-sm prose dark:prose-invert max-w-none border dark:border-zinc-700 shadow rounded-xl my-10 h-92 overflow-auto">
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
          <Button variant="ghost">
            <FiCopy onClick={handleCopyText} />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
