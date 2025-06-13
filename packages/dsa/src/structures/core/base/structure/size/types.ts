/** Indicates whether the structure's size is dynamic (unbounded) or fixed (bounded). */
export type SizeMode = "dynamic" | "fixed";

/** Error message configuration for size assertions. */
export interface AssertErrorMsgs {
  /** Message for overflow errors (structure is full) */
  overflow: string;
  /** Message for underflow errors (structure is empty or below minimum) */
  underflow: string;
  /** Message for out-of-bounds errors (invalid index) */
  inBounds: string;
  /** Message for empty structure errors */
  empty: string;
}

/**
 * Configuration for creating a size controller.
 * - `calculate`: Function to compute the current size.
 * - `maxSize`: Optional maximum allowed size (default: Infinity).
 * - `assertErrorMsgs`: Optional custom error messages.
 */
export interface Config {
  /** Function to calculate the current size of the structure */
  calculate: (...args: any[]) => number;
  /** Optional maximum allowed size (default: Infinity) */
  maxSize?: number;
  /** Optional custom error messages for assertions */
  assertErrorMsgs?: Partial<AssertErrorMsgs>;
}

/** Internal state for the size controller. */
export interface State {
  /** Function to calculate the current size */
  calculate: (...args: any[]) => number;
  /** Cached size value, or null if not cached */
  cache: number | null;
  /** Indicates if the size is dynamic or fixed */
  sizeMode: SizeMode;
  /** Maximum allowed size */
  maxSize: number;
  /** Error messages for assertions */
  assertErrorMsgs: AssertErrorMsgs;
}

/** Controller interface for managing and asserting structure size. */
export interface Controller {
  /** Returns the current size mode ('dynamic' or 'fixed'). */
  getSizeMode: () => SizeMode;
  /** Returns the current size (cached if available). */
  get: (forceRecompute?: boolean) => number;
  /** Sets a new calculation function for size. */
  setCalculate: (cb: () => number) => void;
  /** Gets the current maximum size. */
  getMaxSize: () => number;
  /** Sets a new maximum size. */
  setMaxSize: (maxSize: number) => void;
  /** Returns the remaining capacity (maxSize - current size). */
  getCapacity: () => number;
  /** Clears the cached size value. */
  clearCache: () => void;
  /** Gets the current error messages for assertions. */
  getAssertErrorMsgs: () => AssertErrorMsgs;
  /** Sets custom error messages for assertions. */
  setAssertErrorMsgs: (errMsgs: Partial<AssertErrorMsgs>) => void;

  /** Utility methods for checking structure state. */
  is: {
    /** Returns true if the structure is full. */
    full: () => boolean;
    /** Returns true if the structure is empty. */
    empty: () => boolean;
    /** Returns true if the given index is within bounds. */
    inBounds: (index: number) => boolean;
  };
  /** Assertion methods that throw if the condition is not met. */
  assert: {
    /** Asserts that the given index is in bounds. */
    inBounds: (index: number) => true;
    /** Asserts that the structure is not full. */
    notFull: () => true;
    /** Asserts that the structure is not empty. */
    notEmpty: () => true;
  };
  /**
   * Executes a mutation callback and clears the cached size.
   * @param cb - Mutation callback function
   * @returns The result of the callback
   */
  mutate: <T>(cb: (...args: any[]) => T) => T;
}
