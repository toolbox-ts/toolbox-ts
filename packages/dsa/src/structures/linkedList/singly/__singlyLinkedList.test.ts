import { describe, it, expect, beforeEach } from "vitest";
import { create } from "./singlyLinkedList.js";

interface Data {
  value: number;
}
const makeDetail = (value: number, id?: string) => ({
  id: id ?? String(value),
  data: { value },
});

describe("singly public API (create)", () => {
  let api: ReturnType<typeof create<"singlyLinkedList", Data>>;

  beforeEach(() => {
    api = create<"singlyLinkedList", Data>("singlyLinkedList");
    api.reset();
  });

  describe("basic structure", () => {
    it("initializes empty", () => {
      expect(api.head).toBeUndefined();
      expect(api.tail).toBeUndefined();
      expect([...api]).toEqual([]);
      expect(api.isEmpty()).toBe(true);
      expect(api.getSize()).toBe(0);
    });

    it("returns itself for chainable methods", () => {
      expect(api.reset()).toBe(api);
      expect(api.insert.head(makeDetail(1))).toBe(api);
      expect(api.insert.tail(makeDetail(2))).toBe(api);
      expect(api.insert.at(0, makeDetail(3))).toBe(api);
      expect(api.insert.after(makeDetail(4), 0)).toBe(api);
      expect(
        api.forEach(() => {
          return;
        }),
      ).toBe(api);
      expect(api.move(0, 0, "before")).toBe(api);
    });
  });

  describe("insertion", () => {
    it("insert.head, insert.tail, insert.at", () => {
      api.insert.head(makeDetail(1, "a"));
      expect(api.head?.data.value).toBe(1);
      api.insert.tail(makeDetail(2, "b"));
      expect(api.tail?.data.value).toBe(2);
      api.insert.at(1, makeDetail(3, "c"));
      expect(api.get.byIndex(1)?.data.value).toBe(3);
      api.insert.before(makeDetail(0, "z"), "a");
      expect(api.head?.data.value).toBe(0);
      api.insert.after(makeDetail(4, "d"), "b");
      expect(api.tail?.data.value).toBe(4);
    });
  });

  describe("retrieval", () => {
    beforeEach(() => {
      api.insert.tail(makeDetail(1, "a"));
      api.insert.tail(makeDetail(2, "b"));
      api.insert.tail(makeDetail(3, "c"));
    });

    it("get.byId, get.byIndex, get.byIndexOrId", () => {
      expect(api.get.byId("b")?.data.value).toBe(2);
      expect(api.get.byIndex(1)?.data.value).toBe(2);
      expect(api.get.byIndexOrId("c")?.data.value).toBe(3);
      expect(api.get.byIndexOrId(0)?.data.value).toBe(1);
      expect(api.get.byId("nonexistent")).toBeUndefined();
      expect(api.get.byIndex(99)).toBeUndefined();
    });

    it("has returns correct values", () => {
      expect(api.has("a")).toBe(true);
      expect(api.has(1)).toBe(true);
      expect(api.has("nonexistent")).toBe(false);
    });

    it("find, filter, map, reduce, forEach", () => {
      expect(api.find((d) => d.data.value === 2)?.data.value).toBe(2);
      expect(
        api.filter((d) => d.data.value > 1).map((d) => d.data.value),
      ).toEqual([2, 3]);
      expect(api.map((d) => d.data.value)).toEqual([1, 2, 3]);
      expect(api.reduce((acc, d) => acc + d.data.value, 0)).toBe(6);
      let sum = 0;
      api.forEach((d) => {
        sum += d.data.value;
      });
      expect(sum).toBe(6);
    });
  });

  describe("extract, move, reset", () => {
    beforeEach(() => {
      api.insert.tail(makeDetail(1, "a"));
      api.insert.tail(makeDetail(2, "b"));
      api.insert.tail(makeDetail(3, "c"));
    });

    it("extract by id, index, or predicate", () => {
      expect(api.extract("b")?.data.value).toBe(2);
      expect(api.extract(0)?.data.value).toBe(1);
      expect(api.extract((d) => d.data.value === 3)?.data.value).toBe(3);
      expect(api.extract("nonexistent")).toBeUndefined();
    });

    it("move nodes", () => {
      api.move("a", "c", "after");
      expect(api.get.byIndex(2)?.data.value).toBe(1);
      api.move("c", "a", "before");
      expect(api.get.byIndex(1)?.data.value).toBe(3);
      expect(() => api.move("nonexistent", "a")).toThrow();
      expect(() => api.move("a", "nonexistent")).toThrow();
    });

    it("reset clears the list", () => {
      api.reset();
      expect(api.head).toBeUndefined();
      expect(api.tail).toBeUndefined();
      expect(api.getSize()).toBe(0);
      expect([...api]).toEqual([]);
    });
  });

  describe("iteration", () => {
    it("yields details with correct index", () => {
      api.insert.tail(makeDetail(1, "a"));
      api.insert.tail(makeDetail(2, "b"));
      api.insert.tail(makeDetail(3, "c"));
      const arr = Array.from(api);
      expect(arr.map((d) => d.detail.data.value)).toEqual([1, 2, 3]);
    });
  });

  describe("edge cases", () => {
    it("insert before head and after tail", () => {
      api.insert.tail(makeDetail(1, "a"));
      api.insert.tail(makeDetail(2, "b"));
      api.insert.before(makeDetail(0, "z"), "a");
      expect(api.head?.data.value).toBe(0);
      api.insert.after(makeDetail(3, "y"), "b");
      expect(api.tail?.data.value).toBe(3);
    });

    it("insert.at negative and large index", () => {
      api.insert.at(-1, makeDetail(1, "a"));
      expect(api.head?.data.value).toBe(1);
      api.insert.at(100, makeDetail(2, "b"));
      expect(api.tail?.data.value).toBe(2);
    });

    it("insert.relative throws if target not found", () => {
      expect(() => api.insert.after(makeDetail(1), "nonexistent")).toThrow();
    });

    it("extract with function returns undefined if not found", () => {
      expect(api.extract((d) => d.data.value === 999)).toBeUndefined();
    });
  });
});
