const C = {
  string: "string",
  number: "number",
  bigint: "bigint",
  boolean: "boolean",
  symbol: "symbol",
  function: "function",
  undefined: "undefined",
  null: "null",
} as const;
type Type = keyof typeof C;
const isType = (
  p: unknown,
  { allowUndefined = false, allowNull = false } = {},
): p is Type =>
  typeof p === "string" &&
  p in C &&
  (allowUndefined || p !== C.undefined) &&
  (allowNull || p !== C.null);
type Value =
  | string
  | number
  | boolean
  | symbol
  | bigint
  | undefined
  | null
  | ((...args: unknown[]) => unknown);
const is = {
  type: isType,
  string: <V = string>(v: unknown): v is V => typeof v === "string",
  number: <V = number>(v: unknown): v is V => typeof v === "number",
  boolean: <V = boolean>(v: unknown): v is V => typeof v === "boolean",
  function: <V = (...args: any[]) => unknown>(v: unknown): v is V =>
    typeof v === "function",
  symbol: <V = symbol>(v: unknown): v is V => typeof v === "symbol",
  bigint: <V = bigint>(v: unknown): v is V => typeof v === "bigint",
  undefined: <V = undefined>(v: unknown): v is V => typeof v === "undefined",
  null: <V = null>(v: unknown): v is V => v === null,
};
export { type Type, type Value, C, is };
