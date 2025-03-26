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
    <>
      {process.env.NODE_ENV === "development" && (
        <details>
          <summary>show debugging info</summary>
          <div>
            <pre className="p-3 text-xs overflow-hidden text-white bg-black rounded">
              {JSON.stringify(message, undefined, 4)}
            </pre>
          </div>
        </details>
      )}
      <div className="flex items-start space-x-4 m-5">
        <div
          className={`prose max-w-none dark:prose-invert overflow-x-auto ${message.role === "assistant" ? "" : "py-3 px-5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl ml-auto"}`}
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
                    <div className="prose dark:prose-invert border-l-3 dark:border-zinc-700 pl-8 my-10">
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
      <div
        className={`${message.role === "assistant" ? "flex justify-end gap-4 mb-4" : "invisible"}`}
      >
        <IconButton variant="ghost" size="2">
          <FiCopy onClick={handleCopyText} />
        </IconButton>
      </div>
    </>
  );
}
