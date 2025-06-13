import type { Structure, Node } from "../../core/index.js";
import type { LinkedList, IndexOrId, Insert } from "../types.js";

/** Type key for singly linked list structures. */
export type TypeKey = "singlyLinkedList" | "singlyLinkedListCircular";

/** Type key for singly linked list nodes (from Node.Singly). */
export type NodeTypeKey = Node.Singly.TypeKey;

/** Anchor keys for singly linked lists (typically 'head' and 'tail'). */
export type AnchorKey = "head" | "tail";

/** Node type for singly linked lists with anchor keys. */
export type SinglyNode<D> = Node.Singly.Type<AnchorKey, D>;

/** Iterator type for singly linked list nodes. */
export type SinglyIterator<D> = Node.Singly.Iterator<D>;

/** Yield type for singly linked list node iterators. */
export type SinglyYield<D> = Node.Singly.IteratorYield<D>;

/**
 * Structure instance type for singly linked lists.
 * Returned by Structure.create for singly linked list types.
 *
 * @template TK - Structure type key ('singlyLinkedList' or 'singlyLinkedListCircular')
 * @template D - Data type stored in the node
 */
export type Struct<TK extends TypeKey, D> = ReturnType<
  typeof Structure.create<TK, "singly", AnchorKey, D>
>;

/**
 * Generic singly linked list interface.
 * Extends the generic LinkedList interface with appropriate types.
 *
 * @template Data - Data type stored in the node
 * @template OpData - Operation data type (default: SinglyYield or Node.Detail)
 * @template Iterator - Iterator type (default: SinglyIterator or Node.DetailIterator)
 * @template Return - Return type for methods (default: OpData)
 */
export type SinglyLinkedList<
  Data,
  OpData = SinglyYield<Data> | Node.Detail<Data>,
  Iterator = SinglyIterator<Data> | Node.DetailIterator<Data>,
  Return = OpData,
> = LinkedList<OpData, Iterator, Return>;

/**
 * Core API for singly linked list structures.
 * Includes the structure instance, head/tail accessors, insert methods, and getPrev.
 *
 * @template TK - Structure type key
 * @template D - Data type stored in the node
 */
export type SinglyCore<TK extends TypeKey, D> = SinglyLinkedList<
  D,
  SinglyYield<D>,
  SinglyIterator<D>,
  void
> & {
  /** Underlying structure instance. */
  struct: Struct<TK, D>;
  /** Returns the head node, or undefined if empty. */
  get head(): SinglyNode<D> | undefined;
  /** Returns the tail node, or undefined if empty. */
  get tail(): SinglyNode<D> | undefined;
  /** Insert methods for the singly linked list. */
  insert: Insert<D, void>;
  /**
   * Returns the previous node/yield for a given index, id, or node.
   * @param indexIdOrNode - Index, id, or node to find the previous node for
   */
  getPrev: (
    indexIdOrNode: IndexOrId | SinglyNode<D>,
  ) => SinglyYield<D> | undefined;
};

/**
 * Recommended public API for a singly linked list structure.
 * Combines the recommended Structure API, the generic singly linked list interface,
 * and head/tail/insert accessors for consumers.
 *
 * @template TK - Structure type key
 * @template D - Data type stored in the node
 */
export type SinglyAPI<TK extends TypeKey, D> = Structure.RecommendedPublicAPI<
  TK,
  NodeTypeKey,
  AnchorKey,
  D
> &
  SinglyLinkedList<
    D,
    Node.Detail<D>,
    Node.DetailIterator<D>,
    ThisType<SinglyAPI<TK, D>>
  > & {
    /** Returns the head node's detail, or undefined if empty. */
    get head(): Node.Detail<D> | undefined;
    /** Returns the tail node's detail, or undefined if empty. */
    get tail(): Node.Detail<D> | undefined;
    /** Insert methods for the singly linked list (excluding 'initial'). */
    insert: Omit<Insert<D, ThisType<SinglyAPI<TK, D>>>, "initial">;
  };
