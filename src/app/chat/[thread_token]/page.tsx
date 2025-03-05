import { Badge } from "@radix-ui/themes";
import { notFound } from "next/navigation";

import { Chat } from "@/components/Chat";
import { prisma } from "@/utils/prisma";

export default async function Thread({ params }) {
  const { thread_token } = await params;

  const thread = await prisma.thread.findUnique({
    where: {
      token: thread_token,
      isDeleted: false,
    },
    include: {
      messages: {
        orderBy: {
          id: "asc",
        },
      },
      runs: {
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  if (!thread) {
    return notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <nav className="py-3 px-4 flex items-center border-b dark:border-zinc-800">
        <div className="grow" />
        <Badge>{thread.model}</Badge>
      </nav>
      <Chat thread={thread} />
    </div>
  );
}
