import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeftIcon, SettingsIcon } from "lucide-react";

import { InputBox } from "@/components/input-box";
import { ProjectSettingsDialog } from "@/components/project-settings-dialog";
import { ThreadItemCard } from "@/components/thread-item-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetchProject, fetchThreadsByProject } from "@/utils/queries";
import { $model, $prompt } from "@/utils/stores";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";

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
    mutationFn: async (prompt: string) => {
      const response = await fetch("/api/v1/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: $model.get().id,
          prompt: prompt,
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

  function handleCreateThread(message: PromptInputMessage) {
    if (!message.text) {
      return;
    }

    $prompt.set(message.text);
    createThreadMutation.mutate(message.text);
  }

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
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <p className="text-muted-foreground">
              {project._count?.threads || threads?.length || 0} thread
              {(project._count?.threads || threads?.length || 0) !== 1
                ? "s"
                : ""}
            </p>
          </div>
          <ProjectSettingsDialog project={project}>
            <Button variant="outline">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Edit Settings
            </Button>
          </ProjectSettingsDialog>
        </div>
        {project.customInstructions && (
          <div className="w-full p-4 bg-muted rounded-md">
            <p className="text-sm font-medium mb-2">Custom Instructions:</p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {project.customInstructions}
            </p>
          </div>
        )}
      </div>

      <div className="mb-5">
        <p className="text-xl mb-4">Threads</p>
        <div className="mb-6">
          <InputBox
            onSubmit={handleCreateThread}
            status={createThreadMutation.isPending ? "submitted" : undefined}
          />
        </div>
      </div>

      {threads && threads.length > 0 ? (
        <div className="border rounded-lg">
          {threads.map(
            (
              thread: {
                token: string;
                name: string;
                lastMessagedAt?: string;
                createdAt?: string;
                project?: { token: string; name: string } | null;
              },
              index: number,
            ) => (
              <div key={thread.token}>
                <ThreadItemCard thread={thread} dateField="lastMessagedAt" />
                {index < threads.length - 1 && <Separator />}
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg font-medium mb-2">No threads yet</p>
          <p className="text-muted-foreground">
            Type a message above to create your first thread
          </p>
        </div>
      )}
    </div>
  );
}
