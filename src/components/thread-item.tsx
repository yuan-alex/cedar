import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { MoreHorizontalIcon, FolderIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { fetchProjects } from "@/utils/queries";

export function ThreadSidebarMenuItem(props) {
  const { thread } = props;

  const params = useParams({
    from: "/chat/$threadToken",
    shouldThrow: false,
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const deleteThreadMutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/v1/threads/${thread.token}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sidebarThreads"] });
      if (params?.threadToken === thread.token) {
        navigate({ to: "/" });
      }
    },
  });

  const updateThreadProjectMutation = useMutation({
    mutationFn: (projectId: number | null) => {
      return fetch(`/api/v1/threads/${thread.token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sidebarThreads"] });
      queryClient.invalidateQueries({ queryKey: ["allThreads"] });
      queryClient.invalidateQueries({ queryKey: ["projectThreads"] });
    },
  });

  return (
    <SidebarMenuItem key={thread.token}>
      <SidebarMenuButton
        asChild
        isActive={params?.threadToken === thread.token}
      >
        <Link to="/chat/$threadToken" params={{ threadToken: thread.token }}>
          <span>{thread.name}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction>
            <MoreHorizontalIcon />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FolderIcon className="h-4 w-4 mr-2" />
              <span>Move to project</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => updateThreadProjectMutation.mutate(null)}
              >
                <span>No project</span>
              </DropdownMenuItem>
              {projects?.map((project) => (
                <DropdownMenuItem
                  key={project.token}
                  onClick={() => updateThreadProjectMutation.mutate(project.id)}
                >
                  <FolderIcon className="h-4 w-4 mr-2" />
                  <span>{project.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => deleteThreadMutation.mutate()}
          >
            <span>Delete thread</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
