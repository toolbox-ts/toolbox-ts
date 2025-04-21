import { describe, expect, it } from "vitest";
import { C, is } from "./primitive";

describe("primitive", () => {
  describe("is.type", () => {
    it("should validate primitive type strings", () => {
      expect(is.type("string")).toBe(true);
      expect(is.type("number")).toBe(true);
      expect(is.type("undefined")).toBe(false);
      expect(is.type("undefined", { allowUndefined: true })).toBe(true);
      expect(is.type("null")).toBe(false);
      expect(is.type("null", { allowNull: true })).toBe(true);
      expect(is.type("object")).toBe(false);
      expect(is.type(123)).toBe(false);
    });
  });

  describe("type checkers", () => {
    it("should correctly identify types", () => {
      // Test positive cases
      expect(is.string("test")).toBe(true);
      expect(is.number(123)).toBe(true);
      expect(is.boolean(false)).toBe(true);
      expect(
        is.function(() => {
          return;
        }),
      ).toBe(true);
      expect(is.symbol(Symbol())).toBe(true);
      expect(is.bigint(BigInt(1))).toBe(true);
      expect(is.undefined(undefined)).toBe(true);
      expect(is.null(null)).toBe(true);

      // Test negative cases
      expect(is.string(123)).toBe(false);
      expect(is.number("123")).toBe(false);
      expect(is.boolean(0)).toBe(false);
      expect(is.function({})).toBe(false);
      expect(is.symbol("symbol")).toBe(false);
      expect(is.bigint(123)).toBe(false);
      expect(is.undefined(null)).toBe(false);
      expect(is.null(undefined)).toBe(false);
    });
  });
});
