export const toVw = (px: number, base: string | number = 1920, min?: number) =>
  min
    ? `max(${min}px, ${(px * 100) / (typeof base === 'number' ? base : Number(base.replace('px', '')))}vw)`
    : `${(px * 100) / (typeof base === 'number' ? base : Number(base.replace('px', '')))}vw`;
