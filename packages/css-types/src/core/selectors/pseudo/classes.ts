type DirDirectionality = "ltr" | "rtl";
/** https://drafts.csswg.org/selectors/#the-dir-pseudo */
type Dir = `:dir(${DirDirectionality})`;
/** https://drafts.csswg.org/selectors/#the-lang-pseudo */
type Lang = `:lang(${string})`;
/** https://drafts.csswg.org/selectors/#nth-child-pseudo */
type NthChild = `:nth-child(${string})`;
/** https://drafts.csswg.org/selectors/#nth-child-pseudo */
type NthLastChild = `:nth-last-child(${string})`;
/** https://drafts.csswg.org/selectors/#nth-of-type-pseudo */
type NthOfType = `:nth-of-type(${string})`;
/** https://drafts.csswg.org/selectors/#nth-of-type-pseudo */
type NthLastOfType = `:nth-last-of-type(${string})`;
type Functional =
  | Dir
  | Lang
  | NthChild
  | NthLastChild
  | NthOfType
  | NthLastOfType;

/** https://drafts.csswg.org/selectors/#user-pseudos */
type UserInvalid = ":user-invalid";
/** https://drafts.csswg.org/selectors/#user-pseudos */
type UserValid = ":user-valid";
type User = UserInvalid | UserValid;
/**
 * Targets all hyperlinks
 * https://drafts.csswg.org/selectors/#the-any-link-pseudo
 */
type LinkAny = ":any-link";
/**
 * Targets unvisited hyperlinks
 * https://drafts.csswg.org/selectors/#link
 */
type Link = ":link";
/**
 * Targets visited hyperlinks
 * https://drafts.csswg.org/selectors/#link
 */
type LinkVisited = ":visited";
/**
 * Targets local hyperlinks
 * https://drafts.csswg.org/selectors/#the-local-link-pseudo
 */
type LinkLocal = ":local-link";
/**
 * Targets hyperlink in current URL
 * https://drafts.csswg.org/selectors/#the-target-pseudo
 */
type LinkTarget = ":target";
/**
 * Targets hyperlinks in current URL or any of its descendants
 * https://drafts.csswg.org/selectors/#the-target-within-pseudo
 */
type LinkTargetWithin = ":target-within";
type LinkAll =
  | Link
  | LinkVisited
  | LinkLocal
  | LinkTarget
  | LinkAny
  | LinkTargetWithin;
/** https://drafts.csswg.org/selectors/#the-defined-pseudo */
type Defined = ":defined";
/** drafts.csswg.org/selectors/#the-scope-pseudo */
type Scope = ":scope";
/** https://drafts.csswg.org/selectors/#the-activation-pseudo */
type Active = `:active`;
/** https://drafts.csswg.org/selectors/#the-hover-pseudo */
type Hover = `:hover`;
/** https://drafts.csswg.org/selectors/#the-focus-pseudo */
type Focus = `:focus`;
/** https://drafts.csswg.org/selectors/#the-focus-within-pseudo */
type FocusWithin = `:focus-within`;
/** https://drafts.csswg.org/selectors/#the-focus-visible-pseudo */
type FocusVisible = `:focus-visible`;
/** https://drafts.csswg.org/selectors/#enableddisabled */
type Enabled = `:enabled`;
/** https://drafts.csswg.org/selectors/#enableddisabled */
type Disabled = `:disabled`;
type Toggle = Enabled | Disabled;
/** https://drafts.csswg.org/selectors/#rw-pseudos */
type ReadWrite = `:read-write`;
/** https://drafts.csswg.org/selectors/#rw-pseudos */
type ReadOnly = `:read-only`;
type RW = ReadWrite | ReadOnly;
/** https://drafts.csswg.org/selectors/#placeholder-shown */
type PlaceholderShown = `:placeholder-shown`;
/** https://drafts.csswg.org/selectors/#default */
type Default = `:default`;
/** https://drafts.csswg.org/selectors/#the-checked-pseudo */
type Checked = ":checked";
/** https://drafts.csswg.org/selectors/#the-indeterminate-pseudo */
type Indeterminate = ":indeterminate";
/** https://drafts.csswg.org/selectors/#validity-pseudos */
type Valid = ":valid";
/** https://drafts.csswg.org/selectors/#validity-pseudos */
type Invalid = ":invalid";
type Validity = Valid | Invalid;
/** https://drafts.csswg.org/selectors/#range-pseudos */
type InRange = ":in-range";
/** https://drafts.csswg.org/selectors/#range-pseudos */
type OutOfRange = ":out-of-range";
type Range = InRange | OutOfRange;
/** https://drafts.csswg.org/selectors/#opt-pseudos */
type Required = ":required";
/** https://drafts.csswg.org/selectors/#opt-pseudos */
type Optional = ":optional";
type Opt = Required | Optional;
/** https://drafts.csswg.org/selectors/#the-root-pseudo */
type Root = ":root";
/** https://drafts.csswg.org/selectors/#empty-pseudo */
type Empty = ":empty";

/** https://drafts.csswg.org/selectors/#first-child-pseudo */
type FirstChild = ":first-child";
/** https://drafts.csswg.org/selectors/#last-child-pseudo */
type LastChild = ":last-child";
/** https://drafts.csswg.org/selectors/#only-child-pseudo */
type OnlyChild = ":only-child";
type Child = FirstChild | LastChild | OnlyChild | NthChild | NthLastChild;

/** https://drafts.csswg.org/selectors/#first-of-type-pseudo */
type FirstOfType = ":first-of-type";
/** https://drafts.csswg.org/selectors/#last-of-type-pseudo */
type LastOfType = ":last-of-type";
/** https://drafts.csswg.org/selectors/#only-of-type-pseudo */
type OnlyOfType = ":only-of-type";

/** https://drafts.csswg.org/selectors/#selectordef-popover-open */
type PopoverOpen = ":popover-open";
/** https://drafts.csswg.org/selectors/#selectordef-modal */
type Modal = ":modal";
/** https://drafts.csswg.org/selectors/#autofill */
type AutoFill = ":autofill";
/** https://developer.mozilla.org/en-US/docs/Web/CSS/:state */
type State = ":state";

type Basic =
  | LinkAll
  | User
  | Toggle
  | RW
  | Opt
  | Validity
  | Range
  | FirstChild
  | LastChild
  | OnlyChild
  | Root
  | Empty
  | Defined
  | Scope
  | Active
  | Hover
  | Focus
  | FocusWithin
  | FocusVisible
  | PlaceholderShown
  | Default
  | Checked
  | Indeterminate
  | FirstOfType
  | LastOfType
  | OnlyOfType
  | PopoverOpen
  | AutoFill;

type All = Functional | Basic;

export type {
  Basic,
  Dir,
  Lang,
  Link,
  LinkVisited,
  LinkLocal,
  LinkTarget,
  LinkTargetWithin,
  LinkAny,
  LinkAll,
  Scope,
  Active,
  Hover,
  AutoFill,
  Modal,
  PopoverOpen,
  State,
  Focus,
  FocusWithin,
  FocusVisible,
  Toggle,
  RW,
  PlaceholderShown,
  Default,
  Checked,
  Indeterminate,
  Validity,
  Range,
  Opt,
  Root,
  Empty,
  NthChild,
  NthLastChild,
  FirstChild,
  LastChild,
  OnlyChild,
  NthOfType,
  NthLastOfType,
  FirstOfType,
  LastOfType,
  All,
  Child,
  DirDirectionality,
  Disabled,
  Enabled,
  Functional,
  InRange,
  Invalid,
  OnlyOfType,
  Optional,
  OutOfRange,
  ReadOnly,
  ReadWrite,
  Required,
  User,
  UserInvalid,
  UserValid,
  Valid,
  Defined,
};
