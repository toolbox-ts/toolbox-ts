import * as DataNode from "../../node/node.js";
import * as Base from "../types.js";

type TraversalDirection = Base.TraversalDirection | "reverse";

class Doubly<T> extends Base.LinkedList<T, DataNode.DoublyLinkedInstance<T>> {
  setHead(node: DataNode.DoublyLinkedInstance<T>) {
    if (this._head) this.reset();
    this._head = node;
    this._tail = node;
    this._size = 1;
    return this;
  }
  protected insertAtTarget(
    targetNode: DataNode.DoublyLinkedInstance<T>,
    movingNode: DataNode.Detail<T>,
    position: Base.InsertPosition,
  ) {
    const newNode = DataNode.create.doublyLinked(movingNode);
    if (position === "before") {
      newNode.next = targetNode;
      newNode.prev = targetNode.prev;
      if (targetNode.prev) targetNode.prev.next = newNode;
      targetNode.prev = newNode;
    } else {
      newNode.prev = targetNode;
      newNode.next = targetNode.next;
      if (targetNode.next) targetNode.next.prev = newNode;
      targetNode.next = newNode;
    }
    this._size++;
    return this;
  }
  *reverse() {
    let curr = this._tail;
    let index = this._size - 1;
    while (curr) {
      yield { node: curr, index };
      curr = curr.prev;
      index--;
    }
  }
  removeHead() {
    if (!this._head) return this;
    this._head = this._head.next;
    if (this._head) this._head.prev = undefined;
    if (this._size === 1) this._tail = undefined;
    this._size--;
    return this;
  }
  append({ data, id }: DataNode.Detail<T>) {
    const node = DataNode.create.doublyLinked({ data, id, prev: this._tail });
    if (!this._head || !this._tail) return this.setHead(node);
    this._tail.next = node;
    this._tail = node;
    this._size++;
    return this;
  }
  prepend({ data, id }: DataNode.Detail<T>) {
    const node = DataNode.create.doublyLinked({ data, id, next: this._head });
    if (!this._head || !this._tail) return this.setHead(node);
    node.next = this._head;
    this._head.prev = node;
    this._head = node;
    this._size++;
    return this;
  }
  insert({ indexOrId, node, position = "before" }: Base.InsertArgs<T>) {
    if (typeof indexOrId === "number") {
      if (indexOrId <= 0) return this.prepend(node);
      if (indexOrId >= this._size) return this.append(node);
      const target = this.get(indexOrId)!;
      return this.insertAtTarget(target.node, node, position);
    } else {
      const target = this.find(indexOrId);
      if (!target) return this;
      if (position === "before" && target.node === this._head)
        return this.prepend(node);
      if (position === "after" && target.node === this._tail)
        return this.append(node);
      return this.insertAtTarget(target.node, node, position);
    }
  }
  remove(indexOrId: number | string) {
    if (!this._head) return this;
    const target = (
      typeof indexOrId === "number" ? this.get(indexOrId) : this.find(indexOrId)
    )!;
    if (target.index === 0) return this.removeHead();
    if (target.index === this._size - 1) {
      this.pop();
      return this;
    }
    if (target.node.prev?.next) {
      target.node.prev.next = target.node.next;
      if (target.node.next) target.node.next.prev = target.node.prev;
      this._size--;
    }
    return this;
  }
  extract(id: string) {
    const target = this.find(id);
    if (!target) return undefined;
    this.remove(id);
    return target;
  }
  find(id: string, direction: TraversalDirection = "forward") {
    for (const n of this[direction]()) if (n.node.id === id) return n;
    return undefined;
  }

  get(index: number) {
    if (index < 0 || index >= this._size) return undefined;
    const direction =
      index < Math.round(this._size / 2) ? "forward" : "reverse";
    // Bounds are validated so the conditional will never fail. return undefined is seemingly unreachable. It's written to satisfy TypeScript.
    /* v8 ignore next 2 */
    for (const n of this[direction]()) if (n.index === index) return n;
    return undefined;
  }
  has(id: string, direction: TraversalDirection = "forward") {
    return !!this.find(id, direction);
  }
  pop() {
    // If head is undefined then tail is always undefined making tail unreachable
    /* v8 ignore next */
    if (!this._head || !this._tail) return undefined;
    const popped = this._tail;
    if (this._head === this._tail) {
      this._head = undefined;
      this._tail = undefined;
    } else if (this._tail.prev) {
      this._tail = this._tail.prev;
      this._tail.next = undefined;
    }
    this._size--;
    return popped;
  }
  moveToIndex(targetId: string, index: number) {
    const t = this.extract(targetId)?.node;
    if (!t) return this;
    return this.insert({ indexOrId: index, node: { data: t.data, id: t.id } });
  }
  moveToTarget(
    nodeToMoveId: string,
    targetNodeId: string,
    position: "before" | "after",
  ) {
    const targetNode = this.find(targetNodeId)?.node;
    if (!targetNode) return this;

    const movingNode = this.extract(nodeToMoveId)?.node;
    if (!movingNode) return this;

    if (position === "before" && targetNode === this._head)
      return this.prepend(movingNode);

    this.insertAtTarget(targetNode, movingNode, position);
    return this;
  }
  toString() {
    if (!this._head) return "Empty List";
    let result = "null←";
    for (const { node } of this.forward()) result += `(${node.id})⇆`;
    return result.slice(0, -1) + "→null";
  }
  reset() {
    let curr = this._head;
    while (curr) {
      const next = curr.next;
      curr.next = undefined;
      curr.prev = undefined;
      curr = next;
    }
    this._head = undefined;
    this._tail = undefined;
    this._size = 0;
    return this;
  }
  getIndex(id: string) {
    return this.find(id)?.index;
  }
}

const create = <T>(
  nodes?: DataNode.Details<T>,
): Base.LinkedListAPI<T> & {
  reverse: () => Generator<
    { data: T; id: string; index: number },
    void,
    unknown
  >;
} => {
  const list = new Doubly<T>(nodes);
  const format = (
    node: undefined | DataNode.DoublyLinkedInstance<T>,
  ): Base.AccessorResult<T> =>
    node ? { data: node.data, id: node.id } : undefined;
  const api = Object.freeze({
    *forward() {
      for (const { node, index } of list.forward())
        yield { data: node.data, id: node.id, index };
    },
    *reverse() {
      for (const { node, index } of list.reverse())
        yield { data: node.data, id: node.id, index };
    },
    get head() {
      return list.head;
    },
    get tail() {
      return list.tail;
    },
    get size() {
      return list.size;
    },
    setHead(data: DataNode.Detail<T>) {
      list.setHead(DataNode.create.doublyLinked(data));
      return api;
    },
    append(data: DataNode.Detail<T>) {
      list.append(data);
      return api;
    },
    prepend(data: DataNode.Detail<T>) {
      list.prepend(data);
      return api;
    },
    insert(arg: Base.InsertArgs<T>) {
      list.insert(arg);
      return api;
    },
    remove(indexOrId: string | number) {
      list.remove(indexOrId);
      return api;
    },
    moveToIndex(targetId: string, index: number) {
      list.moveToIndex(targetId, index);
      return api;
    },
    moveToTarget(
      nodeToMoveId: string,
      targetNodeId: string,
      position: Base.InsertPosition,
    ) {
      list.moveToTarget(nodeToMoveId, targetNodeId, position);
      return api;
    },
    removeHead() {
      list.removeHead();
      return api;
    },
    getIndex: (id: string) => list.getIndex(id),
    extract: (id: string) => format(list.extract(id)?.node),
    find: (id: string, direction: TraversalDirection = "forward") =>
      format(list.find(id, direction)?.node),
    get: (index: number) => format(list.get(index)?.node),
    pop: () => format(list.pop()),
    has: list.has.bind(list),
    toString: list.toString.bind(list),
    reset: () => {
      list.reset();
      return api;
    },
  } as const);
  return api;
};
type API<T> = ReturnType<typeof create<T>>;

export { type API, create };
