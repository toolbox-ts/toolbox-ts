import type { Structure, Node } from "../core/index.js";

/**
 * Public API for a stack structure.
 * Extends the recommended structure API and adds
 * stack-specific methods.
 *
 * @template D - Data type stored in the stack nodes
 */
export interface Stack<D>
  extends Structure.RecommendedPublicAPI<"stack", "singly", "head", D> {
  /** Iterator over node details. */
  [Symbol.iterator]: () => Node.DetailIterator<D>;
  /** Returns the detail of the head node, or undefined if the stack is empty. */
  get head(): Node.Detail<D> | undefined;
  /**
   * Removes and returns the detail of the head node (top of the stack).
   * Returns undefined if the stack is empty.
   */
  pop: () => Node.Detail<D> | undefined;
  /**
   * Pushes a new node onto the stack.
   * @param detail - The node detail to push
   * @returns The stack instance (for chaining)
   */
  push: (detail: Node.Detail<D>) => Stack<D>;
  /**
   * Resets the stack to empty.
   * @returns The stack instance (for chaining)
   */
  reset: () => Stack<D>;

  /** Returns the detail of the top node (head) without removing it. */
  top: () => Node.Detail<D> | undefined;
}
