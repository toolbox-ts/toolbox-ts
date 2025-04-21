import { Obj, Num } from "@toolbox-ts/utils";
import { type CountedChar, C, is } from "../../base/base.js";
import * as Lines from "../../lines/lines.js";

interface SideCfg {
  height: number;
  fill: CountedChar;
}
type SideOpts = Obj.NestedPartial<SideCfg>;
interface Cfg {
  top: SideCfg;
  bottom: SideCfg;
}
type Opts = Obj.NestedPartial<Cfg>;

const DEFAULT_PADDING = { height: 0, fill: { char: C.space, count: 0 } };
const DEFAULTS: Cfg = {
  top: DEFAULT_PADDING,
  bottom: DEFAULT_PADDING,
} as const;

const isSideOpts = (opt: unknown): opt is SideOpts =>
  Obj.is(opt) && Num.is.nonNegativeInt(opt.height) && is.countedChar(opt.fill);

const isCfg = (cfg: unknown): cfg is Cfg =>
  Obj.is(cfg) && isSideOpts(cfg.top) && isSideOpts(cfg.bottom);

const get = (opts?: SideOpts): string[] => {
  const {
    fill: { char, count },
    height,
  } = Obj.merge(DEFAULT_PADDING, opts);
  return height > 0 ? Array<string>(height).fill(char.repeat(count)) : [];
};
const add = {
  top: (lines: string[] | string, opts?: SideOpts): string[] => {
    const l = Lines.asLines(lines);
    return l.length <= 0 ? l : [...get(opts), ...l];
  },
  bottom: (lines: string[] | string, opts?: SideOpts): string[] => {
    const l = Lines.asLines(lines);
    return l.length <= 0 ? l : [...l, ...get(opts)];
  },
} as const;

const apply = (lines: string | string[], opts?: Opts): string[] => {
  const { bottom, top } = Obj.merge(DEFAULTS, opts);
  let result = Lines.asLines(lines);
  if (top.height > 0) result = add.top(result, top);
  if (bottom.height > 0) result = add.bottom(result, bottom);
  return result;
};
export {
  type Cfg,
  type Opts,
  type SideCfg,
  type SideOpts,
  add,
  apply,
  DEFAULTS,
  get,
  isCfg,
  isSideOpts,
};
