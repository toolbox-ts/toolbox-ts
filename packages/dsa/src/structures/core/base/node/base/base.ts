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
type PointerKey<T extends Type<string, unknown>> = string
  & Omit<T, keyof Type<string, unknown>>;
type Pointer<T extends Type<string, D>, D> = T | undefined;
type Pointers<T extends Type<TK, D>, TK extends string, D> = {
  [K in PointerKey<T>]?: Pointer<T, D>;
};

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

const createIterator = <
  T extends Type<TK, D>,
  TK extends string,
  PK extends string & keyof T,
  D
>(
  pointerKey: PK
): Iterator<T> =>
  function* (start?: T) {
    let index = 0;
    for (let node = start; node; node = node[pointerKey] as T | undefined)
      yield { node, index: index++ };
  };
const createBase = <TK extends string, D>(
  type: TK,
  { id, data }: Detail<D>
): Type<TK, D> => ({
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
});

const createPointerDescriptors = <
  T extends Type<TK, D>,
  TK extends string,
  PK extends PointerKey<T>,
  D = unknown
>(
  base: Type<TK, D>,
  pointerKeys: PK[]
): T => {
  const pointers = pointerKeys.reduce(
    (acc, key) => {
      acc[key] = undefined;
      return acc;
    },
    {} as Record<PK, Pointer<T, D>>
  );
  const descriptors: PropertyDescriptorMap = pointerKeys.reduce((acc, key) => {
    acc[key] = {
      get() {
        return pointers[key];
      },
      set(next?: Pointer<T, D>) {
        pointers[key] = next;
      },
      enumerable: true
    };
    return acc;
  }, {} as PropertyDescriptorMap);
  return Object.defineProperties(base, descriptors) as T;
};
const create = {
  node: <T extends Type<TK, D>, TK extends string, PK extends PointerKey<T>, D>(
    type: TK,
    pointerKeys: PK[],
    { id, data }: Detail<D>
  ) =>
    createPointerDescriptors<T, TK, PK, D>(
      createBase<TK, D>(type, { id, data }),
      pointerKeys
    ),
  iterators: <T extends Type<string, unknown>, IK extends string>(
    cfgs: { iteratorKey: IK; pointerKey: string & keyof T }[]
  ) =>
    cfgs.reduce(
      (acc, { iteratorKey, pointerKey }) => {
        acc[iteratorKey] = createIterator<T>(pointerKey);
        return acc;
      },
      {} as Iterators<T, IK>
    )
} as const;
const Factory = <
  T extends Type<TK, unknown>,
  TK extends string,
  PK extends PointerKey<T>,
  IK extends string
>(
  type: TK,
  pointerKeys: PK[],
  iteratorConfigs: { key: IK; pointerKey: PK }[]
) => ({
  node: <T extends Type<TK, D>, D>({ data, id }: Detail<D>) =>
    create.node<T, TK, PK, D>(type, pointerKeys, { id, data }),
  iterators: () =>
    create.iterators<T, IK>(
      iteratorConfigs.map(({ key, pointerKey }) => ({
        iteratorKey: key,
        pointerKey
      }))
    )
});
export {
  type Pointer,
  type Detail,
  type Type,
  type Iterators,
  type Iterator,
  type IteratorYield,
  type PointerKey,
  Factory
};
