import { MessageCircle, Sparkle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { ModelCommandMenu } from "@/components/model-command-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";

export function CommandMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("default");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "k") {
          e.preventDefault();
          setTab("default");
          setOpen((open) => !open);
        }
        if (e.shiftKey) {
          if (e.key === "m") {
            e.preventDefault();
            setTab("model");
            setOpen(true);
          }
          if (e.key === "o") {
            e.preventDefault();
            handleNewThread();
            setOpen(false);
          }
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  function handleClose() {
    setOpen(false);
    setTab("default");
  }

  function handleNewThread() {
    navigate("/");
    setOpen(false);
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      setTab("default");
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={handleOpenChange}>
      {tab === "default" ? (
        <>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem onSelect={handleNewThread}>
                <MessageCircle />
                <span>New chat</span>
                <CommandShortcut>⌘⇧O</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setTab("model")}>
                <Sparkle />
                <span>Change model</span>
                <CommandShortcut>⌘⇧M</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </>
      ) : tab === "model" ? (
        <ModelCommandMenu handleClose={handleClose} />
      ) : null}
    </CommandDialog>
  );
}
