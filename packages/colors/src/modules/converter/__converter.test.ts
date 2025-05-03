import { describe, it, expect } from "vitest";
import {
  defaults,
  resolve,
  hslTo,
  hexTo,
  rgbTo,
  validators,
  getColorType,
} from "./converter.js";

describe("converter.ts", () => {
  describe("rgbTo", () => {
    it("hex", () => {
      expect(rgbTo.hex({ r: 255, g: 0, b: 0, a: 1 })).toBe("#ff0000ff");
      expect(rgbTo.hex({ r: 0, g: 255, b: 0, a: 0.5 })).toBe("#00ff0080");
      expect(rgbTo.hex({ r: 0, g: 0, b: 255 })).toBe("#0000ffff");
      // delta !== 0, L > 0.5
      expect(rgbTo.hex({ r: 200, g: 200, b: 100, a: 1 })).toBe("#c8c864ff");
      // delta !== 0, L <= 0.5
      expect(rgbTo.hex({ r: 100, g: 200, b: 100, a: 1 })).toBe("#64c864ff");
      // if (G < B) H += 6
      expect(rgbTo.hex({ r: 255, g: 0, b: 128, a: 1 })).toBe("#ff0080ff");
    });
    it("hsl", () => {
      // max === R, G < B (should trigger H += 6)
      expect(rgbTo.hsl({ r: 255, g: 0, b: 128 })).toMatchObject({
        h: 330,
        s: 100,
        l: 50,
        a: 1,
      });
      // max === R, G >= B
      expect(rgbTo.hsl({ r: 255, g: 128, b: 0 })).toMatchObject({
        h: 30,
        s: 100,
        l: 50,
        a: 1,
      });
      // max === G
      expect(rgbTo.hsl({ r: 0, g: 255, b: 128 })).toMatchObject({
        h: 150,
        s: 100,
        l: 50,
      });
      // max === B
      expect(rgbTo.hsl({ r: 0, g: 128, b: 255 })).toMatchObject({
        h: 210,
        s: 100,
        l: 50,
      });
      // L > 0.5, triggers denom = 2 - max - min
      expect(rgbTo.hsl({ r: 200, g: 200, b: 100 })).toMatchObject({
        l: expect.any(Number),
        s: expect.any(Number),
      });
    });
  });

  describe("hex", () => {
    it("rgb", () => {
      expect(hexTo.rgb("#ff0000ff")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(hexTo.rgb("#00ff0080")).toEqual({ r: 0, g: 255, b: 0, a: 0.5 });
      expect(hexTo.rgb("#0000ffff")).toEqual({ r: 0, g: 0, b: 255, a: 1 });
    });
    it("hsl", () => {
      expect(hexTo.hsl("#ff0000ff")).toMatchObject({
        h: 0,
        s: 100,
        l: 50,
        a: 1,
      });
      expect(hexTo.hsl("#00ff0080")).toMatchObject({
        h: 120,
        s: 100,
        l: 50,
        a: 0.5,
      });
      expect(hexTo.hsl("#0000ffff")).toMatchObject({
        h: 240,
        s: 100,
        l: 50,
        a: 1,
      });
    });
  });

  describe("hsl", () => {
    it("rgb", () => {
      // redYellow: h = 0
      expect(hslTo.rgb({ h: 0, s: 100, l: 50, a: 1 })).toMatchObject({
        r: 255,
        g: 0,
        b: 0,
        a: 1,
      });
      // yellowGreen: h = 90
      expect(hslTo.rgb({ h: 90, s: 100, l: 50, a: 1 })).toMatchObject({
        r: 128,
        g: 255,
        b: 0,
        a: 1,
      });
      // greenCyan: h = 150
      expect(hslTo.rgb({ h: 150, s: 100, l: 50, a: 1 })).toMatchObject({
        r: 0,
        g: 255,
        b: 128,
        a: 1,
      });
      // cyanBlue: h = 210
      expect(hslTo.rgb({ h: 210, s: 100, l: 50, a: 1 })).toMatchObject({
        r: 0,
        g: 128,
        b: 255,
        a: 1,
      });
      // blueMagenta: h = 270
      expect(hslTo.rgb({ h: 270, s: 100, l: 50, a: 1 })).toMatchObject({
        r: 128,
        g: 0,
        b: 255,
        a: 1,
      });
      // magentaRed: h = 330
      expect(hslTo.rgb({ h: 330, s: 100, l: 50, a: 1 })).toMatchObject({
        r: 255,
        g: 0,
        b: 128,
        a: 1,
      });
    });
    it("hex", () => {
      expect(hslTo.hex({ h: 0, s: 100, l: 50, a: 1 })).toBe("#ff0000ff");
      expect(hslTo.hex({ h: 120, s: 100, l: 50, a: 0.5 })).toBe("#00ff0080");
      expect(hslTo.hex({ h: 240, s: 100, l: 50 })).toBe("#0000ffff");
      // yellowGreen
      expect(hslTo.hex({ h: 90, s: 100, l: 50, a: 1 })).toBe("#80ff00ff");
      // greenCyan
      expect(hslTo.hex({ h: 150, s: 100, l: 50, a: 1 })).toBe("#00ff80ff");
      // cyanBlue
      expect(hslTo.hex({ h: 210, s: 100, l: 50, a: 1 })).toBe("#0080ffff");
      // blueMagenta
      expect(hslTo.hex({ h: 270, s: 100, l: 50, a: 1 })).toBe("#8000ffff");
      // magentaRed
      expect(hslTo.hex({ h: 330, s: 100, l: 50, a: 1 })).toBe("#ff0080ff");
    });
  });
});
describe("resolve", () => {
  it("resolves and validates colors", () => {
    const rgbColor = { r: 255, g: 0, b: 0, a: 1 };
    const hexColor = "#ff0000ff";
    const hslColor = { h: 0, s: 100, l: 50, a: 1 };

    expect(resolve(rgbColor, "rgb")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(resolve(hexColor, "hex")).toBe("#ff0000ff");
    expect(resolve(hslColor, "hsl")).toEqual({ h: 0, s: 100, l: 50, a: 1 });
  });

  it("returns defaults for invalid input", () => {
    expect(resolve("notacolor" as any, "rgb")).toEqual(defaults.rgb);
    expect(resolve("notacolor" as any, "hex")).toBe(defaults.hex);
    expect(resolve("notacolor" as any, "hsl")).toEqual(defaults.hsl);
  });
  it("returns defaults for unsupported types", () => {
    // @ts-expect-error testing unsupported type
    expect(resolve({} as any, "any")).toEqual(undefined);
    // @ts-expect-error testing unsupported type
    expect(resolve({} as any, "any")).toBe(undefined);
    // @ts-expect-error testing unsupported type
    expect(resolve({} as any, "any")).toEqual(undefined);
  });
});

describe("validators", () => {
  it("validates rgb, hex, and hsl", () => {
    expect(validators.rgb({ r: 255, g: 0, b: 0, a: 1 })).toBe(true);
    expect(validators.hex("#ff0000ff")).toBe(true);
    expect(validators.hsl({ h: 0, s: 100, l: 50, a: 1 })).toBe(true);

    expect(validators.rgb("notacolor")).toBe(false);
    expect(validators.hex("notacolor")).toBe(false);
    expect(validators.hsl("notacolor")).toBe(false);
  });
});
describe("getColorType", () => {
  it("returns the correct color type", () => {
    expect(getColorType({ r: 255, g: 0, b: 0, a: 1 })).toBe("rgb");
    expect(getColorType("#ff0000ff")).toBe("hex");
    expect(getColorType({ h: 0, s: 100, l: 50, a: 1 })).toBe("hsl");
    //@ts-expect-error testing unsupported type
    expect(getColorType("notacolor")).toBe(undefined);
  });
});
