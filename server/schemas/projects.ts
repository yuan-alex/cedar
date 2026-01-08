import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1),
  customInstructions: z.string().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  customInstructions: z.string().optional(),
});
