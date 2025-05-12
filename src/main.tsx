import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {} from "@tanstack/react-router-devtools";
import { ThemeProvider } from "next-themes";
import ReactDOM from "react-dom/client";

import { RouterWithContext } from "@/utils/router";

import "./index.css";

const queryClient = new QueryClient();

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <ThemeProvider defaultTheme="system" storageKey="cedar-ui-theme">
          <RouterWithContext />
        </ThemeProvider>
      </ClerkProvider>
    </QueryClientProvider>,
  );
}
