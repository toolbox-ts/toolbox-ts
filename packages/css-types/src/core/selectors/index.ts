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
  | Not
  | Is
  | Where
  | Has
  | Universal
  | Tags.All
  | Pseudo.Classes.All
  | Pseudo.Elements.All;
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

export type {
  Universal,
  BlockStep,
  Not,
  Is,
  Where,
  Has,
  Block,
  Chain,
  General,
  Class,
  ID,
  Combinator,
  Child,
  Descendant,
  NextSibling,
  SubsequentSibling,
};
