# Node Manager

A composable system for managing pointer-based nodes in data structures.

---

## Features

- **Composable Node Construction**: Build nodes from a base data structure, then
  augment them with pointer properties and anchor management.
- **Type Safety**: All APIs are strongly typed, supporting custom node types,
  pointer keys, and anchor keys.
- **Anchor Management**: Easily manage primary and secondary anchors (e.g.,
  head, tail) for fast access and mutation.
- **Pointer Management**: Dynamically assign and update pointers (e.g., `next`,
  `prev`) on nodes in a controlled, type-safe way.
- **Extensible**: Compose your own node modules for custom data structures by
  combining the provided building blocks.

---

## Modules

### 1. **Base Node (`base.ts`)**

Defines the core node structure, encapsulating the node's type, unique
identifier, and data payload.

- **`Base.create`**: Create a new base node instance.
- **`Base.Config`**: Configuration for base node creation.

### 2. **Pointer Assignment (`pointers.ts`)**

Augments a base node with pointer properties (e.g., `next`, `prev`) using
`Object.defineProperties` for controlled access.

- **`Pointers.assign`**: Add pointer properties to a base node.
- **`Pointers.Config`**: Configuration for pointer assignment.

### 3. **Anchor Management (`anchors.ts`)**

Manages anchor nodes (e.g., head, tail) for a collection, supporting multiple
anchors and a configurable primary anchor.

- **`Anchors.create`**: Create an anchor manager for a set of anchor keys.
- **`Anchors.Config`**: Configuration for anchor management.

### 4. **Node Manager Module (`Manager.ts`)**

Combines base, pointer, and anchor management into a single module for a
specific node type (e.g., singly or doubly linked nodes).

- **`Manager.create`**: Create a node manager module with anchors and pointers.
- **`Manager.Module`**: The resulting module interface, including node creation
  and pointer/anchor management.

---

## Example Usage

```ts
import { Manager } from "./_Manager/Manager";

// Define your node configuration
const singlyConfig = {
  type: "singly",
  anchorKeys: ["head", "tail"] as const,
  pointerKeys: ["next"] as const,
  primaryAnchorKey: "head",
} as const;

// Create a node manager module for singly linked nodes
const singlyModule = Manager.create(singlyConfig);

// Create a new node
const node = singlyModule.createNode({ id: "node1", data: 123 });

// Set the 'next' pointer (using the manager's setPointer method)
singlyModule.setPointer(node, { next: undefined });

// Set as head anchor
singlyModule.anchors.set("head", node);
```

---

## API Overview

- **Base Node**: `Base.create`, `Base.Config`
- **Pointer Assignment**: `Pointers.assign`, `Pointers.Config`
- **Anchor Management**: `Anchors.create`, `Anchors.Config`
- **Node Manager Module**: `Manager.create`, `Manager.Module`, `Manager.Config`

---

## Type Parameters

- `TK`: Node type key (e.g., `'singly'`, `'doubly'`)
- `PK`: Pointer key string type (e.g., `'next'`, `'prev'`)
- `AK`: Anchor key string type (e.g., `'head'`, `'tail'`)
- `D`: Data type stored in the node

---

## Error Handling

- Throws if anchor or pointer keys are missing or invalid.
- Throws if attempting to set/get an anchor with an unknown key.

---

## License

MIT

---
