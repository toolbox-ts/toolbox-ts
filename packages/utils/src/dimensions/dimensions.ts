import { Obj } from "../object/index.js";
import { Num } from "../number/index.js";
import type { Spatial, Segments } from "../types/index.js";
const C = {
  TYPES: {
    fixed: "fixed",
    dynamic: "dynamic",
    dynamicWidth: "dynamicWidth",
    dynamicHeight: "dynamicHeight",
  },
  DEFAULT_FIXED: { width: 10, height: 3 },
} as const;
const isType = (type: unknown): type is Type =>
  typeof type === "string" && type in C.TYPES;

type Type = keyof typeof C.TYPES;

type TypeMap = { [K in Type]: { type: K } & Spatial.Dimensions };

type Typed<V extends Type = Type> = TypeMap[V];

type TypeInputMap = { [K in Type]: { type: K } & Partial<Spatial.Dimensions> };
type TypedInput<V extends Type = Type> = TypeInputMap[V];
type StrategyMap = {
  [T in Type]: {
    default: TypeMap[T];
    guard: (dims: unknown) => dims is TypeMap[T];
    resolve: (input?: {
      type?: string;
      width?: number;
      height?: number;
    }) => TypeMap[T];
  };
};

const is = (dims: unknown): dims is Spatial.Dimensions =>
  Obj.is(dims) && Num.is.positive(dims.width) && Num.is.positive(dims.height);

const isEqual = (d1: Spatial.Dimensions, d2: Spatial.Dimensions) =>
  d1.width === d2.width && d1.height === d2.height;

const STRATEGY: StrategyMap = Obj.freeze({
  fixed: {
    default: { type: "fixed", ...C.DEFAULT_FIXED },
    guard: (dims: unknown): dims is TypeMap["fixed"] =>
      Obj.is(dims) &&
      Num.is.positive(dims.width) &&
      Num.is.positive(dims.height),
    resolve: (input?): TypeMap["fixed"] => ({
      type: "fixed",
      width: input?.width ?? STRATEGY.fixed.default.width,
      height: input?.height ?? STRATEGY.fixed.default.height,
    }),
  },
  dynamic: {
    default: { type: "dynamic", width: Infinity, height: Infinity },
    guard: (dims: unknown): dims is TypeMap["dynamic"] =>
      Obj.is(dims) &&
      Num.is.infinity(dims.width) &&
      Num.is.infinity(dims.height),
    resolve: (input?) => STRATEGY.dynamic.default,
  },
  dynamicWidth: {
    default: {
      type: "dynamicWidth",
      width: Infinity,
      height: C.DEFAULT_FIXED.height,
    },
    guard: (dims: unknown): dims is TypeMap["dynamicWidth"] =>
      Obj.is(dims) && dims.width === Infinity && Num.is.positive(dims.height),
    resolve: (input?) => ({
      type: "dynamicWidth",
      width: Infinity,
      height: input?.height ?? STRATEGY.fixed.default.height,
    }),
  },
  dynamicHeight: {
    default: {
      type: "dynamicHeight",
      width: C.DEFAULT_FIXED.width,
      height: Infinity,
    },
    guard: (dims: unknown): dims is TypeMap["dynamicHeight"] =>
      Obj.is(dims) &&
      Num.is.positive(dims.width) &&
      Num.is.infinity(dims.height),
    resolve: (input?) => ({
      type: "dynamicHeight",
      height: Infinity,
      width: input?.width ?? STRATEGY.fixed.default.width,
    }),
  },
} as const);

const isTyped = (dims: unknown): dims is Typed =>
  Obj.is(dims) && isType(dims.type) && STRATEGY[dims.type].guard(dims);

interface CreateTypedCfgOpts<K extends string> {
  key: K;
  dimensions: Typed | TypedInput;
}

const createTypedCfg = <K extends string>({
  dimensions,
  key,
}: CreateTypedCfgOpts<K>) => {
  const value = STRATEGY[dimensions.type].resolve(dimensions);
  return { key, value, validator: isTyped } as const;
};

const add = (d1: Spatial.Dimensions, d2: Spatial.Dimensions) => ({
  width: d1.width + d2.width,
  height: d1.height + d2.height,
});
const sum = (dimensions: Spatial.Dimensions[]) =>
  dimensions.reduce(add, { width: 0, height: 0 });

const subtract = (d1: Spatial.Dimensions, d2: Spatial.Dimensions) => ({
  width: d1.width - d2.width,
  height: d1.height - d2.height,
});
const calculate = {
  oriented: (
    dimensions: Spatial.Dimensions[],
    orientation: "horizontal" | "vertical",
  ): Spatial.Dimensions => {
    const primary = orientation === "horizontal" ? "width" : "height";
    const secondary = primary === "width" ? "height" : "width";
    return dimensions.reduce<Spatial.Dimensions>(
      (acc, curr) => {
        acc[primary] += curr[primary];
        acc[secondary] = Math.max(acc[secondary], curr[secondary]);
        return acc;
      },
      { width: 0, height: 0 },
    );
  },
} as const;
const get = {
  orientedDimensionKeys: (
    orientation: "horizontal" | "vertical",
  ): {
    width: Segments.PrimarySecondaryKey;
    height: Segments.PrimarySecondaryKey;
  } =>
    orientation === "horizontal"
      ? { width: "primary", height: "secondary" }
      : { width: "secondary", height: "primary" },
} as const;

export {
  type CreateTypedCfgOpts,
  type Type,
  type Typed,
  type TypedInput,
  add,
  C,
  calculate,
  createTypedCfg,
  get,
  is,
  isEqual,
  isType,
  isTyped,
  STRATEGY,
  subtract,
  sum,
};
