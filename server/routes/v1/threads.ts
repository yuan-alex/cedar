import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  createThreadSchema,
  deleteSelectedThreadsSchema,
  newMessageSchema,
  regenerateMessageSchema,
  updateThreadSchema,
} from "@/server/schemas/threads";
import * as threadsService from "@/server/services/threads";
import type { AppEnv } from "@/server/types";

export const threads = new Hono<AppEnv>();

threads.get("/", threadsService.listThreads);
threads.post(
  "/",
  zValidator("json", createThreadSchema),
  threadsService.createThread,
);
threads.delete("/", threadsService.bulkSoftDeleteThreads);
threads.post(
  "/delete-selected",
  zValidator("json", deleteSelectedThreadsSchema),
  threadsService.deleteSelectedThreads,
);
threads.get("/:threadToken", threadsService.getThread);
threads.post(
  "/:threadToken",
  zValidator("json", newMessageSchema),
  threadsService.createMessage,
);
threads.post(
  "/:threadToken/regenerate",
  zValidator("json", regenerateMessageSchema),
  threadsService.regenerateMessage,
);
threads.patch(
  "/:threadToken",
  zValidator("json", updateThreadSchema),
  threadsService.updateThread,
);
threads.delete("/:threadToken", threadsService.softDeleteThread);
