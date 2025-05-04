# `@toolbox-ts/colors/Luminance`

Utilities for calculating relative luminance, gamma correction, and generating
lightness variants for colors, with full sRGB and WCAG compliance.

## Exports

- **Luminance:** ES6 Module
  - **calculateRelative(color):** Computes the relative luminance of a color (0
    = black, 1 = white) using sRGB linearization and WCAG weights.
  - **offset:** Constant used in luminance and contrast ratio formulas (prevents
    division by zero).
  - **weights:** Per-channel weights for converting linear RGB to luminance.
  - **GAMMA:** Gamma correction parameters for sRGB linearization (exponent,
    offset, scale).
  - **LINEARIZATION:** Threshold and divisor constants for sRGB linearization
    (threshold, thresholdDivisor).
