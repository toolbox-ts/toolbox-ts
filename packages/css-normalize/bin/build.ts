#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { generate } from "../build/index.js";

const __dirname = import.meta.dirname;
const buildStaticPath = path.join(__dirname, "../build/static");
fs.mkdirSync(buildStaticPath, { recursive: true });
fs.writeFileSync(
  path.join(buildStaticPath, "normalize.d.ts"),
  `declare const normalize: string;\nexport default normalize;\n`,
);
const { code, warnings } = generate();
fs.writeFileSync(
  path.join(buildStaticPath, "normalize.js"),
  `export default \`${code.toString()}\`;`,
);
["css", "scss", "pcss", "less", "styl"].forEach((ext) => {
  if (warnings.length) console.warn("[⚡]:", warnings);
  const filePath = path.join(buildStaticPath, `normalize.${ext}`);
  fs.writeFileSync(filePath, code);
});
