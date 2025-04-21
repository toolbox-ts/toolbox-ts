type Type = "linked" | "doublyLinked";
interface Detail<T> {
  data: T;
  id: string;
}
type Details<T> = Detail<T>[];
abstract class DataNode<T> {
  abstract readonly type: Type;
  readonly id: string;
  data: T;
  constructor({ data, id }: Detail<T>) {
    this.id = id;
    this.data = data;
  }
}

interface LinkedPointer<T> {
  next?: Linked<T>;
}
class Linked<T> extends DataNode<T> {
  readonly type = "linked";
  next?: Linked<T>;
  constructor({ data, id, next }: Detail<T> & LinkedPointer<T>) {
    super({ id, data });
    this.next = next;
  }
}
type LinkedInstance<T> = InstanceType<typeof Linked<T>>;

interface DoublyLinkedPointers<T> {
  next?: DoublyLinked<T>;
  prev?: DoublyLinked<T>;
}
class DoublyLinked<T> extends DataNode<T> {
  readonly type = "doublyLinked";
  prev?: DoublyLinked<T>;
  next?: DoublyLinked<T>;
  constructor({ data, id, next, prev }: Detail<T> & DoublyLinkedPointers<T>) {
    super({ id, data });
    this.next = next;
    this.prev = prev;
  }
}
type DoublyLinkedInstance<T> = InstanceType<typeof DoublyLinked<T>>;

const create = Object.freeze({
  linked: <T>(args: Detail<T> & LinkedPointer<T>): Linked<T> =>
    new Linked(args),
  doublyLinked: <T>(
    args: Detail<T> & DoublyLinkedPointers<T>,
  ): DoublyLinked<T> => new DoublyLinked(args),
} as const);

type Instance<T> = LinkedInstance<T> | DoublyLinkedInstance<T>;

export {
  type Detail,
  type Details,
  type DoublyLinkedInstance,
  type Instance,
  type LinkedInstance,
  type Type,
  create,
};
