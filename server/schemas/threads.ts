import { z } from "zod";

export const createThreadSchema = z.object({
  model: z.string(),
  prompt: z.string(),
});

const webSearchEnabledField = z
  .union([z.boolean(), z.string()])
  .optional()
  .default(false)
  .transform((val) => {
    if (typeof val === "string") {
      return val === "true";
    }
    return val ?? false;
  });

export const newMessageSchema = z.object({
  model: z.string(),
  newMessage: z.any(),
  mcpServers: z.array(z.string()),
  webSearchEnabled: webSearchEnabledField,
});

export const regenerateMessageSchema = z.object({
  model: z.string(),
  mcpServers: z.array(z.string()),
  webSearchEnabled: webSearchEnabledField,
});
