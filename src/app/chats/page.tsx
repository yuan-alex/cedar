import { auth } from "@clerk/nextjs/server";
import { Card } from "@radix-ui/themes";
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
    },
  });

  return (
    <div className="p-4 w-xl mx-auto">
      <p className="text-2xl my-8">Recent chats</p>
      <div className="flex flex-col space-y-3">
        {threads.map((thread) => (
          <Link key={thread.token} href={`/chat/${thread.token}`}>
            <Card>
              <p>{thread.name}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
