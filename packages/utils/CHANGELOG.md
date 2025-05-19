# @toolbox-ts/utils

## 0.4.1

### Patch Changes

- 026dbfc: add factorial fn

## 0.4.0

### Minor Changes

- b71a12c: update utils package Num module

  - Changed function naming:
    - sum => add
    - difference => subtract
    - product => multiply
    - is.stringNumber => is.numericString
  - Base functions now accept object option args instead of flat. Most functions
    also now support normalizationOpt overrides.
  - Add divide fn
  - Changed normalize to accept a fallback parameter and defaults to NaN for
    improved predictability.

## 0.3.1

### Patch Changes

- b29f82b: rework css-normalize & update dependencies

## 0.3.0

### Minor Changes

- 7aa81e7: - @toolbox-ts/colors Initial Release
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

## 0.2.0

### Minor Changes

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

## 0.1.4

### Patch Changes

- d5c3498: fix css-types, update css-normalize, update docs

## 0.1.3

### Patch Changes

- 3235e2d: fix build process and ci

## 0.1.2

### Patch Changes

- b3a3feb: add github package registry support/automation

## 0.1.1

### Patch Changes

- monorepo release
