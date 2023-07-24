import { defineConfig } from "tsup";

const prependUseClientPlugin = {
  name: "prepend-use-client",
  setup(build: any) {
    build.onEnd((result: any) => {
      result.outputFiles
        ?.filter((file: any) => !file.path.endsWith(".map"))
        .forEach(async (file: any) => {
          // add 'use client' for RSC
          Object.defineProperty(file, "text", {
            value: `"use client";\n${file.text}`,
          });
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
  esbuildPlugins: [prependUseClientPlugin],
});
