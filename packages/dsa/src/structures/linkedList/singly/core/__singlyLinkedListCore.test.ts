import { describe, it, expect } from "vitest";
import { createCore } from "./singlyLinkedListCore";

interface D {
  value: number;
}
const makeDetail = (value: number, id?: string) => ({
  id: id ?? String(value),
  data: { value },
});

describe("Singly Linked List Core", () => {
  describe("Insert", () => {
    describe("Normal", () => {
      describe("initial", () => {
        it("sets head and tail to the new node", () => {
          const core = createCore<"singlyLinkedList", D>("singlyLinkedList");
          core.insert.initial(makeDetail(1));
          expect(core.head?.data.value).toBe(1);
          expect(core.tail?.data.value).toBe(1);
          expect(core.head).toBe(core.tail);
        });
      });
      describe("head", () => {
        it("inserts at head when list is empty", () => {
          const core = createCore<"singlyLinkedList", D>("singlyLinkedList");
          core.insert.head(makeDetail(1));
          expect(core.head?.data.value).toBe(1);
          expect(core.tail?.data.value).toBe(1);
        });
        it("inserts at head when list is not empty", () => {
          const core = createCore<"singlyLinkedList", D>("singlyLinkedList");
          core.insert.head(makeDetail(1));
          core.insert.head(makeDetail(2));
          expect(core.head?.data.value).toBe(2);
          expect(core.tail?.data.value).toBe(1);
          expect(core.head?.next).toBe(core.tail);
        });
      });
      describe("tail", () => {
        it("inserts at tail when list is empty", () => {
          const core = createCore<"singlyLinkedList", D>("singlyLinkedList");
          core.insert.tail(makeDetail(1));
          expect(core.head?.data.value).toBe(1);
          expect(core.tail?.data.value).toBe(1);
        });
        it("inserts at tail when list is not empty", () => {
          const core = createCore<"singlyLinkedList", D>("singlyLinkedList");
          core.insert.head(makeDetail(1));
          core.insert.tail(makeDetail(2));
          expect(core.tail?.data.value).toBe(2);
          expect(core.head?.next).toBe(core.tail);
        });
      });
      describe("at", () => {
        it("inserts at head if index <= 0 or list is empty", () => {
          const core = createCore<"singlyLinkedList", D>("singlyLinkedList");
          core.insert.at(0, makeDetail(1));
          expect(core.head?.data.value).toBe(1);
          core.insert.at(-1, makeDetail(2));
          expect(core.head?.data.value).toBe(2);
        });
        it("inserts at tail if index >= size", () => {
          const core = createCore<"singlyLinkedList", D>("singlyLinkedList");
          [1, 2].forEach((v) => core.insert.tail(makeDetail(v)));
          core.insert.at(10, makeDetail(3));
          expect(core.tail?.data.value).toBe(3);
        });
        it("inserts at middle index", () => {
          const core = createCore<"singlyLinkedList", D>("singlyLinkedList");
          [1, 3].forEach((v) => core.insert.tail(makeDetail(v)));
          core.insert.at(1, makeDetail(2));
          expect(core.get.byIndex(1)?.node.data.value).toBe(2);
        });
      });
      describe("after", () => {
        it("inserts after a node and updates tail if needed", () => {
          const core = createCore<"singlyLinkedList", D>("singlyLinkedList");
          [1, 2].forEach((v) => core.insert.tail(makeDetail(v)));
          core.insert.after(makeDetail(3), core.tail!.id);
          expect(core.tail?.data.value).toBe(3);
          expect(core.tail?.next).toBeUndefined();
          core.insert.after(makeDetail(4), 1);
          core.insert.after(makeDetail(5), core.get.byIndex(1)!.node.id);
          expect(core.get.byIndex(2)?.node.next?.data.value).toBe(4);
        });
        it("throws if target not found", () => {
          const core = createCore<"singlyLinkedList", D>("singlyLinkedList");
          expect(() => core.insert.after(makeDetail(1), "notfound")).toThrow();
        });
      });
      describe("before", () => {
        it("inserts before head", () => {
          const core = createCore<"singlyLinkedList", D>("singlyLinkedList");
          [1, 2].forEach((v) => core.insert.tail(makeDetail(v)));
          core.insert.before(makeDetail(0), core.head!.id);
          expect(core.head?.data.value).toBe(0);
        });
        it("inserts before a non-head node", () => {
          const core = createCore<"singlyLinkedList", D>("singlyLinkedList");
          [1, 2, 3].forEach((v) => core.insert.tail(makeDetail(v)));
          core.insert.before(makeDetail(1.5), core.get.byIndex(1)!.node.id);
          expect(core.get.byIndex(1)?.node.data.value).toBe(1.5);
          expect(core.get.byIndex(2)?.node.data.value).toBe(2);
        });
        it("throws if target not found", () => {
          const core = createCore<"singlyLinkedList", D>("singlyLinkedList");
          expect(() => core.insert.before(makeDetail(1), "notfound")).toThrow();
        });
      });
    });
    describe("Circular", () => {
      describe("initial", () => {
        it("sets head, tail, and tail.next to itself", () => {
          const core = createCore<"singlyLinkedListCircular", D>(
            "singlyLinkedListCircular",
          );
          core.insert.initial(makeDetail(1));
          expect(core.head?.data.value).toBe(1);
          expect(core.tail?.data.value).toBe(1);
          expect(core.tail?.next).toBe(core.head);
        });
      });
      describe("head", () => {
        it("inserts at head when list is empty", () => {
          const core = createCore<"singlyLinkedListCircular", D>(
            "singlyLinkedListCircular",
          );
          core.insert.head(makeDetail(1));
          expect(core.head?.data.value).toBe(1);
          expect(core.tail?.next).toBe(core.head);
        });
        it("inserts at head when list is not empty and updates tail.next", () => {
          const core = createCore<"singlyLinkedListCircular", D>(
            "singlyLinkedListCircular",
          );
          core.insert.head(makeDetail(1));
          core.insert.head(makeDetail(2));
          expect(core.head?.data.value).toBe(2);
          expect(core.tail?.next).toBe(core.head);
        });
      });
      describe("tail", () => {
        it("inserts at tail when list is empty", () => {
          const core = createCore<"singlyLinkedListCircular", D>(
            "singlyLinkedListCircular",
          );
          core.insert.tail(makeDetail(1));
          expect(core.head?.data.value).toBe(1);
          expect(core.tail?.data.value).toBe(1);
          expect(core.tail?.next).toBe(core.head);
        });
        it("inserts at tail when list is not empty", () => {
          const core = createCore<"singlyLinkedListCircular", D>(
            "singlyLinkedListCircular",
          );
          core.insert.head(makeDetail(1));
          core.insert.tail(makeDetail(2));
          expect(core.tail?.data.value).toBe(2);
          expect(core.tail?.next).toBe(core.head);
        });
      });
      describe("at", () => {
        it("inserts at head if index <= 0 or list is empty", () => {
          const core = createCore<"singlyLinkedListCircular", D>(
            "singlyLinkedListCircular",
          );
          core.insert.at(0, makeDetail(1));
          expect(core.head?.data.value).toBe(1);
          core.insert.at(-1, makeDetail(2));
          expect(core.head?.data.value).toBe(2);
        });
        it("inserts at tail if index >= size", () => {
          const core = createCore<"singlyLinkedListCircular", D>(
            "singlyLinkedListCircular",
          );
          [1, 2].forEach((v) => core.insert.tail(makeDetail(v)));
          core.insert.at(10, makeDetail(3));
          expect(core.tail?.data.value).toBe(3);
        });
        it("inserts at middle index", () => {
          const core = createCore<"singlyLinkedListCircular", D>(
            "singlyLinkedListCircular",
          );
          [1, 3].forEach((v) => core.insert.tail(makeDetail(v)));
          core.insert.at(1, makeDetail(2));
          expect(core.get.byIndex(1)?.node.data.value).toBe(2);
        });
      });
      describe("after", () => {
        it("inserts after a node and updates tail if needed", () => {
          const core = createCore<"singlyLinkedListCircular", D>(
            "singlyLinkedListCircular",
          );
          [1, 2].forEach((v) => core.insert.tail(makeDetail(v)));
          core.insert.after(makeDetail(3), core.tail!.id);
          expect(core.tail?.data.value).toBe(3);
          expect(core.tail?.next).toBe(core.head);
        });
        it("throws if target not found", () => {
          const core = createCore<"singlyLinkedListCircular", D>(
            "singlyLinkedListCircular",
          );
          expect(() => core.insert.after(makeDetail(1), "notfound")).toThrow();
        });
      });
      describe("before", () => {
        it("inserts before head", () => {
          const core = createCore<"singlyLinkedListCircular", D>(
            "singlyLinkedListCircular",
          );
          [1, 2].forEach((v) => core.insert.tail(makeDetail(v)));
          core.insert.before(makeDetail(0), core.head!.id);
          expect(core.head?.data.value).toBe(0);
        });
        it("inserts before a non-head node", () => {
          const core = createCore<"singlyLinkedListCircular", D>(
            "singlyLinkedListCircular",
          );
          [1, 2, 3].forEach((v) => core.insert.tail(makeDetail(v)));
          core.insert.before(makeDetail(1.5), core.get.byIndex(1)!.node.id);
          expect(core.get.byIndex(1)?.node.data.value).toBe(1.5);
          expect(core.get.byIndex(2)?.node.data.value).toBe(2);
        });
        it("throws if target not found", () => {
          const core = createCore<"singlyLinkedListCircular", D>(
            "singlyLinkedListCircular",
          );
          expect(() => core.insert.before(makeDetail(1), "notfound")).toThrow();
        });
      });
    });
  });

  describe("General/Shared", () => {
    it("iterator, map, reduce, filter, forEach, find", () => {
      const core = createCore<"singlyLinkedList", D>("singlyLinkedList");
      [1, 2, 3].forEach((v) => core.insert.tail(makeDetail(v)));
      expect([...core].map((y) => y.node.data.value)).toEqual([1, 2, 3]);
      expect(core.map((y) => y.node.data.value)).toEqual([1, 2, 3]);
      expect(core.reduce((acc, y) => acc + y.node.data.value, 0)).toBe(6);
      expect(core.filter((y) => y.node.data.value > 1).length).toBe(2);
      let sum = 0;
      core.forEach((y) => (sum += y.node.data.value));
      expect(sum).toBe(6);
      expect(core.find((y) => y.node.data.value === 2)?.node.data.value).toBe(
        2,
      );
      const core2 = createCore<"singlyLinkedListCircular", D>(
        "singlyLinkedListCircular",
      );
      [1, 2, 3].forEach((v) => core2.insert.tail(makeDetail(v)));
      expect([...core2].map((y) => y.node.data.value)).toEqual([1, 2, 3]);
    });
    it("getPrev, get.byIndex, get.byId, get.byIndexOrId", () => {
      const core = createCore<"singlyLinkedList", D>("singlyLinkedList");
      [1, 2, 3].forEach((v) => core.insert.tail(makeDetail(v)));
      expect(core.getPrev(2)?.node.data.value).toBe(2);
      expect(core.getPrev(5)).toBeUndefined();
      expect(core.get.byIndex(1)?.node.data.value).toBe(2);
      expect(core.get.byId("3")?.node.data.value).toBe(3);
      expect(core.get.byIndexOrId(0)?.node.data.value).toBe(1);
      expect(core.get.byIndexOrId("2")?.node.data.value).toBe(2);
    });
    it("has works for index, id, and node", () => {
      const core = createCore<"singlyLinkedList", D>("singlyLinkedList");
      [1, 2, 3].forEach((v) => core.insert.tail(makeDetail(v)));
      expect(core.has(0)).toBe(true);
      expect(core.has("2")).toBe(true);
      expect(core.has(core.head!.id)).toBe(true);
      expect(core.has({} as any)).toBe(false);
      expect(core.has("nonexistent")).toBe(false);
    });
    it("extract removes nodes by index, id, or predicate", () => {
      const core = createCore<"singlyLinkedList", D>("singlyLinkedList");
      [1, 2, 3].forEach((v) => core.insert.tail(makeDetail(v)));

      // Remove the tail node (id: '3')
      expect(core.tail?.data.value).toBe(3);
      const extracted = core.extract("3");
      expect(extracted?.node.data.value).toBe(3);

      // Now the new tail should be node with value 2
      expect(core.tail?.data.value).toBe(2);

      // Remove the new tail (id: '2')
      const extracted2 = core.extract("2");
      expect(extracted2?.node.data.value).toBe(2);
      expect(core.tail?.data.value).toBe(1);

      // Remove the last node (id: '1'), which is both head and tail
      const extracted3 = core.extract("1");
      expect(extracted3?.node.data.value).toBe(1);
      expect(core.tail).toBeUndefined();
      expect(core.head).toBeUndefined();
    });
    it("move works and throws on invalid", () => {
      const core = createCore<"singlyLinkedList", D>("singlyLinkedList");
      [1, 2, 3].forEach((v) => core.insert.tail(makeDetail(v)));
      core.move("1", 1, "after");
      expect(core.get.byIndex(2)?.node.data.value).toBe(1);
      core.move("2", 0, "before");
      expect(core.get.byIndex(0)?.node.data.value).toBe(2);
      expect(() => core.move("nonexistent", 0)).toThrow();
      expect(() => core.move(0, "nonexistent")).toThrow();
      // Move node to itself (should do nothing)
      core.move(0, 0, "before");
      expect(core.head?.data.value).toBe(2);
    });
    it("reset clears the list", () => {
      const core = createCore<"singlyLinkedList", D>("singlyLinkedList");
      [1, 2, 3].forEach((v) => core.insert.tail(makeDetail(v)));
      expect(core.head).toBeDefined();
      expect(core.tail).toBeDefined();
      core.reset();
      expect(core.head).toBeUndefined();
      expect(core.tail).toBeUndefined();
      expect(core.get.byIndex(0)).toBeUndefined();
    });
  });
});
