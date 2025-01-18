import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Theme, ThemePanel } from "@radix-ui/themes";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";

import { Sidebar } from "@/components/Sidebar";

import "@radix-ui/themes/styles.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat Gateway"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider>
            <Theme accentColor="gray" radius="large">
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
              <SignedIn>
                <div className="flex w-screen h-screen bg-zinc-100 dark:bg-zinc-950">
                  <Sidebar />
                  <div className="m-2 ml-0 rounded-xl shadow bg-white dark:bg-zinc-900 flex-grow overflow-y-auto">
                    {children}
                  </div>
                </div>
              </SignedIn>
              <ThemePanel />
            </Theme>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
