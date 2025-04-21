import { describe, expect, it } from "vitest";
import { clone, toString, create, is } from "./base.js";
describe("Matrix base", () => {
  describe("clone", () => {
    it("creates deep copy of matrix", () => {
      const original = [
        ["a", "b"],
        ["c", "d"],
      ];
      const cloned = clone(original);
      cloned[0][0] = "x";
      expect(original[0][0]).toBe("a");
    });
  });
  describe("toString", () => {
    it("converts matrix to string representation", () => {
      const matrix = [
        ["a", "b"],
        ["c", "d"],
      ];
      expect(toString(matrix)).toBe("ab\ncd");
    });
  });
  describe("create", () => {
    describe("column", () => {
      it("creates column with default space character", () => {
        expect(create.column(2)).toEqual([[" "], [" "]]);
      });

      it("creates column with custom character", () => {
        expect(create.column(2, "*")).toEqual([["*"], ["*"]]);
      });

      it("throws error for invalid character", () => {
        expect(() => create.column(2, "invalid")).toThrow();
      });
    });

    describe("row", () => {
      it("creates row with default space character", () => {
        expect(create.row(2)).toEqual([[" ", " "]]);
      });

      it("creates row with custom character", () => {
        expect(create.row(2, "*")).toEqual([["*", "*"]]);
      });

      it("throws error for invalid character", () => {
        expect(() => create.row(2, "invalid")).toThrow();
      });
    });

    describe("from", () => {
      describe("dimensions", () => {
        it("creates matrix with specified dimensions", () => {
          const result = create.from.dimensions({ width: 2, height: 2 });
          expect(result).toEqual([
            [" ", " "],
            [" ", " "],
          ]);
        });

        it("creates matrix with custom character", () => {
          const result = create.from.dimensions({ width: 2, height: 2 }, "*");
          expect(result).toEqual([
            ["*", "*"],
            ["*", "*"],
          ]);
        });
      });

      describe("lines", () => {
        it("converts string array to matrix", () => {
          expect(create.from.lines(["ab", "cd"])).toEqual([
            ["a", "b"],
            ["c", "d"],
          ]);
        });

        it("handles empty array", () => {
          expect(create.from.lines([])).toEqual([]);
        });
      });

      describe("text", () => {
        it("creates matrix from text with word wrapping", () => {
          const result = create.from.text("hello world", 5);
          expect(result).toEqual([
            ["h", "e", "l", "l", "o"],
            ["w", "o", "r", "l", "d"],
          ]);
        });
      });
    });
  });
  describe("is", () => {
    describe("valid", () => {
      it("validates correct matrix", () => {
        expect(is.valid([["a"], ["b"]])).toBe(true);
      });

      it("invalidates non-array input", () => {
        expect(is.valid("not-matrix")).toBe(false);
      });

      it("invalidates matrix with invalid characters", () => {
        expect(is.valid([["invalid"]])).toBe(false);
      });
    });

    describe("inBounds", () => {
      it("checks if coordinates are within bounds", () => {
        const matrix = [
          ["a", "b"],
          ["c", "d"],
        ];
        expect(is.inBounds(matrix, { x: 0, y: 0 })).toBe(true);
        expect(is.inBounds(matrix, { x: 2, y: 2 })).toBe(false);
      });
      it("handles infinity", () => {
        const matrix = [
          ["a", "b"],
          ["c", "d"],
        ];
        expect(is.inBounds(matrix, { x: Infinity, y: Infinity })).toBe(false);
      });
    });
  });
});
