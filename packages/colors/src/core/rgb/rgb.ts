import { Obj, Num } from "@toolbox-ts/utils";

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

const blend = (
  fg: Rgba,
  bg: Rgba,
): { fg: Rgba & { a: 1 }; bg: Rgba & { a: 1 } } => {
  const alpha = fg.a;
  const invAlpha = 1 - alpha;
  return {
    fg: {
      r: Math.round(fg.r * alpha + bg.r * invAlpha),
      g: Math.round(fg.g * alpha + bg.g * invAlpha),
      b: Math.round(fg.b * alpha + bg.b * invAlpha),
      a: 1,
    },
    bg: { ...bg, a: 1 },
  };
};

export {
  blend,
  type Rgba,
  type Rgb,
  type Color,
  normalize,
  isRgb,
  transparent,
};
