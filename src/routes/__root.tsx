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
    </BetterAuthUiProvider>
  );
}
