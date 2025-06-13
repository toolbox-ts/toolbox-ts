import type { Node } from "../core/index.js";

/** Valid positions for relative insert or move operations in a linked list. */
export type Position = "before" | "after";

/** Index or ID type for node lookup and operations. */
export type IndexOrId = number | string;

/**
 * Insert operations for a linked list.
 * Provides methods for inserting nodes at various positions.
 *
 * @template D - Data type stored in the node
 * @template R - Return type for each insert operation
 */
export interface Insert<D, R> {
  /** Insert the initial node (when the list is empty). */
  initial: (d: Node.Detail<D>) => R;
  /** Insert a node at a specific index. */
  at: (index: number, d: Node.Detail<D>) => R;
  /** Insert a node at the head of the list. */
  head: (d: Node.Detail<D>) => R;
  /** Insert a node at the tail of the list. */
  tail: (d: Node.Detail<D>) => R;
  /** Insert a node before a given index or id. */
  before: (d: Node.Detail<D>, target: IndexOrId) => R;
  /** Insert a node after a given index or id. */
  after: (d: Node.Detail<D>, target: IndexOrId) => R;
}

/**
 * Generic linked list interface.
 * Provides common methods for traversal, access, mutation, and queries.
 *
 * @template OpData - Operation data type (e.g., node, node detail, or yield)
 * @template Iterator - Iterator type for traversal
 * @template Return - Return type for mutating methods (default: OpData)
 */
export interface LinkedList<OpData, Iterator, Return = OpData> {
  /** Default iterator over node details. */
  [Symbol.iterator]: () => Iterator;
  /** Traversal methods for forward iteration. */
  traverse: { forward: () => Iterator };
  /** Node retrieval methods. */
  get: {
    /** Retrieves a node by index. */
    byIndex: (index: number) => OpData | undefined;
    /** Retrieves a node by ID. */
    byId: (id: string) => OpData | undefined;
    /** Retrieves a node by index or ID. */
    byIndexOrId: (indexOrId: IndexOrId) => OpData | undefined;
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
  ) => OpData | undefined;
  /** Iterates over each node, calling the callback. */
  forEach: (cb: (n: OpData) => void) => Return;
  /** Maps each node to a new value. */
  map: <R>(cb: (n: OpData) => R) => R[];
  /** Reduces the list to a single value. */
  reduce: <R>(cb: (acc: R, n: OpData) => R, initialValue: R) => R;
  /** Filter operation for selecting nodes matching a predicate. */
  filter: (cb: (n: OpData) => boolean) => OpData[];
  /** Finds the first node matching a predicate. */
  find: (cb: (n: OpData) => boolean) => OpData | undefined;
}
