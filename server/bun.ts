import { app } from "./main";

if (process.env.NODE_ENV === "production") {
  const { serveStatic } = await import("hono/bun");
  app.get("/*", serveStatic({ root: "./dist/client" }));
}

if (process.env.NODE_ENV === "development") {
  const { serve } = await import("bun");
  const server = serve({
    fetch: app.fetch,
    port: Number.parseInt(process.env.PORT || "3001"),
  });
  console.log(`Listening on ${server.url}`);
}
