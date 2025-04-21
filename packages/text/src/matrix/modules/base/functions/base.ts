import type { Spatial } from "@toolbox-ts/utils";
import * as Core from "../../../../core/index.js";

type Matrix = string[][];
const clone = (matrix: Matrix) => matrix.map((row) => [...row]);
const toString = (matrix: Matrix): string =>
  matrix.map((row) => row.join("")).join("\n");

const create: {
  column: (height: number, char?: string) => Matrix;
  row: (width: number, char?: string) => Matrix;
  from: {
    dimensions: (dimensions: Spatial.Dimensions, char?: string) => Matrix;
    lines: (lines: string[] | string) => Matrix;
    text: (text: string, width: number) => Matrix;
  };
} = {
  column: (height, char = Core.C.space) => {
    if (!Core.is.char(char)) throw new Error();
    return Array.from({ length: height }, () => [char]);
  },
  row: (width, char = Core.C.space) => {
    if (!Core.is.char(char)) throw new Error();
    return [Array.from({ length: width }, () => char)];
  },
  from: {
    dimensions: (dimensions, char = Core.C.space) => {
      const row = create.row(dimensions.width, char).flat();
      return Array.from({ length: dimensions.height }).map(() => [...row]);
    },
    lines: (lines) => {
      if (lines.length === 0) return [];
      const _lines = Core.Lines.asLines(lines);
      const charArrays = _lines.map((line) => line.split(""));
      const maxLength = Math.max(...charArrays.map((line) => line.length));
      return charArrays.map((line) => {
        const padding = Array.from(
          { length: maxLength - line.length },
          () => Core.C.space,
        );
        return [...line, ...padding];
      });
    },
    text: (text, width) => {
      const words = Core.Words.get(text);
      const lines: string[] = [];
      while (words.length > 0) {
        const { chunk, remainingWords } = Core.Words.buildChunk(
          words.join(Core.C.space),
          width,
        );
        if (chunk) lines.push(chunk);
        words.length = 0;
        words.push(...remainingWords);
      }
      return create.from.lines(lines);
    },
  },
} as const;
const is = {
  valid: (matrix: unknown): matrix is Matrix =>
    Array.isArray(matrix) &&
    matrix.every((row) => Array.isArray(row) && row.every(Core.is.char)),
  inBounds: (matrix: Matrix, { x, y }: Spatial.Coordinates2D) => {
    const dimensions = { height: matrix.length, width: matrix[0]?.length ?? 0 };
    if (x === Infinity) x = dimensions.width;
    if (y === Infinity) y = dimensions.height;
    return x >= 0 && x < dimensions.width && y >= 0 && y < dimensions.height;
  },
  row: (matrix: Matrix, y: number) =>
    Array.isArray(matrix[y]) && matrix[y].every(Core.is.char),
  column: (matrix: Matrix, x: number) =>
    matrix.every((row) => Core.is.char(row[x])),
} as const;

export { type Matrix, clone, create, is, toString };
