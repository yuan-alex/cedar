import { readFileSync } from "fs";
import { join } from "path";
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
    default: z.string().default("google/gemini-2.5-flash"),
    temperature: z.number().min(0).max(2).default(0.3),
    max_tokens: z.number().positive().default(2048),
    title_generation: z.string().default("openai/gpt-oss-20b"),
    mappings: z.record(z.string(), z.string()).optional(),
  }),

  ui: z.object({
    chat_placeholder: z.string().default("Type your message..."),
    max_history_items: z.number().positive().default(50),
    default_chat_name: z.string().default("New chat"),
  }),

  features: z.object({
    enable_dev_models: z.boolean().default(false),
    enable_reasoning_display: z.boolean().default(true),
    enable_model_selection: z.boolean().default(true),
    enable_debug_logging: z.boolean().default(false),
  }),
});

function loadConfig() {
  try {
    const configPath = join(process.cwd(), "config", "default.yml");
    const yamlContent = readFileSync(configPath, "utf8");
    const yamlData = parse(yamlContent);

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

export const config = loadConfig();
export type Config = typeof config;
