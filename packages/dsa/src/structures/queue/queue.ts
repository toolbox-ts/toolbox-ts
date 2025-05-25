import {
  type BaseNode,
  FixedStructure,
  Structure
} from '../core/base/structure/structure.js';
import * as DataNode from '../core/base/node/index.js';

type Type = 'queue' | 'dequeue';

abstract class BaseQueue<
  D,
  N extends DataNode.LinkedInstance<D> | DataNode.DoublyLinkedInstance<D>
> extends Structure<D, N> {
  protected _tail: N | undefined = undefined;
  abstract enqueue(detail: DataNode.Detail<D>): this;
  abstract dequeue(): N['detail'] | undefined;
  public toString() {
    if (!this._head) return '[]';
    let currentNode = this._head;
    const array = [];
    while (currentNode as unknown) {
      array.push(
        `{ id: ${currentNode.id}, data: ${String(currentNode.data)} }`
      );
      (currentNode as unknown) = currentNode.next;
    }
    return `[${array.join(', ')}]`;
  }
  public toArray() {
    if (!this._head) return [];
    let currentNode = this._head;
    const array = [];
    while (currentNode as unknown) {
      array.push({ ...currentNode.detail });
      (currentNode as unknown) = currentNode.next;
    }
    return array;
  }
  public reset() {
    while (this._head) this.dequeue();
    return this;
  }
  get tail() {
    return this._tail ? { ...this._tail.detail } : undefined;
  }
}

class Queue<D> extends BaseQueue<D, DataNode.LinkedInstance<D>> {
  constructor(maxSize?: number) {
    super();
  }
  public enqueue(detail: DataNode.Detail<D>) {
    const node = DataNode.create.linked(detail);
    if (!this._head) {
      this._head = node;
      this._tail = node;
    } else {
      this._tail!.next = node;
      this._tail = node;
    }
    this._size++;
    return this;
  }
  public dequeue() {
    if (!this._head) return undefined;
    const output = { ...this._head.detail };
    this._head = this._head.next;
    if (this._size === 1) this._tail = undefined;
    this._size--;
    return output;
  }
}
const FixedQueue = FixedStructure(Queue);

class Dequeue<D> extends BaseQueue<D, DataNode.DoublyLinkedInstance<D>> {
  constructor(maxSize?: number) {
    super();
  }
  public enqueue(detail: DataNode.Detail<D>) {
    const node = DataNode.create.doublyLinked(detail);
    if (this._head) {
      this._head = node;
      this._tail = node;
    } else {
      node.next = this._head;
      this._head!.prev = node;
      this._head = node;
    }
    this._size++;
    return this;
  }
  public dequeue = () => {
    if (!this._head) return undefined;
    const output = { ...this._head.detail };
    this._head = this._head.next;
    if (this._size === 1) this._tail = undefined;
    else this._head!.prev = undefined;
    this._size--;
    return output;
  };
  public popTail() {
    if (!this._tail) return undefined;
    const output = { ...this._tail.detail };
    this._tail = this._tail.prev;
    if (this._size === 1) this._head = undefined;
    else this._tail!.next = undefined;
    this._size--;
    return output;
  }
  public append(detail: DataNode.Detail<D>) {
    const node = DataNode.create.doublyLinked(detail);
    if (!this._head) {
      this._head = node;
      this._tail = node;
    } else {
      node.prev = this._tail;
      this._tail!.next = node;
      this._tail = node;
    }
    this._size++;
    return this;
  }
}
const FixedDequeue = FixedStructure(Dequeue);
