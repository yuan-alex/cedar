import { UserButton } from "@clerk/clerk-react";
import { useStore } from "@nanostores/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { FiPlus, FiSidebar } from "react-icons/fi";
import { FiPlusCircle } from "react-icons/fi";
import { Link } from "react-router";

import { ThreadButton } from "@/components/ThreadButton";
import { Button } from "@/components/ui/button";
import { createQueryFn } from "@/utils/queries";
import { $sidebarOpen } from "@/utils/stores";

export function Sidebar() {
  const sidebarOpen = useStore($sidebarOpen);

  const { data: threads } = useQuery({
    queryKey: ["sidebarThreads"],
    queryFn: createQueryFn("/api/threads?take=10"),
  });

  function toggleSidebar() {
    if ($sidebarOpen.get() === "true") {
      $sidebarOpen.set("false");
    } else {
      $sidebarOpen.set("true");
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    function listener(event: KeyboardEvent) {
      if (event.shiftKey && event.metaKey && event.key === "s") {
        event.preventDefault();
        toggleSidebar();
      }
    }
    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  function SidebarToggle() {
    return (
      <div className="cursor-pointer" onClick={toggleSidebar}>
        <FiSidebar />
      </div>
    );
  }

  if (sidebarOpen === "false") {
    return (
      <div className="p-3 flex flex-col items-center space-y-5">
        <img className="w-6 h-6" src="/cedar.svg" />
        <SidebarToggle />
        <Link to="/">
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
          <img className="w-6 h-6" src="/cedar.svg" />
          <p className="text-xl font-medium">Cedar</p>
          <div className="grow" />
          <SidebarToggle />
        </div>
        <Link to="/">
          <Button variant="outline" style={{ width: "100%" }}>
            <FiPlusCircle />
            New chat
          </Button>
        </Link>
      </div>
      <p className="px-3 font-medium mb-2">Recent chats</p>
      <div className="px-2 flex flex-col space-y-1 overflow-y-auto mb-2">
        {threads?.map((thread) => (
          <ThreadButton
            key={thread.token}
            className="first:mt-2 last:mb-2"
            thread={thread}
          />
        ))}
      </div>
      {threads?.length > 0 && (
        <Link to="/chats" className="mx-3">
          <Button variant="outline" style={{ width: "100%" }}>
            See all threads
          </Button>
        </Link>
      )}
      <div className="grow" />
      <div className="p-3 flex items-center">
        <UserButton />
      </div>
    </div>
  );
}
