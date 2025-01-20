import { logger } from "@nanostores/logger";
import { persistentAtom } from "@nanostores/persistent";

export const $model = persistentAtom<string>("model", "openai/gpt-4o-mini");

if (process.env.NODE_ENV === "development") {
  const destroy = logger({
    Model: $model,
  });
}
