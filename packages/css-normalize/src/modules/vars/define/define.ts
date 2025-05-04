import {
  type VarKey,
  type VarsInput,
  type VarsByProp,
  propMap,
} from "../types.js";

export interface Defined {
  toString: () => string;
  toPropKeyObj: () => Partial<VarsByProp>;
  toBlock: (selector: string) => string;
  toBlockObj: (selector: string) => {
    selector: string;
    css: Partial<VarsByProp>;
  };
}

export const define = (v: VarsInput): Defined => {
  const entries = Object.entries(v).filter(([key, value]) => value) as [
    VarKey,
    NonNullable<VarsInput[VarKey]>,
  ][];
  const toString = (): string =>
    entries.map(([key, value]) => `${propMap[key]}: ${value};`).join("\n");
  const toPropKeyObj = () =>
    entries.reduce<Partial<VarsByProp>>((acc, [key, value]) => {
      (acc as Record<string, unknown>)[propMap[key]] = `${value.toString()};`;
      return acc;
    }, {});

  const toBlock = (selector: string): string =>
    entries.length ? `${selector} {\n${toString()}}` : "{}";
  const toBlockObj = (selector: string) => ({ selector, css: toPropKeyObj() });

  return { toString, toPropKeyObj, toBlock, toBlockObj };
};
