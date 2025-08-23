import { createFileRoute } from "@tanstack/react-router";

import { Thread } from "@/pages/thread";

export const Route = createFileRoute("/chat/$threadToken")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Thread />;
}
