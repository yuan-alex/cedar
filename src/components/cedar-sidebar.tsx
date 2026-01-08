import { UserButton } from "@daveyplate/better-auth-ui";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { FolderIcon, PlusCircleIcon, Shield } from "lucide-react";
import { CreateProjectDialog } from "@/components/create-project-dialog";
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
import { createQueryFn, fetchProjects } from "@/utils/queries";

const cedarIcon = "/images/cedar.svg";

export function CedarSidebar() {
  const { data: threads } = useQuery({
    queryKey: ["sidebarThreads"],
    queryFn: createQueryFn("/api/v1/threads?take=15"),
  });

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: () =>
      authClient
        .getSession()
        .then((session) => session?.data?.user?.role === "admin"),
  });

  // Filter unassigned threads
  const unassignedThreads: Array<{
    token: string;
    name: string;
    lastMessagedAt: string;
    createdAt: string;
  }> = [];

  threads?.forEach((thread) => {
    if (!thread.projectId) {
      unassignedThreads.push(thread);
    }
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
          <div className="flex items-center justify-between mb-2">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <CreateProjectDialog>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <PlusCircleIcon className="h-4 w-4" />
              </Button>
            </CreateProjectDialog>
          </div>
          {projects && projects.length > 0 && (
            <SidebarMenu>
              {projects.map((project) => (
                <SidebarMenuItem key={project.token}>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/projects/$projectToken"
                      params={{ projectToken: project.token }}
                    >
                      <FolderIcon className="h-4 w-4" />
                      <span>{project.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          )}
          <Link to="/projects" className="block mt-2">
            <Button variant="outline" style={{ width: "100%" }}>
              <FolderIcon className="h-4 w-4 mr-2" />
              View all projects
            </Button>
          </Link>
        </SidebarGroup>

        {unassignedThreads.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Uncategorized</SidebarGroupLabel>
            <SidebarMenu>
              {unassignedThreads.map((thread) => (
                <ThreadSidebarMenuItem key={thread.token} thread={thread} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {threads && threads.length > 0 && (
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
