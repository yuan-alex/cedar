import { logger } from "@nanostores/logger";
import { persistentAtom, persistentMap } from "@nanostores/persistent";

interface ModelValue {
  id: string;
  name: string;
}

export const $model = persistentMap<ModelValue>("model", {
  id: "cedar/smart",
  name: "Smart",
});
export const $prompt = persistentAtom<string>("prompt");

export const $sidebarOpen = persistentAtom<string>("sidebarOpen", "true");

if (process.env.NODE_ENV === "development") {
  const destroy = logger({
    Model: $model,
  });
}
