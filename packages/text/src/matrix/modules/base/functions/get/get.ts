import { is } from "../../../../../core/index.js";
import type { Spatial } from "@toolbox-ts/utils";
import type { Matrix } from "../base.js";

export const get: {
  dimensions: (matrix: Matrix) => Spatial.Dimensions;
  column: (matrix: Matrix, x: number) => [string][];
  row: (matrix: Matrix, y: number) => string[];
  cell: (matrix: Matrix, { x, y }: Spatial.Coordinates2D) => string;
} = {
  dimensions: (matrix) => ({
    height: matrix.length,
    width: matrix[0]?.length ?? 0,
  }),
  column: (matrix, x) =>
    matrix.map((row) => {
      const col = row[x];
      if (!is.char(col)) throw new Error(`Invalid character: ${col} at ${x}`);
      return [col];
    }),
  row: (matrix, y) => {
    const row = matrix[y];
    if (!row) throw new Error(`Invalid character: ${row} at ${y}`);
    return [...row];
  },
  cell: (matrix, { x, y }) => {
    const cell = get.row(matrix, y)[x];
    if (!cell) throw new Error(`Invalid cell at {x:${x}, y:${y}}`);
    return cell;
  },
} as const;
