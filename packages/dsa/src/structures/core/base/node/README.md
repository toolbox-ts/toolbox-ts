# Node Module

This directory provides the core building blocks for pointer-based node
management in data structures. It offers a unified, type-safe API for creating
and managing nodes with support for both singly and doubly linked
configurations.

---

## Overview

- **Singly Linked Nodes**: Nodes with a single pointer (e.g., `next`).
- **Doubly Linked Nodes**: Nodes with two pointers (e.g., `next`, `prev`).
- **Anchor Management**: Support for anchor keys (e.g., `head`, `tail`) for fast
  access and mutation.
- **Type Safety**: All APIs are strongly typed and composable.
- **Extensible**: Easily create custom node managers for new data structure
  types.

---

## Modules

### Singly Linked Nodes

- **Location**: [`singly/singly.ts`](singly/singly.ts)
- **Type Key**: `'singly'`
- **Pointer Keys**: `'next'`
- **Usage**: For singly linked lists and similar structures.
- **API**:
  - `Singly.create(cfg)` — Create a singly linked node manager.
  - `Singly.Type<AK, D>` — Node type.
  - `Singly.API<AK, D>` — Node manager API.

### Doubly Linked Nodes

- **Location**: [`doubly/doubly.ts`](doubly/doubly.ts)
- **Type Key**: `'doubly'`
- **Pointer Keys**: `'next'`, `'prev'`
- **Usage**: For doubly linked lists and similar structures.
- **API**:
  - `Doubly.create(cfg)` — Create a doubly linked node manager.
  - `Doubly.Type<AK, D>` — Node type.
  - `Doubly.API<AK, D>` — Node manager API.

---

## Node Manager Internals

Both singly and doubly node managers are built on top of the
[Node Manager system](./_Manager/README.md), which provides:

- Base node creation
- Pointer property assignment
- Anchor management
- Unified module interface

---

## Example

```ts
import { create, Type } from "./node";

// Create a singly linked node manager
const singlyManager = create.singly({
  anchorKeys: ["head", "tail"] as const,
  primaryAnchorKey: "head",
});

// Create a new singly linked node
const node: Type<"singly", "head" | "tail", number> = singlyManager.create({
  id: "n1",
  data: 42,
});

// Create a doubly linked node manager
const doublyManager = create.doubly({
  anchorKeys: ["head", "tail"] as const,
  primaryAnchorKey: "head",
});

// Create a new doubly linked node
const dnode: Type<"doubly", "head" | "tail", number> = doublyManager.create({
  id: "n2",
  data: 99,
});
```

---

## Types

See [`types.ts`](types.ts) for foundational types such as `Detail`,
`WithPointers`, `AnchorManager`, etc. and [`node.ts`](node.ts) for unified
combined types.

---
