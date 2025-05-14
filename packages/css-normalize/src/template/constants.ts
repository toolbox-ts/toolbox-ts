import { css } from "../core/index.js";

const DARK_VARS = css`
  --color-surface-0: var(--dark-color-surface-0);
  --color-surface-1: var(--dark-color-surface-1);
  --color-surface-2: var(--dark-color-surface-2);
  --color-surface-3: var(--dark-color-surface-3);
  --color-on-surface: var(--dark-color-on-surface);
  --color-primary: var(--dark-color-primary);
  --color-on-primary: var(--dark-color-on-primary);
  --color-secondary: var(--dark-color-secondary);
  --color-on-secondary: var(--dark-color-on-secondary);
  --color-tertiary: var(--dark-color-tertiary);
  --color-on-tertiary: var(--dark-color-on-tertiary);
  --color-muted: var(--dark-color-muted);
  --color-on-muted: var(--dark-color-on-muted);
  --color-success: var(--dark-color-success);
  --color-on-success: var(--dark-color-on-success);
  --color-warning: var(--dark-color-warning);
  --color-on-warning: var(--dark-color-on-warning);
  --color-danger: var(--dark-color-danger);
  --color-on-danger: var(--dark-color-on-danger);
  --color-info: var(--dark-color-info);
  --color-on-info: var(--dark-color-on-info);
`;
const LIGHT_VARS = css`
  --color-surface-0: var(--light-color-surface-0);
  --color-surface-1: var(--light-color-surface-1);
  --color-surface-2: var(--light-color-surface-2);
  --color-surface-3: var(--light-color-surface-3);
  --color-on-surface: var(--light-color-on-surface);
  --color-primary: var(--light-color-primary);
  --color-on-primary: var(--light-color-on-primary);
  --color-secondary: var(--light-color-secondary);
  --color-on-secondary: var(--light-color-on-secondary);
  --color-tertiary: var(--light-color-tertiary);
  --color-on-tertiary: var(--light-color-on-tertiary);
  --color-muted: var(--light-color-muted);
  --color-on-muted: var(--light-color-on-muted);
  --color-success: var(--light-color-success);
  --color-on-success: var(--light-color-on-success);
  --color-warning: var(--light-color-warning);
  --color-on-warning: var(--light-color-on-warning);
  --color-danger: var(--light-color-danger);
  --color-on-danger: var(--light-color-on-danger);
  --color-info: var(--light-color-info);
  --color-on-info: var(--light-color-on-info);
`;

export const THEMES = {
  mediaDark: `
    @media (prefers-color-scheme: dark) {:root {${DARK_VARS}}}`,
  mediaLight: `
    @media (prefers-color-scheme: light) {:root {${LIGHT_VARS}}}`,
  rootDark: `:root[data-theme='dark'] {${DARK_VARS}}`,
  rootLight: `:root[data-theme='light'] {${LIGHT_VARS}}`,
} as const;
export const FALL_BACK_FONTS = {
  reg: `system-ui, sans-serif, 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`,
  mono: `ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace`,
} as const;
export const HEAD = css`
  /*! Adapted from modern-normalize v3.0.1 | MIT License | https://github.com/sindresorhus/modern-normalize */
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }
  :host {
    all: initial;
  }
`;
export const NORMALIZE = css`
  html, body,
/* Sectioning */
div, span, main, article, section,
nav, aside, header, footer, hgroup, 
/* Headings */
h1, h2, h3, h4, h5, h6, 
/* Text-level Semantics */
p, a, q, s, b, u, i, address, strong, 
samp, big, cite, code, del, dfn, blockquote, 
pre, wbr, abbr, acronym, em, ins, kbd,  
small, strike, sub, sup, tt, var, center,
mark, bdi, bdo, data, time, output, meter, 
/* Embedded Content */
img, picture, canvas, svg, object, 
embed, iframe, applet, video, audio, 
source, track, map, area, 
/* Scripting and Web Components */
template, slot, noscript, 
/* Forms */
form, fieldset, legend, label, input, 
button, select, datalist, optgroup, 
option, textarea, output, 
/* Lists */
ul, ol, li, dl, dt, dd, menu, 
/* Tables */
table, caption, tbody, tfoot, 
thead, tr, th, td, col, colgroup, 
/* Interactive Elements */
details, summary, dialog, 
/* Figure */
figure, figcaption, 
/* Ruby Annotations */
ruby, rt, rp {
    margin: 0;
    padding: 0;
    background-color: inherit;
    font: inherit;
    color: inherit;
  }
  /* Ensure Semantic Flow tags default to Block */
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  main,
  menu,
  nav,
  section {
    display: block;
  }
  fieldset {
    min-width: 0;
  }
  summary {
    display: list-item;
  }

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    height: auto;
  }
  ::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
  }

  [type="search"] {
    -webkit-appearance: textfield;
    appearance: textfield;
    outline-offset: -2px;
  }

  html {
    box-sizing: inherit;
    background: none;
    font-family: var(--font-family, var(--fallback-font-family));
    font-size: var(--font-size-base);
    line-height: var(--line-height-base);
    letter-spacing: var(--letter-spacing-base);
    cursor: auto;
    tab-size: 4;
    min-height: 100vh;
    overflow-y: scroll;
    text-rendering: optimizeLegibility;
    overflow-wrap: break-word;
    word-break: break-word;
    scroll-behavior: smooth;
    scrollbar-gutter: stable both-edges;
    scrollbar-width: thin;
  }
  body {
    transition: var(--transition-theme-change);
    background-color: var(--color-surface-0);
    color: var(--color-on-surface);
  }
  sub,
  sup {
    font-size: var(--font-size-xs);
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  sub {
    bottom: var(--spacing-neg-xs);
  }
  sup {
    top: var(--spacing-neg-sm);
  }
  b,
  strong {
    font-weight: var(--font-weight-bold);
  }
  small {
    font-size: var(--font-size-xs);
  }
  blockquote,
  q {
    quotes: none;
  }
  code,
  kbd,
  samp,
  pre {
    font-family: var(--font-family-mono, var(--fallback-font-family-mono));
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-normal);
    letter-spacing: var(--letter-spacing-base);
  }
  h1 {
    font-size: var(--font-size-xxxl);
  }
  h2 {
    font-size: var(--font-size-xl);
  }
  h3 {
    font-size: var(--font-size-lg);
  }
  h4 {
    font-size: var(--font-size-md);
  }
  h5 {
    font-size: var(--font-size-base);
  }
  h6 {
    font-size: var(--font-size-sm);
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-lg);
  }
  *:disabled {
    cursor: not-allowed;
    opacity: var(--opacity-half);
    pointer-events: none;
    color: var(--color-muted);
  }
  button,
  a,
  select,
  option,
  video,
  details > summary,
  label[for],
  [role="button"],
  [type="button"],
  [type="reset"],
  [type="submit"],
  [type="checkbox"],
  [type="radio"],
  [type="file"],
  [type="range"],
  [type="color"],
  [type="image"],
  [type="number"] {
    cursor: pointer;
  }

  :focus:not(:focus-visible) {
    outline: none;
  }
  :focus-visible {
    outline: 2px solid var(--color-primary);
  }

  button,
  ::-webkit-search-decoration,
  [type="button"],
  [type="reset"],
  [type="submit"],
  [type="date"],
  [type="time"],
  [type="datetime-local"],
  [type="month"] {
    -webkit-appearance: none;
    appearance: none;
  }

  button,
  input,
  select,
  textarea,
  optgroup {
    font-size: 100%;
    vertical-align: baseline;
    line-height: inherit;
  }
  label {
    vertical-align: middle;
  }

  body:has(dialog[open]) {
    overflow: hidden;
  }

  ul,
  ol,
  menu {
    list-style: none;
  }
  ol {
    counter-reset: list-counter;
  }
  ol li::before,
  ul li::before {
    font-weight: var(--weight-bold);
  }
  ol li::before {
    counter-increment: list-counter;
    content: counter(list-counter) ".";
  }
  ul li::before {
    content: var(--ul-li-marker);
  }

  table {
    border-color: currentcolor;
    border-collapse: collapse;
    border-spacing: 0;
    caption-side: bottom;
    width: 100%;
    table-layout: fixed;
  }
  caption {
    font-size: var(--font-size-sm);
  }
  img,
  svg,
  video,
  canvas,
  audio,
  iframe,
  embed,
  object,
  sub,
  sup {
    vertical-align: baseline;
    max-width: 100%;
    height: auto;
  }
  img {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
  svg {
    display: inline-flex;
    fill: currentColor;
  }

  progress,
  progress::-moz-progress-bar,
  progress::-webkit-progress-bar {
    vertical-align: baseline;
  }
`;
export const HIDDEN = css`
  [aria-hidden="true"] {
    visibility: hidden;
  }
  [hidden],
  [data-hidden],
  .hidden {
    display: none;
    pointer-events: none;
  }
  [data-hidden="visually"],
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    clip: rect(0, 0, 0, 0);
    overflow: hidden;
    opacity: 0;
  }
`;
export const REDUCED_MOTION = css`
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
