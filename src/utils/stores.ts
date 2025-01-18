import { persistentAtom } from "@nanostores/persistent";

export const $prompt = persistentAtom<string>("prompt", "");
export const $model = persistentAtom<string>("model", "openai/gpt-4o-mini");
