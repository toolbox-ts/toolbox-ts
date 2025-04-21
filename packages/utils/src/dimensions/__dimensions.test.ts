import { describe, it, expect } from "vitest";
import {
  is,
  isEqual,
  isType,
  isTyped,
  add,
  subtract,
  sum,
  calculate,
  get,
  STRATEGY,
  C,
  createTypedCfg,
} from "./dimensions"; // adjust the path as needed

describe("Utility: is", () => {
  it("should return true for valid Spatial.Dimensions", () => {
    expect(is({ width: 5, height: 10 })).toBe(true);
  });

  it("should return false for invalid Spatial.Dimensions", () => {
    expect(is({ width: -1, height: 2 })).toBe(false);
    expect(is({})).toBe(false);
    expect(is(null)).toBe(false);
  });
});

describe("Utility: isEqual", () => {
  it("should return true for equal dimensions", () => {
    expect(isEqual({ width: 5, height: 5 }, { width: 5, height: 5 })).toBe(
      true,
    );
  });

  it("should return false for different dimensions", () => {
    expect(isEqual({ width: 5, height: 5 }, { width: 5, height: 6 })).toBe(
      false,
    );
  });
});

describe("Utility: isType", () => {
  it("should validate type strings correctly", () => {
    expect(isType("fixed")).toBe(true);
    expect(isType("invalid")).toBe(false);
    expect(isType(null)).toBe(false);
  });
});

describe("Utility: isTyped", () => {
  it("should return true for a valid typed object", () => {
    expect(isTyped({ type: "fixed", width: 10, height: 3 })).toBe(true);
  });

  it("should return false for invalid typed object", () => {
    expect(isTyped({ type: "fixed", width: "10", height: 3 })).toBe(false);
    expect(isTyped({})).toBe(false);
  });
});

describe("STRATEGY", () => {
  it("should resolve fixed strategy with defaults", () => {
    expect(STRATEGY.fixed.resolve()).toEqual({
      type: "fixed",
      width: 10,
      height: 3,
    });
  });

  it("should resolve fixed strategy with input", () => {
    expect(STRATEGY.fixed.resolve({ width: 5, height: 2 })).toEqual({
      type: "fixed",
      width: 5,
      height: 2,
    });
  });

  it("should resolve dynamic as default", () => {
    expect(STRATEGY.dynamic.resolve()).toEqual({
      type: "dynamic",
      width: Infinity,
      height: Infinity,
    });
  });

  it("should resolve dynamicWidth with height fallback", () => {
    expect(STRATEGY.dynamicWidth.resolve()).toEqual({
      type: "dynamicWidth",
      width: Infinity,
      height: 3,
    });
    expect(STRATEGY.dynamicWidth.resolve({ height: 10 })).toEqual({
      type: "dynamicWidth",
      width: Infinity,
      height: 10,
    });
  });

  it("should resolve dynamicHeight with width fallback", () => {
    expect(STRATEGY.dynamicHeight.resolve()).toEqual({
      type: "dynamicHeight",
      width: 10,
      height: Infinity,
    });
    expect(STRATEGY.dynamicHeight.resolve({ width: 7 })).toEqual({
      type: "dynamicHeight",
      width: 7,
      height: Infinity,
    });
  });

  it("should validate guards correctly", () => {
    expect(STRATEGY.fixed.guard({ type: "fixed", width: 5, height: 5 })).toBe(
      true,
    );
    expect(STRATEGY.dynamic.guard({ width: Infinity, height: Infinity })).toBe(
      true,
    );
    expect(STRATEGY.dynamicWidth.guard({ width: Infinity, height: 2 })).toBe(
      true,
    );
    expect(STRATEGY.dynamicHeight.guard({ width: 5, height: Infinity })).toBe(
      true,
    );
  });
});

describe("createTypedCfg", () => {
  it("should create typed config with validator", () => {
    const cfg = createTypedCfg({
      key: "testKey",
      dimensions: { type: "fixed", width: 1, height: 2 },
    });

    expect(cfg.key).toBe("testKey");
    expect(cfg.value).toEqual({ type: "fixed", width: 1, height: 2 });
    expect(cfg.validator(cfg.value)).toBe(true);
  });

  it("should resolve default dimensions for missing values", () => {
    const cfg = createTypedCfg({
      key: "dynHeight",
      dimensions: { type: "dynamicHeight" },
    });

    expect(cfg.value).toEqual({
      type: "dynamicHeight",
      height: Infinity,
      width: 10,
    });
  });
});

describe("Math utilities", () => {
  it("add should sum two dimensions", () => {
    expect(add({ width: 1, height: 2 }, { width: 3, height: 4 })).toEqual({
      width: 4,
      height: 6,
    });
  });

  it("subtract should subtract two dimensions", () => {
    expect(subtract({ width: 5, height: 7 }, { width: 2, height: 3 })).toEqual({
      width: 3,
      height: 4,
    });
  });

  it("sum should total an array of dimensions", () => {
    expect(
      sum([
        { width: 1, height: 2 },
        { width: 3, height: 4 },
      ]),
    ).toEqual({ width: 4, height: 6 });
  });

  it("calculate.oriented horizontal", () => {
    const result = calculate.oriented(
      [
        { width: 1, height: 2 },
        { width: 3, height: 1 },
      ],
      "horizontal",
    );
    expect(result).toEqual({ width: 4, height: 2 });
  });

  it("calculate.oriented vertical", () => {
    const result = calculate.oriented(
      [
        { width: 2, height: 5 },
        { width: 3, height: 7 },
      ],
      "vertical",
    );
    expect(result).toEqual({ width: 3, height: 12 });
  });
});

describe("get.orientedDimensionKeys", () => {
  it("should return primary/secondary keys for horizontal", () => {
    expect(get.orientedDimensionKeys("horizontal")).toEqual({
      width: "primary",
      height: "secondary",
    });
  });

  it("should return primary/secondary keys for vertical", () => {
    expect(get.orientedDimensionKeys("vertical")).toEqual({
      width: "secondary",
      height: "primary",
    });
  });
});
