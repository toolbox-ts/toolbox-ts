import type { SharedKeyword } from "./shared.js";
/** https://www.w3.org/TR/css-values-4/#trig-funcs */
type Trigonometric = "cos" | "sin" | "tan" | "asin" | "acos" | "atan" | "atan2";

/** https://drafts.csswg.org/css-values/#exponent-funcs */
type Exponential = "pow" | "sqrt" | "hypot" | "log" | "exp";

/** https://www.w3.org/TR/css-values-4/#round-func */
type SteppedValue = "round" | "mod" | "rem";

/** https://www.w3.org/TR/css-values-4/#comp-func */
type Comparison = "min" | "max" | "clamp";

/**  https://www.w3.org/TR/css-values-4/#sign-funcs */
type SignRelated = "abs" | "sign";

type Type =
  /** https://www.w3.org/TR/css-values-4/#calc-func */
  | "calc"
  | Trigonometric
  | Exponential
  | Comparison
  | SteppedValue
  | SignRelated;

type Keyword = "e" | "pi" | "infinity" | "-infinity" | "NaN" | SharedKeyword;

type Function<T extends Type> = `${T}(${string})`;

export type { Type, Function, Keyword };
