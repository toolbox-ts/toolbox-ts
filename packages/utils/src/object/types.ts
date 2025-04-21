type NestedPartial<T> = T extends object
  ? { [P in keyof T]?: NestedPartial<T[P]> }
  : T;

type NestedWritable<T> = T extends object
  ? { -readonly [P in keyof T]: T[P] }
  : T;

type NestedRequired<T> = NonNullable<
  T extends object ? { [P in keyof T]-?: NestedRequired<T[P]> } : T
>;

type StringRecord = Record<string, unknown>;
type StrProperty<T> = keyof T & string;

type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>>;
type PartialOmit<T, K extends keyof T> = Partial<Omit<T, K>>;

/**
 * Extracts optional properties from a type
 * @example
 * ```
 * type User = { id: number, name?: string }
 * type Optional = ExtractOptional<User> // { name?: string }
 * ```
 */
type ExtractOptional<T> = {
  [K in string & keyof T as undefined extends T[K] ? K : never]: T[K];
};
type ExtractRequired<T> = {
  [K in string & keyof T as undefined extends T[K] ? never : K]: T[K];
};
type OptionalKey<T> = keyof ExtractOptional<T>;
type RequiredKey<T> = keyof ExtractRequired<T>;
type OptionalToRequired<T> = NestedRequired<ExtractOptional<T>>;

/**
 * `DeepPartial<T>` is a utility type that represents an object where all properties are
 * optionally defined and can be deeply nested. Each property of the object is either:
 * - The original type `T[P]`, or
 * - A recursively nested `DeepPartial<T[P]>` (if `T[P]` is an object or array),
 * allowing for partial structures at any level of depth.
 *
 * This type is especially useful when working with complex, deeply nested objects where
 * not all fields may be present or required at all times. It allows you to build flexible
 * data structures, such as configurations or partially updated states, without requiring
 * full completeness of the object.
 *
 * Example Usage:
 *
 * ```typescript
 * type User = {
 *   name: string;
 *   address: {
 *     street: string;
 *     city: string;
 *   };
 * };
 *
 * const user: DeepPartial<User> = {
 *   address: {
 *     street: '123 Main St', // Only a partial structure
 *   },
 * };
 * ```
 *
 * In the above example, `user` is a valid `DeepPartial<User>` because:
 * - `name` is missing (it is optional).
 * - `address` is partially provided with only `street` defined.
 *
 * This type can be particularly useful in cases where you need to apply partial updates
 * or transformations to deeply nested objects, such as:
 * - Merging configurations
 * - Updating parts of an object without affecting others
 * - Handling optional data in API responses or local storage
 *
 * `DeepPartial` can be combined with other types like `Record`, `Array`, or `Map` to
 * handle even more complex structures while maintaining flexibility.
 */
type DeepPartial<T> = { [P in keyof T]?: T[P] | NestedPartial<T[P]> };

export type {
  DeepPartial,
  ExtractOptional,
  ExtractRequired,
  NestedPartial,
  NestedRequired,
  NestedWritable,
  OptionalKey,
  OptionalToRequired,
  PartialOmit,
  PartialPick,
  RequiredKey,
  StringRecord,
  StrProperty,
};
