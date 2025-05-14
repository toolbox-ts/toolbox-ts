const themes = ["light", "dark"] as const;
const TYPOGRAPHY = {
  prefix: undefined,
  valueMap: {
    fontFamily: "var(--fallback-font-family)",
    fontFamilyMono: "var(--fallback-font-family-mono)",
    //#region> LetterSpacing
    letterSpacingBase: "0rem",
    letterSpacingExtraTight: "-0.1rem",
    letterSpacingTight: "-0.05em",
    letterSpacingLoose: "0.05em",
    letterSpacingExtraLoose: "0.1em",
    //#endregion//
    //#region> LineHeight
    lineHeightBase: "1.15",
    lineHeightXs: "0.875",
    lineHeightSm: "1",
    lineHeightLg: "1.25",
    lineHeightXl: "1.5",
    lineHeightDouble: "2",
    //#endregion//
    //#region> FontSize
    fontSizeBase: "clamp(16px, 4vw, 20px)",
    fontSizeXxxs: "clamp(0.25rem, 1.5vw, 0.375rem)",
    fontSizeXxs: "clamp(0.375rem, 2vw, 0.5rem)",
    fontSizeXs: "clamp(0.5rem, 2.5vw, 0.75rem)",
    fontSizeSm: "clamp(0.75rem, 3vw, 1rem)",
    fontSizeMd: "clamp(1rem, 4vw, 1.25rem)",
    fontSizeLg: "clamp(1.25rem, 5vw, 1.5rem)",
    fontSizeXl: "clamp(1.5rem, 6vw, 1.75rem)",
    fontSizeXxl: "clamp(1.75rem, 7vw, 2rem)",
    fontSizeDouble: "clamp(2rem, 8vw, 2.25rem)",
    fontSizeXxxl: "clamp(2.25rem, 9vw, 2.5rem)",
    fontSizeXxxxl: "clamp(2.5rem, 10vw, 3rem)",
    fontSizeTriple: "clamp(3rem, 12vw, 4rem)",
    //#endregion//
    //#region> Font Weight
    fontWeightThin: "200",
    fontWeightLight: "300",
    fontWeightNormal: "400",
    fontWeightMedium: "500",
    fontWeightBold: "600",
    fontWeightHeavy: "800",
    //#endregion
  },
} as const;

const MOVEMENT = {
  prefix: undefined,
  valueMap: {
    durationShort: "0.1s",
    durationMedium: "0.25s",
    durationLong: "0.5s",
    easeAccel: "cubic-bezier(0.4, 0, 1, 1)",
    easeDecel: "cubic-bezier(0, 0, 0.2, 1)",
    transitionThemeChange: `color var(--duration-short) ease
    background-color var(--duration-short) ease
    box-shadow var(--duration-short) ease
    border-color var(--duration-short) ease`,
  },
} as const;

const SPACING = {
  prefix: "spacing",
  valueMap: {
    negXs: "-0.25rem",
    negSm: "-0.5rem",
    negMd: "-1rem",
    negLg: "-1.5rem",
    negXl: "-2rem",
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
} as const;

const BORDER_RADII = {
  prefix: "border-radius",
  valueMap: {
    base: "0.5rem",
    b: "var(--border-radius-base) var(--border-radius-base) 0 0",
    t: "0 0 var(--border-radius-base) var(--border-radius-base)",
    l: "var(--border-radius-base) 0 0 var(--border-radius-base)",
    r: "0 var(--border-radius-base) var(--border-radius-base) 0",
    tlBr: "var(--border-radius-base) 0 0 var(--border-radius-base)",
    trBl: "0 var(--border-radius-base) var(--border-radius-base) 0",
  },
} as const;

const OPACITY = {
  prefix: "opacity",
  valueMap: {
    transparent: "0",
    subtle: "0.25",
    moderate: "0.5",
    strong: "0.75",
    opaque: "1",
  },
} as const;

const LIGHT_COLORS = {
  prefix: "color-light",
  valueMap: {
    surface0: "#ffffff",
    surface1: "#f8f8f8",
    surface2: "#f0f0f0",
    surface3: "#e6e6e6",
    onSurface: "#121212",
    primary: "#2500F5",
    onPrimary: "#ffffff",
    secondary: "#8D1C29",
    onSecondary: "#ffffff",
    tertiary: "#16553D",
    onTertiary: "#ffffff",
    muted: "#494955",
    onMuted: "#ffffff",
    success: "#1A5138",
    onSuccess: "#ffffff",
    warning: "#4D4B0F",
    onWarning: "#ffffff",
    danger: "#941414",
    onDanger: "#ffffff",
    info: "#173DB0",
    onInfo: "#ffffff",
  },
} as const;

const DARK_COLORS = {
  prefix: "color-dark",
  valueMap: {
    surface0: "#121212",
    surface1: "#1c1c1c",
    surface2: "#262626",
    surface3: "#2f2f2f",
    onSurface: "#ffffff",
    primary: "#C4B3F5",
    onPrimary: "#121212",
    secondary: "#FFA58A",
    onSecondary: "#121212",
    tertiary: "#67D091",
    onTertiary: "#121212",
    muted: "#BDBDBD",
    onMuted: "#121212",
    success: "#7CD07F",
    onSuccess: "#121212",
    warning: "#ffb547",
    onWarning: "#121212",
    danger: "#FFA59E",
    onDanger: "#121212",
    info: "#7AC3FF",
    onInfo: "#121212",
  },
} as const;

const ELEVATION = {
  prefix: "elevation",
  valueMap: {
    baseYOffset: "1.5px",
    baseBlur: "3px",
    low: "0 var(--elevation-base-y-offset) var(--elevation-base-blur) var(--color-muted)",
    medium:
      "0 calc(var(--elevation-base-y-offset) * 1.5) calc(var(--elevation-base-blur) * 1.5) var(--color-muted)",
    high: "0 calc(var(--elevation-base-y-offset) * 2.5) calc(var(--elevation-base-blur) * 2.5) var(--color-muted)",
    max: "0 calc(var(--elevation-base-y-offset) * 3.5) calc(var(--elevation-base-blur) * 3.5) var(--color-muted)",
  },
} as const;

const Z_INDEX = {
  prefix: "z-index",
  valueMap: {
    behind: "-1",
    base: "0",
    low: "1000",
    medium: "1100",
    high: "1200",
    sidebar: "1300",
    overlay: "1400",
    modal: "1500",
    tooltip: "1600",
    notification: "1700",
    top: "1800",
    override: "9999",
  },
} as const;

const MISC = { prefix: undefined, valueMap: { ulLiMarker: "•" } } as const;

const COLORS = {
  prefix: "color",
  valueMap: { ...LIGHT_COLORS.valueMap },
} as const;

export {
  TYPOGRAPHY,
  MOVEMENT,
  SPACING,
  BORDER_RADII,
  OPACITY,
  LIGHT_COLORS,
  DARK_COLORS,
  ELEVATION,
  Z_INDEX,
  MISC,
  themes,
  COLORS,
};
