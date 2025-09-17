import type { UIMessage } from "ai";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";

import { Button } from "@/components/ui/button";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";

interface IMessageProps {
  message: UIMessage;
  chatStatus: any;
}

export function CedarMessage(props: IMessageProps) {
  const { message } = props;

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

  return (
    <div>
      <Message from={message.role}>
        <MessageContent variant="flat" className="w-full">
          {message.parts?.map((part, i) => {
            switch (part.type) {
              case "text":
                return (
                  <Response key={`${message.id}-text-${i}`} className="text-lg">
                    {"text" in part ? part.text : ""}
                  </Response>
                );
              case "reasoning":
                return (
                  <Reasoning
                    key={`${message.id}-reasoning-${i}`}
                    className="w-full"
                    defaultOpen={false}
                    isStreaming={props.chatStatus === "streaming"}
                  >
                    <ReasoningTrigger />
                    <ReasoningContent className="text-xs">
                      {part.text}
                    </ReasoningContent>
                  </Reasoning>
                );
              case "tool-error": {
                const toolName = (part as unknown as { toolName?: string })
                  .toolName;
                const toolCallId = (part as unknown as { toolCallId?: string })
                  .toolCallId;
                const errorVal = (part as unknown as { error?: unknown }).error;
                const text = (part as unknown as { text?: string }).text;

                return (
                  <Tool
                    key={`${message.id}-tool-error-${i}`}
                    defaultOpen={false}
                  >
                    <ToolHeader
                      type={toolName ? `tool-${toolName}` : "tool-error"}
                      state="output-error"
                    />
                    <ToolContent>
                      {toolCallId && (
                        <div className="px-4 pt-4 text-xs text-muted-foreground">
                          Call ID: {toolCallId}
                        </div>
                      )}
                      {text && (
                        <div className="px-4 pt-2">
                          <div className="prose dark:prose-invert text-sm">
                            {text}
                          </div>
                        </div>
                      )}
                      <ToolOutput
                        output={errorVal}
                        errorText={text || "Tool execution failed"}
                      />
                    </ToolContent>
                  </Tool>
                );
              }
              case "dynamic-tool": {
                const toolName = (part as unknown as { toolName?: string })
                  .toolName;
                const toolCallId = (part as unknown as { toolCallId?: string })
                  .toolCallId;
                const providerExecuted = (
                  part as unknown as {
                    providerExecuted?: boolean;
                  }
                ).providerExecuted;
                const input = (part as unknown as { input?: unknown }).input;
                const output = (part as unknown as { output?: unknown }).output;
                const errorText = (
                  part as unknown as {
                    errorText?: string;
                  }
                ).errorText;

                // Map dynamic-tool state to ToolUIPart state
                const getToolState = ():
                  | "input-streaming"
                  | "input-available"
                  | "output-available"
                  | "output-error" => {
                  if (errorText) return "output-error";
                  if (output !== undefined) return "output-available";
                  if (input !== undefined) return "input-available";
                  return "input-streaming";
                };

                return (
                  <Tool
                    key={`${message.id}-dynamic-tool-${i}`}
                    defaultOpen={false}
                  >
                    <ToolHeader
                      type={toolName ? `tool-${toolName}` : "tool-dynamic"}
                      state={getToolState()}
                    />
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
                      {input !== undefined && <ToolInput input={input} />}
                      {(output !== undefined || errorText) && (
                        <ToolOutput output={output} errorText={errorText} />
                      )}
                    </ToolContent>
                  </Tool>
                );
              }
            }
          })}
        </MessageContent>
      </Message>
      {message.role === "assistant" ? (
        <div className="flex gap-4 mb-4">
          <Button
            className="cursor-pointer"
            variant="ghost"
            onClick={handleCopyText}
          >
            <CopyIcon />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
