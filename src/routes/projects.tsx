import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/pages/projects";

export const Route = createFileRoute("/projects")({
  component: RouteComponent,
});

function RouteComponent() {
  const matchRoute = useMatchRoute();
  const hasChildRoute = matchRoute({ to: "/projects/$projectToken" });

  return (
    <>
      {!hasChildRoute && <ProjectsPage />}
      <Outlet />
    </>
  );
}
