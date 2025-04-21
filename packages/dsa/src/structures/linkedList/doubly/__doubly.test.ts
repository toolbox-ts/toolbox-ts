import { describe, expect, it } from "vitest";
import { create } from "./doubly.js";

describe("DoublyLinkedList", () => {
  describe("Creation and Basic", () => {
    it("creates empty list", () => {
      const list = create();
      expect(list.size).toBe(0);
      expect(list.head).toBeUndefined();
      expect(list.tail).toBeUndefined();
    });
    it("creates list with initial nodes", () => {
      const list = create([
        { id: "node1", data: { value: 1 } },
        { id: "node2", data: { value: 2 } },
      ]);
      expect(list.size).toBe(2);
      expect(list.head?.id).toBe("node1");
      expect(list.tail?.id).toBe("node2");
    });
    it("resets", () => {
      const list = create([
        { id: "node1", data: { value: 1 } },
        { id: "node2", data: { value: 2 } },
      ]);

      list.reset();

      expect(list.size).toBe(0);
      expect(list.head).toBeUndefined();
      expect(list.tail).toBeUndefined();
    });
    describe("get(index)", () => {
      it("returns undefined for negative index", () => {
        const list = create([{ id: "a", data: {} }]);
        expect(list.get(-1)).toBeUndefined();
      });

      it("returns undefined for index >= size", () => {
        const list = create([{ id: "a", data: {} }]);
        expect(list.get(1)).toBeUndefined();
        expect(list.get(99)).toBeUndefined();
      });

      it("gets node at index 0 (head)", () => {
        const list = create([
          { id: "a", data: {} },
          { id: "b", data: {} },
          { id: "c", data: {} },
        ]);
        const node = list.get(0);
        expect(node?.id).toBe("a");
      });

      it("gets node at middle index (forward)", () => {
        const list = create([
          { id: "a", data: {} },
          { id: "b", data: {} },
          { id: "c", data: {} },
        ]);
        const node = list.get(1);
        expect(node?.id).toBe("b");
      });

      it("gets node at last index (reverse)", () => {
        const list = create([
          { id: "a", data: {} },
          { id: "b", data: {} },
          { id: "c", data: {} },
        ]);
        const node = list.get(2);
        expect(node?.id).toBe("c");
      });
    });
    it("getIndex", () => {
      const list = create([
        { id: "node1", data: { value: 1 } },
        { id: "node2", data: { value: 2 } },
      ]);
      expect(list.getIndex("node1")).toBe(0);
      expect(list.getIndex("node2")).toBe(1);
      expect(list.getIndex("nonexistent")).toBeUndefined();
    });
  });
  describe("Node Operations", () => {
    it("setHead", () => {
      const list = create()
        .setHead({ id: "node1", data: { value: 1 } })
        .setHead({ id: "node2", data: { value: 2 } });

      expect(list.size).toBe(1);
      expect(list.head?.id).toBe("node2");
      expect(list.tail?.id).toBe("node2");
    });
    describe("removeHead", () => {
      const list = create();
      it("handles removing head from an empty list", () => {
        list.removeHead();
        expect(list.size).toBe(0);
        expect(list.head).toBeUndefined();
        expect(list.tail).toBeUndefined();
      });

      it("removes head from a list with single node", () => {
        const node = { data: "A", id: "id-a" };
        list.append(node);

        expect(list.size).toBe(1);
        expect(list.head?.data).toBe("A");
        expect(list.tail?.data).toBe("A");

        list.removeHead();

        expect(list.size).toBe(0);
        expect(list.head).toBeUndefined();
        expect(list.tail).toBeUndefined();
      });

      it("removes head from a list with multiple nodes", () => {
        const nodeA = { data: "A", id: "id-a" };
        const nodeB = { data: "B", id: "id-b" };
        const nodeC = { data: "C", id: "id-c" };

        list.append(nodeA).append(nodeB).append(nodeC);

        expect(list.size).toBe(3);
        expect(list.head?.data).toBe("A");

        list.removeHead();

        expect(list.size).toBe(2);
        expect(list.head?.data).toBe("B");

        const items = Array.from(list.forward());
        expect(items.map((i) => i.data)).toEqual(["B", "C"]);

        const reverseItems = Array.from(list.reverse());
        expect(reverseItems.map((i) => i.data)).toEqual(["C", "B"]);
      });

      it("handles successive removeHead operations correctly", () => {
        const list2 = create();
        const nodeA = { data: "A", id: "id-a" };
        const nodeB = { data: "B", id: "id-b" };
        const nodeC = { data: "C", id: "id-c" };

        list2.append(nodeA).append(nodeB).append(nodeC);

        list2.removeHead();
        expect(list2.size).toBe(2);
        expect(list2.head?.data).toBe("B");

        list2.removeHead();
        expect(list2.size).toBe(1);
        expect(list2.head?.data).toBe("C");
        expect(list2.tail?.data).toBe("C");

        list2.removeHead();
        expect(list2.size).toBe(0);
        expect(list2.head).toBeUndefined();
        expect(list2.tail).toBeUndefined();

        list2.removeHead();
        expect(list2.size).toBe(0);
      });
    });
    describe("Insertion", () => {
      it("append", () => {
        const list = create()
          .append({ id: "node1", data: { value: 1 } })
          .append({ id: "node2", data: { value: 2 } });

        expect(list.size).toBe(2);
        expect(list.tail?.id).toBe("node2");
        // Remove access to internal next links
        expect(list.get(0)?.id).toBe("node1");
        expect(list.get(1)?.id).toBe("node2");
      });
      it("prepend", () => {
        const list = create()
          .prepend({ id: "node1", data: { value: 1 } })
          .prepend({ id: "node2", data: { value: 2 } });

        expect(list.size).toBe(2);
        expect(list.head?.id).toBe("node2");
        expect(list.get(1)?.id).toBe("node1");
      });
      it("insert by index", () => {
        const list = create([
          { id: "node1", data: { value: 1 } },
          { id: "node3", data: { value: 3 } },
        ]);
        list.insert({
          indexOrId: 1,
          node: { id: "node2", data: { value: 2 } },
        });
        expect(list.size).toBe(3);
      });
      describe("insert by id", () => {
        it("inserts before a node by ID", () => {
          const list = create<string>();
          list.append({ data: "A", id: "id-a" });
          list.append({ data: "B", id: "id-b" });
          list.append({ data: "C", id: "id-c" });

          list.insert({
            indexOrId: "id-b",
            node: { data: "X", id: "id-x" },
            position: "before",
          });

          const items = Array.from(list.forward());
          expect(items.map((i) => i.data)).toEqual(["A", "X", "B", "C"]);
        });

        it("inserts after a node by ID", () => {
          const list = create<string>();
          list.append({ data: "A", id: "id-a" });
          list.append({ data: "B", id: "id-b" });
          list.append({ data: "C", id: "id-c" });

          list.insert({
            indexOrId: "id-b",
            node: { data: "Y", id: "id-y" },
            position: "after",
          });

          const items = Array.from(list.forward());
          expect(items.map((i) => i.data)).toEqual(["A", "B", "Y", "C"]);
        });

        it("inserts before the head node by ID", () => {
          const list = create<string>();
          list.append({ data: "A", id: "id-a" });
          list.append({ data: "B", id: "id-b" });

          list.insert({
            indexOrId: "id-a",
            node: { data: "Z", id: "id-z" },
            position: "before",
          });

          const items = Array.from(list.forward());
          expect(items.map((i) => i.data)).toEqual(["Z", "A", "B"]);
        });

        it("inserts after the tail node by ID", () => {
          const list = create<string>();
          list.append({ data: "A", id: "id-a" });
          list.append({ data: "B", id: "id-b" });

          list.insert({
            indexOrId: "id-b",
            node: { data: "W", id: "id-w" },
            position: "after",
          });

          const items = Array.from(list.forward());
          expect(items.map((i) => i.data)).toEqual(["A", "B", "W"]);
        });

        it("does not insert if the ID is not found", () => {
          const list = create<string>();
          list.append({ data: "A", id: "id-a" });
          list.append({ data: "B", id: "id-b" });

          list.insert({
            indexOrId: "id-nonexistent",
            node: { data: "V", id: "id-v" },
            position: "before",
          });

          const items = Array.from(list.forward());
          expect(items.map((i) => i.data)).toEqual(["A", "B"]);
        });
      });
    });
    describe("Removal", () => {
      it("remove", () => {
        const list = create([
          { id: "node1", data: { value: 1 } },
          { id: "node2", data: { value: 2 } },
        ]);

        list.remove(0);
        expect(list.size).toBe(1);
        expect(list.head?.id).toBe("node2");
        list.reset();
        list.remove(0);
        expect(list.size).toBe(0);
      });
      it("head", () => {
        const list = create([
          { id: "node1", data: { value: 1 } },
          { id: "node2", data: { value: 2 } },
        ]);

        list.removeHead();
        expect(list.size).toBe(1);
        expect(list.head?.id).toBe("node2");
      });
      it("pop", () => {
        const list = create([
          { id: "node1", data: { value: 1 } },
          { id: "node2", data: { value: 2 } },
        ]);

        const popped = list.pop();

        expect(popped?.id).toBe("node2");
        expect(list.size).toBe(1);
        expect(list.tail?.id).toBe("node1");
        const popped2 = list.pop();
        expect(popped2?.id).toBe("node1");
        expect(list.size).toBe(0);
        expect(list.head).toBeUndefined();
        expect(list.tail).toBeUndefined();
      });
      it("by index or id", () => {
        const list = create([
          { id: "node1", data: { value: 1 } },
          { id: "node2", data: { value: 2 } },
          { id: "node3", data: { value: 3 } },
        ]);

        list.remove(1);
        expect(list.size).toBe(2);
        expect(list.get(1)?.id).toBe("node3");

        list.remove("node3");
        expect(list.size).toBe(1);
        expect(list.tail?.id).toBe("node1");
      });
      describe("extract", () => {
        it("extracts node by id and returns its data", () => {
          const list = create([
            { id: "1", data: "A" },
            { id: "2", data: "B" },
            { id: "3", data: "C" },
          ]);

          const extracted = list.extract("2");

          expect(extracted).toEqual({ id: "2", data: "B" });
          expect(list.size).toBe(2);
          expect([...list.forward()]).toEqual([
            { id: "1", data: "A", index: 0 },
            { id: "3", data: "C", index: 1 },
          ]);
        });

        it("returns undefined when extracting non-existent id", () => {
          const list = create([{ id: "1", data: "A" }]);
          expect(list.extract("nonexistent")).toBeUndefined();
        });
      });
    });
    describe("Movement", () => {
      describe("toIndex", () => {
        it("moves node to new index position", () => {
          const list = create([
            { id: "1", data: "A" },
            { id: "2", data: "B" },
            { id: "3", data: "C" },
            { id: "4", data: "D" },
          ]);

          list.moveToIndex("2", 2);

          expect([...list.forward()]).toEqual([
            { id: "1", data: "A", index: 0 },
            { id: "3", data: "C", index: 1 },
            { id: "2", data: "B", index: 2 },
            { id: "4", data: "D", index: 3 },
          ]);
        });

        it("handles moveToIndex to start of list", () => {
          const list = create([
            { id: "1", data: "A" },
            { id: "2", data: "B" },
            { id: "3", data: "C" },
          ]);

          list.moveToIndex("3", 0);

          expect([...list.forward()]).toEqual([
            { id: "3", data: "C", index: 0 },
            { id: "1", data: "A", index: 1 },
            { id: "2", data: "B", index: 2 },
          ]);
        });

        it("handles moveToIndex to end of list", () => {
          const list = create([
            { id: "1", data: "A" },
            { id: "2", data: "B" },
            { id: "3", data: "C" },
          ]);

          list.moveToIndex("1", 2);

          expect([...list.forward()]).toEqual([
            { id: "2", data: "B", index: 0 },
            { id: "3", data: "C", index: 1 },
            { id: "1", data: "A", index: 2 },
          ]);
        });

        it("returns this when moving non-existent id", () => {
          const list = create([{ id: "1", data: "A" }]);
          expect(list.moveToIndex("nonexistent", 0)).toBe(list);
        });
      });
      describe("toTarget", () => {
        it("moves node before target", () => {
          const list = create([
            { id: "1", data: "A" },
            { id: "2", data: "B" },
            { id: "3", data: "C" },
            { id: "4", data: "D" },
          ]);

          list.moveToTarget("3", "2", "before");

          expect([...list.forward()]).toEqual([
            { id: "1", data: "A", index: 0 },
            { id: "3", data: "C", index: 1 },
            { id: "2", data: "B", index: 2 },
            { id: "4", data: "D", index: 3 },
          ]);
        });

        it("moves node after target", () => {
          const list = create([
            { id: "1", data: "A" },
            { id: "2", data: "B" },
            { id: "3", data: "C" },
            { id: "4", data: "D" },
          ]);

          list.moveToTarget("1", "3", "after");

          expect([...list.forward()]).toEqual([
            { id: "2", data: "B", index: 0 },
            { id: "3", data: "C", index: 1 },
            { id: "1", data: "A", index: 2 },
            { id: "4", data: "D", index: 3 },
          ]);
        });

        it("handles move to start when before", () => {
          const list = create([
            { id: "1", data: "A" },
            { id: "2", data: "B" },
            { id: "3", data: "C" },
          ]);

          list.moveToTarget("3", "1", "before");

          expect([...list.forward()]).toEqual([
            { id: "3", data: "C", index: 0 },
            { id: "1", data: "A", index: 1 },
            { id: "2", data: "B", index: 2 },
          ]);
        });

        it("handles move to end when after", () => {
          const list = create([
            { id: "1", data: "A" },
            { id: "2", data: "B" },
            { id: "3", data: "C" },
          ]);

          list.moveToTarget("1", "3", "after");

          expect([...list.forward()]).toEqual([
            { id: "2", data: "B", index: 0 },
            { id: "3", data: "C", index: 1 },
            { id: "1", data: "A", index: 2 },
          ]);
        });

        it("returns this when target not found", () => {
          const list = create([{ id: "1", data: "A" }]);
          expect(list.moveToTarget("1", "nonexistent", "before")).toBe(list);
        });

        it("returns this when node to move not found", () => {
          const list = create([{ id: "1", data: "A" }]);
          expect(list.moveToTarget("nonexistent", "1", "after")).toBe(list);
        });

        it("maintains correct order after move", () => {
          const list = create([
            { id: "1", data: "A" },
            { id: "2", data: "B" },
            { id: "3", data: "C" },
          ]);

          list.moveToTarget("1", "3", "before");

          const nodes = [...list.forward()];
          expect(nodes[0].id).toBe("2");
          expect(nodes[1].id).toBe("1");
          expect(nodes[2].id).toBe("3");

          const reverseNodes = [...list.reverse()];
          expect(reverseNodes[0].id).toBe("3");
          expect(reverseNodes[1].id).toBe("1");
          expect(reverseNodes[2].id).toBe("2");
        });
      });
    });
  });

  describe("Traversal and Search", () => {
    it("traverses forward correctly", () => {
      const list = create([
        { id: "node1", data: { value: 1 } },
        { id: "node2", data: { value: 2 } },
      ]);

      const nodes = [...list.forward()];
      expect(nodes).toHaveLength(2);
      expect(nodes[0].id).toBe("node1");
    });
    it("traverses reverse correctly", () => {
      const list = create([
        { id: "node1", data: { value: 1 } },
        { id: "node2", data: { value: 2 } },
      ]);

      const nodes = [...list.reverse()];
      expect(nodes).toHaveLength(2);
      expect(nodes[0].id).toBe("node2");
    });
    it("finds nodes by id", () => {
      const list = create([
        { id: "node1", data: { value: 1 } },
        { id: "node2", data: { value: 2 } },
      ]);
      const found = list.find("node2");
      expect(found?.id).toBe("node2");
    });
    it("checks node existence", () => {
      const list = create([{ id: "node1", data: { value: 1 } }]);
      expect(list.has("node1")).toBe(true);
      expect(list.has("nonexistent")).toBe(false);
    });
  });
  describe("String Representation", () => {
    it("converts list to string", () => {
      const list = create([
        { id: "node1", data: { value: 1 } },
        { id: "node2", data: { value: 2 } },
      ]);

      expect(list.toString()).toBe("null←(node1)⇆(node2)→null");

      const emptyList = create();
      expect(emptyList.toString()).toBe("Empty List");
    });
  });
});
