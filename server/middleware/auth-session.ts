import type { AppEnv } from "@/server/types";
import { auth } from "@/server/utils/auth";
import type { MiddlewareHandler } from "hono";

export const authSession: MiddlewareHandler<AppEnv> = async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
};
