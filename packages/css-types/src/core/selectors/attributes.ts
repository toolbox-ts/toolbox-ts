//#region [ Match]====================================================
/**
 * Exact
 * https://drafts.csswg.org/selectors/#attribute-representation
 */
type MatchExact = "=";
/**
 * Exactly one of in val (whitespace separated)
 * https://drafts.csswg.org/selectors/#attribute-representation
 */
type MatchOneOf = "~=";
/**
 * Begins with exactly
 * https://drafts.csswg.org/selectors/#attribute-substrings
 */
type MatchBeingsWith = "^=";
/**
 * Ends with exactly
 * https://drafts.csswg.org/selectors/#attribute-substrings
 */
type MatchEndsWith = "$=";
/**
 * Contains substr anywhere
 * https://drafts.csswg.org/selectors/#attribute-substrings
 */
type MatchContains = "*=";
/**
 * Begins with exactly and followed by a hyphen
 * https://drafts.csswg.org/selectors/#attribute-representation
 */
type MarchBeginsWithThenHyphen = "|=";
type Match =
  | MatchExact
  | MatchOneOf
  | MatchBeingsWith
  | MatchEndsWith
  | MatchContains
  | MarchBeginsWithThenHyphen;
//#endregion ==================================================================
/** https://drafts.csswg.org/selectors/#attribute-case */
type CaseSensitivity = "i" | "s";
/** https://drafts.csswg.org/selectors/#attribute-representation */
type Attribute<A extends string = string, O extends Match = "="> =
  | `[${A}]`
  | `[${A}${O}"${string}"${string}]`;

export type {
  Attribute,
  Match,
  MatchExact,
  MatchOneOf,
  MatchBeingsWith,
  MatchEndsWith,
  MatchContains,
  MarchBeginsWithThenHyphen,
  CaseSensitivity,
};
