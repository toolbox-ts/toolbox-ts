import type { Accepts, Units, Percent } from "../core/index.js";

export type Value = Accepts<Units.Length | Percent | "auto">;
export type Top = Value;
export type Right = Value;
export type Bottom = Value;
export type Left = Value;
