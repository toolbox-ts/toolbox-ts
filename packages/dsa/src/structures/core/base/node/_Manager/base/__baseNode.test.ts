import { describe, it, expect } from "vitest";
import { create, type Config } from "./base";

describe("base node create", () => {
  it("creates a node with correct type, id, and data", () => {
    const node = create({ type: "test", id: "n1", data: 42 });
    expect(node.type).toBe("test");
    expect(node.id).toBe("n1");
    expect(node.data).toBe(42);
    expect(node.detail).toEqual({ id: "n1", data: 42 });
  });

  it("allows data to be updated via setter", () => {
    const node = create({ type: "foo", id: "bar", data: 1 });
    expect(node.data).toBe(1);
    node.data = 99;
    expect(node.data).toBe(99);
    expect(node.detail).toEqual({ id: "bar", data: 99 });
  });
  it("has a destroy method that clears data and id", () => {
    const node = create({ type: "test", id: "n1", data: 42 });
    expect(node.id).toBe("n1");
    expect(node.data).toBe(42);
    node.destroy();
    expect(node.id).toBeUndefined();
    expect(node.data).toBeUndefined();
    expect(node.detail).toEqual({ id: undefined, data: undefined });
  });
});
