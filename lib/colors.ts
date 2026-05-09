/** Colour palette keyed by search-query cluster */
export function queryColor(key: string, institutional: boolean): string {
  const base: Record<string, string> = {
    cut: "#e85d4c",
    sibling: "#d4a853",
    law: "#6b8cce",
    father: "#9b7ebe",
    local: "#5a9e8c",
    other: "#8892a8",
  };
  const c = base[key] ?? base.other;
  if (institutional) return shadeBlend(c, "#9bdcff", 0.22);
  return c;
}

function shadeBlend(c1: string, c2: string, ratio: number): string {
  const a = hexRgb(c1);
  const b = hexRgb(c2);
  const mix = (i: number) => Math.round(a[i] * (1 - ratio) + b[i] * ratio);
  return rgbHex(mix(0), mix(1), mix(2));
}

function hexRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}
