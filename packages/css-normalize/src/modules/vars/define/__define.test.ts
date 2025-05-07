import { describe, it, expect } from "vitest";
import { define } from "./define";

// Helper: get a valid key for each top-level cssProps section
const getValidInput = () => ({
  font: { family: "Arial", weight: { bold: "700", thin: "100" } },
  spacing: { sm: "4px" },
  border: { border: "1px solid red" },
  transition: { duration: "0.3s" },
  elevation: { low: "2px", base: { blur: "5px" } },
  outline: { outline: "none" },
  colors: { light: { bg: "#fff" }, dark: { fg: "#000" } },
});

describe("define", () => {
  it("should generate CSS for flat and nested input", () => {
    const input = getValidInput();
    const css = define(input);

    // Check for a few expected outputs
    expect(css).toContain("--font-family: Arial;");
    expect(css).toContain("--font-weight-bold: 700;");
    expect(css).toContain("--font-weight-thin: 100;");
    expect(css).toContain("--spacing-sm: 4px;");
    expect(css).toContain("--border-border: 1px solid red;");
    expect(css).toContain("--transition-duration: 0.3s;");
    expect(css).toContain("--elevation-low: 2px;");
    expect(css).toContain("--elevation-base-blur: 5px;");
    expect(css).toContain("--outline-outline: none;");
    expect(css).toContain("--light-color-bg: #fff;");
    expect(css).toContain("--dark-color-fg: #000;");
  });

  it("should skip keys not in cssProps", () => {
    const input = { ...getValidInput(), notAProp: { foo: "bar" } };
    const css = define(input as any);
    expect(css).not.toContain("foo: bar;");
  });

  it("should handle empty input", () => {
    expect(define({})).toBe("");
  });

  it("should skip non-object/empty values", () => {
    // @ts-expect-error purposely wrong
    expect(define({ font: null })).toBe("");
    // @ts-expect-error purposely wrong
    expect(define({ font: 123 })).toBe("");
  });

  it("should skip keys not in valueNode or propsNode", () => {
    // This will skip 'notAKey' since it's not in cssProps.font
    const input = { font: { notAKey: "foo" } };
    expect(define(input as any)).toBe("");
  });

  it("should handle nested objects with non-string values", () => {
    const input = { font: { weight: { bold: 700 } } };
    // @ts-expect-error purposely wrong
    expect(define(input)).toBe("");
  });
  it("should add a selector if provided", () => {
    const input = getValidInput();
    const selector = ".my-selector";
    const css = define(input, selector);

    expect(css).toContain(`${selector} {`);
    expect(css).toContain("--font-family: Arial;");
    expect(css).toContain("}");
  });
  it("should add a normalize string if provided", () => {
    const input = getValidInput();
    const normalizeStr = '@import "normalize.css";';
    const css = define(input, "", normalizeStr);

    expect(css).toContain(normalizeStr);
    expect(css).toContain("--font-family: Arial;");
  });
});
