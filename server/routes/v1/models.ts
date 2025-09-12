import { Hono } from "hono";
import type { AppEnv } from "@/server/types";
import { getModels } from "@/server/utils/providers";

export const models = new Hono<AppEnv>();

models.get("/", async (c) => {
  const data = getModels();
  return c.json(data);
});
