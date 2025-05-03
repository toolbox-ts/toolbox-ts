import { describe, it, expect } from "vitest";
import { splitCssColorString } from "./utils";

describe("splitCssColorString", () => {
  it("splits a standard rgb string", () => {
    expect(splitCssColorString("rgb(10, 20, 30)")).toEqual(["10", "20", "30"]);
  });

  it("splits a standard rgba string", () => {
    expect(splitCssColorString("rgba(1,2,3,0.5)")).toEqual([
      "1",
      "2",
      "3",
      "0.5",
    ]);
  });

  it("trims extra spaces", () => {
    expect(splitCssColorString("rgba(  100 , 200 ,  50 , 1 )")).toEqual([
      "100",
      "200",
      "50",
      "1",
    ]);
  });

  it("handles empty arguments", () => {
    expect(splitCssColorString("rgb(   )")).toEqual([""]);
  });

  it("handles single value", () => {
    expect(splitCssColorString("foo(42)")).toEqual(["42"]);
  });
});
