import type { UIMessage } from "ai";
import { ChevronDownIcon, CopyIcon, WrenchIcon } from "lucide-react";
import { toast } from "sonner";

import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";

import { Button } from "@/components/ui/button";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";

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
        <MessageContent variant="flat">
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
                  <details
                    key={`${message.id}-tool-error-${i}`}
                    className="group mb-3 border border-red-200 dark:border-red-900/50 rounded-lg bg-red-50/40 dark:bg-red-950/10 overflow-hidden"
                  >
                    <summary className="flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-red-50/60 dark:hover:bg-red-900/20 transition-colors duration-200">
                      <WrenchIcon className="h-3.5 w-3.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <span className="text-sm text-red-700 dark:text-red-300 flex-grow">
                        Tool error{toolName ? `: ${toolName}` : ""}
                      </span>
                      <ChevronDownIcon className="h-3.5 w-3.5 text-red-600 dark:text-red-400 transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <div className="p-3 text-xs max-w-none overflow-auto">
                      {toolCallId ? (
                        <div className="mb-2 text-red-700 dark:text-red-300">
                          id: {toolCallId}
                        </div>
                      ) : null}
                      {text ? (
                        <div className="prose dark:prose-invert">{text}</div>
                      ) : null}
                      {errorVal !== undefined ? (
                        <pre className="mt-2 text-[11px] leading-relaxed whitespace-pre-wrap text-red-800 dark:text-red-200">
                          {(() => {
                            try {
                              return JSON.stringify(errorVal, null, 2);
                            } catch {
                              return String(errorVal);
                            }
                          })()}
                        </pre>
                      ) : null}
                    </div>
                  </details>
                );
              }
              case "dynamic-tool": {
                const toolName = (part as unknown as { toolName?: string })
                  .toolName;
                const state = (part as unknown as { state?: string }).state;
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

                const stateLabel = state
                  ? state.replace(/-/g, " ")
                  : "invocation";

                return (
                  <details
                    key={`${message.id}-dynamic-tool-${i}`}
                    className="group mb-3 border border-zinc-100 dark:border-zinc-800/40 rounded-lg bg-zinc-50/20 dark:bg-zinc-950/10 overflow-hidden"
                  >
                    <summary className="flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 transition-colors duration-200">
                      <WrenchIcon className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400 flex-grow">
                        Tool: {toolName ?? "dynamic"}
                      </span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {stateLabel}
                      </span>
                      <ChevronDownIcon className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <div className="p-3 bg-white/20 dark:bg-zinc-950/20 text-xs max-w-none overflow-auto">
                      {toolCallId ? (
                        <div className="mb-2 text-zinc-500">
                          id: {toolCallId}
                        </div>
                      ) : null}
                      {typeof providerExecuted === "boolean" ? (
                        <div className="mb-2 text-zinc-500">
                          executed: {providerExecuted ? "yes" : "no"}
                        </div>
                      ) : null}
                      {input !== undefined ? (
                        <>
                          <div className="mb-1 font-medium">Input</div>
                          <pre className="text-[11px] leading-relaxed whitespace-pre-wrap">
                            {(() => {
                              try {
                                return JSON.stringify(input, null, 2);
                              } catch {
                                return String(input);
                              }
                            })()}
                          </pre>
                        </>
                      ) : null}
                      {output !== undefined ? (
                        <>
                          <div className="mt-2 mb-1 font-medium">Output</div>
                          {typeof output === "string" ? (
                            <div className="prose dark:prose-invert">
                              {output}
                            </div>
                          ) : (
                            <pre className="text-[11px] leading-relaxed whitespace-pre-wrap">
                              {(() => {
                                try {
                                  return JSON.stringify(output, null, 2);
                                } catch {
                                  return String(output);
                                }
                              })()}
                            </pre>
                          )}
                        </>
                      ) : null}
                      {errorText ? (
                        <div className="mt-2 text-red-600 dark:text-red-400">
                          {errorText}
                        </div>
                      ) : null}
                    </div>
                  </details>
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
