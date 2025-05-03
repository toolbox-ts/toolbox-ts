import { Num } from "@toolbox-ts/utils";
import * as Converter from "../converter/converter.js";
import { Hsl } from "../../core/index.js";

/**
 * Gamma correction parameters used in sRGB linearization.
 * These constants help convert
 * between nonlinear sRGB and linear light values.
 * @see https://www.sciencedirect.com/topics/computer-science/gamma-correction
 * @see https://graphics.stanford.edu/gamma.html?utm_source
 */
const GAMMA = {
  /** Gamma exponent used for encoding nonlinear sRGB values */
  exponent: 2.4,
  /** Gamma exponent used for encoding nonlinear sRGB values */
  offset: 0.055,
  /** Scale factor used in the inverse gamma curve */
  scale: 1.055,
} as const;

/**
 * Threshold and divisor used in converting nonlinear RGB to linear RGB,
 * based on the IEC 61966-2-1 standard (sRGB spec).
 * @see https://webstore.iec.ch/en/publication/6168
 */
const LINEARIZATION = {
  /**
   * Threshold below which the channel is linearized by simple division.
   * Typically 0.04045 for sRGB.
   */
  threshold: 0.04045,
  /**
   * Divisor applied to low-end channel values below the threshold.
   * This models the linear portion of the sRGB gamma curve.
   */
  thresholdDivisor: 12.92,
} as const;

/**
 * Constants and weights for luminance calculations.
 * - offset: Used in contrast ratio formula to prevent division by zero.
 * - weights: Per-channel weights for RGB to luminance conversion.
 * - variantDeltas: Default deltas for generating dim and bright color variants.
 * @see https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
const LUMINANCE = {
  /**
   * Constant added to the numerator and denominator
   * in the contrast ratio formula: (L1 + 0.05) / (L2 + 0.05).
   * Prevents division by zero and models perceptual floor.
   */
  offset: 0.05,
  /** Per-channel weights for converting linear RGB to luminance. */
  weights: { r: 0.2126, g: 0.7152, b: 0.0722 },
  /** Lightness deltas for dim and bright variants. */
  variantDeltas: {
    subtle: { dim: -0.03, bright: 0.03 },
    minimal: { dim: -0.05, bright: 0.05 },
    moderate: { dim: -0.08, bright: 0.08 },
    extra: { dim: -0.1, bright: 0.1 },
    heavy: { dim: -0.15, bright: 0.15 },
  },
} as const;
type VariantDeltaPreset = keyof typeof LUMINANCE.variantDeltas;

/**
 * Calculates the relative luminance of a color.
 * Converts the input color to RGB, linearizes each channel,
 * and applies the luminance weights.
 * @param color - The input color (any supported format).
 * @returns The relative luminance (0 = black, 1 = white).
 */
const calculateRelative = (color: Converter.ColorType) => {
  const clr = Converter.resolve<"rgb">(color, "rgb");
  const { r, g, b, a = 1 } = clr;
  const [_r, _g, _b, _a] = [r, g, b, a].map((c) => {
    const luminance = c / Num.Bits.eight.max;
    return luminance <= LINEARIZATION.threshold
      ? luminance / LINEARIZATION.thresholdDivisor
      : ((luminance + GAMMA.offset) / GAMMA.scale) ** GAMMA.exponent;
  });
  return (
    LUMINANCE.weights.r * _r! +
    LUMINANCE.weights.g * _g! +
    LUMINANCE.weights.b * _b!
  );
};

/**
 * Adjusts the lightness of a color by a given delta and returns the result in the specified format.
 * @param color - The input color (any supported format).
 * @param delta - Amount to adjust lightness (decimal, e.g., 0.1 for +10%, -0.1 for -10%).
 * @param returnType - The desired output color format.
 * @returns The adjusted color in the specified format.
 */
const adjustLuminance = <T extends Converter.Type>(
  color: Converter.ColorType,
  delta: number, // Positive to lighten, negative to darken
  returnType: T,
): Converter.ColorTypeMap[T] =>
  Converter.resolve<T>(
    Hsl.adjust.lightness(Converter.resolve<"hsl">(color, "hsl"), delta),
    returnType,
  );

type Variant = "dim" | "bright";
type VariantColorDeltas = { [key in Variant]: number };
type Variants<T extends Converter.Type> = {
  [key in Variant]: Converter.ColorTypeMap[T];
};

/**
 * Generates dim and bright variants of a color using lightness deltas.
 * @param color - The base color (any supported format).
 * @param returnType - The desired output color format.
 * @param deltas - Optional overrides for dim/bright deltas.
 * @returns An object with 'dim' and 'bright' color variants.
 */
const getVariants = <T extends Converter.Type>(
  color: Converter.ColorType,
  returnType: T,
  deltas: VariantColorDeltas | VariantDeltaPreset = LUMINANCE.variantDeltas
    .moderate,
): Variants<T> & { base: Converter.ColorTypeMap[T] } => {
  const { dim, bright } =
    typeof deltas === "string" ? LUMINANCE.variantDeltas[deltas] : deltas;
  return {
    base: Converter.resolve<T>(color, returnType),
    dim: adjustLuminance(color, dim, returnType),
    bright: adjustLuminance(color, bright, returnType),
  };
};

export { calculateRelative, adjustLuminance, getVariants };
export const { offset, weights } = LUMINANCE;
export { GAMMA, LINEARIZATION };
