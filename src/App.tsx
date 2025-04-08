import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";

import { Sidebar } from "@/components/Sidebar";
import { LandingPage } from "@/components/landing-page";
import { Chat } from "@/pages/Chat";
import { ChatHistory } from "@/pages/ChatHistory";
import { NewChat } from "@/pages/NewChat";

import "./index.css";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <ThemeProvider attribute="class">
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <SignedIn>
                      <div className="flex divide-x divide-zinc-200 dark:divide-zinc-800 w-screen h-screen bg-zinc-100 dark:bg-zinc-900">
                        <Sidebar />
                        <div className="bg-white dark:bg-black grow overflow-y-auto">
                          <Outlet />
                        </div>
                      </div>
                    </SignedIn>
                    <SignedOut>
                      <LandingPage />
                    </SignedOut>
                  </>
                }
              >
                <Route index element={<NewChat />} />
                <Route path="/chats" element={<ChatHistory />} />
                <Route path="/chat/:threadToken" element={<Chat />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster />
        </ThemeProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}

export default App;
