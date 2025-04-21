import type * as DataNode from "../node/node.js";

type TraversalDirection = "forward";
type InsertPosition = "before" | "after";
interface InsertArgs<T> {
  node: DataNode.Detail<T>;
  indexOrId: number | string;
  position?: InsertPosition;
}
type AccessorResult<T> = DataNode.Detail<T> | undefined;
type ListIterator<N> = Generator<{ node: N; index: number }>;
abstract class LinkedList<T, N extends DataNode.Instance<T>> {
  protected _head: N | undefined = undefined;
  protected _tail: N | undefined = undefined;
  protected _size = 0;

  constructor(nodes?: DataNode.Details<T>) {
    if (nodes) nodes.forEach((node) => this.append(node));
  }

  get head() {
    return this._head;
  }

  get tail() {
    return this._tail;
  }

  get size() {
    return this._size;
  }
  *forward(): ListIterator<N> {
    let curr = this._head;
    let index = 0;
    while (curr) {
      yield { node: curr, index };
      curr = curr.next as N;
      index++;
    }
  }
  abstract setHead(node: N): this;
  abstract removeHead(): this;
  abstract append(data: DataNode.Detail<T>): this;
  abstract prepend(data: DataNode.Detail<T>): this;
  abstract insert(args: InsertArgs<T>): this;
  protected abstract insertAtTarget(
    targetNode: N,
    movingNode: DataNode.Detail<T>,
    position: InsertPosition,
  ): this;
  abstract remove(indexOrId: number | string): this;
  abstract extract(id: string): { node: N; index: number } | undefined;
  abstract find(
    id: string,
    direction?: TraversalDirection,
  ): { node: N; index: number } | undefined;
  abstract get(index: number): { node: N; index: number } | undefined;
  abstract has(id: string, direction?: TraversalDirection): boolean;
  abstract moveToIndex(targetId: string, index: number): this;
  abstract moveToTarget(
    nodeToMoveId: string,
    targetNodeId: string,
    position: InsertPosition,
  ): this;
  abstract toString(): string;
  abstract reset(): this;
  abstract getIndex(id: string): number | undefined;
  abstract pop(): N | undefined;
}
type ListAPIIterator<T> = Generator<
  { data: T; id: string; index: number },
  void,
  unknown
>;
interface LinkedListAPI<T> {
  forward: () => ListAPIIterator<T>;
  readonly head: AccessorResult<T>;
  readonly tail: AccessorResult<T>;
  readonly size: number;
  setHead: (data: DataNode.Detail<T>) => LinkedListAPI<T>;
  append: (data: DataNode.Detail<T>) => LinkedListAPI<T>;
  prepend: (data: DataNode.Detail<T>) => LinkedListAPI<T>;
  insert: (arg: InsertArgs<T>) => LinkedListAPI<T>;
  remove: (indexOrId: string | number) => LinkedListAPI<T>;
  moveToIndex: (targetId: string, index: number) => LinkedListAPI<T>;
  moveToTarget: (
    nodeToMoveId: string,
    targetNodeId: string,
    position: InsertPosition,
  ) => LinkedListAPI<T>;
  removeHead: () => LinkedListAPI<T>;
  getIndex: (id: string) => number | undefined;
  extract: (id: string) => AccessorResult<T>;
  find: (id: string, direction?: TraversalDirection) => AccessorResult<T>;
  get: (index: number) => AccessorResult<T>;
  pop: () => AccessorResult<T>;
  has: (id: string, direction?: TraversalDirection) => boolean;
  toString: () => string;
  reset: () => LinkedListAPI<T>;
}

export type ListAPI<T, E = undefined> = LinkedListAPI<T> & E;
export {
  type AccessorResult,
  type InsertArgs,
  type InsertPosition,
  type LinkedListAPI,
  type ListAPIIterator,
  type TraversalDirection,
  LinkedList,
};
