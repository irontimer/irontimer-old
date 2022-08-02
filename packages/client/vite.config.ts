import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
// import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [solidPlugin() /* visualizer() */],
  server: {
    port: 3000
  },
  build: {
    target: "ESNext",
    sourcemap: true
  }
});
