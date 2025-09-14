import { auth } from "@/server/utils/auth";
import prisma from "@/server/utils/prisma";

const email = "admin@example.com";

try {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!process.env.BETTER_AUTH_SECRET || existingUser) {
    process.exit(0);
  }

  const res = await auth.api.createUser({
    body: {
      email,
      password: process.env.BETTER_AUTH_SECRET,
      name: "admin",
      role: "admin",
    },
  });

  console.log("Sign up successful:", res);
} catch (error) {
  console.log("Sign up failed:", error);
}
