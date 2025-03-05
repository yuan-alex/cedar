import { logger } from "@nanostores/logger";
import { persistentAtom, persistentMap } from "@nanostores/persistent";

interface ModelValue {
  id: string;
  name: string;
}

export const $model = persistentMap<ModelValue>("model", {
  id: "google/gemini-2.0-flash-001",
  name: "Smart",
});
export const $prompt = persistentAtom<string>("prompt");

if (process.env.NODE_ENV === "development") {
  const destroy = logger({
    Model: $model,
  });
}
