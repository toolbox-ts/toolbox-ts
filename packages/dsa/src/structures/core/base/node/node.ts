import { Singly } from "./singly/index.js";
import { Doubly } from "./doubly/index.js";

// Re-export types for external use
export type { Singly } from "./singly/index.js";
export type { Doubly } from "./doubly/index.js";
export type {
  Detail,
  DetailIterator,
  DetailYield,
  NodeIterator,
  NodeYield,
} from "./types.js";

/** Union of all supported node type keys. */
export type TypeKey = Singly.TypeKey | Doubly.TypeKey;

/**
 * Infers the specific node type key from a union TypeKey.
 * @template TK - Node type key
 */
export type InferTypeKey<TK extends TypeKey> = TK extends Singly.TypeKey
  ? Singly.TypeKey
  : TK extends Doubly.TypeKey
    ? Doubly.TypeKey
    : never;

/**
 * Configuration type for creating a singly or doubly linked node manager.
 * Resolves to the correct config type based on the provided type key.
 *
 * @template TK - Node type key ('singly' or 'doubly')
 * @template AK - Anchor key string type
 * @template D - Data type stored in the node
 */
export type Config<
  TK extends TypeKey,
  AK extends string,
  D,
> = TK extends Singly.TypeKey
  ? { type: Singly.TypeKey } & Singly.Config<AK, D>
  : TK extends Doubly.TypeKey
    ? { type: Doubly.TypeKey } & Doubly.Config<AK, D>
    : never;

/** Factory object for creating singly or doubly linked node managers. */
export const create = { singly: Singly.create, doubly: Doubly.create } as const;

/**
 * Node type for singly or doubly linked nodes.
 * Resolves to the correct node type based on the provided type key.
 *
 * @template TK - Node type key
 * @template AK - Anchor key string type
 * @template D - Data type stored in the node
 */
export type Type<
  TK extends TypeKey,
  AK extends string,
  D,
> = TK extends Singly.TypeKey
  ? Singly.Type<AK, D>
  : TK extends Doubly.TypeKey
    ? Doubly.Type<AK, D>
    : never;

/**
 * Node manager API type for singly or doubly linked nodes.
 * Resolves to the correct manager type based on the provided type key.
 *
 * @template TK - Node type key
 * @template AK - Anchor key string type
 * @template D - Data type stored in the node
 */
export type Manager<
  TK extends TypeKey,
  AK extends string,
  D,
> = TK extends Singly.TypeKey
  ? Singly.API<AK, D>
  : TK extends Doubly.TypeKey
    ? Doubly.API<AK, D>
    : never;

/**
 * Pointer key type for singly or doubly linked nodes.
 * Resolves to the correct pointer key type based on the provided type key.
 *
 * @template TK - Node type key
 */
export type PointerKey<TK extends TypeKey> = TK extends Singly.TypeKey
  ? Singly.PointerKey
  : TK extends Doubly.TypeKey
    ? Doubly.PointerKey
    : never;
