# @toolbox-ts/css-normalize

## 1.3.0

### Minor Changes

- cdcae62: fix fonts not loading due to format (woff2 => woff2-variations), removed data-theme attribute on root, added cssVars map

## 1.2.1

### Patch Changes

- 2576c16: change bold/bolder type to string

## 1.2.0

### Minor Changes

- 39546cd: create api for colors, add optional space to types, improve normalize flexability

## 1.1.3

### Patch Changes

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
- Updated dependencies [7aa81e7]
  - @toolbox-ts/css-types@0.1.4

## 1.1.2

### Patch Changes

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
- Updated dependencies [08c0823]
  - @toolbox-ts/css-types@0.1.3

## 1.1.1

### Patch Changes

- Updated dependencies [f63898a]
  - @toolbox-ts/css-types@0.1.2

## 1.1.0

### Minor Changes

- d5c3498: fix css-types, update css-normalize, update docs

### Patch Changes

- Updated dependencies [d5c3498]
  - @toolbox-ts/css-types@0.1.1

## 1.0.8

### Patch Changes

- 78dbdea: fix declaration file (was using wrong syntax for module resolution)

## 1.0.7

### Patch Changes

- d020fd2: fix css-normalize type declaration
- d020fd2: fix css-normalize export type map

## 1.0.6

### Patch Changes

- 93b0107: generate css-normalize types declaration during build to fix import issue

## 1.0.5

### Patch Changes

- 2fc777d: add types file to remove import error

## 1.0.4

### Patch Changes

- 3235e2d: fix build process and ci

## 1.0.3

### Patch Changes

- 961c1f4: fixed build script copying src directory into build instead of just it's content
- 175bc0f: update build process

## 1.0.2

### Patch Changes

- b3a3feb: add github package registry support/automation

## 1.0.1

### Patch Changes

- 28b2b04: fix readme typo

## 1.0.0

### Major Changes

- initial release
