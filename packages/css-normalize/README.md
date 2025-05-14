# @toolbox-ts/css-normalize

**Normalize Reimagined**

A modern, standards-aligned CSS normalization layer for consistent, accessible,
and predictable styling—with smart defaults for baseline interactivity.

- This package is adapted from
  [modern-normalize V3.0.1](https://github.com/sindresorhus/modern-normalize)
- Includes a fully-typed [Vars utility module](#vars-utility) for optional theme
  customization and control.
- _Be sure to checkout_
  - _[Atkinson Hyperlegible™](#atkinson-hyperlegible)_
  - _[@toolbox-ts/colors](https://www.npmjs.com/package/@toolbox-ts/colors) –
    Color conversion, WCAG compliance, and contrast utilities._

---

## Features

- 🧹 **Comprehensive CSS Reset:** Removes browser inconsistencies by resetting
  margin, padding, border, and background color for nearly all HTML elements,
  including sectioning, text, embedded, scripting, forms, lists, tables,
  interactive, and miscellaneous elements providing a clean slate to work with.
- 📐 **Consistent Box Model:** Applies `box-sizing: border-box` universally
  (`*, *::after, *::before`) for predictable layouts.
- ⚡ **Typography Defaults:** smooth scrolling, responsive typography, and
  disables iOS font-size adjustments.
- 🛡️ **Accessibility Conscious:** Provides visibility control styles, respects
  reduced motion preferences.
- 🛠️ **Customizable:** Easily override predefined CSS variables.
- 🌐 **Modern Browser Support:** Including Chrome, Edge, Firefox, Safari, and
  other Chromium-based browsers.
- 🔧 **Preprocessor Support:** [PostCSS](https://postcss.org/),
  [SCSS](https://sass-lang.com/), [Less](https://lesscss.org/),
  [Stylus](https://www.startpage.com/sp/search), and as a string template for
  maximum flexibility in your build pipeline.
- **Baseline light/dark theme:** Predefined light/dark theme tokens activated
  via media queries for seamless theming.
- 🚀 **First-Class Module Support:** Clean exports for direct import in modern
  bundlers, with CDN and npm options.
- 🌳 **Smart Shadow Elevation:** `--elevation-low`,
  `--elevation-medium`,`--elevation-high`, are automatically calculated based on
  `--elevation-base-y-offset` and `--elevation-base-blur`
- ⚙️ **[Vars Utility Module](#vars-utility):** A type-safe method for creating
  and overriding variables. Especially useful for Theming CSS-in-JS

---

## Installation

```bash
npm install @toolbox-ts/css-normalize
```

---

## Usage

- **⚠️ Important:** Whether you import the CSS directly or inject it dynamically
  (e.g., with CSS-in-JS), make sure it’s the first style applied in your app to
  ensure consistent baseline normalization.
- **✅ Supported Extensions:** `css`, `less`, `pcss`, `styl`

## 📥 Manual Copy or Download

Download the normalize file directly from:

- [NPM package page](https://www.npmjs.com/package/@toolbox-ts/css-normalize)
- [GitHub repository](https://github.com/Gajdascz/toolbox-ts/tree/main/packages/css-normalize).

Then import in your CSS/HTML as normal:

```css
@import url("path/normalize.{css|less|pcss|styl}");
```

```html
<head>
  ...
  <link rel="stylesheet" href="path/normalize.{css|less|pcss|styl}" />
  ...
</head>
```

## 🌐 CDN

No installation or downloads required. Just link in your CSS/HTML:

```html
<head>
  ...
  <link
    rel="stylesheet"
    href="https://unpkg.com/@toolbox-ts/css-normalize@latest/{css|less|pcss|styl}"
  />
  ...
</head>
```

```css
@import url("https://unpkg.com/@toolbox-ts/css-normalize@latest/{css|less|pcss|styl}");
```

### ⚙️ Bundler

```ts
// Entry file/component
import "@toolbox-ts/css-normalize/css";
```

### 💅 CSS-in-JSS

- [styled-components](https://styled-components.com/)
- [emotion](https://emotion.sh/docs/introduction)

- ⚠️
  **[I recommend using the vars utility for full typing and base theming control](#vars-utility)**

```ts
import { createGlobalStyle } from 'styled-components';
import normalizeString from '@toolbox-ts/css-normalize/string';

const GlobalStyle = createGlobalStyle`
  ${normalize}
  /* Additional global styles here */
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <div>Your app content here</div>
    </>
  );
}

export default App;
```

## Variables

### 🎨 CSS

All these variables can be overridden in your own CSS to customize the theme
foundation.

```css
:root {
  /* Font & Typography */
  --fallback-font-family:
    system-ui, sans-serif, "Segoe UI", Roboto, Helvetica, Arial,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  --fallback-font-family-mono:
    ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;

  --font-family: var(--fallback-font-family);
  --font-family-mono: var(--fallback-font-family-mono);

  --letter-spacing-base: 0rem;
  --letter-spacing-extra-tight: -0.1rem;
  --letter-spacing-tight: -0.05rem;
  --letter-spacing-loose: 0.05rem;
  --letter-spacing-extra-loose: 0.1rem;

  --line-height-base: 1.15;
  --line-height-xs: 0.875;
  --line-height-sm: 1;
  --line-height-lg: 1.25;
  --line-height-xl: 1.5;
  --line-height-double: 2;

  --font-size-base: clamp(16px, 4vw, 20px);
  --font-size-xxxs: clamp(0.25rem, 1.5vw, 0.375rem);
  --font-size-xxs: clamp(0.375rem, 2vw, 0.5rem);
  --font-size-xs: clamp(0.5rem, 2.5vw, 0.75rem);
  --font-size-sm: clamp(0.75rem, 3vw, 1rem);
  --font-size-md: clamp(1rem, 4vw, 1.25rem);
  --font-size-lg: clamp(1.25rem, 5vw, 1.5rem);
  --font-size-xl: clamp(1.5rem, 6vw, 1.75rem);
  --font-size-xxl: clamp(1.75rem, 7vw, 2rem);
  --font-size-double: clamp(2rem, 8vw, 2.25rem);
  --font-size-xxxl: clamp(2.25rem, 9vw, 2.5rem);
  --font-size-xxxxl: clamp(2.5rem, 10vw, 3rem);
  --font-size-triple: clamp(3rem, 12vw, 4rem);

  /* Font Weight */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 600;
  --font-weight-extra-bold: 800;

  /* Movement */
  --duration-short: 0.1s;
  --duration-medium: 0.25s;
  --duration-long: 0.5s;

  --ease-accel: cubic-bezier(0.4, 0, 1, 1);
  --ease-decel: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  --transition-theme-change: color var(--duration-short) ease background-color
    var(--duration-short) ease box-shadow var(--duration-short) ease
    border-color var(--duration-short) ease;

  /* Spacing */
  --spacing-neg-xs: -0.25rem;
  --spacing-neg-sm: -0.5rem;
  --spacing-neg-md: -1rem;
  --spacing-neg-lg: -1.5rem;
  --spacing-neg-xl: -2rem;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border Radii */
  --border-radius-base: 0.5rem;
  --border-radius-b: var(--border-radius-base) var(--border-radius-base) 0 0;
  --border-radius-t: 0 0 var(--border-radius-base) var(--border-radius-base);
  --border-radius-l: var(--border-radius-base) 0 0 var(--border-radius-base);
  --border-radius-r: 0 var(--border-radius-base) var(--border-radius-base) 0;
  --border-radius-tl-br: var(--border-radius-base) 0 0 var(--border-radius-base);
  --border-radius-tr-bl: 0 var(--border-radius-base) var(--border-radius-base) 0;

  /* Opacity */
  --opacity-transparent: 0;
  --opacity-quarter: 0.25;
  --opacity-half: 0.5;
  --opacity-three-quarters: 0.75;
  --opacity-opaque: 1;

  /* Color Palette */
  --light-color-surface: #fcfaff;
  --light-color-foreground: #121212;
  --light-color-primary: #4700ff;
  --light-color-inverse: #b8ff00;
  --light-color-secondary: #ff4700;
  --light-color-tertiary: #00ff47;
  --light-color-muted: #4d4d6a;
  --light-color-success: #163823;
  --light-color-warning: #7a4f00;
  --light-color-danger: #7a1f1f;
  --light-color-info: #1e3a8a;

  --dark-color-surface: #121212;
  --dark-color-foreground: #ffffff;
  --dark-color-primary: #5b21b6;
  --dark-color-inverse: #a4de49;
  --dark-color-secondary: #ff4500;
  --dark-color-tertiary: #00d170;
  --dark-color-muted: #a3a3a3;
  --dark-color-success: #4caf50;
  --dark-color-warning: #ff9800;
  --dark-color-danger: #f44336;
  --dark-color-info: #2196f3;

  --color-surface: var(--light-color-surface);
  --color-foreground: var(--light-color-foreground);
  --color-primary: var(--light-color-primary);
  --color-inverse: var(--dark-color-inverse);
  --color-secondary: var(--light-color-secondary);
  --color-tertiary: var(--light-color-tertiary);
  --color-muted: var(--light-color-muted);
  --color-success: var(--light-color-success);
  --color-warning: var(--light-color-warning);
  --color-danger: var(--light-color-danger);
  --color-info: var(--light-color-info);

  /* Elevation */
  --elevation-base-y-offset: 1.5px;
  --elevation-base-blur: 3px;
  --elevation-low: 0 var(--elevation-base-y-offset) var(--elevation-base-blur)
    var(--color-muted);
  --elevation-medium: 0 calc(var(--elevation-base-y-offset) * 2)
    calc(var(--elevation-base-blur) * 2) var(--color-muted);
  --elevation-high: 0 calc(var(--elevation-base-y-offset) * 4)
    calc(var(--elevation-base-blur) * 4) var(--color-muted);

  /* Breakpoints */
  --breakpoint-xs: 432px;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --breakpoint-xxl: 1400px;

  /* Z-Index */
  --z-index-behind: -1;
  --z-index-base: 0;
  --z-index-low: 1000;
  --z-index-medium: 1100;
  --z-index-high: 1200;
  --z-index-sidebar: 1300;
  --z-index-overlay: 1400;
  --z-index-modal: 1500;
  --z-index-tooltip: 1600;
  --z-index-notification: 1700;
  --z-index-top: 1800;

  /* Misc */
  --ul-li-marker: "•";
}
```

### Vars Utility

The Vars utility provides a fully type-safe system for defining and applying CSS
custom properties (a.k.a. design tokens) in a modular, overridable way—perfectly
suited for dynamic theming, light/dark mode switching, CSS-in-JS, and DOM
injection.

- ✅ Core Features

  - 🔒 Type-safe variable creation and referencing
  - 🧱 Structured token maps for theme primitives (colors, font, spacing, etc.)
  - 💡 Works seamlessly with vanilla CSS and CSS-in-JS (styled-components,
    @emotion)
  - 🧩 Composable per-theme overrides and cssVars map providing efficient access
    to all of the meant-to-be used var definitions (e.g. Vars.cssVars.colors.bg)
    in code.

#### Exports

#### Basic Usage

```ts
import { Vars } from '@toolbox-ts/css-normalize';

const withSelector = Vars.define({
  font: { size: '1rem', lineHeight: '1.5' },
  colors: { light: { bg: '#ffffff', fg: '#000000' } }
}, ':root');
=>
console.log(withSelector)
// Output:
// :root {
//  --font-size: 1rem;
//  --line-height: 1.5;
//  --light-color-bg: #ffffff;
//  --dark-color-fg: #000000;
//}

```

#### Advanced Usage

<details> <summary>DOM Injection</summary>

```ts
import { Vars, normalizeString } from "@toolbox-ts/css-normalize";

const style = document.createElement("style");
style.textContent = Vars.define(theme, ":root", normalizeString);
document.head.append(style);
```

</details>

</details> <details> <summary>Styled-Components Integration</summary>

If you're using Styled-Components, you should
[augment its type definitions for your theme access](https://styled-components.com/docs/api#create-a-declarations-file):

```ts
// Type augmentation file for component typing access
import "styled-components";
import type { Theme } from "./styles.tsx";
import { Vars } from "@toolbox-ts/css-normalize";
declare module "styled-components" {
  export type ThemeState = Vars.ThemeState;
  export type CSSVars = typeof Vars.cssVars;
  export interface DefaultTheme {
    mode: ThemeState;
    vars: CSSVars;
  }
}
// With this, you'll have access to all variable
// definitions within your components' theme context
// e.g. ${({theme})} => theme.color.bg === var(--color-bg)
```

Then apply the normalize/theme to your global styles:

```ts
// Global Styles Definition
import { Vars, normalizeString } from "@toolbox-ts/css-normalize";
import { createGlobalStyle } from "styled-components";
export const GlobalStyle = createGlobalStyle`
  ${Vars.define({ ...theme }, ":root", normalizeString)}
`;
```

</details>

---

## Hidden Normalization & Accessability

Includes specific rules aimed at improving accessibility, particularly for
screen reader users. You can take advantage of these rules to manage visibility
for different use cases.

```css
/* Makes the element invisible to screen readers, but remains included in the layout and is still available visually */
[aria-hidden="true"] {
  visibility: hidden;
}
/* Hide elements completely (from layout and screen readers) */
[hidden],
[data-hidden],
.hidden {
  display: none;
  pointer-events: none;
}
/* Hide elements visually but keep them available to screen readers */
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
```

---

## [Atkinson Hyperlegible™](https://www.brailleinstitute.org/freefont/)

I cannot recommend this font enough. I use it in all of my web projects nad as
my default system font. It's Offered by the Braille institute for **free**. The
fonts are designed beautifully including modern, easily recognizable glyphs (no
confusing lIi10O etc..) AND provides maximum legibility + accessibility. Be sure
to use both the Next (2025) and Mono variations!

## License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)

- @toolbox-ts
  - [NPM](https://www.npmjs.com/org/toolbox-ts)
  - [GitHub](https://github.com/toolbox-ts/toolbox-ts)
