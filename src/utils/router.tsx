import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AppProviders } from "@/app-providers";
import { routeTree } from "@/routeTree.gen";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

export function RouterWithContext() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
