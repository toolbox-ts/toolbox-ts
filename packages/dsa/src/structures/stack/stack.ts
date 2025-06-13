import { Structure } from "../core/index.js";
import type { Stack } from "./types.js";
export type * from "./types.js";

/**
 * Factory for creating a stack structure instance.
 * The stack is a singly linked list with a single 'head' anchor.
 * Provides push, pop, reset, and iteration methods.
 *
 * @template D - Data type stored in the stack nodes
 * @returns Stack API instance
 */
export const create = <D>(): Stack<D> => {
  const struct = Structure.create<"stack", "singly", "head", D>({
    type: "stack",
    nodeManagerCfg: {
      anchorKeys: ["head"],
      type: "singly",
      primaryAnchorKey: "head",
    },
  } as const);
  const api = Structure.extractPublicAPI(struct);

  const stack: Stack<D> = {
    ...api,
    [Symbol.iterator]: () =>
      Structure.genericDetailIterator(struct.anchors.primary, "next"),
    get head() {
      return struct.anchors.primary?.detail;
    },
    reset: () => {
      struct.reset();
      return stack;
    },
    pop: () =>
      struct.remove(struct.anchors.primary, (head) => {
        struct.anchors.set("head", head.next);
        return head.detail;
      }),
    push: (detail) =>
      struct.add(detail, (newNode) => {
        const currHead = struct.anchors.primary;
        if (currHead) {
          struct.anchors.set("head", newNode);
          struct.node.setPointer(newNode, { next: currHead });
        } else struct.anchors.set("head", newNode);
        return stack;
      }),
    top: () => struct.anchors.primary?.detail,
  };
  return stack;
};
