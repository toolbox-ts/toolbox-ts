import type { WithPointers, Base, Keys, PointerMap } from "../../types.js";

const POINTER: unique symbol = Symbol("pointer");

/**
 * Configuration object for assigning pointer properties to a base node.
 *
 * @template TK - Node type key (e.g., 'singly', 'doubly')
 * @template PK - Pointer key string type (e.g., 'next', 'prev')
 * @template D - Data type stored in the node
 */
export interface Config<TK extends string, PK extends string, D> {
  /** The base node to augment with pointer properties */
  base: Base<TK, D>;
  /** Non-empty tuple of pointer property names to add as pointers */
  readonly pointerKeys: Keys<PK>;
}

/**
 * Augments a base node with dynamically created pointer properties.
 * Uses Object.defineProperties to create getter/setter pairs for each pointer key.
 * This allows for controlled access to pointer references while maintaining type safety.
 *
 * @template TK - Node type key (e.g., 'singly', 'doubly')
 * @template PK - Pointer key string type (e.g., 'next', 'prev')
 * @template D - Data type stored in the node
 * @param config - Configuration object with base node and pointer keys
 * @returns A new node instance with the specified pointer properties
 *
 * @example
 * ```typescript
 * const baseNode = createBase('singly', { id: '1', data: 'test' });
 * const nodeWithPointers = assignPointers(baseNode, ['next']);
 * // Assign pointers using manager-based set methods over direct assignment
 * ```
 */
export const assign = <TK extends string, PK extends string, D>({
  base,
  pointerKeys,
}: Config<TK, PK, D>): WithPointers<TK, PK, D> => {
  if (pointerKeys.length === 0)
    throw new Error("Pointer keys must provide at least one key");

  const store = {
    [POINTER]: pointerKeys.reduce(
      (acc, key) => {
        acc[key] = undefined;
        return acc;
      },
      {} as PointerMap<TK, PK, PK, D>,
    ),
    unlink: () => {
      for (const key of pointerKeys) store[POINTER][key] = undefined;
    },
  } as const;

  /** A new node instance with pointer properties. */
  const withPointers = Object.defineProperties(
    base,
    pointerKeys.reduce((acc, key) => {
      acc[key] = {
        get: () => store[POINTER][key],
        set: (next?: WithPointers<TK, PK, D>) => (store[POINTER][key] = next),
        enumerable: true,
      };
      return acc;
    }, {} as PropertyDescriptorMap),
  ) as WithPointers<TK, PK, D>;

  withPointers.unlink = store.unlink;
  const baseDestroy = base.destroy;
  withPointers.destroy = () => {
    baseDestroy();
    store.unlink();
  };

  return withPointers;
};
