import { Base } from '../base/index.js';

export const TYPE = 'singly' as const;
export const POINTER_KEYS = ['next'] as const;
export type TypeKey = typeof TYPE;
export interface Type<D = unknown> extends Base.Type<TypeKey, D> {
  readonly type: TypeKey;
  get next(): Type<D> | undefined;
  set next(next: Type<D> | undefined);
}
export type IteratorKey = 'forward';
export type PointerKey = Base.PointerKey<Type>;
export type Iterators<D> = Base.Iterators<Type<D>, IteratorKey>;

export const { iterators, node } = Base.Factory<
  Type,
  TypeKey,
  PointerKey,
  IteratorKey
>(TYPE, POINTER_KEYS, [{ key: 'forward', pointerKey: 'next' }]);
