import { Hono } from "hono";

import type { AppEnv } from "@/server/types";
import { isWebSearchAvailable } from "@/server/utils/web-search";
import { mcp } from "./mcp.ts";
import { models } from "./models.ts";
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

v1.get("/web-search-available", async (c) => {
  const isAvailable = isWebSearchAvailable();
  return c.json({ available: isAvailable });
});

v1.route("/models", models);
v1.route("/mcp", mcp);
v1.route("/threads", threads);
