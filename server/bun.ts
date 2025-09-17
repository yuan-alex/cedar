import webApp from "../src/index.html";
import { honoServer } from "./hono";

const bunServer = Bun.serve({
  routes: {
    "/api/*": honoServer.fetch,
    "/*": webApp,
  },
  port: Number(process.env.PORT || 3000),
  idleTimeout: 60,
  development: process.env.NODE_ENV === "development",
});

console.log(`Server is running on ${bunServer.hostname}:${bunServer.port}`);
