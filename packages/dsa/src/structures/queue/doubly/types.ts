import type { Structure, Node } from "../../core/index.js";

/** Queue structure type. */
export type TypeKey = "deque" | "dequeCircular";

/** Anchor keys used for both queue and deque structures. */
export type AnchorKey = "head" | "tail";

/** Deque base structure type. */
export type DequeStruct<Q extends TypeKey, D> = ReturnType<
  typeof Structure.create<Q, "doubly", AnchorKey, D>
>;

/**
 * Public API for a deque (double-ended queue) structure.
 * Extends the recommended structure API and adds
 * deque-specific methods.
 * @accessPolicy FIFO/LIFO
 */
export interface Deque<D>
  extends Structure.RecommendedPublicAPI<TypeKey, "doubly", "head", D> {
  /** Iterator over node details */
  [Symbol.iterator]: () => Node.DetailIterator<D>;
  /** Returns the detail of the head node, or undefined if the deque is empty */
  get head(): Node.Detail<D> | undefined;
  /** Returns the detail of the tail node, or undefined if the deque is empty */
  get tail(): Node.Detail<D> | undefined;
  /** Append a new item at the tail */
  append: (detail: Node.Detail<D>) => Deque<D>;
  /** Prepend a new item at the head */
  prepend: (detail: Node.Detail<D>) => Deque<D>;
  /** Remove and return the item at the head */
  popHead: () => Node.Detail<D> | undefined;
  /** Remove and return the item at the tail */
  popTail: () => Node.Detail<D> | undefined;
  /** Reset the deque to an empty state. */
  reset: () => Deque<D>;
}
