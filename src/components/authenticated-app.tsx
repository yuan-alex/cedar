import { Outlet } from "react-router";

import { CommandMenu } from "@/components/command-menu";
import { Sidebar } from "@/components/sidebar";

export function AuthenticatedApp() {
  return (
    <div className="flex divide-x divide-zinc-200 dark:divide-zinc-800 w-screen h-screen bg-zinc-100 dark:bg-zinc-900">
      <CommandMenu />
      <Sidebar />
      <div className="bg-white dark:bg-black grow overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
