import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Building2,
  Database,
  FileText,
  History,
  MessageSquare,
  Moon,
  Plug,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import cedarIcon from "@/public/images/cedar.svg";

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
            ? "bg-white/80 dark:bg-black/80 backdrop-blur-md py-3 shadow-sm dark:shadow-none"
            : "bg-transparent py-5"
        } z-50`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <img className="w-8 h-8" src={cedarIcon} alt="Cedar Logo" />
            <span className="text-2xl font-medium text-zinc-900 dark:text-white">
              Cedar
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-8">
              <a
                href="#platform"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                Platform
              </a>
              <a
                href="#security"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                Security
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
            <Link to="/auth/$authView" params={{ authView: "signin" }}>
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

      <main className="flex-1 pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-purple-600/10 to-transparent dark:from-indigo-500/20 dark:via-purple-600/20 dark:to-transparent blur-[120px] rounded-full opacity-40" />
            <section className="relative text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/70 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/50 px-3 py-1 text-xs text-zinc-600 dark:text-zinc-300 backdrop-blur">
                <span>AI chat for every team</span>
              </div>
              <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight mx-auto max-w-5xl leading-[1.05] text-zinc-900 dark:text-white">
                Enterprise AI chat on any model
              </h1>
              <p className="mt-6 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mx-auto max-w-3xl">
                One chat experience across OpenAI, Anthropic, Google, Meta and
                open models. Threads, memory, tools, knowledge, and admin
                controls—without vendor lock‑in.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/auth/$authView" params={{ authView: "signin" }}>
                  <Button size="lg" className="px-6">
                    Sign in
                  </Button>
                </Link>
                <a href="#contact" className="inline-flex">
                  <Button size="lg" variant="outline" className="px-6">
                    Talk to sales
                  </Button>
                </a>
              </div>
              {/* Removed SOC 2 mention */}
            </section>

            <section aria-label="Customer logos" className="relative mb-16">
              <div className="mx-auto max-w-5xl">
                <div className="flex justify-center items-center gap-8 md:gap-12 text-zinc-400 dark:text-zinc-500">
                  {[
                    "Stark Industries",
                    "Wayne Enterprises",
                    "Hooli Technologies",
                    "Cyberdyne Systems",
                    "Acme Corp",
                  ].map((logo) => (
                    <span
                      key={logo}
                      className="text-xs md:text-sm tracking-widest uppercase opacity-70 whitespace-nowrap"
                    >
                      {logo}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <div className="mt-12 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-100 to-transparent dark:from-black dark:to-transparent h-40 bottom-0 z-10" />
              <div className="rounded-2xl border border-gray-200/70 dark:border-zinc-800 overflow-hidden shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-500/5 bg-white/40 dark:bg-zinc-950/50 backdrop-blur">
                <div className="aspect-[16/9] w-full flex items-center justify-center">
                  <div className="w-full h-full bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:20px_20px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/70 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/50 px-3 py-1 text-xs text-zinc-600 dark:text-zinc-300 backdrop-blur">
                        <span>Product preview</span>
                      </div>
                      <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                        Replace with a short demo or screenshot
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section id="platform" className="mt-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <MessageSquare className="h-5 w-5" />,
                  title: "Unified chat",
                  desc: "One interface for OpenAI, Anthropic, Google, Meta and self‑hosted models.",
                },
                {
                  icon: <History className="h-5 w-5" />,
                  title: "Threads & memory",
                  desc: "Persistent context and shared history so chats pick up where you left off.",
                },
                {
                  icon: <FileText className="h-5 w-5" />,
                  title: "Docs & attachments",
                  desc: "Drop in files, images and structured data. Ask questions across content.",
                },
                {
                  icon: <Plug className="h-5 w-5" />,
                  title: "Tools & integrations",
                  desc: "Call internal APIs and services. Connect Slack, GitHub, Jira and more.",
                },
                {
                  icon: <Database className="h-5 w-5" />,
                  title: "Knowledge & RAG",
                  desc: "Bring warehouses, vectors and drives to ground responses in your data.",
                },
                {
                  icon: <BarChart3 className="h-5 w-5" />,
                  title: "Admin & analytics",
                  desc: "Usage insights, budgets and routing to balance quality, speed and cost.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="group rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 backdrop-blur p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200">
                    {f.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="security" className="mt-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-8 md:p-10">
              <div className="md:flex md:items-start md:justify-between gap-8">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/70 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/50 px-3 py-1 text-xs text-zinc-600 dark:text-zinc-300 backdrop-blur">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Teams & administration</span>
                  </div>
                  <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-zinc-900 dark:text-white">
                    Roll out chat to the whole company
                  </h2>
                  <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                    Workspaces, roles and model policies so you can give every
                    team the right capabilities while keeping spend and data in
                    control.
                  </p>
                </div>
                <ul className="mt-6 md:mt-0 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  {[
                    "Workspaces & roles",
                    "Org templates & prompts",
                    "Message retention controls",
                    "Model routing policies",
                    "Usage budgets & alerts",
                    "Export chats & transcripts",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 p-8 md:p-10 text-center">
              <h3 className="text-2xl md:text-3xl font-semibold text-zinc-900 dark:text-white">
                Ship AI safely at scale
              </h3>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Start in minutes, graduate to global deployment. Run in our
                cloud, your VPC, or fully on‑premise.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/auth/$authView" params={{ authView: "signin" }}>
                  <Button size="lg" className="px-6">
                    Get started
                  </Button>
                </Link>
                <a href="#contact" className="inline-flex">
                  <Button size="lg" variant="outline" className="px-6">
                    Book a demo
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 dark:border-zinc-800 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <span className="text-5xl font-medium text-zinc-900 dark:text-white">
                Cedar
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-zinc-500">
              <a
                href="/terms"
                className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                Terms
              </a>
              <a
                href="/privacy"
                className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#security"
                className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                Security
              </a>
              <a
                href="/status"
                className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                Status
              </a>
              <a
                href="/contact"
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
