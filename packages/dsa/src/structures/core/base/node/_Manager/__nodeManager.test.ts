import { describe, it, expect, vi } from "vitest";
import { create, type Config } from "./Manager";

vi.mock("./anchors/index.js", () => ({
  Anchors: {
    create: <AK extends string>({ anchorKeys }: { anchorKeys: AK[] }) => {
      const _map: Record<string, any> = {};
      return {
        get keys() {
          return anchorKeys;
        },
        set: (key: AK, node: any) => {
          _map[key] = node;
        },
        get: (key: AK) => _map[key],
        _map,
      };
    },
  },
}));
vi.mock("./base/index.js", () => ({
  Base: {
    create: <TK extends string, D>({
      data,
      id,
      type,
    }: {
      data: D;
      id: string;
      type: TK;
    }) => ({ type, id, data }),
  },
}));
vi.mock("./pointers/index.js", () => ({
  Pointers: {
    assign: <PK extends string, D>({
      base,
      pointerKeys,
    }: {
      base: any;
      pointerKeys: PK[];
    }) => {
      pointerKeys.forEach((k) => (base[k] = undefined));
      return base;
    },
  },
}));

describe("Manager.create", () => {
  type TK = "singly";
  type AK = "head" | "tail";
  type PK = "next";
  type D = number;

  const config: Config<TK, PK, AK, D> = {
    type: "singly",
    anchorKeys: ["head", "tail"],
    pointerKeys: ["next"],
  };

  it("creates a manager with correct properties and methods", () => {
    const mgr = create<TK, PK, AK, D>(config);

    expect(mgr.type).toBe("singly");
    expect(mgr.pointerKeys).toEqual(["next"]);
    expect(mgr.anchors.keys).toEqual(["head", "tail"]);
    expect(typeof mgr.createNode).toBe("function");
  });

  it("createNode returns a node with correct structure and pointer keys", () => {
    const mgr = create<TK, PK, AK, D>(config);
    const node = mgr.createNode({ id: "n1", data: 42 });

    expect(node.type).toBe("singly");
    expect(node.id).toBe("n1");
    expect(node.data).toBe(42);
    expect(node.next).toBeUndefined();
  });

  it("anchors.set and anchors.get work as expected", () => {
    const mgr = create<TK, PK, AK, D>(config);
    const node = mgr.createNode({ id: "n2", data: 99 });

    mgr.anchors.set("head", node);
    expect(mgr.anchors.get("head")).toBe(node);

    mgr.anchors.set("head", undefined);
    expect(mgr.anchors.get("head")).toBeUndefined();
  });
  it("setPointer sets pointer immutably", () => {
    const singly = create(config);
    const node1 = singly.createNode({ id: "n1", data: 1 });
    const node2 = singly.createNode({ id: "n2", data: 2 });

    // Initially, node1.next is undefined
    expect(node1.next).toBeUndefined();

    // Use setPointer to set node1.next to node2
    singly.setPointer(node1, { next: node2 });
    expect(node1.next).toBe(node2);

    // Use setPointer to unset node1.next
    singly.setPointer(node1, { next: undefined });
    expect(node1.next).toBeUndefined();
  });
});
