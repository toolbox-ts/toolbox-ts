# @toolbox-ts/dsa

![](https://img.shields.io/badge/coverage-100%25-brightgreen)

---

## Overview

A lightweight and extensible TypeScript library for building and managing data
structures and algorithms. This package provides modular, reusable classes for
singly and doubly linked nodes, along with a robust linked list API optimized
for traversal, mutation, and utility operations.

**Currently, the project only includes implementations of singly and doubly
linked lists along with the fundamental link-based DataNode. More data
structures and algorithms will be added in the future.**

---

## Features

- 🔗 **Linked and Doubly Linked Nodes**
- 🧱 **Composable Node Structures**
- 🧠 **Memory-Safe Linked List Operations**
- 🔁 **Generator-Based Traversals**
- 🧪 **100% Typed and Test-Covered**

---

## Installation

```bash
npm i @toolbox-ts/dsa
```

---

## Usage

### Importing

```ts
import { LinkedList } from "@toolbox-ts/dsa";
```

### Creating a Linked List

```ts
const singly = LinkedList.singly.create([
  { id: "a", data: "first" },
  { id: "b", data: "second" },
]);

singly.append({ id: "c", data: "third" });
```

---

## Exports

```ts
export * as LinkedList from "./linkedList/index.js";
export * as DataNode from "./node/index.js";
```

---

## API Overview

### 🔹 DataNode

```ts
type Type = "linked" | "doublyLinked";

interface Detail<T> {
  data: T;
  id: string;
}

abstract class DataNode<T> {
  readonly id: string;
  data: T;
  abstract readonly type: Type;
}
```

#### Linked Node

```ts
class Linked<T> extends DataNode<T> {
  readonly type = "linked";
  next?: Linked<T>;
}
```

#### Doubly Linked Node

```ts
class DoublyLinked<T> extends DataNode<T> {
  readonly type = "doublyLinked";
  next?: DoublyLinked<T>;
  prev?: DoublyLinked<T>;
}
```

#### Create Utilities

```ts
const create = {
  linked: <T>(args: Detail<T> & { next?: Linked<T> }) => new Linked(args),
  doublyLinked: <T>(
    args: Detail<T> & { next?: DoublyLinked<T>; prev?: DoublyLinked<T> },
  ) => new DoublyLinked(args),
};
```

---

### 🔹 LinkedList API

#### Core Properties

- `head`: first node (readonly)
- `tail`: last node (readonly)
- `size`: number of nodes

#### Core Methods

| Method                                       | Description                        |
| -------------------------------------------- | ---------------------------------- |
| `append(node)`                               | Add node to tail                   |
| `prepend(node)`                              | Add node to head                   |
| `insert({ node, indexOrId, position })`      | Insert relative to node or index   |
| `remove(indexOrId)`                          | Remove by index or ID              |
| `extract(id)`                                | Remove and return node             |
| `find(id)`                                   | Find node by ID                    |
| `get(index)`                                 | Get node by index                  |
| `has(id)`                                    | Check if ID exists                 |
| `getIndex(id)`                               | Get index by ID                    |
| `moveToIndex(id, index)`                     | Move node to specific index        |
| `moveToTarget(movingId, targetId, position)` | Move node relative to another node |
| `pop()`                                      | Remove tail                        |
| `reset()`                                    | Clear all nodes                    |
| `toString()`                                 | Visual representation of list      |

#### Traversal

```ts
for (const { data, id, index } of list.forward()) {
  console.log(`[${index}] ${id}: ${data}`);
}
```

---

## Example

```ts
const list = LinkedList.singly.create();

list.append({ id: "1", data: "alpha" });
list.append({ id: "2", data: "beta" });
list.prepend({ id: "0", data: "zero" });

list.insert({
  node: { id: "1.5", data: "middle" },
  indexOrId: "1",
  position: "after",
});

console.log(list.toString()); // null→(0)→(1)→(1.5)→(2)→null
```

---

## Types

This package is fully typed and ships with:

- `Detail<T>`, `Details<T>`: Payload types
- `LinkedListAPI<T>`: Typed API object
- `LinkedInstance<T>`, `DoublyLinkedInstance<T>`: Node class instances
- `ListAPI<T, E>`: Extended typed API signature

---

## License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)

- @toolbox-ts
  - [NPM](https://www.npmjs.com/org/toolbox-ts)
  - [GitHub](https://github.com/toolbox-ts/toolbox-ts)
