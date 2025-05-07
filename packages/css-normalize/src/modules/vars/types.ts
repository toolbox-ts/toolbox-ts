type NestedPartial<T> = T extends object
  ? { [P in keyof T]?: NestedPartial<T[P]> }
  : T;

type NestedValuesToStrings<T> = T extends object
  ? { [P in keyof T]: NestedValuesToStrings<T[P]> }
  : string;

type CustomProperty<T extends string> = `--${T}`;
type VarReference<T extends string> = `var(--${T})`;

type CamelToKebab<S extends string> = S extends `${infer First}${infer Rest}`
  ? First extends Lowercase<First>
    ? `${First}${CamelToKebab<Rest>}`
    : `-${Lowercase<First>}${CamelToKebab<Rest>}`
  : S;
interface TokenMaps<K extends string, P extends string> {
  props: { [Key in K]: CustomProperty<`${P}-${CamelToKebab<Key>}`> };
  vars: { [Key in K]: VarReference<`${P}-${CamelToKebab<Key>}`> };
}

const camelToKebab = <S extends string>(str: string): CamelToKebab<S> =>
  str.replace(
    /([a-z])([A-Z])/g,
    (_, l1, l2) => `${l1}-${(l2 as string).toLowerCase()}`,
  ) as CamelToKebab<S>;

function buildTokenMap<const K extends readonly string[], P extends string>(
  keys: K,
  prefix: P,
): TokenMaps<K[number], P> {
  const props = {} as Record<K[number], CustomProperty<`${P}-${string}`>>;
  const vars = {} as Record<K[number], VarReference<`${P}-${string}`>>;

  for (const key of keys) {
    const kebab = camelToKebab(key);
    const prop = `--${prefix}-${kebab}` as const;
    props[key as K[number]] = prop;
    vars[key as K[number]] = `var(${prop})`;
  }

  return { props, vars } as TokenMaps<K[number], P>;
}

const colorKeys = [
  "bg",
  "fg",
  "primary",
  "accent",
  "emphasis",
  "muted",
  "border",
  "outline",
  "shadow",
] as const;
const colorMaps = {
  light: buildTokenMap(colorKeys, "light-color"),
  dark: buildTokenMap(colorKeys, "dark-color"),
  palette: buildTokenMap(colorKeys, "color"),
} as const;
const colorProps = {
  dark: colorMaps.dark.props,
  light: colorMaps.light.props,
  palette: colorMaps.palette.props,
} as const;
const colorVars = {
  dark: colorMaps.dark.vars,
  light: colorMaps.light.vars,
  palette: colorMaps.palette.vars,
} as const;

const fontKeys = [
  "family",
  "familyMono",
  "size",
  "letterSpacing",
  "lineHeight",
] as const;
const fontWeightKeys = [
  "thin",
  "extraLight",
  "light",
  "normal",
  "medium",
  "bold",
  "extraBold",
  "black",
] as const;
const baseFontMaps = buildTokenMap(fontKeys, "font");
const fontWeightMaps = buildTokenMap(fontWeightKeys, "weight");
const fontProps = {
  ...baseFontMaps.props,
  weight: fontWeightMaps.props,
} as const;
const fontVars = { ...baseFontMaps.vars, weight: fontWeightMaps.vars } as const;
const spacingKeys = ["xs", "sm", "md", "lg", "xl"] as const;
const { props: spacingProps, vars: spacingVars } = buildTokenMap(
  spacingKeys,
  "spacing",
);
const transitionKeys = ["duration", "interactiveElement"] as const;
const { props: transitionProps, vars: transitionVars } = buildTokenMap(
  transitionKeys,
  "transition",
);
const borderKeys = ["radius", "width", "border"] as const;
const { props: borderProps, vars: borderVars } = buildTokenMap(
  borderKeys,
  "border",
);

const elevationKeys = ["low", "medium", "high"] as const;
const elevationBaseKeys = ["yOffset", "blur"] as const;
const elevationMap = buildTokenMap(elevationKeys, "elevation");
const elevationBaseMap = buildTokenMap(elevationBaseKeys, "elevation-base");

const elevationProps = {
  base: elevationBaseMap.props,
  ...elevationMap.props,
} as const;
const elevationVars = {
  base: elevationBaseMap.vars,
  ...elevationMap.vars,
} as const;

const outlineKeys = ["width", "outline"] as const;
const { props: outlineProps, vars: outlineVars } = buildTokenMap(
  outlineKeys,
  "outline",
);
export type ThemeState = "light" | "dark";
export const cssProps = {
  colors: colorProps,
  font: fontProps,
  spacing: spacingProps,
  transition: transitionProps,
  border: borderProps,
  elevation: elevationProps,
  outline: outlineProps,
} as const;
export const cssVars = {
  colors: colorVars.palette,
  font: fontVars,
  spacing: spacingVars,
  transition: transitionVars,
  border: borderVars,
  elevation: elevationVars,
  outline: outlineVars,
} as const;
/**
 * A type representing all of the definable CSS properties.
 * Used in the `define` function.
 */
export type InputVars = NestedPartial<
  NestedValuesToStrings<
    Omit<typeof cssProps, "colors"> & {
      colors: {
        light: typeof cssProps.colors.light;
        dark: typeof cssProps.colors.dark;
      };
    }
  >
>;
/**
 * A type representing a fully resolved set of CSS variables.
 * What's not included in InputVars is defined in the
 * normalize CSS file. Meaning, all vars are valid and useable.
 */
export type ResolvedVars = typeof cssVars;
