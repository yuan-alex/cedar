import fs from "node:fs";
import type {
  ICedarProvider,
  IModel,
  IProvider,
} from "@/server/utils/providers";

const MODEL_REGISTRY_API = process.env.MODEL_REGISTRY_API;
if (!MODEL_REGISTRY_API) {
  throw new Error("MODEL_REGISTRY_API is not set");
}

const supportedProviders = [
  "openai",
  "openrouter",
  "anthropic",
  "fireworks-ai",
  "deepinfra",
] as const;

// Directory to save provider icons
const ICONS_DIR = "src/public/images/provider-icons";

// Map provider keys from API to desired output names
const providerNameMap: Record<string, string> = {
  "fireworks-ai": "fireworks",
};

// Only fetch icons for providers that are actually used in provider-icons.tsx
const USED_PROVIDER_ICONS = [
  "anthropic",
  "deepinfra",
  "deepseek",
  "fireworks",
  "google",
  "llama",
  "mistral",
  "moonshotai",
  "openai",
  "openrouter",
  "perplexity",
  "alibaba", // qwen
  "xai",
  "zai",
] as const;

async function fetchAndGroupModels() {
  try {
    const response = await fetch(
      `${process.env.MODEL_REGISTRY_BASE_URL}/api.json`,
    );
    const data = (await response.json()) as Record<string, IProvider>;

    // Ensure the icons directory exists
    fs.mkdirSync(ICONS_DIR, { recursive: true });

    const modelsByProvider: Record<string, ICedarProvider> = {};

    for (const [providerKey, provider] of Object.entries(data)) {
      // Skip if provider is not supported or if it has no models
      if (
        !supportedProviders.includes(
          providerKey as (typeof supportedProviders)[number],
        ) ||
        !provider.models
      )
        continue;

      // Filter out free models from OpenRouter only and sort by model name
      const filteredModels = Object.entries(provider.models)
        .filter(
          ([modelKey]) =>
            !(providerKey === "openrouter" && modelKey.endsWith(":free")),
        )
        .sort(([a], [b]) => a.localeCompare(b))
        .reduce(
          (acc, [modelKey, model]) => {
            acc[modelKey] = model;
            return acc;
          },
          {} as Record<string, IModel>,
        );

      if (Object.keys(filteredModels).length > 0) {
        const outputProviderKey = providerNameMap[providerKey] ?? providerKey;
        modelsByProvider[outputProviderKey] = {
          id: outputProviderKey,
          env: provider.env,
          name: provider.name,
          models: Object.fromEntries(
            Object.entries(filteredModels).map(([modelKey, model]) => [
              modelKey,
              {
                id: model.id,
                name: model.name,
                reasoning: model.reasoning,
              },
            ]),
          ),
        };
      }
    }

    // Sort providers alphabetically by key
    const sortedKeys = Object.keys(modelsByProvider).sort();
    const sortedModelsByProvider = Object.fromEntries(
      sortedKeys.map((key) => [key, modelsByProvider[key]]),
    ) as Record<string, ICedarProvider>;

    // Fetch and save provider logos only for providers used in provider-icons.tsx
    for (const providerKey of USED_PROVIDER_ICONS) {
      try {
        const url = `${process.env.MODEL_REGISTRY_BASE_URL}/logos/${providerKey}.svg`;
        const response = await fetch(url);
        if (response.ok) {
          const svg = await response.text();
          fs.writeFileSync(`${ICONS_DIR}/${providerKey}.svg`, svg);
          process.stderr.write(`Fetched logo for ${providerKey}\n`);
        } else {
          process.stderr.write(
            `Failed to fetch logo for ${providerKey}: ${response.status}\n`,
          );
        }
      } catch (error) {
        process.stderr.write(
          `Error fetching logo for ${providerKey}: ${error}\n`,
        );
      }
    }

    return sortedModelsByProvider;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export { fetchAndGroupModels };

// Run directly if executed in Node.js
if (typeof window === "undefined") {
  fetchAndGroupModels()
    .then((models) => process.stdout.write(JSON.stringify(models, null, 2)))
    .catch(() => process.exit(1));
}
