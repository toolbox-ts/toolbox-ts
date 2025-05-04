import { Obj, Num } from "@toolbox-ts/utils";
import { splitCssColorString } from "../utils/index.js";
interface Rgb {
  r: number;
  g: number;
  b: number;
  a?: number;
}
interface Rgba extends Rgb {
  a: number;
}
type Color = Rgba | Rgb;
const transparent: Rgba = { r: 0, g: 0, b: 0, a: 0 } as const;

const isRgb = (v: unknown): v is Rgb =>
  Obj.is(v) &&
  Num.Bits.is.inDepth(8, v.r) &&
  Num.Bits.is.inDepth(8, v.g) &&
  Num.Bits.is.inDepth(8, v.b) &&
  (v.a === undefined || Num.UnitInterval.is(v.a));

const normalize = (value: unknown): Rgba =>
  !isRgb(value) ? transparent : { ...value, a: value.a ?? 1 };

const invert = (value: Rgba): Rgba => ({
  r: 255 - clamp(value.r),
  g: 255 - clamp(value.g),
  b: 255 - clamp(value.b),
  a: Num.UnitInterval.clamp(value.a),
});

/**
 * Performs alpha compositing of a foreground RGBA color
 * over a background RGBA color. Uses the foreground alpha
 * channel to calculate the visible result, as if layering translucent colors.
 *
 * Always returns a fully opaque result (`a: 1`).
 */
const blendAlpha = (
  fg: Rgba,
  bg: Rgba,
): { fg: Rgba & { a: 1 }; bg: Rgba & { a: 1 } } => {
  const alpha = Num.UnitInterval.clamp(fg.a);
  const invAlpha = 1 - alpha;
  return {
    fg: {
      r: clamp(fg.r * alpha + bg.r * invAlpha),
      g: clamp(fg.g * alpha + bg.g * invAlpha),
      b: clamp(fg.b * alpha + bg.b * invAlpha),
      a: 1,
    },
    bg: { ...bg, a: 1 },
  };
};

/**
 * Performs a weighted blend between two RGBA colors.
 * This is not alpha compositing, but rather a perceptual mix between colors.
 *
 * Useful for generating muted or intermediate
 * theme values (e.g. `muted = blendWeighted({ fg: text, bg: bg, weight: 0.3 })`)
 */
const blendWeighted = ({
  fg,
  bg,
  weight,
}: {
  fg: Rgba;
  bg: Rgba;
  weight: number;
}): Rgba => {
  const effectiveWeight = Num.UnitInterval.clamp(weight);
  const invWeight = 1 - effectiveWeight;
  return {
    r: clamp(fg.r * effectiveWeight + bg.r * invWeight),
    g: clamp(fg.g * effectiveWeight + bg.g * invWeight),
    b: clamp(fg.b * effectiveWeight + bg.b * invWeight),
    a: Num.UnitInterval.clamp(fg.a * effectiveWeight + bg.a * invWeight),
  };
};
const clamp = (value: number): number =>
  Num.clamp(value, { min: 0, max: 255, decimal: 0 });

const toString = ({ b, g, r, a = 1 }: Rgb): string =>
  `rgba(${clamp(r)}, ${clamp(g)}, ${clamp(b)}, ${Num.UnitInterval.clamp(a)})`;

const stringToRgb = (value: string): Rgb => {
  if (!value.startsWith("rgb")) throw new Error("Invalid RGB string");
  const [r = "0", g = "0", b = "0", a = "1"] = splitCssColorString(value);
  return {
    r: clamp(parseInt(r, 10)),
    g: clamp(parseInt(g, 10)),
    b: clamp(parseInt(b, 10)),
    a: Num.UnitInterval.clamp(parseFloat(a)),
  };
};

export {
  stringToRgb,
  toString,
  clamp,
  blendAlpha,
  blendWeighted,
  type Rgba,
  type Rgb,
  type Color,
  normalize,
  isRgb,
  invert,
  transparent,
};
