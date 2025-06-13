import type { Node } from "../node/index.js";
import type { Size } from "./size/index.js";
import type { SizeMode } from "./size/sizeController.js";

/**
 * Configuration for creating a structure instance.
 *
 * @template SK - Structure type key (e.g., 'singlyLinkedList')
 * @template NT - Node type key (e.g., 'singly', 'doubly')
 * @template AK - Anchor key string type (e.g., 'head', 'tail')
 * @template D - Data type stored in the node
 */
export interface Config<
  SK extends string,
  NT extends Node.TypeKey,
  AK extends string,
  D,
> {
  /** Structure type identifier (e.g., 'singlyLinkedList') */
  type: SK;
  /** Node manager configuration (see Node.Config) */
  nodeManagerCfg: Node.Config<NT, AK, D>;
  /** Optional sizing configuration for the structure */
  sizing?: {
    /** Optional maximum allowed size of the structure */
    maxSize?: number;
    /** Optional custom error messages for size assertions */
    assertErrorMsgs?: Partial<Size.AssertErrorMsgs>;
  };
}

/**
 * Structure instance interface, combining node management and size control.
 *
 * @template SK - Structure type key (e.g., 'singlyLinkedList')
 * @template NT - Node type key (e.g., 'singly', 'doubly')
 * @template AK - Anchor key string type (e.g., 'head', 'tail')
 * @template D - Data type stored in the node
 */
export interface Structure<
  SK extends string,
  NT extends Node.TypeKey,
  AK extends string,
  D,
> {
  /** Structure type identifier (e.g., 'singlyLinkedList') */
  type: SK;
  /** Node type key (e.g., 'singly', 'doubly') */
  nodeType: NT;
  /** Anchor manager for the structure (e.g., head, tail) */
  anchors: Node.Manager<NT, AK, D>["anchors"];
  /** Node manager instance (excluding anchors and create) */
  node: Omit<Node.Manager<NT, AK, D>, "anchors" | "create">;
  /** Size controller instance for the structure */
  size: Size.Controller;
  /**
   * Returns a string summary of the structure.
   *
   * @example
   * ```typescript
   * Structure {
   *   type: "singlyLinkedList",
   *   nodeType: "singly",
   *   anchors: ["head", "tail"]
   * }
   * ```
   */
  toString: () => string;

  /** Checks if a node with the given id exists in the structure. */
  has: (id: string) => boolean;

  /**
   * Adds a node to the structure.
   * If a callback is provided, it is called with the created node.
   */
  add: {
    (detail: Node.Detail<D>): undefined;
    <R>(detail: Node.Detail<D>, cb?: (node: Node.Type<NT, AK, D>) => R): R;
  };

  /**
   * Removes a node from the structure.
   * If a callback is provided, it is called with the removed node.
   */
  remove: <R>(
    node: Node.Type<NT, AK, D> | undefined,
    cb?: (node: Node.Type<NT, AK, D>) => R,
  ) => R | undefined;

  /** Resets the structure to its initial empty state. */
  reset: () => void;
}

/**
 * Recommended public API for a structure instance.
 * Exposes only safe and useful methods for consumers.
 *
 * @template SK - Structure type key (e.g., 'singlyLinkedList')
 * @template NT - Node type key (e.g., 'singly', 'doubly')
 * @template AK - Anchor key string type (e.g., 'head', 'tail')
 * @template D - Data type stored in the node
 */
export type RecommendedPublicAPI<
  SK extends string,
  NT extends Node.TypeKey,
  AK extends string,
  D,
> = Pick<Structure<SK, NT, AK, D>, "type" | "toString" | "reset" | "has"> & {
  /** Returns the current size of the structure. */
  getSize: () => number;
  /** Returns the maximum allowed size of the structure. */
  getMaxSize: () => number;
  /**
   * Sets a new maximum allowed size for the structure.
   * @param maxSize - The new maximum size
   */
  setMaxSize: (maxSize: number) => void;
  /** Returns the current size mode ('dynamic' or 'fixed'). */
  getSizeMode: () => SizeMode;
  /** Returns the remaining capacity (maxSize - current size). */
  getCapacity: () => number;
  /** Returns true if the structure is empty. */
  isEmpty: () => boolean;
  /** Returns true if the structure is full (at maxSize). */
  isFull: () => boolean;
  /** Returns a string summary of the structure. */
  toString: () => string;
};
