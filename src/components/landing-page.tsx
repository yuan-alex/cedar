import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check user's preferred color scheme
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setIsDarkMode(prefersDark);

      // Apply theme class to document
      document.documentElement.classList.toggle("dark", prefersDark);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gradient-to-b dark:from-black dark:to-zinc-800 text-zinc-900 dark:text-white">
      <header
        className={`fixed w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-black/80 backdrop-blur-md py-4 shadow-sm dark:shadow-none"
            : "bg-transparent py-6"
        } z-50`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <img className="w-8 h-8" src="/images/cedar.svg" alt="Cedar Logo" />
            <span className="text-2xl font-medium text-zinc-900 dark:text-white">
              Cedar
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                Pricing
              </a>
              <a
                href="#docs"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                Documentation
              </a>
            </nav>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
              aria-label="Toggle theme"
              type="button"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/auth/$path" params={{ path: "signin" }}>
              <Button
                variant="outline"
                className="border-gray-300 hover:border-gray-400 dark:border-zinc-700 dark:hover:border-zinc-500 transition-colors"
              >
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-r from-indigo-500/10 to-purple-600/10 dark:from-indigo-500/20 dark:to-purple-600/20 blur-[120px] rounded-full opacity-30" />
            <div className="relative text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 mx-auto max-w-4xl leading-tight bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
                The Best AI Chat Platform
              </h1>
              <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-10 mx-auto max-w-2xl leading-relaxed">
                The enterprise-ready AI platform built for productivity,
                security, and performance.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" variant="outline">
                  Get Started
                </Button>
                <Button size="lg" variant="ghost">
                  View Demo
                </Button>
              </div>
            </div>
            <div className="mt-20 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-100 to-transparent dark:from-black dark:to-transparent h-40 bottom-0 z-10" />
              <div className="rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-500/5">
                <div
                  style={{
                    width: 1920,
                    height: 1080,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-zinc-800 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <img
                className="w-12 h-12"
                src="/images/cedar.svg"
                alt="Cedar Logo"
              />
              <span className="text-5xl font-medium text-zinc-900 dark:text-white">
                Cedar
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-zinc-500">
              <a
                href="#"
                className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                Security
              </a>
              <a
                href="#"
                className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                Status
              </a>
              <a
                href="#"
                className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                Contact
              </a>
            </div>
            <div className="mt-6 md:mt-0 text-zinc-500 text-sm">
              © {new Date().getFullYear()} Cedar. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
