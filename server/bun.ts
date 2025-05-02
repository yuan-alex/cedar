import path from "node:path";
import { fileURLToPath } from "bun";
import { serveStatic } from "hono/bun";

import { app } from "./main";

if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use("/*", serveStatic({ root: path.join(__dirname, "../dist/client/") }));
}

export default {
  fetch: app.fetch,
  port: Number(process.env.PORT || 3001),
};
