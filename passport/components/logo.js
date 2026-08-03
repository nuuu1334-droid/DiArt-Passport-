/**
 * DiArt Passport
 * File: passport/components/logo.js
 * Version: 1.0.0
 *
 * Draws the DiArt logo from an external SVG.
 */

"use strict";

function drawLogo({
  href,
  x,
  y,
  width,
  height,
  opacity = 1
}) {

  if (!href) return "";

  return `
<image
    href="${href}"
    x="${x}"
    y="${y}"
    width="${width}"
    height="${height}"
    opacity="${opacity}"
    preserveAspectRatio="xMidYMid meet"/>`;
}

module.exports = {
  drawLogo
};
