import type { UIMessage } from "ai";
import { BrainIcon, ChevronDownIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { MemoizedMarkdown } from "@/components/memorized-markdown";
import { Button } from "@/components/ui/button";

interface IMessageProps {
  message: UIMessage;
}

export function CedarMessage(props: IMessageProps) {
  const { message } = props;

  function handleCopyText() {
    const textPart = message.parts?.find((part) => part.type === "text");
    const textContent = textPart && "text" in textPart ? textPart.text : "";

    navigator.clipboard
      .writeText(textContent)
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
              : "not-prose px-5 py-3 rounded-3xl ml-auto bg-zinc-100 dark:bg-zinc-900"
          }`}
        >
          {message.parts?.map((part, i) => {
            switch (part.type) {
              case "text":
                return (
                  <MemoizedMarkdown
                    key={`${message.id}-text-${i}`}
                    id={message.id}
                    content={"text" in part ? part.text : ""}
                  />
                );
              case "reasoning":
                return (
                  <details
                    key={`${message.id}-reasoning-${i}`}
                    className="group mb-3 border border-zinc-100 dark:border-zinc-800/40 rounded-lg bg-zinc-50/20 dark:bg-zinc-950/10 overflow-hidden"
                  >
                    <summary className="flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 transition-colors duration-200">
                      <BrainIcon className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400 flex-grow">
                        Reasoning
                      </span>
                      <ChevronDownIcon className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <div className="p-3 bg-white/20 dark:bg-zinc-950/20 text-xs prose dark:prose-invert max-w-none overflow-auto">
                      <div className="border-l-2 border-zinc-200 dark:border-zinc-700/60 pl-3">
                        <MemoizedMarkdown
                          id={`${message.id}:reasoning`}
                          content={"text" in part ? part.text : ""}
                        />
                      </div>
                    </div>
                  </details>
                );
            }
          })}
        </div>
      </div>
      {message.role === "assistant" ? (
        <div className="flex gap-4 mb-4">
          <Button
            className="cursor-pointer"
            variant="ghost"
            onClick={handleCopyText}
          >
            <CopyIcon />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
