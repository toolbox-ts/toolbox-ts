import { Structure, type Node } from "../../../core/index.js";
import type {
  IndexOrId,
  DoublyCore,
  TypeKey,
  NodeTypeKey,
  TraversalDirection,
  AnchorKey,
  Struct,
} from "../types.js";

const createStruct = <T extends TypeKey, D>(type: T) =>
  Structure.create<T, NodeTypeKey, AnchorKey, D>({
    type,
    nodeManagerCfg: {
      type: "doubly",
      anchorKeys: ["head", "tail"],
      primaryAnchorKey: "head",
    },
  });
const _insert = {
  at: <TK extends TypeKey, D>(
    struct: Struct<TK, D>,
    detail: Node.Detail<D>,
    index: number,
    get: DoublyCore<TK, D>["get"],
    insert: Pick<DoublyCore<TK, D>["insert"], "head" | "tail">,
  ) => {
    if (index <= 0 || !struct.anchors.primary) return insert.head(detail);
    if (index >= struct.size.get()) return insert.tail(detail);
    struct.add(detail, (node) => {
      const target = get.byIndex(index)!.node;
      const prev = target.prev!;
      struct.node.setPointer(node, { next: target, prev });
      struct.node.setPointer(target, { prev: node });
      struct.node.setPointer(prev, { next: node });
    });
  },
  before: <TK extends TypeKey, D>(
    struct: Struct<TK, D>,
    detail: Node.Detail<D>,
    target: IndexOrId,
    get: DoublyCore<TK, D>["get"],
    insert: Pick<DoublyCore<TK, D>["insert"], "tail" | "head">,
  ) => {
    if (typeof target === "number")
      return _insert.at(struct, detail, target - 1, get, insert);
    const found = get.byIndexOrId(target)?.node;
    if (!found) throw new Error(`Target node with id: ${target} not found`);
    if (struct.anchors.isAnchor("head", found)) return insert.head(detail);
    const prev = found.prev;
    struct.add(detail, (node) => {
      struct.node.setPointer(node, { prev, next: found });
      struct.node.setPointer(found, { prev: node });
      if (prev) struct.node.setPointer(prev, { next: node });
    });
  },

  after: <TK extends TypeKey, D>(
    struct: Struct<TK, D>,
    detail: Node.Detail<D>,
    target: IndexOrId,
    get: DoublyCore<TK, D>["get"],
    insert: Pick<DoublyCore<TK, D>["insert"], "head" | "tail">,
  ) => {
    if (typeof target === "number")
      return _insert.at(struct, detail, target + 1, get, insert);
    const found = get.byIndexOrId(target)?.node;
    if (!found) throw new Error(`Target node with id: ${target} not found`);
    if (struct.anchors.isAnchor("tail", found)) return insert.tail(detail);
    const next = found.next;
    struct.add(detail, (node) => {
      struct.node.setPointer(node, { prev: found, next });
      struct.node.setPointer(found, { next: node });
      if (next) struct.node.setPointer(next, { prev: node });
    });
  },
};

type InsertStrategies<TK extends TypeKey, D> = Pick<
  DoublyCore<TK, D>["insert"],
  "initial" | "head" | "tail"
>;
const insertStrategies = {
  doublyLinkedList: <D>(
    struct: Struct<"doublyLinkedList", D>,
  ): InsertStrategies<"doublyLinkedList", D> => {
    const insert: InsertStrategies<"doublyLinkedList", D> = {
      initial: (detail: Node.Detail<D>) =>
        struct.add(detail, (node) => {
          struct.anchors.set("head", node);
          struct.anchors.set("tail", node);
        }),
      head: (detail: Node.Detail<D>) => {
        const currHead = struct.anchors.primary;
        if (!currHead) return insert.initial(detail);
        struct.add(detail, (node) => {
          struct.node.setPointer(node, { next: currHead, prev: undefined });
          struct.node.setPointer(currHead, { prev: node });
          struct.anchors.set("head", node);
        });
      },
      tail: (detail: Node.Detail<D>) => {
        const currTail = struct.anchors.get("tail");
        if (!currTail) return insert.initial(detail);
        struct.add(detail, (node) => {
          struct.node.setPointer(node, { next: undefined, prev: currTail });
          struct.node.setPointer(currTail, { next: node });
          struct.anchors.set("tail", node);
        });
      },
    };
    return insert;
  },
  doublyLinkedListCircular: <D>(
    struct: Struct<"doublyLinkedListCircular", D>,
  ): InsertStrategies<"doublyLinkedListCircular", D> => {
    const insert: InsertStrategies<"doublyLinkedListCircular", D> = {
      initial: (detail) =>
        struct.add(detail, (node) => {
          struct.anchors.set("head", node);
          struct.anchors.set("tail", node);
          struct.node.setPointer(node, { next: node, prev: node });
        }),
      head: (detail: Node.Detail<D>) => {
        const currHead = struct.anchors.primary;
        const currTail = struct.anchors.get("tail")!;
        if (!currHead) return insert.initial(detail);
        struct.add(detail, (node) => {
          struct.node.setPointer(node, { prev: currTail, next: currHead });
          struct.node.setPointer(currHead, { prev: node });
          struct.node.setPointer(currTail, { next: node });
          struct.anchors.set("head", node);
        });
      },
      tail: (detail: Node.Detail<D>) => {
        const currTail = struct.anchors.get("tail")!;
        const currHead = struct.anchors.primary;
        if (!currHead) return insert.initial(detail);

        struct.add(detail, (node) => {
          struct.node.setPointer(node, { prev: currTail, next: currHead });
          struct.node.setPointer(currTail, { next: node });
          struct.node.setPointer(currHead, { prev: node });
          struct.anchors.set("tail", node);
        });
      },
    } as const;
    return insert;
  },
} as const;

export const createCore = <TK extends TypeKey, D>(
  type: TK,
): DoublyCore<TK, D> => {
  const struct = createStruct<TK, D>(type);
  const traverse = {
    forward: function* (): Node.Doubly.Iterator<D> {
      const first = struct.anchors.primary;
      if (!first) return;
      let curr: Node.Doubly.Type<AnchorKey, D> | undefined = first;
      let index = 0;
      while (curr) {
        yield { node: curr, index: index++ };
        curr = curr.next;
        if (curr?.id === first.id) break;
      }
    },
    backward: function* (): Node.Doubly.Iterator<D> {
      const first = struct.anchors.get("tail");
      if (!first) return;
      let curr: Node.Doubly.Type<AnchorKey, D> | undefined = first;
      let index = struct.size.get() - 1;
      while (curr) {
        yield { node: curr, index: index-- };
        curr = curr.prev;
        if (curr?.id === first.id) break;
      }
    },
  };
  const find: DoublyCore<TK, D>["find"] = (cb, direction = "forward") => {
    for (const node of traverse[direction]()) if (cb(node)) return node;
    return undefined;
  };
  const { head, initial, tail } = insertStrategies[type](struct as never);

  const core: DoublyCore<TK, D> = {
    struct,
    traverse,
    [Symbol.iterator]: () => traverse.forward(),
    get head() {
      return struct.anchors.primary;
    },
    get tail() {
      return struct.anchors.get("tail");
    },
    find,
    insert: {
      initial,
      head,
      tail,
      at: (index, detail) =>
        _insert.at(struct, detail, index, core.get, core.insert),
      before: (detail, target) =>
        _insert.before(struct, detail, target, core.get, core.insert),
      after: (detail, target) =>
        _insert.after(struct, detail, target, core.get, core.insert),
    },
    extract: (indexIdOrCb, direction) => {
      const found =
        typeof indexIdOrCb === "function"
          ? find(indexIdOrCb, direction)
          : core.get.byIndexOrId(indexIdOrCb, direction);
      if (!found) return undefined;

      return struct.remove(found.node, (node) => {
        const prev = node.prev;
        const next = node.next;

        if (prev) struct.node.setPointer(prev, { next });
        if (next) struct.node.setPointer(next, { prev });

        if (struct.anchors.isAnchor("head", node))
          struct.anchors.set("head", next);
        if (struct.anchors.isAnchor("tail", node))
          struct.anchors.set("tail", prev);
        node.unlink();
        return { node, index: found.index };
      });
    },
    reduce: (cb, initialValue, direction = "forward") => {
      let acc = initialValue;
      for (const y of traverse[direction]()) acc = cb(acc, y);
      return acc;
    },
    map: (cb, direction = "forward") => {
      const results = [];
      for (const y of traverse[direction]()) results.push(cb(y));
      return results;
    },
    filter: (cb, direction = "forward") =>
      core.reduce<Node.Doubly.IteratorYield<D>[]>(
        (acc, y) => {
          if (cb(y)) acc.push(y);
          return acc;
        },
        [],
        direction,
      ),
    forEach: (cb, direction = "forward") => {
      for (const y of traverse[direction]()) cb(y);
    },
    get: {
      byIndex: (index: number, direction?: TraversalDirection) => {
        const size = struct.size.get();
        console.log(`Size: ${size}, Index: ${index}`);
        if (index < 0 || (size !== Infinity && index >= size)) return undefined;
        return find(
          (y) => {
            console.log(`Checking index: ${y.index} === ${index}`);
            return y.index === index;
          },
          direction ?? (index > size / 2 ? "backward" : "forward"),
        );
      },
      byId: (id: string, direction: TraversalDirection = "forward") =>
        struct.has(id)
          ? find(({ node }) => node.id === id, direction)
          : undefined,
      byIndexOrId: (indexOrId: IndexOrId, direction?: TraversalDirection) =>
        typeof indexOrId === "number"
          ? core.get.byIndex(indexOrId)
          : core.get.byId(indexOrId, direction),
    },
    has: (indexOrId) =>
      typeof indexOrId === "string"
        ? struct.has(indexOrId)
        : !!core.get.byIndexOrId(indexOrId),
    move: (from, to, position = "before") => {
      if (!core.has(from) || !core.has(to))
        throw new Error(`Invalid target or position`);
      if (from !== to) {
        const toMove = core.extract(from)!;
        core.insert[position](toMove.node.detail, to);
      }
    },
    reset: struct.reset,
  } as const;

  return core;
};
