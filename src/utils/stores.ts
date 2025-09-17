import { persistentAtom, persistentMap } from "@nanostores/persistent";

type ModelValueMap = Record<string, string> & { id: string; name: string };

export const $model = persistentMap<ModelValueMap>("model", {
  id: "cedar/smart",
  name: "Smart",
});
export const $prompt = persistentAtom<string>("prompt");

// MCP tools selection state
export const $mcpSelectedServers = persistentAtom<string>(
  "mcpSelectedServers",
  "",
);

if (process.env.NODE_ENV === "development") {
  try {
    // Dynamic import for dev dependency to avoid build errors in production
    const { logger } = require("@nanostores/logger");
    logger({
      Model: $model,
      MCPServers: $mcpSelectedServers,
    });
  } catch (error) {
    // Logger not available in production, skip silently
  }
}
