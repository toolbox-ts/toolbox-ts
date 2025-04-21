import { describe, it, expect } from "vitest";
import { is, roundToInteger, subtractAbsolute, sumAbsolute } from "./number";

describe("is", () => {
  describe("nonNegativeInt", () => {
    it("returns true for non-negative integers", () => {
      expect(is.nonNegativeInt(0)).toBe(true);
      expect(is.nonNegativeInt(5)).toBe(true);
    });

    it("returns false for negative integers", () => {
      expect(is.nonNegativeInt(-1)).toBe(false);
    });

    it("returns false for non-integers", () => {
      expect(is.nonNegativeInt(3.14)).toBe(false);
      expect(is.nonNegativeInt("5")).toBe(false);
      expect(is.nonNegativeInt(null)).toBe(false);
    });
  });

  describe("nonNegativeNum", () => {
    it("returns true for non-negative numbers", () => {
      expect(is.nonNegativeNum(0)).toBe(true);
      expect(is.nonNegativeNum(2.5)).toBe(true);
    });

    it("returns false for negative numbers", () => {
      expect(is.nonNegativeNum(-0.1)).toBe(false);
    });

    it("returns false for non-numbers", () => {
      expect(is.nonNegativeNum("1")).toBe(false);
      expect(is.nonNegativeNum(undefined)).toBe(false);
    });
  });

  describe("infinity", () => {
    it("returns true for Infinity", () => {
      expect(is.infinity(Infinity)).toBe(true);
    });

    it("returns false for non-infinite numbers", () => {
      expect(is.infinity(1)).toBe(false);
      expect(is.infinity(-Infinity)).toBe(false);
    });

    it("returns false for non-numbers", () => {
      expect(is.infinity("Infinity")).toBe(false);
    });
  });

  describe("odd", () => {
    it("returns true for odd numbers", () => {
      expect(is.odd(1)).toBe(true);
      expect(is.odd(3)).toBe(true);
    });

    it("returns false for even numbers", () => {
      expect(is.odd(2)).toBe(false);
      expect(is.odd(0)).toBe(false);
    });

    it("returns false for non-numbers", () => {
      expect(is.odd("3")).toBe(false);
    });
  });

  describe("even", () => {
    it("returns true for even numbers", () => {
      expect(is.even(2)).toBe(true);
      expect(is.even(0)).toBe(true);
    });

    it("returns false for odd numbers", () => {
      expect(is.even(1)).toBe(false);
    });

    it("returns false for non-numbers", () => {
      expect(is.even("2")).toBe(false);
    });
  });
});

describe("roundToInteger", () => {
  it("rounds to the nearest integer using default point", () => {
    expect(roundToInteger(1.234)).toBe(1);
    expect(roundToInteger(1.555)).toBe(2);
  });

  it("respects custom point values", () => {
    expect(roundToInteger(1.2345, 100)).toBe(1);
    expect(roundToInteger(1.999, 1)).toBe(2);
  });
});

describe("subtractAbsolute", () => {
  it("subtracts absolute values from the start", () => {
    expect(subtractAbsolute(10, 2, 3)).toBe(5);
    expect(subtractAbsolute(-10, 2, -3)).toBe(5);
  });

  it("returns 0 if all values cancel out", () => {
    expect(subtractAbsolute(5, 2, 3)).toBe(0);
  });
});

describe("sumAbsolute", () => {
  it("sums absolute values", () => {
    expect(sumAbsolute(2, 3, -4)).toBe(9);
    expect(sumAbsolute(-1, -2, -3)).toBe(6);
  });

  it("returns absolute value of start if no other args", () => {
    expect(sumAbsolute(5)).toBe(5);
    expect(sumAbsolute(-5)).toBe(5);
  });
});
