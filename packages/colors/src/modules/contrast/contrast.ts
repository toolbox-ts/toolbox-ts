import { type ColorType, type ColorTypeMap, Rgb } from '../base/index.js';
import { Luminance } from '../luminance/index.js';
import { Converter } from '../converter/index.js';

/**
 * These thresholds define the minimum
 * color contrast ratios for readability.
 * @see https://www.w3.org/TR/WCAG22/
 *
 */
const WCAG = {
  /** Normal text*/
  AA: 4.5,
  /** Large text (≥18pt regular or ≥14pt bold) */
  AA_Large: 3,
  /** Normal text */
  AAA: 7,
  /** Large text (≥18pt regular or ≥14pt bold) */
  AAA_Large: 4.5
} as const;
type WcagLevel = keyof typeof WCAG;

/** Constants for contrast calculations and search. */
const CONTRAST = {
  /** precision: Minimum difference for binary search. */
  precision: 0.01,
  /** maxIterations: Maximum iterations for binary search. */
  maxIterations: 100,
  /** bounds: Lightness bounds for searching. */
  bounds: { low: 4, high: 96 },
  /** offset: Constant added to luminance in contrast ratio formula. */
  directions: { lighten: +1, darken: -1, none: 0 }
} as const;

/**
 * Formats the result of a color adjustment.
 * @param color - The adjusted color.
 * @param finalContrast - The resulting contrast ratio.
 * @param returnType - The desired color format.
 * @param targetRatio - The target contrast ratio.
 */
const prepareResult = <T extends Converter.Type>(
  color: ColorType,
  finalContrast: number,
  returnType: T,
  targetRatio: number
): AdjustResult<T> => {
  return {
    color: Converter.resolve<T>(color, returnType),
    contrast: finalContrast,
    reachedTarget: finalContrast >= targetRatio
  };
};

/**
 * Calculates the contrast ratio between two colors.
 * Uses relative luminance and the WCAG formula.
 * @param foreground - Foreground color.
 * @param background - Background color.
 * @returns The contrast ratio (rounded to 2 decimals).
 */
const calculateRatio = (foreground: ColorType, background: ColorType) => {
  const l1 = Luminance.calculateRelative(foreground);
  const l2 = Luminance.calculateRelative(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (
    Math.round(
      ((lighter + Luminance.offset) / (darker + Luminance.offset)) * 100
    ) / 100
  );
};
interface IsRatioAchievableOptions {
  foreground: ColorType;
  background: ColorType;
  targetRatio: number;
  allowExceed?: boolean;
}
interface IsRatioAchievableResult {
  achievable: boolean;
  direction: 'lighten' | 'darken' | 'none';
  initialRatio: number;
}

/**
 * Determines if the target contrast ratio is achievable by adjusting lightness.
 * @param options - Foreground, background, and target ratio.
 * @returns Achievability, direction, and initial ratio.
 */
const isRatioAchievable = ({
  foreground,
  background,
  targetRatio
}: IsRatioAchievableOptions): IsRatioAchievableResult => {
  const fg = Converter.toHsl(foreground);
  const bg = Converter.toHsl(background);
  if (fg.l === bg.l)
    return { initialRatio: 0, achievable: false, direction: 'none' };
  const initialRatio = calculateRatio(fg, bg);
  if (initialRatio >= targetRatio)
    return { initialRatio, achievable: true, direction: 'none' };
  if (calculateRatio({ ...fg, l: CONTRAST.bounds.low }, bg) >= targetRatio)
    return { initialRatio, achievable: true, direction: 'darken' };
  if (calculateRatio({ ...fg, l: CONTRAST.bounds.high }, bg) >= targetRatio)
    return { initialRatio, achievable: true, direction: 'lighten' };
  return { initialRatio, achievable: false, direction: 'none' };
};

interface FindBestColorOptions {
  foreground: ColorType;
  background: ColorType;
  targetRatio: number;
  initialRatio: number;
  direction: 1 | -1;
  precision: number;
  maxIterations: number;
}

/**
 * Binary search for the best color to achieve a target contrast ratio.
 * Adjusts the lightness of the foreground color.
 * @param options - Search parameters.
 * @returns The best found color and its contrast.
 */
const findBestColor = ({
  background,
  direction,
  foreground,
  initialRatio,
  targetRatio,
  precision,
  maxIterations
}: FindBestColorOptions) => {
  const fg = Converter.toHsl(foreground);
  const bg = Converter.toHsl(background);
  const state = { color: { ...fg }, contrast: initialRatio, iterations: 0 };
  let searchLow = 0;
  let searchHigh = 100;
  while (state.iterations < maxIterations) {
    const mid = (searchLow + searchHigh) / 2;
    const candidate = { ...fg, l: mid };
    const contrast = calculateRatio(candidate, bg);

    if (contrast === targetRatio)
      return { ...state, color: candidate, contrast };

    if (
      Math.abs(contrast - targetRatio) < Math.abs(state.contrast - targetRatio)
    ) {
      state.color = candidate;
      state.contrast = contrast;
    }

    if (direction === 1) {
      if (contrast < targetRatio) searchLow = mid;
      else searchHigh = mid;
    } else {
      if (contrast < targetRatio) searchHigh = mid;
      else searchLow = mid;
    }
    if (searchHigh - searchLow <= precision) return state;
    state.iterations++;
  }

  return state;
};

interface AdjustOptions<T extends Converter.Type> {
  targetRatio: number;
  maxIterations?: number;
  returnType: T;
  precision?: number;
}
interface AdjustResult<T extends Converter.Type> {
  contrast: number;
  color: ColorTypeMap[T];
  reachedTarget: boolean;
}
/**
 * Adjusts the foreground color to achieve a target contrast ratio with the background.
 * Uses binary search on lightness.
 * @param foreground - Foreground color.
 * @param background - Background color.
 * @param options - Adjustment options.
 * @returns The adjusted color, achieved contrast, and status.
 */
const adjustToRatio = <T extends Converter.Type>(
  foreground: ColorType,
  background: ColorType,
  options: AdjustOptions<T>
): AdjustResult<T> => {
  const {
    targetRatio,
    returnType,
    maxIterations = CONTRAST.maxIterations,
    precision = CONTRAST.precision
  } = options;
  const { achievable, direction, initialRatio } = isRatioAchievable({
    foreground,
    background,
    targetRatio
  });
  if (!achievable || direction === 'none')
    return prepareResult(
      foreground,
      initialRatio,
      returnType,
      options.targetRatio
    );
  const { color, contrast } = findBestColor({
    foreground,
    background,
    targetRatio,
    initialRatio,
    direction: CONTRAST.directions[direction],
    precision,
    maxIterations
  });
  return prepareResult(color, contrast, returnType, options.targetRatio);
};

interface IsWcagCompliantOptions {
  foreground: ColorType;
  background: ColorType;
  level?: WcagLevel;
}
const isWcagCompliant = ({
  background,
  foreground,
  level = 'AA'
}: IsWcagCompliantOptions): boolean => {
  const fgRgb = Converter.toRgb(foreground);
  const bgRgb = Converter.toRgb(background);
  if (bgRgb.a !== 1) throw new Error('Background color must be opaque');
  const effectiveFg = fgRgb.a < 1 ? Rgb.blend(fgRgb, bgRgb).fg : fgRgb;
  return calculateRatio(effectiveFg, bgRgb) >= WCAG[level];
};

export {
  CONTRAST,
  prepareResult,
  findBestColor,
  calculateRatio,
  adjustToRatio,
  isRatioAchievable,
  isWcagCompliant,
  type AdjustOptions,
  type AdjustResult,
  type FindBestColorOptions,
  type IsRatioAchievableResult,
  type WcagLevel,
  WCAG
};
