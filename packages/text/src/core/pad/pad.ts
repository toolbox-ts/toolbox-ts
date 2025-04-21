import { Obj } from "@toolbox-ts/utils";
import * as Lines from "../lines/lines.js";
import * as Horizontal from "./horizontal/horizontal.js";
import * as Vertical from "./vertical/vertical.js";

interface Cfg {
  horizontal: Horizontal.Cfg;
  vertical: Vertical.Cfg;
}
type Opts = Obj.NestedPartial<Cfg>;
const DEFAULTS: Cfg = {
  horizontal: Horizontal.DEFAULTS,
  vertical: Vertical.DEFAULTS,
} as const;
const isCfg = (cfg: unknown): cfg is Cfg =>
  Obj.is(cfg) &&
  Horizontal.isCfg(cfg.horizontal) &&
  Vertical.isCfg(cfg.vertical);
const apply = (
  str: string | string[],
  { horizontal, vertical }: Opts = {},
): string[] => {
  let lines = Array.isArray(str) ? str : Lines.transform.normalize(str);
  if (horizontal) lines = Horizontal.apply(lines, horizontal);
  if (vertical) lines = Vertical.apply(lines, vertical);
  return lines;
};
const getTotals = ({ horizontal, vertical }: Cfg) => ({
  horizontal: horizontal.left.count + horizontal.right.count,
  vertical: vertical.top.height + vertical.bottom.height,
});

export * as Horizontal from "./horizontal/horizontal.js";
export * as Vertical from "./vertical/vertical.js";
export { type Cfg, apply, DEFAULTS, getTotals, isCfg };
