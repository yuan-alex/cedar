import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["server/main.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist/server",
});
