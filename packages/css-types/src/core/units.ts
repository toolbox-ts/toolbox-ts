/** https://www.w3.org/TR/css-values-4/#absolute-lengths */
type Cm = `${number}cm`;
type Mm = `${number}mm`;
type Q = `${number}Q`;
type In = `${number}in`;
type Pc = `${number}pc`;
type Pt = `${number}pt`;
type Px = `${number}px`;
type Absolute = Cm | Mm | Q | In | Pc | Pt | Px;
//--------------------------------------

type Viewport =
  | Vb
  | Vh
  | Vi
  | Vmax
  | Vmin
  | Vw
  | Dvb
  | Dvh
  | Dvi
  | Dvmax
  | Dvmin
  | Dvw
  | Lvb
  | Lvh
  | Lvi
  | Lvmax
  | Lvmin
  | Lvw
  | Svb
  | Svh
  | Svi
  | Svmax
  | Svmin
  | Svw;
// Default viewport units
type Vb = `${number}vb`;
type Vh = `${number}vh`;
type Vi = `${number}vi`;
type Vmax = `${number}vmax`;
type Vmin = `${number}vmin`;
type Vw = `${number}vw`;
type DefaultViewport = Vb | Vh | Vi | Vmax | Vmin | Vw;

// Dynamic viewport units
type Dvb = `${number}dvb`;
type Dvh = `${number}dvh`;
type Dvi = `${number}dvi`;
type Dvmax = `${number}dvmax`;
type Dvmin = `${number}dvmin`;
type Dvw = `${number}dvw`;
type DynamicViewport = Dvb | Dvh | Dvi | Dvmax | Dvmin | Dvw;

// Large viewport-percentage units
type Lvb = `${number}lvb`;
type Lvh = `${number}lvh`;
type Lvi = `${number}lvi`;
type Lvmax = `${number}lvmax`;
type Lvmin = `${number}lvmin`;
type Lvw = `${number}lvw`;
type LargeViewport = Lvb | Lvh | Lvi | Lvmax | Lvmin | Lvw;
// Local font-relative length units
type Cap = `${number}cap`;
type Ch = `${number}ch`;
type Em = `${number}em`;
type Ex = `${number}ex`;
type Ic = `${number}ic`;
type Lh = `${number}lh`;
type LocalFontRelative = Cap | Ch | Em | Ex | Ic | Lh;
// Root font-relative length units
type Rcap = `${number}rcap`;
type Rch = `${number}rch`;
type Rem = `${number}rem`;
type Rex = `${number}rex`;
type Ric = `${number}ric`;
type Rlh = `${number}rlh`;
type RootFontRelative = Rcap | Rch | Rem | Rex | Ric | Rlh;

// Small viewport-percentage units
type Svb = `${number}svb`;
type Svh = `${number}svh`;
type Svi = `${number}svi`;
type Svmax = `${number}svmax`;
type Svmin = `${number}svmin`;
type Svw = `${number}svw`;
type SmallViewportPercentage = Svb | Svh | Svi | Svmax | Svmin | Svw;

/** https://www.w3.org/TR/css-contain-3/#container-lengths */
type Cqb = `${number}cqb`;
type Cqh = `${number}cqh`;
type Cqi = `${number}cqi`;
type Cqmax = `${number}cqmax`;
type Cqmin = `${number}cqmin`;
type Cqw = `${number}cqw`;
type Cq = Cqb | Cqh | Cqi | Cqmax | Cqmin | Cqw;
type Container = Cqb | Cqh | Cqi | Cqmax | Cqmin | Cqw;

// Resolution units
type Dpcm = `${number}dpcm`;
type Dpi = `${number}dpi`;
type Dppx = `${number}dppx`;
type X = `${number}x`;
type Resolution = Dpcm | Dpi | Dppx | X;

type Fr = `${number}fr`;

type Length =
  | Absolute
  | LocalFontRelative
  | RootFontRelative
  | Viewport
  | DynamicViewport
  | LargeViewport
  | SmallViewportPercentage
  | Container;

export type {
  Length,
  Fr,
  Cq,
  Container,
  Resolution,
  Dpcm,
  Dpi,
  Dppx,
  X,
  Cqb,
  Cqh,
  Cqi,
  Cqmax,
  Cqmin,
  Cqw,
  Absolute,
  Cm,
  Ic,
  Lh,
  Mm,
  Q,
  In,
  Pc,
  Pt,
  Px,
  Cap,
  Ch,
  DefaultViewport,
  Dvb,
  Dvh,
  Dvi,
  Dvmax,
  Dvmin,
  Dvw,
  Em,
  Ex,
  LargeViewport,
  Lvb,
  Lvh,
  Lvi,
  Lvmax,
  Lvmin,
  Lvw,
  LocalFontRelative,
  Rem,
  Rcap,
  Rch,
  Rex,
  Ric,
  Rlh,
  RootFontRelative,
  Svb,
  Svh,
  Svi,
  Svmax,
  Svmin,
  Svw,
  SmallViewportPercentage,
  Vb,
  Vh,
  Vi,
  Vmax,
  Vmin,
  Vw,
  Viewport,
  DynamicViewport,
};
