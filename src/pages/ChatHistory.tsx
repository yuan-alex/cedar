import { Card } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router";

export function ChatHistory() {
  const fetchAllThreads = () => fetch("/api/threads").then((res) => res.json());

  const { data: threads } = useQuery({
    queryKey: ["allThreads"],
    queryFn: fetchAllThreads,
  });

  return (
    <div className="p-4 w-2xl mx-auto my-10">
      <p className="text-2xl mb-5">Recent chats</p>
      <div className="flex flex-col space-y-2">
        {threads?.map((thread) => (
          <Link key={thread.token} to={`/chat/${thread.token}`}>
            <Card>
              <p className="truncate font-medium mb-1">{thread.name}</p>
              <p className="text-xs">
                Last messaged {formatDistanceToNow(thread.createdAt)} ago
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
