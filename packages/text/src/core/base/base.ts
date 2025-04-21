const C = {
  space: " ",
  hyphen: "-",
  dot: ".",
  comma: ",",
  colon: ":",
  semicolon: ";",
  /** Matches variations of word separators */
  separatorRegex: /[\s,/+&\\?=_.<>{}:;'"*&$#~!@|\][`()^%-]+/g,
} as const;
interface CountedChar {
  char: string;
  count: number;
}

const capitalize = <S extends string>(str: S): Capitalize<S> =>
  (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<S>;

const cleanStringArray = (arr: unknown[]) =>
  arr
    .map((str) =>
      (typeof str === "string" && str.trim().length > 0 ? str : "").trim(),
    )
    .filter((str) => str.length > 0);

/** Coerces input to proper slug format */
const slugify = (str: string) =>
  typeof str === "string"
    ? str
        .trim()
        .replace(/^\d+/, (match) => `n${match}`)
        .replace(C.separatorRegex, "-")
        .replace(/-+$/g, "")
        .toLowerCase()
    : "";

interface CaseVariants {
  /** kebab-case-strings-look-like-this */
  kebab: string;
  /** PascalCaseStringsLookLikeThis */
  pascal: string;
  /** Title Case Strings Look Like This */
  title: string;
}

const toVariants = (str: string): CaseVariants => {
  if (typeof str !== "string") return { title: "", kebab: "", pascal: "" };
  const normalized = slugify(
    str
      // camelCase -> camel Case
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      // PASCALCase -> PASCAL Case | PascalCase -> Pascal Case
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2"),
  );
  const words = cleanStringArray(normalized.split(/-/g));
  return {
    kebab: normalized,
    pascal: words.map(capitalize).join(""),
    title: words.map((word) => capitalize(word)).join(" "),
  };
};
const is = {
  char: (str: unknown): str is string =>
    typeof str === "string" && str.length === 1,
  countedChar: (str: unknown): str is CountedChar =>
    typeof str === "object" &&
    str !== null &&
    typeof (str as CountedChar).char === "string" &&
    typeof (str as CountedChar).count === "number",
  slug: (str: unknown): str is string =>
    typeof str === "string" &&
    str.length > 0 &&
    /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str),
} as const;

export { toVariants, capitalize, cleanStringArray, is, slugify, C };
export type { CountedChar, CaseVariants };
