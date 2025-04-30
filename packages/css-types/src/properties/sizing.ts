import type { Accepts, Units, Percent, SizingKeyword } from "../core/index.js";

export type Value = Accepts<Units.Length | Percent | SizingKeyword>;
export type Width = Value;
export type MinWidth = Value;
export type MaxWidth = Value;
export type Height = Value;
export type MinHeight = Value;
export type MaxHeight = Value;
