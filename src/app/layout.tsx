import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { Theme, ThemePanel } from "@radix-ui/themes";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Instrument_Serif, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

import { Sidebar } from "@/components/Sidebar";
import { LandingPage } from "@/components/landing-page";

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
  title: "Cedar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/cedar.svg" sizes="any" type="image/svg+xml" />
        </head>
        <body className={`${inter.variable} ${instrument_serif.variable}`}>
          <Toaster position="bottom-right" />
          <ThemeProvider attribute="class">
            <Theme accentColor="gray" radius="large">
              <SignedOut>
                <LandingPage />
              </SignedOut>
              <SignedIn>
                <div className="flex divide-x divide-zinc-200 dark:divide-zinc-800 w-screen h-screen bg-zinc-100 dark:bg-black">
                  <Sidebar />
                  <div className="bg-white dark:bg-black grow overflow-y-auto">
                    {children}
                  </div>
                </div>
              </SignedIn>
              {process.env.NODE_ENV === "development" && (
                <ThemePanel defaultOpen={false} />
              )}
            </Theme>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
