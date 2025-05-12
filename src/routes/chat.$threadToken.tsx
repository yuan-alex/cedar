import { createFileRoute } from "@tanstack/react-router";

import { Chat } from "@/pages/chat";

export const Route = createFileRoute("/chat/$threadToken")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Chat />;
}
