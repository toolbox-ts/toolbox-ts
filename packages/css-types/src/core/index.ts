/** https://www.w3.org/TR/css/#css */
//
export type * as Colors from "./colors.js";
export type * as Units from "./units.js";
export type * as Math from "./math.js";
export type * as Selectors from "./selectors/index.js";
export type * from "./shared.js";
/** https://www.w3.org/TR/css-ui-3/#propdef-cursor */
export type Cursor =
  | "auto"
  | "default"
  | "none"
  | "context-menu"
  | "help"
  | "pointer"
  | "progress"
  | "wait"
  | "cell"
  | "crosshair"
  | "text"
  | "vertical-text"
  | "alias"
  | "copy"
  | "move"
  | "no-drop"
  | "not-allowed"
  | "grab"
  | "grabbing"
  | "e-resize"
  | "n-resize"
  | "ne-resize"
  | "nw-resize"
  | "s-resize"
  | "se-resize"
  | "sw-resize"
  | "w-resize"
  | "ew-resize"
  | "ns-resize"
  | "nesw-resize"
  | "nwse-resize"
  | "col-resize"
  | "row-resize"
  | "all-scroll"
  | "zoom-in"
  | "zoom-out";

export type SizingKeyword =
  | "auto"
  | "max-content"
  | "min-content"
  | "fit-content"
  | "none";

export type LineStyle =
  | "none"
  | "hidden"
  | "dotted"
  | "dashed"
  | "solid"
  | "double"
  | "groove"
  | "ridge"
  | "inset"
  | "outset";
