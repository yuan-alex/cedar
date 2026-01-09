import { Hono } from "hono";
import type { AppEnv } from "@/server/types";
import { config } from "@/server/utils/config";

export const mcp = new Hono<AppEnv>();

mcp.get("/servers", async (c) => {
  const enabledServerNames = Object.entries(config.mcpServers)
    .filter(([, serverConfig]) => serverConfig?.enabled !== false)
    .map(([name]) => name)
    .sort();
  return c.json(enabledServerNames);
});
