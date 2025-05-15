import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { analyzer } from "vite-bundle-analyzer"; // Sửa từ visualizer thành analyzer

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), analyzer()], // Sử dụng analyzer thay vì visualizer
  base: "./",
  server: {
    port: 3000,
    hmr: true, // Bật Hot Module Replacement để tăng tốc dev
  },
  resolve: {
    alias: [{ find: "~", replacement: "/src" }],
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // Tách dependencies ra chunk riêng
          }
          if (id.includes("playlist") || id.includes("contentPlaylist")) {
            return "playlist"; // Tách các component playlist ra chunk riêng
          }
        },
      },
      chunkFileNames: "assets/[name]-[hash].js", // Tên file chunk rõ ràng
    },
    minify: "esbuild", // Nén mã nguồn để giảm kích thước
    sourcemap: false, // Tắt sourcemap trong production (dùng trong dev nếu cần debug)
  },
});
