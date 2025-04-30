import type { Accepts, Units, Colors } from "../core/index.js";

export type OffsetX = Accepts<Units.Length>;
export type OffsetY = Accepts<Units.Length>;
export type BlurRadius = Accepts<Units.Length>;
export type SpreadRadius = Accepts<Units.Length>;
export type Color = Accepts<Colors.Type>;
