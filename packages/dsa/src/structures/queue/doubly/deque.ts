import { type Node, Structure } from "../../core/index.js";
import type { AnchorKey, Deque, DequeStruct, TypeKey } from "./types.js";
export type * from "./types.js";

/** Internal structure factory for queue and deque. */
const createStruct = <Q extends TypeKey, D>(type: Q) =>
  Structure.create<Q, "doubly", AnchorKey, D>({
    type,
    nodeManagerCfg: {
      type: "doubly",
      anchorKeys: ["head", "tail"],
      primaryAnchorKey: "head",
    },
  });

const linkStrategies = {
  normal: <D>(struct: DequeStruct<"deque", D>) => ({
    append: (detail: Node.Detail<D>) =>
      struct.add(detail, (node) => {
        const tail = struct.anchors.get("tail");
        if (!tail) {
          struct.anchors.set("head", node);
          struct.anchors.set("tail", node);
        } else {
          struct.node.setPointer(tail, { next: node });
          struct.node.setPointer(node, { prev: tail });
          struct.anchors.set("tail", node);
        }
      }),
    prepend: (detail: Node.Detail<D>) =>
      struct.add(detail, (node) => {
        const head = struct.anchors.get("head");
        if (!head) {
          struct.anchors.set("head", node);
          struct.anchors.set("tail", node);
        } else {
          struct.node.setPointer(head, { prev: node });
          struct.node.setPointer(node, { next: head });
          struct.anchors.set("head", node);
        }
      }),
    popHead: () =>
      struct.remove(struct.anchors.get("head"), (head) => {
        const next = head.next;
        if (!next) {
          struct.anchors.set("head", undefined);
          struct.anchors.set("tail", undefined);
        } else {
          struct.node.setPointer(next, { prev: undefined });
          struct.anchors.set("head", next);
        }
        return head.detail;
      }),
    popTail: () =>
      struct.remove(struct.anchors.get("tail"), (tail) => {
        const prev = tail.prev;
        if (!prev) {
          struct.anchors.set("head", undefined);
          struct.anchors.set("tail", undefined);
        } else {
          struct.node.setPointer(prev, { next: undefined });
          struct.anchors.set("tail", prev);
        }
        return tail.detail;
      }),
  }),
  circular: <D>(struct: DequeStruct<"dequeCircular", D>) => ({
    append: (detail: Node.Detail<D>) =>
      struct.add(detail, (node) => {
        const head = struct.anchors.get("head");
        const tail = struct.anchors.get("tail");
        if (!tail) {
          struct.node.setPointer(node, { next: node });
          struct.node.setPointer(node, { prev: node });
          struct.anchors.set("head", node);
          struct.anchors.set("tail", node);
        } else {
          struct.node.setPointer(tail, { next: node });
          struct.node.setPointer(node, { prev: tail });
          struct.node.setPointer(node, { next: head });
          struct.node.setPointer(head!, { prev: node });
          struct.anchors.set("tail", node);
        }
      }),
    prepend: (detail: Node.Detail<D>) =>
      struct.add(detail, (node) => {
        const head = struct.anchors.get("head");
        const tail = struct.anchors.get("tail");
        if (!head) {
          struct.node.setPointer(node, { next: node });
          struct.node.setPointer(node, { prev: node });
          struct.anchors.set("head", node);
          struct.anchors.set("tail", node);
        } else {
          struct.node.setPointer(head, { prev: node });
          struct.node.setPointer(node, { next: head });
          struct.node.setPointer(node, { prev: tail });
          struct.node.setPointer(tail!, { next: node });
          struct.anchors.set("head", node);
        }
      }),
    popHead: () =>
      struct.remove(struct.anchors.get("head"), (head) => {
        const tail = struct.anchors.get("tail")!;
        const next = head.next;
        if (head === tail) {
          struct.anchors.set("head", undefined);
          struct.anchors.set("tail", undefined);
        } else {
          struct.node.setPointer(next!, { prev: tail });
          struct.node.setPointer(tail, { next });
          struct.anchors.set("head", next);
        }
        return head.detail;
      }),
    popTail: () =>
      struct.remove(struct.anchors.get("tail"), (tail) => {
        const head = struct.anchors.get("head")!;
        const prev = tail.prev;
        if (tail === head) {
          struct.anchors.set("head", undefined);
          struct.anchors.set("tail", undefined);
        } else {
          struct.node.setPointer(prev!, { next: head });
          struct.node.setPointer(head, { prev: prev });
          struct.anchors.set("tail", prev);
        }
        return tail.detail;
      }),
  }),
} as const;

export const create = <Q extends TypeKey, D>(type: Q): Deque<D> => {
  const struct = createStruct<Q, D>(type);
  const api = Structure.extractPublicAPI(struct);
  const { append, prepend, popHead, popTail } =
    type === "deque"
      ? linkStrategies.normal<D>(struct as never)
      : linkStrategies.circular<D>(struct as never);

  const deque: Deque<D> = {
    [Symbol.iterator]: () =>
      Structure.genericDetailIterator(struct.anchors.primary, "next"),
    ...api,
    get head() {
      return struct.anchors.get("head")?.detail;
    },
    get tail() {
      return struct.anchors.get("tail")?.detail;
    },
    popHead,
    popTail,
    append: (detail) => {
      append(detail);
      return deque;
    },
    prepend: (detail) => {
      prepend(detail);
      return deque;
    },
    reset: () => {
      struct.reset();
      return deque;
    },
  } as const;
  return deque;
};
