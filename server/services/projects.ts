import type { Context } from "hono";

import type { AppEnv } from "@/server/types";
import prisma from "@/server/utils/prisma";

function requireAuth(c: Context<AppEnv>) {
  const user = c.get("user");
  if (!user) throw new Response(null, { status: 401 });
  return user;
}

async function validateProjectAccess(projectToken: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { token: projectToken, isDeleted: false },
  });

  if (!project || project.userId !== userId) {
    throw new Response(null, { status: 404 });
  }

  return project;
}

export async function listProjects(c: Context<AppEnv>) {
  try {
    const user = requireAuth(c);

    const projects = await prisma.project.findMany({
      where: { userId: user.id, isDeleted: false },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        token: true,
        name: true,
        customInstructions: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { threads: true },
        },
      },
    });

    return Response.json(projects);
  } catch (error) {
    if (error instanceof Response) return error;
    throw error;
  }
}

export async function getProject(c: Context<AppEnv>) {
  try {
    const user = requireAuth(c);
    const projectToken = c.req.param("projectToken");
    const includeThreads = c.req.query("includeThreads") === "true";

    const project = await prisma.project.findUnique({
      where: { token: projectToken, isDeleted: false },
      select: {
        id: true,
        token: true,
        name: true,
        customInstructions: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        _count: {
          select: { threads: true },
        },
        ...(includeThreads && {
          threads: {
            where: { isDeleted: false },
            orderBy: { lastMessagedAt: "desc" },
            select: {
              token: true,
              name: true,
              lastMessagedAt: true,
              createdAt: true,
            },
          },
        }),
      },
    });

    if (!project || project.userId !== user.id) {
      return c.notFound();
    }

    return Response.json(project);
  } catch (error) {
    if (error instanceof Response) return error;
    throw error;
  }
}

export async function createProject(c: Context<AppEnv>) {
  try {
    const user = requireAuth(c);
    const { name, customInstructions } = await c.req.json();

    if (!name) {
      return new Response("name is required", { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        name,
        customInstructions: customInstructions || null,
      },
      select: {
        id: true,
        token: true,
        name: true,
        customInstructions: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return Response.json(project);
  } catch (error) {
    if (error instanceof Response) return error;
    throw error;
  }
}

export async function updateProject(c: Context<AppEnv>) {
  try {
    const user = requireAuth(c);
    const projectToken = c.req.param("projectToken");
    const data = await c.req.json();

    const project = await validateProjectAccess(projectToken, user.id);

    const updateData: {
      name?: string;
      customInstructions?: string | null;
    } = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.customInstructions !== undefined) {
      updateData.customInstructions =
        data.customInstructions === "" ? null : data.customInstructions;
    }

    const updatedProject = await prisma.project.update({
      where: { id: project.id },
      data: updateData,
      select: {
        id: true,
        token: true,
        name: true,
        customInstructions: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return Response.json(updatedProject);
  } catch (error) {
    if (error instanceof Response) return error;
    throw error;
  }
}

export async function deleteProject(c: Context<AppEnv>) {
  try {
    const user = requireAuth(c);
    const projectToken = c.req.param("projectToken");

    const project = await validateProjectAccess(projectToken, user.id);

    // Soft delete project and unassign threads
    await prisma.$transaction([
      prisma.project.update({
        where: { id: project.id },
        data: { isDeleted: true },
      }),
      prisma.thread.updateMany({
        where: { projectId: project.id },
        data: { projectId: null },
      }),
    ]);

    return new Response("ok");
  } catch (error) {
    if (error instanceof Response) return error;
    throw error;
  }
}
