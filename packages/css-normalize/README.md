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
- ⚡ **Modern Layout & Typography Defaults:** Uses Flexbox for root layout,
  smooth scrolling, responsive typography, and disables iOS font-size
  adjustments.
- 🛡️ **Accessibility Enhancements:** Provides focus-visible styles, respects
  reduced motion preferences, and improves form element usability.
- 🛠️ **Customizable:** Easily override predefined CSS variables.
- 🌐 **Modern Browser Support:** Including Chrome, Edge, Firefox, Safari, and
  other Chromium-based browsers.
- 🔧 **Preprocessor Support:** [PostCSS](https://postcss.org/),
  [SCSS](https://sass-lang.com/), [Less](https://lesscss.org/),
  [Stylus](https://www.startpage.com/sp/search), and as a string template for
  maximum flexibility in your build pipeline.
- ⚙️ **[Vars Utility Module](#vars-utility):** A type-safe method for creating
  and overriding variables.
- 🚀 **Developer Experience Enhancements:**
  - **Built-in Flex Layout:** Uses a flexible layout, making it effortless to
    create a full-page site.
  - **First-Class Module Support:** Clean exports for direct import in modern
    bundlers, with CDN and npm options.
  - **Baseline light/dark theme:** Predefined light/dark theme tokens activated
    via media queries for seamless theming.
  - **Smart Shadow Elevation:** `--elevation-low`,
    `--elevation-medium`,`--elevation-high`, are automatically calculated based
    on `--elevation-base-y-offset` and `--elevation-base-blur`

---

## Installation

```bash
npm install @toolbox-ts/css-normalize
```

---

## Hidden Normalization & Accessability

Includes specific rules aimed at improving accessibility, particularly for
screen reader users. You can take advantage of these rules to manage visibility
for different use cases: CSS Rules for Accessibility

- Makes the element invisible to screen readers, but keeps it in the layout:

  ```css
  [aria-hidden="true"] {
    visibility: hidden;
  }
  ```

- Completely hide elements from both layout and screen readers:

  ```css
  [hidden],
  .hidden,
  [data-hidden] {
    display: none;
    pointer-events: none;
  }
  ```

  - Visually hide elements but keep them available for screen readers:

  ```css
  .visually-hidden,
  [data-hidden="visually"] {
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
  /* === Typography === */
  --font-family:
    "Ubuntu", "Segoe UI", "Roboto", "Helvetica Neue", sans-serif, system-ui,
    "Apple Color Emoji", "Segoe UI Emoji"; /* Base sans-serif stack */
  --font-family-mono:
    "Ubuntu Mono", "SFMono-Regular", "Consolas", "Liberation Mono", monospace;
  --line-height: 1.5;
  --letter-spacing: 0.01em;
  --font-size: 20px;

  /* === Motion === */
  /* Default transition duration for UI elements */
  --transition-duration: 0.1s;
  /* Applied to basic interactive elements */
  --interactive-element-transition:
    background-color var(--transition-duration) ease,
    color var(--transition-duration) ease,
    border-color var(--transition-duration) ease,
    box-shadow var(--transition-duration) ease;

  /* === Spacing Scale === */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* === Border Radius & Width === */
  --border-radius: 0.5rem;
  --border-width: 1px;

  /* === Font Weights === */
  --weight-thin: 100;
  --weight-extra-light: 200;
  --weight-light: 300;
  --weight-normal: 400;
  --weight-medium: 500;
  --weight-bold: 600;
  --weight-extra-bold: 700;
  --weight-black: 900;

  /* === Outline === */
  --outline-width: 2px;
  --outline: var(--outline-width) solid var(--color-emphasis);

  /* === Elevation (Shadows) === */
  /* Used for calculating proceeding elevation y-offsets */
  --elevation-base-y-offset: 1.5px;
  /* Used for calculating proceeding elevation blur radii */
  --elevation-base-blur: 3px;

  --elevation-low: 0 var(--elevation-base-y-offset) var(--elevation-base-blur)
    var(--color-shadow);
  --elevation-medium: 0 calc(var(--elevation-base-y-offset) * 2)
    calc(var(--elevation-base-blur) * 2) var(--color-shadow);
  --elevation-high: 0 calc(var(--elevation-base-y-offset) * 4)
    calc(var(--elevation-base-blur) * 4) var(--color-shadow);

  /* === Light Mode Tokens === */
  --light-color-bg: #fcfaff;
  --light-color-fg: #1f0044;
  --light-color-primary: #5b21b6;
  --light-color-accent: #4c1d95;
  --light-color-emphasis: #3c0d99;
  --light-color-muted: #4d4d6a;
  --light-color-border: var(--light-color-emphasis);
  --light-color-outline: var(--light-color-emphasis);
  --light-color-shadow: var(--light-color-emphasis);

  /* === Dark Mode Tokens === */
  --dark-color-bg: #0f0e11;
  --dark-color-fg: #fcfaff;
  --dark-color-primary: #d8b4fe;
  --dark-color-accent: #a78bfa;
  --dark-color-emphasis: #f3e8ff;
  --dark-color-muted: #c9b8d1;
  --dark-color-border: var(--dark-color-emphasis);
  --dark-color-outline: var(--dark-color-emphasis);
  --dark-shadow-color: var(--dark-color-emphasis);

  /* === Active Theme Tokens === */
  /* Primary page background */
  --color-bg: var(--light-color-bg);
  /* Used for primary text / icons on bg */
  --color-fg: var(--light-color-fg);
  /* Used for primary buttons, links, etc. */
  --color-primary: var(--light-color-primary);
  /* Secondary button colors, accents */
  --color-accent: var(--light-color-accent);
  /* Used in outlines, hovers, focus */
  --color-emphasis: var(--light-color-emphasis);
  /* Used for visited links, helper text, subtitles, disabled interactives */
  --color-muted: var(--light-color-muted);
  /* Border for cards, inputs, etc. */
  --color-border: var(--light-color-border);
  /* Shadow used in elevation */
  --color-shadow: var(--light-color-shadow);
  /* Used for outlines/focus rings */
  --color-outline: var(--light-color-outline);
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

- `Vars` - ES6 Module
  - `ThemeState` – `'light' | 'dark'`
  - `cssProps` – Map of component parts to their CSS custom property names.
  - `cssVars` – Map of component parts to their corresponding `var(--*)`
    expressions.
  - `InputVars` – Type-safe structure representing theme values for use in
    `define()`.
  - `define(theme:InputVars, selector:string, normalizeString: string)` –
    Generates a CSS block string for a given theme input.

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
