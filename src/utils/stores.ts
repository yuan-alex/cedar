import { logger } from "@nanostores/logger";
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
  logger({
    Model: $model,
    MCPServers: $mcpSelectedServers,
  });
}
