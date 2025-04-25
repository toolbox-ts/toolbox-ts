const is = {
  nonNegativeInt: (num: unknown): num is number =>
    Number.isSafeInteger(num) && (num as number) >= 0,
  nonNegativeNum: (num: unknown): num is number =>
    typeof num === "number" && num >= 0,

  infinity: (num: unknown): num is number => num === Infinity,
  odd: (num: unknown) => typeof num === "number" && num % 2 > 0,
  even: (num: unknown) => typeof num === "number" && !is.odd(num),
  unitInterval: (value: unknown): value is number => typeof value === 'number' && value >= 0 && value <= 1
};

const roundToInteger = (value: number, point = 10) =>
  Math.round(Math.round(value * point) / point);

const subtractAbsolute = (start: number, ...numbers: number[]) =>
  Math.abs(
    numbers.map(Math.abs).reduce((acc, curr) => (acc -= curr), Math.abs(start)),
  );
const sumAbsolute = (start: number, ...numbers: number[]) =>
  Math.abs(
    numbers.map(Math.abs).reduce((acc, curr) => (acc += curr), Math.abs(start)),
  );


export { is, roundToInteger, subtractAbsolute, sumAbsolute };
