/**
 * DiArt Passport
 * File: passport/components/logo.js
 * Version: 2.0.0
 *
 * Renders the official DiArt emblem from an external URL.
 */

"use strict";

const LOGO_VERSION = "2.0.0";

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function drawLogo({
  href = "",
  x,
  y,
  width,
  height,
  opacity = 1,
  preserveAspectRatio = "xMidYMid meet",
  fallbackText = "DiArt",
  fallbackColor = "#5B2A0C"
}) {
  if (href) {
    return `
<image
  href="${esc(href)}"
  x="${x}"
  y="${y}"
  width="${width}"
  height="${height}"
  opacity="${Math.max(0, Math.min(1, Number(opacity) || 1))}"
  preserveAspectRatio="${esc(preserveAspectRatio)}"/>`;
  }

  return `
<text
  x="${x + width / 2}"
  y="${y + height / 2 + 18}"
  text-anchor="middle"
  font-family="Georgia, 'Times New Roman', serif"
  font-size="${Math.min(width, height) * 0.28}"
  font-weight="700"
  fill="${fallbackColor}">
  ${esc(fallbackText)}
</text>`;
}

module.exports = {
  LOGO_VERSION,
  drawLogo
};
