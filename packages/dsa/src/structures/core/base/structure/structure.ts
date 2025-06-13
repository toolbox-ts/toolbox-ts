import { Node } from "../node/index.js";
import { Size } from "./size/index.js";
import type { Config, Structure, RecommendedPublicAPI } from "./types.js";
export type * from "./types.js";

/**
 * Iterates over node details in a structure, starting from
 * a given node and following a pointer key.
 * Yields each node's detail and its index in the traversal.
 */
export function* genericDetailIterator<
  NT extends Node.TypeKey,
  AK extends string,
  D,
>(
  startNode: Node.Type<NT, AK, D> | undefined,
  pointerKey: Node.PointerKey<NT> & keyof Node.Type<NT, AK, D>,
): Node.DetailIterator<D> {
  let current: Node.Type<NT, AK, D> | undefined = startNode;
  let index = 0;
  while (current) {
    yield { detail: current.detail, index: index++ };
    current = current[pointerKey] as Node.Type<NT, AK, D> | undefined;
    if (current?.id === startNode?.id) break;
  }
}

/**
 * Creates a new structure instance with node and size management.
 * @param config - Structure configuration
 */
export const create = <
  SK extends string,
  NT extends Node.TypeKey,
  AK extends string,
  D,
>({
  type,
  nodeManagerCfg,
  sizing = {},
}: Config<SK, NT, AK, D>): Structure<SK, NT, AK, D> => {
  const { maxSize = Infinity, assertErrorMsgs = {} } = sizing;
  const { type: _type, ...nodeCfg } = nodeManagerCfg;
  const {
    anchors,
    create: createNode,
    ...node
  } = Node.create[_type]<AK, D>(nodeCfg) as Node.Manager<NT, AK, D>;
  const ids = new Set<string>();
  const size = Size.create({
    calculate: () => ids.size,
    assertErrorMsgs,
    maxSize,
  });
  const toString = () =>
    `Structure {
  type: "${type}", 
  nodeType: "${node.type}", 
  anchors: [${anchors.keys.map((key) => `"${key}"`).join(", ")}],
  size: ${size.get()} / ${size.getMaxSize()} nodes
}`;
  function add(detail: Node.Detail<D>): undefined;
  function add<R>(
    detail: Node.Detail<D>,
    cb: (node: Node.Type<NT, AK, D>) => R,
  ): R;
  function add<R>(
    detail: Node.Detail<D>,
    cb?: (node: Node.Type<NT, AK, D>) => R,
  ): R | undefined {
    size.assert.notFull();
    return size.mutate(() => {
      if (ids.has(detail.id))
        throw new Error(`Node with ID ${detail.id} already exists.`);
      const n = createNode(detail) as Node.Type<NT, AK, D>;
      ids.add(n.id);
      return cb?.(n);
    });
  }
  const remove = <R>(
    node: Node.Type<NT, AK, D> | undefined,
    cb?: (node: Node.Type<NT, AK, D>) => R,
  ): R | undefined =>
    node === undefined
      ? undefined
      : size.mutate(() => {
          if (!ids.has(node.id))
            throw new Error(`Node with ID ${node.id} does not exist.`);
          const result = cb?.(node);
          ids.delete(node.id);
          return result;
        });

  const reset = () => {
    anchors.reset();
    ids.clear();
    size.clearCache();
  };

  return {
    node,
    anchors,
    toString,
    type,
    size,
    add,
    remove,
    has: (id: string) => ids.has(id),
    reset,
  } as Structure<SK, NT, AK, D>;
};

/**
 * Extracts the recommended public API from a structure instance.
 * Only exposes safe and useful methods for consumers.
 */
export const extractPublicAPI = <
  SK extends string,
  NT extends Node.TypeKey,
  AK extends string,
  D,
>(
  struct: Structure<SK, NT, AK, D>,
): RecommendedPublicAPI<SK, NT, AK, D> => ({
  type: struct.type,
  toString: struct.toString,
  isEmpty: struct.size.is.empty,
  isFull: struct.size.is.full,
  getSize: struct.size.get,
  getMaxSize: struct.size.getMaxSize,
  setMaxSize: struct.size.setMaxSize,
  getSizeMode: struct.size.getSizeMode,
  getCapacity: struct.size.getCapacity,
  reset: struct.reset,
  has: struct.has,
});
