import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Theme, ThemePanel } from "@radix-ui/themes";
import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

import { Sidebar } from "@/components/Sidebar";

import "@radix-ui/themes/styles.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const instrument_serif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Chat Gateway",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${instrument_serif.variable}`}>
          <Toaster position="bottom-right" />
          <Theme accentColor="gray" radius="large">
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
            <SignedIn>
              <div className="flex w-screen h-screen bg-zinc-100 dark:bg-zinc-950">
                <Sidebar />
                <div className="m-2 ml-0 rounded-xl shadow-sm bg-white dark:bg-zinc-900 grow overflow-y-auto">
                  {children}
                </div>
              </div>
            </SignedIn>
            <ThemePanel />
          </Theme>
        </body>
      </html>
    </ClerkProvider>
  );
}
