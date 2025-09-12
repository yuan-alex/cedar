import { z } from "zod";

export const createThreadSchema = z.object({
  model: z.string(),
  prompt: z.string(),
});

export const newMessageSchema = z.object({
  model: z.string(),
  newMessage: z.any(),
  mcpServers: z.array(z.string()),
});
