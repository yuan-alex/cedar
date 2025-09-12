import { Hono } from "hono";
import type { AppEnv } from "@/server/types";
import { config } from "@/server/utils/config";

export const mcp = new Hono<AppEnv>();

mcp.get("/servers", async (c) => {
  return c.json(config.mcpServers);
});
