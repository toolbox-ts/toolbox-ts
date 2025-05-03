/**
 * Takes a functional CSS color string (e.g., "rgb(255, 0, 0)") and splits it into it's values.
 * e.g., "rgb(255, 0, 0)" -\> ["255", "0", "0"]
 */
const splitCssColorString = (value: string): string[] =>
  value
    .slice(value.indexOf("(") + 1, value.indexOf(")"))
    .trim()
    .split(",")
    .map((v) => v.trim());

export { splitCssColorString };
