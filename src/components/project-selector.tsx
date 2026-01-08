import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, FolderIcon } from "lucide-react";
import { useState } from "react";

import { PromptInputButton } from "@/components/ai-elements/prompt-input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchProjects } from "@/utils/queries";

export function ProjectSelector({
  selectedProjectId,
  onSelect,
}: {
  selectedProjectId?: number | null;
  onSelect: (projectId: number | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const selectedProject =
    projects?.find((p) => p.id === selectedProjectId) || null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <PromptInputButton
          role="combobox"
          aria-expanded={open}
          className="justify-between gap-2"
          size="sm"
        >
          <FolderIcon className="size-4 shrink-0" />
          <span className="truncate">
            {selectedProject ? selectedProject.name : "No project"}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </PromptInputButton>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandList>
            <CommandEmpty>No projects found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onSelect(null);
                  setOpen(false);
                }}
              >
                <FolderIcon className="mr-2 h-4 w-4" />
                <span>No project</span>
              </CommandItem>
              {projects?.map((project) => (
                <CommandItem
                  key={project.token}
                  onSelect={() => {
                    onSelect(project.id);
                    setOpen(false);
                  }}
                >
                  <FolderIcon className="mr-2 h-4 w-4" />
                  <span>{project.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
