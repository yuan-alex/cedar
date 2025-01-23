import { ContextMenu } from "@radix-ui/themes";
import Link from "next/link";
import { redirect } from "next/navigation";
import { mutate } from "swr";

export function ThreadButton(props) {
  const { thread } = props;

  function handleDeleteThread() {
    fetch(`/api/threads/${thread.token}`, {
      method: "DELETE",
    }).then(() => {
      mutate("/api/threads");
      redirect("/");
    });
  }

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Link key={thread.id} href={`/chat/${thread.token}`} {...props}>
          <div
            key={thread.id}
            className="px-3 py-1 text-sm rounded-sm truncate hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            {thread.name}
          </div>
        </Link>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item
          shortcut="⌘ ⌫"
          color="red"
          onClick={handleDeleteThread}
        >
          Delete
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
