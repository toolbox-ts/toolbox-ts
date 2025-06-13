import { describe, it, expect } from "vitest";
import { create } from "./anchors";

// Minimal WithPointers mock for testing
type WithPointers<TK extends string, PK extends string, D> = {
  type: TK;
  id: string;
  data: D;
} & { [K in PK]?: any };

describe("anchors Manager", () => {
  type AK = "head" | "tail";
  type TK = "singly";
  type PK = "next";
  type D = number;

  const anchorKeys = ["head", "tail"] as const;

  const makeNode = (id: string, data: D): WithPointers<TK, PK, D> => ({
    type: "singly",
    id,
    data,
  });

  it("throws if anchorKeys is empty", () => {
    expect(() => create<"", TK, PK, D>({ anchorKeys: [] as any })).toThrow();
  });

  it("throws if primary is not in anchorKeys", () => {
    expect(() =>
      create<AK, TK, PK, D>({ anchorKeys, primary: "notakey" as AK }),
    ).toThrow();
  });

  it("creates manager with default primary", () => {
    const mgr = create<AK, TK, PK, D>({ anchorKeys });
    expect(mgr.primaryKey).toBe("head");
    expect(mgr.keys).toEqual(["head", "tail"]);
  });

  it("creates manager with explicit primary", () => {
    const mgr = create<AK, TK, PK, D>({ anchorKeys, primary: "tail" });
    expect(mgr.primaryKey).toBe("tail");
    expect(mgr.keys).toEqual(["head", "tail"]);
  });

  it("can set and get anchors", () => {
    const mgr = create<AK, TK, PK, D>({ anchorKeys });
    const node = makeNode("n1", 42);
    //@ts-expect-error testing invalid behavior
    mgr.set("head", node);
    expect(mgr.get("head")).toBe(node);
    expect(mgr.get("tail")).toBeUndefined();
    mgr.set("head", undefined);
    expect(mgr.get("head")).toBeUndefined();
  });

  it("throws if set/get with invalid key", () => {
    const mgr = create<AK, TK, PK, D>({ anchorKeys });
    // @ts-expect-error testing invalid behavior
    expect(() => mgr.set("notakey", undefined)).toThrow();
    // @ts-expect-error testing invalid behavior
    expect(() => mgr.get("notakey")).toThrow();
  });

  it("can get and set primary property", () => {
    const mgr = create<AK, TK, PK, D>({ anchorKeys });
    expect(mgr.primaryKey).toBe("head");
    mgr.primaryKey = "tail";
    expect(mgr.primaryKey).toBe("tail");
    expect(() => {
      // @ts-expect-error testing invalid behavior
      mgr.primaryKey = "notakey";
    }).toThrow();
  });
  it("resets anchors", () => {
    const mgr = create<AK, TK, PK, D>({ anchorKeys });
    const node1 = makeNode("n1", 1);
    const node2 = makeNode("n2", 2);
    //@ts-expect-error overriding types for testing
    mgr.set("head", node1);
    //@ts-expect-error overriding types for testing
    mgr.set("tail", node2);
    expect(mgr.get("head")).toBe(node1);
    expect(mgr.get("tail")).toBe(node2);
    mgr.reset();
    expect(mgr.get("head")).toBeUndefined();
    expect(mgr.get("tail")).toBeUndefined();
  });
  it("checks if node is an anchor", () => {
    const mgr = create<AK, TK, PK, D>({ anchorKeys });
    const node1 = makeNode("n1", 1);
    const node2 = makeNode("n2", 2);
    //@ts-expect-error overriding types for testing
    mgr.set("head", node1);
    //@ts-expect-error testing invalid behavior
    mgr.set("tail", node2);
    //@ts-expect-error testing invalid behavior
    expect(mgr.isAnchor("head", node1)).toBe(true);
    //@ts-expect-error testing invalid behavior
    expect(mgr.isAnchor("tail", node2)).toBe(true);
    //@ts-expect-error testing invalid behavior
    expect(mgr.isAnchor("head", node2)).toBe(false);
    //@ts-expect-error testing invalid behavior
    expect(mgr.isAnchor("tail", node1)).toBe(false);
  });
  it("returns primary anchor", () => {
    const mgr = create<AK, TK, PK, D>({ anchorKeys });
    const node1 = makeNode("n1", 1);
    const node2 = makeNode("n2", 2);
    //@ts-expect-error testing invalid behavior
    mgr.set("head", node1);
    //@ts-expect-error testing invalid behavior
    mgr.set("tail", node2);
    expect(mgr.primary).toBe(node1);
    mgr.primaryKey = "tail";
    expect(mgr.primary).toBe(node2);
    mgr.reset();
    expect(mgr.primary).toBeUndefined();
  });
});
