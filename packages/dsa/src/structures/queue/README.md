# Queue and Deque

This directory provides queue and deque (double-ended queue) data structures,
implemented using the core structure and node modules. Both singly linked queues
and doubly linked deques are supported, with standard and circular variants for
each.

---

## Overview

- **Queue**: First-in, first-out (FIFO) structure, implemented as a singly
  linked list.
- **Deque**: Double-ended queue, supporting both FIFO and LIFO operations,
  implemented as a doubly linked list.
- **Circular Variants**: Both queue and deque support circular forms, where the
  tail links back to the head.

---

## Queue

### Types

- **TypeKey**: `'queue' | 'queueCircular'`
- **AnchorKey**: `'head' | 'tail'`
- **QueueStruct**: Underlying structure instance for a queue.
- **Queue API**: See below.

### API

```ts
interface Queue<T extends TypeKey, D>
  extends Structure.RecommendedPublicAPI<T, "singly", "head", D> {
  [Symbol.iterator](): Node.DetailIterator<D>;
  head: Node.Detail<D> | undefined;
  tail: Node.Detail<D> | undefined;
  enqueue(detail: Node.Detail<D>): Queue<T, D>;
  dequeue(): Node.Detail<D> | undefined;
  reset(): Queue<T, D>;
}
```

### Usage

```ts
import { create } from "./singly/singlyQueue";

const queue = create<"queue", number>("queue");
queue.enqueue({ id: "a", data: 1 });
queue.enqueue({ id: "b", data: 2 });

console.log(queue.head); // { id: 'a', data: 1 }
console.log(queue.dequeue()); // { id: 'a', data: 1 }
console.log(queue.head); // { id: 'b', data: 2 }
```

- **enqueue**: Add an item to the tail.
- **dequeue**: Remove and return the item at the head.
- **head**: Get the detail at the head.
- **tail**: Get the detail at the tail.
- **reset**: Clear the queue.
- **[Symbol.iterator]**: Iterate from head to tail.

---

## Deque

### Types

- **TypeKey**: `'deque' | 'dequeCircular'`
- **AnchorKey**: `'head' | 'tail'`
- **DequeStruct**: Underlying structure instance for a deque.
- **Deque API**: See below.

### API

```ts
interface Deque<D>
  extends Structure.RecommendedPublicAPI<
    "deque" | "dequeCircular",
    "doubly",
    "head",
    D
  > {
  [Symbol.iterator](): Node.DetailIterator<D>;
  head: Node.Detail<D> | undefined;
  tail: Node.Detail<D> | undefined;
  append(detail: Node.Detail<D>): Deque<D>;
  prepend(detail: Node.Detail<D>): Deque<D>;
  popHead(): Node.Detail<D> | undefined;
  popTail(): Node.Detail<D> | undefined;
  reset(): Deque<D>;
}
```

### Usage

```ts
import { create } from "./doubly/deque";

const deque = create<"deque", string>("deque");
deque.append({ id: "x", data: "foo" });
deque.prepend({ id: "y", data: "bar" });

console.log(deque.head); // { id: 'y', data: 'bar' }
console.log(deque.tail); // { id: 'x', data: 'foo' }
console.log(deque.popTail()); // { id: 'x', data: 'foo' }
```

- **append**: Add an item to the tail.
- **prepend**: Add an item to the head.
- **popHead**: Remove and return the item at the head.
- **popTail**: Remove and return the item at the tail.
- **head**: Get the detail at the head.
- **tail**: Get the detail at the tail.
- **reset**: Clear the deque.
- **[Symbol.iterator]**: Iterate from head to tail.

---

## Circular Variants

- For both queue and deque, the `'queueCircular'` and `'dequeCircular'` types
  maintain a circular link from tail to head.
- The API remains the same; only the internal pointer logic differs.

---

## Implementation Notes

- All pointer and anchor management is handled via the core structure and node
  modules.
- The API is designed for predictable, type-safe queue and deque operations.
- Iteration always proceeds from head to tail.

---

## Types

- See `singly/types.ts` and `doubly/types.ts` for full type definitions.
