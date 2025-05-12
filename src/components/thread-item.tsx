import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { MoreHorizontalIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

export function ThreadSidebarMenuItem(props) {
  const { thread } = props;

  const params = useParams({
    from: "/chat/$threadToken",
    shouldThrow: false,
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
