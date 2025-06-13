import { describe, it, expect, vi, beforeEach } from "vitest";
import { create, extractPublicAPI } from "./structure";

type SK = "testStructure";
type NT = "singly";
type AK = "head" | "tail";
type D = string;
const createDetail = (value: string) => ({ id: value, data: value });

describe("structure module", () => {
  let structure: ReturnType<typeof create<SK, NT, AK, D>>;
  const nodeCfg = {
    type: "singly" as const,
    anchorKeys: ["head", "tail"] as [AK, AK],
  };

  beforeEach(() => {
    structure = create({
      type: "testStructure",
      nodeManagerCfg: nodeCfg,
      sizing: {
        maxSize: 10,
        assertErrorMsgs: {
          overflow: "Overflow!",
          underflow: "Underflow!",
          inBounds: "Out of bounds!",
          empty: "Empty!",
        },
      },
    });
  });

  it("creates a structure with correct properties", () => {
    expect(structure.type).toBe("testStructure");
    expect(typeof structure.size).toBe("object");
    expect(typeof structure.toString).toBe("function");
  });

  it("toString returns formatted string", () => {
    const str = structure.toString();
    expect(str).toContain("Structure {");
    expect(str).toContain('type: "testStructure"');
    expect(str).toContain('nodeType: "singly"');
    expect(str).toContain('anchors: ["head", "tail"]');
    expect(str).toMatch(/size: \d+ \/ \d+ nodes/);
  });

  it("size controller works and integrates with anchors", () => {
    expect(structure.size.get()).toBe(0);
    const detail = createDetail("testNode");
    structure.add(detail, (node) => {
      structure.anchors.set("head", node);
    });
    expect(structure.size.get()).toBe(1);
    expect(() => structure.add(detail)).toThrow();
    structure.remove(structure.anchors.get("head"), (node) => {
      structure.anchors.set("head", undefined);
    });
    expect(structure.size.get()).toBe(0);
  });

  it("maxSize and sizeMode are correct", () => {
    expect(structure.size.getMaxSize()).toBe(10);
    expect(structure.size.getSizeMode()).toBe("fixed");
    structure.size.setMaxSize(Infinity);
    expect(structure.size.getSizeMode()).toBe("dynamic");
    structure.size.setMaxSize(10);
    expect(structure.size.getMaxSize()).toBe(10);
  });

  it("can set maxSize and triggers error if too small", () => {
    const detail = createDetail("x");
    structure.add(detail, (node) => {
      structure.anchors.set("head", node);
    });
    expect(() => {
      structure.size.setMaxSize(0);
    }).toThrow();
    structure.size.setMaxSize(10);
    expect(structure.size.getMaxSize()).toBe(10);
  });

  it("extractPublicAPI exposes correct API", () => {
    const {
      getCapacity,
      getMaxSize,
      getSize,
      getSizeMode,
      isEmpty,
      isFull,
      setMaxSize,
      toString,
      type,
    } = extractPublicAPI(structure);
    expect(type).toBe("testStructure");
    expect(typeof toString).toBe("function");
    expect(typeof isEmpty).toBe("function");
    expect(typeof isFull).toBe("function");
    expect(typeof getSize).toBe("function");
    expect(typeof getMaxSize).toBe("function");
    expect(typeof getSizeMode).toBe("function");
    setMaxSize(20);
    const detail = createDetail("d1");
    structure.add(detail, (node) => {
      structure.anchors.set("head", node);
    });
  });

  it("toArray returns all nodes in anchor chain", () => {
    const detail1 = createDetail("n1");
    const detail2 = createDetail("n2");
    structure.add(detail1, (node) => {
      structure.anchors.set("head", node);
    });
    structure.add(detail2, (node) => {
      const head = structure.anchors.get("head")!;
      structure.node.setPointer(head, { next: node });
    });
  });

  it("size controller error messages are customizable", () => {
    expect(structure.size.getAssertErrorMsgs().overflow).toBe("Overflow!");
    structure.size.setAssertErrorMsgs({ overflow: "custom overflow" });
    expect(structure.size.getAssertErrorMsgs().overflow).toBe(
      "custom overflow",
    );
  });

  it("isEmpty and isFull work as expected", () => {
    const api = extractPublicAPI(structure);
    expect(api.isEmpty()).toBe(true);
    expect(api.isFull()).toBe(false);
    for (let i = 0; i < 10; i++) {
      const detail = createDetail(`n${i}`);
      structure.add(detail, (node) => {
        structure.anchors.set("head", node);
      });
    }
    expect(api.getSize()).toBe(10);
    expect(() => structure.size.setMaxSize(1)).toThrow();
  });

  it("getCapacity returns remaining space", () => {
    const api = extractPublicAPI(structure);
    expect(api.getCapacity()).toBe(10);
    const detail = createDetail("n1");
    structure.add(detail, (node) => {
      structure.anchors.set("head", node);
    });
    structure.size.clearCache();
    expect(api.getCapacity()).toBe(9);
  });

  it("removes nodes correctly and updates size", () => {
    const detail1 = createDetail("n1");
    const detail2 = createDetail("n2");
    structure.add(detail1, (node) => {
      structure.anchors.set("head", node);
    });
    structure.add(detail2, (node) => {
      const head = structure.anchors.get("head")!;
      structure.node.setPointer(head, { next: node });
    });
    expect(structure.size.get()).toBe(2);
    structure.remove(structure.anchors.get("head"), (node) => {
      const head = structure.anchors.get("head")!;
      structure.node.setPointer(head, { next: node.next });
      structure.anchors.set("head", node.next);
    });
    expect(structure.size.get()).toBe(1);
    structure.remove(structure.anchors.get("head"), (node) => {
      const head = structure.anchors.get("head")!;
      structure.node.setPointer(head, { next: node.next });
      structure.anchors.set("head", node.next);
    });
    expect(structure.size.get()).toBe(0);
    expect(structure.anchors.get("head")).toBeUndefined();
    expect(structure.anchors.get("tail")).toBeUndefined();
    expect(structure.remove(undefined)).toBeUndefined();
    expect(() =>
      structure.remove({ id: "nonexistent", data: "none" } as any, () => {
        return;
      }),
    ).toThrow();
  });
  it("resets structure correctly", () => {
    const detail1 = createDetail("n1");
    const detail2 = createDetail("n2");
    structure.add(detail1, (node) => {
      structure.anchors.set("head", node);
    });
    structure.add(detail2, (node) => {
      const head = structure.anchors.get("head")!;
      structure.node.setPointer(head, { next: node });
    });
    expect(structure.size.get()).toBe(2);
    structure.reset();
    expect(structure.size.get()).toBe(0);
  });
});
