import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.js"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/main.jsx"],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
});
