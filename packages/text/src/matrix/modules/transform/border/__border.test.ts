import { describe, expect, it } from "vitest";
import { add, get, set } from "./border";

describe("border", () => {
  const sampleMatrix = [
    ["a", "b"],
    ["c", "d"],
  ];
  const borderChars = {
    topLeft: "┌",
    topRight: "┐",
    bottomLeft: "└",
    bottomRight: "┘",
    top: "─",
    bottom: "─",
    left: "│",
    right: "│",
  };

  describe("get.coordinates", () => {
    it("correctly maps corner coordinates", () => {
      const { corners } = get.coordinates(sampleMatrix);

      expect(corners.topLeft).toEqual({ y: 0, x: 0 });
      expect(corners.topRight).toEqual({ y: 0, x: 1 });
      expect(corners.bottomLeft).toEqual({ y: 1, x: 0 });
      expect(corners.bottomRight).toEqual({ y: 1, x: 1 });
    });

    it("correctly maps edge coordinates", () => {
      const { edges } = get.coordinates([
        ["a", "b", "c"],
        ["d", "e", "f"],
      ]);

      expect(edges.top).toHaveLength(1);
      expect(edges.top[0]).toEqual({ y: 0, x: 1 });

      expect(edges.bottom).toHaveLength(1);
      expect(edges.bottom[0]).toEqual({ y: 1, x: 1 });

      expect(edges.left).toHaveLength(0);
      expect(edges.right).toHaveLength(0);
    });
  });

  describe("set", () => {
    it("applies provided chars", () => {
      const result = set(sampleMatrix, borderChars);
      expect(result[0][0]).toBe("┌");
      expect(result[0][1]).toBe("┐");
      expect(result[1][0]).toBe("└");
      expect(result[1][1]).toBe("┘");
    });
    it("adds perimeter if matrix is too small", () => {
      const smallMatrix = [["a"]];
      const result = set(smallMatrix, borderChars);
      expect(result).toEqual([
        ["┌", "─", "┐"],
        ["│", "a", "│"],
        ["└", "─", "┘"],
      ]);
    });
  });
  describe("add", () => {
    it("adds a border to the matrix", () => {
      const result = add(sampleMatrix, borderChars);
      expect(result[0][0]).toBe("┌");
      expect(result[0][1]).toBe("─");
      expect(result[0][2]).toBe("─");
      expect(result[0][3]).toBe("┐");

      expect(result[1][0]).toBe("│");
      expect(result[2][0]).toBe("│");

      expect(result[3][3]).toBe("┘");
    });
  });
});
