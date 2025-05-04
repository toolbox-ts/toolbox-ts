# `@toolbox-ts/colors/Hsl`

Provides type-safe utilities for working with HSL and HSLA color objects,
including validation, normalization, channel adjustment, and chromaticity
calculations.

## Exports

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
    - **.hue(hsl, delta):** Adjusts hue by a decimal delta, wrapping around the
      color wheel.
