import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from GitHub Pages at https://a-elradi.github.io/wazir-agents-showcase/
export default defineConfig({
  plugins: [react()],
  base: "/wazir-agents-showcase/",
  build: { outDir: "dist", sourcemap: false },
});
