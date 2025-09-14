import { auth } from "@/server/utils/auth";

export type AppEnv = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};

// Export the User type inferred from better-auth for use in frontend components
export type User = typeof auth.$Infer.Session.user;
