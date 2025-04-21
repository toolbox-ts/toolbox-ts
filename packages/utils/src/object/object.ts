import type { StringRecord, StrProperty, DeepPartial } from "./types.js";

const is = <V = StringRecord, K = keyof V & string>(
  provided: unknown,
  strKeys: (K & string)[] = [],
): provided is V =>
  typeof provided === "object" &&
  provided !== null &&
  strKeys.every((key) => key in provided);

const isPartialOf = <V = object>(
  partial: unknown,
  established: V,
): partial is DeepPartial<V> =>
  is(partial) &&
  is(established) &&
  Object.entries(partial).every(([key, value]) => {
    const val = established[key];
    if (!val) return false;
    return is(val) ? isPartialOf(value, val) : typeof value === typeof val;
  });

const isStrKeyOf = <T extends StringRecord = StringRecord>(
  key: unknown,
  obj: T,
): key is StrProperty<T> => typeof key === "string" && key in obj;

const clone = <T>(obj: T): T => {
  if (!is(obj)) return obj;
  if (Array.isArray(obj))
    return obj.map((item: unknown) => (is(item) ? clone(item) : item)) as T;
  const result: StringRecord = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = is(value) ? clone(value) : value;
  }
  return result as T;
};

interface FreezeOpts {
  clone: boolean;
  maxDepth: number;
}
const freeze = <T>(obj: T, opts: Partial<FreezeOpts> = {}): Readonly<T> => {
  if (Object.isFrozen(obj)) return obj;
  const target = opts.clone ? clone(obj) : obj;
  const _freeze = (object: unknown, depth: number): Readonly<T> => {
    if (depth === 0 || !is(object) || Object.isFrozen(object))
      return object as Readonly<T>;

    return Object.freeze(
      Object.fromEntries(
        Object.entries(object).map(([key, value]) => [
          key,
          is(value) ? _freeze(value, depth - 1) : value,
        ]),
      ),
    ) as Readonly<T>;
  };
  return _freeze(target, opts.maxDepth ?? 1);
};
type MergeFn<R> = (current: R, next: unknown) => R;

const merge = <R>(current: R, next: unknown): R => {
  if (!is(next)) return current;
  const result = clone<R>(current) as StringRecord;
  return Object.entries(next).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      acc[key] = clone(value);
      return acc;
    }
    if (is(value) && key in result)
      acc[key] = merge(result[key] as object, value);
    else acc[key] = value;
    return acc;
  }, result) as R;
};
const isEmpty = (obj: unknown) => is(obj) && Object.keys(obj).length === 0;

const keys = <T>(obj: T) =>
  is(obj) ? (Object.keys(obj) as (keyof T & string)[]) : [];

export {
  type FreezeOpts,
  type MergeFn,
  clone,
  freeze,
  is,
  isEmpty,
  isPartialOf,
  isStrKeyOf,
  keys,
  merge,
};
export type * from "./types.js";
