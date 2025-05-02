const normalize = (value: unknown, checkFinite = true): number => {
  const input =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;
  return !isNaN(input) && (Number.isFinite(input) || !checkFinite) ? input : 0;
};
/**
 * Rounds a number to the specified decimal point.
 * E.g., roundTo(1.2345, 2) =\> 1.23
 */
const round = (value: number, decimalPosition = 2) => {
  const effectiveDecimalPosition = Math.max(0, decimalPosition);
  if (effectiveDecimalPosition === 0 || isNaN(effectiveDecimalPosition))
    return Math.round(value);
  const factor = 10 ** effectiveDecimalPosition;
  return Math.round(value * factor) / factor;
};

const is = {
  stringNumber: (value: unknown): value is string =>
    typeof value === "string" && !isNaN(Number(value)),
  finite: (num: unknown): num is number => Number.isFinite(num),
  infinity: (num: unknown): num is number =>
    num === Infinity || num === -Infinity,
  odd: (num: unknown): num is number =>
    typeof num === "number" && num % 2 !== 0,
  even: (num: unknown): num is number =>
    typeof num === "number" && !is.odd(num),
  integer: (n: unknown): n is number => Number.isInteger(n),
  safeInteger: (n: unknown): n is number => Number.isSafeInteger(n),
  positive: (n: unknown, safe = false): n is number =>
    (safe ? is.safeInteger(n) : is.integer(n)) && (n as number) >= 0,
  negative: (num: unknown, safe = false): num is number =>
    !is.positive(num, safe),
  decimal: (num: unknown): num is number =>
    typeof num === "number" && !is.integer(num),
  inRange: (num: unknown, min: number, max: number): num is number =>
    is.finite(num) &&
    is.finite(min) &&
    is.finite(max) &&
    num >= min &&
    num <= max,
  positiveInt: (num: unknown, safe = true): num is number =>
    safe ? is.safeInteger(num) && num >= 0 : is.integer(num) && num >= 0,
  negativeInt: (num: unknown, safe = true): num is number =>
    safe ? is.safeInteger(num) && num <= 0 : is.integer(num) && num <= 0,
  zero: (num: unknown): num is 0 => num === 0,
} as const;

interface ReducerOpts {
  numbers: unknown[];
  fn: (a: number, b: number) => number;
  start: unknown;
  roundTo?: unknown;
}
const reduce = ({ numbers, fn, start, roundTo = 0 }: ReducerOpts): number =>
  round(
    numbers.map((v) => normalize(v)).reduce(fn, normalize(start)),
    normalize(roundTo),
  );

const sum = (numbers: unknown[], roundTo?: number): number =>
  reduce({ numbers, fn: (a, b) => a + b, start: 0, roundTo });

const product = (numbers: unknown[], roundTo?: number): number =>
  reduce({ numbers, fn: (a, b) => a * b, start: 1, roundTo });

const average = (numbers: unknown[], roundTo?: number): number => {
  const n = numbers.length;
  if (n === 0) return 0;
  return sum(numbers, roundTo) / n;
};
const min = (numbers: unknown[]): number =>
  Math.min(...numbers.map((v) => normalize(v, false)));
const max = (numbers: unknown[]): number =>
  Math.max(...numbers.map((v) => normalize(v, false)));

const range = (numbers: unknown[]): number => {
  const minValue = min(numbers);
  const maxValue = max(numbers);
  return maxValue - minValue;
};

const difference = (numbers: unknown[]): number => {
  if (numbers.length < 2) return 0;
  const [first, ...rest] = numbers;
  return reduce({
    numbers: rest,
    fn: (a, b) => a - b,
    start: first,
    roundTo: 0,
  });
};

interface ClampOpts {
  min?: number;
  max?: number;
  decimal?: number;
}
/**
 * Clamps a number between min and max
 *  - Inclusive
 *  - Defaults (min: 0, max: 100, decimal: 0)
 */
const clamp = (
  value: number,
  { min = 0, max = 100, decimal = 0 }: ClampOpts = {},
) => round(Math.max(min, Math.min(max, value)), decimal);

export {
  normalize,
  round,
  is,
  reduce,
  sum,
  product,
  average,
  min,
  max,
  range,
  difference,
  clamp,
  type ClampOpts,
  type ReducerOpts,
};
