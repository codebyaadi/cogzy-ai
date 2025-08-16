import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src"],
  format: ["esm", "cjs"], // both formats for compatibility
  dts: true, // generate type definitions
  sourcemap: true,
  clean: true, // clean dist before build
  target: "es2020",
  minify: false,
});
