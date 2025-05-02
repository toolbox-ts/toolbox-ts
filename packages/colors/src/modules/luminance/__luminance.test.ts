import { describe, it, expect } from "vitest";
import { calculateRelative, offset, weights, getVariants } from "./luminance";

describe("luminance.ts", () => {
  it("calculates relative luminance for RGB", () => {
    // Black
    expect(calculateRelative({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 5);
    // White
    expect(calculateRelative({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 5);
    // Red
    expect(calculateRelative({ r: 255, g: 0, b: 0 })).toBeGreaterThan(0);
    // Green
    expect(calculateRelative({ r: 0, g: 255, b: 0 })).toBeGreaterThan(0);
    // Blue
    expect(calculateRelative({ r: 0, g: 0, b: 255 })).toBeGreaterThan(0);
  });

  it("calculates relative luminance for HSL", () => {
    // HSL for white
    expect(calculateRelative({ h: 0, s: 0, l: 100 })).toBeCloseTo(1, 5);
    // HSL for black
    expect(calculateRelative({ h: 0, s: 0, l: 0 })).toBeCloseTo(0, 5);
    // HSL for red
    expect(calculateRelative({ h: 0, s: 100, l: 50 })).toBeGreaterThan(0);
    // HSL for green
    expect(calculateRelative({ h: 120, s: 100, l: 50 })).toBeGreaterThan(0);
    // HSL for blue
    expect(calculateRelative({ h: 240, s: 100, l: 50 })).toBeGreaterThan(0);
  });

  it("calculates relative luminance for Hex", () => {
    expect(calculateRelative("#ffffffff")).toBeCloseTo(1, 5);
    expect(calculateRelative("#000000ff")).toBeCloseTo(0, 5);
    expect(calculateRelative("#ff0000ff")).toBeGreaterThan(0);
    expect(calculateRelative("#00ff00ff")).toBeGreaterThan(0);
    expect(calculateRelative("#0000ffff")).toBeGreaterThan(0);
  });

  it("throws on invalid color", () => {
    //@ts-expect-error testing invalid input
    expect(calculateRelative("notacolor")).toBe(0x00000000);
    expect(calculateRelative({} as any)).toBe(0x00000000);
  });

  it("exports offset and weights", () => {
    expect(typeof offset).toBe("number");
    expect(weights).toHaveProperty("r");
    expect(weights).toHaveProperty("g");
    expect(weights).toHaveProperty("b");
  });
  describe("getVariants", () => {
    it("returns bright and dim variants for a base color", () => {
      const base = "#5b21b6";
      const variants = getVariants(base, "hex");
      expect(variants).toHaveProperty("bright");
      expect(variants).toHaveProperty("dim");
      expect(variants).toHaveProperty("base");
      expect(variants.bright).not.toBe(base);
      expect(variants.dim).not.toBe(base);
      expect(calculateRelative(variants.bright)).toBeGreaterThan(
        calculateRelative(base),
      );
      expect(calculateRelative(variants.dim)).toBeLessThan(
        calculateRelative(base),
      );
      const otherVariants = getVariants(base, "hex", "extra");
      expect(otherVariants).toHaveProperty("bright");
      expect(otherVariants).toHaveProperty("dim");
      expect(otherVariants).toHaveProperty("base");
      expect(otherVariants.bright).not.toBe(base);
      expect(otherVariants.dim).not.toBe(base);
      expect(calculateRelative(otherVariants.bright)).toBeGreaterThan(
        calculateRelative(base),
      );
      expect(calculateRelative(otherVariants.dim)).toBeLessThan(
        calculateRelative(base),
      );
    });
  });
});
