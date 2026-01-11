import { z } from "zod";

export const createThreadSchema = z.object({
  model: z.string(),
  prompt: z.string(),
  projectId: z.number().int().optional(),
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

export const updateThreadSchema = z
  .object({
    projectId: z.number().int().nullable().optional(),
    name: z.string().min(1).max(500).optional(),
  })
  .refine((data) => data.projectId !== undefined || data.name !== undefined, {
    message: "At least one field (projectId or name) must be provided",
  });

export const deleteSelectedThreadsSchema = z.object({
  threadTokens: z.array(z.string()).min(1),
});
