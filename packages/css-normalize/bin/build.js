#!/usr/bin/env node
import fs from "fs";
import path from "path";

const __dirname = import.meta.dirname;
const srcPath = path.join(__dirname, "../src");
const cssPath = path.join(__dirname, "../src/normalize.css");
const buildPath = path.join(__dirname, "../build");
fs.mkdirSync(buildPath, { recursive: true });

const css = fs.readFileSync(cssPath, "utf-8").replace(/`/g, "\\`");

fs.writeFileSync(`${buildPath}/string.js`, `export default \`${css}\``);

fs.cpSync(srcPath, buildPath, { recursive: true });

["scss", "pcss", "less", "styl"].forEach((ext) => {
  fs.writeFileSync(`${buildPath}/normalize.${ext}`, css);
});

// Generate .d.ts files for each export
const typeDefs = [
  { file: "string.d.ts", name: "normalize", exportName: "normalize" },
  {
    file: "normalize.css.d.ts",
    name: "normalizeCss",
    exportName: "normalizeCss",
  },
  {
    file: "normalize.scss.d.ts",
    name: "normalizeScss",
    exportName: "normalizeScss",
  },
  {
    file: "normalize.pcss.d.ts",
    name: "normalizePcss",
    exportName: "normalizePcss",
  },
  {
    file: "normalize.less.d.ts",
    name: "normalizeLess",
    exportName: "normalizeLess",
  },
  {
    file: "normalize.styl.d.ts",
    name: "normalizeStyl",
    exportName: "normalizeStyl",
  },
];

typeDefs.forEach(({ file, exportName }) => {
  fs.writeFileSync(
    path.join(buildPath, file),
    `declare const ${exportName}: string;\nexport default ${exportName};\n`,
  );
});
