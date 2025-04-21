type SourceTargetKey = "source" | "target";
interface SourceTarget<S, T = S> {
  source: S;
  target: T;
}
type SourceMiddleTargetKey = SourceTargetKey | "middle";
interface SourceMiddleTarget<S, M = S, T = S> extends SourceTarget<S, T> {
  middle: M;
}

type StartEndKey = "start" | "end";
interface StartEnd<S, E = S> {
  start: S;
  end: E;
}
type StartCenterKey = StartEndKey | "middle";
interface StartMiddleEnd<S, M = S, T = S> extends StartEnd<S, T> {
  middle: M;
}

type HeadTailKey = "head" | "tail";
interface HeadTail<H = string, T = H> {
  head: H;
  tail: T;
}
type HeadBodyTailKey = HeadTailKey | "body";
interface HeadBodyTail<H = string, B = H, T = H> extends HeadTail<H, T> {
  body: B;
}
type IncomingOutgoingKey = "incoming" | "outgoing";
interface IncomingOutgoing<I, O = I> {
  incoming: I;
  outgoing: O;
}

type PrimarySecondaryKey = "primary" | "secondary";
interface PrimarySecondary<P, S = P> {
  primary: P;
  secondary: S;
}
type HeaderFooterKey = "header" | "footer";
interface HeaderFooter<H, F = H> {
  header: H;
  footer: F;
}
type HeaderBodyFooterKey = HeaderFooterKey | "body";
interface HeaderBodyFooter<H, B = H, F = H> extends HeaderFooter<H, F> {
  body: B;
}

export type {
  HeadBodyTail,
  HeadBodyTailKey,
  HeaderBodyFooter,
  HeaderBodyFooterKey,
  HeaderFooter,
  HeaderFooterKey,
  HeadTail,
  HeadTailKey,
  IncomingOutgoing,
  IncomingOutgoingKey,
  PrimarySecondary,
  PrimarySecondaryKey,
  SourceMiddleTarget,
  SourceMiddleTargetKey,
  SourceTarget,
  SourceTargetKey,
  StartEnd,
  StartEndKey,
  StartMiddleEnd,
  StartCenterKey,
};
