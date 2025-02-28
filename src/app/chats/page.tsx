import { auth } from "@clerk/nextjs/server";
import { Card } from "@radix-ui/themes";
import { formatDistanceToNow } from "date-fns";
import { notFound } from "next/navigation";

import { prisma } from "@/utils/prisma";
import Link from "next/link";

export default async function Chats() {
  const { userId } = await auth();

  if (!userId) {
    return notFound();
  }

  const threads = await prisma.thread.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    orderBy: {
      id: "desc",
    },
  });

  return (
    <div className="p-4 w-2xl mx-auto my-10">
      <p className="text-2xl mb-5">Recent chats</p>
      <div className="flex flex-col space-y-2">
        {threads.map((thread) => (
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
