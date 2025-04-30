type SharedKeyword = "initial" | "inherit" | "unset" | "revert";

type Deg = `${number}deg`;
type Grad = `${number}grad`;
type Rad = `${number}rad`;
type Turn = `${number}turn`;
type Angle = Deg | Grad | Rad | Turn;

type Ms = `${number}ms`;
type S = `${number}s`;
type Time = Ms | S;

type Percent = `${number}%`;
type CustomProperty<P extends string = string> = `--${P}`;
/** https://www.w3.org/TR/css-variables-1/#custom-property */
type Var = `var(--${string})`;

type WithVar<T> = T | Var;
type NumberWithVar = WithVar<number>;
type PercentWithVar = WithVar<Percent>;
type AngleWithVar = WithVar<Angle>;

type Accepts<T> = WithVar<T> | SharedKeyword;

export type {
  CustomProperty,
  Accepts,
  PercentWithVar,
  AngleWithVar,
  NumberWithVar,
  WithVar,
  Angle,
  Deg,
  Grad,
  SharedKeyword,
  Rad,
  Turn,
  Ms,
  S,
  Time,
  Percent,
  Var,
};
