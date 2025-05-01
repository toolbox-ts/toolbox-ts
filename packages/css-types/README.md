# @toolbox-ts/css-types

🚧 Early Release

Type-safe, Spec-compliant, CSS types built with template literal types for
expressive, composable styling.

Aims to be as semantically clear and CSSWG (W3C CSS Working Group)
specification-compliant as possible.

## Features

- 🎨 **Colors:** Strict types for all color formats, functions, and keywords
- 📏 **Units** (length, angle, time, resolution, etc.)
- 🧮 **Math:** (`calc`, `min`, `max`, etc.)
- 🖌️ **Custom Properties:**: Type-safe support for CSS custom properties
- 🗂️ **Selectors:** Models CSS selectors (tags, pseudo-classes, pseudo-elements,
  attributes)
- 🏷️ **Modular:** Broken up into ES6 module namespaces for semantic clarity.
- 📚 **Inline Specification References:** Most types include comments
  referencing the relevant section of the CSSWG spec (where applicable), aiding
  accuracy and maintainability.
- 🔧 **Custom Selector Building:** Provides `Selectors.Block` for creating a
  _relatively_ type-safe interface for dynamically writing CSS block selectors.
  - _⚠️ Due to the complexity of CSS selectors, complete type safety across all
    permutations isn't feasible. Representing selectors as fully typed strings
    leads to combinatorial blow-up. [Selectors.Block](#block-selector) offers a
    practical middle ground using structured object notation and limited
    inference. See
    [Block Selector Resolver for example resolution implementation](#block-selector-resolver)_.

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
type Logical = "not" | "is" | "where" | "has";
type OrderedLogical = Logical[];
interface ChainBase {
  tag?: Tags.All | Universal;
  id?: ID;
  class?: Class | Class[];
  attribute?: Attribute.Attribute | Attribute.Attribute[];
  pseudo?: Pseudo.Classes.All | Pseudo.Classes.All[];
  rest?: string | string[];
  logical?: Logical | OrderedLogical;
}
interface PrimaryChainPseudoRoot extends ChainBase {
  pseudo: ":root";
  tag?: never;
}
interface PrimaryChainGeneral extends ChainBase {
  pseudo?:
    | Exclude<Pseudo.Classes.All, ":root">
    | Exclude<Pseudo.Classes.All, ":root">[];
}
type PrimaryChain = PrimaryChainGeneral | PrimaryChainPseudoRoot;

interface SteppableChain extends PrimaryChainGeneral {
  logical?: never;
}
/**
 * Chain Resolution Order:
 *  1. :root
 *  2. *
 *  3. logical
 *  3. tag
 *  4. #id
 *  5. .class
 *  6. [attribute]
 *  7. :pseudo
 *  8. :pseudo\{general\}
 *  9. :pseudo\{general\}\{rest\}
 */
type BlockStep = [Combinator, SteppableChain];
interface Block {
  primary: PrimaryChain;
  steps?: BlockStep[];
}

/**
 * Chain Resolution Order:
 *  1. :root
 *  2. *
 *  3. logical
 *  3. tag
 *  4. #id
 *  5. .class
 *  6. [attribute]
 *  7. :pseudo
 *  8. :pseudo\{general\}
 *  9. :pseudo\{general\}\{rest\}
 */
type BlockStep = [Combinator, SteppableChain];
interface Block {
  primary: PrimaryChain;
  steps?: BlockStep[];
}
```

## Block Selector Resolver

**🚨 This is not provided by the package**. You can copy and paste it in your
own code or create your own.

<details><summary>Example: Block Selector Resolver</summary>

```ts
import type { Selectors } from "@toolbox-ts/css-types";

export const resolveSelector = ({
  primary,
  steps = [],
}: Selectors.Block): string => {
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

  const resolve = (curr: Selectors.ChainBase): string =>
    chainKeys.reduce(
      (acc, key) => (curr[key] ? (acc += normalize(curr[key])) : acc),
      "",
    );
  const { attribute, class: _class, logical, id, pseudo, rest, tag } = primary;
  let opening = "";
  let closing = "";
  if (logical) {
    const l = Array.isArray(logical) ? logical : [logical];
    closing = ")".repeat(l.length);
    opening = l.map((_l) => `:${_l}(`).join("");
  }
  const root = pseudo === ":root" ? ":root" : "";
  let selector = resolve({
    ...(root ? { pseudo: undefined, tag: undefined } : { pseudo, tag }),
    attribute,
    class: _class,
    id,
    rest,
  });

  return `${opening}${root}${
    steps.length
      ? (selector += steps
          .map(
            ([combinator, chain]) =>
              `${combinator === " " ? " " : ` ${combinator} `}${resolve(chain)}`,
          )
          .join("")).trim()
      : selector
  }${closing}`;
};
```

</details>

## License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)

- @toolbox-ts
  - [NPM](https://www.npmjs.com/org/toolbox-ts)
  - [GitHub](https://github.com/toolbox-ts/toolbox-ts)
