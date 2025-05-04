import type { Rgb } from "./rgb/index.js";
import type { Hex } from "./hex/index.js";
import type { Hsl } from "./hsl/index.js";

export * from "./hex/index.js";
export * from "./rgb/index.js";
export * from "./hsl/index.js";
export * from "./utils/index.js";

export * from "./colorWheel/index.js";

export type Color = Rgb.Color | Hex.Color | Hsl.Color;
export interface ColorMap {
  rgb: Rgb.Rgba;
  hex: Hex.Color;
  hsl: Hsl.Hsla;
}
export type ColorType = keyof ColorMap;
