import { createFileRoute } from "@tanstack/react-router";
import { ChatHistory } from "@/pages/chat-history";

export const Route = createFileRoute("/chats")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ChatHistory />;
}
