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
    const isDevelopment = Bun.env.NODE_ENV === "development";
    const configFileName = isDevelopment ? "config.dev.yml" : "config.yml";
    const configPath = `${process.cwd()}/config/${configFileName}`;

    let yamlContent: string;
    let yamlData: unknown;

    try {
      yamlContent = await Bun.file(configPath).text();
      yamlData = parse(yamlContent);
      console.log(`Loaded config from: ${configFileName}`);
    } catch (envConfigError) {
      // If environment-specific config doesn't exist, fall back to default config.yml
      if (isDevelopment) {
        console.warn(
          "Development config not found, falling back to config.yml",
        );
        const fallbackPath = `${process.cwd()}/config/config.yml`;
        yamlContent = await Bun.file(fallbackPath).text();
        yamlData = parse(yamlContent);
      } else {
        throw envConfigError;
      }
    }

    // Parse and validate with Zod
    const config = ConfigSchema.parse(yamlData);

    // Return parsed YAML config as the single source of truth
    return config;
  } catch (error) {
    console.error("Failed to load config:", error);
    // Return default config if file doesn't exist or is invalid
    return ConfigSchema.parse({});
  }
}

export const config = await loadConfig();
export type Config = typeof config;
