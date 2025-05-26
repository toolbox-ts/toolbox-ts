import { Base } from '../base/index.js';

export const TYPE = 'doubly' as const;
export type TypeKey = typeof TYPE;
export interface Type<D = unknown> extends Base.Type<TypeKey, D> {
  readonly type: TypeKey;
  get next(): Type<D> | undefined;
  set next(next: Type<D> | undefined);
  get prev(): Type<D> | undefined;
  set prev(prev: Type<D> | undefined);
}
export type IteratorKey = 'forward' | 'backward';
export type PointerKey = Base.PointerKey<Type>;
export type NodeConfig<D> = Base.NodeConfig<Type<D>, D>;
export type Iterators<D> = Base.Iterators<Type<D>, IteratorKey>;

export const create = Base.Factory<Type, IteratorKey, TypeKey>({
  type: TYPE,
  iteratorConfigs: [
    { key: 'forward', pointerKey: 'next' },
    { key: 'backward', pointerKey: 'prev' }
  ]
});
