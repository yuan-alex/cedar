import { parse } from "yaml";
import { z } from "zod";

const AppSchema = z.object({
  name: z.string().default("Cedar"),
  title: z.string().default("Cedar"),
  description: z.string().default("Your AI Assistant"),
});

const AiSchema = z.object({
  assistant_name: z.string().default("Cedar Assistant"),
  system_message: z.string().optional(),
  title_generation_system_message: z
    .string()
    .default(
      "You are a title generator. Your ONLY task is to create a short title (2-6 words) for the user's message.\n\nCRITICAL: Do NOT answer the user's question or solve their problem. Only generate a title.\n\nRequirements:\n- Use title case (capitalize major words)\n- 2-6 words only\n- No quotes, no explanations, no punctuation at the end\n- For questions: focus on the subject being asked about\n- For tasks: emphasize the action or outcome\n\nExamples:\n- React Component Styling\n- Database Migration Help\n- Python Error Debugging\n- API Integration Guide\n- Authentication Setup\n\nOutput ONLY the title text. Do not provide any answer, explanation, or additional text.",
    ),
});

const ModelsSchema = z.object({
  temperature: z.number().min(0).max(2).default(0.3),
  max_tokens: z.number().positive().default(2048),
  frequency_penalty: z.number().min(-2).max(2).default(0.0),
  presence_penalty: z.number().min(-2).max(2).default(0.0),
  title_generation: z.string().optional(),
});

const ModelMappingsSchema = z
  .record(
    z.string(),
    z.object({
      name: z.string(),
      description: z.string().optional(),
      reasoning: z.boolean().default(false),
      fast: z.boolean().default(false),
      experimental: z.boolean().default(false),
      enabled: z.boolean().default(true),
    }),
  )
  .default({});

const ConfigSchema = z.object({
  app: z.preprocess((v) => (v == null ? {} : v), AppSchema),

  ai: z.preprocess((v) => (v == null ? {} : v), AiSchema),

  models: z.preprocess((v) => (v == null ? {} : v), ModelsSchema),

  modelMappings: z.preprocess((v) => (v == null ? {} : v), ModelMappingsSchema),

  providers: z
    .record(
      z.string(),
      z.object({
        enabled: z.boolean().default(true),
        models: z
          .record(
            z.string(),
            z.object({
              name: z.string(),
              description: z.string().optional(),
              reasoning: z.boolean().default(false),
            }),
          )
          .default({}),
      }),
    )
    .default({}),

  mcpServers: z
    .record(
      z.string(),
      z.discriminatedUnion("type", [
        z.object({
          type: z.literal("stdio"),
          command: z.string(),
          args: z.array(z.string()).optional(),
          env: z.record(z.string(), z.string()).optional(),
          enabled: z.boolean().default(true),
        }),
        z.object({
          type: z.literal("http"),
          url: z.string(),
          enabled: z.boolean().default(true),
        }),
        z.object({
          type: z.literal("sse"),
          url: z.string(),
          enabled: z.boolean().default(true),
        }),
      ]),
    )
    .default({}),
});

function substituteEnvVars(content: string): string {
  return content.replace(/\$\{([^}]+)\}/g, (match, envVar) => {
    const [varName, defaultValue] = envVar.split(":");
    return Bun.env[varName] || defaultValue || match;
  });
}

async function loadConfigFromFile(
  filePath: string,
  description: string,
): Promise<ReturnType<typeof ConfigSchema.parse> | null> {
  try {
    const content = await Bun.file(filePath).text();
    const substitutedContent = substituteEnvVars(content);
    let parsedConfig;

    // Detect file type based on extension and parse accordingly
    if (filePath.endsWith(".json")) {
      parsedConfig = JSON.parse(substitutedContent);
    } else {
      // Assume YAML for .yml, .yaml, or other extensions
      parsedConfig = parse(substitutedContent);
    }

    // Validate that the parsed config matches our schema
    const validatedConfig = ConfigSchema.parse(parsedConfig);
    console.log(`Loaded config from: ${description}`);
    return validatedConfig;
  } catch (error) {
    // File doesn't exist, is invalid JSON/YAML, or doesn't match schema
    return null;
  }
}

async function loadConfig() {
  try {
    // Check for stringified config in env var (takes precedence)
    const envConfigJson = Bun.env.CEDAR_CONFIG_JSON;
    if (envConfigJson) {
      console.log("Loading config from CEDAR_CONFIG_JSON env var");
      const yamlData = JSON.parse(envConfigJson);
      return ConfigSchema.parse(yamlData);
    }

    // Otherwise, fall back to file-based loading
    const configDir = `${process.cwd()}/config`;

    // Try config.dev.json/.yml/.yaml first (takes precedence) - only in development
    if (Bun.env.NODE_ENV === "development") {
      const devConfig =
        (await loadConfigFromFile(
          `${configDir}/config.dev.json`,
          "config.dev.json",
        )) ||
        (await loadConfigFromFile(
          `${configDir}/config.dev.yml`,
          "config.dev.yml",
        )) ||
        (await loadConfigFromFile(
          `${configDir}/config.dev.yaml`,
          "config.dev.yaml",
        ));
      if (devConfig) {
        return devConfig;
      }
    }

    // Try config.json/.yml/.yaml as fallback
    const baseConfig =
      (await loadConfigFromFile(`${configDir}/config.json`, "config.json")) ||
      (await loadConfigFromFile(`${configDir}/config.yml`, "config.yml")) ||
      (await loadConfigFromFile(`${configDir}/config.yaml`, "config.yaml"));
    if (baseConfig) {
      return baseConfig;
    }

    // Neither config file exists
    console.log("No config files found, using default configuration");
    return ConfigSchema.parse({});
  } catch (error) {
    console.error("Failed to load config:", error);
    // Return default config if file doesn't exist or is invalid
    return ConfigSchema.parse({});
  }
}

/**
 * Gets all enabled model mappings.
 *
 * @returns A record of enabled model mappings
 */
export function getEnabledModelMappings(): Record<
  string,
  {
    name: string;
    description?: string;
    reasoning: boolean;
    fast: boolean;
    experimental: boolean;
    enabled: boolean;
  }
> {
  return Object.fromEntries(
    Object.entries(config.modelMappings).filter(
      ([_, mapping]) => mapping.enabled,
    ),
  );
}

export const config = await loadConfig();
export type Config = typeof config;
