import type { Spatial } from "@toolbox-ts/utils";
import { get } from "../get/get.js";
import { type Matrix, clone, is } from "../base.js";

interface CellUpdate {
  coordinates: Spatial.Coordinates2D;
  char: string;
}

const set: {
  column: (matrix: Matrix, x: number, char: string) => Matrix;
  row: (matrix: Matrix, y: number, char: string) => Matrix;
  cell: (matrix: Matrix, update: CellUpdate) => Matrix;
  cells: (matrix: Matrix, updates: CellUpdate[]) => Matrix;
} = {
  column: (matrix, x, char) => {
    if (!is.column(matrix, x)) throw new Error(`Invalid column at x: ${x}`);
    return clone(matrix).map((row) => {
      row[x] = char;
      return row;
    });
  },
  row: (matrix, y, char) => {
    if (!is.row(matrix, y)) throw new Error(`Invalid row at y: ${y}`);
    const cloned = clone(matrix);
    cloned[y] = cloned[y]!.map((_) => char);
    return cloned;
  },
  cell: (matrix, { char, coordinates }) => {
    if (!is.inBounds(matrix, coordinates))
      throw new Error(
        `Invalid coordinates: ${JSON.stringify(coordinates)} for matrix with dimensions: ${JSON.stringify(get.dimensions(matrix))}`,
      );
    const { x, y } = coordinates;
    const cloned = clone(matrix);
    // Coordinates are already validated to be in bounds
    cloned[y]![x] = char;
    return cloned;
  },
  cells: (matrix, updates) => {
    const cloned = clone(matrix);
    updates.forEach(({ coordinates: { x, y }, char }) => {
      if (!cloned[y]) throw new Error(`Invalid row at y: ${y}`);
      cloned[y][x] = char;
    });
    return cloned;
  },
} as const;
export { type CellUpdate, set };
