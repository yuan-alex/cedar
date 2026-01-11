import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginationState, Updater } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { columns, type Thread } from "@/pages/chat-history-columns";
import { DataTable } from "@/pages/chat-history-data-table";

export function ChatHistory() {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);

  const fetchThreads = async () => {
    const skip = pagination.pageIndex * pagination.pageSize;
    const take = pagination.pageSize;
    const response = await fetch(`/api/v1/threads?skip=${skip}&take=${take}`);
    if (!response.ok) {
      throw new Error("Failed to fetch threads");
    }
    return response.json();
  };

  const { data: threadsResponse, isLoading } = useQuery({
    queryKey: ["allThreads", pagination.pageIndex, pagination.pageSize],
    queryFn: fetchThreads,
  });

  const threads = threadsResponse?.data ?? [];
  const totalCount = threadsResponse?.pagination?.total ?? 0;
  const pageCount = Math.ceil(totalCount / pagination.pageSize);

  const deleteSelectedMutation = useMutation({
    mutationFn: async (selectedThreads: Thread[]) => {
      const threadTokens = selectedThreads.map((t) => t.token);
      const response = await fetch("/api/v1/threads/delete-selected", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threadTokens }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: "Failed to delete threads",
        }));
        throw new Error(error.error || "Failed to delete threads");
      }

      return { deletedCount: selectedThreads.length };
    },
    onSuccess: (_, deletedThreads) => {
      queryClient.invalidateQueries({ queryKey: ["allThreads"] });
      queryClient.invalidateQueries({ queryKey: ["sidebarThreads"] });
      queryClient.invalidateQueries({ queryKey: ["projectThreads"] });
      toast.success("Threads deleted successfully");
      // Reset to first page if all threads on current page were deleted
      const currentThreads = threadsResponse?.data ?? [];
      if (
        currentThreads.length === deletedThreads.length &&
        pagination.pageIndex > 0
      ) {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete threads");
    },
  });

  const handleDeleteSelected = (selectedThreads: Thread[]) => {
    if (selectedThreads.length === 0) return;
    deleteSelectedMutation.mutate(selectedThreads);
  };

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/v1/threads", {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: "Failed to delete all threads",
        }));
        throw new Error(error.error || "Failed to delete all threads");
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allThreads"] });
      queryClient.invalidateQueries({ queryKey: ["sidebarThreads"] });
      queryClient.invalidateQueries({ queryKey: ["projectThreads"] });
      toast.success("All threads deleted successfully");
      setIsDeleteAllDialogOpen(false);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete all threads");
    },
  });

  const handleDeleteAll = () => {
    deleteAllMutation.mutate();
  };

  const handlePaginationChange = (updater: Updater<PaginationState>) => {
    setPagination((prev) => {
      const newPagination =
        typeof updater === "function" ? updater(prev) : updater;
      return newPagination;
    });
  };

  return (
    <div className="max-w-6xl mx-auto h-screen flex flex-col py-10">
      <div className="mb-5 flex items-center justify-between shrink-0">
        <div>
          <p className="text-2xl mb-2">Recent chats</p>
          <p className="text-muted-foreground text-sm">
            Select threads to delete them in bulk
          </p>
        </div>
        {totalCount > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteAllDialogOpen(true)}
          >
            Delete All
          </Button>
        )}
      </div>
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">Loading threads...</p>
          </div>
        ) : threads && threads.length > 0 ? (
          <DataTable
            columns={columns}
            data={threads}
            onDeleteSelected={handleDeleteSelected}
            isDeleting={deleteSelectedMutation.isPending}
            pageCount={pageCount}
            pagination={pagination}
            onPaginationChange={handlePaginationChange}
            totalCount={totalCount}
          />
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-lg font-medium mb-2">No threads yet</p>
            <p className="text-muted-foreground">
              Start a new conversation to create your first thread
            </p>
          </div>
        )}
      </div>

      <Dialog
        open={isDeleteAllDialogOpen}
        onOpenChange={setIsDeleteAllDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete All Chats</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all {totalCount} chat
              {totalCount !== 1 ? "s" : ""}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteAllDialogOpen(false)}
              disabled={deleteAllMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAll}
              disabled={deleteAllMutation.isPending}
            >
              {deleteAllMutation.isPending ? "Deleting..." : "Delete All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
