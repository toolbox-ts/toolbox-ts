# @toolbox-ts/colors

![](https://img.shields.io/badge/coverage-100%25-brightgreen)

---

A composable color manipulation library written in TypeScript. Includes
type-safe color conversion, contrast evaluation and adjustment, and full WCAG
2.2 compliance utilities with binary search-based lightness tuning.

---

## Installation

```bash
npm i @toolbox-ts/colors
```

---

## Features

- 🎨 **Color Conversion** RGB, HSL, HEX interchange with alpha blending
- ♻️ **Composable & Fully Typed** Color Pipeline
- 🚥 **WCAG 2.2 Compliance** Testing & Adjustment
- 🧠 **Smart Foreground Optimization** via Binary Search

---

## API

All functionality is exported from the `Colors` module.

The library provides a set of utility functions for working with colors,
including color conversion, contrast ratio calculation, and luminance
adjustments. The functionality is organized across several modules, and all
utilities are exported from the `@toolbox-ts/colors` package.

<details><summary>parse</summary>

Functions for parsing and converting color values.

- **stringToColor:** Parses a CSS string to a color object.
- **colorToString:** Converts a color object to a CSS string.
- **cssColorString:** Splits a CSS color string into its components.

</details>

<details><summary>adjust</summary>

Functions for adjusting color properties.

- **lightness:** Adjusts the lightness of a color.
- **saturation:** Adjusts the saturation of a color.
- **hue:** Adjusts the hue of a color.
- **contrastRatio:** Calculates the contrast ratio between two colors.

</details>

<details><summary>get</summary>

Functions for retrieving color-related properties.

- **variants:** Generates lightness-based variants of a color.
- **bestColor:** Determines best contrast foreground color.
- **relativeLuminance:** Calculates the relative luminance of a color.
- **colorType:** Identifies the type of color input.

</details>

<details><summary>is</summary>

Type guards and WCAG checks.

- **rgb:** Checks if input is an RGB color.
- **hsl:** Checks if input is an HSL color.
- **hex:** Checks if input is a HEX color.
- **accessible:** Checks if two colors meet WCAG contrast.
- **contrastRatioAchievable:** Checks if contrast goal is achievable.

</details>

<details><summary>clamp</summary>

Clamps values to valid color ranges.

- **rgb:** Clamps an RGB channel value.
- **hslHue:** Clamps an HSL hue value.
- **hslPerc:** Clamps an HSL percent value.
- **hexByte:** Clamps a HEX byte value.

</details>

<details><summary>convert</summary>

Converts between color formats.

- **toRgb:** Converts input to RGB.
- **toHsl:** Converts input to HSL.
- **toHex:** Converts input to HEX.
- **rgbTo:** Converts RGB to another format.
- **hslTo:** Converts HSL to another format.
- **hexTo:** Converts HEX to another format.

</details>

<details><summary>blend</summary>

Functions for blending colors.

- **blend:** Blends two colors using alpha compositing.

</details>

<details><summary>types</summary>

Exported types and interfaces.

- **ColorType:** Represents any valid color type.
- **ColorTypeMap:** Maps type strings to their color interfaces.
- **Variant:** Represents dim or bright variants.
- **VariantColorDeltas:** Lightness deltas for variants.
- **Variants:** Type-safe variants by color format.
- **WcagLevel:** WCAG accessibility levels

## </details>

## Modules

<details><summary>ColorWheel</summary>

Utility for working with the color wheel, dividing it into six 60° sectors:

1. red–yellow
2. yellow–green
3. green–cyan
4. cyan–blue
5. blue–magenta
6. magenta–red

- **Exports**
  - **ColorWheel:** ES6 module
    - **Sector:** Union type of the six color wheel sectors.
    - **angles:** { min: 0, max: 360, sector: 60 } constants for wheel math.
    - **sectors:** Object mapping each sector to its start and end angles.
    - **isIn**:
      - **.circle(value):** Returns true if value is a number between 0–360.
      - **.sector(position, target):** Returns true if position (angle) is
        within the specified sector.

</details>

---

<details><summary>Hex</summary>

Type-safe utilities for working with hexadecimal color values, including
validation, normalization, and conversion between string and integer formats.

- **Exports**
  - **Hex:** ES6 module
    - **Color:** Template literal type for hex colors (e.g. `#rrggbbaa`).
    - **radix:** Base 16 constant for conversions.
    - **transparent:** Constant for a fully transparent hex color (`#00000000`).
    - **stripPrefix(value):** Removes `#` or `0x` prefix from a hex string.
    - **is(value):** Returns true if value is a valid hex color string
      (`#rgb[a]`, `#rrggbb[aa]`).
    - **normalize(input):** Normalizes input to `#rrggbbaa` format, or returns
      transparent if invalid.
    - **toInt(value):** Converts a hex color string to a 32-bit integer.
    - **byte:** Utilities for working with 2-digit hex bytes:
      - **max, min:** Byte value boundaries.
      - **is(value):** Returns true if value is a valid byte (0–255).
      - **clamp(value):** Clamps a number to [0, 255].
      - **toHex(value):** Converts a number to a 2-digit hex string.
      - **parse(value):** Parses a hex string to a byte integer (clamped to [0,
        255]).

</details>

---

<details><summary>HSL</summary>

Provides type-safe utilities for working with HSL and HSLA color objects,
including validation, normalization, channel adjustment, and chromaticity
calculations.

- **Exports**
  - **HSL:** ES6 module
    - **Hsl, Hsla, Color:** Type aliases for HSL/HSLA color objects.
    - **saturation:** Utility with min/max and type guard for saturation values.
    - **lightness:** Utility for lightness values (same as saturation).
    - **transparent:** Constant for a fully transparent HSLA color.
    - **isHsl(value):** Returns true if value is a valid HSL object.
    - **normalize(value):** Normalizes input to a valid HSLA color or returns
      transparent.
    - **chromaticity(hsl):** Calculates chromaticity of an HSL color.
    - **interpolate(hsl, C?):** Calculates interpolation value based on hue and
      chromaticity.
    - **matchAdjustment(hsl):** Computes adjustment value based on lightness and
      chromaticity.
    - **adjust:**
      - **.lightness(hsl, delta):** Adjusts lightness by a decimal delta.
      - **.saturation(hsl, delta):** Adjusts saturation by a decimal delta.
      - **.hue(hsl, delta):** Adjusts hue by a decimal delta, wrapping around
        the color wheel.

</details>

---

<details><summary>Rgb</summary>

Type-safe utilities for working with RGB and RGBA color objects, including
validation, normalization, and alpha blending.

- **Exports**
  - **Rgb:** ES6 Module
    - **Rgb, Rgba, Color:** Type aliases for RGB/RGBA color objects.
    - **transparent:** Constant for a fully transparent RGBA color.
    - **isRgb(value):** Returns true if value is a valid RGB object.
    - **normalize(value):** Normalizes input to a valid RGBA color or returns
      transparent.
    - **blend(fg, bg):** Alpha blends two RGBA colors and returns the result.

</details>

---

<details><summary>Contrast</summary>

Utilities for calculating and adjusting color contrast ratios, including WCAG
2.2 compliance checks and binary search-based lightness tuning.

- **Exports**
  - **Contrast:** ES6 Module
    - **CONTRAST:** Constants for contrast calculations and binary search.
    - **prepareResult:** Formats the result of a color adjustment.
    - **findBestColor:** Binary search for the best color to achieve a target
      contrast ratio.
    - **calculateRatio:** Calculates the contrast ratio between two colors.
    - **adjustToRatio:** Adjusts the foreground color to achieve a target
      contrast ratio with the background.
    - **isRatioAchievable:** Determines if the target contrast ratio is
      achievable by adjusting lightness.
    - **isWcagCompliant:** Checks if a color pair meets a given WCAG level.
    - **AdjustOptions, AdjustResult, FindBestColorOptions,
      IsRatioAchievableResult:** Type definitions for adjustment and search
      options/results.

</details>

---

<details><summary>Converter</summary>

Composable, type-safe color conversion utilities for RGB, HEX, and HSL formats,
including alpha channel handling and normalization.

- **Exports**
  - **Converter:** ES6 Module
    - **resolve:** Converts a color to a specified type (`'rgb'`, `'hex'`, or
      `'hsl'`).
    - **toRgb:** Converts any supported color type to RGBA.
    - **toHex:** Converts any supported color type to HEX.
    - **toHsl:** Converts any supported color type to HSLA.
    - **defaults:** Default values for each color type.
    - **validators:** Type guards for each color type.
    - **rgbTo:** Conversion functions from RGB to RGB, HEX, and HSL.
    - **hexTo:** Conversion functions from HEX to HEX, RGB, and HSL.
    - **hslTo:** Conversion functions from HSL to HSL, RGB, and HEX.
    - **alphaTo:** Alpha channel conversion utilities.
    - **Type, ColorType, ColorTypeMap:** Type definitions for color formats.

</details>

---

<details><summary>Luminance</summary>

Utilities for calculating relative luminance, gamma correction, and generating
lightness variants for colors, with full sRGB and WCAG compliance.

- **Exports**
  - **Luminance:** ES6 Module
    - **calculateRelative:** Computes the relative luminance of a color (0 =
      black, 1 = white).
    - **adjustLuminance:** Adjusts the lightness of a color by a given delta and
      returns the result in the specified format.
    - **getVariants:** Generates dim and bright variants of a color using preset
      or custom lightness deltas.
    - **offset, weights:** Constants for luminance calculations and contrast
      ratio formulas.
    - **GAMMA:** Gamma correction parameters for sRGB linearization.
    - **LINEARIZATION:** Threshold and divisor constants for sRGB linearization.

</details>

## License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)

- @toolbox-ts
  - [NPM](https://www.npmjs.com/org/toolbox-ts)
  - [GitHub](https://github.com/toolbox-ts/toolbox-ts)
