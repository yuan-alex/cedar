import { marked } from "marked";
import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return (
      <ReactMarkdown
        components={{
          pre(props) {
            return (
              <pre
                className="not-prose p-2 my-5 rounded text-white"
                style={{ backgroundColor: "rgb(29, 31, 33)" }}
              >
                {props.children}
              </pre>
            );
          },
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <div className="text-sm">
                <nav className="flex">
                  <p className="font-sans">{match[1]}</p>
                </nav>
                <SyntaxHighlighter
                  {...rest}
                  className="not-prose"
                  PreTag="div"
                  language={match[1]}
                  style={atomDark}
                  showLineNumbers
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        }}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;
    return true;
  },
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return blocks.map((block) => (
      <MemoizedMarkdownBlock content={block} key={`${id}-block`} />
    ));
  },
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";
