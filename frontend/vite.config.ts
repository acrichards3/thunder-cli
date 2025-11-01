import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env file from frontend directory
config({ path: path.resolve(__dirname, ".env") });

// Read envs directly at config time (dotenv loaded above)
const vitePort = Number(process.env.VITE_PORT) || 5173;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: vitePort,
  },
});
