# @toolbox-ts/colors

## 1.4.4

### Patch Changes

- Updated dependencies [b71a12c]
  - @toolbox-ts/utils@0.4.0

## 1.4.3

### Patch Changes

- 26b8983: fix readme links

## 1.4.1

### Patch Changes

- b29f82b: rework css-normalize & update dependencies
- Updated dependencies [b29f82b]
  - @toolbox-ts/utils@0.3.1

## 1.4.0

### Minor Changes

- 2576c16: @toolbox-ts/colors Added Weighted and Alpha blending, get.mute, get.inverse, changed get.variants to return inverse and muted, split up package README

## 1.3.0

### Minor Changes

- d055cae: @toolbox-ts/colors Added Weighted and Alpha blending, get.mute, get.inverse, changed get.variants to return inverse and muted, split up package README

## 1.2.0

### Minor Changes

- 37cdd1d: add get.inverse fn to api

## 1.1.1

### Patch Changes

- aeb66e0: export WcagLevel type and wrap all functions to accept string

## 1.1.0

### Minor Changes

- 39546cd: create api for colors, add optional space to types, improve normalize flexability

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
