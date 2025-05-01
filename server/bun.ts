import { serve } from "bun";
import { serveStatic } from "hono/bun";

import { app } from "./main";

if (process.env.NODE_ENV === "production") {
  app.get("/*", serveStatic({ root: "./dist/client" }));
}

const server = serve({
  fetch: app.fetch,
  port: Number.parseInt(process.env.PORT || "3001"),
});
console.log(`Listening on ${server.url}`);
