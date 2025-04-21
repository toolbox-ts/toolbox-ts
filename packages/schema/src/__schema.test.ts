import { describe, expect, it, vi } from "vitest";
import { type FieldDefinitions, create, isFields } from "./schema.js";
import * as Field from "./field/field.js";
describe("Schema", () => {
  interface TestConfig {
    stringField: string;
    numberField: number;
    objectField: { nested: string; value: number };
    arrayField: string[];
  }

  const defaultConfig: FieldDefinitions<TestConfig> = {
    stringField: { type: "primitive", defaultValue: "default" },
    numberField: { type: "primitive", defaultValue: 42 },
    objectField: {
      type: "object",
      defaultValue: { nested: "nested", value: 1 },
    },
    arrayField: { type: "array", defaultValue: ["default"] },
  };
  describe("isFields", () => {
    it("should return false if input is not an object", () => {
      const result = isFields("key");
      expect(result).toBe(false);
    });

    it("should return false if any field is not typed", () => {
      const result = isFields({
        key: {
          type: "primitive",
          instance: { current: "value", default: "default" },
        },
      } as unknown);

      expect(result).toBe(false);
    });

    it("should return true if all fields are typed correctly", () => {
      const result = isFields({
        key: {
          type: "primitive",
          instance: Field.create.primitive({ defaultValue: "default" })
            .instance,
        },
      });

      expect(result).toBe(true);
    });
  });
  it("creates schema with default values", () => {
    const schema = create({ fields: defaultConfig, processorHooks: {} });
    expect(schema.current).toEqual({
      stringField: "default",
      numberField: 42,
      objectField: { nested: "nested", value: 1 },
      arrayField: ["default"],
    });
  });
  it("should create an array field with defaultValue wrapped in an array if not already an array", () => {
    const schema = create({
      fields: { field1: { type: "array", defaultValue: "value" } },
    });

    expect(schema.current).toEqual({ field1: ["value"] });
  });

  it("should create an array field with defaultValue as is if already an array", () => {
    const schema = create({
      fields: { field1: { type: "array", defaultValue: ["value1", "value2"] } },
    });

    expect(schema.current).toEqual({ field1: ["value1", "value2"] });
  });
  it("handles field updates", () => {
    const schema = create({ fields: defaultConfig, processorHooks: {} });
    schema.set("stringField", "updated");
    schema.set("numberField", 100);
    schema.set("objectField", { nested: "new", value: 2 });
    schema.set("arrayField", ["new"]);

    expect(schema.current).toEqual({
      stringField: "updated",
      numberField: 100,
      objectField: { nested: "new", value: 2 },
      arrayField: ["new"],
    });
  });
  it("initializes with partial configuration", () => {
    const schema = create({
      fields: defaultConfig,
      processorHooks: {},
      partial: {
        stringField: "initial",
        numberField: 99,
        arrayField: ["initial"],
      },
    });

    expect(schema.current).toEqual({
      stringField: "initial",
      numberField: 99,
      objectField: { nested: "nested", value: 1 },
      arrayField: ["initial"],
    });
  });

  it("validates partial configuration during initialization", () => {
    const schema = create({
      fields: defaultConfig,
      processorHooks: {},
      partial: { stringField: 123, numberField: 99 },
    });
    expect(schema.current).toEqual({
      stringField: "default",
      numberField: 99,
      objectField: { nested: "nested", value: 1 },
      arrayField: ["default"],
    });
  });

  it("handles empty partial configuration", () => {
    const schema = create({
      fields: defaultConfig,
      processorHooks: {},
      partial: {},
    });

    expect(schema.current).toEqual({
      stringField: "default",
      numberField: 42,
      objectField: { nested: "nested", value: 1 },
      arrayField: ["default"],
    });
  });

  it("applies partial with nested object updates", () => {
    const schema = create({
      fields: defaultConfig,
      processorHooks: {},
      partial: { objectField: { nested: "partial", value: 5 } },
    });

    expect(schema.current.objectField).toEqual({ nested: "partial", value: 5 });
  });

  it("resets to default values", () => {
    const schema = create({ fields: defaultConfig, processorHooks: {} });
    schema.set("stringField", "updated");
    schema.reset();
    expect(schema.current).toEqual(schema.default);
  });
  describe("process", () => {
    it("should return current values if partialHasKeys returns false", () => {
      const schema = create({
        fields: {
          field1: { type: "primitive", defaultValue: "default1" },
          field2: { type: "primitive", defaultValue: "default2" },
        },
      });

      const result = schema.process({});
      expect(result).toEqual({ field1: "default1", field2: "default2" });
    });

    it("should call pre hook if defined", () => {
      const preMock = vi.fn().mockReturnValue({ field1: "preProcessedValue" });

      const schema = create({
        fields: { field1: { type: "primitive", defaultValue: "default1" } },
        processorHooks: { pre: preMock },
      });

      const result = schema.process({ field1: "newValue" });

      expect(preMock).toHaveBeenCalledWith({ field1: "newValue" });
      expect(result).toEqual({ field1: "preProcessedValue" });
    });

    it("should call post hook if defined", () => {
      const postMock = vi
        .fn()
        .mockReturnValue({ field1: "postProcessedValue" });

      const schema = create({
        fields: { field1: { type: "primitive", defaultValue: "default1" } },
        processorHooks: { post: postMock },
      });

      const result = schema.process({ field1: "newValue" });

      expect(postMock).toHaveBeenCalledWith({ field1: "newValue" });
      expect(result).toEqual({ field1: "postProcessedValue" });
    });

    it("should apply both pre and post hooks correctly", () => {
      const preMock = vi.fn().mockReturnValue({ field1: "preProcessedValue" });
      const postMock = vi
        .fn()
        .mockReturnValue({ field1: "postProcessedValue" });

      const schema = create({
        fields: { field1: { type: "primitive", defaultValue: "default1" } },
        processorHooks: { pre: preMock, post: postMock },
      });

      const result = schema.process({ field1: "newValue" });

      expect(preMock).toHaveBeenCalledWith({ field1: "newValue" });
      expect(postMock).toHaveBeenCalledWith({ field1: "preProcessedValue" });
      expect(result).toEqual({ field1: "postProcessedValue" });
    });
  });

  it("validates field types", () => {
    const schema = create({ fields: defaultConfig, processorHooks: {} });
    schema.set("stringField", 123);
    expect(schema.current.stringField).toBe("default");
  });

  it("processes partial updates", () => {
    const schema = create({ fields: defaultConfig, processorHooks: {} });
    schema.update({ stringField: "partial update", numberField: 200 });
    expect(schema.current.stringField).toBe("partial update");
    expect(schema.current.numberField).toBe(200);
    expect(schema.current.objectField).toEqual({ nested: "nested", value: 1 });
  });

  it("clones schema correctly", () => {
    const schema = create({ fields: defaultConfig, processorHooks: {} });
    const cloned = schema.clone();

    schema.set("stringField", "modified");
    expect(cloned.current.stringField).toBe("default");
    expect(schema.current.stringField).toBe("modified");
  });

  it("applies processor hooks", () => {
    const hooks = {
      pre: (cfg: unknown) => ({
        ...(cfg as Partial<TestConfig>),
        stringField: "pre-processed",
      }),
      post: (cfg: TestConfig) => ({ ...cfg, numberField: cfg.numberField * 2 }),
    };

    const schema = create({ fields: defaultConfig, processorHooks: hooks });
    const processed = schema.process({
      stringField: "test",
      numberField: 10,
      objectField: { nested: "processed", value: 5 },
      arrayField: ["processed"],
    });

    expect(processed).toEqual({
      stringField: "pre-processed",
      numberField: 20,
      objectField: { nested: "processed", value: 5 },
      arrayField: ["processed"],
    });
  });

  it("checks for valid partial configurations", () => {
    const schema = create({ fields: defaultConfig, processorHooks: {} });
    expect(schema.partialHasKeys({ invalidKey: "value" })).toBe(false);
    expect(schema.partialHasKeys({ stringField: "valid" })).toBe(true);
    expect(schema.partialHasKeys("keys")).toBe(false);
  });

  it("validates complete configurations", () => {
    const schema = create({ fields: defaultConfig, processorHooks: {} });
    expect(
      schema.is({
        stringField: "valid",
        numberField: 1,
        objectField: { nested: "test", value: 1 },
        arrayField: ["default"],
      }),
    ).toBe(true);
    expect(
      schema.is({
        stringField: 123,
        numberField: 1,
        objectField: { nested: "test", value: 1 },
      }),
    ).toBe(false);
    expect(schema.is({ invalidKey: "value" })).toBe(false);
  });

  it("handles schema keys and length", () => {
    const schema = create({ fields: defaultConfig, processorHooks: {} });
    expect(schema.length).toBe(4);
    expect(schema.keys).toEqual([
      "stringField",
      "numberField",
      "objectField",
      "arrayField",
    ]);
    expect(schema.has("stringField")).toBe(true);
    expect(schema.has("invalidKey")).toBe(false);
  });
});
