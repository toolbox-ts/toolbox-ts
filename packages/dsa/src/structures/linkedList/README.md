# Linked List

Singly linked, and Doubly linked list data structures, with support for both
standard and circular variants.

---

## Overview

- **Singly Linked List**: Nodes with a single `next` pointer, supporting forward
  traversal.
- **Doubly Linked List**: Nodes with both `next` and `prev` pointers, supporting
  forward and backward traversal.
- **Circular Variants**: Both singly and doubly linked lists support circular
  forms, where the tail links back to the head.
- **Anchor Management**: All lists use `head` and `tail` anchors for efficient
  access and mutation.
- **Type Safety**: All APIs are strongly typed and composable.

---

## Shared Types

The [`types.ts`](types.ts) module provides foundational types for all linked
list variants:

```ts
export type Position = "before" | "after";
export type IndexOrId = number | string;

export interface Insert<D, R> {
  initial: (d: Node.Detail<D>) => R;
  at: (index: number, d: Node.Detail<D>) => R;
  head: (d: Node.Detail<D>) => R;
  tail: (d: Node.Detail<D>) => R;
  before: (d: Node.Detail<D>, target: IndexOrId) => R;
  after: (d: Node.Detail<D>, target: IndexOrId) => R;
}

export interface LinkedList<OpData, Iterator, Return = OpData> {
  [Symbol.iterator]: () => Iterator;
  traverse: { forward: () => Iterator };
  get: {
    byIndex: (index: number) => OpData | undefined;
    byId: (id: string) => OpData | undefined;
    byIndexOrId: (indexOrId: IndexOrId) => OpData | undefined;
  };
  has: (indexOrId: IndexOrId) => boolean;
  reset: () => Return;
  move: (from: IndexOrId, to: IndexOrId, position?: Position) => Return;
  extract: (
    indexOrIdOrCb: IndexOrId | ((n: OpData) => boolean),
  ) => OpData | undefined;
  forEach: (cb: (n: OpData) => void) => Return;
  map: <R>(cb: (n: OpData) => R) => R[];
  reduce: <R>(cb: (acc: R, n: OpData) => R, initialValue: R) => R;
  filter: (cb: (n: OpData) => boolean) => OpData[];
  find: (cb: (n: OpData) => boolean) => OpData | undefined;
}
```

- For traversal methods the doubly implementation takes an additional
  `traversalDirection` parameter.

- `Position`: Used for relative insert/move operations (`'before' | 'after'`).
- `IndexOrId`: Used for node lookup and operations (number or string).
- `Insert`: Methods for inserting nodes at various positions.
- `LinkedList`: Generic interface for traversal, access, mutation, and queries.

---

## Singly Linked List

- **TypeKey**: `'singlyLinkedList' | 'singlyLinkedListCircular'`
- **AnchorKey**: `'head' | 'tail'`
- **API**:
  - `create(type)` — Create a singly linked list instance.
  - Implements the `SinglyAPI` interface (see
    [`singly/types.ts`](singly/types.ts)).

### Example

```ts
import { create } from "./singly/singlyLinkedList";

const list = create("singlyLinkedList");
list.insert.head({ id: "a", data: 1 });
list.insert.tail({ id: "b", data: 2 });

for (const { detail, index } of list) {
  console.log(index, detail);
}
```

- `insert.head(detail)`: Insert at the head.
- `insert.tail(detail)`: Insert at the tail.
- `insert.at(index, detail)`: Insert at a specific index.
- `insert.before(detail, target)`: Insert before a given index or id.
- `insert.after(detail, target)`: Insert after a given index or id.
- `extract(indexOrIdOrCb)`: Remove and return a node by index, id, or predicate.
- `move(from, to, position)`: Move a node to a new position.
- `reset()`: Clear the list.
- `[Symbol.iterator]()`: Iterate from head to tail.

---

## Doubly Linked List

- **TypeKey**: `'doublyLinkedList' | 'doublyLinkedListCircular'`
- **AnchorKey**: `'head' | 'tail'`
- **TraversalDirection**: `'forward' | 'backward'` (optional for most
  operations)
- **API**:
  - `create(type)` — Create a doubly linked list instance.
  - Implements the `DoublyAPI` interface (see
    [`doubly/types.ts`](doubly/types.ts)).
  - When getting a node from the list by index if a direction is not provided it
    is automatically calculated for optimization.

### Example

```ts
import { create } from "./doubly/doublyLinkedList";

const list = create("doublyLinkedList");
list.insert.head({ id: "a", data: 1 });
list.insert.tail({ id: "b", data: 2 });

for (const { detail, index } of list.traverse.forward()) {
  console.log(index, detail);
}
for (const { detail, index } of list.traverse.backward()) {
  console.log(index, detail);
}
```

- `insert.head(detail)`: Insert at the head.
- `insert.tail(detail)`: Insert at the tail.
- `insert.at(index, detail)`: Insert at a specific index.
- `insert.before(detail, target)`: Insert before a given index or id.
- `insert.after(detail, target)`: Insert after a given index or id.
- `extract(indexOrIdOrCb, direction?)`: Remove and return a node by index, id,
  or predicate, optionally specifying traversal direction.
- `move(from, to, position)`: Move a node to a new position.
- `reset()`: Clear the list.
- `traverse.forward()`: Iterate from head to tail.
- `traverse.backward()`: Iterate from tail to head.
- `[Symbol.iterator]()`: Iterate from head to tail.

---

## Notes

- All pointer and anchor management is handled via the core structure and node
  modules.
- Circular variants maintain a link from the tail back to the head.
- The API is designed for predictable, type-safe list operations.
- Doubly linked lists include traversal direction as an optional argument for
  most access and mutation methods.
