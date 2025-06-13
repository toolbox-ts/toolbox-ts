import { describe, it, expect } from "vitest";
import { assign } from "./pointers";

type TK = "singly";
type PK = "next" | "prev";
interface D {
  value: number;
}

function createBaseNode(id: string, data: D) {
  let _id = id;
  let _data = data;
  return {
    type: "singly" as TK,
    get id() {
      return _id;
    },
    get data() {
      return _data;
    },
    set data(newData: D) {
      _data = newData;
    },
    get detail() {
      return { id: _id, data: _data };
    },
    destroy() {
      _id = undefined as any;
      _data = undefined as any;
    },
  };
}

describe("assign (pointer property augmentation)", () => {
  it("creates node with pointer properties and allows safe pointer management", () => {
    const base1 = createBaseNode("a", { value: 1 });
    const base2 = createBaseNode("b", { value: 2 });

    const node1 = assign<TK, PK, D>({
      base: base1,
      pointerKeys: ["next", "prev"],
    });
    const node2 = assign<TK, PK, D>({
      base: base2,
      pointerKeys: ["next", "prev"],
    });

    // Initial pointers are undefined
    expect(node1.next).toBeUndefined();
    expect(node1.prev).toBeUndefined();

    // Set pointers using the setter
    // @ts-expect-error: overriding immutable set
    node1.next = node2;
    // @ts-expect-error: overriding immutable set
    node2.prev = node1;

    expect(node1.next).toBe(node2);
    expect(node2.prev).toBe(node1);

    // Unlink clears all pointers
    node1.unlink();
    expect(node1.next).toBeUndefined();
    expect(node1.prev).toBeUndefined();

    // Destroy clears data and pointers
    // @ts-expect-error: overriding immutable set
    node1.next = node2;
    node1.destroy();
    expect(node1.next).toBeUndefined();
    expect(node1.id).toBeUndefined();
    expect(node1.data).toBeUndefined();
  });

  it("throws if pointerKeys is empty", () => {
    const base = createBaseNode("x", { value: 0 });
    // @ts-expect-error: Testing empty pointerKeys
    expect(() => assign<TK, PK, D>({ base, pointerKeys: [] })).toThrow();
  });
});
