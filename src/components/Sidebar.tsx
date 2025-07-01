import { UserButton } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { PlusCircleIcon } from "lucide-react";

import { ThreadSidebarMenuItem } from "@/components/thread-item";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { createQueryFn } from "@/utils/queries";

export function CedarSidebar() {
  const { data: threads } = useQuery({
    queryKey: ["sidebarThreads"],
    queryFn: createQueryFn("/api/v1/threads?take=15"),
  });

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 mb-2">
          <img className="w-6 h-6" src="/images/cedar.svg" />
          <p className="text-xl font-medium">Cedar</p>
          <div className="grow" />
        </div>
        <Link to="/">
          <Button variant="outline" style={{ width: "100%" }}>
            <PlusCircleIcon />
            New chat
          </Button>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Threads</SidebarGroupLabel>
          <SidebarMenu>
            {threads?.map((thread) => (
              <ThreadSidebarMenuItem key={thread.token} thread={thread} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {threads?.length > 0 && (
          <Link to="/chats" className="mx-3">
            <Button variant="outline" style={{ width: "100%" }}>
              See all threads
            </Button>
          </Link>
        )}
      </SidebarContent>
      <SidebarFooter>
        <UserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
