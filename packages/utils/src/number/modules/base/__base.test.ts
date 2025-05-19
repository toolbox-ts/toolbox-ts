import { describe, it, expect } from "vitest";
import {
  normalize,
  normalizeArr,
  round,
  is,
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
  factorial,
} from "./base";

describe("normalize", () => {
  it("returns number as is", () => {
    expect(normalize(42)).toBe(42);
  });
  it("converts numeric string to number", () => {
    expect(normalize("3.14")).toBe(3.14);
  });
  it("returns fallback NaN by default for non-numeric values", () => {
    expect(normalize(NaN)).toBe(NaN);
    expect(normalize(undefined)).toBe(NaN);
    expect(normalize(null)).toBe(NaN);
    expect(normalize({})).toBe(NaN);
  });
  it("returns fallback value if specified", () => {
    expect(normalize(NaN, { fallback: 0 })).toBe(0);
    expect(normalize(undefined, { fallback: -1 })).toBe(-1);
  });
  it("respects checkFinite: false option", () => {
    expect(normalize(Infinity, { checkFinite: false })).toBe(Infinity);
    expect(normalize(-Infinity, { checkFinite: false })).toBe(-Infinity);
  });
  it("returns fallback for infinite when checkFinite is true", () => {
    expect(normalize(Infinity, { checkFinite: true, fallback: 0 })).toBe(0);
  });
});

describe("normalizeArr", () => {
  it("normalizes all elements in an array", () => {
    const arr = [1, "2", "abc", Infinity];
    expect(normalizeArr(arr, { fallback: 0, checkFinite: true })).toEqual([
      1, 2, 0, 0,
    ]);
  });
});

describe("round", () => {
  it("rounds to default 2 decimals", () => {
    expect(round(1.2345)).toBe(1.23);
  });
  it("rounds to specified decimal places", () => {
    expect(round(1.2345, 3)).toBe(1.235);
    expect(round(1.2345, 0)).toBe(1);
  });
  it("handles negative or NaN decimalPosition as 0", () => {
    expect(round(1.2345, -2)).toBe(1);
    expect(round(1.2345, NaN)).toBe(1);
  });
});

describe("is helpers", () => {
  it("checks finite", () => {
    expect(is.finite(5)).toBe(true);
    expect(is.finite("5")).toBe(false);
    expect(is.finite(Infinity)).toBe(false);
  });
  it("checks infinity", () => {
    expect(is.infinity(Infinity)).toBe(true);
    expect(is.infinity(-Infinity)).toBe(true);
    expect(is.infinity(5)).toBe(false);
  });
  it("checks odd/even", () => {
    expect(is.odd(3)).toBe(true);
    expect(is.odd(4)).toBe(false);
    expect(is.odd("3")).toBe(false);
    expect(is.even(4)).toBe(true);
    expect(is.even(3)).toBe(false);
    expect(is.even("4")).toBe(false);
  });
  it("checks integer, safeInteger", () => {
    expect(is.integer(5)).toBe(true);
    expect(is.integer(5.1)).toBe(false);
    expect(is.safeInteger(5)).toBe(true);
    expect(is.safeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
  });
  it("checks positive, negative", () => {
    expect(is.positive(5)).toBe(true);
    expect(is.positive(-5)).toBe(false);
    expect(is.positive(0)).toBe(true);
    expect(is.positive(5, true)).toBe(true);
    expect(is.positive(Number.MAX_SAFE_INTEGER + 1, true)).toBe(false);
    expect(is.negative(-5)).toBe(true);
    expect(is.negative(5)).toBe(false);
    expect(is.negative(0)).toBe(false);
    expect(is.negative(Number.MAX_SAFE_INTEGER + 1, true)).toBe(true);
  });
  it("checks decimal", () => {
    expect(is.decimal(5.1)).toBe(true);
    expect(is.decimal(5)).toBe(false);
    expect(is.decimal("5.1")).toBe(false);
  });
  it("checks inRange", () => {
    expect(is.inRange(5, { min: 1, max: 10 })).toBe(true);
    expect(is.inRange(0, { min: 1, max: 10 })).toBe(false);
    expect(is.inRange(11, { min: 1, max: 10 })).toBe(false);
    expect(is.inRange(NaN, { min: 1, max: 10 })).toBe(false);
  });
  it("checks positiveInt and negativeInt", () => {
    expect(is.positiveInt(5)).toBe(true);
    expect(is.positiveInt(-5)).toBe(false);
    expect(is.positiveInt(0)).toBe(true);
    expect(is.positiveInt(5, true)).toBe(true);
    expect(is.positiveInt(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
    expect(is.positiveInt(Number.MAX_SAFE_INTEGER + 1, false)).toBe(true);
    expect(is.negativeInt(-5)).toBe(true);
    expect(is.negativeInt(5)).toBe(false);
    expect(is.negativeInt(0)).toBe(true);
    expect(is.negativeInt(-5, true)).toBe(true);
    expect(is.negativeInt(Number.MAX_SAFE_INTEGER + 1, true)).toBe(false);
    expect(is.negativeInt(-5, false)).toBe(true);
  });
  it("checks zero", () => {
    expect(is.zero(0)).toBe(true);
    expect(is.zero(5)).toBe(false);
    expect(is.zero(-5)).toBe(false);
  });
  it("checks numeric string", () => {
    expect(is.numericString(5)).toBe(false);
    expect(is.numericString("5")).toBe(true);
    expect(is.numericString("NaN")).toBe(true);
    expect(is.numericString("Infinity")).toBe(true);
  });
});

describe("reduce", () => {
  it("reduces with sum", () => {
    expect(
      reduce({
        numbers: [1, 2, 3],
        fn: (a: number, b: number) => a + b,
        start: 0,
      }),
    ).toBe(6);
  });
  it("reduces with product", () => {
    expect(reduce({ numbers: [2, 3], fn: (a, b) => a * b, start: 1 })).toBe(6);
  });
  it("reduces and rounds to specified decimals", () => {
    expect(
      reduce({
        numbers: [1.234, 2.345],
        fn: (a: number, b: number) => a + b,
        start: 0,
        roundTo: 2,
      }),
    ).toBe(3.58);
  });
  it("returns normalized start value if numbers empty", () => {
    expect(
      reduce({ numbers: [], fn: (a: number, b: number) => a + b, start: 5 }),
    ).toBe(5);
  });
  it("normalizes inputs before reducing", () => {
    expect(
      reduce({
        numbers: [1, "2", null, undefined],
        fn: (a: number, b: number) => a + b,
        start: 0,
        normalizeOpts: { fallback: 0 },
      }),
    ).toBe(3);
  });
});

describe("add", () => {
  it("adds numbers", () => {
    expect(add({ numbers: [1, 2, 3] })).toBe(6);
  });
  it("adds numbers with rounding", () => {
    expect(add({ numbers: [1.234, 2.345], roundTo: 2 })).toBe(3.58);
  });
  it("adds empty array returns 0", () => {
    expect(add({ numbers: [] })).toBe(0);
  });
});

describe("multiply", () => {
  it("multiplies numbers", () => {
    expect(multiply({ numbers: [2, 3, 4] })).toBe(24);
  });
  it("multiplies numbers with rounding", () => {
    expect(multiply({ numbers: [1.2, 3.4], roundTo: 2 })).toBe(4.08);
  });
  it("multiply empty array returns 1", () => {
    expect(multiply({ numbers: [] })).toBe(1);
  });
});

describe("subtract", () => {
  it("subtracts multiple numbers", () => {
    expect(subtract({ numbers: [10, 2, 3] })).toBe(5);
  });
  it("returns normalized first number if only one element", () => {
    expect(subtract({ numbers: ["10"] })).toBe(10);
    expect(subtract({ numbers: [] })).toBe(NaN);
  });
  it("subtracts with rounding", () => {
    expect(subtract({ numbers: [10, 2.555], roundTo: 2 })).toBe(7.45);
  });
});

describe("divide", () => {
  it("divides multiple numbers", () => {
    expect(divide({ numbers: [20, 2, 2] })).toBe(5);
  });
  it("returns normalized first number if only one element", () => {
    expect(divide({ numbers: ["10"] })).toBe(10);
    expect(divide({ numbers: [] })).toBe(NaN);
  });
  it("returns NaN if division by zero encountered", () => {
    expect(divide({ numbers: [10, 0] })).toBeNaN();
    expect(divide({ numbers: [10, 2, 0] })).toBeNaN();
  });
  it("divides with rounding", () => {
    expect(divide({ numbers: [10, 3], roundTo: 2 })).toBeCloseTo(3.33, 2);
  });
});

describe("average", () => {
  it("calculates average", () => {
    expect(average({ numbers: [2, 4, 6] })).toBe(4);
  });
  it("averages with rounding", () => {
    expect(average({ numbers: [1.2, 3.4], roundTo: 2 })).toBeCloseTo(2.3, 2);
  });
  it("returns 0 for empty array", () => {
    expect(average({ numbers: [] })).toBe(0);
  });
});

describe("min", () => {
  it("returns min value", () => {
    expect(min({ numbers: [1, 2, 3] })).toBe(1);
    expect(min({ numbers: ["5", 2, 3] })).toBe(2);
  });
  it("returns fallback for empty", () => {
    expect(min({ numbers: [] })).toBe(NaN);
  });
});

describe("max", () => {
  it("returns max value", () => {
    expect(max({ numbers: [1, 2, 3] })).toBe(3);
    expect(max({ numbers: ["5", 2, 3] })).toBe(5);
  });
  it("returns fallback for empty", () => {
    expect(max({ numbers: [] })).toBe(NaN);
  });
});

describe("range", () => {
  it("returns range [min, max]", () => {
    expect(range({ numbers: [1, 5, 3] })).toEqual(4);
  });
  it("returns fallback range for empty", () => {
    expect(range({ numbers: [] })).toEqual(NaN);
  });
  it("returns NaN for empty and no fallback", () => {
    expect(range({ numbers: [] })).toEqual(NaN);
  });
});

describe("clamp", () => {
  it("clamps number within range", () => {
    expect(clamp(5, { min: 1, max: 10 })).toBe(5);
    expect(clamp(0, { min: 1, max: 10 })).toBe(1);
    expect(clamp(15, { min: 1, max: 10 })).toBe(10);
  });
  it("returns fallback for invalid input", () => {
    expect(clamp(NaN, { min: 1, max: 10, decimal: 0 })).toBe(NaN);
  });
});

describe("factorial", () => {
  it("returns 1 for 0 and 1", () => {
    expect(factorial(0)).toBe(1);
    expect(factorial(1)).toBe(1);
  });

  it("computes factorials for small integers", () => {
    expect(factorial(2)).toBe(2);
    expect(factorial(3)).toBe(6);
    expect(factorial(5)).toBe(120);
    expect(factorial(10)).toBe(3628800);
  });

  it("returns Infinity for inputs > MAX_FACTORIAL", () => {
    expect(factorial(171)).toBe(Infinity);
    expect(factorial(999)).toBe(Infinity);
  });

  it("returns NaN for negative numbers, non-integers, and non-numeric input", () => {
    expect(factorial(-1)).toBeNaN();
    expect(factorial("hello")).toBeNaN();
    expect(factorial(null)).toBeNaN();
    expect(factorial(undefined)).toBeNaN();
    expect(factorial(NaN)).toBeNaN();
    expect(factorial(3.5)).toBeNaN();
  });

  it("returns the correct value for MAX_FACTORIAL (170!)", () => {
    expect(factorial(170)).toBeCloseTo(7.257415615307994e306);
  });
});
