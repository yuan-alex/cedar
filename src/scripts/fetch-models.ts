import { ICedarProvider, IModel, IProvider } from "@/server/utils/providers";

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

async function fetchAndGroupModels() {
  try {
    const response = await fetch(MODEL_REGISTRY_API as string);
    const data = (await response.json()) as Record<string, IProvider>;

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
        modelsByProvider[providerKey] = {
          id: providerKey,
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

    return modelsByProvider;
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
