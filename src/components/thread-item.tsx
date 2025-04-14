import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function ThreadButton(props) {
  const { thread } = props;

  const { threadToken } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/threads/${thread.token}`, {
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
    <ContextMenu>
      <ContextMenuTrigger>
        <Link key={thread.id} to={`/chat/${thread.token}`} {...props}>
          <div
            key={thread.id}
            className="px-3 py-1 text-sm rounded-sm truncate hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            {thread.name}
          </div>
        </Link>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem color="red" onClick={() => mutation.mutate()}>
          <ContextMenuShortcut>⌘ ⌫</ContextMenuShortcut>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
