---
"@toolbox-ts/utils": minor
---

update utils package Num module

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
