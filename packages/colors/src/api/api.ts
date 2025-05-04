import {
  type ColorType,
  type ColorTypeMap,
  Contrast,
  Converter,
  Hex,
  ColorWheel,
  splitCssColorString,
  Hsl,
  Luminance,
  Rgb,
} from "./modules/index.js";

const modules = { Hex, Rgb, Hsl, Luminance, Contrast, ColorWheel } as const;
type WcagLevel = keyof typeof Contrast.WCAG;
type Variant = "dim" | "bright";
type VariantColorDeltas = { [key in Variant]: number };
type Variants<T extends Converter.Type> = {
  [key in Variant]: Converter.ColorTypeMap[T];
};
const parse = {
  stringToColor: (value: string): ColorType => {
    if (value.startsWith("#")) return Hex.normalize(value);
    if (value.startsWith("rgb")) return Rgb.stringToRgb(value);
    if (value.startsWith("hsl")) return Hsl.stringToHsl(value);
    throw new Error(`Invalid color string: ${value}`);
  },
  colorToString: (color: ColorType): string => {
    if (Hex.is(color)) return Hex.normalize(color);
    if (Rgb.isRgb(color)) return Rgb.toString(color);
    if (Hsl.isHsl(color)) return Hsl.toString(color);
    throw new Error(`Invalid color type: ${color}`);
  },
  /**
   * Takes a functional CSS color string (e.g., "rgb(255, 0, 0)") and splits it
   * into it's values. e.g., "rgb(255, 0, 0)" -\> ["255", "0", "0"]
   */
  cssColorString: splitCssColorString,
} as const;
const adjust = {
  lightness: <T extends Converter.Type>(
    color: string,
    delta: number, // Positive to lighten, negative to darken
    returnType: T,
  ): Converter.ColorTypeMap[T] =>
    Converter.resolve<T>(
      Hsl.adjust.lightness(
        Converter.resolve<"hsl">(parse.stringToColor(color), "hsl"),
        delta,
      ),
      returnType,
    ),
  saturation: <T extends Converter.Type>(
    color: string,
    delta: number, // Positive to increase, negative to decrease
    returnType: T,
  ) => adjust.lightness(color, delta, returnType),
  hue: <T extends Converter.Type>(
    color: string,
    delta: number, // Positive to rotate hue clockwise, negative to rotate counterclockwise
    returnType: T,
  ): Converter.ColorTypeMap[T] =>
    Converter.resolve<T>(
      Hsl.adjust.hue(
        Converter.resolve<"hsl">(parse.stringToColor(color), "hsl"),
        delta,
      ),
      returnType,
    ),
  contrastRatio: (foreground: string, background: string) =>
    Contrast.calculateRatio(
      parse.stringToColor(foreground),
      parse.stringToColor(background),
    ),
} as const;
const get = {
  /** Generates dim and bright variants of a color using lightness deltas */
  variants: <T extends Converter.Type>(
    color: string,
    returnType: T,
    deltas: VariantColorDeltas | Luminance.DeltaPresets = Luminance.deltaPresets
      .moderate,
  ): Variants<T> & { base: Converter.ColorTypeMap[T] } => {
    const { dim, bright } =
      typeof deltas === "string" ? Luminance.deltaPresets[deltas] : deltas;
    return {
      base: Converter.resolve<T>(parse.stringToColor(color), returnType),
      dim: adjust.lightness(color, dim, returnType),
      bright: adjust.lightness(color, bright, returnType),
    };
  },
  contrast: (foreground: string, background: string) =>
    Contrast.calculateRatio(
      parse.stringToColor(foreground),
      parse.stringToColor(background),
    ),

  bestColor: ({
    background,
    foreground,
    direction,
    initialRatio,
    maxIterations,
    precision,
    targetRatio,
  }: Omit<Contrast.FindBestColorOptions, "background" | "foreground"> & {
    background: string;
    foreground: string;
  }) =>
    Contrast.findBestColor({
      background: Converter.toRgb(parse.stringToColor(background)),
      foreground: Converter.toRgb(parse.stringToColor(foreground)),
      direction,
      initialRatio,
      maxIterations,
      precision,
      targetRatio,
    }),
  relativeLuminance: (color: string) =>
    Luminance.calculateRelative(parse.stringToColor(color)),
  colorType: (color: string) =>
    Converter.getColorType(parse.stringToColor(color)),
} as const;
const is = {
  rgb: Rgb.isRgb,
  hsl: Hsl.isHsl,
  hex: Hex.is,
  accessible: ({
    background,
    foreground,
    level = "AA",
  }: {
    background: string;
    foreground: string;
    level?: Contrast.WcagLevel;
  }) =>
    Contrast.isWcagCompliant({
      background: parse.stringToColor(background),
      foreground: parse.stringToColor(foreground),
      level,
    }),
  contrastRatioAchievable: ({
    background,
    foreground,
    targetRatio,
    allowExceed = true,
  }: {
    background: string;
    foreground: string;
    targetRatio: number;
    allowExceed?: boolean;
  }) =>
    Contrast.isRatioAchievable({
      background: parse.stringToColor(background),
      foreground: parse.stringToColor(foreground),
      targetRatio,
      allowExceed,
    }),
} as const;
const clamp = {
  rgb: Rgb.clamp,
  hslHue: Hsl.clampHue,
  hslPerc: Hsl.clampPerc,
  hexByte: Hex.byte.clamp,
} as const;
const convert = {
  toRgb: (color: string) => Converter.toRgb(parse.stringToColor(color)),
  toHsl: (color: string) => Converter.toHsl(parse.stringToColor(color)),
  toHex: (color: string) => Converter.toHex(parse.stringToColor(color)),
  rgbTo: Converter.rgbTo,
  hslTo: Converter.hslTo,
  hexTo: Converter.hexTo,
} as const;
const blend = <T extends Converter.Type>({
  background,
  foreground,
  returnType,
}: {
  background: string;
  foreground: string;
  returnType: T;
}) => {
  const { bg, fg } = Rgb.blend(
    Converter.toRgb(parse.stringToColor(foreground)),
    Converter.toRgb(parse.stringToColor(background)),
  );
  return {
    background: Converter.resolve<T>(bg, returnType),
    foreground: Converter.resolve<T>(fg, returnType),
  };
};
export { convert, parse, adjust, get, is, clamp, modules, blend };
export type {
  Variant,
  VariantColorDeltas,
  Variants,
  ColorType,
  ColorTypeMap,
  WcagLevel,
};
