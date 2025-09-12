import { Hono } from "hono";
import type { AppEnv } from "@/server/types";
import { zValidator } from "@hono/zod-validator";
import { createThreadSchema, newMessageSchema } from "@/server/schemas/threads";
import * as threadsService from "@/server/services/threads";

export const threads = new Hono<AppEnv>();

threads.get("/", threadsService.listThreads);
threads.post(
  "/",
  zValidator("json", createThreadSchema),
  threadsService.createThread,
);
threads.get("/:threadToken", threadsService.getThread);
threads.post(
  "/:threadToken",
  zValidator("json", newMessageSchema),
  threadsService.createMessage,
);
threads.delete("/:threadToken", threadsService.softDeleteThread);
