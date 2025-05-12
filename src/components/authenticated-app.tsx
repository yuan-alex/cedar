import { Outlet } from "@tanstack/react-router";

import { CommandMenu } from "@/components/command-menu";
import { CedarSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export function AuthenticatedApp() {
  return (
    <SidebarProvider className="h-screen w-screen">
      <CommandMenu />
      <CedarSidebar />
      <main className="w-full">
        <SidebarTrigger className="fixed m-2" />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
