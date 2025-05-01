import type {
  Accepts,
  Colors,
  LineStyle,
  Percent,
  Units,
} from "../core/index.js";

export type Width = Accepts<Units.Length>;
export type Radius = Accepts<Units.Length | Percent>;
export type Style = Accepts<LineStyle>;
export type Color = Accepts<Colors.Type>;
