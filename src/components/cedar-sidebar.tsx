import { UserButton } from "@daveyplate/better-auth-ui";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { PlusCircleIcon, Shield } from "lucide-react";

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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { authClient } from "@/utils/auth";
import { createQueryFn } from "@/utils/queries";
import cedarIcon from "../public/images/cedar.svg";

export function CedarSidebar() {
  const { data: threads } = useQuery({
    queryKey: ["sidebarThreads"],
    queryFn: createQueryFn("/api/v1/threads?take=15"),
  });

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: () =>
      authClient
        .getSession()
        .then((session) => session?.data?.user?.role === "admin"),
  });

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 mb-2">
          <img className="w-6 h-6" src={cedarIcon} alt="Cedar Logo" />
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

        {isAdmin === true && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin">
                    <Shield className="h-4 w-4" />
                    <span>User Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <UserButton variant="outline" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
