import { type InputVars, cssProps } from "../types.js";

const isKeyOf = <T extends object>(
  key: string,
  obj: T,
): key is keyof T & string => key in obj;

export const define = (
  input: InputVars,
  selector = "",
  normalizeStr = "",
): string => {
  let result = "";

  const walk = (valueNode: unknown, propsNode: unknown) => {
    if (!valueNode || typeof valueNode !== "object") return;

    for (const key in valueNode) {
      if (!isKeyOf(key, valueNode) || !isKeyOf(key, propsNode as object))
        continue;

      const value = valueNode[key];
      const prop = propsNode?.[key];

      if (typeof value === "object" && typeof prop === "object")
        walk(value, prop);
      else if (typeof value === "string" && typeof prop === "string")
        result += `  ${prop}: ${value};\n`;
    }
  };

  for (const topKey in input) {
    if (!isKeyOf(topKey, cssProps)) continue;
    const value = input[topKey];
    const propMap = cssProps[topKey];
    walk(value, propMap);
  }
  let block = result.trim();
  block = selector ? `${selector} {\n${block}\n}` : block;
  return normalizeStr ? `${normalizeStr}\n${block}` : block;
};
