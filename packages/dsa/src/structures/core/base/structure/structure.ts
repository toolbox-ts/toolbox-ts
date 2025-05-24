import { Node } from '../node/index.js';
import type { TypeArgs } from '../node/node.js';

export type Type = 'dynamic' | 'fixed';

export interface ErrorMsgs {
  overflow: string;
  underflow: string;
  inBounds: string;
  empty: string;
}

export interface Config<D, T extends Node.Type, K extends string> {
  nodeType: T;
  root: { key: K; opts?: Node.TypeArgs<T, D> | undefined }[];
  primaryRootKey: K;
  maxSize?: number;
  errorMsgs?: Partial<ErrorMsgs>;
}
export interface Core<D, T extends Node.Type, K extends string> {
  createNode: (args: Node.TypeArgs<T, D>) => Node.TypeMap<D>[T];
  iterators: Node.IteratorMap<D>[T];
  get: {
    get maxSize(): number;
    get type(): Type;
    get size(): number;
    get capacity(): number;
    get errorMsgs(): ErrorMsgs;
    get primaryRootKey(): K;
    rootNode: (key: K) => Node.TypeMap<D>[T] | undefined;
  };
  set: {
    set errorMsgs(msgs: Partial<ErrorMsgs>);
    set maxSize(maxSize: number);
    rootNode: (key: K, value?: Node.TypeMap<D>[T]) => void;
  };
  is: {
    inBounds: (index: number) => boolean;
    full: () => boolean;
    empty: () => boolean;
  };
  assert: {
    inBounds: (index: number, errMsg?: string) => boolean;
    notFull: (errMsg?: string) => boolean;
    notEmpty: (errMsg?: string) => boolean;
  };
  sideEffects: { inc: <R>(cb: () => R) => R; dec: <R>(cb: () => R) => R };
}

export type API<D, T extends Node.Type, K extends string> = Omit<
  Core<D, T, K>,
  'sideEffects' | 'createNode' | 'root' | 'iterators'
>;
interface State<D, T extends Node.Type, K extends string> {
  primaryRootKey: K;
  type: Type;
  maxSize: number;
  size: number;
  errorMsgs: {
    overflow: string;
    underflow: string;
    inBounds: string;
    empty: string;
  };
  root: Node.Record<D, T, K>;
}
const initState = <D, T extends Node.Type, K extends string>(
  createNode: (args: Node.TypeArgs<T, D>) => Node.TypeMap<D>[T],
  primaryRootKey: K,
  root: { key: K; opts?: Node.TypeArgs<T, D> | undefined }[],
  maxSize: number,
  errorMsgs: Partial<ErrorMsgs>
): State<D, T, K> => {
  const record = {} as Node.Record<D, T, K>;
  let size = 0;
  for (const { key, opts } of root) {
    if (opts) {
      record[key] = createNode(opts);
      size++;
    } else {
      record[key] = undefined;
    }
  }
  return {
    primaryRootKey,
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
  };
};
export const create = <D, T extends Node.Type, K extends string>({
  nodeType,
  maxSize = Infinity,
  errorMsgs = {},
  root,
  primaryRootKey
}: Config<D, T, K>): { api: API<D, T, K>; core: Core<D, T, K> } => {
  const createNode = Node.create[nodeType] as (
    args: Node.TypeArgs<T, D>
  ) => Node.TypeMap<D>[T];
  const iterators = Node.create.iterators[
    nodeType
  ]<D>() as Node.IteratorMap<D>[T];

  const state = initState(createNode, primaryRootKey, root, maxSize, errorMsgs);

  const stateApi = Object.freeze({
    set: {
      rootNode: (key: K, node: Node.TypeMap<D>[T] | undefined) => {
        if (!(key in state.root))
          throw new Error(`Root key ${key} does not exist in the structure.`);
        const wasDefined = state.root[key] !== undefined;
        const willBeDefined = node !== undefined;
        state.root[key] = node;
        if (!wasDefined && willBeDefined) state.size++;
        else if (wasDefined && !willBeDefined && state.size > 0) state.size--;
      },
      set errorMsgs(errMsgs: Partial<ErrorMsgs>) {
        state.errorMsgs = { ...state.errorMsgs, ...errMsgs };
      },
      set maxSize(maxSize: number) {
        if (maxSize < 0) throw new Error('maxSize must be greater than 0');
        if (state.size > maxSize)
          throw new Error(
            `maxSize must be greater than current size. current size: ${state.size}, maxSize: ${maxSize}`
          );
        state.maxSize = maxSize;
        state.type = maxSize === Infinity ? 'dynamic' : 'fixed';
      }
    },
    is: {
      full: () => state.size === state.maxSize,
      empty: () => state.size === 0,
      /**
       * Check if the index is within the inBounds of the structure.
       * 0 and end index are inclusive.
       */
      inBounds: (index: number) => index >= 0 && index <= state.size
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
        return state.maxSize - state.size;
      },
      get errorMsgs() {
        return { ...state.errorMsgs };
      },
      get primaryRootKey() {
        return state.primaryRootKey;
      },
      rootNode: (key: K) => {
        if (!(key in state.root))
          throw new Error(`Root key ${key} does not exist in the structure.`);
        return state.root[key];
      }
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
    sideEffects: {
      inc: <R>(cb: () => R) => {
        stateApi.assert.notFull();
        state.size++;
        return cb();
      },
      dec: <R>(cb: () => R) => {
        stateApi.assert.notEmpty();
        state.size--;
        return cb();
      }
    }
  } as const);

  stateApi.set.maxSize = maxSize;

  const api: API<D, T, K> = Object.freeze({
    get: stateApi.get,
    set: stateApi.set,
    is: stateApi.is,
    assert: stateApi.assert
  } as const);
  const core: Core<D, T, K> = Object.freeze({
    createNode,
    iterators,
    sideEffects: stateApi.sideEffects,
    ...api
  });

  return { api, core } as const;
};
