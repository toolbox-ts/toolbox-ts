import { Num, Obj } from "@toolbox-ts/utils";
import { ColorWheel } from "../colorWheel/index.js";

/** Saturation utility with min/max and type guard. */
const saturation = {
  min: 0,
  max: 100,
  /** Checks if a value is a valid saturation (0-100 integer). */
  is: (value: unknown): value is number =>
    Num.is.positiveInt(value, true) &&
    value >= saturation.min &&
    value <= saturation.max,
} as const;

/** Lightness utility (same as saturation). */
const lightness = saturation;

interface Hsl {
  h: number;
  s: number;
  l: number;
  a?: number;
}

interface Hsla extends Hsl {
  a: number;
}
type Color = Hsla | Hsl;

/** Transparent HSL color constant. */
const transparent: Hsla = { h: 0, s: 0, l: 0, a: 0 } as const;

const isHsl = (value: unknown): value is Hsl =>
  Obj.is(value) &&
  ColorWheel.isIn.circle(value.h) &&
  saturation.is(value.s) &&
  lightness.is(value.l) &&
  (value.a === undefined || Num.UnitInterval.is(value.a));

/**
 * Normalizes a value to a valid HSLA color.
 * If invalid, returns transparent.
 * @param value - The value to normalize.
 * @returns A valid HSLA color.
 */
const normalize = (value: unknown): Hsla =>
  !isHsl(value) ? transparent : { ...value, a: value.a ?? 1 };

/**
 * Calculates chromaticity of an HSL color.
 * @see https://en.wikipedia.org/wiki/Chromaticity
 * @param hsl - The HSL color.
 * @returns The chromaticity value.
 */
const chromaticity = ({ l, s }: Hsl): number =>
  (1 - Math.abs(2 * (l / 100) - 1)) * (s / 100);

/**
 * Calculates an interpolation value based on hue and chromaticity.
 * @param hsl - The HSL color.
 * @param C - Optional chromaticity value.
 * @returns The interpolation value.
 */
const interpolate = (hsl: Hsl, C = chromaticity(hsl)): number =>
  C * (1 - Math.abs(((hsl.h / ColorWheel.angles.sector) % 2) - 1));

/**
 * Adjusts a final color output based on lightness and chromaticity.
 * @param hsl - The HSL color.
 * @returns The adjustment value.
 */
const matchAdjustment = (hsl: Hsl): number =>
  hsl.l / 100 - chromaticity(hsl) / 2;

/**
 * Adjusts the lightness of an HSL color.
 * @param hsl - The HSL color object.
 * @param delta - The amount to adjust lightness, as a decimal (e.g., 0.1 for +10%, -0.1 for -10%).
 * @returns The adjusted HSL color.
 */
const adjustLightness = (hsl: Hsl, delta: number): Hsl => ({
  ...hsl,
  l: Num.clamp(hsl.l + delta * 100),
});

/**
 * Adjustment utilities for HSL color channels.
 * - lightness: Adjusts lightness (decimal delta)
 * - saturation: Adjusts saturation (decimal delta, uses lightness logic)
 * - hue: Adjusts hue (decimal delta, wraps around color wheel)
 */
const adjust = {
  lightness: adjustLightness,
  saturation: adjustLightness,
  hue: (hsl: Hsl, delta: number): Hsl => {
    const angle = ColorWheel.angles.max;
    let h = (hsl.h + delta * angle) % angle;
    if (h < 0) h += angle;
    return { ...hsl, h };
  },
} as const;

export {
  isHsl,
  normalize,
  chromaticity,
  interpolate,
  matchAdjustment,
  adjust,
  transparent,
  saturation,
  lightness,
  type Hsl,
  type Color,
  type Hsla,
};
