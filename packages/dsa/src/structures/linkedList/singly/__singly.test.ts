import { beforeEach, describe, expect, it } from "vitest";
import * as Singly from "./singly.js";

// Helper to create test nodes with unique IDs if not provided
const createNode = <T>(data: T, id?: string) => ({
  data,
  id: id ?? String((Math.random() * Date.now()) / Math.PI),
});

describe("Singly Linked List", () => {
  let list: Singly.API<string>;

  beforeEach(() => {
    list = Singly.create<string>();
  });

  describe("Creation & Basic", () => {
    it("creates an empty list", () => {
      expect(list.size).toBe(0);
      expect(list.head).toBeUndefined();
      expect(list.tail).toBeUndefined();
      expect(list.toString()).toBe("Empty List");
    });
    it("creates a list with initial nodes", () => {
      const nodes = [createNode("A"), createNode("B"), createNode("C")];

      const populatedList = Singly.create(nodes);

      expect(populatedList.size).toBe(3);
      expect(populatedList.head?.data).toBe("A");
      expect(populatedList.tail?.data).toBe("C");

      const items = Array.from(populatedList.forward());
      expect(items.map((i) => i.data)).toEqual(["A", "B", "C"]);
    });
    it("append", () => {
      const nodeA = createNode("A");
      const nodeB = createNode("B");

      list.append(nodeA).append(nodeB);

      expect(list.size).toBe(2);
      expect(list.head?.data).toBe("A");
      expect(list.tail?.data).toBe("B");
    });
    it("prepend", () => {
      const nodeA = createNode("A");
      const nodeB = createNode("B");

      list.prepend(nodeA).prepend(nodeB);

      expect(list.size).toBe(2);
      expect(list.head?.data).toBe("B");
      expect(list.tail?.data).toBe("A");
    });
    it("toString", () => {
      const nodeA = createNode("A", "id-a");
      const nodeB = createNode("B", "id-b");

      list.append(nodeA).append(nodeB);

      expect(list.toString()).toBe("null→(id-a)→(id-b)→null");
    });
    it("setHead", () => {
      list.append(createNode("B", "id-b"));
      list.append(createNode("C", "id-c"));
      list.setHead(createNode("A", "id-a"));
      expect(list.head?.data).toBe("A");
    });
    it("get", () => {
      list.append(createNode("A", "id-a"));
      list.append(createNode("B", "id-b"));
      list.append(createNode("C", "id-c"));
      list.append(createNode("D", "id-d"));
      const got = list.get(3);
      expect(got?.id).toBe("id-d");
    });
  });
  describe("Insertion", () => {
    it("at indices", () => {
      const nodeA = createNode("A", "id-a");
      const nodeB = createNode("B", "id-b");
      const nodeC = createNode("C", "id-c");
      const nodeD = createNode("D", "id-d");

      list.append(nodeA).append(nodeB).append(nodeC);

      list.insert({ indexOrId: 1, node: nodeD });

      expect(list.size).toBe(4);
      const items = Array.from(list.forward());
      expect(items.map((i) => i.data)).toEqual(["A", "D", "B", "C"]);
    });
    it("before/after node by ID", () => {
      const nodeA = createNode("A", "id-a");
      const nodeB = createNode("B", "id-b");
      const nodeC = createNode("C", "id-c");
      const nodeD = createNode("D", "id-d");

      list.append(nodeA).append(nodeB).append(nodeC);

      list.insert({ indexOrId: "id-a", node: nodeD, position: "after" });

      expect(list.size).toBe(4);
      const items = Array.from(list.forward());
      expect(items.map((i) => i.data)).toEqual(["A", "D", "B", "C"]);

      // Insert before a specific node by ID
      const nodeE = createNode("E", "id-e");
      list.insert({ indexOrId: "id-c", node: nodeE, position: "before" });

      expect(list.size).toBe(5);
      const updatedItems = Array.from(list.forward());
      expect(updatedItems.map((i) => i.data)).toEqual([
        "A",
        "D",
        "B",
        "E",
        "C",
      ]);
    });
    it("edge cases", () => {
      const nodeA = createNode("A", "id-a");
      const nodeB = createNode("B", "id-b");
      const nodeC = createNode("C", "id-c");

      list.append(nodeA);

      // Insert at negative index (should prepend)
      list.insert({ indexOrId: -1, node: nodeB });
      expect(list.head?.data).toBe("B");

      list.insert({ indexOrId: 100, node: nodeC });
      expect(list.tail?.data).toBe("C");

      const sizeBefore = list.size;
      list.insert({ indexOrId: "non-existent-id", node: createNode("X") });
      expect(list.size).toBe(sizeBefore);

      const nodeD = createNode("D", "id-d");
      list.insert({ indexOrId: "id-b", node: nodeD, position: "before" });
      expect(list.head?.data).toBe("D");

      const nodeE = createNode("E", "id-e");
      list.insert({ indexOrId: "id-c", node: nodeE, position: "after" });
      expect(list.tail?.data).toBe("E");
    });
  });
  describe("Removal Operations", () => {
    beforeEach(() => {
      const nodes = [
        createNode("A", "id-a"),
        createNode("B", "id-b"),
        createNode("C", "id-c"),
        createNode("D", "id-d"),
      ];
      nodes.forEach((node) => list.append(node));
    });
    it("by index", () => {
      list.remove(1);
      expect(list.size).toBe(3);
      const items = Array.from(list.forward());
      expect(items.map((i) => i.data)).toEqual(["A", "C", "D"]);
    });
    it("by ID", () => {
      list.remove("id-b");
      expect(list.size).toBe(3);
      const items = Array.from(list.forward());
      expect(items.map((i) => i.data)).toEqual(["A", "C", "D"]);
      list.remove("non-existent");
      expect(list.size).toBe(3);
    });
    it("head node", () => {
      list.removeHead();
      expect(list.size).toBe(3);
      expect(list.head?.data).toBe("B");
      list.removeHead().removeHead();
      expect(list.size).toBe(1);
      expect(list.head?.data).toBe("D");
      expect(list.tail?.data).toBe("D");
      list.removeHead();
      expect(list.size).toBe(0);
      expect(list.head).toBeUndefined();
      expect(list.tail).toBeUndefined();
      list.removeHead();
      expect(list.size).toBe(0);
    });
    it("pop", () => {
      const popped = list.pop();
      expect(popped?.data).toBe("D");
      expect(list.size).toBe(3);
      expect(list.tail?.data).toBe("C");
      list.pop();
      list.pop();
      const lastNode = list.pop();
      expect(lastNode?.data).toBe("A");
      expect(list.size).toBe(0);
      const emptyPop = list.pop();
      expect(emptyPop).toBeUndefined();
    });
    it("extract", () => {
      const extracted = list.extract("id-b");
      expect(extracted?.data).toBe("B");
      expect(list.size).toBe(3);
      const nonExistent = list.extract("non-existent");
      expect(nonExistent).toBeUndefined();
    });
    it("reset", () => {
      list.reset();
      expect(list.size).toBe(0);
      expect(list.head).toBeUndefined();
      expect(list.tail).toBeUndefined();
    });
    it("remove without head", () => {
      list.reset();
      list.remove("non-existent");
      expect(list.head).toBeUndefined();
      expect(list.tail).toBeUndefined();
    });
  });
  describe("Access and Search", () => {
    beforeEach(() => {
      const nodes = [
        createNode("A", "id-a"),
        createNode("B", "id-b"),
        createNode("C", "id-c"),
      ];
      nodes.forEach((node) => list.append(node));
    });

    it("by ID", () => {
      const bNode = list.find("id-b");
      expect(bNode).toBeDefined();
      expect(bNode?.data).toBe("B");

      const nonExistentNode = list.find("non-existent");
      expect(nonExistentNode).toBeUndefined();
    });

    it("by index", () => {
      const secondNode = list.get(1);
      expect(secondNode).toBeDefined();
      expect(secondNode?.data).toBe("B");

      const outOfBoundsNode = list.get(100);
      expect(outOfBoundsNode).toBeUndefined();

      const negativeIndexNode = list.get(-1);
      expect(negativeIndexNode).toBeUndefined();
    });

    it("has id", () => {
      expect(list.has("id-a")).toBe(true);
      expect(list.has("non-existent")).toBe(false);
    });
    it("get index by ID", () => {
      expect(list.getIndex("id-b")).toBe(1);
      expect(list.getIndex("non-existent")).toBeUndefined();
    });
  });
  describe("Movement Operations", () => {
    beforeEach(() => {
      const nodes = [
        createNode("A", "id-a"),
        createNode("B", "id-b"),
        createNode("C", "id-c"),
        createNode("D", "id-d"),
      ];
      nodes.forEach((node) => list.append(node));
    });

    it("to index", () => {
      list.moveToIndex("id-c", 0);

      expect(list.size).toBe(4);
      const items = Array.from(list.forward());
      expect(items.map((i) => i.data)).toEqual(["C", "A", "B", "D"]);

      list.moveToIndex("id-a", 3);
      const updatedItems = Array.from(list.forward());
      expect(updatedItems.map((i) => i.data)).toEqual(["C", "B", "D", "A"]);

      list.moveToIndex("id-b", 2);
      const finalItems = Array.from(list.forward());
      expect(finalItems.map((i) => i.data)).toEqual(["C", "D", "B", "A"]);
    });

    it("invalid to index", () => {
      const initialItems = Array.from(list.forward());
      list.moveToIndex("non-existent", 2);
      const afterMoveItems = Array.from(list.forward());

      expect(afterMoveItems.map((i) => i.data)).toEqual(
        initialItems.map((i) => i.data),
      );

      list.moveToIndex("id-a", 100);
      const outOfBoundsItems = Array.from(list.forward());
      expect(outOfBoundsItems.map((i) => i.data)).toEqual(["B", "C", "D", "A"]);
    });

    it("relative to node", () => {
      list.moveToTarget("id-d", "id-b", "before");

      expect(list.size).toBe(4);
      const items = Array.from(list.forward());
      expect(items.map((i) => i.data)).toEqual(["A", "D", "B", "C"]);

      list.moveToTarget("id-a", "id-c", "after");
      const updatedItems = Array.from(list.forward());
      expect(updatedItems.map((i) => i.data)).toEqual(["D", "B", "C", "A"]);
    });

    describe("moveToTarget edge cases", () => {
      it("should handle moving to a non-existent target", () => {
        const beforeItems = Array.from(list.forward());
        list.moveToTarget("id-a", "non-existent", "after");
        const afterItems = Array.from(list.forward());
        expect(afterItems.map((i) => i.data)).toEqual(
          beforeItems.map((i) => i.data),
        );
      });

      it("should handle moving a non-existent node", () => {
        const beforeItems = Array.from(list.forward());
        list.moveToTarget("non-existent", "id-b", "before");
        const afterItems = Array.from(list.forward());
        expect(afterItems.map((i) => i.data)).toEqual(
          beforeItems.map((i) => i.data),
        );
      });

      it("should handle moving a node before the head", () => {
        list.moveToTarget("id-c", "id-a", "before");
        const afterMoveBeforeHead = Array.from(list.forward());
        expect(afterMoveBeforeHead.map((i) => i.data)).toEqual([
          "C",
          "A",
          "B",
          "D",
        ]);
      });

      it("should handle moving a node after the head", () => {
        list.moveToTarget("id-d", "id-a", "after");
        const afterMoveAfterHead = Array.from(list.forward());
        expect(afterMoveAfterHead.map((i) => i.data)).toEqual([
          "A",
          "D",
          "B",
          "C",
        ]);
      });
    });
  });

  describe("Iteration", () => {
    beforeEach(() => {
      const nodes = [
        createNode("A", "id-a"),
        createNode("B", "id-b"),
        createNode("C", "id-c"),
      ];
      nodes.forEach((node) => list.append(node));
    });

    it("empty list", () => {
      const emptyList = Singly.create<string>();
      const items = Array.from(emptyList.forward());
      expect(items).toEqual([]);
    });

    it("correct indices during iteration", () => {
      const iteratedItems: { data: string; id: string; index: number }[] = [];

      for (const item of list.forward()) {
        iteratedItems.push(item);
      }

      expect(iteratedItems.length).toBe(3);
      expect(iteratedItems[0].index).toBe(0);
      expect(iteratedItems[1].index).toBe(1);
      expect(iteratedItems[2].index).toBe(2);
      expect(iteratedItems.map((i) => i.data)).toEqual(["A", "B", "C"]);
    });

    it("remains in sync", () => {
      list.append(createNode("D", "id-d"));
      list.remove("id-b");
      const items = Array.from(list.forward());
      expect(items.map((i) => i.data)).toEqual(["A", "C", "D"]);
      expect(items[0].index).toBe(0);
      expect(items[1].index).toBe(1);
      expect(items[2].index).toBe(2);
    });
  });
});
