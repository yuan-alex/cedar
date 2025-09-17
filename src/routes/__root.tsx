import { SignedIn, SignedOut } from "@daveyplate/better-auth-ui";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { BetterAuthUiProvider } from "@/better-auth-ui-provider";

import { AuthenticatedApp } from "@/components/authenticated-app";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <BetterAuthUiProvider>
      <SignedIn>
        <AuthenticatedApp />
      </SignedIn>
      <SignedOut>
        <Outlet />
      </SignedOut>
      {process.env.NODE_ENV === "development" && <DevTools />}
    </BetterAuthUiProvider>
  );
}

function DevTools() {
  try {
    // Dynamic imports for dev dependencies to avoid build errors in production
    const { ReactQueryDevtools } = require("@tanstack/react-query-devtools");
    const {
      TanStackRouterDevtools,
    } = require("@tanstack/react-router-devtools");

    return (
      <>
        <TanStackRouterDevtools position="top-right" />
        <ReactQueryDevtools />
      </>
    );
  } catch (error) {
    // Dev tools not available, skip silently
    return null;
  }
}
