import { describe, expect, it } from "vitest";
import * as Field from "./field.js";

describe("Field", () => {
  describe("Field constructor validation errors", () => {
    it("should throw error for invalid primitive default value", () => {
      expect(() =>
        Field.create.primitive({ defaultValue: { not: "primitive" } as any }),
      ).toThrow();
    });

    it("should throw error for invalid primitive currentValue", () => {
      expect(() =>
        Field.create.primitive({ defaultValue: "ok", currentValue: 42 as any }),
      ).toThrow();
    });

    it("should throw error for non-array defaultValue in ArrayField", () => {
      expect(() =>
        Field.create.array({ defaultValue: "not-an-array" as any }),
      ).toThrow();
    });

    it("should throw error if array contains wrong element type", () => {
      expect(() =>
        Field.create.array({ defaultValue: [1, "bad"] as any[] }),
      ).toThrow();
    });

    it("should throw error for invalid currentValue array", () => {
      expect(() =>
        Field.create.array({
          defaultValue: [1, 2],
          currentValue: [1, "bad"] as any[],
        }),
      ).toThrow();
    });
    it("should provide default array guard", () => {
      const field = Field.create.array({ defaultValue: [1, 2] });
      expect(field.instance.is([1, 2])).toBe(true);
      expect(field.instance.is([1, "bad"])).toBe(false);
    });
  });
  describe("PrimitiveField", () => {
    it("should throw an error if defaultValue is an object", () => {
      const opts = { defaultValue: { key: "value" } };
      expect(() => Field.create.primitive(opts)).toThrowError();
    });
    it("creates primitive fields with valid values", () => {
      const field = Field.create.primitive({
        defaultValue: "test",
        currentValue: "current",
      });
      expect(field.instance.current).toBe("current");
      expect(field.instance.default).toBe("test");
    });

    it("validates values on set", () => {
      const field = Field.create.primitive({
        defaultValue: "test",
        is: (v): v is string => typeof v === "string" && v.length > 2,
      });

      field.instance.set("valid");
      expect(field.instance.current).toBe("valid");

      field.instance.set("no");
      expect(field.instance.current).toBe("valid");
    });

    it("rejects object values in constructor", () => {
      expect(() =>
        Field.create.primitive({ defaultValue: {} as any }),
      ).toThrow();
    });

    it("clones correctly", () => {
      const original = Field.create.primitive({ defaultValue: "test" });
      const cloned = original.instance.clone();

      original.instance.set("modified");
      expect(cloned.current).toBe("test");
    });
    it("reset", () => {
      const opts = { defaultValue: "test", currentValue: "current" };
      const field = Field.create.primitive(opts);
      field.instance.set("newValue");
      expect(field.instance.current).toBe("newValue");

      field.instance.reset();
      expect(field.instance.current).toBe("test");
    });
  });
  describe("ObjectField", () => {
    const defaultObj = { key: "value" };
    it("creates object fields with valid values", () => {
      const field = Field.create.object({
        defaultValue: defaultObj,
        currentValue: { key: "current" },
      });
      expect(field.instance.current).toEqual({ key: "current" });
      expect(field.instance.default).toEqual(defaultObj);
    });

    it("handles custom merge functions", () => {
      const merge = (current: any, update: any) => ({
        ...current,
        ...update,
        merged: true,
      });

      const field = Field.create.object({ defaultValue: defaultObj, merge });

      field.instance.set({ key: "updated" });
      expect(field.instance.current).toEqual({ key: "updated", merged: true });
    });

    it("freezes default values", () => {
      const field = Field.create.object({ defaultValue: defaultObj });
      expect(
        () => ((field.instance.default as any).key = "modified"),
      ).toThrow();
    });

    it("clones with deep copy", () => {
      const original = Field.create.object({
        defaultValue: { nested: { value: "test" } },
      });
      const cloned = original.instance.clone();

      original.instance.set({ nested: { value: "modified" } });
      expect(cloned.current).toEqual({ nested: { value: "test" } });
    });
    describe("isPartial", () => {
      it("should return true for partial object values", () => {
        const opts = { defaultValue: { key: "value" } };
        const field = Field.create.object(opts);

        const partial = { key: "newValue" };
        expect(field.instance.isPartial(partial)).toBe(true);
      });

      it("should return false for non-partial object values", () => {
        const opts = { defaultValue: { key: "value" } };
        const field = Field.create.object(opts);

        const nonPartial = { anotherKey: "value" };
        expect(field.instance.isPartial(nonPartial)).toBe(false);
      });
    });
    it("process returns current when merge result is invalid", () => {
      const defaultValue = { foo: "bar" };
      const currentValue = { foo: "bar" };

      const field = Field.create.object({
        defaultValue,
        currentValue,
        is: (v: unknown): v is { foo: string } =>
          typeof v === "object" &&
          v !== null &&
          "foo" in v &&
          typeof (v as any).foo === "string",
        merge: (_current, _incoming) => {
          return { foo: 123 } as any;
        },
      }).instance;

      const processed = field.process({ foo: "baz" });

      expect(processed).toEqual(currentValue);
    });
  });
  describe("ArrayField", () => {
    it("should throw an error if defaultValue is not an array", () => {
      const opts = { defaultValue: "notAnArray" };
      //@ts-expect-error Testing invalid input
      expect(() => Field.create.array(opts)).toThrowError();
    });

    it("creates array fields with valid values", () => {
      const field = Field.create.array({
        defaultValue: ["test"],
        currentValue: ["current"],
      });
      expect(field.instance.current).toEqual(["current"]);
      expect(field.instance.default).toEqual(["test"]);
    });

    it("validates array values on set", () => {
      const field = Field.create.array({ defaultValue: ["test"] });

      field.instance.set(["valid", "strings"]);
      expect(field.instance.current).toEqual(["valid", "strings"]);

      field.instance.set([123, 456]);
      expect(field.instance.current).toEqual(["valid", "strings"]);
    });

    it("handles array cloning correctly", () => {
      const original = Field.create.array({ defaultValue: ["test"] });
      const cloned = original.instance.clone();

      original.instance.set(["modified"]);
      expect(cloned.current).toEqual(["test"]);
    });

    it("processes array values", () => {
      const field = Field.create.array({ defaultValue: ["default"] });

      expect(field.instance.process(["updated"])).toEqual(["updated"]);
      expect(field.instance.process("invalid")).toEqual(["default"]);
    });

    it("maintains array immutability", () => {
      const field = Field.create.array({ defaultValue: ["test"] });

      const current = field.instance.current;
      current.push("modified");

      expect(field.instance.current).toEqual(["test"]);
    });

    it("validates nested array values", () => {
      const field = Field.create.array({
        defaultValue: [{ value: "test" }],
        isElement: (v): v is { value: string } =>
          typeof v === "object" &&
          v !== null &&
          "value" in v &&
          typeof v.value === "string",
      });

      field.instance.set([{ value: "valid" }]);
      expect(field.instance.current).toEqual([{ value: "valid" }]);

      field.instance.set([{ value: 123 }]);
      expect(field.instance.current).toEqual([{ value: "valid" }]);
    });
    it("should handle isElement conditional correctly for valid arrays", () => {
      const opts = { defaultValue: [{}] };
      const field = Field.create.array(opts);
      const result = field.instance.is([{}]);
      expect(result).toBe(true);
    });
  });

  describe("Type Guards", () => {
    it("validates types", () => {
      expect(Field.is.type("primitive")).toBe(true);
      expect(Field.is.type("object")).toBe(true);
      expect(Field.is.type("invalid")).toBe(false);
    });

    it("baseOpts", () => {
      expect(Field.is.baseOpts({ defaultValue: "test" })).toBe(true);
      expect(Field.is.baseOpts({})).toBe(false);
    });

    it("objectOpts", () => {
      expect(Field.is.objectOpts({ defaultValue: {} })).toBe(true);
      expect(Field.is.objectOpts({ defaultValue: "invalid" })).toBe(false);
    });

    it("primitive", () => {
      const field = Field.create.primitive({ defaultValue: "test" });
      expect(Field.is.primitive(field)).toBe(true);
      expect(Field.is.primitive({})).toBe(false);
    });

    it("object", () => {
      const field = Field.create.object({ defaultValue: {} });
      expect(Field.is.object(field)).toBe(true);
      expect(Field.is.object({})).toBe(false);
    });

    it("typed", () => {
      const primitive = Field.create.primitive({ defaultValue: "test" });
      const object = Field.create.object({ defaultValue: {} });

      expect(Field.is.typed(primitive)).toBe(true);
      expect(Field.is.typed(object)).toBe(true);
      expect(Field.is.typed({})).toBe(false);
    });
    it("array", () => {
      const field = Field.create.array({ defaultValue: [] });
      expect(Field.is.array(field)).toBe(true);
      expect(Field.is.array({})).toBe(false);
    });
  });
  describe("Field Processing", () => {
    it("processes primitive values", () => {
      const field = Field.create.primitive({
        defaultValue: "test",
        is: (v): v is string => typeof v === "string" && v.length > 2,
      });

      expect(field.instance.process("valid")).toBe("valid");
      expect(field.instance.process("no")).toBe("test");
    });

    it("processes object values", () => {
      const field = Field.create.object({
        defaultValue: { key: "value" },
        merge: (current, update) => ({
          ...current,
          ...(update ?? {}),
          processed: true,
        }),
      });

      expect(field.instance.process({ key: "updated" })).toEqual({
        key: "updated",
        processed: true,
      });
      expect(field.instance.process(null)).toEqual({ key: "value" });
    });

    it("sets values using processed results", () => {
      const field = Field.create.primitive({
        defaultValue: "test",
        is: (v): v is string => typeof v === "string" && v.length > 2,
      });

      field.instance.set("valid");
      expect(field.instance.current).toBe("valid");

      field.instance.set("no");
      expect(field.instance.current).toBe("valid");
    });
  });
});
