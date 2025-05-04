# `@toolbox-ts/colors/Rgb`

Type-safe utilities for working with RGB and RGBA color objects, including
validation, normalization, inversion, string parsing/serialization, and
blending.

## Exports

- **Rgb:** ES6 Module
  - **Rgb, Rgba, Color:** Type aliases for RGB/RGBA color objects.
  - **transparent:** Constant for a fully transparent RGBA color.
  - **isRgb(value):** Returns true if value is a valid RGB object.
  - **normalize(value):** Normalizes input to a valid RGBA color or returns
    transparent.
  - **invert(value):** Inverts an RGBA color (per channel, alpha clamped).
  - **blendAlpha(fg, bg):** Alpha blends two RGBA colors and returns the result
    (fully opaque).
  - **blendWeighted({ fg, bg, weight }):** Blends two colors using a weighted
    ratio (not alpha compositing).
  - **clamp(value):** Clamps a channel value to [0, 255] and rounds to integer.
  - **toString(rgb):** Serializes an RGB(A) object to an `rgba(r, g, b, a)`
    string.
  - **stringToRgb(str):** Parses an `rgb(...)` or `rgba(...)` string into an
    RGB(A) object.
