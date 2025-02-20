import { DataList, IconButton, Popover } from "@radix-ui/themes";
import toast from "react-hot-toast";
import { FiCopy, FiInfo } from "react-icons/fi";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

export function Message(props) {
  const { message, thread } = props;

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
      <div className="flex items-start space-x-4 my-5">
        <div
          className={`prose max-w-none dark:prose-invert overflow-x-auto ${message.role === "assistant" ? "" : "py-3 px-5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl ml-auto"}`}
        >
          {message.reasoning && (
            <details>
              <summary>Show reasoning</summary>
              <p className="border-l-3 dark:border-zinc-700 pl-8 mb-10">
                {message.reasoning}
              </p>
            </details>
          )}
          <Markdown
            components={{
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    {...rest}
                    className="not-prose"
                    PreTag="div"
                    language={match[1]}
                    style={atomDark}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                );
              },
            }}
            remarkPlugins={[remarkGfm]}
          >
            {message.content}
          </Markdown>
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
                <DataList.Label>ID</DataList.Label>
                <DataList.Value>{message.id}</DataList.Value>
              </DataList.Item>
              <DataList.Item align="center">
                <DataList.Label>Model</DataList.Label>
                <DataList.Value>{thread.model}</DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </Popover.Content>
        </Popover.Root>
      </div>
    </>
  );
}
