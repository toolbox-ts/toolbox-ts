import { Base } from '../base/index.js';

export const TYPE = 'singly' as const;
export type TypeKey = typeof TYPE;
export interface Type<D = unknown> extends Base.Type<D> {
  readonly type: TypeKey;
  get next(): Type<D> | undefined;
  set next(next: Type<D> | undefined);
}
export type IteratorKey = 'forward';
export type PointerKey = Base.PointerKey<Type>;
export type NodeConfig<D> = Base.NodeConfig<Type<D>, D>;
export type Iterators<D> = Base.Iterators<IteratorKey, Type<D>>;

export const create = Base.Factory<Type, IteratorKey, TypeKey>({
  type: TYPE,
  iteratorConfigs: [{ key: 'forward', pointerKey: 'next' }]
});
