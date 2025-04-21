interface Coordinates2D {
  x: number;
  y: number;
}
interface Coordinates3D {
  x: number;
  y: number;
  z: number;
}
interface Dimensions {
  width: number;
  height: number;
}
type Dimension = "width" | "height";
type Orientation = "vertical" | "horizontal";
type Direction = "up" | "down" | "left" | "right";
type Axis2D = "x" | "y";
type Axis3D = "x" | "y" | "z";
type Corner = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
type Edge = "top" | "bottom" | "left" | "right";

export type {
  Corner,
  Edge,
  Coordinates2D,
  Coordinates3D,
  Dimensions,
  Dimension,
  Orientation,
  Direction,
  Axis2D,
  Axis3D,
};
