import * as DataNode from "../../node/node.js";
import * as Base from "../types.js";

class Singly<T> extends Base.LinkedList<T, DataNode.LinkedInstance<T>> {
  protected insertAtTarget(
    targetNode: DataNode.LinkedInstance<T>,
    movingNode: DataNode.Detail<T>,
    position: Base.InsertPosition,
  ) {
    const newNode = DataNode.create.linked(movingNode);

    if (position === "before") {
      let curr = this._head;
      let found = false;
      while (curr && !found) {
        if (curr.next === targetNode) {
          // Found the previous node
          newNode.next = targetNode;
          curr.next = newNode;
          found = true;
        }
        curr = curr.next;
      }
      // if (!found) return this;
    } else {
      newNode.next = targetNode.next;
      targetNode.next = newNode;
      if (this._tail === targetNode) this._tail = newNode;
    }
    this._size++;
    return this;
  }
  setHead(node: DataNode.LinkedInstance<T>) {
    if (this._head) this.reset();
    this._head = node;
    this._tail = node;
    this._size = 1;
    return this;
  }
  removeHead() {
    if (!this._head || !this._tail) return this;
    this._head = this._head.next;
    if (this._size === 1) this._tail = undefined;
    this._size--;
    return this;
  }
  append({ data, id }: DataNode.Detail<T>) {
    const node = DataNode.create.linked({ data, id });
    if (!this._head || !this._tail) return this.setHead(node);
    this._tail.next = node;
    this._tail = node;
    this._size++;
    return this;
  }
  prepend({ data, id }: DataNode.Detail<T>) {
    const node = DataNode.create.linked({ data, id, next: this._head });
    if (!this._head || !this._tail) return this.setHead(node);
    node.next = this._head;
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
    const target =
      typeof indexOrId === "number"
        ? this.get(indexOrId)
        : this.find(indexOrId);
    if (!target) return this;
    if (target.index === 0) return this.removeHead();
    if (target.index === this._size - 1) {
      this.pop();
      return this;
    }
    const prev = this.get(target.index - 1);
    if (prev) {
      prev.node.next = target.node.next;
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
  find(id: string) {
    for (const n of this.forward()) if (n.node.id === id) return n;
    return undefined;
  }

  // Edge cases very difficult to fully cover
  /* v8 ignore next 5 */
  get(index: number) {
    if (index < 0 || index >= this._size) return undefined;
    else for (const n of this.forward()) if (n.index === index) return n;
    return undefined;
  }
  has(id: string) {
    return !!this.find(id);
  }
  pop() {
    if (!this._head || !this._tail) return undefined;
    const popped = this._tail;
    if (this._head === this._tail) {
      this._head = undefined;
      this._tail = undefined;
    } else {
      const prev = this.get(this._size - 2);
      if (prev) {
        prev.node.next = undefined;
        this._tail = prev.node;
      }
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
    let result = "null→";
    for (const { node } of this.forward()) result += `(${node.id})→`;
    return result.slice(0, -1) + "→null";
  }
  reset() {
    let curr = this._head;
    while (curr) {
      const next = curr.next;
      curr.next = undefined;
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

const create = <T>(nodes?: DataNode.Details<T>): Base.LinkedListAPI<T> => {
  const list = new Singly<T>(nodes);
  const format = (
    node: undefined | DataNode.LinkedInstance<T>,
  ): Base.AccessorResult<T> =>
    node ? { data: node.data, id: node.id } : undefined;
  const api = Object.freeze({
    *forward() {
      for (const { node, index } of list.forward())
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
      list.setHead(DataNode.create.linked(data));
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
    find: (id: string) => format(list.find(id)?.node),
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
