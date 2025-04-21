import { describe, expect, it } from "vitest";
import * as DataNode from "./node.js";

describe("DataNode Module", () => {
  describe("LinkedNode", () => {
    it("creates a linked node with correct properties", () => {
      const data = { value: 42 };
      const node = DataNode.create.linked({ id: "node1", data });

      expect(node.id).toBe("node1");
      expect(node.data).toEqual(data);
      expect(node.next).toBeUndefined();
      expect(node.type).toBe("linked");
    });

    it("links nodes correctly", () => {
      const node2 = DataNode.create.linked({ id: "node2", data: { value: 2 } });

      const node1 = DataNode.create.linked({
        id: "node1",
        data: { value: 1 },
        next: node2,
      });

      expect(node1.next).toBe(node2);
      expect(node1.next?.id).toBe("node2");
    });

    it("allows updating data property", () => {
      const node = DataNode.create.linked({ id: "node1", data: { value: 1 } });
      const newData = { value: 99 };

      node.data = newData;

      expect(node.data).toEqual(newData);
      expect(node.data).not.toEqual({ value: 1 });
    });
  });

  describe("DoublyLinkedNode", () => {
    it("creates a doubly linked node with correct properties", () => {
      const node2 = DataNode.create.doublyLinked({
        id: "node2",
        data: { value: 2 },
      });

      const node1 = DataNode.create.doublyLinked({
        id: "node1",
        data: { value: 1 },
        next: node2,
      });

      expect(node1.id).toBe("node1");
      expect(node1.data).toEqual({ value: 1 });
      expect(node1.next).toBe(node2);
      expect(node1.prev).toBeUndefined();
      expect(node1.type).toBe("doublyLinked");
    });

    it("creates a chain of doubly linked nodes", () => {
      const node3 = DataNode.create.doublyLinked({
        id: "node3",
        data: { value: 3 },
      });

      const node2 = DataNode.create.doublyLinked({
        id: "node2",
        data: { value: 2 },
        next: node3,
      });

      const node1 = DataNode.create.doublyLinked({
        id: "node1",
        data: { value: 1 },
        next: node2,
      });

      expect(node1.next).toBe(node2);
      expect(node2.next).toBe(node3);
      expect(node3.next).toBeUndefined();
    });

    it("creates doubly linked node with prev reference", () => {
      const node1 = DataNode.create.doublyLinked({
        id: "node1",
        data: { value: 1 },
      });

      const node2 = DataNode.create.doublyLinked({
        id: "node2",
        data: { value: 2 },
        prev: node1,
      });

      expect(node2.prev).toBe(node1);
      expect(node1.next).toBeUndefined();
    });

    it("creates complete double links between nodes", () => {
      const node1 = DataNode.create.doublyLinked({
        id: "node1",
        data: { value: 1 },
      });

      const node2 = DataNode.create.doublyLinked({
        id: "node2",
        data: { value: 2 },
        prev: node1,
      });

      node1.next = node2;

      expect(node1.next).toBe(node2);
      expect(node2.prev).toBe(node1);
    });
  });

  describe("Type Discrimination", () => {
    it("correctly narrows types based on type property", () => {
      const linkedNode = DataNode.create.linked({
        id: "linked1",
        data: { value: 1 },
      });

      const doublyLinkedNode = DataNode.create.doublyLinked({
        id: "double1",
        data: { value: 2 },
        next: null as any,
      });

      expect(linkedNode.next).toBeUndefined();

      expect(linkedNode.type).toBe("linked");
      expect(doublyLinkedNode.type).toBe("doublyLinked");
    });
  });

  describe("Immutability", () => {
    it("ensures create object is frozen", () => {
      expect(Object.isFrozen(DataNode.create)).toBe(true);

      // Attempt to modify should fail in strict mode
      const attemptModify = () => {
        (DataNode.create as any).newMethod = () => {
          return;
        };
      };

      expect(attemptModify).toThrow();
    });
  });
});
