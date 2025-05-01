import { describe, it, expect, vi } from "vitest";
import { define, resolveSelector } from "./define.js";
import type { VarsInput } from "../types.js";
import type { Selectors } from "@toolbox-ts/css-types";

describe("resolveSelector", () => {
  it("should resolve a selector chain correctly", () => {
    const chain: Selectors.PrimaryChain = {
      tag: "div",
      id: "#my-id",
      class: ".my-class",
      attribute: "[data-attribute]",
      pseudo: ":hover",
      rest: [".additional-class", ":focus"],
    };

    const selector = resolveSelector({ primary: chain });

    expect(selector).toBe(
      "div#my-id.my-class[data-attribute]:hover.additional-class:focus",
    );
  });

  it("should handle :root with id/class and ignore tag", () => {
    const chain: Selectors.PrimaryChain = {
      pseudo: ":root",
      id: "#root-id",
      class: ".root-class",
      //@ts-expect-error testing invalid input
      tag: "div", // Should be ignored
    };

    const selector = resolveSelector({ primary: chain });

    expect(selector).toBe(":root#root-id.root-class");
  });

  it("should handle empty steps correctly", () => {
    const chain: Selectors.PrimaryChain = {
      id: "#my-id",
      class: ".my-class",
      pseudo: ":root",
    };

    const selector = resolveSelector({ primary: chain, steps: [] });

    expect(selector).toBe(":root#my-id.my-class");
  });

  it("should correctly resolve with steps", () => {
    const chain: Selectors.PrimaryChain = {
      tag: "div",
      id: "#my-id",
      class: ".my-class",
    };
    const steps: Selectors.Block["steps"] = [
      [">", { tag: "span" }],
      ["+", { class: ".my-other-class" }],
    ];

    const selector = resolveSelector({ primary: chain, steps });

    expect(selector).toBe("div#my-id.my-class > span + .my-other-class");
  });

  it("should normalize array values in chain fields correctly", () => {
    const chain: Selectors.PrimaryChain = {
      class: [".one", ".two"],
      pseudo: [":hover", ":focus"],
    };

    const selector = resolveSelector({ primary: chain });
    expect(selector).toBe(".one.two:hover:focus");
  });

  it("should ignore undefined or null keys in chain", () => {
    const chain: Selectors.PrimaryChain = {
      tag: "button",
      class: null as any,
      pseudo: undefined,
    };

    const selector = resolveSelector({ primary: chain });
    expect(selector).toBe("button");
  });

  it("should handle multiple steps with various combinators", () => {
    const selector = resolveSelector({
      primary: { tag: "ul" },
      steps: [
        [" ", { tag: "li", class: ".item" }],
        [">", { tag: "a", pseudo: ":hover" }],
      ],
    });

    expect(selector).toBe("ul li.item > a:hover");
  });

  it("should handle logical pseudo-classes", () => {
    const selector = resolveSelector({
      primary: { tag: "area", logical: "not" },
    });
    expect(selector).toBe(":not(area)");
  });

  it("should handle ordered logical pseudo-classes", () => {
    const chain: Selectors.PrimaryChain = {
      tag: "div",
      logical: ["not", "is", "where", "has"],
      class: ".complex",
    };

    const selector = resolveSelector({ primary: chain });
    expect(selector).toBe(":not(:is(:where(:has(div.complex))))");
  });

  it("should handle :root wrapped in :is()", () => {
    const chain: Selectors.PrimaryChain = { pseudo: ":root", logical: "is" };

    const selector = resolveSelector({ primary: chain });
    expect(selector).toBe(":is(:root)");
  });

  it("should handle :root wrapped in multiple logicals", () => {
    const chain: Selectors.PrimaryChain = {
      pseudo: ":root",
      logical: ["not", "is"],
    };

    const selector = resolveSelector({ primary: chain });
    expect(selector).toBe(":not(:is(:root))");
  });
});

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

  it("should generate correct toBlock output", () => {
    const selector: Selectors.Block = {
      primary: { tag: "div", id: "#my-id" },
      steps: [[">", { tag: "span" }]],
    };

    const expectedBlock =
      "div#my-id > span {\n--bold: 700;\n--font-size: 16px;\n--line-height: 1.5;\n--padding: 10px;}";
    expect(defined.toBlock(selector)).toBe(expectedBlock);
  });

  it("should generate correct toBlockObj output", () => {
    const selector: Selectors.Block = {
      primary: { tag: "div", id: "#my-id" },
      steps: [[">", { tag: "span" }]],
    };

    const expectedBlockObj = {
      selector: "div#my-id > span",
      css: {
        "--bold": "700;",
        "--font-size": "16px;",
        "--line-height": "1.5;",
        "--padding": "10px;",
      },
    };
    expect(defined.toBlockObj(selector)).toEqual(expectedBlockObj);
  });

  it("should handle empty VarsInput correctly", () => {
    const emptyDefined = define({});
    expect(emptyDefined.toString()).toBe("");
    expect(emptyDefined.toPropKeyObj()).toEqual({});
    const emptySelector: Selectors.Block = { primary: {}, steps: [] };
    expect(emptyDefined.toBlock(emptySelector)).toBe("{}");
    expect(emptyDefined.toBlockObj(emptySelector)).toEqual({
      selector: "",
      css: {},
    });
  });

  it("should preserve string conversion in toPropKeyObj", () => {
    const input: VarsInput = { bold: 700, lineHeight: 1.5 };

    const result = define(input);
    expect(result.toPropKeyObj()).toEqual({
      "--bold": "700;",
      "--line-height": "1.5;",
    });
  });
});
