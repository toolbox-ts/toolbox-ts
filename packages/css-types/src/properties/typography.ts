import type { Accepts, Units, Percent } from "../core/index.js";

export type FontSize = Accepts<Units.Length | Percent>;
export type LineHeight = Accepts<Units.Length | Percent | number | `${number}`>;
export type LetterSpacing = Accepts<Units.Length>;
export type WordSpacing = Accepts<Units.Length>;
export type TextIndent = Accepts<Units.Length | Percent>;

export type FontWeight = Accepts<
  number | `${number}` | "normal" | "bold" | "bolder" | "lighter"
>;
export type FontStyle = Accepts<"normal" | "italic" | "oblique">;
export type FontFamily = Accepts<string>;
export type FontVariant = Accepts<"normal" | "small-caps">;
export type TextTransform = Accepts<
  | "none"
  | "capitalize"
  | "uppercase"
  | "lowercase"
  | "full-width"
  | "full-size-kana"
>;
export type TextAlign = Accepts<
  "left" | "right" | "center" | "justify" | "start" | "end" | "match-parent"
>;
export type TextDecoration = Accepts<
  "none" | "underline" | "overline" | "line-through" | string
>;
export type TextOverflow = Accepts<"clip" | "ellipsis" | string>;
export type WhiteSpace = Accepts<
  "normal" | "nowrap" | "pre" | "pre-line" | "pre-wrap" | "break-spaces"
>;
