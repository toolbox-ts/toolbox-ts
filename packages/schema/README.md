# @toolbox-ts/schema

![](https://img.shields.io/badge/coverage-100%25-brightgreen)

---

Lightweight, type-safe schema utility for managing structured field definitions,
defaults, runtime validation, and value processing.

---

## Installation

```bash
npm install @toolbox-ts/schema
```

---

## Features

- 🔧 **Field Types**: Supports `primitive`, `object`, and `array` fields with
  optional validators and merging logic.
- 🧠 **Smart Defaults**: Every field enforces a default value and type guard at
  runtime.
- 🔄 **State Management**: Track and mutate "current" values, with `.set()`,
  `.reset()`, and `.clone()` methods.
- 🧩 **Processing Hooks**: Optional `pre` and `post` hooks for schema-wide value
  transformation.
- 🔍 **Validation & Typing**: Full runtime shape validation with `schema.is()`,
  and strong typing throughout.
- 🛠️ **Extensible**: Easily extend with custom merge functions, value
  processors, or guard logic.
- 🧪 **100% Typed and Test-Covered**

---

## License

MIT – © 2025 Nolan Gajdascz [@toolbox-ts](https://www.npmjs.com/org/toolbox-ts)
