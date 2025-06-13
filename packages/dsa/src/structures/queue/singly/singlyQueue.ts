import { type Node, Structure } from "../../core/index.js";
import type { AnchorKey, Queue, TypeKey, QueueStruct } from "./types.js";
export type * from "./types.js";

/** Internal structure factory for queue and deque. */
const createStruct = <Q extends TypeKey, D>(type: Q) =>
  Structure.create<Q, "singly", AnchorKey, D>({
    type,
    nodeManagerCfg: {
      type: "singly",
      anchorKeys: ["head", "tail"],
      primaryAnchorKey: "head",
    },
  });

const linkStrategies = {
  normal: <D>(struct: QueueStruct<"queue", D>) => ({
    enqueue: (detail: Node.Detail<D>) =>
      struct.add(detail, (node) => {
        if (!struct.anchors.primary) {
          struct.anchors.set("head", node);
          struct.anchors.set("tail", node);
        } else {
          const tail = struct.anchors.get("tail")!;
          struct.node.setPointer(tail, { next: node });
          struct.anchors.set("tail", node);
        }
      }),
    dequeue: () =>
      struct.remove(struct.anchors.get("head"), (head) => {
        const tail = struct.anchors.get("tail");
        if (head === tail) {
          struct.anchors.set("head", undefined);
          struct.anchors.set("tail", undefined);
        } else struct.anchors.set("head", head.next);
        return head.detail;
      }),
  }),
  circular: <D>(struct: QueueStruct<"queueCircular", D>) => ({
    enqueue: (detail: Node.Detail<D>) =>
      struct.add(detail, (node) => {
        const head = struct.anchors.get("head");
        const tail = struct.anchors.get("tail");
        if (!head) {
          struct.anchors.set("head", node);
          struct.anchors.set("tail", node);
          struct.node.setPointer(node, { next: node });
        } else {
          struct.node.setPointer(tail!, { next: node });
          struct.node.setPointer(node, { next: head });
          struct.anchors.set("tail", node);
        }
      }),
    dequeue: () =>
      struct.remove(struct.anchors.get("head"), (head) => {
        const tail = struct.anchors.get("tail")!;
        const next = head.next;
        if (head === tail) {
          struct.anchors.set("head", undefined);
          struct.anchors.set("tail", undefined);
        } else {
          struct.anchors.set("head", next);
          struct.node.setPointer(tail, { next });
        }
        return head.detail;
      }),
  }),
} as const;

export const create = <Q extends TypeKey, D>(type: Q) => {
  const struct = createStruct<Q, D>(type);
  const api = Structure.extractPublicAPI(struct);
  const { dequeue, enqueue } =
    type === "queue"
      ? linkStrategies.normal<D>(struct as never)
      : linkStrategies.circular<D>(struct as never);

  const queue: Queue<Q, D> = {
    ...api,
    [Symbol.iterator]: () =>
      Structure.genericDetailIterator(struct.anchors.primary, "next"),
    get head() {
      return struct.anchors.primary?.detail;
    },
    get tail() {
      return struct.anchors.get("tail")?.detail;
    },
    enqueue: (detail) => {
      enqueue(detail);
      return queue;
    },
    dequeue,
    reset: () => {
      struct.reset();
      return queue;
    },
  };
  return queue;
};
