import { describe, it, expect, beforeEach, vi } from "vitest";
import { create } from "./doublyLinkedList.js";
import type { Node } from "../../core/index.js";

interface Data {
  value: number;
}
const makeDetail = (value: number, id?: string): Node.Detail<Data> => ({
  id: id ?? String(value),
  data: { value },
});

describe("DoublyAPI", () => {
  let api: ReturnType<typeof create<"doublyLinkedList", Data>>;

  beforeEach(() => {
    api = create<"doublyLinkedList", Data>("doublyLinkedList");
    api.reset();
  });

  it("head, tail, insertions, and iteration", () => {
    expect(api.head).toBeUndefined();
    expect(api.tail).toBeUndefined();
    api.insert.head(makeDetail(1, "a"));
    expect(api.head?.id).toBe("a");
    expect(api.tail?.id).toBe("a");
    api.insert.tail(makeDetail(2, "b"));
    expect(api.tail?.id).toBe("b");
    api.insert.at(1, makeDetail(3, "c"));
    expect(api.get.byIndex(1)?.id).toBe("c");
    expect([...api].map((x) => x.detail.id)).toEqual(["a", "c", "b"]);
    expect(Array.from(api.traverse.forward()).map((x) => x.detail.id)).toEqual([
      "a",
      "c",
      "b",
    ]);
    expect(Array.from(api.traverse.backward()).map((x) => x.detail.id)).toEqual(
      ["b", "c", "a"],
    );
  });

  it("get, has, find, map, filter, reduce, forEach", () => {
    api.insert.tail(makeDetail(1, "a"));
    api.insert.tail(makeDetail(2, "b"));
    api.insert.tail(makeDetail(3, "c"));
    expect(api.get.byId("b")?.id).toBe("b");
    expect(api.get.byIndex(2)?.id).toBe("c");
    expect(api.get.byIndexOrId("a")?.id).toBe("a");
    expect(api.get.byIndexOrId(1)?.id).toBe("b");
    expect(api.has("a")).toBe(true);
    expect(api.has("nonexistent")).toBe(false);
    expect(api.find((d) => d.id === "c")?.id).toBe("c");
    expect(api.map((d) => d.id)).toEqual(["a", "b", "c"]);
    expect(api.filter((d) => d.data.value > 1).map((d) => d.id)).toEqual([
      "b",
      "c",
    ]);
    expect(api.reduce((acc, d) => acc + d.data.value, 0)).toBe(6);
    const forEachSpy = vi.fn();
    api.forEach(forEachSpy);
    expect(forEachSpy).toHaveBeenCalledTimes(3);
  });

  it("extract by id, index, and predicate", () => {
    api.insert.tail(makeDetail(1, "a"));
    api.insert.tail(makeDetail(2, "b"));
    api.insert.tail(makeDetail(3, "c"));
    expect(api.extract("b")?.id).toBe("b");
    expect(api.extract(0)?.id).toBe("a");
    expect(api.extract((d) => d.id === "c")?.id).toBe("c");
    expect(api.extract("nonexistent")).toBeUndefined();
    expect(api.head).toBeUndefined();
    expect(api.tail).toBeUndefined();
  });

  it("insert before/after and move", () => {
    api.insert.tail(makeDetail(1, "a"));
    api.insert.tail(makeDetail(2, "b"));
    api.insert.tail(makeDetail(3, "c"));
    api.insert.before(makeDetail(4, "d"), "b");
    expect(api.get.byIndex(1)?.id).toBe("d");
    api.insert.after(makeDetail(5, "e"), "d");
    expect(api.get.byIndex(2)?.id).toBe("e");
    api.move("e", "a", "before");
    expect(api.get.byIndex(0)?.id).toBe("e");
    api.move("e", "c", "after");
    expect(api.get.byIndex(4)?.id).toBe("e");
  });

  it("reset and chaining", () => {
    api.insert.tail(makeDetail(1, "a")).insert.tail(makeDetail(2, "b"));
    expect(api.head?.id).toBe("a");
    api.reset();
    expect(api.head).toBeUndefined();
    expect(api.tail).toBeUndefined();
    expect([...api]).toEqual([]);
  });

  it("edge cases and errors", () => {
    api.insert.tail(makeDetail(1, "a"));
    api.insert.tail(makeDetail(2, "b"));
    expect(() => api.move("a", "nonexistent")).toThrow();
    expect(() => api.move("nonexistent", "a")).toThrow();
    expect(() =>
      api.insert.before(makeDetail(3, "c"), "nonexistent"),
    ).toThrow();
    expect(() => api.insert.after(makeDetail(4, "d"), "nonexistent")).toThrow();
  });

  it("circular list variant", () => {
    const circular = create<"doublyLinkedListCircular", Data>(
      "doublyLinkedListCircular",
    );
    circular.insert.head(makeDetail(1, "a"));
    circular.insert.tail(makeDetail(2, "b"));
    circular.insert.head(makeDetail(3, "c"));
    expect(circular.head?.id).toBe("c");
    expect(circular.tail?.id).toBe("b");
    // Traverse should not infinite loop
    const ids: any[] = [];
    for (const { detail } of circular.traverse.forward()) ids.push(detail.id);
    expect(ids).toEqual(["c", "a", "b"]);
    ids.length = 0;
    for (const { detail } of circular.traverse.backward()) ids.push(detail.id);
    expect(ids).toEqual(["b", "a", "c"]);
    // Reset and insert via head/tail on empty
    circular.reset();
    circular.insert.head(makeDetail(4, "d"));
    expect(circular.head?.id).toBe("d");
    circular.reset();
    circular.insert.tail(makeDetail(5, "e"));
    expect(circular.tail?.id).toBe("e");
  });
});
