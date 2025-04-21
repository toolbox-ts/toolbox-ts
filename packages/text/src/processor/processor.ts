import { type Obj, Dimensions, Num, type Spatial } from "@toolbox-ts/utils";
import { Pad, Lines } from "../core/index.js";
import { Wrap } from "../wrap/index.js";
import { Schema } from "@toolbox-ts/schema";

interface BaseCfg {
  padding: Pad.Cfg;
  wrapping: Wrap.Cfg;
}
interface Cfg extends BaseCfg {
  dimensions: Dimensions.Typed;
}
interface Opts extends Obj.NestedPartial<BaseCfg> {
  dimensions: Dimensions.TypedInput | Spatial.Dimension;
}
interface ResolvedDimensions {
  content: Spatial.Dimensions;
  padded: Spatial.Dimensions;
}
interface ProcessedContent {
  processed: string[];
  dimensions: ResolvedDimensions;
}
interface HandlerState {
  content: string[];
  dimensions: ResolvedDimensions;
  cfg: Cfg;
}
type HandlerFn = (s: HandlerState) => HandlerState;
type Instance = InstanceType<typeof Processor>;

interface ResolveDimensionsOpts {
  content: string | string[];
  dimensions: Spatial.Dimensions;
  padding: Pad.Cfg;
}

class Processor {
  readonly schema: Schema.Instance<Cfg>;
  constructor({
    dimensions = { type: "dynamic" },
    padding = {},
    wrapping = {},
  }: Opts) {
    this.schema = Schema.create({
      fields: {
        dimensions: {
          type: "object",
          defaultValue: Dimensions.STRATEGY.dynamic.default,
          validator: Dimensions.isTyped,
        },
        padding: {
          type: "object",
          defaultValue: Pad.DEFAULTS,
          validator: Pad.isCfg,
        },
        wrapping: {
          type: "object",
          defaultValue: Wrap.DEFAULTS,
          validator: Wrap.isCfg,
        },
      },
      processorHooks: {
        post: (cfg: Cfg) => {
          cfg.dimensions = Dimensions.STRATEGY[cfg.dimensions.type].resolve(
            cfg.dimensions,
          );
          return cfg;
        },
      },
      partial: { padding, dimensions, wrapping },
    });
  }
  private resolveDimensions({
    dimensions: { width, height },
    padding,
    content,
  }: ResolveDimensionsOpts): ResolvedDimensions {
    const { horizontal, vertical } = Pad.getTotals(padding);
    const contentTotals = {
      width: Num.is.infinity(width) ? Lines.get.longestLength(content) : width,
      height: Num.is.infinity(height)
        ? Lines.transform.normalize(content).length
        : height,
    };
    const paddedTotals = {
      width: contentTotals.width + horizontal,
      height: contentTotals.height + vertical,
    };
    return { content: contentTotals, padded: paddedTotals };
  }
  private wrap: HandlerFn = ({ content, cfg, dimensions }) => ({
    cfg,
    dimensions,
    content: Wrap.apply({
      text: content,
      dimensions: dimensions.content,
      cfg: cfg.wrapping,
    }),
  });
  private pad: HandlerFn = ({ content, cfg, dimensions }) => ({
    cfg,
    dimensions,
    content: Pad.apply(content, {
      horizontal: cfg.padding.horizontal,
      vertical: {
        top: {
          height: cfg.padding.vertical.top.height,
          fill: {
            char: cfg.padding.vertical.top.fill.char,
            count: dimensions.padded.width,
          },
        },
        bottom: {
          height: cfg.padding.vertical.bottom.height,
          fill: {
            char: cfg.padding.vertical.bottom.fill.char,
            count: dimensions.padded.width,
          },
        },
      },
    }),
  });
  process(
    content: string | string[],
    processorOpts?: Obj.NestedPartial<Opts>,
  ): ProcessedContent {
    const cfg = processorOpts
      ? this.schema.process(processorOpts)
      : this.schema.current;
    const dimensions = this.resolveDimensions({
      content,
      dimensions: cfg.dimensions,
      padding: cfg.padding,
    });
    const preProcessed = {
      content: Lines.transform.normalize(content),
      cfg,
      dimensions,
    } as const;
    return { processed: this.pad(this.wrap(preProcessed)).content, dimensions };
  }
}
const create = (opts: Opts) => new Processor(opts);

export {
  type Cfg,
  type Instance,
  type Opts,
  type ProcessedContent,
  type ResolvedDimensions,
  create,
};
