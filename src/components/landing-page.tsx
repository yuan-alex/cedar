import { SignInButton } from "@clerk/clerk-react";

import { Button } from "@/components/ui/button";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-black">
      <div className="flex justify-center items-center space-x-3 py-10">
        <img className="w-10 h-10" src="/cedar.svg" />
        <p className="text-4xl font-medium">Cedar</p>
      </div>
      <div className="p-50 mx-10 text-center bg-white shadow rounded-xl">
        <p className="text-5xl md:text-7xl font-bold mb-8">
          The Power User's LLM
        </p>
        <p className="text-2xl md:text-3xl text-zinc-500 mb-8">
          The enterprise-ready AI platform built for productivity.
        </p>
        <SignInButton>
          <Button size="lg">Sign in</Button>
        </SignInButton>
      </div>
    </div>
  );
}
