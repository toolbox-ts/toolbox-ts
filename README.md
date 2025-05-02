# @toolbox-ts

![](https://img.shields.io/badge/coverage-100%25-brightgreen)

---

A monorepo for Typescript utility packages.

## Packages

| Package                                                 | Version                                                                                                                       | Description                    |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| [`@toolbox-ts/dsa`](./packages/dsa)                     | [![](https://img.shields.io/npm/v/@toolbox-ts/dsa?label=)](https://www.npmjs.com/package/@toolbox-ts/dsa)                     | Data structures and algorithms |
| [`@toolbox-ts/schema`](./packages/schema)               | [![](https://img.shields.io/npm/v/@toolbox-ts/schema?label=)](https://www.npmjs.com/package/@toolbox-ts/schema)               | Schema configuration utility   |
| [`@toolbox-ts/utils`](./packages/utils)                 | [![](https://img.shields.io/npm/v/@toolbox-ts/utils?label=)](https://www.npmjs.com/package/@toolbox-ts/utils)                 | General types and utilities    |
| [`@toolbox-ts/text`](./packages/text)                   | [![](https://img.shields.io/npm/v/@toolbox-ts/text?label=)](https://www.npmjs.com/package/@toolbox-ts/text)                   | Text utilities                 |
| [`@toolbox-ts/css-normalize`](./packages/css-normalize) | [![](https://img.shields.io/npm/v/@toolbox-ts/css-normalize?label=)](https://www.npmjs.com/package/@toolbox-ts/css-normalize) | Normalize reimagined           |
| [`@toolbox-ts/css-types`](./packages/css-types)         | [![](https://img.shields.io/npm/v/@toolbox-ts/css-types?label=)](https://www.npmjs.com/package/@toolbox-ts/css-types)         | CSS types                      |
| [`@toolbox-ts/colors`](./packages/colors)               | [![](https://img.shields.io/npm/v/@toolbox-ts/colors?label=)](https://www.npmjs.com/package/@toolbox-ts/colors)               | Colors utilities               |

---

## Development

This monorepo is built using [`pnpm`](https://pnpm.io) and
[`changesets`](https://github.com/changesets/changesets)

---

## ToDo

- [ ] Add CLI
  - [ ] Develop cmd to ensure build/ directory exists in all packages and add to
        release workflow to prevent publishing empty packages.
  - [ ] Move dep cruiser commands

## License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)

- @toolbox-ts
  - [NPM](https://www.npmjs.com/org/toolbox-ts)
  - [GitHub](https://github.com/toolbox-ts/toolbox-ts)
