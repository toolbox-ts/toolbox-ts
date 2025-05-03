import { describe, it, expect } from "vitest";
import {
  isHsl,
  normalize,
  chromaticity,
  interpolate,
  matchAdjustment,
  transparent,
  saturation,
  lightness,
  adjust,
  type Hsl,
} from "./hsl";

describe("hsl.ts", () => {
  describe("saturation and lightness", () => {
    it("identifies valid saturation/lightness values", () => {
      expect(saturation.is(0)).toBe(true);
      expect(saturation.is(50)).toBe(true);
      expect(saturation.is(100)).toBe(true);
      expect(saturation.is(-1)).toBe(false);
      expect(saturation.is(101)).toBe(false);
      expect(saturation.is("50")).toBe(false);

      expect(lightness.is(0)).toBe(true);
      expect(lightness.is(100)).toBe(true);
    });
  });

  describe("isHsl", () => {
    it("returns true for valid HSL objects", () => {
      expect(isHsl({ h: 120, s: 50, l: 50 })).toBe(true);
      expect(isHsl({ h: 0, s: 0, l: 0 })).toBe(true);
      expect(isHsl({ h: 360, s: 100, l: 100 })).toBe(true);
      expect(isHsl({ h: 120, s: 50, l: 50, a: 0.5 })).toBe(true);
      expect(isHsl({ h: 120, s: 50, l: 50, a: 1 })).toBe(true);
      expect(isHsl({ h: 120, s: 50, l: 50, a: 0 })).toBe(true);
    });

    it("returns false for invalid HSL objects", () => {
      expect(isHsl({ h: -1, s: 50, l: 50 })).toBe(false);
      expect(isHsl({ h: 361, s: 50, l: 50 })).toBe(false);
      expect(isHsl({ h: 120, s: -1, l: 50 })).toBe(false);
      expect(isHsl({ h: 120, s: 101, l: 50 })).toBe(false);
      expect(isHsl({ h: 120, s: 50, l: -1 })).toBe(false);
      expect(isHsl({ h: 120, s: 50, l: 101 })).toBe(false);
      expect(isHsl({ h: 120, s: 50, l: 50, a: -0.1 })).toBe(false);
      expect(isHsl({ h: 120, s: 50, l: 50, a: 1.1 })).toBe(false);
      expect(isHsl({ h: 120, s: 50 })).toBe(false);
      expect(isHsl({})).toBe(false);
      expect(isHsl(null)).toBe(false);
      expect(isHsl(undefined)).toBe(false);
      expect(isHsl(123)).toBe(false);
    });
  });

  describe("normalize", () => {
    it("returns transparent for invalid input", () => {
      expect(normalize(null)).toEqual(transparent);
      expect(normalize(undefined)).toEqual(transparent);
      expect(normalize({})).toEqual(transparent);
      expect(normalize({ h: 0, s: 0 })).toEqual(transparent);
      expect(normalize({ h: 0, s: 0, l: 0, a: 2 })).toEqual(transparent);
    });

    it("returns Hsla with a defaulted to 1 if missing", () => {
      expect(normalize({ h: 1, s: 2, l: 3 })).toEqual({
        h: 1,
        s: 2,
        l: 3,
        a: 1,
      });
    });

    it("returns Hsla with a preserved if present", () => {
      expect(normalize({ h: 1, s: 2, l: 3, a: 0.5 })).toEqual({
        h: 1,
        s: 2,
        l: 3,
        a: 0.5,
      });
      expect(normalize({ h: 1, s: 2, l: 3, a: 1 })).toEqual({
        h: 1,
        s: 2,
        l: 3,
        a: 1,
      });
      expect(normalize({ h: 1, s: 2, l: 3, a: 0 })).toEqual({
        h: 1,
        s: 2,
        l: 3,
        a: 0,
      });
    });
  });

  describe("chromaticity", () => {
    it("calculates chromaticity for HSL values", () => {
      expect(chromaticity({ h: 0, s: 0, l: 0 })).toBe(0);
      expect(chromaticity({ h: 0, s: 100, l: 50 })).toBeCloseTo(1);
      expect(chromaticity({ h: 0, s: 50, l: 50 })).toBeCloseTo(0.5);
      expect(chromaticity({ h: 0, s: 100, l: 0 })).toBeCloseTo(0);
      expect(chromaticity({ h: 0, s: 100, l: 100 })).toBeCloseTo(0);
    });
  });

  describe("interpolate", () => {
    it("calculates interpolation value for HSL", () => {
      const hsl: Hsl = { h: 120, s: 100, l: 50 };
      expect(interpolate(hsl)).toBeCloseTo(
        1 * (1 - Math.abs(((120 / 60) % 2) - 1)),
      );
      expect(interpolate({ h: 0, s: 100, l: 50 }, 60)).toBeCloseTo(
        1 * (1 - Math.abs(((0 / 60) % 2) - 1)),
      );
    });

    it("uses provided chromaticity if given", () => {
      const hsl: Hsl = { h: 120, s: 100, l: 50 };
      expect(interpolate(hsl, 0.5)).toBeCloseTo(
        0.5 * (1 - Math.abs(((120 / 60) % 2) - 1)),
      );
    });
  });

  describe("matchAdjustment", () => {
    it("calculates match adjustment for HSL", () => {
      const hsl: Hsl = { h: 0, s: 100, l: 50 };
      const c = chromaticity(hsl);
      expect(matchAdjustment(hsl)).toBeCloseTo(0.5 - c / 2);
    });

    it("handles l > 1 as percent", () => {
      const hsl: Hsl = { h: 0, s: 100, l: 100 };
      const c = chromaticity(hsl);
      expect(matchAdjustment(hsl)).toBeCloseTo(1 - c / 2);
    });
  });
  describe("adjust.hue", () => {
    it("increases hue by the correct amount", () => {
      const hsl: Hsl = { h: 30, s: 50, l: 50 };
      // delta = 0.5, sector = 360, so +180
      const result = adjust.hue(hsl, 0.5);
      expect(result.h).toBe(210);
      expect(result.s).toBe(50);
      expect(result.l).toBe(50);
    });

    it("wraps hue around the color wheel", () => {
      const hsl: Hsl = { h: 350, s: 50, l: 50 };
      // delta = 0.1, sector = 360, so +36, 350+36=386, 386%360=26
      const result = adjust.hue(hsl, 0.1);
      expect(result.h).toBe(26);
    });

    it("handles negative delta", () => {
      const hsl: Hsl = { h: 10, s: 50, l: 50 };
      // delta = -0.1, sector = 360, so -36, 10-36=-26, -26%360=334
      const result = adjust.hue(hsl, -0.1);
      expect(result.h).toBe(334);
    });

    it("does not mutate the original object", () => {
      const hsl: Hsl = { h: 100, s: 50, l: 50 };
      const result = adjust.hue(hsl, 0.2);
      expect(result).not.toBe(hsl);
      expect(hsl.h).toBe(100);
    });
  });
});
