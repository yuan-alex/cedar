import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from "remark-gfm";

export function Message(props) {
  const { message } = props;

  return (
    <div className="flex items-start space-x-4 my-4">
      <div
        className={`prose max-w-none dark:prose-invert overflow-x-auto ${message.role === "assistant" ? "" : "px-5 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl ml-auto"}`}
      >
        <Markdown components={{
          code(props) {
            const { children, className, node, ...rest } = props
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <SyntaxHighlighter
                {...rest}
                className="not-prose"
                PreTag="div"
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                style={atomDark}
              />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            )
          }
        }} remarkPlugins={[remarkGfm]}>
          {message.content}
        </Markdown>
      </div>
    </div>
  );
}
