# Structure Module

This directory provides the core infrastructure for building data structure
instances with managed nodes, anchors, and size control. It is designed to be
generic and extensible, supporting a wide variety of data structures.

---

## Features

- **Generic Structure Creation**: Compose any node-based data structure by
  specifying node type, anchor keys, and sizing rules.
- **Anchor Management**: Fast access and mutation of anchor nodes (e.g., `head`,
  `tail`).
- **Size Control**: Enforce maximum size, check capacity, and switch between
  dynamic and fixed size modes.
- **Type Safety**: All APIs are strongly typed, supporting custom node types and
  anchors.
- **Recommended Public API**: Exposes only safe, consumer-facing methods for
  structure manipulation.
- **Unique ID Management**: Enforces unique ID properties through the add
  method.

---

## API

### 1. `create`

Creates a new structure instance with node and size management.

```ts
import { Structure } from "./structure";

const struct = Structure.create({
  type: "myList",
  nodeManagerCfg: {
    type: "singly",
    anchorKeys: ["head", "tail"],
    primaryAnchorKey: "head",
  },
  sizing: {
    maxSize: 100,
    assertErrorMsgs: { overflow: "List is full!", underflow: "List is empty!" },
  },
});
```

**Returns:**  
A structure instance with the following properties:

- `type`: Structure type key
- `nodeType`: Node type key
- `anchors`: Anchor manager (e.g., head, tail)
- `node`: Node manager (excluding anchors and create)
- `size`: Size controller
- `add`, `remove`, `has`, `reset`, `toString`: Core structure methods

---

### 2. `genericDetailIterator`

Iterates over node details in a structure, starting from a given node and
following a pointer key.

```ts
for (const { detail, index } of Structure.genericDetailIterator(
  struct.anchors.primary,
  "next",
)) {
  console.log(detail, index);
}
```

---

### 3. `extractPublicAPI`

Extracts a recommended public API from a structure instance, exposing only safe
and useful methods for consumers.

```ts
const api = Structure.extractPublicAPI(struct);
api.getSize();
api.isEmpty();
api.reset();
```

---

## Types

- **`Config`**: Configuration for creating a structure instance.
- **`Structure`**: Structure instance interface, combining node management and
  size control.
- **`RecommendedPublicAPI`**: Public API type for consumers.

---

## Example

```ts
import { Structure } from "./structure";

const struct = Structure.create({
  type: "queue",
  nodeManagerCfg: {
    type: "singly",
    anchorKeys: ["head", "tail"],
    primaryAnchorKey: "head",
  },
  sizing: { maxSize: 10 },
});

struct.add({ id: "n1", data: 42 }, (node) => {
  struct.anchors.set("head", node);
});
console.log(struct.toString());
console.log(struct.size.get()); // 1
```

---

## Integration

- **Node Management**: Uses the [Node module](../node/) for node creation and
  pointer/anchor management.
- **Size Management**: Uses the [Size Controller](./size/) for enforcing and
  querying structure size.

---
