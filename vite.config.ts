import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function manualChunks(id: string) {
  if (id.includes("node_modules/recharts")) return "charts";
  if (id.includes("node_modules/framer-motion")) return "motion";
  if (id.includes("node_modules/xlsx") || id.includes("node_modules/pptxgenjs")) return "office";
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { tsconfigPaths: true },
  build: {
    sourcemap: false,
    cssMinify: true,
    rolldownOptions: { output: { manualChunks } },
  },
});
