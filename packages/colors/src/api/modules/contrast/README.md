# `@toolbox-ts/colors/Contrast`

Utilities for calculating and adjusting color contrast ratios, including WCAG
2.2 compliance checks, binary search-based lightness tuning, and color muting.

## Exports

- **Contrast:** ES6 Module
  - **WCAG:** Thresholds for minimum color contrast ratios (AA, AA_Large, AAA,
    AAA_Large).
  - **CONTRAST:** Constants for contrast calculations and binary search
    (precision, maxIterations, bounds, directions).
  - **prepareResult:** Formats the result of a color adjustment operation.
  - **calculateRatio:** Calculates the contrast ratio between two colors using
    relative luminance and the WCAG formula.
  - **isRatioAchievable:** Determines if the target contrast ratio is achievable
    by adjusting lightness, and in which direction.
  - **findBestColor:** Uses binary search to find the best color (by adjusting
    lightness) to achieve a target contrast ratio.
  - **adjustToRatio:** Adjusts the foreground color to achieve a target contrast
    ratio with the background, returning the adjusted color and achieved
    contrast.
  - **isWcagCompliant:** Checks if a foreground/background color pair meets a
    given WCAG level (AA, AAA, etc).
  - **mute:** Generates a muted version of a color, blended with its inverse,
    and ensures it meets a minimum contrast ratio.
  - **Type definitions:**
    - **WcagLevel:** WCAG level keys.
    - **AdjustOptions, AdjustResult:** Options and result types for color
      adjustment.
    - **FindBestColorOptions:** Options for binary search.
    - **IsRatioAchievableOptions, IsRatioAchievableResult:** Types for
      achievability checks.
    - **IsWcagCompliantOptions:** Options for WCAG compliance check.
    - **MuteOptions:** Options for muting a color.
