import { Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ThreadSidebarMenuItem } from "@/components/thread-item";
import { ProjectMenu } from "@/components/project-menu";

export function ProjectGroup({
  project,
  threads,
}: {
  project: {
    token: string;
    name: string;
    customInstructions?: string | null;
    _count?: { threads: number };
  };
  threads: Array<{
    token: string;
    name: string;
    lastMessagedAt: string;
    createdAt: string;
  }>;
}) {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SidebarGroup>
        <div className="flex items-center justify-between group">
          <CollapsibleTrigger asChild>
            <SidebarGroupLabel className="flex items-center gap-2 cursor-pointer hover:bg-sidebar-accent rounded-md px-2 py-1 -mx-2 -my-1">
              <ChevronRightIcon
                className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`}
              />
              <Link
                to="/projects/$projectToken"
                params={{ projectToken: project.token }}
                onClick={(e) => e.stopPropagation()}
                className="flex-1"
              >
                {project.name}
              </Link>
              <span className="text-xs text-muted-foreground">
                {threads.length}
              </span>
            </SidebarGroupLabel>
          </CollapsibleTrigger>
          <div className="opacity-0 group-hover:opacity-100">
            <ProjectMenu project={project} />
          </div>
        </div>
        <CollapsibleContent>
          <SidebarMenu>
            {threads.map((thread) => (
              <ThreadSidebarMenuItem key={thread.token} thread={thread} />
            ))}
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
