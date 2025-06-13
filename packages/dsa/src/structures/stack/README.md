# Stack

Type-safe, efficient stack implementation built on top of the generic structure.
The stack is implemented as a singly linked list with a single `'head'` anchor,
supporting standard stack operations and iteration.

---

## Features

- **Type-safe API**: All stack operations are strongly typed.
- **Efficient push/pop**: Constant-time operations for adding and removing
  elements.
- **Iterable**: Supports iteration over stack elements from top to bottom.
- **Chaining**: `push` and `reset` return the stack instance for fluent
  chaining.
- **Integration**: Leverages the core structure and node modules for
  extensibility and consistency.

---

## API

### `create<D>()`

Creates a new stack instance for elements of type `D`.

```ts
import { Stack } from "./stack";

const stack = Stack.create<number>();
stack.push({ id: "a", data: 1 });
stack.push({ id: "b", data: 2 });

console.log(stack.top()); // { id: 'b', data: 2 }
console.log(stack.pop()); // { id: 'b', data: 2 }
console.log(stack.top()); // { id: 'a', data: 1 }
```

### Stack Interface

```ts
interface Stack<D>
  extends Structure.RecommendedPublicAPI<"stack", "singly", "head", D> {
  [Symbol.iterator](): Node.DetailIterator<D>;
  head: Node.Detail<D> | undefined;
  pop(): Node.Detail<D> | undefined;
  push(detail: Node.Detail<D>): Stack<D>;
  reset(): Stack<D>;
  top(): Node.Detail<D> | undefined;
}
```

#### Methods

- **`push(detail)`**: Push a new node onto the stack. Returns the stack for
  chaining.
- **`pop()`**: Remove and return the detail of the top node. Returns `undefined`
  if the stack is empty.
- **`top()`**: Return the detail of the top node without removing it.
- **`reset()`**: Clear the stack. Returns the stack for chaining.
- **`head`**: Getter for the detail of the head node.
- **`[Symbol.iterator]()`**: Iterate over node details from top to bottom.

---

## Implementation Notes

- Internally, the stack uses a singly linked list with only a `'head'` anchor.
- The `push` operation sets the new node as the head and links it to the
  previous head.
- The `pop` operation removes the head node and updates the anchor.
- The stack is fully compatible with the generic structure and node modules,
  allowing for easy extension or integration with other data structures.

---
