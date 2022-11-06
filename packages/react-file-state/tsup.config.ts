import path from 'path';
import { defineConfig } from 'tsup';

export default defineConfig({
  //bundle: false,
  entry: ["./src/index.ts"],
  outDir: "./dist/",
  format: ["esm", "cjs"],
  // format: ["esm", "cjs"],
  clean: true,
  sourcemap: true,
  dts: true,
  legacyOutput: true,
  tsconfig: path.resolve(__dirname, "./tsconfig.json"),
  esbuildOptions(options, context) {
    // the directory structure will be the same as the source
    options.outbase = "./src";
  },
});