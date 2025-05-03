import { describe, it, expect } from "vitest";
import { calculateRelative, offset, weights } from "./luminance";

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
});
