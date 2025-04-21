import { describe, expect, it } from "vitest";
import {
  cleanStringArray,
  capitalize,
  toVariants,
  slugify,
  is,
} from "./base.js";

describe("text utils", () => {
  describe("slugify", () => {
    it("should return empty string if input is not a string", () => {
      //@ts-expect-error - Testing invalid input
      expect(slugify(42)).toBe("");
    });
    it("should convert spaces to hyphens", () => {
      expect(slugify("hello world")).toBe("hello-world");
    });

    it("should convert multiple spaces to single hyphen", () => {
      expect(slugify("hello  world")).toBe("hello-world");
    });

    it("should convert to lowercase", () => {
      expect(slugify("HELLO World")).toBe("hello-world");
    });

    it("should remove trailing spaces", () => {
      expect(slugify(" hello world ")).toBe("hello-world");
    });

    it("should handle special characters", () => {
      expect(slugify("hello, world!")).toBe("hello-world");
      expect(slugify("hello/world+and&others")).toBe("hello-world-and-others");
      expect(slugify("hello?world=test")).toBe("hello-world-test");
      expect(slugify("hello_world.test<example>")).toBe(
        "hello-world-test-example",
      );
      expect(slugify("hello{world}:test;example")).toBe(
        "hello-world-test-example",
      );
      expect(
        slugify("hello'world\"test*example&test$test#test~test!test@test|test"),
      ).toBe("hello-world-test-example-test-test-test-test-test-test-test");
      expect(slugify("hello[world]`test`(test)^test%test-test")).toBe(
        "hello-world-test-test-test-test-test",
      );
    });

    it("should prefix strings starting with numbers", () => {
      expect(slugify("123hello")).toBe("n123hello");
    });
  });
  describe("is.slug", () => {
    it("should return false for non-string inputs", () => {
      expect(is.slug(42)).toBe(false);
      expect(is.slug(null)).toBe(false);
      expect(is.slug(undefined)).toBe(false);
      expect(is.slug({})).toBe(false);
      expect(is.slug([])).toBe(false);
    });

    it("should return false for empty strings", () => {
      expect(is.slug("")).toBe(false);
    });

    it("should return true for valid slug formats", () => {
      expect(is.slug("hello")).toBe(true);
      expect(is.slug("hello-world")).toBe(true);
      expect(is.slug("a-b-c")).toBe(true);
      expect(is.slug("hello-123")).toBe(true);
      expect(is.slug("123-hello")).toBe(true);
    });

    it("should return false for slugs with invalid characters", () => {
      expect(is.slug("hello_world")).toBe(false);
      expect(is.slug("hello world")).toBe(false);
      expect(is.slug("hello/world")).toBe(false);
      expect(is.slug("Hello-World")).toBe(false); // uppercase not allowed
      expect(is.slug("hello.world")).toBe(false);
    });

    it("should return false for slugs with invalid hyphen placement", () => {
      expect(is.slug("-hello")).toBe(false); // starts with hyphen
      expect(is.slug("hello-")).toBe(false); // ends with hyphen
      expect(is.slug("hello--world")).toBe(false); // consecutive hyphens
    });
  });
  describe("capitalize", () => {
    it("should capitalize a string", () => {
      expect(capitalize("hello")).toBe("Hello");
    });
  });
  describe("cleanStringArray", () => {
    it("should remove empty strings from an array", () => {
      expect(cleanStringArray(["hello", "", "world"])).toEqual([
        "hello",
        "world",
      ]);
    });
    it("should handle non-string elements", () => {
      expect(cleanStringArray(["hello", 42, "world"])).toEqual([
        "hello",
        "world",
      ]);
    });
  });
  describe("toVariants", () => {
    it("should handle non-string inputs", () => {
      //@ts-expect-error - Testing invalid input
      expect(toVariants(42)).toEqual({ title: "", kebab: "", pascal: "" });
      //@ts-expect-error - Testing invalid input
      expect(toVariants(null)).toEqual({ title: "", kebab: "", pascal: "" });
      //@ts-expect-error - Testing invalid input
      expect(toVariants(undefined)).toEqual({
        title: "",
        kebab: "",
        pascal: "",
      });
    });

    it("should convert kebab-case strings", () => {
      expect(toVariants("hello-world")).toEqual({
        kebab: "hello-world",
        pascal: "HelloWorld",
        title: "Hello World",
      });
    });

    it("should convert space-separated strings", () => {
      expect(toVariants("hello world")).toEqual({
        kebab: "hello-world",
        pascal: "HelloWorld",
        title: "Hello World",
      });
    });

    it("should convert camelCase strings", () => {
      expect(toVariants("helloWorld")).toEqual({
        kebab: "hello-world",
        pascal: "HelloWorld",
        title: "Hello World",
      });
    });

    it("should convert PascalCase strings", () => {
      expect(toVariants("HelloWorld")).toEqual({
        kebab: "hello-world",
        pascal: "HelloWorld",
        title: "Hello World",
      });
    });

    it("should handle strings with special characters", () => {
      expect(toVariants("hello/world!test")).toEqual({
        kebab: "hello-world-test",
        pascal: "HelloWorldTest",
        title: "Hello World Test",
      });
    });

    it("should handle strings with mixed casing patterns", () => {
      expect(toVariants("hello-WORLD-Test")).toEqual({
        kebab: "hello-world-test",
        pascal: "HelloWorldTest",
        title: "Hello World Test",
      });
    });

    it("should handle uppercase acronyms correctly", () => {
      expect(toVariants("helloAPIWorld")).toEqual({
        kebab: "hello-api-world",
        pascal: "HelloApiWorld",
        title: "Hello Api World",
      });
    });

    it("should normalize whitespace correctly", () => {
      expect(toVariants("  hello  world  ")).toEqual({
        kebab: "hello-world",
        pascal: "HelloWorld",
        title: "Hello World",
      });
    });
  });
});
