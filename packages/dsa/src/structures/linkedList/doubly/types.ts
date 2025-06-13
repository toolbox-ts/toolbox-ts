import type { Structure, Node } from "../../core/index.js";

/** Type key for doubly linked list structures. */
export type TypeKey = "doublyLinkedList" | "doublyLinkedListCircular";

/** Type key for doubly linked list nodes. */
export type NodeTypeKey = Node.Doubly.TypeKey;

/** Valid positions for relative insert or move operations. */
export type Position = "before" | "after";

/** Index or ID type for node lookup and operations. */
export type IndexOrId = number | string;

/** Anchor keys for doubly linked lists (typically 'head' and 'tail'). */
export type AnchorKey = "head" | "tail";

/** Traversal direction for iterators and operations. */
export type TraversalDirection = "forward" | "backward";

/** Node type for doubly linked lists with anchor keys. */
export type DoublyNode<D> = Node.Doubly.Type<AnchorKey, D>;

/** Iterator type for doubly linked list nodes. */
export type DoublyIterator<D> = Node.Doubly.Iterator<D>;

/** Yield type for doubly linked list node iterators. */
export type DoublyYield<D> = Node.Doubly.IteratorYield<D>;

/**
 * Structure instance type for doubly linked lists.
 * Returned by Structure.create for doubly linked list types.
 *
 * @template TK - Structure type key ('doublyLinkedList' or 'doublyLinkedListCircular')
 * @template D - Data type stored in the node
 */
export type Struct<TK extends TypeKey, D> = ReturnType<
  typeof Structure.create<TK, "doubly", AnchorKey, D>
>;

/**
 * Insert operations for a doubly linked list.
 * Provides methods for inserting nodes at various positions.
 *
 * @template D - Data type stored in the node
 * @template R - Return type for each insert operation
 */
interface Insert<D, R> {
  initial: (d: Node.Detail<D>) => R;
  at: (index: number, d: Node.Detail<D>) => R;
  head: (d: Node.Detail<D>) => R;
  tail: (d: Node.Detail<D>) => R;
  before: (d: Node.Detail<D>, target: IndexOrId) => R;
  after: (d: Node.Detail<D>, target: IndexOrId) => R;
}

/**
 * Generic doubly linked list interface.
 * Provides traversal, access, mutation, and query methods.
 *
 * @template Data - Data type stored in the node
 * @template OpData - Operation data type (default: DoublyYield or Node.Detail)
 * @template Iterator - Iterator type (default: DoublyIterator or Node.DetailIterator)
 * @template Return - Return type for mutating methods (default: OpData)
 */
export interface DoublyLinkedList<
  Data,
  OpData = DoublyYield<Data> | Node.Detail<Data>,
  Iterator = DoublyIterator<Data> | Node.DetailIterator<Data>,
  Return = OpData,
> {
  /** Default iterator over node details. */
  [Symbol.iterator]: () => Iterator;
  /** Traversal methods for forward and backward iteration. */
  traverse: { forward: () => Iterator; backward: () => Iterator };
  /** Node retrieval methods. */
  get: {
    byIndex: (
      index: number,
      traversalDirection?: TraversalDirection,
    ) => OpData | undefined;
    byId: (
      id: string,
      traversalDirection?: TraversalDirection,
    ) => OpData | undefined;
    byIndexOrId: (
      indexOrId: IndexOrId,
      traversalDirection?: TraversalDirection,
    ) => OpData | undefined;
  };
  /** Checks if a node exists by index or id. */
  has: (indexOrId: IndexOrId) => boolean;
  /** Resets the structure to empty. */
  reset: () => Return;
  /** Move operation for repositioning nodes. */
  move: (from: IndexOrId, to: IndexOrId, position?: Position) => Return;
  /** Extracts a node by index, id, or predicate. */
  extract: (
    indexOrIdOrCb: IndexOrId | ((n: OpData) => boolean),
    traversalDirection?: TraversalDirection,
  ) => OpData | undefined;
  /** Iterates over each node, calling the callback. */
  forEach: (
    cb: (n: OpData) => void,
    traversalDirection?: TraversalDirection,
  ) => Return;
  /** Maps each node to a new value. */
  map: <R>(
    cb: (n: OpData) => R,
    traversalDirection?: TraversalDirection,
  ) => R[];
  /** Reduces the list to a single value. */
  reduce: <R>(
    cb: (acc: R, n: OpData) => R,
    initialValue: R,
    traversalDirection?: TraversalDirection,
  ) => R;
  /** Filter operation for selecting nodes matching a predicate. */
  filter: (
    cb: (n: OpData) => boolean,
    traversalDirection?: TraversalDirection,
  ) => OpData[];
  /** Finds the first node matching a predicate. */
  find: (
    cb: (n: OpData) => boolean,
    traversalDirection?: TraversalDirection,
  ) => OpData | undefined;
}

/**
 * Core API for doubly linked list structures.
 * Includes the structure instance, head/tail accessors, and insert methods.
 *
 * @template TK - Structure type key
 * @template D - Data type stored in the node
 */
export type DoublyCore<TK extends TypeKey, D> = DoublyLinkedList<
  D,
  DoublyYield<D>,
  DoublyIterator<D>,
  void
> & {
  /** Underlying structure instance. */
  struct: Struct<TK, D>;
  /** Returns the head node, or undefined if empty. */
  get head(): DoublyNode<D> | undefined;
  /** Returns the tail node, or undefined if empty. */
  get tail(): DoublyNode<D> | undefined;
  /** Insert methods for the doubly linked list. */
  insert: Insert<D, void>;
};

/**
 * Recommended public API for a doubly linked list structure.
 * Combines the recommended Structure API, the generic doubly linked list interface,
 * and head/tail/insert accessors for consumers.
 *
 * @template TK - Structure type key
 * @template D - Data type stored in the node
 */
export type DoublyAPI<TK extends TypeKey, D> = Structure.RecommendedPublicAPI<
  TK,
  NodeTypeKey,
  AnchorKey,
  D
> &
  DoublyLinkedList<
    D,
    Node.Detail<D>,
    Node.DetailIterator<D>,
    DoublyAPI<TK, D>
  > & {
    /** Returns the head node's detail, or undefined if empty. */
    get head(): Node.Detail<D> | undefined;
    /** Returns the tail node's detail, or undefined if empty. */
    get tail(): Node.Detail<D> | undefined;
    /** Insert methods for the doubly linked list (excluding 'initial'). */
    insert: Omit<Insert<D, DoublyAPI<TK, D>>, "initial">;
  };
