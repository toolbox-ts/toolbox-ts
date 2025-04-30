import type {
  Accepts,
  Units,
  Percent,
  Colors,
  LineStyle,
} from "../core/index.js";

export type Width = Accepts<Units.Length>;
export type Style = Accepts<LineStyle>;
export type Color = Accepts<Colors.Type>;
export type Offset = Accepts<Units.Length | Percent>;
