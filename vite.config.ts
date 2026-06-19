import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

const host: string | undefined = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsConfigPaths(),
    tanstackStart({
      server: { entry: "server" },
      spa: {
        enabled: true,
        prerender: {
          outputPath: "/index.html",
          crawlLinks: false,
          retryCount: 0,
        },
      },
    }),
    viteReact(),
    nitro(),
  ],
  clearScreen: false,
  preview: {
    port: 4173,
    strictPort: false,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 3001,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
});
