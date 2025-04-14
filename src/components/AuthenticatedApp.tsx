import { Outlet } from "react-router";

import { CommandMenu } from "@/components/CommandMenu";
import { Sidebar } from "@/components/Sidebar";

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
