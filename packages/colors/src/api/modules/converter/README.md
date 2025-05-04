# `@toolbox-ts/colors/Converter`

Composable, type-safe color conversion utilities for RGB, HEX, and HSL formats,
including alpha channel handling and normalization.

## Exports

- **Converter:** ES6 Module
  - **resolve(color, type):** Converts a color to a specified type (`'rgb'`,
    `'hex'`, or `'hsl'`).
  - **toRgb(color):** Converts any supported color type to RGBA.
  - **toHex(color):** Converts any supported color type to HEX.
  - **toHsl(color):** Converts any supported color type to HSLA.
  - **getColorType(color):** Returns the detected color type (`'rgb'`, `'hex'`,
    `'hsl'`, or `undefined`).
  - **defaults:** Default values for each color type (transparent).
  - **validators:** Type guards for each color type.
  - **rgbTo:** Conversion functions from RGB to RGB, HEX, and HSL.
  - **hexTo:** Conversion functions from HEX to HEX, RGB, and HSL.
  - **hslTo:** Conversion functions from HSL to HSL, RGB, and HEX.
