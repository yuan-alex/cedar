import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    outDir: "./dist/client",
  },
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
  plugins: [react(), tsconfigPaths()],
});
