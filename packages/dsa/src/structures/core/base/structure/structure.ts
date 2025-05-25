import { Node } from '../node/index.js';

export type Type = 'dynamic' | 'fixed';

export interface ErrorMsgs {
  overflow: string;
  underflow: string;
  inBounds: string;
  empty: string;
}
export interface Config<T extends Node.TypeKey, D, RootKey extends string> {
  nodeType: T;
  root: { key: RootKey; opts?: Node.NodeConfig<T, D> | undefined }[];
  primaryRootKey: RootKey;
  primaryIteratorKey: Node.IteratorKey<T>;
  maxSize?: number;
  errorMsgs?: Partial<ErrorMsgs>;
}
interface Getters<T extends Type> {
  size: () => number;
  get maxSize(): number;
  get type(): T;
  get capacity(): number;
  get errorMsgs(): ErrorMsgs;
}
interface Setters {
  set errorMsgs(msgs: Partial<ErrorMsgs>);
  set maxSize(maxSize: number);
}
interface Root<T extends Node.TypeKey, D, RootKey extends string> {
  get: (key: RootKey) => Node.Type<T, D> | undefined;
  set: (key: RootKey, value?: Node.Type<T, D>) => void;
  reset: () => void;
  has: (key: RootKey) => boolean;
  get primaryKey(): RootKey;
  get keys(): RootKey[];
}
interface Is {
  inBounds: (index: number) => boolean;
  full: () => boolean;
  empty: () => boolean;
}
interface Assert {
  inBounds: (index: number, errMsg?: string) => boolean;
  notFull: (errMsg?: string) => boolean;
  notEmpty: (errMsg?: string) => boolean;
}
export interface Core<T extends Node.TypeKey, D, RootKey extends string> {
  createNode: (args: Node.NodeConfig<T, D>) => Node.Type<T, D>;
  iterators: Node.Iterators<T, D>;
  get: Getters<Type>;
  set: Setters;
  root: Root<T, D, RootKey>;
  is: Is;
  assert: Assert;
}
export type API<T extends Node.TypeKey, D, RootKey extends string> = Omit<
  Core<T, D, RootKey>,
  'createNode' | 'root' | 'iterators'
>;
interface State<T extends Node.TypeKey, D, RootKey extends string> {
  createNode: (args: Node.NodeConfig<T, D>) => Node.Type<T, D>;
  primaryRootKey: RootKey;
  primaryIteratorKey: Node.IteratorKey<T>;
  iterators: Node.Iterators<T, D>;
  type: Type;
  maxSize: number;
  size: () => number;
  errorMsgs: {
    overflow: string;
    underflow: string;
    inBounds: string;
    empty: string;
  };
  root: Node.Record<T, D, RootKey>;
}

const initState = <T extends Node.TypeKey, D, RootKey extends string>(
  nodeType: T,
  primaryRootKey: RootKey,
  primaryIteratorKey: Node.IteratorKey<T>,
  root: { key: RootKey; opts?: Node.NodeConfig<T, D> | undefined }[],
  maxSize: number,
  errorMsgs: Partial<ErrorMsgs>
): State<T, D, RootKey> => {
  const record = {} as Node.Record<T, D, RootKey>;
  const { createNode, iterators } = Node.create.kit<T, D>(nodeType);
  for (const { key, opts } of root)
    record[key] = opts ? createNode(opts) : undefined;

  const size = () => {
    const it = iterators[primaryIteratorKey as keyof Node.Iterators<T, D>] as (
      n?: Node.Type<T, D>
    ) => Generator<{ node?: Node.Type<T, D>; index: number }>;
    return it(record[primaryRootKey]).reduce((acc, { index, node }) => {
      if (node) acc++;
      return acc;
    }, 0);
  };
  return {
    createNode,
    primaryRootKey,
    iterators,
    primaryIteratorKey,
    type: 'dynamic',
    maxSize,
    size,
    errorMsgs: {
      overflow: '[⚠️] Structure Overflow',
      underflow: '[⚠️] Structure Underflow',
      inBounds: '[⚠️] Out of Bounds',
      empty: '[⚠️] Structure is Empty',
      ...errorMsgs
    },
    root: record
  } as const;
};
export const create = <T extends Node.TypeKey, D, K extends string>({
  nodeType,
  maxSize = Infinity,
  errorMsgs = {},
  root,
  primaryRootKey,
  primaryIteratorKey
}: Config<T, D, K>): { api: API<T, D, K>; core: Core<T, D, K> } => {
  const state = initState(
    nodeType,
    primaryRootKey,
    primaryIteratorKey,
    root,
    maxSize,
    errorMsgs
  );

  const stateApi = Object.freeze({
    createNode: state.createNode,
    iterators: state.iterators,
    root: {
      set: (key: K, node: Node.Type<T, D> | undefined) => {
        if (!(key in state.root))
          throw new Error(`Root key ${key} does not exist in the structure.`);
        state.root[key] = node;
      },
      get: (key: K) => {
        if (!(key in state.root))
          throw new Error(`Root key ${key} does not exist in the structure.`);
        return state.root[key];
      },
      reset: () => {
        for (const key in state.root) state.root[key] = undefined;
      },
      has: (key: K) => key in state.root,
      get primaryKey() {
        return state.primaryRootKey;
      },
      get keys() {
        return Object.keys(state.root) as K[];
      }
    },
    set: {
      set errorMsgs(errMsgs: Partial<ErrorMsgs>) {
        state.errorMsgs = { ...state.errorMsgs, ...errMsgs };
      },
      set maxSize(maxSize: number) {
        if (maxSize < 0) throw new Error('maxSize must be greater than 0');
        if (state.size() > maxSize)
          throw new Error(
            `maxSize must be greater than current size. current size: ${state.size()}, maxSize: ${maxSize}`
          );
        state.maxSize = maxSize;
        state.type = maxSize === Infinity ? 'dynamic' : 'fixed';
      }
    },
    is: {
      full: () => state.size() === state.maxSize,
      empty: () => state.size() === 0,
      /**
       * Check if the index is within the inBounds of the structure.
       * 0 and end index are inclusive.
       */
      inBounds: (index: number) => index >= 0 && index <= state.size()
    },
    assert: {
      inBounds: (index: number, errMsg = state.errorMsgs.inBounds): true => {
        if (!stateApi.is.inBounds(index)) throw new Error(errMsg);
        return true;
      },
      notFull: (errMsg = state.errorMsgs.overflow): true => {
        if (stateApi.is.full()) throw new Error(errMsg);
        return true;
      },
      notEmpty: (errMsg = state.errorMsgs.empty): true => {
        if (stateApi.is.empty()) throw new Error(errMsg);
        return true;
      }
    },
    get: {
      get maxSize() {
        return state.maxSize;
      },
      get type() {
        return state.type;
      },
      get size() {
        return state.size;
      },
      get capacity() {
        return state.maxSize - state.size();
      },
      get errorMsgs() {
        return { ...state.errorMsgs };
      }
    }
  } as const);

  stateApi.set.maxSize = maxSize;

  const api: API<T, D, K> = Object.freeze({
    get: stateApi.get,
    set: stateApi.set,
    is: stateApi.is,
    assert: stateApi.assert
  } as const);
  const core: Core<T, D, K> = Object.freeze({
    createNode: stateApi.createNode,
    iterators: stateApi.iterators,
    root: stateApi.root,
    ...api
  });

  return { api, core } as const;
};
