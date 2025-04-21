import { Obj } from "@toolbox-ts/utils";
import * as Core from "../../../../../core/index.js";
import { Base } from "../../../base/index.js";

interface Cfg {
  top: Core.CountedChar;
  bottom: Core.CountedChar;
}
const is = {
  cfg: (cfg: unknown): cfg is Cfg =>
    Obj.is(cfg) &&
    Core.is.countedChar(cfg.top) &&
    Core.is.countedChar(cfg.bottom),
} as const;
type Opts = Obj.NestedPartial<Cfg>;
const DEFAULTS: Cfg = {
  top: { char: Core.C.space, count: 0 },
  bottom: { char: Core.C.space, count: 0 },
} as const;

const add: {
  top: (matrix: Base.Matrix, count: number, char?: string) => Base.Matrix;
  bottom: (matrix: Base.Matrix, count: number, char?: string) => Base.Matrix;
} = {
  top: (matrix, count, char = Core.C.space) => {
    const { width } = Base.get.dimensions(matrix);
    const padding = Base.create.from.dimensions({ width, height: count }, char);
    return [...padding, ...matrix];
  },
  bottom: (matrix, count, char = Core.C.space) => {
    const { width } = Base.get.dimensions(matrix);
    const padding = Base.create.from.dimensions({ width, height: count }, char);
    return [...matrix, ...padding];
  },
} as const;

const apply = (matrix: Base.Matrix, opts?: Opts) => {
  let result = Base.clone(matrix);
  const { bottom, top } = Obj.merge(DEFAULTS, opts);
  if (top.count > 0) result = add.top(result, top.count, top.char);
  if (bottom.count > 0) result = add.bottom(result, bottom.count, bottom.char);
  return result;
};

export { add, apply, DEFAULTS, is, type Cfg, type Opts };
