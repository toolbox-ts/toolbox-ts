export type * as Tags from "./tags.js";
export type * as Pseudo from "./pseudo/index.js";
export type * as Attribute from "./attributes.js";

import type * as Tags from "./tags.js";
import type * as Pseudo from "./pseudo/index.js";
import type * as Attribute from "./attributes.js";

/** https://drafts.csswg.org/selectors/#the-universal-selector */
type Universal = "*";

/** https://drafts.csswg.org/selectors/#negation */
type Not = `:not(${string})`;

/** https://drafts.csswg.org/selectors/#matches */
type Is = `:is(${string})`;

/** https://drafts.csswg.org/selectors/#zero-matches */
type Where = `:where(${string})`;

/** https://drafts.csswg.org/selectors/#relational */
type Has = `:has(${string})`;

/** https://drafts.csswg.org/selectors/#class-html */
type Class = `.${string}`;

/** https://drafts.csswg.org/selectors/#id-selectors */
type ID = `#${string}`;

/** https://drafts.csswg.org/selectors/#descendant-combinators */
type Descendant = " ";
/** https://drafts.csswg.org/selectors/#child-combinators */
type Child = ">";
/** https://drafts.csswg.org/selectors/#adjacent-sibling-combinators */
type NextSibling = "+";
/** https://drafts.csswg.org/selectors/#adjacent-sibling-combinators */
type SubsequentSibling = "~";
/** https://drafts.csswg.org/selectors/#combinators */
type Combinator = Descendant | Child | NextSibling | SubsequentSibling;

type General =
  | Attribute.Attribute
  | Class
  | ID
  | Universal
  | Tags.All
  | Pseudo.Classes.All
  | Pseudo.Elements.All;

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

export type {
  Universal,
  PrimaryChain,
  PrimaryChainPseudoRoot,
  PrimaryChainGeneral,
  SteppableChain,
  BlockStep,
  Not,
  Is,
  Where,
  Has,
  Block,
  ChainBase,
  Logical,
  OrderedLogical,
  General,
  Class,
  ID,
  Combinator,
  Child,
  Descendant,
  NextSibling,
  SubsequentSibling,
};
