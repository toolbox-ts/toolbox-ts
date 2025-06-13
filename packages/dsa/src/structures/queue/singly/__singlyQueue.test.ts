import { describe, it, expect, beforeEach } from "vitest";
import { create } from "./singlyQueue.js";
import type { Node } from "../../core/index.js";

type Detail = Node.Detail<number>;

function makeDetail(n: number): Detail {
  return { id: String(n), data: n };
}

describe("singly.ts", () => {
  describe("queue (normal)", () => {
    let queue: ReturnType<typeof create<"queue", number>>;

    beforeEach(() => {
      queue = create("queue");
    });

    it("should enqueue and dequeue in FIFO order", () => {
      expect(queue.isEmpty()).toBe(true);
      queue
        .enqueue(makeDetail(1))
        .enqueue(makeDetail(2))
        .enqueue(makeDetail(3));
      expect(queue.getSize()).toBe(3);
      expect(queue.isEmpty()).toBe(false);

      expect(queue.dequeue()).toEqual(makeDetail(1));
      expect(queue.dequeue()).toEqual(makeDetail(2));
      expect(queue.dequeue()).toEqual(makeDetail(3));
      expect(queue.dequeue()).toBeUndefined();
      expect(queue.isEmpty()).toBe(true);
    });

    it("should handle dequeue on empty queue", () => {
      expect(queue.dequeue()).toBeUndefined();
    });

    it("should support iteration", () => {
      queue.enqueue(makeDetail(1)).enqueue(makeDetail(2));
      const arr = Array.from(queue).map((d) => d.detail.data);
      expect(arr).toEqual([1, 2]);
    });

    it("should reset", () => {
      queue.enqueue(makeDetail(1));
      expect(queue.isEmpty()).toBe(false);
      queue.reset();
      expect(queue.isEmpty()).toBe(true);
    });

    it("should return correct head and tail", () => {
      expect(queue.head).toBeUndefined();
      expect(queue.tail).toBeUndefined();
      queue.enqueue(makeDetail(1)).enqueue(makeDetail(2));
      expect(queue.head?.data).toBe(1);
      expect(queue.tail?.data).toBe(2);
    });

    it("should toString", () => {
      expect(typeof queue.toString()).toBe("string");
    });
  });

  describe("queueCircular", () => {
    let queue: ReturnType<typeof create<"queueCircular", number>>;

    beforeEach(() => {
      queue = create("queueCircular");
    });

    it("should enqueue and dequeue in FIFO order (circular)", () => {
      queue
        .enqueue(makeDetail(1))
        .enqueue(makeDetail(2))
        .enqueue(makeDetail(3));
      expect(queue.getSize()).toBe(3);

      expect(queue.dequeue()).toEqual(makeDetail(1));
      expect(queue.dequeue()).toEqual(makeDetail(2));
      expect(queue.dequeue()).toEqual(makeDetail(3));
      expect(queue.dequeue()).toBeUndefined();
      expect(queue.isEmpty()).toBe(true);
    });

    it("should handle dequeue on empty circular queue", () => {
      expect(queue.dequeue()).toBeUndefined();
    });

    it("should support iteration (circular)", () => {
      queue.enqueue(makeDetail(1)).enqueue(makeDetail(2));
      const arr = Array.from(queue).map((d) => d.detail.data);
      expect(arr).toEqual([1, 2]);
    });

    it("should reset", () => {
      queue.enqueue(makeDetail(1));
      expect(queue.isEmpty()).toBe(false);
      queue.reset();
      expect(queue.isEmpty()).toBe(true);
    });

    it("should return correct head and tail", () => {
      expect(queue.head).toBeUndefined();
      expect(queue.tail).toBeUndefined();
      queue.enqueue(makeDetail(1)).enqueue(makeDetail(2));
      expect(queue.head?.data).toBe(1);
      expect(queue.tail?.data).toBe(2);
    });

    it("should toString", () => {
      expect(typeof queue.toString()).toBe("string");
    });
  });

  describe("factory", () => {
    it("should create correct queue types", () => {
      const q = create("queue");
      expect(typeof q.enqueue).toBe("function");
      expect(typeof q.dequeue).toBe("function");
      const qc = create("queueCircular");
      expect(typeof qc.enqueue).toBe("function");
      expect(typeof qc.dequeue).toBe("function");
    });
  });
});
