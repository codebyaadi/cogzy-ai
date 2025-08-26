import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/types/index.ts",
    "src/lib/*.ts",
    "src/templates/*.tsx",
  ],
  format: ["esm", "cjs"],
  target: "node18",
  outDir: "dist",
  dts: true,
  splitting: false,
  clean: true,
  sourcemap: true,
  shims: false,
  skipNodeModulesBundle: true,
});
