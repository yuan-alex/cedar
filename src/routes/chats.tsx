import { ChatHistory } from "@/pages/chat-history";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chats")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ChatHistory />;
}
