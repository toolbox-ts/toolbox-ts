interface Detail<D = unknown> {
  id: string;
  data: D;
}
interface Type<TK extends string, D> {
  readonly type: TK;
  get id(): string;
  get data(): D;
  set data(data: D);
  get detail(): Detail<D>;
}
type PointerKey<T extends Type<string, D>, D = unknown> = string
  & keyof Omit<T, keyof Type<string, D>>;

type Pointers<T extends Type<string, D>, D = unknown> = {
  [Key in PointerKey<T>]: T | undefined;
};
type Pointer<T extends Type<string, D>, D = unknown> = T | undefined;
interface PointerConfig<T extends Type<string, D>, D = unknown> {
  key: PointerKey<T, D>;
  pointer?: Pointer<T, D>;
}

interface IteratorYield<T extends Type<string, D>, D = unknown> {
  node: T;
  index: number;
}
type Iterator<T extends Type<string, D>, D = unknown> = (
  startingNode?: T
) => Generator<IteratorYield<T>>;
type Iterators<T extends Type<string, unknown>, IK extends string> = {
  [K in IK]: Iterator<T>;
};
interface IteratorConfig<
  T extends Type<string, D>,
  IK extends string,
  D = unknown
> {
  iteratorKey: IK;
  pointerKey: PointerKey<T, D>;
}
const createIterator = <T extends Type<string, D>, D = unknown>(
  pointerKey: PointerKey<T, D>
): Iterator<T> =>
  function* (start?: T) {
    let index = 0;
    for (let node = start; node; node = node[pointerKey] as T | undefined)
      yield { node, index: index++ };
  };

interface NodeConfig<T extends Type<string, D>, D> extends Detail<D> {
  pointers?: PointerConfig<T, D>[];
}

const base = {
  node: <T extends Type<TK, D>, TK extends string, D>(
    type: TK,
    { id, data, pointers }: NodeConfig<T, D>
  ): T => {
    const _pointers =
      pointers ?
        pointers.reduce(
          (acc, { key, pointer }) => {
            acc[key] = pointer;
            return acc;
          },
          {} as Pointers<T, D>
        )
      : undefined;
    const descriptors: (PropertyDescriptorMap & ThisType<T>) | undefined =
      _pointers ?
        Object.fromEntries(
          (Object.keys(_pointers) as (keyof typeof _pointers)[]).map((key) => {
            return [
              key,
              {
                get() {
                  return _pointers[key];
                },
                set(newNode: T | undefined) {
                  _pointers[key] = newNode;
                },
                enumerable: true
              }
            ] as const;
          })
        )
      : {};
    return Object.defineProperties(
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
      descriptors
    );
  },

  iterators: <T extends Type<string, unknown>, IK extends string>(
    cfgs: readonly IteratorConfig<T, IK>[]
  ): Iterators<T, IK> =>
    cfgs.reduce(
      (acc, { iteratorKey, pointerKey }) => {
        acc[iteratorKey] = createIterator<T>(pointerKey);
        return acc;
      },
      {} as Iterators<T, IK>
    ),
  record: <T extends Type<TK, D>, TK extends string, D, K extends string>(
    type: TK,
    cfgs: readonly { key: K; args: NodeConfig<T, D> | undefined }[]
  ): Record<K, T | undefined> =>
    Object.fromEntries(
      cfgs.map(
        ({ key, args }) =>
          [key, args ? base.node<T, TK, D>(type, args) : undefined] as const
      )
    ) as Record<K, T | undefined>
} as const;

const Factory = <
  T extends Type<TK, unknown>,
  TK extends string,
  IK extends string
>({
  type,
  pointerConfigs,
  iteratorConfigs
}: {
  type: TK;
  pointerConfigs: readonly PointerConfig<T>[];
  iteratorConfigs: readonly IteratorConfig<T, IK>[];
}) =>
  Object.freeze({
    node: <T extends Type<TK, D>, D>(args: NodeConfig<T, D>): T =>
      base.node<T, TK, D>(type, args),
    iterators: <T extends Type<TK, D>, D>() =>
      // eslint-disable-next-line
      base.iterators<T, IK>(iteratorConfigs as any),
    record: <D, T extends Type<TK, D>, K extends string>(
      cfgs: readonly { key: K; args: NodeConfig<T, D> | undefined }[]
    ) => base.record<T, TK, D, K>(type, cfgs)
  } as const);

export {
  type Pointer,
  type Detail,
  type Pointers,
  type PointerConfig,
  type Type,
  type Iterators,
  type Iterator,
  type IteratorYield,
  type NodeConfig,
  type PointerKey,
  Factory,
  base
};
