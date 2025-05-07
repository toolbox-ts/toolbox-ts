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

- 🎨 **Color Conversion**: RGB, HSL, HEX interchange with alpha blending
- ♻️ **Composable, Flexible & Type-Safe**: Fully typed API for
  parsing,transforming, and analyzing color
- 🚥 **WCAG 2.2 Compliance**: Testing & Adjustment
- 🧠 **Smart Foreground Optimization**: via Binary Search
- 🧪 **100% Test Coverage**: Reliable and robust

---

## Modules Overview

| Module         | Description                                                                                | API & Details                                               |
| -------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| **API**        | Unified, type-safe API for parsing, converting, blending, adjusting, and analyzing colors. | [API README](./src/api/README.md)                           |
| **Hex**        | Type-safe utilities for working with hexadecimal color values.                             | [Hex README](./src/api/modules/hex/README.md)               |
| **Rgb**        | Type-safe utilities for RGB and RGBA color objects, including blending and inversion.      | [Rgb README](./src/api/modules/rgb/README.md)               |
| **Hsl**        | Utilities for HSL/HSLA color objects, normalization, and adjustment.                       | [Hsl README](./src/api/modules/hsl/README.md)               |
| **ColorWheel** | Utilities for color wheel math and hue sector logic.                                       | [ColorWheel README](./src/api/modules/colorWheel/README.md) |
| **Luminance**  | Relative luminance, gamma correction, and sRGB/WCAG compliance.                            | [Luminance README](./src/api/modules/luminance/README.md)   |
| **Contrast**   | Contrast ratio calculation, WCAG compliance, and color adjustment.                         | [Contrast README](./src/api/modules/contrast/README.md)     |
| **Converter**  | Composable, type-safe color conversion between RGB, HEX, and HSL.                          | [Converter README](./src/api/modules/converter/README.md)   |

---

## License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)

- @toolbox-ts
  - [NPM](https://www.npmjs.com/org/toolbox-ts)
  - [GitHub](https://github.com/toolbox-ts/toolbox-ts)
