import { describe, it, expect, beforeEach } from "vitest";
import { create, type Stack } from "./stack.js";

describe("Stack", () => {
  let stack: Stack<string>;

  beforeEach(() => {
    stack = create<string>();
  });

  it("initializes empty", () => {
    expect(stack.getSize()).toBe(0);
    expect(stack.head).toBeUndefined();
    expect(stack.isEmpty()).toBe(true);
    expect(stack.pop()).toBeUndefined();
    expect([...stack]).toEqual([]);
  });

  it("pushes and pops values (LIFO)", () => {
    stack.push({ id: "A", data: "A" });
    stack.push({ id: "B", data: "B" });
    expect(stack.getSize()).toBe(2);
    expect(stack.head).toEqual({ id: "B", data: "B" });
    expect(stack.isEmpty()).toBe(false);

    const popped1 = stack.pop();
    expect(popped1).toEqual({ id: "B", data: "B" });
    expect(stack.getSize()).toBe(1);
    expect(stack.head).toEqual({ id: "A", data: "A" });

    const popped2 = stack.pop();
    expect(popped2).toEqual({ id: "A", data: "A" });
    expect(stack.getSize()).toBe(0);
    expect(stack.head).toBeUndefined();
    expect(stack.isEmpty()).toBe(true);

    expect(stack.pop()).toBeUndefined();
  });

  it("handles custom DataNode.Detail", () => {
    const customStack = create<{ x: number }>();
    customStack.push({ data: { x: 1 }, id: "one" });
    expect(customStack.head).toEqual({ data: { x: 1 }, id: "one" });
    expect(customStack.pop()).toEqual({ data: { x: 1 }, id: "one" });
  });

  it("toString method", () => {
    stack.push({ id: "A", data: "A" });
    stack.push({ id: "B", data: "B" });
    expect(stack.toString()).toMatch(`Structure {
  type: "stack", 
  nodeType: "singly", 
  anchors: ["head"],
  size: ${stack.getSize()} / ${stack.getMaxSize()} nodes
}`);
  });

  it("reset method", () => {
    stack.push({ id: "A", data: "A" });
    stack.push({ id: "B", data: "B" });
    expect(stack.getSize()).toBe(2);
    stack.reset();
    expect(stack.getSize()).toBe(0);
    expect(stack.head).toBeUndefined();
    expect(stack.isEmpty()).toBe(true);
  });

  it("iterator yields all elements in LIFO order", () => {
    stack.push({ id: "A", data: "A" });
    stack.push({ id: "B", data: "B" });
    stack.push({ id: "C", data: "C" });
    const arr = [...stack].map((x) => x.detail);
    expect(arr).toEqual([
      { id: "C", data: "C" },
      { id: "B", data: "B" },
      { id: "A", data: "A" },
    ]);
  });

  it("maxSize and sizeMode are correct", () => {
    expect(stack.getMaxSize()).toBe(Infinity);
    expect(stack.getSizeMode()).toBe("dynamic");
    stack.setMaxSize(3);
    expect(stack.getMaxSize()).toBe(3);
    expect(stack.getSizeMode()).toBe("fixed");
  });

  it("isFull returns true when at maxSize", () => {
    stack.setMaxSize(2);
    stack.push({ id: "1", data: "1" });
    stack.push({ id: "2", data: "2" });
    expect(stack.isFull()).toBe(true);
    expect(stack.pop()).toEqual({ id: "2", data: "2" });
    expect(stack.isFull()).toBe(false);
    stack.push({ id: "3", data: "3" });
    expect(stack.isFull()).toBe(true);
    expect(stack.head).toEqual({ id: "3", data: "3" });
  });

  it("capacity reflects remaining space", () => {
    stack.setMaxSize(3);
    expect(stack.getCapacity()).toBe(3);
    stack.push({ id: "1", data: "1" });
    expect(stack.getCapacity()).toBe(2);
    stack.push({ id: "2", data: "2" });
    expect(stack.getCapacity()).toBe(1);
    stack.push({ id: "3", data: "3" });
    expect(stack.getCapacity()).toBe(0);
  });
  it("returns top detail", () => {
    stack.push({ id: "A", data: "A" });
    stack.push({ id: "B", data: "B" });
    expect(stack.top()).toEqual({ id: "B", data: "B" });
    stack.pop();
    expect(stack.top()).toEqual({ id: "A", data: "A" });
    stack.pop();
    expect(stack.top()).toBeUndefined();
  });
});
