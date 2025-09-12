import { Hono } from "hono";
import type { AppEnv } from "@/server/types";
import { models } from "./models.ts";
import { mcp } from "./mcp.ts";
import { threads } from "./threads.ts";

export const v1 = new Hono<AppEnv>();

v1.get("/health", async (c) => {
  return c.html("good");
});

v1.get("/session", (c) => {
  const session = c.get("session");
  const user = c.get("user");
  if (!user) return c.body(null, 401);
  return c.json({ session, user });
});

v1.route("/models", models);
v1.route("/mcp", mcp);
v1.route("/threads", threads);
