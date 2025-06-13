# toolbox-ts / dsa

A composable, type-safe TypeScript library for building and managing data
structures with pointer-based nodes. This package provides reusable modules for
singly and doubly linked lists, queues, deques, stacks, and more, all built on a
unified node and structure foundation.

---

## Features

- **Composable Node System**: Build nodes with customizable pointer and anchor
  properties.
- **Generic Structures**: Create and manage lists, queues, deques, and stacks
  with shared, extensible APIs.
- **Type Safety**: All modules are fully typed, supporting custom node types,
  anchors, and pointer keys.
- **Anchor and Pointer Management**: Efficiently manage head/tail anchors and
  node pointers.
- **Size Control**: Optional size enforcement and capacity management for all
  structures.
- **Extensible**: Compose your own data structures by combining core modules.

---

## Directory Structure

- **core/base/node/**  
  Core node types, singly/doubly node managers, pointer and anchor logic.  
  See [Node README](./src/structures/core/base/node/README.md).

- **core/base/node/\_Manager/**  
  Low-level node manager system for composing node types.  
  See [Node Manager README](./src/structures/core/base/node/_Manager/README.md).

- **core/base/structure/**  
  Generic structure logic for managing nodes, anchors, and size.  
  See [Structure README](./src/structures/core/base/structure/README.md).

- **linkedList/**  
  Singly and doubly linked list implementations (standard and circular).  
  See [Linked List README](./src/structures/linkedList/README.md).

- **queue/**  
  Queue and deque (double-ended queue) implementations, including circular
  variants.  
  See [Queue/Deque README](./src/structures/queue/README.md).

- **stack/**  
  Stack implementation (LIFO), built on the core structure and node modules. See
  [Stack README](./src//structures//stack//README.md)

---

## Example Usage

```ts
import { create as createList } from "./linkedList/singly/singlyLinkedList";

const list = createList("singlyLinkedList");
list.insert.head({ id: "a", data: 1 });
list.insert.tail({ id: "b", data: 2 });

for (const { detail, index } of list) {
  console.log(index, detail);
}

import { create as createQueue } from "./queue/singly/singlyQueue";

const queue = createQueue("queue");
queue.enqueue({ id: "x", data: 42 });
console.log(queue.dequeue()); // { id: 'x', data: 42 }
```

---

## Documentation

- [Node Module](./src/structures/core/base/node/README.md)
- [Node Manager](./src/structures/core/base/node/_Manager/README.md)
- [Structure Module](./src/structures/core/base/structure/README.md)
- [Linked List](./src/structures/linkedList/README.md)
- [Stack](./src//structures//stack//README.md)
- [Queue and Deque](./src/structures/queue/README.md)

## License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)

- @toolbox-ts
  - [NPM](https://www.npmjs.com/org/toolbox-ts)
  - [GitHub](https://github.com/toolbox-ts/toolbox-ts)
