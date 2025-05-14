import {
  type FontFace,
  type TemplateConfig,
  values,
  writeCssVars,
  writeFontFace,
  compileCSS,
} from "../core/index.js";
import {
  FALL_BACK_FONTS,
  HEAD,
  HIDDEN,
  NORMALIZE,
  REDUCED_MOTION,
  THEMES,
} from "./constants.js";

const {
  borderRadii: brRadii,
  darkColors: dClrs,
  elevation: elv,
  lightColors: lClrs,
  misc: msc,
  movement: mvt,
  opacity: op,
  spacing: spc,
  typography: typ,
  zIndex: zIdx,
} = values;
const mergeVars = ({
  borderRadii,
  darkColors,
  elevation,
  lightColors,
  misc,
  movement,
  opacity,
  spacing,
  typography,
  zIndex,
}: TemplateConfig): Required<TemplateConfig> => ({
  borderRadii: { ...brRadii, ...borderRadii },
  darkColors: { ...dClrs, ...darkColors },
  elevation: { ...elv, ...elevation },
  lightColors: { ...lClrs, ...lightColors },
  misc: { ...msc, ...misc },
  movement: { ...mvt, ...movement },
  opacity: { ...op, ...opacity },
  spacing: { ...spc, ...spacing },
  typography: { ...typ, ...typography },
  zIndex: { ...zIdx, ...zIndex },
});

export interface Config extends TemplateConfig {
  fontFaces?: FontFace[];
}
export const generate = ({ fontFaces = [], ...vars }: Config = {}) =>
  compileCSS(
    `${HEAD}
      ${fontFaces.reduce((acc, curr) => (acc += writeFontFace(curr)), "")}
      :root {
        --fallback-font-family: ${FALL_BACK_FONTS.reg};
        --fallback-font-family-mono: ${FALL_BACK_FONTS.mono};
        ${Object.values(mergeVars(vars)).reduce((acc, curr) => (acc += writeCssVars(curr)), "")}
      }
      ${NORMALIZE}
      ${HIDDEN}
      ${THEMES.mediaLight}
      ${THEMES.mediaDark}
      ${THEMES.rootLight}
      ${THEMES.rootDark}
      ${REDUCED_MOTION}
    `,
  );
