import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { FolderIcon, PlusIcon } from "lucide-react";

import { CreateProjectDialog } from "@/components/create-project-dialog";
import { ProjectMenu } from "@/components/project-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetchProjects } from "@/utils/queries";

type Project = {
  token: string;
  name: string;
  _count?: { threads: number };
  updatedAt: string;
};

export function ProjectsPage() {
  const { data: projects } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  return (
    <div className="max-w-3xl mx-auto my-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Projects</h1>
        <CreateProjectDialog>
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </CreateProjectDialog>
      </div>
      {projects && projects.length > 0 ? (
        <div className="border rounded-lg">
          {projects.map((project, index) => (
            <div key={project.token}>
              <div className="group hover:bg-accent/50 transition-colors">
                <Link
                  to="/projects/$projectToken"
                  params={{ projectToken: project.token }}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <FolderIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-base mb-1 truncate">
                        {project.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {project._count?.threads || 0} thread
                        {(project._count?.threads || 0) !== 1 ? "s" : ""} •
                        Updated{" "}
                        {formatDistanceToNow(new Date(project.updatedAt))} ago
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 ml-4">
                    <ProjectMenu project={project} />
                  </div>
                </Link>
              </div>
              {index < projects.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <FolderIcon className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create a project to organize your threads
          </p>
          <CreateProjectDialog>
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Create your first project
            </Button>
          </CreateProjectDialog>
        </div>
      )}
    </div>
  );
}
