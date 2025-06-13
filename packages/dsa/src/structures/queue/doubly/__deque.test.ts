import { describe, it, expect, beforeEach } from "vitest";
import { create } from "./deque.js";
import type { Node } from "../../core/index.js";

type Detail = Node.Detail<number>;
function makeDetail(n: number): Detail {
  return { id: String(n), data: n };
}

describe("deque", () => {
  describe("normal", () => {
    let deque: ReturnType<typeof create<"deque", number>>;

    beforeEach(() => {
      deque = create("deque");
    });

    it("should append and popTail in LIFO order", () => {
      deque.append(makeDetail(1)).append(makeDetail(2)).append(makeDetail(3));
      expect(deque.getSize()).toBe(3);

      expect(deque.popTail()).toEqual(makeDetail(3));
      expect(deque.popTail()).toEqual(makeDetail(2));
      expect(deque.popTail()).toEqual(makeDetail(1));
      expect(deque.popTail()).toBeUndefined();
      expect(deque.isEmpty()).toBe(true);
    });

    it("should prepend and popHead in FIFO order", () => {
      deque
        .prepend(makeDetail(1))
        .prepend(makeDetail(2))
        .prepend(makeDetail(3));
      expect(deque.getSize()).toBe(3);

      expect(deque.popHead()).toEqual(makeDetail(3));
      expect(deque.popHead()).toEqual(makeDetail(2));
      expect(deque.popHead()).toEqual(makeDetail(1));
      expect(deque.popHead()).toBeUndefined();
      expect(deque.isEmpty()).toBe(true);
    });

    it("should handle popHead and popTail on empty deque", () => {
      expect(deque.popHead()).toBeUndefined();
      expect(deque.popTail()).toBeUndefined();
    });

    it("should support iteration", () => {
      deque.append(makeDetail(1)).append(makeDetail(2));
      const arr = Array.from(deque).map((d) => d.detail.data);
      expect(arr).toEqual([1, 2]);
    });

    it("should reset", () => {
      deque.append(makeDetail(1));
      expect(deque.isEmpty()).toBe(false);
      deque.reset();
      expect(deque.isEmpty()).toBe(true);
    });

    it("should return correct head and tail", () => {
      expect(deque.head).toBeUndefined();
      expect(deque.tail).toBeUndefined();
      deque.append(makeDetail(1)).append(makeDetail(2));
      expect(deque.head?.data).toBe(1);
      expect(deque.tail?.data).toBe(2);
    });

    it("should toString", () => {
      expect(typeof deque.toString()).toBe("string");
    });
  });

  describe("circular", () => {
    let deque: ReturnType<typeof create<"dequeCircular", number>>;

    beforeEach(() => {
      deque = create("dequeCircular");
    });

    it("should append and popTail in LIFO order (circular)", () => {
      deque.append(makeDetail(1)).append(makeDetail(2)).append(makeDetail(3));
      expect(deque.getSize()).toBe(3);

      expect(deque.popTail()).toEqual(makeDetail(3));
      expect(deque.popTail()).toEqual(makeDetail(2));
      expect(deque.popTail()).toEqual(makeDetail(1));
      expect(deque.popTail()).toBeUndefined();
      expect(deque.isEmpty()).toBe(true);
    });

    it("should prepend and popHead in FIFO order (circular)", () => {
      deque
        .prepend(makeDetail(1))
        .prepend(makeDetail(2))
        .prepend(makeDetail(3));
      expect(deque.getSize()).toBe(3);

      expect(deque.popHead()).toEqual(makeDetail(3));
      expect(deque.popHead()).toEqual(makeDetail(2));
      expect(deque.popHead()).toEqual(makeDetail(1));
      expect(deque.popHead()).toBeUndefined();
      expect(deque.isEmpty()).toBe(true);
    });

    it("should handle popHead and popTail on empty circular deque", () => {
      expect(deque.popHead()).toBeUndefined();
      expect(deque.popTail()).toBeUndefined();
    });

    it("should support iteration (circular)", () => {
      deque.append(makeDetail(1)).append(makeDetail(2));
      const arr = Array.from(deque).map((d) => d.detail.data);
      expect(arr).toEqual([1, 2]);
    });

    it("should reset", () => {
      deque.append(makeDetail(1));
      expect(deque.isEmpty()).toBe(false);
      deque.reset();
      expect(deque.isEmpty()).toBe(true);
    });

    it("should return correct head and tail", () => {
      expect(deque.head).toBeUndefined();
      expect(deque.tail).toBeUndefined();
      deque.append(makeDetail(1)).append(makeDetail(2));
      expect(deque.head?.data).toBe(1);
      expect(deque.tail?.data).toBe(2);
    });

    it("should toString", () => {
      expect(typeof deque.toString()).toBe("string");
    });
  });

  describe("factory", () => {
    it("should create correct deque types", () => {
      const d = create("deque");
      expect(typeof d.append).toBe("function");
      expect(typeof d.prepend).toBe("function");
      expect(typeof d.popHead).toBe("function");
      expect(typeof d.popTail).toBe("function");
      const dc = create("dequeCircular");
      expect(typeof dc.append).toBe("function");
      expect(typeof dc.prepend).toBe("function");
      expect(typeof dc.popHead).toBe("function");
      expect(typeof dc.popTail).toBe("function");
    });
  });
});
