import { Structure, type Node } from "../../core/index.js";
import type { DoublyAPI, TypeKey } from "./types.js";
import { createCore } from "./core/index.js";

export const create = <T extends TypeKey, D>(type: T): DoublyAPI<T, D> => {
  const core = createCore<T, D>(type);
  const _api = Structure.extractPublicAPI(core.struct);
  function* forward() {
    for (const { index, node } of core.traverse.forward())
      yield { detail: node.detail, index };
  }
  function* backward() {
    for (const { index, node } of core.traverse.backward())
      yield { detail: node.detail, index };
  }
  const traverse = { forward, backward } as const;

  const reduce: DoublyAPI<T, D>["reduce"] = (
    cb,
    initialValue,
    direction = "forward",
  ) => {
    let acc = initialValue;
    for (const y of traverse[direction]()) acc = cb(acc, y.detail);
    return acc;
  };
  const api: DoublyAPI<T, D> = {
    [Symbol.iterator]: forward,
    ..._api,
    traverse,
    reduce,
    get head() {
      return core.head?.detail;
    },
    get tail() {
      return core.tail?.detail;
    },
    extract: (indexOrIdOrCb, direction) =>
      core.extract(
        typeof indexOrIdOrCb === "function"
          ? ({ node }) => indexOrIdOrCb(node.detail)
          : indexOrIdOrCb,
        direction,
      )?.node.detail,
    filter: (cb, direction) =>
      reduce<Node.Detail<D>[]>(
        (acc, y) => {
          if (cb(y)) acc.push(y);
          return acc;
        },
        [],
        direction,
      ),
    find: (cb, direction) =>
      core.find(({ node }) => cb(node.detail), direction)?.node.detail,
    map: (cb, direction) => core.map(({ node }) => cb(node.detail), direction),
    forEach: (cb, direction) => {
      core.forEach(({ node }) => cb(node.detail), direction);
      return api;
    },
    get: {
      byId: (id) => core.get.byId(id)?.node.detail,
      byIndex: (index) => core.get.byIndex(index)?.node.detail,
      byIndexOrId: (indexOrId) => core.get.byIndexOrId(indexOrId)?.node.detail,
    },
    has: (indexOrId) => core.has(indexOrId),
    insert: {
      at: (index, detail) => {
        core.insert.at(index, detail);
        return api;
      },
      head: (detail) => {
        core.insert.head(detail);
        return api;
      },
      tail: (detail) => {
        core.insert.tail(detail);
        return api;
      },
      before: (detail, target) => {
        core.insert.before(detail, target);
        return api;
      },
      after: (detail, target) => {
        core.insert.after(detail, target);
        return api;
      },
    },
    move: (from, to, position = "before") => {
      core.move(from, to, position);
      return api;
    },
    reset: () => {
      core.reset();
      return api;
    },
  };
  return api;
};
