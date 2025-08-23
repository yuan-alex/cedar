import { useQueryClient } from "@tanstack/react-query";
import { Outlet } from "@tanstack/react-router";

import { CedarSidebar } from "@/components/cedar-sidebar";
import { CommandMenu } from "@/components/command-menu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createQueryFn } from "@/utils/queries";

export function AuthenticatedApp() {
  const queryClient = useQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["models"],
    queryFn: createQueryFn("/api/v1/models"),
  });

  return (
    <SidebarProvider className="h-screen w-screen overflow-hidden">
      <CommandMenu />
      <CedarSidebar />
      <main className="w-full h-full overflow-hidden">
        <SidebarTrigger className="fixed m-2" />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
