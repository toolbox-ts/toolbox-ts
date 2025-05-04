# `@toolbox-ts/colors/Hex`

Type-safe utilities for working with hexadecimal color values, including
validation, normalization, and conversion between string and integer formats.

## Exports

- **Hex:** ES6 module
  - **Color:** Template literal type for hex colors (e.g. `#rrggbbaa`).
  - **radix:** Base 16 constant for conversions.
  - **transparent:** Constant for a fully transparent hex color (`#00000000`).
  - **stripPrefix(value):** Removes `#` or `0x` prefix from a hex string.
  - **is(value):** Returns true if value is a valid hex color string (`#rgb[a]`,
    `#rrggbb[aa]`).
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
