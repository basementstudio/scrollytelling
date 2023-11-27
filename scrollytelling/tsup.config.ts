import { defineConfig } from "tsup";
import { ScssModulesPlugin } from "esbuild-scss-modules-plugin";

const fixGsapImportPlugin = {
  name: "fix-gsap-import",
  setup(build: any) {
    build.onEnd((result: any) => {
      result.outputFiles?.forEach(async (file: any) => {
        if (file.path.endsWith(".js")) {
          // change gsap import to point to the cjs one https://greensock.com/forums/topic/26104-nuxt-gsapdraggable-cannot-use-import-statement-outside-a-module/
          // and https://github.com/basementstudio/scrollytelling/issues/33
          Object.defineProperty(file, "text", {
            value: file.text.replace(
              "gsap/ScrollTrigger",
              "gsap/dist/ScrollTrigger"
            ),
          });
        }
      });
    });
  },
};

export default defineConfig({
  esbuildPlugins: [fixGsapImportPlugin, ScssModulesPlugin()],
  banner: {
    js: `"use client";`,
  },
  entry: {
    index: "./src/index.ts",
  },
  dts: true,
  format: ["cjs", "esm"],
  sourcemap: false,
  minify: false,
  treeshake: true,
  splitting: true,
  injectStyle: true,
  bundle: true,
});
