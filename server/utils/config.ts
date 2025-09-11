import { parse } from "yaml";
import { z } from "zod";

const ConfigSchema = z.object({
  app: z.object({
    name: z.string().default("Cedar"),
    title: z.string().default("Cedar"),
    description: z.string().default("Your AI Assistant"),
  }),

  ai: z.object({
    assistant_name: z.string().default("Cedar Assistant"),
    system_message: z.string().optional(),
    title_generation_system_message: z
      .string()
      .default(
        "Generate a concise, informative title from the first user message that clearly communicates the core topic or request. Use ~3 words in title case format. For questions, preserve the question essence without punctuation. For instructions or commands, focus on the desired outcome. Avoid articles (a, an, the) when possible to maximize information density. Respond with only the title.",
      ),
  }),

  models: z.object({
    temperature: z.number().min(0).max(2).default(0.3),
    max_tokens: z.number().positive().default(2048),
    title_generation: z.string().optional(),
  }),

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

async function loadConfigFromFile(
  filePath: string,
  description: string,
): Promise<ReturnType<typeof ConfigSchema.parse> | null> {
  try {
    const content = await Bun.file(filePath).text();
    let parsedConfig;

    // Detect file type based on extension and parse accordingly
    if (filePath.endsWith(".json")) {
      parsedConfig = JSON.parse(content);
    } else {
      // Assume YAML for .yml, .yaml, or other extensions
      parsedConfig = parse(content);
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
    const envConfigJson = Bun.env.CONFIG_JSON;
    if (envConfigJson) {
      console.log("Loading config from CONFIG_JSON env var");
      const yamlData = JSON.parse(envConfigJson);
      return ConfigSchema.parse(yamlData);
    }

    // Otherwise, fall back to file-based loading
    const configDir = `${process.cwd()}/config`;

    // Try config.dev.json/.yml/.yaml first (takes precedence)
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

export const config = await loadConfig();
export type Config = typeof config;
