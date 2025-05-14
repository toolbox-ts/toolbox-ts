type NestedPartial<T> = T extends object
  ? { [P in keyof T]?: NestedPartial<T[P]> }
  : T;

type CustomPropertyForToken<
  P extends string | undefined,
  K extends string,
> = P extends undefined ? `--${CamelToKebab<K>}` : `--${P}-${CamelToKebab<K>}`;

type VarReferenceForToken<
  P extends string | undefined,
  K extends string,
> = P extends undefined
  ? `var(--${CamelToKebab<K>})`
  : `var(--${P}-${CamelToKebab<K>})`;

type CamelToKebab<S extends string> = S extends `${infer First}${infer Rest}`
  ? First extends Lowercase<First>
    ? `${First}${CamelToKebab<Rest>}`
    : `-${Lowercase<First>}${CamelToKebab<Rest>}`
  : S;

interface Token<
  Prefix extends string | undefined,
  Key extends string,
  D = string,
> {
  prop: CustomPropertyForToken<Prefix, Key>;
  var: VarReferenceForToken<Prefix, Key>;
  value: D;
}
interface TokenMapCfg<
  P extends string | undefined,
  V extends Record<string, string>,
> {
  prefix: P;
  valueMap: V;
}
type TokenMap<
  P extends string | undefined,
  V extends Record<string, string>,
> = { [K in keyof V]: Token<P, K & string, V[K]> };

interface KeyTypes<K extends readonly string[], T = string> {
  key: K[number];
  keyMap: { [Y in K[number]]: T };
}

type ExtractTokenType<
  T extends "prop" | "var" | "value",
  V extends Record<string, { var: string; prop: string; value: string }>,
> = { [K in keyof V]: V[K][T] };

type FontFaceStyle =
  | "normal"
  | "italic"
  | "oblique"
  | `oblique ${number}deg`
  | `oblique ${number}deg ${number}deg`;

interface FontFaceSrc {
  link: string;
  format: string;
  linkType?: "url" | "local";
}
interface FontFace {
  src: FontFaceSrc;
  fontFamily: string;
  fontWeight?: string;
  fontStyle?: FontFaceStyle;
  fontDisplay?: "swap" | "auto" | "block" | "fallback" | "optional";
  other?: string;
}
export type {
  FontFace,
  FontFaceSrc,
  FontFaceStyle,
  ExtractTokenType,
  TokenMapCfg,
  Token,
  TokenMap,
  KeyTypes,
  VarReferenceForToken,
  CustomPropertyForToken,
  NestedPartial,
  CamelToKebab,
};
