import type { Base } from "../../types.js";

/**
 * Configuration object for creating a base node instance.
 *
 * @template TK - The node type key (e.g., 'singly', 'doubly')
 * @template D - The type of the data payload
 */
export interface Config<TK extends string, D> {
  /** The type key for the node, indicating its type (e.g., 'singly', 'doubly') */
  type: TK;
  /** The unique identifier for the node (string) */
  id: string;
  /** The data payload for the node */
  data: D;
}

/**
 * Creates a base node instance with encapsulated id and data.
 *
 * @param config - The configuration for the node
 * @returns A Base node instance
 */
export const create = <TK extends string, D>({
  type,
  id,
  data,
}: Config<TK, D>): Base<TK, D> => {
  let _id = id;
  let _data = data;
  return {
    type,
    get id() {
      return _id;
    },
    get data() {
      return _data;
    },
    set data(newData: D) {
      _data = newData;
    },
    get detail() {
      return { id: _id, data: _data };
    },
    destroy: () => {
      _data = undefined as never;
      _id = undefined as never;
    },
  };
};
