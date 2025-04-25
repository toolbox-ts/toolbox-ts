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
