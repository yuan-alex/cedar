"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiMessageSquare, FiPlus, FiSidebar } from "react-icons/fi";
import { FiPlusCircle } from "react-icons/fi";
import useSWR from "swr";

import { ThreadButton } from "@/components/ThreadButton";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function Sidebar() {
  const { data: threads } = useSWR("/api/threads?take=10", fetcher);
  const [open, setOpen] = useState<boolean>(true);

  useEffect(() => {
    function listener(event: KeyboardEvent) {
      if (event.shiftKey && event.metaKey && event.key === "s") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  function SidebarToggle() {
    return (
      <div className="cursor-pointer" onClick={() => setOpen((prev) => !prev)}>
        <FiSidebar />
      </div>
    );
  }

  if (!open) {
    return (
      <div className="py-5 px-3 flex flex-col items-center space-y-6">
        <SidebarToggle />
        <Link href="/">
          <FiPlus />
        </Link>
        <div className="grow" />
        <UserButton />
      </div>
    );
  }

  return (
    <div className="w-64 shrink-0 flex flex-col dark:divide-zinc-700">
      <div className="p-3">
        <div className="flex items-center space-x-2 mb-2">
          <FiMessageSquare />
          <p className="text-lg font-medium">Chat Gateway</p>
          <div className="grow" />
          <SidebarToggle />
        </div>
        <Link href="/">
          <div className="flex items-center gap-2 py-2 px-3 rounded bg-zinc-200 dark:bg-zinc-800">
            <FiPlusCircle />
            <p className="text-sm">New chat</p>
          </div>
        </Link>
      </div>
      <p className="px-3 font-medium">Recents</p>
      <div className="px-2 flex flex-col space-y-1 overflow-y-auto">
        {threads?.map((thread) => (
          <ThreadButton
            key={thread.id}
            className="first:mt-2 last:mb-2"
            thread={thread}
          />
        ))}
      </div>
      <Link href="/chats" className="text-sm font-medium px-3">
        See all
      </Link>
      <div className="grow" />
      <div className="p-3 flex items-center">
        <UserButton />
      </div>
    </div>
  );
}
