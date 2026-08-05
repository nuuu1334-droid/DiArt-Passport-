/**
 * DiArt Passport
 * File: passport/components/footer_block.js
 * Version: 3.0.0-approved
 *
 * FIRST PAGE — FOOTER
 *
 * Assets:
 * - official DiArt logo from assets.logo
 * - official four-ray star from assets.footer_star
 *
 * This file draws no logo and no decorative symbol.
 */

"use strict";

const FOOTER_BLOCK_VERSION = "3.0.0-approved";

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function text({
  value,
  x,
  y,
  size,
  weight = 400,
  family = "Georgia, 'Times New Roman', serif",
  fill = "#2C1A13",
  anchor = "middle",
  tracking = 0
}) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}"
    font-family="${family}" font-size="${size}" font-weight="${weight}"
    letter-spacing="${tracking}" fill="${fill}">${esc(value)}</text>`;
}

function image({
  href,
  x,
  y,
  width,
  height,
  transform = ""
}) {
  if (!href) return "";

  return `<image href="${esc(href)}"
    x="${x}" y="${y}"
    width="${width}" height="${height}"
    preserveAspectRatio="xMidYMid meet"
    ${transform ? `transform="${transform}"` : ""}/>`;
}

function buildFooterBlock({
  logoUrl = "",
  starUrl = "",
  slogan = "Цвет украшает тебя",
  passportId = "",
  accentColor = "#8A4E25"
}) {
  const width = 768;
  const centerX = width / 2;

  let out = `<g id="diart-footer-block">`;

  out += `<line x1="24" y1="18" x2="744" y2="18"
    stroke="${accentColor}" stroke-opacity="0.18" stroke-width="1"/>`;

  out += image({
    href: logoUrl,
    x: 294,
    y: 32,
    width: 180,
    height: 76
  });

  out += image({
    href: starUrl,
    x: 228,
    y: 118,
    width: 30,
    height: 30
  });

  out += image({
    href: starUrl,
    x: 510,
    y: 118,
    width: 30,
    height: 30,
    transform: "rotate(180 525 133)"
  });

  out += text({
    value: slogan,
    x: centerX,
    y: 141,
    size: 24,
    weight: 600,
    fill: accentColor,
    tracking: 0
  });

  if (passportId) {
    out += text({
      value: passportId,
      x: centerX,
      y: 170,
      size: 10,
      weight: 500,
      family: "Arial, Helvetica, sans-serif",
      fill: "#7B6758"
    });
  }

  out += `</g>`;
  return out;
}

module.exports = {
  FOOTER_BLOCK_VERSION,
  buildFooterBlock
};
