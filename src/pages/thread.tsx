import { useChat } from "@ai-sdk/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { CedarMessage } from "@/components/cedar-message";
import { InputBox } from "@/components/input-box";
import { createQueryFn } from "@/utils/queries";
import { $mcpSelectedServers, $model, $prompt } from "@/utils/stores";
import { Loader } from "@/components/ai-elements/loader";

export function Thread() {
  const { threadToken } = useParams({ from: "/chat/$threadToken" });
  const [showDebug, setShowDebug] = useState(false);
  const queryClient = useQueryClient();

  const { data: thread } = useQuery({
    queryKey: [`thread_${threadToken}`],
    queryFn: createQueryFn(`/api/v1/threads/${threadToken}`),
  });

  const [input, setInput] = useState("");
  const {
    messages,
    setMessages,
    sendMessage,
    status: chatStatus,
  } = useChat({
    id: threadToken,
    generateId: () => crypto.randomUUID(),
    transport: new DefaultChatTransport({
      api: `/api/v1/threads/${threadToken}`,
      credentials: "include",
      prepareSendMessagesRequest: (request) => ({
        body: {
          model: $model?.get().id,
          newMessage: request.messages[request.messages.length - 1],
          mcpServers: $mcpSelectedServers.value
            ? $mcpSelectedServers.value.split(",").filter(Boolean)
            : [],
        },
      }),
    }),
    experimental_throttle: 50,
    onFinish: () => {
      queryClient.invalidateQueries({ queryKey: ["sidebarThreads"] });
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: sendMessage dependency would cause infinite re-renders
  useEffect(() => {
    const prompt = $prompt.value;

    if (threadToken && thread) {
      if (thread.messages.length === 0 && prompt) {
        sendMessage({ text: prompt });
        $prompt.set("");
      } else {
        setMessages(thread.uiMessages);
      }
    }
  }, [thread, threadToken]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <div className="relative size-full h-screen">
      <div className="flex flex-col h-full min-h-0">
        <Conversation initial="instant" resize="instant">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="Start a conversation"
                description="Type a message below to begin chatting"
              />
            ) : (
              <div className="flex flex-col max-w-4xl mx-auto">
                {messages.map((msg) => (
                  <CedarMessage
                    key={msg.id}
                    message={msg}
                    chatStatus={chatStatus}
                    isLatestMessage={msg.id === messages.at(-1)?.id}
                  />
                ))}
              </div>
            )}
            {status === "submitted" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        <div className="w-full max-w-4xl mx-auto mb-2">
          <form onSubmit={handleSubmit}>
            <InputBox
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </form>
        </div>
      </div>

      {process.env.NODE_ENV === "development" && (
        <>
          <div className="fixed bottom-16 right-4 z-50 w-[28rem] max-h-[60vh] overflow-auto rounded border border-zinc-700 bg-black/90 p-3 text-green-200">
            {showDebug ? (
              <pre className="whitespace-pre-wrap break-words text-xs font-mono">
                {JSON.stringify(messages, null, 2)}
              </pre>
            ) : (
              <div className="text-xs text-zinc-300">Debug panel hidden</div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowDebug((v) => !v)}
            className="fixed bottom-4 right-4 z-50 rounded bg-zinc-800 px-3 py-1.5 text-xs text-white shadow hover:bg-zinc-700"
          >
            {showDebug ? "Hide messages" : "Show messages"}
          </button>
        </>
      )}
    </div>
  );
}
