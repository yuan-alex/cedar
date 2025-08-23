import { AuthView, SignedIn } from "@daveyplate/better-auth-ui";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";

export default function AuthPage() {
  const { authView } = useParams({
    from: "/auth/$authView",
    shouldThrow: true,
  });

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-gradient-to-b dark:from-black dark:to-zinc-800 text-zinc-900 dark:text-white">
      <SignedIn>
        <RedirectHome />
      </SignedIn>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-r from-indigo-500/10 to-purple-600/10 dark:from-indigo-500/20 dark:to-purple-600/20 blur-[120px] rounded-full opacity-30" />
        <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-gradient-to-l from-blue-500/10 to-cyan-500/10 dark:from-blue-500/15 dark:to-cyan-500/15 blur-[80px] rounded-full opacity-40" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/15 dark:to-pink-500/15 blur-[100px] rounded-full opacity-30" />
      </div>

      <div className="relative w-full max-w-md mx-auto px-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3">
            <img
              className="w-10 h-10"
              src="/images/cedar.svg"
              alt="Cedar Logo"
            />
            <span className="text-3xl font-medium text-zinc-900 dark:text-white">
              Cedar
            </span>
          </div>
        </div>

        <AuthView pathname={authView} />
      </div>
    </main>
  );
}

// This is a hack to redirect the user to the home page after they sign in
function RedirectHome() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/", replace: true });
  }, [navigate]);
  return null;
}
