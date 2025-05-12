import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ChatHistory() {
  const fetchAllThreads = () =>
    fetch("/api/v1/threads").then((res) => res.json());

  const { data: threads } = useQuery({
    queryKey: ["allThreads"],
    queryFn: fetchAllThreads,
  });

  return (
    <div className="w-2xl mx-auto my-10">
      <p className="text-2xl mb-5">Recent chats</p>
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
