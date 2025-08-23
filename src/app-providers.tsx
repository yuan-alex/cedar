import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="cedar-ui-theme">
        <AuthQueryProvider>{children}</AuthQueryProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
