import { Manager as NodeManager } from "../_Manager/index.js";
import type { API as _API, NodeIterator, NodeYield } from "../types.js";

/** Type key for singly linked list nodes. */
export type TypeKey = "singly";
/** Pointer keys for singly linked list nodes. */
export type PointerKey = "next";

/**
 * Configuration object for creating a singly linked list manager.
 * Omits pointerKeys and type, which are set internally.
 *
 * @template AK - Anchor key string type (e.g., 'head', 'tail')
 * @template D - Data type stored in the node
 */
export type Config<AK extends string, D> = Omit<
  NodeManager.Config<TypeKey, PointerKey, AK, D>,
  "pointerKeys" | "type"
>;
/** Type alias for a node instance created by the manager. */
export type Type<AK extends string, D> = ReturnType<
  ReturnType<
    typeof NodeManager.create<TypeKey, PointerKey, AK, D>
  >["createNode"]
>;
/** Iterator type for traversing singly linked list nodes. */
export type Iterator<D> = NodeIterator<TypeKey, PointerKey, D>;
/** Yield type for singly linked list node iterators. */
export type IteratorYield<D> = NodeYield<TypeKey, PointerKey, D>;
/**
 * Creates a singly linked list node manager with anchor and pointer management.
 * Provides methods for node creation, pointer mutation, unlinking, and traversal.
 *
 * @template AK - Anchor key string type
 * @template D - Data type stored in the node
 * @param cfg - Configuration object for anchors and node creation
 * @returns An API for managing singly linked list nodes
 */
export const create = <AK extends string, D>(
  cfg: Config<AK, D>,
): _API<TypeKey, PointerKey, AK, D> => {
  const { anchors, createNode, pointerKeys, type, setPointer } =
    NodeManager.create<TypeKey, PointerKey, AK, D>({
      ...cfg,
      type: "singly",
      pointerKeys: ["next"],
    });
  const api: _API<TypeKey, PointerKey, AK, D> = {
    setPointer,
    create: createNode,
    get type() {
      return type;
    },
    get anchors() {
      return anchors;
    },
    get pointerKeys() {
      return pointerKeys;
    },
  } as const;
  return api;
};
export type API<AK extends string, D> = _API<TypeKey, PointerKey, AK, D>;
