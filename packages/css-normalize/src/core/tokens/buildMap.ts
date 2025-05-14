import type {
  CustomPropertyForToken,
  VarReferenceForToken,
  CamelToKebab,
  TokenMap,
  TokenMapCfg,
} from "../types.js";
import { camelToKebab } from "../utils/utils.js";

const keyToProp = <
  P extends string | undefined,
  K extends CamelToKebab<string>,
>(
  key: K,
  prefix: P,
): CustomPropertyForToken<P, K> =>
  (!prefix ? `--${key}` : `--${prefix}-${key}`) as CustomPropertyForToken<P, K>;

const keyToVar = <P extends string | undefined, K extends CamelToKebab<string>>(
  key: K,
  prefix: P,
): VarReferenceForToken<P, K> =>
  (!prefix
    ? `var(--${key})`
    : `var(--${prefix}-${key})`) as VarReferenceForToken<P, K>;

/**
 * Builds a strongly-typed TokenMap from a value map and an optional prefix.
 */
function buildTokenMap<
  P extends string | undefined,
  V extends Record<string, string>,
>({ valueMap, prefix }: TokenMapCfg<P, V>): TokenMap<P, V> {
  const map = {} as TokenMap<P, V>;
  (Object.keys(valueMap) as (keyof V)[]).forEach((key) => {
    const kebabKey = camelToKebab(key as string);
    map[key] = {
      prop: keyToProp(kebabKey, prefix),
      var: keyToVar(kebabKey, prefix),
      value: valueMap[key],
    };
  });
  return map;
}

export { buildTokenMap, keyToProp, keyToVar };
