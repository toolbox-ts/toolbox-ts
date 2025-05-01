# @toolbox-ts/css-normalize

---

**Normalize Reimagined**

A modernized, opinionated standards-based CSS normalization layer for
consistent, accessible, and predictable styling across browsers. This package is
adapted from
[modern-normalize V3.0.1](https://github.com/sindresorhus/modern-normalize) to
provide a robust CSS baseline with sensible defaults including
[Atkinson Hyperlegible™ next(2025) and monospace fonts from the Braille Institute](https://www.brailleinstitute.org/freefont/).
It aims to provide a consistent, accessible, and predictable baseline for web
projects

---

## Features

- 🧹 **Comprehensive CSS Reset:** Removes browser inconsistencies by resetting
  margin, padding, border, and background color for nearly all HTML elements,
  including sectioning, text, embedded, scripting, forms, lists, tables,
  interactive, and miscellaneous elements providing a clean slate to work with.
- 🖋️ **Accessible Custom Fonts:**
  [Bundles Atkinson Hyperlegible™ Next & Mono](https://www.brailleinstitute.org/freefont/)
  Masterfully crafted by the Braille Institute, these variable font faces
  provide a clean and modern look while improving readability and accessibility.
- 📐 **Consistent Box Model:** Applies `box-sizing: border-box` universally
  (`*, *::after, *::before`) for predictable layouts.
- ⚡ **Modern Layout & Typography Defaults:** Uses flexbox for root layout,
  smooth scrolling, responsive typography, and disables iOS font size
  adjustments.
- 🛡️ **Accessibility Enhancements:** Provides focus-visible styles, respects
  reduced motion preferences, and improves form element usability.
- 🛠️ **Customizable:** Simply override predefined CSS variables
- 🌐 **Modern Browser Support:** Including Chrome, Edge, Firefox, Safari, and
  other Chromium-based providers.
- 🔧 **Preprocessor Support:** [PostCSS](https://postcss.org/),
  [SCSS](https://sass-lang.com/), [Less](https://lesscss.org/),
  [Stylus](https://www.startpage.com/sp/search), and as a string template for
  maximum flexibility in your build pipeline.
- ⚙️ **[Vars Utility Module](#vars-utility):** Provides a type-safe method for
  creating override variables.
- 🚀 **Developer Experience Enhancements**:
  - **Built-in Flex Layout:** Uses a flexible layout, making it effortless to
    create a full page site
  - **Baseline CSS variables:** under the `--root` namespace for bg and txt
    color, spacing, and any toolchain.
  - **First-Class Module Support:** Clean exports for direct import in modern
    bundlers, with CDN and npm options.
  - **Baseline light/dark theme:** Setup with media queries and a
    `[data-theme="dark"]` selector which can be implemented with minimal JS.
  - **Smart Shadow Elevation:** `--elevation-low`,
    `--elevation-medium`,`--elevation-high`, are automatically calculated based
    on `--elevation-base-y-offset` and `--elevation-base-blur`

---

## Installation

```bash
npm install @toolbox-ts/css-normalize
```

---

## Usage

- 📌 **Important:** Whether using the CSS file or the string export, this
  normalize must be the very first style included in your CSS or template
  string.
- ℹ️ **Supported Extensions:** {css|less|pcss|styl} (defaults to css if non
  provided)

### Direct Stylesheet Import

In your Stylesheet

```css
@import "@toolbox-ts/css-normalize/css";
```

### Direct Script Import

Or, if using a bundler (like [Vite](https://vitest.dev/) or
[Webpack](https://webpack.js.org/)):

```ts
import "@toolbox-ts/css-normalize/css";
```

Or, If you use a CSS-in-JS library (like
[styled-components](https://styled-components.com/),
[emotion](https://emotion.sh/docs/introduction) or
[vanilla-extract](https://vanilla-extract.style/)), and are not in an
environment that supports directly importing CSS, you can import the
normalization CSS as a string and inject it directly into your component:

```ts
import normalize from "@toolbox-ts/css-normalize/string";
```

[⚙️ **Utility:** Introduced in V1.1.0 you can now import and use the `Vars` utility module which provides auto-complete and type safety for all of the base variables.](#vars-utility)

### CDN

Directly in your HTML, no installation required

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@toolbox-ts/css-normalize@latest/{css|scss|pcss|less|styl}"
/>
```

### Copy+Paste/Download

Simply copy and paste or download the normalize.css file from the
[NPM package page](https://www.npmjs.com/package/@toolbox-ts/css-normalize) or
[GitHub repository](https://github.com/Gajdascz/toolbox-ts/tree/main/packages/css-normalize).

## Variables

## Vars Utility

```ts
import { Vars } from '@toolbox-ts/css-normalize';

const vars = Vars.define({
  fontSize: "1rem",
  lineHeight: "1.5",
  lightBg: "#ffffff",
  lightFg: "#000000",
  ...
});

// string output
console.log(vars.toString());
// --font-size: 1rem;
// --line-height: 1.5;
// --light-color-bg: #ffffff;
// --light-color-fg: #000000;

// Object keyed by prop
console.log(vars.toPropKeyObj());
// {
//   "--font-size": "1rem;",
//   "--line-height": "1.5;",
//   "--light-color-bg": "#ffffff;",
//   "--light-color-fg": "#000000;"
// }

console.log(vars.toBlock({
  primary: {
    tag: "body",
    class: "theme-light",
  }
}));
// body.theme-light {
// --font-size: 1rem;
// --line-height: 1.5;
// --light-color-bg: #ffffff;
// --light-color-fg: #000000;
// }

console.log(vars.toBlockObj(selector));
// {
//   selector: "body.theme-light",
//   css: {
//     "--font-size": "1rem;",
//     "--line-height": "1.5;",
//     "--light-color-bg": "#ffffff;",
//     "--light-color-fg": "#000000;"
//   }
// }
```

### 🎨 Customizable

All these variables can be overridden in your own CSS to customize the theme.

<details><Summary>Table</Summary>

| Variable Name                   | Default Value                | Description / Usage                          |
| ------------------------------- | ---------------------------- | -------------------------------------------- |
| `--{light,dark}-color-bg`       | `#fcfaff,#0f0e11`            | Main background color                        |
| `--{light,dark}-color-fg`       | `#1f0044,#fcfaff`            | Main foreground/text color                   |
| `--{light,dark}-color-primary`  | `#5b21b6,#d8b4fe`            | Primary color for links, buttons             |
| `--{light,dark}-color-accent`   | `#4c1d95,#a78bfa`            | Accent color for hover, highlights           |
| `--{light,dark}-color-emphasis` | `#3c0d99,#f3e8ff`            | Emphasis color for focus, strong UI          |
| `--{light,dark}-color-muted`    | `#59597a,#c9b8d1`            | Muted/secondary text, visited links          |
| `--{light,dark}-border-color`   | `var(--root-color-emphasis)` | Border color                                 |
| `--{light,dark}-shadow-color`   | `var(--root-color-emphasis)` | Shadow color                                 |
| `--{light,dark}-outline-color`  | `var(--root-color-emphasis)` | Outline color                                |
| `--outline-width`               | `2px`                        | Outline width                                |
| `--border-radius`               | `0.5rem`                     | Border radius                                |
| `--border-width`                | `1px`                        | Border width                                 |
| `--outline-offset`              | `2px`                        | Outline offset                               |
| `--transition-duration`         | `0.3s`                       | Transition duration for interactive elements |
| `--elevation-base-y-offset`     | `1.5px`                      | Shadow Y offset base                         |
| `--elevation-base-blur`         | `3px`                        | Shadow blur base                             |
| `--bold`                        | `600`                        | Font weight for bold                         |
| `--bolder`                      | `700`                        | Font weight for bolder                       |
| `--font-size`                   | `20px`                       | Base font size                               |
| `--line-height`                 | `1.5`                        | Base line height                             |
| `--letter-spacing`              | `0.01em`                     | Base letter spacing                          |
| `--padding`                     | `0.5rem`                     | Base padding                                 |

</details>

---

### 🌐 Public

These are the base variables meant to be used directly in your CSS. They include
all variables from [`customizable`](#-customizable) (except for
`--elevation-base-y-offset` & `--elevation-base-blur` which are meant to provide
a base for calculating the public elevation levels). Use these variables
directly in your CSS for shadows, transitions, and font weights.

<Details><Summary>Table</Summary>

| Variable Name                      | Default Value / Computed From                                                                                                                                                                           | Description / Usage                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `--boldest`                        | `900`                                                                                                                                                                                                   | Strongest font weight               |
| `--elevation-low`                  | `0 var(--root-elevation-base-y-offset) var(--root-elevation-base-blur) var(--root-shadow-color)`                                                                                                        | Low elevation shadow                |
| `--elevation-medium`               | `0 calc(var(--root-elevation-base-y-offset) * 2) calc(var(--root-elevation-base-blur) * 2) var(--root-shadow-color)`                                                                                    | Medium elevation shadow             |
| `--elevation-high`                 | `0 calc(var(--root-elevation-base-y-offset) * 4) calc(var(--root-elevation-base-blur) * 4) var(--root-shadow-color)`                                                                                    | High elevation shadow               |
| `--interactive-element-transition` | `background-color var(--root-transition-duration) ease, color var(--root-transition-duration) ease, border-color var(--root-transition-duration) ease, box-shadow var(--root-transition-duration) ease` | Transition for interactive elements |

</Details>

---

### 🔒 Root

- These variables are **computed** from the theme tokens and are generally not
  intended to be overridden directly.
- For customization, I recommend overriding the theme variables (like
  `--light-color-bg`, `--dark-color-fg`, etc.).
- The values for color variables will automatically switch in dark mode via
  `[data-theme='dark']/@media query`.

<Details><Summary>Table</Summary>

| Variable Name                    | Default Value / Computed From                                                                                               | Description / Usage                                 |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `--root-font-family`             | `'atkinson-next', system-ui, ...`                                                                                           | Base font family for body text                      |
| `--root-font-family-mono`        | `'atkinson-mono', ui-monospace, ...`                                                                                        | Monospace font family                               |
| `--root-line-height`             | `var(--line-height, 1.5)`                                                                                                   | Computed line height                                |
| `--root-letter-spacing`          | `var(--letter-spacing, 0.01em)`                                                                                             | Computed letter spacing                             |
| `--root-font-size`               | `var(--font-size, 20px)`                                                                                                    | Computed font size                                  |
| `--root-padding`                 | `var(--padding, 0.5rem)`                                                                                                    | Computed base padding                               |
| `--root-transition-duration`     | `var(--transition-duration, 0.3s)`                                                                                          | Computed transition duration                        |
| `--root-color-bg`                | `var(--light-color-bg, #fcfaff)`<br>(dark: `var(--dark-color-bg, #0f0e11)`)                                                 | Main background color (auto-switches by theme)      |
| `--root-color-fg`                | `var(--light-color-fg, #1f0044)`<br>(dark: `var(--dark-color-fg, #fcfaff)`)                                                 | Main foreground/text color (auto-switches by theme) |
| `--root-color-primary`           | `var(--light-color-primary, #5b21b6)`<br>(dark: `var(--dark-color-primary, #d8b4fe)`)                                       | Primary color (links, buttons)                      |
| `--root-color-accent`            | `var(--light-color-accent, #4c1d95)`<br>(dark: `var(--dark-color-accent, #a78bfa)`)                                         | Accent color (hover, highlights, borders)           |
| `--root-color-emphasis`          | `var(--light-color-emphasis, #3c0d99)`<br>(dark: `var(--dark-color-emphasis, #f3e8ff)`)                                     | Emphasis color (focus, strong UI, borders)          |
| `--root-color-muted`             | `var(--light-color-muted, #59597a)`<br>(dark: `var(--dark-color-muted, #c9b8d1)`)                                           | Muted/secondary text, visited links                 |
| `--root-border-color`            | `var(--light-border-color, var(--root-color-emphasis))`<br>(dark: `var(--dark-border-color, var(--root-color-emphasis))`)   | Border color                                        |
| `--root-shadow-color`            | `var(--light-shadow-color, var(--root-color-emphasis))`<br>(dark: `var(--dark-shadow-color, var(--root-color-emphasis))`)   | Shadow color                                        |
| `--root-outline-color`           | `var(--light-outline-color, var(--root-color-emphasis))`<br>(dark: `var(--dark-outline-color, var(--root-color-emphasis))`) | Outline color                                       |
| `--root-outline-width`           | `var(--light-outline-width, 2px)`                                                                                           | Outline width                                       |
| `--root-outline-offset`          | `var(--outline-offset, 2px)`                                                                                                | Outline offset                                      |
| `--root-outline`                 | `var(--root-outline-width) solid var(--root-color-emphasis)`                                                                | Computed outline style                              |
| `--root-border-radius`           | `var(--border-radius, 0.5rem)`                                                                                              | Border radius                                       |
| `--root-border-width`            | `var(--border-width, 1px)`                                                                                                  | Border width                                        |
| `--root-border`                  | `var(--root-border-width) solid var(--root-color-emphasis)`                                                                 | Computed border style                               |
| `--root-bold`                    | `max(var(--bold, 600), 699)`                                                                                                | Computed bold font weight                           |
| `--root-bolder`                  | `max(var(--bolder, 700), 899)`                                                                                              | Computed bolder font weight                         |
| `--root-elevation-base-y-offset` | `var(--elevation-base-y-offset, 1.5px)`                                                                                     | Shadow Y offset base                                |
| `--root-elevation-base-blur`     | `var(--elevation-base-blur, 3px)`                                                                                           | Shadow blur base                                    |

</Details>

---

## Why Atkinson Hyperlegible?

[Atkinson Hyperlegible™](https://www.brailleinstitute.org/freefont/) is
designed beautifully including modern glyphs AND provides maximum legibility +
accessibility. It's an excellent default (and my personal all-time-favorite
font) for inclusive web projects. Both the Next (2025) and Mono variants are
included for broad typographic support.

---

## License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)

- @toolbox-ts
  - [NPM](https://www.npmjs.com/org/toolbox-ts)
  - [GitHub](https://github.com/toolbox-ts/toolbox-ts)
