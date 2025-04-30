# @toolbox-ts/css-types

🚧 Early Release

Type-safe, Spec-compliant, type-safe CSS types built with template literal types
for expressive, composable styling.

Aims to be as semantically clear and CSSWG (W3C CSS Working Group)
specification-compliant as possible.

## Features

- 🎨 **Colors:** Strict types for all color formats, functions, and keywords
- 📏 **Units** (length, angle, time, resolution, etc.)
- 🧮 **Math:** (`calc`, `min`, `max`, etc.)
- 🖌️ **Custom Properties**: Type-safe support for CSS custom properties
- 🗂️ **Selectors:** Models CSS selectors (tags, pseudo-classes, pseudo-elements,
  attributes)
- 🏷️ **Modular:** Broken up into ES6 module namespaces for semantic clarity.
- 📚 **Inline Specification References**
- 🔧 **Custom Selector Building:** Provides `Selectors.Block` for creating a
  _relatively_ type-safe interface for dynamically writing CSS block selectors.
  - ⚠️ _Given the complexity of possible selector strings, true type safety is
    not possible. Trying to contain the type in a single string quickly
    overwhelms the type system due to combinatorial explosion.
    [Using the `Selectors.Block` interface](#block-selector) and
    [building it through object notation](#resolver) is the best middle-ground
    I've found so far to keep things performant and type-safe._

## Installation

```sh
npm install @toolbox-ts/css-types
# or
pnpm add @toolbox-ts/css-types
# or
yarn add @toolbox-ts/css-types
```

## Usage

### Basic Types

Import only what you need:

```ts
import type { Colors, Units, Selectors, Border } from "@toolbox-ts/css-types";

const buttonStyle: {
  color: Colors.Type;
  margin: Border.Width;
  padding: Units.Length;
} = { color: "rebeccapurple", margin: "2px", padding: "1em" };
```

### Block Selector

Use the `Selectors.Block` interface to build selector strings with relative
type-safety and performance.

```ts
/**
 * Resolution Order:
 *  1. tag
 *  2. tag#id
 *  3. tag#id.class
 *  4. tag#id.class[attribute]
 *  5. tag#id.class[attribute]:pseudo
 *  6. tag#id.class[attribute]:pseudo\{general\}
 *  7. tag#id.class[attribute]:pseudo\{general\}\{rest\}
 */
interface Chain {
  tag?: Tags.All;
  id?: ID;
  class?: Class | Class[];
  attribute?: Attribute.Attribute | Attribute.Attribute[];
  pseudo?: Pseudo.Classes.All | Pseudo.Classes.All[];
  rest?: string | string[];
}

type BlockStep = [Combinator, Chain];

interface Block {
  primary: Chain;
  steps?: BlockStep[];
}
```

### Block Selector Resolver

**🚨 This is not provided by the package**. You can copy and paste it in your
own code or create your own.

<details><summary>Example: Block Selector Resolver</summary>

```ts
const resolveSelector = ({ primary, steps = [] }: Selectors.Block): string => {
  const chainKeys = [
    "tag",
    "id",
    "class",
    "attribute",
    "pseudo",
    "rest",
  ] as const;
  const normalize = (part: string | string[]): string =>
    Array.isArray(part) ? part.join("") : part;

  const resolve = (curr: Selectors.Chain): string =>
    chainKeys.reduce(
      (acc, key) => (curr[key] ? (acc += normalize(curr[key])) : acc),
      "",
    );

  let selector = resolve(primary);

  return steps.length
    ? (selector += steps
        .map(
          ([combinator, chain]) =>
            `${combinator === " " ? " " : ` ${combinator} `}${resolve(chain)}`,
        )
        .join("")).trim()
    : selector;
};
```

</details>

## License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)

- @toolbox-ts
  - [NPM](https://www.npmjs.com/org/toolbox-ts)
  - [GitHub](https://github.com/toolbox-ts/toolbox-ts)
