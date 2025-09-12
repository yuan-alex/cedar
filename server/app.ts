import { Hono } from "hono";
import type { AppEnv } from "@/server/types";
import { authSession } from "@/server/middleware/auth-session";
import { v1 } from "@/server/routes/v1";
import { auth } from "@/server/utils/auth";

export const app = new Hono<AppEnv>();

app.use("*", authSession);

// Versioned API
app.route("/api/v1", v1);

// Auth passthrough
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});
