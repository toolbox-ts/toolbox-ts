import { describe, it, expect } from "vitest";
import {
  isWcagCompliant,
  findBestColor,
  calculateRatio,
  adjustToRatio,
  mute,
  isRatioAchievable,
  type AdjustOptions,
  type FindBestColorOptions,
} from "./contrast.js";

describe("calculateRatio", () => {
  it("calculates correct contrast ratio with RGB colors", () => {
    const fg = { r: 100, g: 100, b: 100, a: 1 };
    const bg = { r: 255, g: 255, b: 255, a: 1 };
    const ratio = calculateRatio(fg, bg);
    expect(typeof ratio).toBe("number");
    expect(ratio).toBeGreaterThan(1);
  });

  it("calculates correct contrast ratio with HSL colors", () => {
    const fg = { h: 0, s: 0, l: 40, a: 1 };
    const bg = { h: 0, s: 0, l: 90, a: 1 };
    const ratio = calculateRatio(fg, bg);
    expect(typeof ratio).toBe("number");
    expect(ratio).toBeGreaterThan(1);
  });
});

describe("isRatioAchievable", () => {
  it("detects when current contrast already meets the target with RGB colors", () => {
    const fg = { r: 100, g: 100, b: 100, a: 1 };
    const bg = { r: 255, g: 255, b: 255, a: 1 };
    const targetRatio = 2;
    const result = isRatioAchievable({
      foreground: fg,
      background: bg,
      targetRatio,
    });
    expect(result.achievable).toBe(true);
    expect(result.initialRatio).toBeGreaterThan(0);
  });

  it("detects when darkening is needed with HSL colors", () => {
    const fg = { h: 0, s: 0, l: 99, a: 1 };
    const bg = { h: 0, s: 0, l: 100, a: 1 };
    const result = isRatioAchievable({
      foreground: fg,
      background: bg,
      targetRatio: 7,
    });
    expect(result.achievable).toBe(true);
    expect(result.direction).toBe("darken");
  });

  it("detects when lightening is needed with HSL colors", () => {
    const fg = { h: 0, s: 0, l: 40, a: 1 };
    const bg = { h: 0, s: 0, l: 10, a: 1 };

    const result = isRatioAchievable({
      foreground: fg,
      background: bg,
      targetRatio: 7,
    });
    expect(result.achievable).toBe(true);
    expect(result.direction).toBe("lighten");
  });

  it("detects when ratio cannot be achieved with RGB colors", () => {
    const fg = { r: 128, g: 128, b: 128, a: 1, l: 50 };
    const bg = { r: 128, g: 128, b: 128, a: 1, l: 50 };
    const result = isRatioAchievable({
      foreground: fg,
      background: bg,
      targetRatio: 10,
    });
    expect(result.achievable).toBe(false);
  });
  it("detects when ratio cannot be achieved", () => {
    const fg = { h: 0, s: 0, l: 50, a: 1 };
    const bg = { h: 0, s: 0, l: 60, a: 1 };
    const targetRatio = 21;
    const result = isRatioAchievable({
      foreground: fg,
      background: bg,
      targetRatio,
    });
    expect(result.achievable).toBe(false);
    expect(result.initialRatio).toBeLessThan(targetRatio);
    expect(result.direction).toBe("none");
  });
});

describe("findBestColor", () => {
  it("finds a color improving contrast ratio with HSL colors", () => {
    const options: FindBestColorOptions = {
      foreground: { h: 0, s: 0, l: 40, a: 1 },
      background: { h: 0, s: 0, l: 90, a: 1 },
      targetRatio: 4,
      initialRatio: 2,
      direction: 1,
      precision: 0.01,
      maxIterations: 50,
    };
    const result = findBestColor(options);
    expect(result).toBeDefined();
    expect(result.color).toBeDefined();
    expect(result.contrast).toBeGreaterThanOrEqual(2);
  });

  it("returns a color even if target ratio is unreachable with RGB colors", () => {
    const options: FindBestColorOptions = {
      precision: 0.000001,
      maxIterations: 1,
      foreground: { r: 100, g: 100, b: 100, a: 1 },
      background: { r: 255, g: 255, b: 255, a: 1 },
      targetRatio: 10,
      initialRatio: 2,
      direction: 1,
    };
    const result = findBestColor(options);
    expect(result.color).toBeDefined();
  });
  it("findBestColor returns immediately if contrast === targetRatio on first iteration", () => {
    const background = { h: 0, s: 0, l: 100, a: 1 };
    const foreground = { h: 0, s: 0, l: 50, a: 1 };
    const candidate = { ...foreground, l: 50 };
    const targetRatio = calculateRatio(candidate, background);

    const result = findBestColor({
      background,
      foreground,
      direction: 1,
      initialRatio: calculateRatio(foreground, background),
      targetRatio,
      precision: 0.01,
      maxIterations: 10,
    });

    expect(result.contrast).toBe(targetRatio);
    expect(result.color.l).toBe(50);
  });
});

describe("adjustToRatio", () => {
  it("returns early if no adjustment needed with RGB colors", () => {
    const fg = { r: 100, g: 100, b: 100, a: 1 };
    const bg = { r: 255, g: 255, b: 255, a: 1 };
    const options: AdjustOptions<"rgb"> = { targetRatio: 2, returnType: "rgb" };
    const result = adjustToRatio(fg, bg, options);
    expect(result.reachedTarget).toBe(true);
  });

  it("adjusts color to reach target ratio by lightening with HSL colors", () => {
    // Use a dark background and a mid-light foreground so lightening increases contrast
    const fg = { h: 0, s: 0, l: 40, a: 1 };
    const bg = { h: 0, s: 0, l: 10, a: 1 };
    const options: AdjustOptions<"rgb"> = { targetRatio: 7, returnType: "rgb" };
    const result = adjustToRatio(fg, bg, options);
    expect(result.reachedTarget).toBe(true);
    expect(result.color).toBeDefined();
  });

  it("adjusts color to reach target ratio by darkening with HSL colors", () => {
    const fg = { h: 0, s: 0, l: 40, a: 1 };
    const bg = { h: 0, s: 0, l: 90, a: 1 };
    const options: AdjustOptions<"hsl"> = { targetRatio: 7, returnType: "hsl" };
    const result = adjustToRatio(fg, bg, options);
    expect(result.reachedTarget).toBe(true);
    expect(result.color).toBeDefined();
  });

  it("returns original color if adjustment impossible with RGB colors", () => {
    const fg = { r: 128, g: 128, b: 128, a: 1, l: 50 };
    const bg = { r: 128, g: 128, b: 128, a: 1, l: 50 };
    const options: AdjustOptions<"rgb"> = {
      targetRatio: 10,
      returnType: "rgb",
    };
    const result = adjustToRatio(fg, bg, options);
    expect(result.reachedTarget).toBe(false);
  });

  describe("isWcagCompliant", () => {
    it("returns true for compliant opaque colors", () => {
      // Black text on white background (should be compliant at AA)
      expect(
        isWcagCompliant({
          background: "#ffffff",
          foreground: "#000000",
          level: "AA",
        }),
      ).toBe(true);
    });

    it("returns false for non-compliant opaque colors", () => {
      // Light gray text on white background (should not be compliant at AA)
      expect(
        isWcagCompliant({
          foreground: "#cccccc",
          background: "#ffffff",
          level: "AA",
        }),
      ).toBe(false);
    });

    it("handles semi-transparent foreground by blending", () => {
      // 50% black on white background (should not be compliant at AA)
      expect(
        isWcagCompliant({
          foreground: { r: 0, g: 0, b: 0, a: 0.5 },
          background: "#ffffff",
          level: "AA",
        }),
      ).toBe(false);
    });

    it("throws if background is not fully opaque", () => {
      expect(() =>
        isWcagCompliant({
          foreground: "#000000",
          background: { r: 255, g: 255, b: 255, a: 0.5 },
          level: "AA",
        }),
      ).toThrowError();
    });
  });
});

describe("mute", () => {
  it("returns a muted color in the requested format", () => {
    const foreground = { r: 100, g: 150, b: 200, a: 1 };
    const background = { r: 255, g: 255, b: 255, a: 1 };
    const muted = mute({ foreground, background, returnType: "rgb" });
    expect(muted).toHaveProperty("r");
    expect(muted).toHaveProperty("g");
    expect(muted).toHaveProperty("b");
    expect(muted).toHaveProperty("a");
  });

  it("returns a muted color in hex format", () => {
    const foreground = { r: 100, g: 150, b: 200, a: 1 };
    const background = { r: 0, g: 0, b: 0, a: 1 };
    const muted = mute({ foreground, background, returnType: "hex" });
    expect(typeof muted).toBe("string");
    expect(muted.startsWith("#")).toBe(true);
  });

  it("returns a muted color in hsl format", () => {
    const foreground = { r: 100, g: 150, b: 200, a: 1 };
    const background = { r: 0, g: 0, b: 0, a: 1 };
    const muted = mute({ foreground, background, returnType: "hsl" });
    expect(muted).toHaveProperty("h");
    expect(muted).toHaveProperty("s");
    expect(muted).toHaveProperty("l");
    expect(muted).toHaveProperty("a");
  });

  it("uses custom weight and minRatio", () => {
    const foreground = { r: 10, g: 20, b: 30, a: 1 };
    const background = { r: 240, g: 240, b: 240, a: 1 };
    const muted = mute({
      foreground,
      background,
      returnType: "rgb",
      weight: 0.7,
      minRatio: "AAA",
    });
    expect(muted).toHaveProperty("r");
    expect(muted).toHaveProperty("g");
    expect(muted).toHaveProperty("b");
    expect(muted).toHaveProperty("a");
  });

  it("adjusts color if initial blend does not meet contrast", () => {
    const foreground = { r: 255, g: 255, b: 255, a: 1 };
    const background = { r: 255, g: 255, b: 255, a: 1 };
    const muted = mute({
      foreground,
      background,
      returnType: "rgb",
      weight: 0.5,
      minRatio: "AA",
    });
    expect(muted).toHaveProperty("r");
    expect(muted).toHaveProperty("g");
    expect(muted).toHaveProperty("b");
    expect(muted).toHaveProperty("a");
  });
  it("forces opaque result", () => {
    const foreground = { r: 100, g: 150, b: 200, a: 0.5 };
    const background = { r: 255, g: 255, b: 255, a: 1 };
    const muted = mute({
      foreground,
      background,
      returnType: "rgb",
      weight: 0.5,
      minRatio: "AA",
      forceOpaque: true,
    });
    expect(muted).toHaveProperty("a", 1);
  });
});
