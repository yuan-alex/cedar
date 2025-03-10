import { SignInButton } from "@clerk/nextjs";
import { Button } from "@radix-ui/themes";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-black pt-5">
      <nav className="p-5 bg-white dark:bg-zinc-900 rounded-xl shadow flex items-center mx-10">
        <div className="flex items-center space-x-3">
          <img className="w-10 h-10" src="/cedar.svg" />
          <p className="text-4xl font-medium">Cedar</p>
        </div>
        <div className="grow" />
      </nav>
      <p className="text-5xl md:text-8xl font-bold text-center mt-20">
        The Best AI Chatbot
      </p>
      <p className="text-2xl md:text-4xl text-center text-zinc-500 mt-5">
        Cedar is the AI workspace built for productivity.
      </p>
      <div className="flex justify-center mt-10">
        <SignInButton>
          <Button size="4">Sign in</Button>
        </SignInButton>
      </div>
    </div>
  );
}
