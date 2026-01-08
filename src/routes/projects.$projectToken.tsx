import { createFileRoute } from "@tanstack/react-router";
import { ProjectPage } from "@/pages/project";

export const Route = createFileRoute("/projects/$projectToken")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProjectPage />;
}
