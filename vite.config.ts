import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
    hmr: {
      host: "localhost",
      protocol: "ws",
    },
    watch: {
      usePolling: true,
    },
    strictPort: true,
  },
  base: "/fretboard-adventures/",
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
