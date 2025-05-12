import type { Message } from "ai";
import { CopyIcon } from "lucide-react";
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
                  <details
                    key={i}
                    className="border rounded-xl dark:border-zinc-800"
                  >
                    <summary className="p-3 w-full cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl border-b">
                      Show reasoning
                    </summary>
                    <div className="p-6 text-sm prose dark:prose-invert max-w-none overflow-auto">
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
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={handleCopyText}
          >
            <CopyIcon />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
