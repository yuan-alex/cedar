import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import {
  createProjectSchema,
  updateProjectSchema,
} from "@/server/schemas/projects";
import * as projectsService from "@/server/services/projects";
import type { AppEnv } from "@/server/types";

export const projects = new Hono<AppEnv>();

projects.get("/", projectsService.listProjects);
projects.get("/:projectToken", projectsService.getProject);
projects.post(
  "/",
  zValidator("json", createProjectSchema),
  projectsService.createProject,
);
projects.patch(
  "/:projectToken",
  zValidator("json", updateProjectSchema),
  projectsService.updateProject,
);
projects.delete("/:projectToken", projectsService.deleteProject);
