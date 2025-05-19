interface NormalizeOpts {
  checkFinite?: boolean;
  fallback?: number;
}
const normalize = (
  value: unknown,
  { checkFinite = true, fallback = NaN }: NormalizeOpts = {},
): number => {
  const input =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;
  return !isNaN(input) && (Number.isFinite(input) || !checkFinite)
    ? input
    : fallback;
};
const normalizeArr = (arr: unknown[], opts: NormalizeOpts = {}) =>
  arr.map((v) => normalize(v, opts));

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
  numericString: (value: unknown): value is string =>
    typeof value === "string" && (value === "NaN" || !isNaN(Number(value))),
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
  inRange: (
    num: unknown,
    { min, max }: { min: number; max: number },
  ): num is number =>
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
  normalizeOpts?: NormalizeOpts;
}
const reduce = ({
  numbers,
  fn,
  start,
  roundTo = 0,
  normalizeOpts,
}: ReducerOpts): number =>
  numbers.length === 0
    ? normalize(start, normalizeOpts)
    : round(
        normalizeArr(numbers, normalizeOpts).reduce(
          fn,
          normalize(start, normalizeOpts),
        ),
        normalize(roundTo, normalizeOpts),
      );

interface ArithmeticOpts {
  numbers: unknown[];
  roundTo?: number;
  normalizeOpts?: NormalizeOpts;
}
const add = (opts: ArithmeticOpts): number =>
  reduce({ fn: (a, b) => a + b, start: 0, ...opts });
const multiply = (opts: ArithmeticOpts): number =>
  reduce({ fn: (a, b) => a * b, start: 1, ...opts });
const subtract = (opts: ArithmeticOpts): number => {
  if (opts.numbers.length < 2) return normalize(opts.numbers[0]);
  const [first, ...rest] = opts.numbers;
  return reduce({
    numbers: rest,
    fn: (a, b) => a - b,
    start: first,
    roundTo: opts.roundTo,
  });
};
const divide = (opts: ArithmeticOpts): number => {
  if (opts.numbers.length < 2) return normalize(opts.numbers[0]);
  const [first, ...rest] = opts.numbers;
  if (rest.some((b) => normalize(b, { checkFinite: true, fallback: 0 }) === 0))
    return NaN;
  return reduce({
    numbers: rest,
    fn: (a, b) => a / b,
    start: first,
    roundTo: opts.roundTo,
  });
};
const average = (opts: ArithmeticOpts): number => {
  const len = opts.numbers.length;
  if (len === 0) return 0;
  const sum = add(opts);
  return round(sum / len, opts.roundTo);
};

const min = ({ numbers, normalizeOpts = {} }: ArithmeticOpts): number =>
  numbers.length === 0
    ? NaN
    : Math.min(...numbers.map((v) => normalize(v, normalizeOpts)));
const max = ({
  numbers,
  normalizeOpts = { checkFinite: true, fallback: 0 },
}: ArithmeticOpts): number =>
  numbers.length === 0
    ? NaN
    : Math.max(...numbers.map((v) => normalize(v, normalizeOpts)));
const range = (opts: ArithmeticOpts): number => max(opts) - min(opts);

interface ClampOpts {
  min?: number;
  max?: number;
  decimal?: number;
  normalizeOpts?: NormalizeOpts;
}
/**
 * Clamps a number between min and max
 *  - Inclusive
 *  - Defaults (min: 0, max: 100, decimal: 0)
 */
const clamp = (
  value: number,
  { min = 0, max = 100, decimal = 0, normalizeOpts = {} }: ClampOpts = {},
) =>
  normalize(round(Math.max(min, Math.min(max, value)), decimal), normalizeOpts);
const MAX_FACTORIAL = 170;
const _factorial = (n: number): number => (n <= 1 ? 1 : n * _factorial(n - 1));
const factorial = (num: unknown): number => {
  const n = normalize(num);
  if (!is.positiveInt(n, true)) return NaN;
  if (n > MAX_FACTORIAL) return Infinity;
  return _factorial(n);
};
export {
  normalize,
  normalizeArr,
  round,
  factorial,
  is,
  MAX_FACTORIAL,
  reduce,
  add,
  multiply,
  average,
  min,
  max,
  range,
  subtract,
  divide,
  clamp,
  type ClampOpts,
  type ReducerOpts,
  type ArithmeticOpts,
  type NormalizeOpts,
};
