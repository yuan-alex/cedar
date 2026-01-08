import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontalIcon, SettingsIcon, Trash2Icon } from "lucide-react";
import { ProjectSettingsDialog } from "@/components/project-settings-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProject } from "@/utils/queries";

export function ProjectMenu({
  project,
}: {
  project: { token: string; name: string; customInstructions?: string | null };
}) {
  const queryClient = useQueryClient();

  const deleteProjectMutation = useMutation({
    mutationFn: () => deleteProject(project.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["sidebarThreads"] });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontalIcon className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        <ProjectSettingsDialog project={project}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <SettingsIcon className="h-4 w-4 mr-2" />
            <span>Edit settings</span>
          </DropdownMenuItem>
        </ProjectSettingsDialog>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            if (
              confirm(
                `Are you sure you want to delete "${project.name}"? Threads in this project will be unassigned but not deleted.`,
              )
            ) {
              deleteProjectMutation.mutate();
            }
          }}
        >
          <Trash2Icon className="h-4 w-4 mr-2" />
          <span>Delete project</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
