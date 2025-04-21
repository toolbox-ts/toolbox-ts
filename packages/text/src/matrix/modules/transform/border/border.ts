import type { Spatial } from "@toolbox-ts/utils";
import { Base } from "../../base/index.js";
import { insert } from "../insert/insert.js";

const perimeter = {
  add: (matrix: Base.Matrix) => {
    const result = insert.row(insert.row(matrix, 0));
    return insert.column(insert.column(result, 0));
  },
  validate: (matrix: Base.Matrix) => {
    const { height, width } = Base.get.dimensions(matrix);
    return height < 2 || width < 2 ? false : true;
  },
} as const;

type BorderChars = Record<Spatial.Corner, string> &
  Record<Spatial.Edge, string>;

const get: {
  coordinates: (matrix: Base.Matrix) => {
    corners: {
      topLeft: Spatial.Coordinates2D;
      topRight: Spatial.Coordinates2D;
      bottomLeft: Spatial.Coordinates2D;
      bottomRight: Spatial.Coordinates2D;
    };
    edges: {
      top: Spatial.Coordinates2D[];
      bottom: Spatial.Coordinates2D[];
      left: Spatial.Coordinates2D[];
      right: Spatial.Coordinates2D[];
    };
  };
} = {
  coordinates: (matrix) => {
    const { height, width } = Base.get.dimensions(matrix);
    const lastRow = height - 1;
    const lastCol = width - 1;
    return {
      corners: {
        topLeft: { y: 0, x: 0 },
        topRight: { y: 0, x: lastCol },
        bottomLeft: { y: lastRow, x: 0 },
        bottomRight: { y: lastRow, x: lastCol },
      },
      edges: {
        top: Array.from({ length: width - 2 }, (_, i) => ({ y: 0, x: i + 1 })),
        bottom: Array.from({ length: width - 2 }, (_, i) => ({
          y: lastRow,
          x: i + 1,
        })),
        left: Array.from({ length: height - 2 }, (_, i) => ({
          y: i + 1,
          x: 0,
        })),
        right: Array.from({ length: height - 2 }, (_, i) => ({
          y: i + 1,
          x: lastCol,
        })),
      },
    } as const;
  },
} as const;

const set = (matrix: Base.Matrix, borderChars: BorderChars): Base.Matrix => {
  let result = Base.clone(matrix);
  if (!perimeter.validate(result)) result = perimeter.add(result);
  const { corners, edges } = get.coordinates(result);
  (Object.keys(corners) as Spatial.Corner[]).forEach(
    (corner) =>
      (result = Base.set.cell(result, {
        coordinates: corners[corner],
        char: borderChars[corner],
      })),
  );
  (Object.keys(edges) as Spatial.Edge[]).forEach((edge) => {
    const line = borderChars[edge];
    edges[edge].forEach(
      (coordinates) =>
        (result = Base.set.cell(result, { coordinates, char: line })),
    );
  });
  return result;
};

const add = (matrix: Base.Matrix, borderChars: BorderChars): Base.Matrix =>
  set(perimeter.add(matrix), borderChars);

export { add, get, set };
