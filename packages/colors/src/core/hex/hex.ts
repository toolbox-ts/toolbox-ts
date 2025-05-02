import { Num } from "@toolbox-ts/utils";

type Color = `#${string}`;

/** Base 16 radix for converting to/from hex strings */
const validateChars = (value: string): boolean => /^[0-9a-fA-F]+$/.test(value);
const validateLength = (value: string) => validLengths.includes(value.length);

const radix = 16;
const validLengths = [3, 4, 6, 8];
const transparent = "#00000000" as const;
const stripPrefix = (value: string): string => value.replace(/^#|^0x/i, "");

const is = (value: unknown): value is Color => {
  if (typeof value !== "string") return false;
  if (!value.startsWith("#")) return false;
  const raw = stripPrefix(value);
  return validateLength(raw) && validateChars(raw);
};

/**
 * Normalizes input hex and returns unprefixed string
 * - If input is not valid it returns (00000000)
 */
const normalize = (input: unknown): Color => {
  if (is(input)) {
    const raw = stripPrefix(input);
    switch (raw.length) {
      case 3:
        return `#${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}ff`;
      case 4:
        return `#${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`;
      case 6:
        return `#${raw}ff`;
      case 8:
        return `#${raw}`;
    }
  }
  return transparent;
};

const toInt = (value: Color): number => parseInt(stripPrefix(value), radix);

/** A byte refers to 2 hex digits (8 bits). */
const byte = {
  max: { int: 0xff, str: "ff" },
  min: { int: 0x00, str: "00" },
  is: (value: unknown): value is number =>
    typeof value === "number" && value >= byte.min.int && value <= byte.max.int,
  clamp: (value: number): number =>
    Num.clamp(value, { min: byte.min.int, max: byte.max.int }),
  toHex: (value: number): string => {
    if (byte.is(value)) return value.toString(radix).padStart(2, "0");
    return value < byte.min.int ? byte.min.str : byte.max.str;
  },
  parse: (value: string): number => {
    const raw = stripPrefix(value);
    if (!validateChars(raw)) return byte.min.int;
    if (raw.length > 2) return byte.max.int;
    return byte.clamp(parseInt(raw, radix));
  },
};

export {
  normalize,
  radix,
  transparent,
  stripPrefix,
  is,
  toInt,
  type Color,
  byte,
};
