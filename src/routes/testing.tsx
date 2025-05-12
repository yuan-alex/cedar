import { createFileRoute } from "@tanstack/react-router";

import { MemoizedMarkdown } from "@/components/memorized-markdown";

export const Route = createFileRoute("/testing")({
  component: RouteComponent,
});

const MARKDOWN_CONTENT = `test

# Math

$E=mc^2$

$c = \\pm\\sqrt{a^2 + b^2}$

`;

function RouteComponent() {
  return (
    <div>
      <div className="p-10">
        <p className="text-3xl mb-2">Markdown Parsing</p>
        <div className="p-5 border shadow prose">
          <MemoizedMarkdown id="test" content={MARKDOWN_CONTENT} />
        </div>
      </div>
    </div>
  );
}
