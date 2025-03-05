import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { Badge, Theme, ThemePanel } from "@radix-ui/themes";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
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
                <div className="flex w-screen h-screen">
                  <div className="flex justify-center items-center mx-auto w-1/3 bg-zinc-100 dark:bg-zinc-900">
                    <SignIn />
                  </div>
                  <div className="p-12 grow shadow">
                    <div className="flex items-end space-x-4 mb-10">
                      <img className="w-16 h-16" src="/cedar.svg" />
                      <p className="text-6xl font-semibold">Cedar</p>
                    </div>
                    <p className="text-3xl font-serif mb-4">
                      The AI workspace built for productivity.
                    </p>
                  </div>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex w-screen h-screen bg-zinc-100 dark:bg-black">
                  <Sidebar />
                  <div className="shadow bg-white dark:bg-zinc-950 grow overflow-y-auto">
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
