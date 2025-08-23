import { SignedIn, SignedOut } from "@daveyplate/better-auth-ui";
import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/components/landing-page";
import { NewChat } from "@/pages/new-chat";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <SignedIn>
        <NewChat />
      </SignedIn>
      <SignedOut>
        <LandingPage />
      </SignedOut>
    </>
  );
}
