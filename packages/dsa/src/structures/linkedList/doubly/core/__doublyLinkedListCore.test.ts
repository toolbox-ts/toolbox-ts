import { describe, it, expect, beforeEach } from "vitest";
import { createCore } from "./doublyLinkedListCore";
import { DoublyNode } from "../types";

interface Data {
  value: number;
}
const makeDetail = (value: number, id?: string) => ({
  id: id ?? String(value),
  data: { value },
});

describe("doublyLinkedListCore", () => {
  let core: ReturnType<typeof createCore<"doublyLinkedList", Data>>;

  beforeEach(() => {
    core = createCore<"doublyLinkedList", Data>("doublyLinkedList");
    core.reset();
  });
  it("has", () => {
    expect(core.has("nonexistent")).toBe(false);
    core.insert.head(makeDetail(1, "a"));
    expect(core.has("a")).toBe(true);
    expect(core.has("b")).toBe(false);
    expect(core.has(0)).toBe(true);
  });
  describe("insert", () => {
    let nA, nB, nC;
    beforeEach(() => {
      nA = makeDetail(1, "a");
      nB = makeDetail(2, "b");
      nC = makeDetail(3, "c");
    });
    describe("normal", () => {
      it("initial", () => {
        core.insert.initial(nA);
        expect(core.head?.id).toBe("a");
        expect(core.tail?.id).toBe("a");
      });
      it("head", () => {
        core.insert.initial(nA);
        core.insert.head(nB);
        expect(core.head?.id).toBe("b");
        expect(core.tail?.id).toBe("a");
        core.reset();
        core.insert.head(nB);
        expect(core.head?.id).toBe("b");
      });
      it("tail", () => {
        core.insert.initial(nA);
        core.insert.tail(nB);
        core.insert.tail(nC);
        expect(core.head?.id).toBe("a");
        expect(core.tail?.id).toBe("c");
        expect(core.head?.next?.id).toBe("b");
        expect(core.tail?.prev?.id).toBe("b");
      });
      it("at", () => {
        core.insert.initial(nA);
        core.insert.at(0, nB);
        expect(core.head?.id).toBe("b");
        expect(core.tail?.id).toBe("a");

        const nD = makeDetail(4, "d");
        core.insert.at(-1, nD);
        expect(core.head?.id).toBe("d");
        const nE = makeDetail(5, "e");
        core.insert.at(Infinity, nE);
        expect(core.tail?.id).toBe("e");

        const nF = makeDetail(6, "f");
        core.insert.at(1, nF);
        expect(core.head?.next?.id).toBe("f");
      });
      it("before", () => {
        core.insert.initial(nA);
        core.insert.tail(nB);
        core.insert.before(nC, "b");
        expect(core.head?.id).toBe("a");
        expect(core.head?.next?.id).toBe("c");
        expect(() =>
          core.insert.before(makeDetail(2, "b"), "nonexistent"),
        ).toThrow();
        core.insert.before(makeDetail(4, "d"), 0);
        expect(core.head?.id).toBe("d");
        core.insert.before(makeDetail(5, "e"), "d");
        expect(core.head?.id).toBe("e");
      });
      it("after", () => {
        core.insert.initial(nA);
        core.insert.tail(nB);
        core.insert.after(nC, "a");
        expect(core.head?.id).toBe("a");
        expect(core.head?.next?.id).toBe("c");
        expect(core.tail?.id).toBe("b");
        expect(() =>
          core.insert.after(makeDetail(3, "c"), "nonexistent"),
        ).toThrow();
        core.insert.after(makeDetail(4, "d"), 0);
        expect(core.head?.next?.id).toBe("d");
        core.insert.after(makeDetail(5, "e"), "b");
        expect(core.tail?.id).toBe("e");
      });
    });
    describe("circular", () => {
      let core2: ReturnType<
        typeof createCore<"doublyLinkedListCircular", Data>
      >;
      beforeEach(() => {
        core2 = createCore<"doublyLinkedListCircular", Data>(
          "doublyLinkedListCircular",
        );
        core2.reset();
      });

      it("initial", () => {
        core2.insert.initial(makeDetail(1, "a"));
        expect(core2.head?.id).toBe("a");
        expect(core2.tail?.id).toBe("a");
        expect(core2.head?.next?.id).toBe("a");
        expect(core2.head?.prev?.id).toBe("a");
      });

      it("head", () => {
        core2.insert.initial(makeDetail(1, "a"));
        core2.insert.head(makeDetail(2, "b"));
        expect(core2.head?.id).toBe("b");
        expect(core2.tail?.id).toBe("a");
        expect(core2.head?.next?.id).toBe("a");
        expect(core2.head?.prev?.id).toBe("a");
        expect(core2.tail?.next?.id).toBe("b");
        expect(core2.tail?.prev?.id).toBe("b");
        core2.reset();
        core2.insert.head(nB);
        expect(core2.head?.id).toBe("b");
      });

      it("tail", () => {
        core2.insert.initial(makeDetail(1, "a"));
        core2.insert.tail(makeDetail(2, "b"));
        expect(core2.head?.id).toBe("a");
        expect(core2.tail?.id).toBe("b");
        expect(core2.head?.next?.id).toBe("b");
        expect(core2.head?.prev?.id).toBe("b");
        expect(core2.tail?.next?.id).toBe("a");
        expect(core2.tail?.prev?.id).toBe("a");
        core2.reset();
        core2.insert.tail(nB);
        expect(core2.tail?.id).toBe("b");
      });

      it("multiple", () => {
        core2.insert.initial(makeDetail(1, "a"));
        core2.insert.tail(makeDetail(2, "b"));
        core2.insert.head(makeDetail(3, "c"));
        expect(core2.head?.id).toBe("c");
        expect(core2.head?.next?.id).toBe("a");
        expect(core2.head?.prev?.id).toBe("b");
        expect(core2.tail?.id).toBe("b");
        expect(core2.tail?.next?.id).toBe("c");
        expect(core2.tail?.prev?.id).toBe("a");
      });
      it("at", () => {
        core2.insert.initial(makeDetail(1, "a"));
        core2.insert.at(0, makeDetail(2, "b"));
        expect(core2.head?.id).toBe("b");
        expect(core2.tail?.id).toBe("a");
        expect(core2.head?.next?.id).toBe("a");
        expect(core2.head?.prev?.id).toBe("a");

        const nD = makeDetail(3, "d");
        core2.insert.at(-1, nD);
        expect(core2.head?.id).toBe("d");
        expect(core2.tail?.id).toBe("a");
        expect(core2.head?.next?.id).toBe("b");
        expect(core2.head?.prev?.id).toBe("a");

        const nE = makeDetail(4, "e");
        core2.insert.at(Infinity, nE);
        expect(core2.tail?.id).toBe("e");
        expect(core2.tail?.next?.id).toBe("d");
        expect(core2.tail?.prev?.id).toBe("a");

        const nF = makeDetail(5, "f");
        core2.insert.at(1, nF);
        expect(core2.head?.next?.id).toBe("f");
      });
      it("before", () => {
        core2.insert.initial(makeDetail(1, "a"));
        core2.insert.tail(makeDetail(2, "b"));
        core2.insert.before(makeDetail(3, "c"), "b");
        expect(core2.head?.id).toBe("a");
        expect(core2.head?.next?.id).toBe("c");
        expect(core2.head?.prev?.id).toBe("b");
        expect(() =>
          core2.insert.before(makeDetail(4, "d"), "nonexistent"),
        ).toThrow();
      });
      it("after", () => {
        core2.insert.initial(makeDetail(1, "a"));
        core2.insert.tail(makeDetail(2, "b"));
        core2.insert.after(makeDetail(3, "c"), "a");
        expect(core2.head?.id).toBe("a");
        expect(core2.head?.next?.id).toBe("c");
        expect(core2.head?.prev?.id).toBe("b");
        expect(core2.tail?.id).toBe("b");
        expect(() =>
          core2.insert.after(makeDetail(4, "d"), "nonexistent"),
        ).toThrow();
      });
    });
  });

  describe("iterator methods", () => {
    it("reduce", () => {
      core.insert.tail(makeDetail(1, "a"));
      core.insert.tail(makeDetail(2, "b"));
      core.insert.tail(makeDetail(3, "c"));
      expect(
        core.reduce(
          (acc, { node }) => acc + String(node.data.value),
          "",
          "forward",
        ),
      ).toBe("123");
      expect(
        core.reduce(
          (acc, { node }) => acc + String(node.data.value),
          "",
          "backward",
        ),
      ).toBe("321");
    });
    it("map", () => {
      core.insert.tail(makeDetail(1, "a"));
      core.insert.tail(makeDetail(2, "b"));
      core.insert.tail(makeDetail(3, "c"));
      expect(core.map(({ node }) => node.data.value, "forward")).toEqual([
        1, 2, 3,
      ]);
      expect(core.map(({ node }) => node.data.value, "backward")).toEqual([
        3, 2, 1,
      ]);
    });
    it("filter", () => {
      core.insert.tail(makeDetail(1, "a"));
      core.insert.tail(makeDetail(2, "b"));
      core.insert.tail(makeDetail(3, "c"));
      expect(
        core
          .filter(({ node }) => node.data.value > 1)
          .map(({ node }) => node.data.value),
      ).toEqual([2, 3]);
      expect(
        core
          .filter(({ node }) => node.data.value < 3, "backward")
          .map(({ node }) => node.data.value),
      ).toEqual([2, 1]);
    });
    it("forEach", () => {
      const results: string[] = [];
      core.insert.tail(makeDetail(1, "a"));
      core.insert.tail(makeDetail(2, "b"));
      core.insert.tail(makeDetail(3, "c"));
      core.forEach(({ node }) => results.push(node.id), "forward");
      expect(results).toEqual(["a", "b", "c"]);
      results.length = 0; // Clear results for backward traversal
      core.forEach(({ node }) => results.push(node.id), "backward");
      expect(results).toEqual(["c", "b", "a"]);
    });
  });
  it("extract", () => {
    core.insert.head(makeDetail(1, "a"));
    core.insert.tail(makeDetail(2, "b"));
    core.insert.tail(makeDetail(3, "c"));
    // by ID
    expect(core.extract("b")?.node.id).toBe("b");
    // by index
    expect(core.extract(0)?.node.id).toBe("a");
    // by predicate
    expect(core.extract(({ node }) => node.id === "c")?.node.id).toBe("c");
    expect(core.extract("nonexistent")).toBeUndefined();
    core.reset();
    expect(core.extract(0)).toBeUndefined();
    expect(core.extract("nonexistent")).toBeUndefined();
  });
  it("move", () => {
    core.insert.head(makeDetail(1, "a"));
    core.insert.tail(makeDetail(2, "b"));
    core.insert.tail(makeDetail(3, "c"));

    core.move("a", "b", "after");
    expect(core.head?.id).toBe("b");
    expect(core.head?.next?.id).toBe("a");
    expect(core.head?.next?.next?.id).toBe("c");

    core.move("c", "a", "before");
    expect(core.tail?.id).toBe("a");
    expect(core.tail?.prev?.id).toBe("c");
    expect(core.tail?.prev?.prev?.id).toBe("b");
    core.insert.tail(makeDetail(4, "d"));
    expect(() => core.move("a", "a")).not.toThrow();

    expect(() => core.move("a", "nonexistent")).toThrow();
    expect(() => core.move("nonexistent", "a")).toThrow();
  });
  it("traverse", () => {
    core.insert.tail(makeDetail(1, "a"));
    core.insert.tail(makeDetail(2, "b"));
    core.insert.tail(makeDetail(3, "c"));

    const forward = Array.from(core.traverse.forward()).map((y) => y.node.id);
    expect(forward).toEqual(["a", "b", "c"]);

    const backward = Array.from(core.traverse.backward()).map((y) => y.node.id);
    expect(backward[0]).toBe("c");
    expect(backward[backward.length - 1]).toBe("a");
    core.reset();
    expect(core.traverse.forward().next().value).toBe(undefined);
    expect(core.traverse.backward().next().value).toBe(undefined);

    const core2 = createCore<"doublyLinkedListCircular", Data>(
      "doublyLinkedListCircular",
    );
    core2.insert.tail(makeDetail(1, "a"));
    core2.insert.tail(makeDetail(2, "b"));
    core2.insert.tail(makeDetail(3, "c"));
    const ids: any[] = [];
    for (const { node } of core2.traverse.forward()) ids.push(node.id);
    expect(ids).toEqual(["a", "b", "c"]);
    ids.length = 0;
    for (const { node } of core2.traverse.backward()) ids.push(node.id);
    expect(ids).toEqual(["c", "b", "a"]);
  });
  it("find", () => {
    core.insert.tail(makeDetail(1, "a"));
    core.insert.tail(makeDetail(2, "b"));
    core.insert.tail(makeDetail(3, "c"));

    expect(core.find(({ node }) => node.id === "b")?.node.id).toBe("b");
    expect(core.find(({ node }) => node.data.value > 2)?.node.id).toBe("c");
    expect(core.find(({ node }) => node.data.value < 1)).toBeUndefined();
  });
  describe("get", () => {
    it("byIndex", () => {
      core.insert.tail(makeDetail(1, "a"));
      core.insert.tail(makeDetail(2, "b"));
      core.insert.tail(makeDetail(3, "c"));
      expect(core.get.byIndex(0)?.node.id).toBe("a");
      expect(core.get.byIndex(1)?.node.id).toBe("b");
      expect(core.get.byIndex(2)?.node.id).toBe("c");
      expect(core.get.byIndex(3)).toBeUndefined();
    });

    it("byId", () => {
      core.insert.tail(makeDetail(1, "a"));
      core.insert.tail(makeDetail(2, "b"));
      core.insert.tail(makeDetail(3, "c"));
      expect(core.get.byId("a")?.node.id).toBe("a");
      expect(core.get.byId("b")?.node.id).toBe("b");
      expect(core.get.byId("c")?.node.id).toBe("c");
      expect(core.get.byId("nonexistent")).toBeUndefined();
    });

    it("byIndexOrId", () => {
      core.insert.tail(makeDetail(1, "a"));
      core.insert.tail(makeDetail(2, "b"));
      core.insert.tail(makeDetail(3, "c"));
      expect(core.get.byIndexOrId(0)?.node.id).toBe("a");
      expect(core.get.byIndexOrId("b")?.node.id).toBe("b");
      expect(core.get.byIndexOrId(2)?.node.id).toBe("c");
      expect(core.get.byIndexOrId("nonexistent")).toBeUndefined();
    });
  });

  it("reset", () => {
    core.insert.tail(makeDetail(1, "a"));
    core.insert.tail(makeDetail(2, "b"));
    core.reset();
    expect(core.head).toBeUndefined();
    expect(core.tail).toBeUndefined();
    expect(Array.from(core)).toEqual([]);
  });
});
