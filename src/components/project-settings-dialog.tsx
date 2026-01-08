import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateProject } from "@/utils/queries";

export function ProjectSettingsDialog({
  project,
  children,
}: {
  project: { token: string; name: string; customInstructions?: string | null };
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(project.name);
  const [customInstructions, setCustomInstructions] = useState(
    project.customInstructions || "",
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      setName(project.name);
      setCustomInstructions(project.customInstructions || "");
    }
  }, [open, project]);

  const updateProjectMutation = useMutation({
    mutationFn: () =>
      updateProject(project.token, {
        name,
        customInstructions: customInstructions.trim() || "",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["sidebarThreads"] });
      queryClient.invalidateQueries({
        queryKey: ["project", project.token],
      });
      setOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateProjectMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Project Settings</DialogTitle>
            <DialogDescription>
              Update project name and custom instructions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="instructions" className="text-sm font-medium">
                Custom Instructions
              </label>
              <Textarea
                id="instructions"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Add custom instructions that will be provided to the LLM for all threads in this project..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || updateProjectMutation.isPending}
            >
              {updateProjectMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
