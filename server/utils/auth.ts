import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/server/utils/prisma";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    disableSignUp: process.env.NODE_ENV !== "development",
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
});
