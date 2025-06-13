import { Structure, type Node } from "../../../core/index.js";
import type { IndexOrId } from "../../types.js";
import type {
  SinglyCore,
  TypeKey,
  NodeTypeKey,
  AnchorKey,
  Struct,
} from "../types.js";

const createStruct = <T extends TypeKey, D>(type: T) =>
  Structure.create<T, NodeTypeKey, AnchorKey, D>({
    type,
    nodeManagerCfg: {
      type: "singly",
      anchorKeys: ["head", "tail"],
      primaryAnchorKey: "head",
    },
  });
type InsertStrategies<TK extends TypeKey, D> = Pick<
  SinglyCore<"singlyLinkedListCircular", D>["insert"],
  "initial" | "head" | "tail"
>;
const _insert = {
  at: <TK extends TypeKey, D>(
    struct: Struct<TK, D>,
    detail: Node.Detail<D>,
    index: number,
    get: { prev: SinglyCore<TK, D>["getPrev"] },
    insert: Pick<SinglyCore<TK, D>["insert"], "head" | "tail">,
  ) => {
    if (index <= 0 || !struct.anchors.primary) return insert.head(detail);
    if (index >= struct.size.get()) return insert.tail(detail);
    struct.add(detail, (node) => {
      const prev = get.prev(index)!;
      struct.node.setPointer(node, { next: prev.node.next });
      struct.node.setPointer(prev.node, { next: node });
    });
  },
  before: <TK extends TypeKey, D>(
    struct: Struct<TK, D>,
    detail: Node.Detail<D>,
    target: IndexOrId,
    get: SinglyCore<TK, D>["get"] & { prev: SinglyCore<TK, D>["getPrev"] },
    insert: Pick<SinglyCore<TK, D>["insert"], "tail" | "head">,
  ) => {
    if (typeof target === "number")
      return _insert.at(struct, detail, target - 1, get, insert);
    const found = get.byIndexOrId(target)?.node;
    if (!found) throw new Error(`Target node with id: ${target} not found`);
    if (struct.anchors.isAnchor("head", found)) return insert.head(detail);
    const prev = get.prev(found)!;
    struct.add(detail, (node) => {
      struct.node.setPointer(node, { next: found });
      struct.node.setPointer(prev.node, { next: node });
    });
  },
  after: <TK extends TypeKey, D>(
    struct: Struct<TK, D>,
    detail: Node.Detail<D>,
    target: IndexOrId,
    get: SinglyCore<TK, D>["get"] & { prev: SinglyCore<TK, D>["getPrev"] },
    insert: Pick<SinglyCore<TK, D>["insert"], "head" | "tail">,
  ) => {
    if (typeof target === "number")
      return _insert.at(struct, detail, target + 1, get, insert);
    const found = get.byIndexOrId(target)?.node;
    if (!found) throw new Error(`Target node with id: ${target} not found`);
    if (struct.anchors.isAnchor("tail", found)) return insert.tail(detail);
    struct.add(detail, (node) => {
      struct.node.setPointer(node, { next: found.next });
      struct.node.setPointer(found, { next: node });
    });
  },
} as const;
const insertStrategies = {
  singlyLinkedList: <D>(
    struct: Struct<"singlyLinkedList", D>,
  ): InsertStrategies<"singlyLinkedList", D> => {
    const insert: InsertStrategies<"singlyLinkedList", D> = {
      initial: (detail) =>
        struct.add(detail, (node) => {
          struct.anchors.set("head", node);
          struct.anchors.set("tail", node);
        }),
      head: (detail) => {
        const currHead = struct.anchors.primary;
        if (!currHead) return insert.initial(detail);
        struct.add(detail, (node) => {
          struct.node.setPointer(node, { next: currHead });
          struct.anchors.set("head", node);
        });
      },
      tail: (detail) => {
        const currTail = struct.anchors.get("tail");
        if (!currTail) return insert.initial(detail);
        struct.add(detail, (node) => {
          struct.node.setPointer(currTail, { next: node });
          struct.anchors.set("tail", node);
        });
      },
    };
    return insert;
  },
  singlyLinkedListCircular: <D>(
    struct: Struct<"singlyLinkedListCircular", D>,
  ): InsertStrategies<"singlyLinkedListCircular", D> => {
    const insert: InsertStrategies<"singlyLinkedListCircular", D> = {
      initial: (detail) =>
        struct.add(detail, (node) => {
          struct.anchors.set("head", node);
          struct.anchors.set("tail", node);
          struct.node.setPointer(node, { next: node });
        }),
      head: (detail) => {
        const currHead = struct.anchors.primary;
        if (!currHead) return insert.initial(detail);
        struct.add(detail, (node) => {
          struct.node.setPointer(node, { next: currHead });
          struct.anchors.set("head", node);
          struct.node.setPointer(struct.anchors.get("tail")!, { next: node });
        });
      },
      tail: (detail) => {
        const currTail = struct.anchors.get("tail");
        if (!currTail) return insert.initial(detail);
        struct.add(detail, (node) => {
          struct.node.setPointer(currTail, { next: node });
          struct.node.setPointer(node, { next: struct.anchors.primary });
          struct.anchors.set("tail", node);
        });
      },
    } as const;
    return insert;
  },
} as const;

export const createCore = <T extends TypeKey, D>(type: T): SinglyCore<T, D> => {
  const struct = createStruct<T, D>(type);
  function* iterator(): Node.Singly.Iterator<D> {
    const first = struct.anchors.primary;
    if (!first) return;
    let curr: Node.Singly.Type<AnchorKey, D> | undefined = first;
    let index = 0;
    while (curr) {
      yield { node: curr, index };
      curr = curr.next;
      index++;
      if (curr?.id === first.id) break;
    }
  }
  const find: SinglyCore<T, D>["find"] = (cb) => {
    for (const y of iterator()) if (cb(y)) return y;
    return undefined;
  };
  const get: SinglyCore<T, D>["get"] & { prev: SinglyCore<T, D>["getPrev"] } = {
    prev: (indexIdOrNode) => {
      const target =
        typeof indexIdOrNode === "object"
          ? indexIdOrNode
          : core.get.byIndexOrId(indexIdOrNode)?.node;
      if (!target) return undefined;
      return core.find(({ node }) => node.next?.id === target.id);
    },
    byIndex: (i: number) => {
      const size = struct.size.get();
      if (i < 0 || (size !== Infinity && i > struct.size.get()))
        return undefined;
      return find(({ index }) => index === i);
    },
    byId: (id: string) =>
      struct.has(id) ? find(({ node }) => node.id === id) : undefined,
    byIndexOrId: (indexOrId) =>
      typeof indexOrId === "number"
        ? core.get.byIndex(indexOrId)
        : core.get.byId(indexOrId),
  };
  const { head, initial, tail } = insertStrategies[type](struct as never);
  const core: SinglyCore<T, D> = {
    struct,
    [Symbol.iterator]: iterator,
    traverse: { forward: iterator },
    reset: struct.reset,
    get head() {
      return struct.anchors.primary;
    },
    get tail() {
      return struct.anchors.get("tail");
    },
    find,
    reduce: (cb, initialValue) => {
      let acc = initialValue;
      for (const y of iterator()) acc = cb(acc, y);
      return acc;
    },
    map: (cb) => {
      const results = [];
      for (const y of iterator()) results.push(cb(y));
      return results;
    },
    filter: (cb) =>
      core.reduce<Node.Singly.IteratorYield<D>[]>((acc, y) => {
        if (cb(y)) acc.push(y);
        return acc;
      }, []),
    forEach: (cb) => {
      for (const y of iterator()) cb(y);
    },

    getPrev: get.prev,
    get: { byIndex: get.byIndex, byId: get.byId, byIndexOrId: get.byIndexOrId },
    has: (indexOrId) =>
      typeof indexOrId === "string"
        ? struct.has(indexOrId)
        : !!core.get.byIndexOrId(indexOrId),
    extract: (indexIdOrCb) => {
      const found =
        typeof indexIdOrCb === "function"
          ? core.find(indexIdOrCb)
          : core.get.byIndexOrId(indexIdOrCb);
      if (!found) return undefined;
      struct.remove(found.node, (node) => {
        const prev = core.getPrev(node);
        if (prev) {
          struct.node.setPointer(prev.node, { next: found.node.next });
          if (struct.anchors.isAnchor("tail", node)) {
            struct.anchors.set("tail", prev.node);
          }
        } else {
          struct.anchors.set("head", found.node.next);
          if (struct.anchors.isAnchor("tail", found.node))
            struct.anchors.set("tail", found.node.next);
        }
      });
      found.node.unlink();
      return found;
    },
    move: (from, to, position = "before") => {
      if (!core.has(from) || !core.has(to))
        throw new Error(`Invalid target or position`);
      if (from !== to) {
        const toMove = core.extract(from)!;
        core.insert[position](toMove.node.detail, to);
      }
    },
    insert: {
      initial,
      head,
      tail,
      at: (index, detail) =>
        _insert.at(struct, detail, index, get, { head, tail }),
      after: (d, target) =>
        _insert.after(struct, d, target, get, { head, tail }),
      before: (d, target) =>
        _insert.before(struct, d, target, get, { head, tail }),
    },
  } as const;

  return core;
};
