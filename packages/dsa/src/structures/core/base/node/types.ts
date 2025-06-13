/**
 * Tuple type for anchor or pointer keys.
 * The first element is required, followed by zero or more of the same type.
 */
export type Keys<K> = readonly [K, ...K[]];

/**
 * Core node data structure containing an identifier and generic data payload.
 * This is the foundational shape for all node types in the data structure library.
 *
 * @template D - The type of data stored in the node.
 */
export interface Detail<D = unknown> {
  /** Unique identifier for the node. */
  id: string;
  /** Generic data payload stored in the node. */
  data: D;
}

/**
 * Base node interface defining core properties and methods.
 * All node types (singly, doubly, etc.) extend this interface.
 *
 * @template TK - Node type key (e.g., 'singly', 'doubly')
 * @template D - The type of data stored in the node.
 */
export interface Base<TK extends string, D> {
  /** Immutable type identifier for the node (e.g., 'singly', 'doubly'). */
  readonly type: TK;
  /** Gets the unique identifier of the node. */
  get id(): string;
  /** Gets the current data value. */
  get data(): D;
  /** Updates the data value. */
  set data(data: D);
  /** Gets a snapshot of the node's core details (id and data). */
  get detail(): Detail<D>;
  /** Destroys the node instance, releasing any resources or references. */
  destroy: () => void;
}

/**
 * Extends a base node type with dynamically assigned pointer properties.
 * Each pointer key is mapped to a read-only property referencing another node or undefined.
 * This enforces immutability for consumers; only the node manager can mutate pointers.
 *
 * @template TK - Node type key (e.g., 'singly', 'doubly')
 * @template PK - Union of pointer key names (e.g., 'next', 'prev')
 * @template D - Data type stored in the node
 *
 * @example
 * // Consumer receives only WithPointers, so cannot mutate pointers directly:
 * type Node = WithPointers<'singly', 'next', string>;
 * node.next = otherNode; // ❌ Error: 'next' is readonly
 *
 * // Internally, the manager can override immutability for mutation:
 * function setNext(node: WithPointers<'singly', 'next', string>, next: Node | undefined) {
 *   (node as Mutator<'singly', 'next', string>).next = next;
 * }
 */
export type WithPointers<TK extends string, PK extends string, D> = Base<
  TK,
  D
> & {
  /** Each pointer key maps to another node or undefined (read-only). */
  readonly [K in PK]: WithPointers<TK, PK, D> | undefined;
} & { unlink: () => void };

/**
 * Maps anchor or pointer keys to node references or undefined.
 *
 * @template TK - Node type key
 * @template PK - Pointer key(s)
 * @template KT - Anchor key(s)
 * @template D - Data type stored in the node
 */
export type PointerMap<
  TK extends string,
  PK extends string,
  KT extends string,
  D,
> = Record<Keys<KT>[number], WithPointers<TK, PK, D> | undefined>;

/**
 * Function type for setting pointer properties on a node.
 *
 * @template TK - Node type key
 * @template PK - Pointer key(s)
 * @template D - Data type stored in the node
 */
export type PointerSetter<TK extends string, PK extends string, D> = (
  node: WithPointers<TK, PK, D>,
  map: { [K in PK]?: WithPointers<TK, PK, D> },
) => void;

/**
 * Represents a yielded value when iterating over nodes in a structure.
 * Contains the node instance and its index in the traversal.
 *
 * @template NT - Node type key (e.g., 'singly', 'doubly')
 * @template PK - Pointer key(s) used in the node (e.g., 'next', 'prev')
 * @template D - Data type stored in the node
 */
export interface NodeYield<NT extends string, PK extends string, D> {
  /** The node instance at the current position in the iteration. */
  node: WithPointers<NT, PK, D>;
  /** The zero-based index of the node in the traversal. */
  index: number;
}

/**
 * Iterator over nodes, yielding NodeYield objects.
 *
 * @template NT - Node type key
 * @template PK - Pointer key(s)
 * @template D - Data type stored in the node
 */
export type NodeIterator<
  NT extends string,
  PK extends string,
  D,
> = IterableIterator<NodeYield<NT, PK, D>>;

/**
 * Yielded value when iterating over node details in a structure.
 *
 * @template D - Data type stored in the node
 */
export interface DetailYield<D> {
  /** The node's detail (id and data). */
  detail: Detail<D>;
  /** The zero-based index of the node in the traversal. */
  index: number;
}

/**
 * Iterator over node details, yielding DetailYield objects.
 *
 * @template D - Data type stored in the node
 */
export type DetailIterator<D> = IterableIterator<DetailYield<D>>;

/**
 * Anchor manager interface for managing node anchors in a structure.
 * Provides methods for setting, getting, and resetting anchor nodes,
 * as well as checking anchor membership.
 *
 * @template AK - Anchor key string type
 * @template TK - Node type key (e.g., 'singly', 'doubly')
 * @template PK - Pointer key(s) (e.g., 'next', 'prev')
 * @template D - Data type stored in the node
 */
export interface AnchorManager<
  TK extends string,
  PK extends string,
  AK extends string,
  D,
> {
  /** All anchor keys managed by this instance. */
  readonly keys: Keys<AK>;
  /**
   * Set the node for a given anchor key.
   * @param key - The anchor key to set
   * @param node - The node to assign, or undefined to clear
   */
  set: (
    key: Keys<AK>[number],
    node: WithPointers<TK, PK, D> | undefined,
  ) => void;
  /**
   * Get the node for a given anchor key.
   * @param key - The anchor key to retrieve
   * @returns The node assigned to the anchor, or undefined
   */
  get: (key: Keys<AK>[number]) => WithPointers<TK, PK, D> | undefined;
  /**
   * Reset all anchors to undefined.
   */
  reset: () => void;
  /**
   * Check if a node is currently assigned to a given anchor key.
   * @param key - The anchor key to check
   * @param node - The node to compare
   * @returns True if the node is the anchor for the key, false otherwise
   */
  isAnchor: (key: Keys<AK>[number], node?: WithPointers<TK, PK, D>) => boolean;
  /** The current primary anchor node (e.g., head). */
  get primary(): WithPointers<TK, PK, D> | undefined;
  /** Sets the primary anchor key (e.g., 'head'). */
  set primaryKey(key: AK);
  /** Gets the current primary anchor key. */
  get primaryKey(): AK;
}

/**
 * Node manager API for a given node type, pointer keys, and anchor keys.
 *
 * @template TK - Node type key
 * @template PK - Pointer key(s)
 * @template AK - Anchor key(s)
 * @template D - Data type stored in the node
 */
export interface API<
  TK extends string,
  PK extends string,
  AK extends string,
  D,
> {
  /** The node type identifier. */
  readonly type: TK;
  /** Anchor manager for this structure. */
  readonly anchors: AnchorManager<TK, PK, AK, D>;
  /** List of pointer keys for this structure. */
  readonly pointerKeys: Keys<PK>;
  /** Creates a new node instance. */
  create: (detail: Detail<D>) => WithPointers<TK, PK, D>;
  /** Sets pointers on a node, mutating its internal state. */
  setPointer: PointerSetter<TK, PK, D>;
}
