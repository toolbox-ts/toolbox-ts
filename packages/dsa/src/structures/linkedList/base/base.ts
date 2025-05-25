import type { Structure, Node } from '../../core/index.js';

type Type = 'singly' | 'doubly';
type TraversalDirection = 'forward' | 'backward';
type Position = 'before' | 'after';
type End = 'head' | 'tail';
type IndexOrId = number | string;
type IndexIdOrNode<T, N extends Node.Type> =
  | IndexOrId
  | Node.TypeMap<T>[N]
  | number;
interface InsertStrategies<T, N extends Node.Type> {
  index: (target: number, node: Node.TypeMap<T>[N]) => boolean;
  before: (target: Node.TypeMap<T>[N], node: Node.TypeMap<T>[N]) => boolean;
  after: (target: Node.TypeMap<T>[N], node: Node.TypeMap<T>[N]) => boolean;
  head: (node: Node.TypeMap<T>[N]) => boolean;
  tail: (node: Node.TypeMap<T>[N]) => boolean;
}
type InsertStrategy<T, N extends Node.Type> = keyof InsertStrategies<T, N>;

interface ExtractStrategies<T, N extends Node.Type> {
  node: (indexOrId: IndexOrId) => Node.TypeOrUndefined<T, N>;
  before: (targetId: IndexIdOrNode<T, N>) => Node.TypeOrUndefined<T, N>;
  after: (targetId: IndexIdOrNode<T, N>) => Node.TypeOrUndefined<T, N>;
  head: () => Node.TypeOrUndefined<T, N>;
  tail: () => Node.TypeOrUndefined<T, N>;
  all: () => Node.TypeOrUndefined<T, N>[];
}
type ExtractStrategy<T, N extends Node.Type> = keyof ExtractStrategies<T, N>;

interface FindStrategies<T, N extends Node.Type> {
  node: (indexOrId: IndexOrId) => Structure.NodeIteratorYieldOrUndefined<T, N>;
  before: (
    indexIdOrNode: IndexIdOrNode<T, N>
  ) => Structure.NodeIteratorYieldOrUndefined<T, N>;
  after: (
    indexIdOrNode: IndexIdOrNode<T, N>
  ) => Structure.NodeIteratorYieldOrUndefined<T, N>;
}
type FindStrategy<T, N extends Node.Type> = keyof FindStrategies<T, N>;

type IsGuards<T, N extends Node.Type> = Structure.Core<
  T,
  End,
  N,
  Node.TypeMap<T>[N]
>['is'] & {
  linked: (node: Node.TypeMap<T>[N]) => boolean;
  uniqueId: (node: Node.TypeMap<T>[N]) => boolean;
};

interface LinkedListCore<T, N extends Node.Type>
  extends Structure.Core<T, End, N, Node.TypeMap<T>[N]> {
  /** Whether the structure contains a node with the given ID or index */
  has: (indexOrId: IndexOrId) => boolean;
  is: IsGuards<T, N>;
  /** Clear all structure state */
  reset: () => void;
  unlink: (node: Node.TypeMap<T>[N]) => Node.TypeMap<T>[N];
  /** Move a node by ID or index to a new index or relative position */
  move: {
    (from: IndexOrId, toIndex: number): boolean;
    (from: IndexOrId, targetId: string, position: Position): boolean;
  };
  /** Insert a node into the structure */
  insert: (strategy: InsertStrategy<T, N>, node: Node.TypeMap<T>[N]) => boolean;
  extract: (strategy: ExtractStrategy<T, N>) => Node.TypeOrUndefined<T, N>;
  find: (
    strategy: FindStrategy<T, N>,
    indexOrId: IndexOrId
  ) => Structure.NodeIteratorYieldOrUndefined<T, N>;
}
interface SinglyCore<T> extends LinkedListCore<T, 'singly'> {
  traverse: { forward: Structure.NodeIterator<T, 'head', 'singly'> };
}

const resolveIndexOrId = <T, N extends Node.Type>(
  indexIdOrNode: IndexIdOrNode<T, N>
): IndexOrId =>
  typeof indexIdOrNode === 'object' ? indexIdOrNode.id : indexIdOrNode;

const findBy = <T, K extends string, N extends Node.Type>(
  nodeIterator: Structure.NodeIterator<T, K, N>,
  predicate: (n: Structure.NodeIteratorYield<T, N>) => boolean
) => nodeIterator().find(predicate);

const Singly = <T>(
  structure: Structure.Core<T, End, 'singly', SinglyCore<T>>
) => {
  const is = {
    is: {
      ...structure.is,
      linked: (node: Node.Singly<T>) =>
        node === core.root.head
        || structure.nodeIterator().some((n) => n.node.next === node),
      uniqueId: (node: Node.Singly<T>) =>
        structure.nodeIterator().every((n) => n.node.id !== node.id)
    }
  } as const;
  const setInitialNode = (node: Node.Singly<T>) => {
    if (!structure.is.empty())
      throw new Error(
        `Attempting to setInitialNode when Structure is not empty`
      );

    structure.root.head = node;
    structure.root.tail = node;
    node.next = undefined;
    return true;
  };
  const find: FindStrategies<T, 'singly'> = {
    node: (indexIdOrNode) => {
      const indexOrId = resolveIndexOrId(indexIdOrNode);
      return typeof indexOrId === 'string' ?
          findBy(structure.nodeIterator, (n) => n.node.id === indexOrId)
        : findBy(structure.nodeIterator, (n) => n.index === indexOrId);
    },
    before: (indexIdOrNode) => {
      const indexOrId = resolveIndexOrId(indexIdOrNode);
      return typeof indexOrId === 'string' ?
          findBy(structure.nodeIterator, (n) => n.node.next?.id === indexOrId)
        : findBy(structure.nodeIterator, (n) => n.index + 1 === indexOrId);
    },
    after: (indexIdOrNode) => {
      const indexOrId = resolveIndexOrId(indexIdOrNode);
      return typeof indexOrId === 'string' ?
          findBy(structure.nodeIterator, (n) => n.node.id === indexOrId)
        : findBy(structure.nodeIterator, (n) => n.index - 1 === indexOrId);
    }
  } as const;
  const has = (indexOrId: IndexOrId) => !!find.node(indexOrId);

  const unlink = (indexIdOrNode: IndexIdOrNode<T, 'singly'>) => {
    const found =
      typeof indexIdOrNode === 'object' ?
        { node: indexIdOrNode }
      : find.node(indexIdOrNode);
    if (!found) throw new Error(`Node not found`);
    const { node } = found;
    if (node === structure.root.head) structure.root.head = node.next;
    else {
      const prev = find.before(node);
      if (!prev) throw new Error(`Previous node not found`);
      prev.node.next = node.next;
    }
    return node;
  };

  const safe = (cb: () => void): boolean => {
    try {
      return structure.withSize.inc(() => {
        cb();
        return true;
      });
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const insert: InsertStrategies<T, 'singly'> = {
    index: (target: number, node: Node.Singly<T>) => {
      if (target <= 0 || !structure.root.head) {
        // Insert at head or into empty list
        return strategies.insert.head(node);
      }
      return safe(() => {
        const prev = find.before(target);
        if (!prev) throw new Error(`Failed to locate previous node`);
        node.next = prev.node.next;
        prev.node.next = node;
        if (!node.next) structure.root.tail = node;
        return true;
      });
    },

    after: (target: Node.Singly<T>, node: Node.Singly<T>) =>
      safe(() => {
        node.next = target.next;
        target.next = node;
        if (!node.next) structure.root.tail = node;
        return true;
      }),

    before: (target: Node.Singly<T>, node: Node.Singly<T>) => {
      if (structure.root.head === target) {
        // Insert before head
        return strategies.insert.head(node);
      }
      return safe(() => {
        const prev = find.before(target);
        if (!prev) throw new Error(`Previous node not found`);
        node.next = target;
        prev.node.next = node;
      });
    },

    head: (node: Node.Singly<T>) => {
      if (!structure.root.head) return setInitialNode(node);
      if (structure.root.head === node) return false;
      node.next = structure.root.head;
      structure.root.head = node;
      return true;
    },

    tail: (node: Node.Singly<T>) => {
      if (!structure.root.tail) return setInitialNode(node);
      if (structure.root.tail === node) return false;
      node.next = undefined;
      structure.root.tail.next = node;
      structure.root.tail = node;
      return true;
    }
  };

  const strategies: ExtractStrategies<T, 'singly'> = {
    after: (indexIdOrNode) => {},
    before: (indexIdOrNode) => {},
    node: (indexIdOrNode) => {},
    head: () => {},
    tail: () => {},
    all: () => {}
  } as const;
  const core: SinglyCore<T> = {
    ...structure,
    find: (strategy, indexOrId) => find[strategy](indexOrId)

    // move: (
    //   nodeToMoveIndexOrId,
    //   indexOrTargetId,
    //   position: Position = 'before'
    // ) => {
    //   if (!core.has(nodeToMoveIndexOrId) || !core.has(indexOrTargetId))
    //     throw new Error(`Invalid target or position`);
    //   const toMove = core.extract(nodeToMoveIndexOrId);
    //   if (!toMove) throw new Error(`Extraction Failed`);
    //   core.link(toMove, indexOrTargetId, position);
    //   return core;
    // }
  } as const;
};
