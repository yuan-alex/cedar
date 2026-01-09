import type { ChatStatus, DynamicToolUIPart, ToolUIPart, UIMessage } from "ai";
import {
  ChevronDownIcon,
  CopyIcon,
  ExternalLinkIcon,
  FileTextIcon,
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

function WebContentResult({
  result,
}: {
  result: {
    title?: string;
    url?: string;
    text?: string;
    publishedDate?: string;
    author?: string;
  };
}) {
  const hostname = result.url
    ? (() => {
        try {
          return new URL(result.url).hostname;
        } catch {
          return result.url;
        }
      })()
    : null;

  const metadata = [
    hostname,
    result.author,
    result.publishedDate
      ? new Date(result.publishedDate).toLocaleDateString()
      : null,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="group hover:bg-accent/50 transition-colors">
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between px-6 py-3"
      >
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm mb-0.5 truncate">
            {result.title || "Untitled"}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {metadata}
          </div>
        </div>
        <ExternalLinkIcon className="size-3.5 shrink-0 text-muted-foreground ml-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
    </div>
  );
}

function FetchWebContentDisplay({
  toolPart,
}: {
  toolPart: ToolUIPart | DynamicToolUIPart;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const hasInput = "input" in toolPart && toolPart.input !== undefined;
  const hasOutput = "output" in toolPart && toolPart.output !== undefined;
  const hasErrorText =
    "errorText" in toolPart && toolPart.errorText !== undefined;

  const urls =
    hasInput &&
    typeof toolPart.input === "object" &&
    toolPart.input !== null &&
    "urls" in toolPart.input &&
    Array.isArray(toolPart.input.urls)
      ? (toolPart.input.urls as string[])
      : null;

  if (!urls || urls.length === 0) {
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

  const urlCount = urls.length;
  const resultsCount = outputWithResults?.results.length ?? 0;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full min-w-full"
    >
      <div className="w-full rounded-md border bg-muted/30 overflow-hidden">
        <CollapsibleTrigger
          className={cn(
            "flex w-full items-center justify-between gap-2 px-3 py-2 text-left transition-colors hover:bg-muted/50",
            hasResults && "cursor-pointer",
          )}
          disabled={!hasResults}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-sm text-foreground min-w-0">
              <span className="text-muted-foreground">
                Fetched content from:
              </span>{" "}
              <span className="font-medium">
                {urlCount} {urlCount === 1 ? "URL" : "URLs"}
              </span>
              {resultsCount > 0 && (
                <span className="text-muted-foreground ml-1">
                  ({resultsCount} {resultsCount === 1 ? "result" : "results"})
                </span>
              )}
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
            <div className="py-2">
              {outputWithResults?.results.map((result, index: number) => (
                <WebContentResult key={result.url || index} result={result} />
              ))}
            </div>
          </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  );
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
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full min-w-full"
    >
      <div className="w-full rounded-md border bg-muted/30 overflow-hidden">
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
            <div className="py-2">
              {outputWithResults?.results.map((result, index: number) => {
                const hostname = result.url
                  ? (() => {
                      try {
                        return new URL(result.url).hostname;
                      } catch {
                        return result.url;
                      }
                    })()
                  : null;

                const metadata = [
                  hostname,
                  result.author,
                  result.publishedDate
                    ? new Date(result.publishedDate).toLocaleDateString()
                    : null,
                ]
                  .filter(Boolean)
                  .join(" • ");

                return (
                  <div
                    key={result.url || index}
                    className="group hover:bg-accent/50 transition-colors"
                  >
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-6 py-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm mb-0.5 truncate">
                          {result.title || "Untitled"}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {metadata}
                        </div>
                      </div>
                      <ExternalLinkIcon className="size-3.5 shrink-0 text-muted-foreground ml-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                );
              })}
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
    <Tool
      key={`${messageId}-${toolType}-${partIndex}`}
      defaultOpen={false}
      className="w-full min-w-full mb-0"
    >
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
        <MessageContent className="gap-4">
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

              if (toolType === "tool-fetchWebContent") {
                return (
                  <FetchWebContentDisplay
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
                    className="w-full min-w-full mb-0"
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

                if (toolType === "tool-fetchWebContent") {
                  return (
                    <FetchWebContentDisplay
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
