import type { Selectors } from "@toolbox-ts/css-types";
import {
  type VarKey,
  type VarsInput,
  type VarsByProp,
  propMap,
} from "../types.js";

export const resolveSelector = ({
  primary,
  steps = [],
}: Selectors.Block): string => {
  const chainKeys = [
    "tag",
    "id",
    "class",
    "attribute",
    "pseudo",
    "rest",
  ] as const;
  const normalize = (part: string | string[]): string =>
    Array.isArray(part) ? part.join("") : part;

  const resolve = (curr: Selectors.ChainBase): string =>
    chainKeys.reduce(
      (acc, key) => (curr[key] ? (acc += normalize(curr[key])) : acc),
      "",
    );
  const { attribute, class: _class, logical, id, pseudo, rest, tag } = primary;
  let opening = "";
  let closing = "";
  if (logical) {
    const l = Array.isArray(logical) ? logical : [logical];
    closing = ")".repeat(l.length);
    opening = l.map((_l) => `:${_l}(`).join("");
  }
  const root = pseudo === ":root" ? ":root" : "";
  let selector = resolve({
    ...(root ? { pseudo: undefined, tag: undefined } : { pseudo, tag }),
    attribute,
    class: _class,
    id,
    rest,
  });

  return `${opening}${root}${
    steps.length
      ? (selector += steps
          .map(
            ([combinator, chain]) =>
              `${combinator === " " ? " " : ` ${combinator} `}${resolve(chain)}`,
          )
          .join("")).trim()
      : selector
  }${closing}`;
};

export interface Defined {
  toString: () => string;
  toPropKeyObj: () => Partial<VarsByProp>;
  toBlock: (selector: Selectors.Block) => string;
  toBlockObj: (selector: Selectors.Block) => {
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

  const toBlock = (selector: Selectors.Block): string =>
    entries.length ? `${resolveSelector(selector)} {\n${toString()}}` : "{}";
  const toBlockObj = (selector: Selectors.Block) => ({
    selector: resolveSelector(selector),
    css: toPropKeyObj(),
  });
  return { toString, toPropKeyObj, toBlock, toBlockObj };
};
