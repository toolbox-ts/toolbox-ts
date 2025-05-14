import { describe, it, expect } from "vitest";
import { buildTokenMap, keyToProp, keyToVar } from "./buildMap";

describe("keyToProp", () => {
  it("returns correct property with prefix", () => {
    expect(keyToProp("foo-bar" as any, "baz")).toBe("--baz-foo-bar");
  });
  it("returns correct property without prefix", () => {
    expect(keyToProp("foo-bar" as any, undefined)).toBe("--foo-bar");
  });
});

describe("keyToVar", () => {
  it("returns correct var with prefix", () => {
    expect(keyToVar("foo-bar" as any, "baz")).toBe("var(--baz-foo-bar)");
  });
  it("returns correct var without prefix", () => {
    expect(keyToVar("foo-bar" as any, undefined)).toBe("var(--foo-bar)");
  });
});

describe("buildTokenMap", () => {
  it("builds a token map with prefix", () => {
    const map = buildTokenMap({
      prefix: "my-prefix",
      valueMap: { fooBar: "1", bazQux: "2" },
    });
    expect(map.fooBar.prop).toBe("--my-prefix-foo-bar");
    expect(map.fooBar.var).toBe("var(--my-prefix-foo-bar)");
    expect(map.fooBar.value).toBe("1");
    expect(map.bazQux.prop).toBe("--my-prefix-baz-qux");
    expect(map.bazQux.var).toBe("var(--my-prefix-baz-qux)");
    expect(map.bazQux.value).toBe("2");
  });

  it("builds a token map without prefix", () => {
    const map = buildTokenMap({
      prefix: undefined,
      valueMap: { fooBar: "a", bazQux: "b" },
    });
    expect(map.fooBar.prop).toBe("--foo-bar");
    expect(map.fooBar.var).toBe("var(--foo-bar)");
    expect(map.fooBar.value).toBe("a");
    expect(map.bazQux.prop).toBe("--baz-qux");
    expect(map.bazQux.var).toBe("var(--baz-qux)");
    expect(map.bazQux.value).toBe("b");
  });

  it("handles empty valueMap", () => {
    const map = buildTokenMap({ prefix: "x", valueMap: {} });
    expect(map).toEqual({});
  });
});
