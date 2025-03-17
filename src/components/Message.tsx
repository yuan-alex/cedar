import { DataList, IconButton, Popover } from "@radix-ui/themes";
import toast from "react-hot-toast";
import { FiCopy, FiInfo } from "react-icons/fi";

import { MemoizedMarkdown } from "@/components/memorized-markdown";

export function Message(props) {
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
      <div className="flex items-start space-x-4 m-5">
        <div
          className={`prose max-w-none dark:prose-invert overflow-x-auto ${message.role === "assistant" ? "" : "py-3 px-5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl ml-auto"}`}
        >
          {message.reasoning && (
            <details>
              <summary>Show reasoning</summary>
              <div className="prose dark:prose-invert border-l-3 dark:border-zinc-700 pl-8 my-10">
                <MemoizedMarkdown
                  id={`${message.id}:reasoning`}
                  content={message.reasoning}
                />
              </div>
            </details>
          )}
          <MemoizedMarkdown id={message.id} content={message.content} />
        </div>
      </div>
      <div
        className={`${message.role === "assistant" ? "flex justify-end gap-4 mb-4" : "invisible"}`}
      >
        <IconButton variant="ghost" size="2">
          <FiCopy onClick={handleCopyText} />
        </IconButton>
        <Popover.Root>
          <Popover.Trigger>
            <IconButton variant="ghost" size="2">
              <FiInfo />
            </IconButton>
          </Popover.Trigger>
          <Popover.Content width="360px">
            <DataList.Root>
              <DataList.Item>
                <DataList.Label>Message Token</DataList.Label>
                <DataList.Value>{message.token}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Step Token</DataList.Label>
                <DataList.Value>{message.runStep?.token}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Model</DataList.Label>
                <DataList.Value>
                  {message.runStep?.generationModel}
                </DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </Popover.Content>
        </Popover.Root>
      </div>
    </>
  );
}
