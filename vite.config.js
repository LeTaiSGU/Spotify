import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer"; // optional

export default defineConfig({
  base: '', 
  plugins: [react(), visualizer()],
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          if (id.includes("playlist") || id.includes("contentPlaylist")) {
            return "playlist";
          }
        },
      },
    },
  },
  resolve: {
    alias: [{ find: "~", replacement: "/src" }],
  },
  server: {
    port: 3000,
    hmr: true,
  },
});
