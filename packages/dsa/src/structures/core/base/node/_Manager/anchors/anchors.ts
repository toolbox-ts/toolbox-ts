import type { AnchorManager, PointerMap } from "../../types.js";

/**
 * Returns an error message for an unset anchor key.
 * @param key - The anchor key that is not set
 * @returns Error message string
 */
export type SetAnchorFn = (key: string) => string;

/**
 * Tuple type representing a non-empty list of anchor keys.
 * @template AK - Anchor key string type
 */
export type Keys<AK extends string> = readonly [AK, ...AK[]];

/**
 * Configuration for creating an anchor manager.
 * @template AK - Anchor key string type
 */
export interface Config<AK extends string> {
  /** Optional primary anchor key (defaults to the first in anchorKeys) */
  readonly primary?: AK;
  /** Non-empty tuple of anchor keys to manage */
  readonly anchorKeys: Keys<AK>;
}

const anchorNotSet: SetAnchorFn = (key) => `Anchor "${key}" is not set`;

/**
 * Creates an anchor manager for a set of anchor keys.
 * Manages assignment and retrieval of anchor nodes, enforces valid keys,
 * and tracks a primary anchor.
 *
 * @template AK - Anchor key string type
 * @template TK - Node type key (e.g., 'singly', 'doubly')
 * @template PK - Pointer key(s) (e.g., 'next', 'prev')
 * @template D - Data type stored in the node
 * @param config - Configuration object with anchor keys and optional primary
 * @returns An anchor manager instance
 *
 * @throws If anchorKeys is empty or primary is not in anchorKeys
 */
export const create = <
  AK extends string,
  TK extends string,
  PK extends string,
  D,
>({
  primary,
  anchorKeys,
}: Config<AK>): AnchorManager<TK, PK, AK, D> => {
  if (anchorKeys.length === 0)
    throw new Error(
      "At least one anchor key must be provided and cannot be empty",
    );
  if (primary && !anchorKeys.includes(primary))
    throw new Error(
      `Primary anchor key "${primary}" must be one of the provided anchor keys: ${anchorKeys.join(", ")}`,
    );
  const keys = [...anchorKeys] as Keys<AK>;
  let pk: AK = primary ?? keys[0];

  // Internal anchor mapping
  const anchors = anchorKeys.reduce(
    (acc, key) => {
      acc[key] = undefined;
      return acc;
    },
    {} as PointerMap<TK, PK, AK, D>,
  );
  return {
    get keys() {
      return keys;
    },
    set primaryKey(key: AK) {
      if (!keys.includes(key))
        throw new Error(
          `Primary anchor key "${key}" must be one of the provided anchor keys: ${keys.join(", ")}`,
        );
      pk = key;
    },
    get primaryKey() {
      return pk;
    },
    set: (key, node) => {
      if (!(key in anchors)) throw new Error(anchorNotSet(key));
      anchors[key] = node;
    },
    get: (key) => {
      if (!(key in anchors)) throw new Error(anchorNotSet(key));
      return anchors[key];
    },
    reset: () => {
      for (const key of keys) anchors[key] = undefined;
    },
    isAnchor: (key, node) => !!node && anchors[key]?.id === node.id,
    get primary() {
      return anchors[pk];
    },
  };
};
