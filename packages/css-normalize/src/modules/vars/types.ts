import type {
  Colors,
  FontSize,
  LineHeight,
  LetterSpacing,
  Padding,
  Time,
  Border,
  Outline,
  Shadow,
  CustomProperty,
} from "@toolbox-ts/css-types";

type ColorTheme = "light" | "dark";
type ColorVarBase =
  | "bg"
  | "fg"
  | "primary"
  | "accent"
  | "emphasis"
  | "muted"
  | "border"
  | "shadow"
  | "outline";
type ColorVarKey<T extends ColorTheme> = `${T}${Capitalize<ColorVarBase>}`;

type ColorVarProp<T extends ColorTheme> =
  CustomProperty<`${T}-color-${ColorVarBase}`>;

type ColorVars<T extends ColorTheme> = {
  [K in ColorVarKey<T>]: { prop: ColorVarProp<T>; value: Colors.Type };
};
type LightColorVars = ColorVars<"light">;
type DarkColorVars = ColorVars<"dark">;

type VarsObj = LightColorVars &
  DarkColorVars & {
    lineHeight: { prop: CustomProperty<"line-height">; value: LineHeight };
    letterSpacing: {
      prop: CustomProperty<"letter-spacing">;
      value: LetterSpacing;
    };
    fontSize: { prop: CustomProperty<"font-size">; value: FontSize };
    padding: { prop: CustomProperty<"padding">; value: Padding.Value };
    transitionDuration: {
      prop: CustomProperty<"transition-duration">;
      value: Time;
    };
    borderWidth: { prop: CustomProperty<"border-width">; value: Border.Width };
    borderRadius: {
      prop: CustomProperty<"border-radius">;
      value: Border.Radius;
    };
    outlineWidth: {
      prop: CustomProperty<"outline-width">;
      value: Outline.Width;
    };
    outlineOffset: {
      prop: CustomProperty<"outline-offset">;
      value: Outline.Offset;
    };
    bold: { prop: CustomProperty<"bold">; value: `${number}` | number };
    bolder: { prop: CustomProperty<"bolder">; value: `${number}` | number };
    elevationBaseYOffset: {
      prop: CustomProperty<"elevation-base-y-offset">;
      value: Shadow.OffsetY;
    };
    elevationBaseBlur: {
      prop: CustomProperty<"elevation-base-blur">;
      value: Shadow.BlurRadius;
    };
  };
type VarKey = keyof VarsObj;
type VarProp = VarsObj[VarKey]["prop"];
type VarsInput = { [K in VarKey]?: VarsObj[K]["value"] };
type VarsByProp = {
  [K in VarKey as VarsObj[K]["prop"] & string]: VarsObj[K]["value"];
};

export const propMap: { [Key in VarKey & string]: string } = {
  bold: "--bold",
  bolder: "--bolder",
  lineHeight: "--line-height",
  letterSpacing: "--letter-spacing",
  fontSize: "--font-size",
  padding: "--padding",
  transitionDuration: "--transition-duration",
  borderWidth: "--border-width",
  borderRadius: "--border-radius",
  outlineWidth: "--outline-width",
  outlineOffset: "--outline-offset",
  elevationBaseYOffset: "--elevation-base-y-offset",
  elevationBaseBlur: "--elevation-base-blur",
  lightBg: "--light-color-bg",
  lightFg: "--light-color-fg",
  lightPrimary: "--light-color-primary",
  lightAccent: "--light-color-accent",
  lightEmphasis: "--light-color-emphasis",
  lightMuted: "--light-color-muted",
  lightBorder: "--light-color-border",
  lightShadow: "--light-color-shadow",
  lightOutline: "--light-color-outline",
  darkBg: "--dark-color-bg",
  darkFg: "--dark-color-fg",
  darkPrimary: "--dark-color-primary",
  darkAccent: "--dark-color-accent",
  darkEmphasis: "--dark-color-emphasis",
  darkMuted: "--dark-color-muted",
  darkBorder: "--dark-color-border",
  darkShadow: "--dark-color-shadow",
  darkOutline: "--dark-color-outline",
} as const;
export type {
  VarsByProp,
  ColorTheme,
  ColorVarBase,
  ColorVarKey,
  ColorVarProp,
  ColorVars,
  LightColorVars,
  DarkColorVars,
  VarsObj,
  VarKey,
  VarProp,
  VarsInput,
  FontSize,
  LineHeight,
  LetterSpacing,
  Time,
  CustomProperty,
};
