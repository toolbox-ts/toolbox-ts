import { type Node, Structure } from "../../core/index.js";
import { createCore } from "./core/index.js";
import type { SinglyAPI, TypeKey } from "./types.js";

export const create = <T extends TypeKey, D>(type: T): SinglyAPI<T, D> => {
  const core = createCore<T, D>(type);
  const _api = Structure.extractPublicAPI(core.struct);
  function* forward() {
    for (const { index, node } of core.traverse.forward())
      yield { detail: node.detail, index };
  }

  const reduce: SinglyAPI<T, D>["reduce"] = <R>(
    cb: (acc: R, curr: Node.Detail<D>) => R,
    initialValue: R,
  ) => {
    let acc = initialValue;
    for (const y of core.traverse.forward()) acc = cb(acc, y.node.detail);
    return acc;
  };
  const api: SinglyAPI<T, D> = {
    [Symbol.iterator]: forward,
    traverse: { forward },
    /* c8 ignore start */ ..._api /* c8 ignore end */,
    get head() {
      return core.head?.detail;
    },
    get tail() {
      return core.tail?.detail;
    },

    reduce,
    extract: (indexOrIdOrCb) =>
      core.extract(
        typeof indexOrIdOrCb === "function"
          ? ({ node }) => indexOrIdOrCb(node.detail)
          : indexOrIdOrCb,
      )?.node.detail,
    get: {
      byId: (id) => core.get.byId(id)?.node.detail,
      byIndex: (index) => core.get.byIndex(index)?.node.detail,
      byIndexOrId: (indexOrId) => core.get.byIndexOrId(indexOrId)?.node.detail,
    },
    filter: (cb) =>
      reduce<Node.Detail<D>[]>((acc, y) => {
        if (cb(y)) acc.push(y);
        return acc;
      }, []),
    find: (cb) => core.find(({ node }) => cb(node.detail))?.node.detail,
    map: (cb) => core.map(({ node }) => cb(node.detail)),
    forEach: (cb) => {
      core.forEach(({ node }) => cb(node.detail));
      return api;
    },
    has: (indexOrId) => !!api.get.byIndexOrId(indexOrId),
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
    move: (from, to, position) => {
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
