import { describe, it, expect, vi } from "vitest";
import { define } from "./define.js";
import type { VarsInput } from "../types.js";
import type { Selectors } from "@toolbox-ts/css-types";

describe("define", () => {
  const varsInput: VarsInput = {
    bold: "700",
    fontSize: "16px",
    lineHeight: "1.5",
    padding: "10px",
  };

  const defined = define(varsInput);

  it("should generate correct toString output", () => {
    const expectedString = `--bold: 700;\n--font-size: 16px;\n--line-height: 1.5;\n--padding: 10px;`;
    expect(defined.toString()).toBe(expectedString);
  });

  it("should generate correct toPropKeyObj output", () => {
    const expectedObj = {
      "--bold": "700;",
      "--font-size": "16px;",
      "--line-height": "1.5;",
      "--padding": "10px;",
    };
    expect(defined.toPropKeyObj()).toEqual(expectedObj);
  });

  it("should generate correct toBlockObj output", () => {
    const expectedBlockObj = {
      selector: "div#my-id > span",
      css: {
        "--bold": "700;",
        "--font-size": "16px;",
        "--line-height": "1.5;",
        "--padding": "10px;",
      },
    };
    expect(defined.toBlockObj("div#my-id > span")).toEqual(expectedBlockObj);
  });
  it("should generate correct toBlock output", () => {
    const expectedBlock = `div#my-id > span {\n--bold: 700;\n--font-size: 16px;\n--line-height: 1.5;\n--padding: 10px;}`;
    expect(defined.toBlock("div#my-id > span")).toBe(expectedBlock);
  });

  it("should handle empty VarsInput correctly", () => {
    const emptyDefined = define({});
    expect(emptyDefined.toString()).toBe("");
    expect(emptyDefined.toPropKeyObj()).toEqual({});
    expect(emptyDefined.toBlock("")).toBe("{}");
    expect(emptyDefined.toBlockObj("")).toEqual({ selector: "", css: {} });
  });

  it("should preserve string conversion in toPropKeyObj", () => {
    const input: VarsInput = { bold: "700", lineHeight: "1.5" };

    const result = define(input);
    expect(result.toPropKeyObj()).toEqual({
      "--bold": "700;",
      "--line-height": "1.5;",
    });
  });
});
