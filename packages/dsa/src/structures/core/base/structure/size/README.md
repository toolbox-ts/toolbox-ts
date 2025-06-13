# Size Controller Module

Size management controller for data structure modules. It enables dynamic or
fixed size enforcement, capacity checks, and error handling for structures such
as linked lists, queues, and stacks.

---

## Overview

The size controller system allows you to:

- Track the current size of a structure.
- Enforce a maximum size (fixed or dynamic).
- Query remaining capacity.
- Switch between size modes.
- Customize error messages for size assertions.

---

## Files

- **[`sizeController.ts`](sizeController.ts)**  
  Core implementation of the size controller, including logic for size tracking,
  assertions, and mode switching.

- **[`types.ts`](types.ts)**  
  Type definitions for size modes, error messages, and controller interfaces.

- **[`index.ts`](index.ts)**  
  Entry point that re-exports the size controller as `Size`.

- **[`__sizeController.test.ts`](__sizeController.test.ts)**  
  Unit tests for the size controller logic.

---

## Usage

Import the size controller in your structure module:

```ts
import { Size } from './size';

const size = Size.create({
  calculate: () => /* logic to compute current size */,
  maxSize: 100,
  assertErrorMsgs: {
    notFull: 'Structure is full!',
    notEmpty: 'Structure is empty!'
  }
});

size.get();         // Get current size
size.getMaxSize();  // Get maximum allowed size
size.is.full();     // Check if structure is full
size.is.empty();    // Check if structure is empty
size.setMaxSize(50); // Change max size
```

---

## API

See [`sizeController.ts`](sizeController.ts) and [`types.ts`](types.ts) for full
API details, including:

- `Size.create(config)` — Create a new size controller.
- `Size.Controller` — The controller interface.
- `SizeMode` — `'dynamic'` or `'fixed'`.
- Customizable error messages for size assertions.

---
