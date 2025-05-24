interface Detail<D> {
  id: string;
  data: D;
}
interface Base<D> {
  get id(): string;
  get data(): D;
  set data(data: D);
  get detail(): Detail<D>;
}
type Type = 'singly' | 'doubly';

type Pointers<D, K extends string, N extends Base<D>> = { [key in K]?: N };
type SinglyPointerKey = 'next';
type SinglyPointers<D, N extends Base<D>> = Pointers<D, SinglyPointerKey, N>;
interface Singly<D> extends Base<D> {
  get next(): Singly<D> | undefined;
  set next(next: Singly<D> | undefined);
}
interface SinglyArgs<D> extends Detail<D> {
  pointers?: SinglyPointers<D, Singly<D>>;
}

type DoublyPointerKey = 'next' | 'prev';
type DoublyPointers<D, N extends Base<D>> = Pointers<D, DoublyPointerKey, N>;
interface Doubly<D> extends Base<D> {
  get next(): Doubly<D> | undefined;
  set next(next: Doubly<D> | undefined);
  get prev(): Doubly<D> | undefined;
  set prev(prev: Doubly<D> | undefined);
}
interface DoublyArgs<D> extends Detail<D> {
  pointers?: DoublyPointers<D, Doubly<D>>;
}

interface TypeMap<D> {
  singly: Singly<D>;
  doubly: Doubly<D>;
}
interface TypePointerKeyMap {
  singly: SinglyPointerKey;
  doubly: DoublyPointerKey;
}

type TypeArgs<T extends Type, D> =
  T extends 'singly' ? SinglyArgs<D> : DoublyArgs<D>;

type With<D, T extends Type, W> = TypeMap<D>[T] | W;
type WithUndefined<D, T extends Type> = With<D, T, undefined>;
type WithDetail<D, W> = Detail<D> | W;
type WithDetailUndefined<D> = WithDetail<D, undefined>;

const Base = <D>(args: Detail<D>): Base<D> => {
  const { id } = args;
  let { data } = args;
  return {
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
  };
};
const Singly = <D>({ pointers = {}, ...rest }: SinglyArgs<D>): Singly<D> => {
  let { next: nxt } = pointers;
  return Object.freeze(
    Object.defineProperties<Singly<D>>(Base(rest) as Singly<D>, {
      next: {
        get() {
          return nxt;
        },
        set(next: Singly<D> | undefined) {
          nxt = next;
        }
      }
    })
  );
};
const Doubly = <D>({ pointers = {}, ...rest }: DoublyArgs<D>): Doubly<D> => {
  let { next: nxt, prev: prv } = pointers;
  return Object.freeze(
    Object.defineProperties<Doubly<D>>(Base(rest) as Doubly<D>, {
      next: {
        get() {
          return nxt;
        },
        set(next: Doubly<D> | undefined) {
          nxt = next;
        }
      },
      prev: {
        get() {
          return prv;
        },
        set(prev: Doubly<D> | undefined) {
          prv = prev;
        }
      }
    })
  );
};

type _Record<D, T extends Type, K extends string> = {
  [key in K]: TypeMap<D>[T] | undefined;
};

interface SinglyIteratorYield<D> {
  node: With<D, 'singly', undefined>;
  index: number;
}
interface SinglyIterators<D> {
  forward: (startingNode?: Singly<D>) => Generator<SinglyIteratorYield<D>>;
}
const SinglyIterators = <D>(): SinglyIterators<D> => ({
  forward: function* (startingNode) {
    let index = 0;
    for (let node = startingNode; node; node = node.next) {
      yield { node, index };
      index++;
    }
  }
});
interface DoublyIteratorYield<D> {
  node: With<D, 'doubly', undefined>;
  index: number;
}
interface DoublyIterators<D> {
  forward: (startingNode?: Doubly<D>) => Generator<DoublyIteratorYield<D>>;
  backward: (startingNode?: Doubly<D>) => Generator<DoublyIteratorYield<D>>;
}
const DoublyIterators = <D>(): DoublyIterators<D> => ({
  forward: function* (startingNode) {
    let index = 0;
    for (let node = startingNode; node; node = node.next) {
      yield { node, index };
      index++;
    }
  },
  backward: function* (startingNode) {
    let index = 0;
    for (let node = startingNode; node; node = node.prev) {
      yield { node, index };
      index++;
    }
  }
});

interface IteratorMap<D> {
  singly: SinglyIterators<D>;
  doubly: DoublyIterators<D>;
}

const create = {
  singly: Singly,
  doubly: Doubly,
  iterators: { singly: SinglyIterators, doubly: DoublyIterators }
} as const;

export {
  type _Record as Record,
  type IteratorMap,
  type DoublyIterators,
  type SinglyIterators,
  type DoublyIteratorYield,
  type SinglyIteratorYield,
  type WithDetailUndefined,
  type WithUndefined,
  type Detail,
  type Type,
  type Singly,
  type Doubly,
  type TypeArgs,
  type TypePointerKeyMap,
  type TypeMap,
  type With,
  type WithDetail,
  create
};
