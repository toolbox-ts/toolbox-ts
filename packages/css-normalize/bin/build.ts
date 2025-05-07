#!/usr/bin/env node
import fs from "fs";
import path from "path";

const __dirname = import.meta.dirname;
const sourceStaticPath = path.join(__dirname, "../src/static");
const cssPath = path.join(__dirname, "../src/static/normalize.css");
const buildPath = path.join(__dirname, "../build/static");
fs.mkdirSync(buildPath, { recursive: true });

const css = fs.readFileSync(cssPath, "utf-8").replace(/`/g, "\\`");

fs.writeFileSync(`${buildPath}/string.js`, `export default \`${css}\``);

fs.cpSync(sourceStaticPath, buildPath, { recursive: true });

["scss", "pcss", "less", "styl"].forEach((ext) => {
  fs.writeFileSync(`${buildPath}/normalize.${ext}`, css);
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
