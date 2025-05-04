import { describe, it, expect } from "vitest";
import * as ColorWheel from "./colorWheel";

describe("ColorWheel", () => {
  describe("isIn.circle", () => {
    it("returns true for values within 0-360", () => {
      expect(ColorWheel.isIn.circle(0)).toBe(true);
      expect(ColorWheel.isIn.circle(180)).toBe(true);
      expect(ColorWheel.isIn.circle(360)).toBe(true);
    });
    it("returns false for values outside 0-360 or non-numbers", () => {
      expect(ColorWheel.isIn.circle(-1)).toBe(false);
      expect(ColorWheel.isIn.circle(361)).toBe(false);
      expect(ColorWheel.isIn.circle("90")).toBe(false);
      expect(ColorWheel.isIn.circle(null)).toBe(false);
    });
  });

  describe("isIn.sector", () => {
    it("returns true for values in each sector", () => {
      expect(ColorWheel.isIn.sector(0, "redYellow")).toBe(true);
      expect(ColorWheel.isIn.sector(59.999, "redYellow")).toBe(true);
      expect(ColorWheel.isIn.sector(60, "yellowGreen")).toBe(true);
      expect(ColorWheel.isIn.sector(119.999, "yellowGreen")).toBe(true);
      expect(ColorWheel.isIn.sector(120, "greenCyan")).toBe(true);
      expect(ColorWheel.isIn.sector(179.999, "greenCyan")).toBe(true);
      expect(ColorWheel.isIn.sector(180, "cyanBlue")).toBe(true);
      expect(ColorWheel.isIn.sector(239.999, "cyanBlue")).toBe(true);
      expect(ColorWheel.isIn.sector(240, "blueMagenta")).toBe(true);
      expect(ColorWheel.isIn.sector(299.999, "blueMagenta")).toBe(true);
      expect(ColorWheel.isIn.sector(300, "magentaRed")).toBe(true);
      expect(ColorWheel.isIn.sector(359.999, "magentaRed")).toBe(true);
      expect(ColorWheel.isIn.sector(360, "magentaRed")).toBe(true);
    });
    it("returns false for values outside sector or non-numbers", () => {
      expect(ColorWheel.isIn.sector(60, "redYellow")).toBe(false);
      expect(ColorWheel.isIn.sector(120, "yellowGreen")).toBe(false);
      expect(ColorWheel.isIn.sector(180, "greenCyan")).toBe(false);
      expect(ColorWheel.isIn.sector(240, "cyanBlue")).toBe(false);
      expect(ColorWheel.isIn.sector(300, "blueMagenta")).toBe(false);
      expect(ColorWheel.isIn.sector(0, "yellowGreen")).toBe(false);
      expect(ColorWheel.isIn.sector("90", "redYellow")).toBe(false);
      expect(ColorWheel.isIn.sector(null, "redYellow")).toBe(false);
    });
  });
});
