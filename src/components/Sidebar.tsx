"use client";

import { UserButton } from "@clerk/nextjs";
import { Button } from "@radix-ui/themes";
import Link from "next/link";
import { useState } from "react";
import { FiMessageSquare, FiPlus, FiSidebar } from "react-icons/fi";
import useSWR from "swr";

import { ThreadButton } from "@/components/ThreadButton";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function Sidebar() {
  const { data: threads } = useSWR("/api/threads", fetcher);
  const [open, setOpen] = useState<boolean>(true);

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
        <div className="flex-grow" />
        <UserButton />
      </div>
    );
  }

  return (
    <div className="w-64 flex-shrink-0 flex flex-col divide-y dark:divide-zinc-700">
      <div className="p-3">
        <div className="flex items-center space-x-2 mb-2">
          <FiMessageSquare />
          <p className="text-lg font-medium">Chat Gateway</p>
          <div className="flex-grow" />
          <SidebarToggle />
        </div>
        <Link href="/">
          <Button>Start new chat</Button>
        </Link>
      </div>
      <div className="px-2 flex-grow flex flex-col space-y-1 overflow-y-auto">
        {threads?.map((thread) => (
          <ThreadButton key={thread.id} thread={thread} />
        ))}
      </div>
      <div className="p-3 flex items-center">
        <UserButton />
      </div>
    </div>
  );
}
