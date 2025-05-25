import { Singly } from './singly/index.js';
import { Doubly } from './doubly/index.js';
import { Base } from './base/index.js';

const modules = { singly: Singly, doubly: Doubly, base: Base } as const;
const TYPES = [Singly.TYPE, Doubly.TYPE] as const;

type Detail<D = unknown> = Base.Detail<D>;

type SinglyTypeKey = Singly.TypeKey;
type DoublyTypeKey = Doubly.TypeKey;
type TypeKey = SinglyTypeKey | DoublyTypeKey;

type NodeConfig<K extends TypeKey, D> =
  K extends SinglyTypeKey ? Singly.NodeConfig<D>
  : K extends DoublyTypeKey ? Doubly.NodeConfig<D>
  : never;

type Type<K extends TypeKey, D> =
  K extends Singly.TypeKey ? Singly.Type<D>
  : K extends Doubly.TypeKey ? Doubly.Type<D>
  : never;

type IteratorKey<K extends TypeKey> =
  K extends SinglyTypeKey ? Singly.IteratorKey
  : K extends DoublyTypeKey ? Doubly.IteratorKey
  : never;

type PointerKey<K extends TypeKey> =
  K extends SinglyTypeKey ? Singly.PointerKey
  : K extends DoublyTypeKey ? Doubly.PointerKey
  : never;

type Iterators<T extends TypeKey, D> =
  T extends SinglyTypeKey ? Singly.Iterators<D>
  : T extends DoublyTypeKey ? Doubly.Iterators<D>
  : never;
type _Record<T extends TypeKey, D, Key extends string> = Record<
  Key,
  Type<T, D> | undefined
>;
interface Kit<T extends TypeKey, D> {
  createNode: (cfg: NodeConfig<T, D>) => Type<T, D>;
  iterators: Iterators<T, D>;
}
const create = {
  singly: Singly.create.node,
  doubly: Doubly.create.node,
  iterators: {
    singly: Singly.create.iterators,
    doubly: Doubly.create.iterators
  },
  record: { singly: Singly.create.record, doubly: Doubly.create.record },
  kit: <T extends TypeKey, D>(type: T): Kit<T, D> =>
    ({
      createNode: create[type],
      iterators: create.iterators[type]<D, Type<T, D>>()
    }) as unknown as Kit<T, D>
} as const;

export { TYPES, modules, create };
export type {
  Type,
  IteratorKey,
  PointerKey,
  Detail,
  _Record as Record,
  NodeConfig,
  TypeKey,
  Iterators
};
