import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";

import { AuthenticatedApp } from "@/components/authenticated-app";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <SignedIn>
        <AuthenticatedApp />
      </SignedIn>
      <SignedOut>
        <Outlet />
      </SignedOut>
      <TanStackRouterDevtools position="top-right" />
      <ReactQueryDevtools />
    </React.Fragment>
  );
}
