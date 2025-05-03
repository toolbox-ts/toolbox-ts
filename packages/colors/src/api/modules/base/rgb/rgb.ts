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
const clamp = (value: number): number => Num.clamp(value, { min: 0, max: 255 });
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
  blend,
  type Rgba,
  type Rgb,
  type Color,
  normalize,
  isRgb,
  transparent,
};
