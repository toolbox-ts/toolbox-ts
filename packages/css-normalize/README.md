# @toolbox-ts/css-normalize

---

A modern, and slightly opinionated standards-based CSS normalization layer for
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
- 🛠️ **Customizable via CSS Variables:** Easily override font families, sizes,
  and line heights to fit your project’s needs.
- 🌐 **Modern Browser Support:** Including Chrome, Edge, Firefox, Safari, and
  other Chromium-based providers.
- 🔧 **Preprocessor Support:** [PostCSS](https://postcss.org/),
  [SCSS](https://sass-lang.com/), [Less](https://lesscss.org/),
  [Stylus](https://www.startpage.com/sp/search), and as a string template for
  maximum flexibility in your build pipeline.
- 🚀 **Developer Experience Enhancements**:
  - **Built-in Flex Layout:** Uses a flexible layout, making it effortless to
    create a full page site
  - **Baseline CSS variables:** under the `--root` namespace for bg and txt
    color, spacing, and any toolchain.
  - **First-Class Module Support:** Clean exports for direct import in modern
    bundlers, with CDN and npm options.
  - **Automatic prefers light/dark queries:** only changing the bg and txt
    colors using the `--root-color-bg` and `--root-color-txt` variables.

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
@import "@toolbox-ts/css-normalize";
```

### Direct Script Import

Or, if using a bundler (like [Vite](https://vitest.dev/) or
[Webpack](https://webpack.js.org/)):

```ts
import "@toolbox-ts/css-normalize";
```

Or, If you use a CSS-in-JS library (like
[styled-components](https://styled-components.com/),
[emotion](https://emotion.sh/docs/introduction) or
[vanilla-extract](https://vanilla-extract.style/)), and are not in an
environment that supports directly importing CSS, you can import the
normalization CSS as a string and inject it directly into your component:

```ts
import normalizeCss from "@toolbox-ts/css-normalize/string";
```

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

## Customization

Override CSS variables in your own stylesheet to adjust the base font, size, or
line height:

```css
:root {
  --root-font-family-base: Roboto, system-ui, sans-serif;
  --root-font-size: 18px;
  --root-line-height: 1.6;
}

// Default light/dark themes
@media (prefers-color-scheme: light) {
  :root {
    --root-color-bg: #fff;
    --root-color-txt: #111;
  }
  body {
    background-color: var(--root-color-bg);
    color: var(--root-color-txt);
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --root-color-bg: #111;
    --root-color-txt: #fff;
  }
  body {
    background-color: var(--root-color-bg);
    color: var(--root-color-txt);
  }
}
```

---

## Why Atkinson Hyperlegible?

[Atkinson Hyperlegible™](https://www.brailleinstitute.org/freefont/) is
designed beautifully including modern glyphs AND provides maximum legibility +
accessibility. It's an excellent default (and my personal all-time-favorite
font) for inclusive web projects. Both the Next (2025) and Mono variants are
included for broad typographic support.

---

## License

MIT – © 2025 Nolan Gajdascz [@toolbox-ts](https://www.npmjs.com/org/toolbox-ts)
