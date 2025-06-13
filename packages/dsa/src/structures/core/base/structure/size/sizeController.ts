import type {
  AssertErrorMsgs,
  Config,
  Controller,
  SizeMode,
  State,
} from "./types.js";
export type * from "./types.js";
/** Default error messages for size-related assertions. */
const ASSERT_ERR_MSGS: AssertErrorMsgs = {
  overflow: "[⚠️] Structure Overflow",
  underflow: "[⚠️] Structure Underflow",
  inBounds: "[⚠️] Out of Bounds",
  empty: "[⚠️] Structure is Empty",
} as const;

/**
 * Creates a size controller for a data structure.
 * Provides methods for querying, updating, and
 * asserting size and capacity.
 *
 * @param config - Size controller configuration
 * @returns Controller for managing structure size
 */
export function create({
  calculate,
  assertErrorMsgs = {},
  maxSize = Infinity,
}: Config): Controller {
  if (maxSize < 0)
    throw new Error("maxSize must be greater than or equal to 0");
  const state: State = {
    calculate,
    cache: null,
    sizeMode: maxSize === Infinity ? "dynamic" : "fixed",
    maxSize,
    assertErrorMsgs: { ...ASSERT_ERR_MSGS, ...assertErrorMsgs },
  } as const;
  /**
   * Updates the maximum allowed size and adjusts the size mode.
   * Throws if the new maxSize is invalid or less than the current size.
   */
  const setMaxSize = (_maxSize: number) => {
    if (typeof _maxSize !== "number" || isNaN(_maxSize))
      throw new Error("maxSize must be a valid number");
    const curr = state.calculate();
    if (_maxSize < 0) throw new Error("maxSize must be greater than 0");
    if (curr > _maxSize)
      throw new Error(
        `maxSize cannot be less than current size.. current size: ${curr}, maxSize: ${_maxSize}`,
      );
    if (_maxSize === Infinity) {
      state.sizeMode = "dynamic";
      state.maxSize = Infinity;
      return;
    }
    state.maxSize = _maxSize;
    state.sizeMode = "fixed";
  };

  /**
   * Sets a new calculation function for size and updates the cache.
   * Throws if the new calculation is invalid.
   */
  const setCalculate = (cb: () => number) => {
    state.cache = cb();
    const cache = state.cache;
    if (
      typeof cache !== "number" ||
      cache < 0 ||
      cache > state.maxSize ||
      isNaN(cache)
    )
      throw new Error(
        `calculate function must return a valid size between 0 and ${state.maxSize}`,
      );
    state.calculate = cb;
  };

  const is = {
    full: () => state.calculate() === state.maxSize,
    empty: () => state.calculate() === 0,
    inBounds: (index: number) => index >= 0 && index <= state.calculate() - 1,
  } as const;
  const assert = {
    inBounds: (index: number): true => {
      if (!is.inBounds(index))
        throw new Error(`${state.assertErrorMsgs.inBounds}: ${index}`);
      return true;
    },
    notFull: (): true => {
      if (is.full()) throw new Error(state.assertErrorMsgs.overflow);
      return true;
    },
    notEmpty: (): true => {
      if (is.empty()) throw new Error(state.assertErrorMsgs.empty);
      return true;
    },
  } as const;

  const api: Controller = {
    is,
    assert,
    setMaxSize,
    setCalculate,
    get(forceRecompute = false) {
      if (forceRecompute || state.cache === null)
        state.cache = state.calculate();
      return state.cache;
    },
    getSizeMode() {
      return state.sizeMode;
    },
    getMaxSize() {
      return state.maxSize;
    },
    getCapacity() {
      return state.maxSize - api.get();
    },
    clearCache() {
      state.cache = null;
    },

    getAssertErrorMsgs() {
      return { ...state.assertErrorMsgs };
    },
    setAssertErrorMsgs(errMsgs: Partial<AssertErrorMsgs>) {
      state.assertErrorMsgs = { ...state.assertErrorMsgs, ...errMsgs };
    },
    mutate<T>(cb: (...args: any[]) => T): T {
      api.clearCache();
      return cb();
    },
  } as const;
  return api;
}

export type { SizeMode, AssertErrorMsgs, Config, Controller };
