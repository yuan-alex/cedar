import { useUser } from "@clerk/clerk-react";
import { RouterProvider, createRouter } from "@tanstack/react-router";

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
  const { isSignedIn } = useUser();

  return <RouterProvider router={router} context={{ auth: { isSignedIn } }} />;
}
