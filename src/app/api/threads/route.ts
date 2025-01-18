import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/utils/prisma";

export async function GET() {
  await auth.protect();
  const { userId } = await auth();

  const threads = await prisma.thread.findMany({
    where: {
      userId,
    },
    orderBy: {
      id: "desc",
    },
  });

  return Response.json(threads);
}
