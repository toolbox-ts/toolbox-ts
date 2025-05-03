# @toolbox-ts/colors

## 1.0.3

### Patch Changes

- 0578d95: fix wcag exports from Contrast

## 1.0.2

### Patch Changes

- a565de9: fix wcag exports from Contrast

## 1.0.1

### Patch Changes

- 83d93f8: fix export

## 1.0.0

### Major Changes

- 152e9b6: fix export

## 0.0.0

### Major Changes

- 08c0823: - @toolbox-ts/colors Initial Release
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

### Patch Changes

- Updated dependencies [08c0823]
  - @toolbox-ts/utils@0.2.0
