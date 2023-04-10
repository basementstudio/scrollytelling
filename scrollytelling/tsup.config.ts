import { defineConfig } from "tsup";

const prependUseClientPlugin = {
  name: "prepend-use-client",
  setup(build: any) {
    build.onEnd((result: any) => {
      result.outputFiles
        ?.filter((file: any) => !file.path.endsWith(".map"))
        .forEach(async (file: any) => {
          Object.defineProperty(file, "text", {
            value: `"use client";\n${file.text}`,
          });
        });
    });
  },
};

export default defineConfig({
  esbuildPlugins: [prependUseClientPlugin],
});
