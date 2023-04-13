export const isClient = typeof document !== "undefined";

export const isApiSupported = (api: string) => isClient && api in window;

export const toVw = (px: number, base: string | number = 1920, min?: number) =>
  min
    ? `max(${min}px, ${
        (px * 100) /
        (typeof base === "number" ? base : Number(base.replace("px", "")))
      }vw)`
    : `${
        (px * 100) /
        (typeof base === "number" ? base : Number(base.replace("px", "")))
      }vw`;
