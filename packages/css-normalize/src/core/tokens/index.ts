import { extractTokenMap } from "../utils/utils.js";
import { buildTokenMap } from "./buildMap.js";
import {
  BORDER_RADII,
  COLORS,
  DARK_COLORS,
  ELEVATION,
  LIGHT_COLORS,
  MISC,
  MOVEMENT,
  OPACITY,
  SPACING,
  TYPOGRAPHY,
  Z_INDEX,
  themes,
} from "./definitions.js";
type Theme = (typeof themes)[number];

const typographyMap = buildTokenMap(TYPOGRAPHY);
type TypographyConfig = Record<keyof typeof typographyMap, string>;

const movementMap = buildTokenMap(MOVEMENT);
type MovementConfig = Omit<
  Record<keyof typeof movementMap, string>,
  "transitionThemeChange"
>;

const spacingMap = buildTokenMap(SPACING);
type SpacingConfig = Record<keyof typeof spacingMap, string>;

const borderRadiiMap = buildTokenMap(BORDER_RADII);
type BorderRadiiConfig = Omit<
  Record<keyof typeof borderRadiiMap, string>,
  "b" | "t" | "l" | "r" | "tl" | "tr" | "bl" | "br" | "tlBr" | "trBl"
>;

const opacityMap = buildTokenMap(OPACITY);
type OpacityConfig = Record<keyof typeof opacityMap, string>;

const lightColorsMap = buildTokenMap(LIGHT_COLORS);
type LightColorsConfig = Record<keyof typeof lightColorsMap, string>;

const darkColorsMap = buildTokenMap(DARK_COLORS);
type DarkColorsConfig = Record<keyof typeof darkColorsMap, string>;

const elevationMap = buildTokenMap(ELEVATION);
type ElevationConfig = Omit<
  Record<keyof typeof elevationMap, string>,
  "low" | "medium" | "high" | "max"
>;

const zIndexMap = buildTokenMap(Z_INDEX);
type ZIndexConfig = Record<keyof typeof zIndexMap, string>;

const miscMap = buildTokenMap(MISC);
type MiscConfig = Record<keyof typeof miscMap, string>;

const colorsMap = buildTokenMap(COLORS);

interface TemplateConfig {
  typography?: TypographyConfig;
  movement?: MovementConfig;
  spacing?: SpacingConfig;
  borderRadii?: BorderRadiiConfig;
  opacity?: OpacityConfig;
  lightColors?: LightColorsConfig;
  darkColors?: DarkColorsConfig;
  elevation?: ElevationConfig;
  zIndex?: ZIndexConfig;
  misc?: MiscConfig;
}

const vars = {
  typography: extractTokenMap(typographyMap, "var"),
  movement: extractTokenMap(movementMap, "var"),
  spacing: extractTokenMap(spacingMap, "var"),
  borderRadii: extractTokenMap(borderRadiiMap, "var"),
  opacity: extractTokenMap(opacityMap, "var"),
  colors: extractTokenMap(colorsMap, "var"),
  elevation: extractTokenMap(elevationMap, "var"),
  zIndex: extractTokenMap(zIndexMap, "var"),
  misc: extractTokenMap(miscMap, "var"),
} as const;
type Vars = typeof vars;

const props = {
  typography: extractTokenMap(typographyMap, "prop"),
  movement: extractTokenMap(movementMap, "prop"),
  spacing: extractTokenMap(spacingMap, "prop"),
  borderRadii: extractTokenMap(borderRadiiMap, "prop"),
  opacity: extractTokenMap(opacityMap, "prop"),
  lightColors: extractTokenMap(lightColorsMap, "prop"),
  darkColors: extractTokenMap(darkColorsMap, "prop"),
  elevation: extractTokenMap(elevationMap, "prop"),
  zIndex: extractTokenMap(zIndexMap, "prop"),
  misc: extractTokenMap(miscMap, "prop"),
} as const;
type Props = typeof props;

const values = {
  typography: extractTokenMap(typographyMap, "value"),
  movement: extractTokenMap(movementMap, "value"),
  spacing: extractTokenMap(spacingMap, "value"),
  borderRadii: extractTokenMap(borderRadiiMap, "value"),
  opacity: extractTokenMap(opacityMap, "value"),
  lightColors: extractTokenMap(lightColorsMap, "value"),
  darkColors: extractTokenMap(darkColorsMap, "value"),
  elevation: extractTokenMap(elevationMap, "value"),
  zIndex: extractTokenMap(zIndexMap, "value"),
  misc: extractTokenMap(miscMap, "value"),
} as const;
type Values = typeof values;

export { props, vars, values, themes };
export type { TemplateConfig, Vars, Props, Values, Theme };
