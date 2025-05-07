#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { transform } from "lightningcss";

const __dirname = import.meta.dirname;
const sourceCssPath = path.join(__dirname, "../src/static/normalize.css");
const buildStaticPath = path.join(__dirname, "../build/static");
fs.mkdirSync(buildStaticPath, { recursive: true });
const css = fs.readFileSync(sourceCssPath, "utf-8").replace(/`/g, "\\`");
const compiledCss = transform({
  filename: "normalize.css",
  code: Buffer.from(css),
  minify: true,
}).code.toString();

fs.writeFileSync(path.join(buildStaticPath, "normalize.css"), compiledCss);
fs.writeFileSync(
  `${buildStaticPath}/string.js`,
  `export default \`${compiledCss}\``,
);

["scss", "pcss", "less", "styl"].forEach((ext) => {
  fs.writeFileSync(`${buildStaticPath}/normalize.${ext}`, compiledCss);
});
fs.appendFileSync(
  path.join(__dirname, "../build/index.js"),
  '\nexport { default as normalizeString } from "./static/string.js";\n',
);

// Generate .d.ts files for each export
const typeDefs = [
  { file: "string.d.ts", name: "normalizeString" },
  { file: "normalize.css.d.ts", name: "normalizeCss" },
  { file: "normalize.scss.d.ts", name: "normalizeScss" },
  { file: "normalize.pcss.d.ts", name: "normalizePcss" },
  { file: "normalize.less.d.ts", name: "normalizeLess" },
  { file: "normalize.styl.d.ts", name: "normalizeStyl" },
];
const staticTypesPath = path.join(__dirname, "../build/types/static");
fs.appendFileSync(
  path.join(__dirname, "../build/types/index.d.ts"),
  "\nexport { default as normalizeString } from './static/string.js';",
);
fs.mkdirSync(staticTypesPath, { recursive: true });
typeDefs.forEach(({ file, name }) => {
  fs.writeFileSync(
    path.join(staticTypesPath, file),
    `declare const ${name}: string;\nexport default ${name};\n`,
  );
});
