import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router";

import { AuthenticatedApp } from "@/components/AuthenticatedApp";
import { LandingPage } from "@/components/landing-page";
import { ThemeProvider } from "@/components/theme-provider";
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
        <ThemeProvider defaultTheme="system" storageKey="cedar-ui-theme">
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <SignedIn>
                      <AuthenticatedApp />
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
