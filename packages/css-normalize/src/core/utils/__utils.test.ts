import { describe, it, expect, vi } from "vitest";
import {
  isKeyOf,
  camelToKebab,
  extractTokenMap,
  writeFontFace,
  writeCssVars,
  compileCSS,
  css,
} from "./utils";

vi.mock("lightningcss", () => ({
  transform: vi.fn(({ code }) => ({
    code: Buffer.from("minified:" + String(code)),
  })),
}));

describe("utils", () => {
  describe("isKeyOf", () => {
    it("returns true if key is in object", () => {
      expect(isKeyOf("foo", { foo: 1, bar: 2 })).toBe(true);
    });
    it("returns false if key is not in object", () => {
      expect(isKeyOf("baz", { foo: 1, bar: 2 })).toBe(false);
    });
  });

  describe("camelToKebab", () => {
    it("converts camelCase to kebab-case", () => {
      expect(camelToKebab("fooBarBaz")).toBe("foo-bar-baz");
      expect(camelToKebab("FooBarBaz")).toBe("foo-bar-baz");
      expect(camelToKebab("fooBARBaz")).toBe("foo-b-a-r-baz");
      expect(camelToKebab("fooBar123Baz")).toBe("foo-bar-1-2-3-baz");
      expect(camelToKebab("foo")).toBe("foo");
      expect(camelToKebab("")).toBe("");
    });
  });

  describe("extractTokenMap", () => {
    const map = {
      a: { prop: "prop-a", var: "var-a", value: "val-a" },
      b: { prop: "prop-b", var: "var-b", value: "val-b" },
    };
    it("extracts .prop", () => {
      expect(extractTokenMap(map as any, "prop")).toEqual({
        a: "prop-a",
        b: "prop-b",
      });
    });
    it("extracts .var", () => {
      expect(extractTokenMap(map as any, "var")).toEqual({
        a: "var-a",
        b: "var-b",
      });
    });
    it("extracts .value", () => {
      expect(extractTokenMap(map as any, "value")).toEqual({
        a: "val-a",
        b: "val-b",
      });
    });
  });

  describe("writeFontFace", () => {
    it("writes a font-face block with all fields", () => {
      const result = writeFontFace({
        src: { link: "foo.woff2", format: "woff2", linkType: "url" },
        fontFamily: "MyFont",
        fontDisplay: "swap",
        fontStyle: "italic",
        fontWeight: "700",
        other: "unicode-range: U+000-5FF;",
      });
      expect(result).toContain("@font-face");
      expect(result).toContain("src: url('foo.woff2') format('woff2');");
      expect(result).toContain("font-family: 'MyFont';");
      expect(result).toContain("font-weight: 700;");
      expect(result).toContain("font-style: italic;");
      expect(result).toContain("font-display: swap;");
      expect(result).toContain("unicode-range: U+000-5FF;");
    });

    it("writes a font-face block with defaults", () => {
      const result = writeFontFace({
        src: { link: "bar.woff", format: "woff" },
        fontFamily: "BarFont",
      });
      expect(result).toContain("src: url('bar.woff') format('woff');");
      expect(result).toContain("font-family: 'BarFont';");
      expect(result).toContain("font-weight: 400;");
      expect(result).toContain("font-style: normal;");
      expect(result).toContain("font-display: auto;");
    });

    it('omits "other" if not provided', () => {
      const result = writeFontFace({
        src: { link: "baz.woff", format: "woff" },
        fontFamily: "BazFont",
      });
      expect(result).not.toContain("undefined");
    });
  });

  describe("writeCssVars", () => {
    it("writes CSS variables from an object", () => {
      const result = writeCssVars({ foo: "1", bar: "2" });
      expect(result).toBe("--foo: 1;--bar: 2;");
    });
    it("returns empty string for empty object", () => {
      expect(writeCssVars({})).toBe("");
    });
  });

  describe("compileCSS", () => {
    it("calls lightningcss.transform and returns minified code", () => {
      const result = compileCSS("body { color: red; }");
      expect(result.code.toString()).toBe("minified:body { color: red; }");
    });
  });

  describe("css", () => {
    it("returns joined raw strings", () => {
      const result = css({ raw: ["a", "b", "c"] } as any);
      expect(result).toBe("abc");
    });
  });
});
