#!/usr/bin/env node
import fs from "fs";
import path from "path";

const __dirname = import.meta.dirname;
const srcPath = path.join(__dirname, "../src");
const cssPath = path.join(__dirname, "../src/normalize.css");

const css = fs.readFileSync(cssPath, "utf-8").replace(/`/g, "\\`");

fs.writeFileSync(`${srcPath}/string.js`, `export default \`${css}\``);

["scss", "pcss", "less", "styl"].forEach((ext) => {
  fs.writeFileSync(`${srcPath}/normalize.${ext}`, css);
});
