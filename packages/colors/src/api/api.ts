import {
  type Color,
  type ColorMap,
  type ColorType,
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
type WcagLevelRatio = (typeof Contrast.WCAG)[WcagLevel];

type Variant = "base" | "inverse" | "muted";
type MuteOptions<T extends ColorType> = Omit<
  Contrast.MuteOptions<T>,
  "foreground" | "background"
> & { foreground: string; background: string };
const parse = {
  stringToColor: (value: string): Color => {
    if (value.startsWith("#")) return Hex.normalize(value);
    if (value.startsWith("rgb")) return Rgb.stringToRgb(value);
    if (value.startsWith("hsl")) return Hsl.stringToHsl(value);
    throw new Error(`Invalid color string: ${value}`);
  },
  colorToString: (color: Color): string => {
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
  lightness: <T extends ColorType>(
    color: string,
    delta: number, // Positive to lighten, negative to darken
    returnType: T,
  ): ColorMap[T] =>
    Converter.resolve<T>(
      Hsl.adjust.lightness(
        Converter.resolve<"hsl">(parse.stringToColor(color), "hsl"),
        delta,
      ),
      returnType,
    ),
  saturation: <T extends ColorType>(
    color: string,
    delta: number, // Positive to increase, negative to decrease
    returnType: T,
  ) => adjust.lightness(color, delta, returnType),
  hue: <T extends ColorType>(
    color: string,
    delta: number, // Positive to rotate hue clockwise, negative to rotate counterclockwise
    returnType: T,
  ): ColorMap[T] =>
    Converter.resolve<T>(
      Hsl.adjust.hue(
        Converter.resolve<"hsl">(parse.stringToColor(color), "hsl"),
        delta,
      ),
      returnType,
    ),
  contrastRatio: (foreground: string, background: string) =>
    Contrast.adjustToRatio(
      parse.stringToColor(foreground),
      parse.stringToColor(background),
      {
        targetRatio: 4.5,
        returnType: "rgb",
        maxIterations: 100,
        precision: 0.1,
      },
    ),
} as const;

const get = {
  contrastRatio: (foreground: string, background: string) =>
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
  inverse: <T extends ColorType>(color: string, returnType: T): ColorMap[T] =>
    Converter.resolve<T>(
      Rgb.invert(Converter.toRgb(parse.stringToColor(color))),
      returnType,
    ),
  muted: <T extends ColorType>({
    foreground,
    background,
    returnType,
    weight = 0.3,
    minRatio = "AA",
  }: MuteOptions<T>): ColorMap[T] =>
    Contrast.mute({
      foreground: parse.stringToColor(foreground),
      background: parse.stringToColor(background),
      returnType,
      weight,
      minRatio,
    }),
  variants: <T extends ColorType>({
    background,
    foreground,
    returnType,
    minRatio,
    weight,
    forceOpaque = false,
  }: MuteOptions<T>): { [K in Variant]: ColorMap[T] } => ({
    base: Converter.resolve<T>(parse.stringToColor(foreground), returnType),
    inverse: Converter.resolve<T>(
      Rgb.invert(Converter.toRgb(parse.stringToColor(foreground))),
      returnType,
    ),
    muted: Contrast.mute<T>({
      foreground: parse.stringToColor(foreground),
      background: parse.stringToColor(background),
      returnType,
      weight,
      minRatio,
      forceOpaque,
    }),
  }),
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
  rgbChannel: Rgb.clamp,
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
const blend = {
  alpha: <T extends ColorType>({
    background,
    foreground,
    returnType,
  }: {
    background: string;
    foreground: string;
    returnType: T;
  }) => {
    const { bg, fg } = Rgb.blendAlpha(
      Converter.toRgb(parse.stringToColor(foreground)),
      Converter.toRgb(parse.stringToColor(background)),
    );
    return {
      background: Converter.resolve<T>(bg, returnType),
      foreground: Converter.resolve<T>(fg, returnType),
    };
  },
  weighted: <T extends ColorType>({
    background,
    foreground,
    weight,
    returnType,
  }: {
    background: string;
    foreground: string;
    weight: number;
    returnType: T;
  }) =>
    Converter.resolve<T>(
      Rgb.blendWeighted({
        fg: Converter.toRgb(parse.stringToColor(foreground)),
        bg: Converter.toRgb(parse.stringToColor(background)),
        weight,
      }),
      returnType,
    ),
};
export { convert, parse, adjust, get, is, clamp, modules, blend };
export type { Variant, Color, ColorMap, ColorType, WcagLevel, WcagLevelRatio };
