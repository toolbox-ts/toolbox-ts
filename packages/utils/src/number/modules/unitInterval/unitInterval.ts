/** Returns true if the value is a number within [0, 1] (inclusive). */
export const is = (value: unknown): value is number =>
  typeof value === "number" && value >= 0 && value <= 1;

/** Parses a number or numeric string, returns a clamped [0, 1] value. */
export const parse = (value: number | `${number}`): number => {
  const n = Number(value);
  return Number.isFinite(n) ? clamp(n) : 0;
};

/** Clamps a number to the [0, 1] interval. */
export const clamp = (value: number): number => Math.min(1, Math.max(0, value));

interface OperationOpts {
  value: number;
  min: number;
  max: number;
}

/** Scales a unit interval value to the range [min, max]. */
export const scale = ({ value, min, max }: OperationOpts): number =>
  parseFloat((clamp(value) * (max - min) + min).toFixed(10));

/** Normalizes a value in [min, max] to the unit interval. */
export const normalize = ({ value, min, max }: OperationOpts): number =>
  min === max ? 0 : clamp((value - min) / (max - min));
