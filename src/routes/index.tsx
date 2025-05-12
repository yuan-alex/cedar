import { LandingPage } from "@/components/landing-page";
import { NewChat } from "@/pages/new-chat";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";

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
