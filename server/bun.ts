import path from "node:path";
import { fileURLToPath } from "bun";
import { serveStatic } from "hono/bun";

import { app } from "./main";

if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const staticRoot = path.join(__dirname, "../dist/client/");

  // Serve static files
  app.use("/*", serveStatic({ root: staticRoot }));

  // SPA fallback: serve index.html for any route that doesn't match static files or API routes
  app.get("*", async (c) => {
    // Skip API routes - they should be handled by the API handlers
    if (c.req.path.startsWith("/api/")) {
      return c.notFound();
    }

    // Serve index.html for all other routes (SPA routing)
    const indexFile = Bun.file(path.join(staticRoot, "index.html"));
    const indexContent = await indexFile.text();
    return c.html(indexContent);
  });
}

export default {
  fetch: app.fetch,
  port: Number(process.env.PORT || 3001),
};
