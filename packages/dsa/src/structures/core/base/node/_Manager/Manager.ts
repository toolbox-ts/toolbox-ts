import type {
  WithPointers,
  AnchorManager,
  Keys,
  Detail,
  PointerSetter,
} from "../types.js";
import { Anchors } from "./anchors/index.js";
import { Base } from "./base/index.js";
import { Pointers } from "./pointers/index.js";

/**
 * Configuration object for creating a node structure module.
 * Combines anchor and pointer configuration, plus type and primary anchor key.
 *
 * @template TK - Node type key (e.g., 'singly', 'doubly')
 * @template AK - Anchor key string type (e.g., 'head', 'tail')
 * @template PK - Pointer key string type (e.g., 'next', 'prev')
 * @template D - Data type stored in the node
 */
export type Config<
  TK extends string,
  PK extends string,
  AK extends string,
  D,
> = Omit<Anchors.Config<AK>, "primary"> &
  Omit<Pointers.Config<TK, PK, D>, "base"> & {
    /** The node type identifier */
    type: TK;
    /** Optional primary anchor key (defaults to first in anchorKeys) */
    primaryAnchorKey?: AK;
  };

/**
 * Module interface for a node structure.
 * Provides anchor management, pointer key info, type, and node creation.
 *
 * @template TK - Node type key
 * @template AK - Anchor key string type
 * @template PK - Pointer key string type
 * @template D - Data type stored in the node
 */
export interface Module<
  TK extends string,
  PK extends string,
  AK extends string,
  D,
> {
  /** Anchor manager for this structure */
  readonly anchors: AnchorManager<TK, PK, AK, D>;
  /** List of pointer keys for this structure */
  readonly pointerKeys: Keys<PK>;
  /** The node type identifier */
  readonly type: TK;
  /**
   * Creates a new node with the given detail and pointer properties.
   * @param detail - Object containing node id and data
   * @returns An immutable node instance with pointer properties
   */
  createNode: (detail: Detail<D>) => WithPointers<TK, PK, D>;
  /** Sets pointer properties on a node */
  setPointer: PointerSetter<TK, PK, D>;
}

/**
 * Creates a node structure module with anchor and pointer management.
 * Returns an object with anchor manager, pointer key info,
 * type, and node factory.
 *
 * @template TK - Node type key
 * @template AK - Anchor key string type
 * @template PK - Pointer key string type
 * @template D - Data type stored in the node
 * @param config - Configuration object for anchors, pointers, and type
 * @returns A module for managing nodes of the specified type
 */
export const create = <
  TK extends string,
  PK extends string,
  AK extends string,
  D,
>({
  primaryAnchorKey,
  anchorKeys,
  pointerKeys,
  type,
}: Config<TK, PK, AK, D>): Module<TK, PK, AK, D> => {
  // Create anchor manager with provided keys and optional primary
  const anchors = Anchors.create<AK, TK, PK, D>({
    anchorKeys,
    primary: primaryAnchorKey,
  });
  // Copy pointer keys as a tuple
  const pks = [...pointerKeys] as Keys<PK>;
  // Node factory: creates a base node and augments it with pointer properties
  const createNode = ({ data, id }: Detail<D>) =>
    Pointers.assign<TK, PK, D>({
      base: Base.create<TK, D>({ data, id, type }),
      pointerKeys: pks,
    });

  const setPointer: PointerSetter<TK, PK, D> = (node, map) => {
    for (const key in map) (node as Record<PK, unknown>)[key] = map[key];
  };

  return { type, anchors, pointerKeys: pks, createNode, setPointer };
};
