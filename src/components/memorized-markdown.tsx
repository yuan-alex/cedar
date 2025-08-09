import { marked } from "marked";
import { type ComponentType, memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { Button } from "@/components/ui/button";

import "katex/dist/katex.min.css";

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens
    .map((token) => token.raw ?? "")
    .filter((block) => typeof block === "string");
}

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return (
      <ReactMarkdown
        components={{
          pre(props) {
            return (
              <pre className="not-prose p-2 my-5 rounded">{props.children}</pre>
            );
          },
          code(props) {
            const { children, className, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            const content =
              typeof children === "string"
                ? children
                : Array.isArray(children)
                  ? children.join("")
                  : "";
            const safeContent = (content || "").replace(/\n$/, "");
            const CodeHighlighter =
              SyntaxHighlighter as unknown as ComponentType<
                Record<string, unknown>
              >;
            return match ? (
              <div>
                <nav className="flex items-center font-sans">
                  <p className="text-sm">{match[1]}</p>
                  <div className="grow" />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigator?.clipboard?.writeText(safeContent)}
                  >
                    Copy
                  </Button>
                </nav>
                <CodeHighlighter
                  {...rest}
                  className="not-prose text-sm"
                  PreTag="div"
                  language={match[1]}
                  style={atomDark}
                  showLineNumbers
                >
                  {safeContent}
                </CodeHighlighter>
              </div>
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        }}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
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

    let sequenceCounter = 0;
    return blocks.map((block) => (
      <MemoizedMarkdownBlock
        content={block}
        key={`${id}-block-${sequenceCounter++}`}
      />
    ));
  },
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";
