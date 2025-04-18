import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontalIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

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

  const { threadToken } = useParams();
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
      if (threadToken === thread.token) {
        navigate("/");
      }
    },
  });

  return (
    <SidebarMenuItem key={thread.token}>
      <SidebarMenuButton asChild isActive={threadToken === thread.token}>
        <Link to={`/chat/${thread.token}`}>
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
