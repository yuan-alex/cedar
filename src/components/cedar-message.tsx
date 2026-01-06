import type { ChatStatus, DynamicToolUIPart, ToolUIPart, UIMessage } from "ai";
import {
  ChevronDownIcon,
  CopyIcon,
  ExternalLinkIcon,
  RotateCcwIcon,
  SearchIcon,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageToolbar,
} from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Response } from "@/components/ai-elements/response";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface IMessageProps {
  message: UIMessage;
  chatStatus: ChatStatus;
  isLatestMessage?: boolean;
  threadToken?: string;
  onRegenerate?: () => void;
}

function WebSearchDisplay({
  toolPart,
}: {
  toolPart: ToolUIPart | DynamicToolUIPart;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const hasInput = "input" in toolPart && toolPart.input !== undefined;
  const hasOutput = "output" in toolPart && toolPart.output !== undefined;
  const hasErrorText =
    "errorText" in toolPart && toolPart.errorText !== undefined;

  const query =
    hasInput &&
    typeof toolPart.input === "object" &&
    toolPart.input !== null &&
    "query" in toolPart.input
      ? String(toolPart.input.query)
      : null;

  if (!query) {
    return null;
  }

  const hasResults = hasOutput || hasErrorText;

  // Type guard for output with results
  const outputWithResults =
    hasOutput &&
    typeof toolPart.output === "object" &&
    toolPart.output !== null &&
    "results" in toolPart.output &&
    Array.isArray(toolPart.output.results)
      ? (toolPart.output as {
          results: Array<{
            title?: string;
            url?: string;
            text?: string;
            publishedDate?: string;
            author?: string;
          }>;
        })
      : null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-md border bg-muted/30 overflow-hidden mb-4">
        <CollapsibleTrigger
          className={cn(
            "flex w-full items-center justify-between gap-2 px-3 py-2 text-left transition-colors hover:bg-muted/50",
            hasResults && "cursor-pointer",
          )}
          disabled={!hasResults}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-sm text-foreground min-w-0">
              <span className="text-muted-foreground">Searched:</span>{" "}
              <span className="font-medium">{query}</span>
            </span>
          </div>
          {hasResults && (
            <ChevronDownIcon
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform",
                isOpen && "rotate-180",
              )}
            />
          )}
        </CollapsibleTrigger>
        {hasResults && (
          <CollapsibleContent className="border-t bg-background">
            <div className="p-3 space-y-2">
              {outputWithResults?.results.map((result, index: number) => (
                <a
                  key={result.url || index}
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="group transition-all hover:border-primary/50 hover:shadow-sm py-3 gap-2 px-3">
                    <CardHeader className="pb-0 px-0 gap-1.5">
                      <CardTitle className="text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {result.title || "Untitled"}
                      </CardTitle>
                      <CardAction>
                        <ExternalLinkIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                      </CardAction>
                      {result.url && (
                        <CardDescription className="text-xs truncate">
                          {(() => {
                            try {
                              return new URL(result.url).hostname;
                            } catch {
                              return result.url;
                            }
                          })()}
                        </CardDescription>
                      )}
                    </CardHeader>
                  </Card>
                </a>
              ))}
            </div>
          </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  );
}

function renderGenericTool(
  messageId: string,
  partIndex: number,
  toolType: `tool-${string}`,
  toolPart: ToolUIPart | DynamicToolUIPart,
): React.ReactElement {
  const toolState = toolPart.state;

  const toolCallId = toolPart.toolCallId;
  const providerExecuted = toolPart.providerExecuted;

  const hasInput = "input" in toolPart && toolPart.input !== undefined;
  const hasOutput = "output" in toolPart && toolPart.output !== undefined;
  const hasErrorText =
    "errorText" in toolPart && toolPart.errorText !== undefined;

  return (
    <Tool key={`${messageId}-${toolType}-${partIndex}`} defaultOpen={false}>
      <ToolHeader type={toolType} state={toolState} />
      <ToolContent>
        {toolCallId && (
          <div className="px-4 pt-4 text-xs text-muted-foreground">
            Call ID: {toolCallId}
          </div>
        )}
        {typeof providerExecuted === "boolean" && (
          <div className="px-4 pt-2 text-xs text-muted-foreground">
            Executed: {providerExecuted ? "yes" : "no"}
          </div>
        )}
        {hasInput && (
          <ToolInput input={toolPart.input as ToolUIPart["input"]} />
        )}
        {(hasOutput || hasErrorText) && (
          <ToolOutput
            output={
              hasOutput ? (toolPart.output as ToolUIPart["output"]) : undefined
            }
            errorText={hasErrorText ? toolPart.errorText : undefined}
          />
        )}
      </ToolContent>
    </Tool>
  );
}

export function CedarMessage(props: IMessageProps) {
  const { message, threadToken, onRegenerate } = props;
  const [isRegenerating, setIsRegenerating] = useState(false);

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

  function handleRegenerate() {
    if (!threadToken || !onRegenerate) return;

    setIsRegenerating(true);
    try {
      onRegenerate();
      toast.success("Message regenerated");
    } catch (error) {
      console.error("Failed to regenerate message: ", error);
      toast.error("Failed to regenerate message. Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  }

  return (
    <div className="flex flex-col max-w-4xl">
      <Message from={message.role} className="relative size-full">
        <MessageContent>
          {message.parts?.map((part, i) => {
            // Handle static tool parts (e.g., tool-webSearch)
            if (
              typeof part.type === "string" &&
              part.type.startsWith("tool-") &&
              part.type !== "tool-error"
            ) {
              const toolType = part.type as `tool-${string}`;
              const toolPart = part as ToolUIPart;

              if (toolType === "tool-webSearch") {
                return (
                  <WebSearchDisplay
                    key={`${message.id}-${toolType}-${i}`}
                    toolPart={toolPart}
                  />
                );
              }

              return renderGenericTool(message.id, i, toolType, toolPart);
            }

            switch (part.type) {
              case "text":
                return (
                  <Response
                    key={`${message.id}-text-${i}`}
                    className="text-[1.1rem]"
                  >
                    {"text" in part ? part.text : ""}
                  </Response>
                );
              case "reasoning":
                return (
                  <Reasoning
                    key={`${message.id}-reasoning-${i}`}
                    className="w-full"
                    isStreaming={
                      props.chatStatus === "streaming" &&
                      props.isLatestMessage &&
                      i === message.parts.length - 1
                    }
                    defaultOpen
                  >
                    <ReasoningTrigger />
                    <ReasoningContent className="text-xs">
                      {part.text}
                    </ReasoningContent>
                  </Reasoning>
                );
              case "tool-error": {
                const toolPart = part as unknown as {
                  toolName?: string;
                  toolCallId?: string;
                  error?: unknown;
                  text?: string;
                  errorText?: string;
                };
                const toolType: `tool-${string}` = toolPart.toolName
                  ? (`tool-${toolPart.toolName}` as `tool-${string}`)
                  : "tool-error";

                return (
                  <Tool
                    key={`${message.id}-tool-error-${i}`}
                    defaultOpen={false}
                  >
                    <ToolHeader type={toolType} state="output-error" />
                    <ToolContent>
                      {toolPart.toolCallId && (
                        <div className="px-4 pt-4 text-xs text-muted-foreground">
                          Call ID: {toolPart.toolCallId}
                        </div>
                      )}
                      {toolPart.text && (
                        <div className="px-4 pt-2">
                          <div className="prose dark:prose-invert text-sm">
                            {toolPart.text}
                          </div>
                        </div>
                      )}
                      <ToolOutput
                        output={toolPart.error}
                        errorText={
                          toolPart.text ||
                          toolPart.errorText ||
                          "Tool execution failed"
                        }
                      />
                    </ToolContent>
                  </Tool>
                );
              }
              case "dynamic-tool": {
                const toolPart = part as DynamicToolUIPart;
                const toolType: `tool-${string}` = toolPart.toolName
                  ? (`tool-${toolPart.toolName}` as `tool-${string}`)
                  : "tool-dynamic";

                if (toolType === "tool-webSearch") {
                  return (
                    <WebSearchDisplay
                      key={`${message.id}-${toolType}-${i}`}
                      toolPart={toolPart}
                    />
                  );
                }

                return renderGenericTool(message.id, i, toolType, toolPart);
              }
              default:
                return null;
            }
          })}
        </MessageContent>
      </Message>
      {message.role === "assistant" && (
        <MessageToolbar>
          <MessageActions>
            {threadToken && onRegenerate && props.isLatestMessage && (
              <MessageAction
                label="Regenerate"
                onClick={handleRegenerate}
                disabled={isRegenerating}
                tooltip="Regenerate response"
              >
                <RotateCcwIcon
                  className={isRegenerating ? "animate-spin" : ""}
                />
              </MessageAction>
            )}
            <MessageAction
              label="Copy"
              onClick={handleCopyText}
              disabled={isRegenerating}
              tooltip="Copy to clipboard"
            >
              <CopyIcon />
            </MessageAction>
          </MessageActions>
        </MessageToolbar>
      )}
    </div>
  );
}
