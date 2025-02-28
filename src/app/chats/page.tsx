"use client";

import { Card } from "@radix-ui/themes";
import { formatDistanceToNow } from "date-fns";
import useSWR from "swr";

import Link from "next/link";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Chats() {
  const { data: threads } = useSWR("/api/threads", fetcher);

  return (
    <div className="p-4 w-2xl mx-auto my-10">
      <p className="text-2xl mb-5">Recent chats</p>
      <div className="flex flex-col space-y-2">
        {threads?.map((thread) => (
          <Link key={thread.token} href={`/chat/${thread.token}`}>
            <Card>
              <p className="font-medium mb-1">{thread.name}</p>
              <p className="text-xs">
                Last messaged {formatDistanceToNow(thread.lastMessagedAt)} ago
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
