import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/**/*.ts"],
  sourcemap: true,
  format: ["cjs", "esm"],
  outDir: "./dist",
  splitting: false
});
