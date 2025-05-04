import { Num } from "@toolbox-ts/utils";
import {
  Hex,
  Rgb,
  Hsl,
  ColorWheel,
  type ColorType,
  type ColorTypeMap,
} from "../base/index.js";

const eightBitChannelMax = Num.Bits.eight.max;
const rgbTo: {
  rgb: (input: Rgb.Color) => Rgb.Rgba;
  hex: (input: Rgb.Color) => Hex.Color;
  hsl: (input: Rgb.Color) => Hsl.Hsla;
} = {
  rgb: Rgb.normalize,
  hex: ({ r, g, b, a = 1 }) => {
    return `#${Hex.byte.toHex(r)}${Hex.byte.toHex(g)}${Hex.byte.toHex(b)}${Hex.byte.toHex(Math.round(Num.UnitInterval.parse(a) * eightBitChannelMax))}`;
  },
  // [Ghost] coverage result is 90.9 when executed at root of monorepo.
  //         It's 100% when executed at directly on __converter.test.ts
  /* c8 ignore start */
  hsl: ({ r, g, b, a = 1 }) => {
    const R = r / eightBitChannelMax;
    const G = g / eightBitChannelMax;
    const B = b / eightBitChannelMax;
    const max = Math.max(R, G, B);
    const min = Math.min(R, G, B);
    const delta = max - min;
    const L = (max + min) / 2;
    let S = 0;
    if (delta !== 0) {
      const denom = L > 0.5 ? 2 - max - min : max + min;
      S = delta / denom;
    }
    let H = 0;
    if (delta !== 0) {
      if (max === R) {
        H = (G - B) / delta;
        if (G < B) H += 6;
      } else if (max === G) {
        H = (B - R) / delta + 2;
      } else {
        H = (R - G) / delta + 4;
      }
    }
    const { sector, max: sectorMax } = ColorWheel.angles;
    H = (H * sector) % sectorMax;
    return {
      h: Math.round(H),
      s: Math.round(S * 100),
      l: Math.round(L * 100),
      a,
    };
  },
  /* c8 ignore end */
} as const;

const hexTo: {
  hex: (input: Hex.Color) => Hex.Color;
  rgb: (input: Hex.Color) => Rgb.Rgba;
  hsl: (input: Hex.Color) => Hsl.Hsla;
} = {
  hex: Hex.normalize,
  rgb: (input) => {
    const hex = Hex.normalize(input).slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = Num.round(
      Num.UnitInterval.parse(
        parseInt(hex.slice(6, 8), 16) / eightBitChannelMax,
      ),
      2,
    );
    return { r, g, b, a };
  },
  hsl: (input) => {
    const RGB = hexTo.rgb(input);
    return rgbTo.hsl(RGB);
  },
} as const;
const hslTo: {
  hsl: (input: Hsl.Color) => Hsl.Hsla;
  rgb: (input: Hsl.Color) => Rgb.Rgba;
  hex: (input: Hsl.Color) => Hex.Color;
} = {
  hsl: Hsl.normalize,
  rgb: ({ h, s, l, a = 1 }) => {
    const C = Hsl.chromaticity({ h, s, l });
    const X = Hsl.interpolate({ h, s, l }, C);
    const m = Hsl.matchAdjustment({ h, s, l });
    const {
      isIn: { sector },
    } = ColorWheel;
    let RGB = { r: 0, g: 0, b: 0 };
    if (sector(h, "redYellow")) RGB = { b: 0, r: C, g: X };
    if (sector(h, "yellowGreen")) RGB = { b: 0, r: X, g: C };
    if (sector(h, "greenCyan")) RGB = { r: 0, g: C, b: X };
    if (sector(h, "cyanBlue")) RGB = { r: 0, g: X, b: C };
    if (sector(h, "blueMagenta")) RGB = { g: 0, r: X, b: C };
    if (sector(h, "magentaRed")) RGB = { g: 0, r: C, b: X };
    return {
      r: Math.round((RGB.r + m) * eightBitChannelMax),
      g: Math.round((RGB.g + m) * eightBitChannelMax),
      b: Math.round((RGB.b + m) * eightBitChannelMax),
      a,
    };
  },
  hex: ({ h, l, s, a = 1 }) => rgbTo.hex(hslTo.rgb({ h, l, s, a })),
} as const;
const converters = { rgb: rgbTo, hex: hexTo, hsl: hslTo } as const;
type Type = keyof typeof converters;

const getColorType = (color: ColorType): Type | undefined => {
  if (Rgb.isRgb(color)) return "rgb";
  if (Hex.is(color)) return "hex";
  if (Hsl.isHsl(color)) return "hsl";
  return undefined;
};
const defaults = {
  rgb: Rgb.transparent,
  hex: Hex.transparent,
  hsl: Hsl.transparent,
} as const;
const validators = { rgb: Rgb.isRgb, hex: Hex.is, hsl: Hsl.isHsl } as const;

const resolve = <T extends Type>(
  color: ColorType,
  type: T,
): ColorTypeMap[T] => {
  const colorType = getColorType(color);
  let result = undefined;
  switch (colorType) {
    case "rgb":
      result = converters.rgb[type](color as Rgb.Color);
      break;
    case "hex":
      result = converters.hex[type](color as Hex.Color);
      break;
    case "hsl":
      result = converters.hsl[type](color as Hsl.Color);
      break;
    default:
      result = defaults[type];
  }
  return result as ColorTypeMap[T];
};
const toRgb = (color: ColorType): Rgb.Rgba => resolve<"rgb">(color, "rgb");
const toHex = (color: ColorType): Hex.Color => resolve<"hex">(color, "hex");
const toHsl = (color: ColorType): Hsl.Hsla => resolve<"hsl">(color, "hsl");

export {
  resolve,
  toRgb,
  toHex,
  toHsl,
  getColorType,
  defaults,
  validators,
  rgbTo,
  hexTo,
  hslTo,
  type Type,
  type ColorType,
  type ColorTypeMap,
};
