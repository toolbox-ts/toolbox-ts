import { type CountedChar, C, is } from "../../base/base.js";
import { Obj } from "@toolbox-ts/utils";
import * as Lines from "../../lines/lines.js";

interface Cfg {
  left: CountedChar;
  right: CountedChar;
}
type Opts = Obj.NestedPartial<Cfg>;

const DEFAULT_PADDING = { char: C.space, count: 0 };
const DEFAULTS: Cfg = {
  left: DEFAULT_PADDING,
  right: DEFAULT_PADDING,
} as const;

const isCfg = (padding: unknown): padding is Cfg =>
  Obj.is(padding) &&
  is.countedChar(padding.left) &&
  is.countedChar(padding.right);

const get = (opts?: Obj.NestedPartial<CountedChar>): string => {
  const { char, count } = Obj.merge(DEFAULT_PADDING, opts);
  return count > 0 ? char.repeat(count) : "";
};
const add = {
  left: (lines: string[] | string, opts?: Opts["left"]): string[] =>
    Lines.asLines(lines).map((line) => get(opts) + line),
  right: (lines: string[] | string, opts?: Opts["right"]): string[] =>
    Lines.asLines(lines).map((line) => line + get(opts)),
} as const;

const apply = (lines: string[] | string, opts?: Opts): string[] => {
  const { left, right } = Obj.merge(DEFAULTS, opts);
  let result = Lines.asLines(lines);
  if (left.count > 0) result = add.left(result, left);
  if (right.count > 0) result = add.right(result, right);
  return result;
};

export { type Cfg, type Opts, add, apply, DEFAULTS, get, isCfg };
