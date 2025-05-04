# @toolbox-ts/colors API

A unified, type-safe API for parsing, converting, blending, adjusting, and
analyzing colors in RGB, HEX, and HSL formats, with full WCAG and sRGB support.

---

## Exports

- **modules:** All core color modules (Hex, Rgb, Hsl, Luminance, Contrast,
  ColorWheel).
- **parse:** String parsing and serialization utilities.
- **adjust:** Color adjustment utilities (lightness, saturation, hue, contrast).
- **get:** Color analysis and variant utilities.
- **is:** Type guards and accessibility checks.
- **clamp:** Channel clamping utilities.
- **convert:** Color conversion utilities.
- **blend:** Color blending utilities.

---

## API Overview

### modules

- **Hex, Rgb, Hsl, Luminance, Contrast, ColorWheel:** Core color modules.

---

### parse

- **stringToColor(value: string):** Parses a color string (`#hex`, `rgb(...)`,
  `hsl(...)`) to a color object.
- **colorToString(color):** Serializes a color object to a string.
- **cssColorString(value: string):** Splits a CSS color string into its channel
  values (e.g., `"rgb(1,2,3)"` → `["1", "2", "3"]`).

---

### adjust

- **lightness(color, delta, returnType):** Adjusts lightness by delta (positive
  = lighten, negative = darken).
- **saturation(color, delta, returnType):** Adjusts saturation by delta.
- **hue(color, delta, returnType):** Rotates hue by delta (degrees).
- **contrastRatio(foreground, background):** Adjusts foreground to achieve a
  target contrast ratio with background.

---

### get

- **contrastRatio(foreground, background):** Calculates the contrast ratio
  between two colors.
- **bestColor(options):** Finds the best color (by lightness) to achieve a
  target contrast ratio.
- **relativeLuminance(color):** Calculates the relative luminance of a color.
- **colorType(color):** Returns the detected color type (`'rgb'`, `'hex'`,
  `'hsl'`, or `undefined`).
- **inverse(color, returnType):** Returns the color's inverse in the specified
  format.
- **mute(options):** Returns a muted version of a color, blended with its
  inverse and adjusted for contrast.
- **variants(options):** Returns base, inverse, and muted variants for a color.

---

### is

- **rgb(value):** Returns true if value is a valid RGB object.
- **hsl(value):** Returns true if value is a valid HSL object.
- **hex(value):** Returns true if value is a valid HEX string.
- **accessible({ background, foreground, level }):** Checks if a color pair
  meets a given WCAG level.
- **contrastRatioAchievable({ background, foreground, targetRatio, allowExceed
  }):** Checks if a target contrast ratio is achievable.

---

### clamp

- **rgbChannel(value):** Clamps an RGB channel to [0, 255].
- **hslHue(value):** Clamps an HSL hue to [0, 360].
- **hslPerc(value):** Clamps an HSL percentage to [0, 100].
- **hexByte(value):** Clamps a HEX byte to [0, 255].

---

### convert

- **toRgb(color):** Converts any supported color string to RGBA.
- **toHsl(color):** Converts any supported color string to HSLA.
- **toHex(color):** Converts any supported color string to HEX.
- **rgbTo, hslTo, hexTo:** Direct conversion utilities between color spaces.

---

### blend

- **alpha({ background, foreground, returnType }):** Alpha blends two colors and
  returns both in the specified format.
- **weighted({ background, foreground, weight, returnType }):** Blends two
  colors using a weighted ratio.

---

## Types

- **Variant:** `'base' | 'inverse' | 'muted'`
- **Color, ColorMap, ColorType:** Core color types.
- **WcagLevel, WcagLevelRatio:** WCAG level keys and their numeric ratios.
