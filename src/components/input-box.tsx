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
import { ProjectSelector } from "@/components/project-selector";
import { WebSearchToggle } from "@/components/web-search-toggle";

interface InputBoxProps {
  onSubmit: (message: PromptInputMessage) => void;
  status?: ChatStatus;
  selectedProjectId?: number | null;
  onProjectSelect?: (projectId: number | null) => void;
}

export function InputBox({
  onSubmit,
  status,
  selectedProjectId,
  onProjectSelect,
}: InputBoxProps) {
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
          {onProjectSelect && (
            <ProjectSelector
              selectedProjectId={selectedProjectId}
              onSelect={onProjectSelect}
            />
          )}
        </PromptInputTools>
        <PromptInputSubmit status={status} />
      </PromptInputFooter>
    </PromptInput>
  );
}
