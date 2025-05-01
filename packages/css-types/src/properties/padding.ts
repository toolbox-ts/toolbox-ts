import type { Accepts, Units, Percent, SizingKeyword } from "../core/index.js";

export type Value = Accepts<Units.Length | Percent | SizingKeyword>;
export type Top = Value;
export type Right = Value;
export type Bottom = Value;
export type Left = Value;
