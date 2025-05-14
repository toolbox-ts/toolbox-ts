import type {
  CamelToKebab,
  Token,
  ExtractTokenType,
  FontFace,
} from "../types.js";
import { transform } from "lightningcss";

/**
 * Mock CSS template literal tag to trigger styled-components vscode plugin
 * syntax highlighting and autocompletion.
 */
const css = (strings: TemplateStringsArray) => strings.raw.join("");

const isKeyOf = <T extends object>(
  key: string,
  obj: T,
): key is keyof T & string => key in obj;

const camelToKebab = <S extends string>(str: string): CamelToKebab<S> =>
  str
    .split(/(?=[A-Z0-9])/g)
    .join("-")
    .toLowerCase() as CamelToKebab<S>;

/** Extracts a map of just the `.var` or `.prop` values from a TokenMap */
function extractTokenMap<
  Field extends "var" | "prop" | "value",
  T extends Record<string, Token<string, string>>,
>(map: T, field: Field): ExtractTokenType<Field, T> {
  const result = {} as { [K in keyof T]: T[K][Field] };
  for (const key in map) result[key] = map[key]![field];
  return result;
}

const writeFontFace = ({
  src: { link, format, linkType = "url" },
  fontFamily,
  fontDisplay = "auto",
  fontStyle = "normal",
  fontWeight = "400",
  other = "",
}: FontFace): string => `@font-face {
src: ${linkType}('${link}') format('${format}');
font-family: '${fontFamily}';
font-weight: ${fontWeight};
font-style: ${fontStyle};
font-display: ${fontDisplay};
${other ? `  ${other}\n` : ""}}
`;

const writeCssVars = (vars: Record<string, string>) =>
  Object.entries(vars).reduce(
    (acc, [key, value]) => (acc += `--${key}: ${value};`),
    "",
  );

const compileCSS = (css: string) =>
  transform({ filename: "normalize", code: Buffer.from(css), minify: true });

export {
  isKeyOf,
  camelToKebab,
  extractTokenMap,
  writeFontFace,
  writeCssVars,
  compileCSS,
  css,
};
