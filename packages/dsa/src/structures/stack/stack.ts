import { Structure, type Node } from '../core/index.js';
export interface Stack<T> extends Structure.API<T, 'head', 'singly', Stack<T>> {
  [Symbol.iterator]: Structure.NodeDetailIterator<T, 'head', 'singly'>;
  get head(): Node.Singly<T> | undefined;
  pop: () => Node.Detail<T> | undefined;
  push: (detail: Node.Detail<T>) => Stack<T>;
  reset: () => Stack<T>;
}
export const create = <T>(maxSize = Infinity): Stack<T> => {
  const { api: _api, core } = Structure.create<T, 'head', 'singly', Stack<T>>({
    nodeType: 'singly',
    errorMsgs: {
      overflow: '[⚠️] Stack Overflow',
      underflow: '[⚠️] Stack Underflow'
    },
    maxSize,
    root: { head: undefined },
    defaultIteratorKeys: { startingRootNodeName: 'head', traversalKey: 'next' }
  } as const);
  const api: Stack<T> = Object.freeze({
    ..._api,
    [Symbol.iterator]: _api.detailIterator,
    get head() {
      return core.root.head;
    },
    push: (detail: Node.Detail<T>) =>
      core.withSize.inc<Stack<T>>(() => {
        const node = core.createNode(detail);
        node.next = core.root.head;
        core.root.head = node;
        return api;
      }),
    pop: () =>
      core.root.head ?
        core.withSize.dec(() => {
          const output = core.root.head!.detail;
          core.root.head = core.root.head!.next;
          return output;
        })
      : undefined,
    reset: () => {
      while (core.root.head) api.pop();
      return api;
    }
  } as const);
  return api;
};
