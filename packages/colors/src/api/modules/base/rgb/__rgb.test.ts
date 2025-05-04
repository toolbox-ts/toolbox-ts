import { describe, it, expect } from "vitest";
import {
  blendAlpha,
  blendWeighted,
  normalize,
  isRgb,
  transparent,
  type Rgba,
  toString,
  invert,
  stringToRgb,
} from "./rgb";

describe("rgb.ts", () => {
  describe("isRgb", () => {
    it("returns true for valid Rgb without alpha", () => {
      expect(isRgb({ r: 0, g: 128, b: 255 })).toBe(true);
      expect(isRgb({ r: 255, g: 255, b: 255 })).toBe(true);
      expect(isRgb({ r: 0, g: 0, b: 0 })).toBe(true);
    });

    it("returns true for valid Rgb with alpha in [0,1]", () => {
      expect(isRgb({ r: 0, g: 128, b: 255, a: 0 })).toBe(true);
      expect(isRgb({ r: 0, g: 128, b: 255, a: 1 })).toBe(true);
      expect(isRgb({ r: 0, g: 128, b: 255, a: 0.5 })).toBe(true);
    });

    it("returns false for out-of-range channels", () => {
      expect(isRgb({ r: -1, g: 0, b: 0 })).toBe(false);
      expect(isRgb({ r: 0, g: 256, b: 0 })).toBe(false);
      expect(isRgb({ r: 0, g: 0, b: 300 })).toBe(false);
    });

    it("returns false for out-of-range alpha", () => {
      expect(isRgb({ r: 0, g: 0, b: 0, a: -0.1 })).toBe(false);
      expect(isRgb({ r: 0, g: 0, b: 0, a: 1.1 })).toBe(false);
      expect(isRgb({ r: 0, g: 0, b: 0, a: 2 })).toBe(false);
    });

    it("returns false for non-object or missing channels", () => {
      expect(isRgb(null)).toBe(false);
      expect(isRgb(undefined)).toBe(false);
      expect(isRgb(123)).toBe(false);
      expect(isRgb({})).toBe(false);
      expect(isRgb({ r: 0, g: 0 })).toBe(false);
      expect(isRgb({ g: 0, b: 0 })).toBe(false);
    });
  });

  describe("normalize", () => {
    it("returns transparent for invalid input", () => {
      expect(normalize(null)).toEqual(transparent);
      expect(normalize(undefined)).toEqual(transparent);
      expect(normalize({})).toEqual(transparent);
      expect(normalize({ r: 0, g: 0 })).toEqual(transparent);
      expect(normalize({ r: 0, g: 0, b: 0, a: 2 })).toEqual(transparent);
    });

    it("returns Rgba with a defaulted to 1 if missing", () => {
      expect(normalize({ r: 1, g: 2, b: 3 })).toEqual({
        r: 1,
        g: 2,
        b: 3,
        a: 1,
      });
    });

    it("returns Rgba with a preserved if present", () => {
      expect(normalize({ r: 1, g: 2, b: 3, a: 0.5 })).toEqual({
        r: 1,
        g: 2,
        b: 3,
        a: 0.5,
      });
      expect(normalize({ r: 1, g: 2, b: 3, a: 1 })).toEqual({
        r: 1,
        g: 2,
        b: 3,
        a: 1,
      });
      expect(normalize({ r: 1, g: 2, b: 3, a: 0 })).toEqual({
        r: 1,
        g: 2,
        b: 3,
        a: 0,
      });
    });
  });

  describe("blendAlpha", () => {
    it("blendAlphas two colors with full alpha", () => {
      const fg: Rgba = { r: 255, g: 0, b: 0, a: 1 };
      const bg: Rgba = { r: 0, g: 0, b: 255, a: 1 };
      expect(blendAlpha(fg, bg).fg).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    });

    it("blendAlphas two colors with half alpha", () => {
      const fg: Rgba = { r: 255, g: 0, b: 0, a: 0.5 };
      const bg: Rgba = { r: 0, g: 0, b: 255, a: 1 };
      // alpha = 128/255 ≈ 0.50196
      // r = 255*0.50196 + 0*0.49804 ≈ 128
      // g = 0
      // b = 0*0.50196 + 255*0.49804 ≈ 128
      expect(blendAlpha(fg, bg).fg).toEqual({ r: 128, g: 0, b: 128, a: 1 });
    });

    it("blendAlphas with fully transparent fg", () => {
      const fg: Rgba = { r: 255, g: 0, b: 0, a: 0 };
      const bg: Rgba = { r: 0, g: 255, b: 0, a: 1 };
      expect(blendAlpha(fg, bg).fg).toEqual({ r: 0, g: 255, b: 0, a: 1 });
    });
  });
  describe("blendWeighted", () => {
    it("returns the foreground color if weight is 1", () => {
      const fg = { r: 100, g: 150, b: 200, a: 1 };
      const bg = { r: 10, g: 20, b: 30, a: 1 };
      const { a, b, g, r } = blendWeighted({ fg, bg, weight: 1 });
      expect(r).toEqual(100);
      expect(g).toEqual(150);
      expect(b).toEqual(200);
    });

    it("returns the background color if weight is 0", () => {
      const fg = { r: 100, g: 150, b: 200, a: 1 };
      const bg = { r: 10, g: 20, b: 30, a: 1 };
      const { a, b, g, r } = blendWeighted({ fg, bg, weight: 0 });
      expect(r).toEqual(bg.r);
      expect(g).toEqual(bg.g);
      expect(b).toEqual(bg.b);
    });

    it("blends 50/50 between foreground and background", () => {
      const fg = { r: 100, g: 200, b: 50, a: 1 };
      const bg = { r: 0, g: 0, b: 100, a: 1 };
      const { a, b, g, r } = blendWeighted({ fg, bg, weight: 0.5 });
      expect(r).toEqual(50);
      expect(g).toEqual(100);
      expect(b).toEqual(75);
    });

    it("handles alpha channel blending", () => {
      const fg = { r: 255, g: 0, b: 0, a: 0.5 };
      const bg = { r: 0, g: 0, b: 255, a: 0.5 };
      const { a, b, g, r } = blendWeighted({ fg, bg, weight: 0.5 });
      expect(r).toBe(128);
      expect(g).toBe(0);
      expect(b).toBe(128);
      expect(a).toBe(0.5);
    });

    it("clamps weight below 0 to 0 ", () => {
      const fg = { r: 100, g: 100, b: 100, a: 1 };
      const bg = { r: 0, g: 0, b: 0, a: 1 };
      const { a, b, g, r } = blendWeighted({ fg, bg, weight: -1 });
      expect(r).toEqual(bg.r);
      expect(g).toEqual(bg.g);
      expect(b).toEqual(bg.b);
    });
    it("clamps weight above 1 to 1 ", () => {
      const fg = { r: 100, g: 100, b: 100, a: 1 };
      const bg = { r: 0, g: 0, b: 0, a: 1 };
      const { a, b, g, r } = blendWeighted({ fg, bg, weight: 2 });
      expect(r).toEqual(fg.r);
      expect(g).toEqual(fg.g);
      expect(b).toEqual(fg.b);
    });
  });

  describe("toString", () => {
    it("serializes RGB without alpha as rgba(..., 1)", () => {
      expect(toString({ r: 10, g: 20, b: 30 })).toBe("rgba(10, 20, 30, 1)");
    });
    it("serializes RGB with alpha", () => {
      expect(toString({ r: 1, g: 2, b: 3, a: 0.5 })).toBe("rgba(1, 2, 3, 0.5)");
      expect(toString({ r: 255, g: 255, b: 255, a: 0 })).toBe(
        "rgba(255, 255, 255, 0)",
      );
      expect(toString({ r: 0, g: 0, b: 0, a: 1 })).toBe("rgba(0, 0, 0, 1)");
    });
  });

  describe("stringToRgb", () => {
    it("parses rgb string without alpha", () => {
      expect(stringToRgb("rgb(10, 20, 30)")).toEqual({
        r: 10,
        g: 20,
        b: 30,
        a: 1,
      });
      expect(stringToRgb("rgb(0,0,0)")).toEqual({ r: 0, g: 0, b: 0, a: 1 });
      expect(stringToRgb("rgb(255,255,255)")).toEqual({
        r: 255,
        g: 255,
        b: 255,
        a: 1,
      });
    });
    it("parses rgba string with alpha", () => {
      expect(stringToRgb("rgba(1, 2, 3, 0.5)")).toEqual({
        r: 1,
        g: 2,
        b: 3,
        a: 0.5,
      });
      expect(stringToRgb("rgba(255,255,255,0)")).toEqual({
        r: 255,
        g: 255,
        b: 255,
        a: 0,
      });
      expect(stringToRgb("rgba(0,0,0,1)")).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    });
    it("parses with extra spaces", () => {
      expect(stringToRgb("rgba( 10 , 20 , 30 , 0.7 )")).toEqual({
        r: 10,
        g: 20,
        b: 30,
        a: 0.7,
      });
      expect(stringToRgb("rgb( 1 , 2 , 3 )")).toEqual({
        r: 1,
        g: 2,
        b: 3,
        a: 1,
      });
    });
    it("throws on invalid string", () => {
      expect(() => stringToRgb("not a color")).toThrow();
      expect(() => stringToRgb("rgx(100,100,100,1)")).toThrow();
    });
  });
  describe("invert", () => {
    it("inverts a fully opaque color", () => {
      expect(invert({ r: 0, g: 0, b: 0, a: 1 })).toEqual({
        r: 255,
        g: 255,
        b: 255,
        a: 1,
      });
      expect(invert({ r: 255, g: 255, b: 255, a: 1 })).toEqual({
        r: 0,
        g: 0,
        b: 0,
        a: 1,
      });
      expect(invert({ r: 100, g: 150, b: 200, a: 1 })).toEqual({
        r: 155,
        g: 105,
        b: 55,
        a: 1,
      });
    });

    it("inverts with alpha < 1 (clamped to [0,1])", () => {
      expect(invert({ r: 10, g: 20, b: 30, a: 0.5 })).toEqual({
        r: 245,
        g: 235,
        b: 225,
        a: 0.5,
      });
      expect(invert({ r: 10, g: 20, b: 30, a: -1 })).toEqual({
        r: 245,
        g: 235,
        b: 225,
        a: 0,
      });
      expect(invert({ r: 10, g: 20, b: 30, a: 2 })).toEqual({
        r: 245,
        g: 235,
        b: 225,
        a: 1,
      });
    });

    it("clamps input channels before inverting", () => {
      expect(invert({ r: -10, g: 300, b: 128, a: 1 })).toEqual({
        r: 255,
        g: 0,
        b: 127,
        a: 1,
      });
    });
  });
});
