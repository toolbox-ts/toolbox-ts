import type { Structure, Node } from "../../core/index.js";

/** Type keys for queue structures. */
export type TypeKey = "queue" | "queueCircular";
/** Keys for anchor nodes of queue structures. */
export type AnchorKey = "head" | "tail";

/** Queue base structure type. */
export type QueueStruct<Q extends TypeKey, D> = ReturnType<
  typeof Structure.create<Q, "singly", AnchorKey, D>
>;

/**
 * Public API for a queue structure.
 * Extends the recommended structure API and
 * adds queue-specific methods.
 * @accessPolicy FIFO
 */
export interface Queue<T extends TypeKey, D>
  extends Structure.RecommendedPublicAPI<T, "singly", "head", D> {
  /** Iterator over node details */
  [Symbol.iterator]: () => Node.DetailIterator<D>;
  /** Returns the detail of the head node, or undefined if the queue is empty */
  get head(): Node.Detail<D> | undefined;
  /** Returns the detail of the tail node, or undefined if the queue is empty */
  get tail(): Node.Detail<D> | undefined;
  /** Enqueue a new item at the tail */
  enqueue: (detail: Node.Detail<D>) => Queue<T, D>;
  /** Dequeue an item from the head */
  dequeue: () => Node.Detail<D> | undefined;
  /** Reset the queue to an empty state. */
  reset: () => Queue<T, D>;
}
