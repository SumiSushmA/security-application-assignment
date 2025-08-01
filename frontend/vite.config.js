import react from "@vitejs/plugin-react";
import fs from "fs";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    https: {
      key: fs.readFileSync("./localhost-key.pem"),
      cert: fs.readFileSync("./localhost.pem"),
    },
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
