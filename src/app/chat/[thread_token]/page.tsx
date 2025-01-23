import { notFound } from "next/navigation";

import { Chat } from "@/components/Chat";
import { prisma } from "@/utils/prisma";
import { Badge } from "@radix-ui/themes";

export default async function Thread({ params }) {
  const { thread_token } = await params;

  const thread = await prisma.thread.findUnique({
    where: {
      token: thread_token,
    },
    include: {
      messages: true,
    },
  });

  if (!thread) {
    return notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <nav className="py-3 px-4 flex items-center border-b dark:border-zinc-700">
        <p className="font-medium">{thread.name}</p>
        <div className="grow" />
        <Badge>{thread.model}</Badge>
      </nav>
      <Chat thread={thread} />
    </div>
  );
}
