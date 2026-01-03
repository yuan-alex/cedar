import type { ChatStatus } from "ai";

import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { McpSelector } from "@/components/mcp-selector";
import { ModelPopover } from "@/components/model-popover";
import { WebSearchToggle } from "@/components/web-search-toggle";

interface InputBoxProps {
  onSubmit: (message: PromptInputMessage) => void;
  status?: ChatStatus;
}

export function InputBox({ onSubmit, status }: InputBoxProps) {
  const handleSubmit = (message: PromptInputMessage) => {
    onSubmit(message);
  };

  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputBody>
        <PromptInputTextarea placeholder="What can I help you with?" />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools>
          <WebSearchToggle />
          <ModelPopover />
          <McpSelector />
        </PromptInputTools>
        <PromptInputSubmit status={status} />
      </PromptInputFooter>
    </PromptInput>
  );
}
