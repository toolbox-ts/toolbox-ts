import { describe, it, expect, vi } from "vitest";
import { create, type AssertErrorMsgs } from "./sizeController";

describe("size module", () => {
  it("creates a dynamic size controller by default", () => {
    const size = create({ calculate: () => 0 });
    expect(size.getSizeMode()).toBe("dynamic");
    expect(size.getMaxSize()).toBe(Infinity);
    expect(size.get()).toBe(0);
    expect(size.getCapacity()).toBe(Infinity);
    expect(size.is.empty()).toBe(true);
    expect(size.is.full()).toBe(false);
    expect(size.is.inBounds(0)).toBe(false);
  });

  it("creates a fixed size controller", () => {
    const size = create({ calculate: () => 0, maxSize: 5 });
    expect(size.getSizeMode()).toBe("fixed");
    expect(size.getMaxSize()).toBe(5);
    expect(size.getCapacity()).toBe(5);
    expect(size.is.full()).toBe(false);
    expect(size.is.empty()).toBe(true);
  });

  it("throws if maxSize is negative", () => {
    expect(() => create({ calculate: () => 0, maxSize: -1 })).toThrow();
  });

  it("set maxSize throws for invalid values", () => {
    const size = create({ calculate: () => 0, maxSize: 5 });
    expect(() => {
      size.setMaxSize(NaN);
    }).toThrow();
    expect(() => {
      size.setMaxSize(-1);
    }).toThrow();
  });

  it("set maxSize throws if new maxSize < current size", () => {
    const size = create({ calculate: () => 3, maxSize: 5 });
    expect(() => {
      size.setMaxSize(2);
    }).toThrow();
  });

  it("set maxSize switches between dynamic and fixed", () => {
    const count = 0;
    const size = create({ calculate: () => count, maxSize: 5 });
    expect(size.getSizeMode()).toBe("fixed");
    size.setMaxSize(Infinity);
    expect(size.getSizeMode()).toBe("dynamic");
    expect(size.getMaxSize()).toBe(Infinity);
    size.setMaxSize(10);
    expect(size.getSizeMode()).toBe("fixed");
    expect(size.getMaxSize()).toBe(10);
  });

  it("setCalculate updates the calculation function and clears cache", () => {
    let count = 1;
    const size = create({ calculate: () => count, maxSize: 5 });
    expect(size.get()).toBe(1);
    count = 2;
    expect(size.get()).toBe(1); // cached
    size.clearCache();
    expect(size.get()).toBe(2);
    size.setCalculate(() => 3);
    expect(size.get()).toBe(3);
  });

  it("clearCache resets the cache", () => {
    let count = 1;
    const size = create({ calculate: () => count, maxSize: 5 });
    expect(size.get()).toBe(1);
    count = 2;
    size.clearCache();
    expect(size.get()).toBe(2);
  });

  it("capacity returns remaining space", () => {
    let count = 2;
    const size = create({ calculate: () => count, maxSize: 5 });
    expect(size.getCapacity()).toBe(3);
    count = 5;
    size.clearCache();
    expect(size.getCapacity()).toBe(0);
  });

  it("getAssertErrorMsgs returns a copy of error messages", () => {
    const size = create({ calculate: () => 0, maxSize: 5 });
    const msgs = size.getAssertErrorMsgs();
    expect(msgs.overflow).toMatch(/Overflow/);
    expect(msgs.underflow).toMatch(/Underflow/);
    expect(msgs.inBounds).toMatch(/Out of Bounds/);
    expect(msgs.empty).toMatch(/is Empty/);
    msgs.overflow = "changed";
    expect(size.getAssertErrorMsgs().overflow).not.toBe("changed");
  });

  it("setAssertErrorMsgs updates error messages", () => {
    const size = create({ calculate: () => 0, maxSize: 5 });
    size.setAssertErrorMsgs({ overflow: "custom overflow" });
    expect(size.getAssertErrorMsgs().overflow).toBe("custom overflow");
    size.setAssertErrorMsgs({ underflow: "custom underflow" });
    expect(size.getAssertErrorMsgs().underflow).toBe("custom underflow");
  });

  it("assert.inBounds throws if out of bounds", () => {
    const size = create({ calculate: () => 2, maxSize: 5 });
    expect(() => size.assert.inBounds(2)).toThrow();
    expect(size.assert.inBounds(1)).toBe(true);
    expect(size.assert.inBounds(0)).toBe(true);
  });

  it("assert.notFull throws if full", () => {
    const size = create({ calculate: () => 2, maxSize: 2 });
    expect(() => size.assert.notFull()).toThrow();
    const notFull = create({ calculate: () => 1, maxSize: 2 });
    expect(notFull.assert.notFull()).toBe(true);
  });

  it("assert.notEmpty throws if empty", () => {
    const size = create({ calculate: () => 0, maxSize: 2 });
    expect(() => size.assert.notEmpty()).toThrow();
    const notEmpty = create({ calculate: () => 1, maxSize: 2 });
    expect(notEmpty.assert.notEmpty()).toBe(true);
  });
  it("clears cache on size change", () => {
    const size = create({ calculate: () => 0, maxSize: 5 });
    const spy = vi.spyOn(size, "clearCache");
    size.setMaxSize(10);
    size.mutate(() => {
      return 1;
    });
    expect(spy).toHaveBeenCalled();
  });
  it("throws if setCalculate returns invalid size", () => {
    const size = create({ calculate: () => 0, maxSize: 5 });
    expect(() => {
      size.setCalculate(() => -1);
    }).toThrow("calculate function must return a valid size between 0 and 5");
  });
});
