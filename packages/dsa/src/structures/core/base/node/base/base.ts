interface Detail<D = unknown> {
  id: string;
  data: D;
}
interface Type<D = unknown, TypeKey extends string = string> {
  readonly type: TypeKey;
  get id(): string;
  get data(): D;
  set data(data: D);
  get detail(): Detail<D>;
}
type PointerKey<T extends Type<D>, D = unknown> = string
  & keyof Omit<T, keyof Type<D>>;
type Pointers<T extends Type<D>, D = unknown> = { [Key in PointerKey<T>]?: T };
interface PointersConfig<T extends Type<D>, D = unknown> {
  key: PointerKey<T>;
  node: T | undefined;
}

interface IteratorYield<T extends Type<D>, D = unknown> {
  node: T;
  index: number;
}
type Iterator<T extends Type<D>, D = unknown> = (
  startingNode?: T
) => Generator<IteratorYield<T>>;
type Iterators<IteratorKey extends string, T extends Type> = {
  [K in IteratorKey]: Iterator<T>;
};

const createIterator = <T extends Type<D>, D = unknown>(
  pointerKey: PointerKey<T, D>
): Iterator<T> =>
  function* (start?: T) {
    let index = 0;
    for (let node = start; node; node = node[pointerKey] as T | undefined)
      yield { node, index: index++ };
  };

interface NodeConfig<T extends Type<D>, D> extends Detail<D> {
  pointers: PointersConfig<T>[];
}

const base = {
  node: <T extends Type<D, TypeKey>, D, TypeKey extends string>(
    type: TypeKey,
    { id, data, pointers }: NodeConfig<T, D>
  ): T =>{
    Object.defineProperties(
      {
        type,
        get id() {
          return id;
        },
        get data() {
          return data;
        },
        set data(newData: D) {
          data = newData;
        },
        get detail() {
          return { id, data };
        }
      } as T,
      Object.fromEntries(
        pointers.map(({ key, node }) => {
          return [
            key,
            {
              get() {
                return node;
              },
              set(newNode: T | undefined) {
                node = newNode;
              }
            }
          ] as const;
        })
      )
    ),
  },

  iterators: <T extends Type, IteratorKey extends string>(
    cfgs: readonly { key: IteratorKey; pointerKey: PointerKey<T> }[]
  ): Iterators<IteratorKey, T> =>
    cfgs.reduce(
      (acc, { key, pointerKey }) => {
        acc[key] = createIterator<T>(pointerKey);
        return acc;
      },
      {} as Iterators<IteratorKey, T>
    ),
  record: <
    K extends string,
    T extends Type<D, TypeKey>,
    D,
    TypeKey extends string
  >(
    type: TypeKey,
    cfgs: readonly { key: K; args: NodeConfig<T, D> | undefined }[]
  ): Record<K, T | undefined> =>
    Object.fromEntries(
      cfgs.map(
        ({ key, args }) =>
          [
            key,
            args ? base.node<T, D, TypeKey>(type, args) : undefined
          ] as const
      )
    ) as Record<K, T | undefined>
} as const;

const Factory = <
  T extends Type,
  IteratorKey extends string,
  TypeKey extends string
>({
  type,
  iteratorConfigs,
  pointerKeys
}: {
  type: TypeKey;
  pointerKeys: PointerKey<T>;
  iteratorConfigs: readonly { key: IteratorKey; pointerKey: PointerKey<T> }[];
}) =>
  Object.freeze({
    node: <D, T extends Type<D, TypeKey>>(args: NodeConfig<T, D>): T =>
      base.node<T, D, TypeKey>(type, args),
    iterators: <D, T extends Type<D>>() =>
      // eslint-disable-next-line
      base.iterators<T, IteratorKey>(iteratorConfigs as any),
    record: <D, T extends Type<D>, K extends string>(
      cfgs: readonly { key: K; args: NodeConfig<T, D> | undefined }[]
    ) => base.record(type, cfgs)
  } as const);

export {
  type Detail,
  type Pointers,
  type Type,
  type Iterators,
  type Iterator,
  type IteratorYield,
  type NodeConfig,
  type PointerKey,
  Factory
};
