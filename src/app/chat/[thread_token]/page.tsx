import { Badge } from "@radix-ui/themes";
import { notFound } from "next/navigation";

import { Chat } from "@/components/Chat";
import prisma from "@/utils/prisma";

export default async function Thread({ params }) {
  const { thread_token } = await params;

  const thread = await prisma.thread.findUnique({
    where: {
      token: thread_token,
      isDeleted: false,
    },
    include: {
      messages: {
        include: {
          runStep: true,
        },
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
      <Chat thread={thread} />
    </div>
  );
}
