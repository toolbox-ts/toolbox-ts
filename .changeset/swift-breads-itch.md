---
"@toolbox-ts/colors": major
"@toolbox-ts/utils": minor
"@toolbox-ts/css-normalize": patch
"@toolbox-ts/css-types": patch
"@toolbox-ts/file": patch
"@toolbox-ts/text": patch
---

- @toolbox-ts/colors Initial Release
- @toolbox-ts/utils Num module rework
  - Added:
    - Numerous type guards
    - UnitInterval module utilities for [0,1] range
    - Bits module for working with Bit data
    - round function with decimal point
    - normalize function for converting string numbers to actual numbers,
      filters out NaN, and optionally (checkFinite arg) filters our non-finite
      numbers
    - flexible reduce function with built in normalization
    - clamp function for enforcing a value between a min and max (includes
      decimal)
    - range calculation function
    - average calculation function
    - min/max which normalizes all numbers before returning result
