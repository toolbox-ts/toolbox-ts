/** https://drafts.csswg.org/css-pseudo/#generated-content */
type Before = "::before";
/** https://drafts.csswg.org/css-pseudo/#generated-content */
type After = "::after";
/** https://drafts.csswg.org/css-pseudo/#placeholder-pseudo */
type Placeholder = "::placeholder";
/** https://drafts.csswg.org/css-pseudo/#first-line-pseudo */
type FirstLine = "::first-line";
/** https://drafts.csswg.org/css-pseudo/#first-letter-pseudo */
type FirstLetter = "::first-letter";
/** https://w3c.github.io/webvtt/#the-cue-pseudo-element */
type Cue = "::cue";
/** https://drafts.csswg.org/css-pseudo/#file-selector-button-pseudo */
type FileSelectorButton = "::file-selector-button";
/** https://drafts.csswg.org/css-position-4/#backdrop */
type Backdrop = "::backdrop";
/** https://drafts.csswg.org/css-scoping/#selectordef-slotted */
type Slotted = `::slotted(${string})`;
/** https://w3c.github.io/webvtt/#the-cue-pseudo-element */
type CueFn = `::cue(${string})`;
/** https://drafts.csswg.org/css-shadow-parts/#selectordef-part */
type Part = `::part(${string})`;

type Functional = Part | Slotted | CueFn;
type Basic =
  | Before
  | After
  | Placeholder
  | FirstLine
  | FirstLetter
  | FileSelectorButton
  | Backdrop
  | Cue;
type All = Functional | Basic;
export type {
  Functional,
  Basic,
  All,
  Before,
  After,
  Placeholder,
  FirstLine,
  FirstLetter,
  Slotted,
  FileSelectorButton,
  Backdrop,
  Cue,
  Part,
};
