/**
 * The color wheel is divided into 6 sectors
 *  - red,yellow,green,cyan,blue,magenta
 * each sector is 60 degrees | 60*6 = 360 degrees
 */
type Sector =
  | "redYellow"
  | "yellowGreen"
  | "greenCyan"
  | "cyanBlue"
  | "blueMagenta"
  | "magentaRed";

const angles = { min: 0, max: 360, sector: 60 } as const;
const sectors = {
  redYellow: { start: 0, end: 60 },
  yellowGreen: { start: 60, end: 120 },
  greenCyan: { start: 120, end: 180 },
  cyanBlue: { start: 180, end: 240 },
  blueMagenta: { start: 240, end: 300 },
  magentaRed: { start: 300, end: 360 },
} as const;
const isIn = {
  circle: (value: unknown): boolean =>
    typeof value === "number" && value >= angles.min && value <= angles.max,
  sector: (position: unknown, target: Sector): boolean => {
    const { end, start } = sectors[target];
    return (
      typeof position === "number" &&
      position >= start &&
      (position < end || (target === "magentaRed" && position === 360))
    );
  },
};

export { angles, sectors, isIn, type Sector };
