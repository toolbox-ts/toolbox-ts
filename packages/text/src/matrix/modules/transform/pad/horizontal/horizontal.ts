import { Obj } from "@toolbox-ts/utils";
import * as Core from "../../../../../core/index.js";
import { Base } from "../../../base/index.js";

interface Cfg {
  left: Core.CountedChar;
  right: Core.CountedChar;
}
const is = {
  cfg: (cfg: unknown): cfg is Cfg =>
    Obj.is(cfg) &&
    Core.is.countedChar(cfg.left) &&
    Core.is.countedChar(cfg.right),
} as const;
type Opts = Obj.NestedPartial<Cfg>;
const DEFAULTS: Cfg = {
  left: { char: Core.C.space, count: 0 },
  right: { char: Core.C.space, count: 0 },
} as const;

const add: {
  left: (matrix: Base.Matrix, count: number, fillChar?: string) => Base.Matrix;
  right: (matrix: Base.Matrix, count: number, fillChar?: string) => Base.Matrix;
} = {
  left: (matrix, count, fillChar = Core.C.space) => {
    const padding = Array.from({ length: count }, () => fillChar);
    return matrix.map<string[]>((row) => [...padding, ...row]);
  },
  right: (matrix, count, fillChar = Core.C.space) => {
    const padding = Array.from({ length: count }, () => fillChar);
    return matrix.map<string[]>((row) => [...row, ...padding]);
  },
} as const;

const apply = (matrix: Base.Matrix, opts: Opts) => {
  let result = Base.clone(matrix);
  const { left, right } = Obj.merge(DEFAULTS, opts);
  if (left.count > 0) result = add.left(result, left.count, left.char);
  if (right.count > 0) result = add.right(result, right.count, right.char);
  return result;
};

export { add, apply, DEFAULTS, is, type Cfg, type Opts };
