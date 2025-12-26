import { Hono } from "hono";
import { serveStatic } from "hono/bun";

import { authSession } from "@/server/middleware/auth-session";
import { v1 } from "@/server/routes/v1";
import type { AppEnv } from "@/server/types";
import { auth } from "@/server/utils/auth";

export const honoServer = new Hono<AppEnv>();

honoServer.use("*", authSession);

honoServer.route("/api/v1", v1);

honoServer.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

honoServer.use("*", serveStatic({ root: "./dist" }));

honoServer.get("*", serveStatic({ path: "./dist/index.html" }));
