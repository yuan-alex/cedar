import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ChatHistory() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();
  const fetchAllThreads = () =>
    fetch("/api/v1/threads").then((res) => res.json());

  const { data: threads } = useQuery({
    queryKey: ["allThreads"],
    queryFn: fetchAllThreads,
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: () => {
      return fetch("/api/v1/threads", {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allThreads"] });
      queryClient.invalidateQueries({ queryKey: ["sidebarThreads"] });
      setShowDeleteDialog(false);
    },
  });

  const handleDeleteAll = () => {
    bulkDeleteMutation.mutate();
  };

  return (
    <div className="w-2xl mx-auto my-10">
      <div className="flex items-center justify-between mb-5">
        <p className="text-2xl">Recent chats</p>
        {threads?.length > 0 && (
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2Icon className="w-4 h-4 mr-2" />
                Delete All
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete all threads?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete all
                  your chat threads and their messages.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAll}
                  disabled={bulkDeleteMutation.isPending}
                >
                  {bulkDeleteMutation.isPending ? "Deleting..." : "Delete All"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        {threads?.map((thread) => (
          <Link
            key={thread.token}
            to="/chat/$threadToken"
            params={{ threadToken: thread.token }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{thread.name}</CardTitle>
                <CardDescription>
                  Last messaged {formatDistanceToNow(thread.createdAt)} ago
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
