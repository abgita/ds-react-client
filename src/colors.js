import colorsys from 'colorsys';

// unknown source :/
/** returns the lightness of a color - range [0,1] */
function colorLightness (r, g, b) {
  return Math.sqrt(((r * r * 241) + (g * g * 691) + (b * b * 68)) / 1000) / 255.0;
}

/** returns whether the given color is dark or not */
export function isColorDark (rgb) { // arbitrary threshold, for design purposes.
  return colorLightness(rgb[0], rgb[1], rgb[2]) < 0.55;
}

/** returns a css rgba string from 'rgb'+'a' values */
export function toCssRGBA (rgb, a) {
  return `rgba(${rgb.join(',')},${a})`;
}

/**
 * returns a css 'linear-gradient' value
 * @param { array }          rgb - the gradient's start color - range [0,255]
 * @param { number } hueRotation - the hue rotation from 'rgb' - range [0,360]
 * @param { number }       angle - the gradient's direction - range [0,360]
 * @param { number }  colorAlpha - gradient's start color opacity - range [0,1]
 * @returns {string}
 */
export function getCssLinearGradient (rgb, hueRotation = 30, angle = 70, colorAlpha = 1) {
  const hsv = colorsys.rgb2Hsv(rgb[0], rgb[1], rgb[2]);

  colorsys.rotateHue(hsv, hueRotation);

  const colorStop1 = toCssRGBA(rgb, colorAlpha);
  const colorStop2 = colorsys.stringify(colorsys.hsv2Rgb(hsv));

  return `linear-gradient(${angle}deg, ${colorStop1} 0%, ${colorStop2} 100%)`;
}
