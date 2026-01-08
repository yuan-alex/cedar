import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
  FolderIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type ThreadItemCardProps = {
  thread: {
    token: string;
    name: string;
    lastMessagedAt?: string;
    createdAt?: string;
    project?: {
      token: string;
      name: string;
    } | null;
  };
  showProject?: boolean;
  dateField?: "lastMessagedAt" | "createdAt";
};

export function ThreadItemCard({
  thread,
  showProject = false,
  dateField = "lastMessagedAt",
}: ThreadItemCardProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams({
    from: "/chat/$threadToken",
    shouldThrow: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [threadName, setThreadName] = useState(thread.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setThreadName(thread.name);
  }, [thread.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const deleteThreadMutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/v1/threads/${thread.token}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sidebarThreads"] });
      queryClient.invalidateQueries({ queryKey: ["allThreads"] });
      queryClient.invalidateQueries({ queryKey: ["projectThreads"] });
      if (params?.threadToken === thread.token) {
        navigate({ to: "/" });
      }
    },
  });

  const updateThreadNameMutation = useMutation({
    mutationFn: (name: string) => {
      return fetch(`/api/v1/threads/${thread.token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sidebarThreads"] });
      queryClient.invalidateQueries({ queryKey: ["allThreads"] });
      queryClient.invalidateQueries({ queryKey: ["projectThreads"] });
      setIsEditing(false);
    },
  });

  const handleSave = () => {
    const trimmedName = threadName.trim();
    if (!trimmedName) {
      setThreadName(thread.name);
      setIsEditing(false);
      return;
    }
    if (trimmedName !== thread.name) {
      updateThreadNameMutation.mutate(trimmedName);
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setThreadName(thread.name);
      setIsEditing(false);
    }
  };

  const date =
    dateField === "lastMessagedAt"
      ? thread.lastMessagedAt
      : thread.createdAt || thread.lastMessagedAt;

  return (
    <div className="group hover:bg-accent/50 transition-colors">
      <Link
        to="/chat/$threadToken"
        params={{ threadToken: thread.token }}
        className="flex items-center justify-between px-6 py-3"
        onClick={(e) => {
          if (isEditing) {
            e.preventDefault();
          }
        }}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                ref={inputRef}
                value={threadName}
                onChange={(e) => setThreadName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="font-medium text-sm mb-0.5 h-6 px-2 py-0"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="font-medium text-sm mb-0.5 truncate">
                {thread.name}
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              {dateField === "lastMessagedAt" ? "Last messaged" : "Created"}{" "}
              {date ? formatDistanceToNow(new Date(date)) : "recently"} ago
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          {showProject && thread.project && (
            <Link
              to="/projects/$projectToken"
              params={{ projectToken: thread.project.token }}
              onClick={(e) => e.stopPropagation()}
            >
              <Badge variant="outline" className="text-xs">
                <FolderIcon className="h-3 w-3 mr-1" />
                {thread.project.name}
              </Badge>
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontalIcon className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit name
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault();
                  if (
                    confirm(
                      `Are you sure you want to delete "${thread.name}"? This action cannot be undone.`,
                    )
                  ) {
                    deleteThreadMutation.mutate();
                  }
                }}
              >
                <Trash2Icon className="h-4 w-4 mr-2" />
                Delete thread
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Link>
    </div>
  );
}
