import { honoServer } from "./hono";

const bunServer = Bun.serve({
  fetch: honoServer.fetch,
  port: Number(process.env.PORT || 3001),
  idleTimeout: 60,
  development: process.env.NODE_ENV === "development",
});

console.log(`Server is running on ${bunServer.hostname}:${bunServer.port}`);
