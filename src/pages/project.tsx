import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeftIcon, PlusIcon, SettingsIcon } from "lucide-react";

import { ProjectSettingsDialog } from "@/components/project-settings-dialog";
import { ThreadItemCard } from "@/components/thread-item-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetchProject, fetchThreadsByProject } from "@/utils/queries";
import { $model, $prompt } from "@/utils/stores";

export function ProjectPage() {
  const { projectToken } = useParams({ from: "/projects/$projectToken" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: project } = useQuery({
    queryKey: ["project", projectToken],
    queryFn: () => fetchProject(projectToken, true),
  });

  const { data: threads } = useQuery({
    queryKey: ["projectThreads", projectToken],
    queryFn: () => fetchThreadsByProject(projectToken),
  });

  const createThreadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/v1/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: $model.get().id,
          prompt: $prompt.value || "New thread",
          projectId: project?.id,
        }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sidebarThreads"] });
      queryClient.invalidateQueries({
        queryKey: ["projectThreads", projectToken],
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectToken] });
      navigate({
        to: "/chat/$threadToken",
        params: { threadToken: data.token },
      });
    },
  });

  if (!project) {
    return (
      <div className="w-2xl mx-auto my-10">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-2xl mx-auto my-10">
      <div className="mb-6">
        <Link to="/projects">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <p className="text-muted-foreground">
              {project._count?.threads || threads?.length || 0} thread
              {(project._count?.threads || threads?.length || 0) !== 1
                ? "s"
                : ""}
            </p>
            {project.customInstructions && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="text-sm font-medium mb-2">Custom Instructions:</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {project.customInstructions}
                </p>
              </div>
            )}
          </div>
          <ProjectSettingsDialog project={project}>
            <Button variant="outline">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Edit Settings
            </Button>
          </ProjectSettingsDialog>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <p className="text-xl">Threads</p>
        <Button
          onClick={() => {
            $prompt.set("");
            createThreadMutation.mutate();
          }}
          disabled={createThreadMutation.isPending}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          New Thread
        </Button>
      </div>

      {threads && threads.length > 0 ? (
        <div className="border rounded-lg">
          {threads.map((thread, index) => (
            <div key={thread.token}>
              <ThreadItemCard thread={thread} dateField="lastMessagedAt" />
              {index < threads.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg font-medium mb-2">No threads yet</p>
          <p className="text-muted-foreground mb-4">
            Create a thread to get started
          </p>
          <Button
            onClick={() => {
              $prompt.set("");
              createThreadMutation.mutate();
            }}
            disabled={createThreadMutation.isPending}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Thread
          </Button>
        </div>
      )}
    </div>
  );
}
