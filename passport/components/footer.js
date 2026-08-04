/**
 * DiArt Passport
 * File: passport/components/footer.js
 * Version: 2.0.0
 *
 * Renders the approved DiArt Signature footer:
 * - divider
 * - official emblem
 * - slogan
 * - optional service line
 */

"use strict";

const FOOTER_VERSION = "2.0.0";

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function footer({
  x,
  y,
  width,
  height,
  logoUrl = "",
  logoX,
  logoY,
  logoWidth,
  logoHeight,
  slogan = "Цвет украшает тебя",
  sloganY,
  dividerColor = "#D9CEC2",
  textColor = "#6F6259",
  accentColor = "#8B5E3C",
  serviceInfo = "",
  serviceY = null
}) {
  const centerX = x + width / 2;
  const dividerY = y + 2;
  const finalServiceY = serviceY ?? (y + height - 18);

  let out = `
<g id="diart-signature-footer">
  <line
    x1="${x}"
    y1="${dividerY}"
    x2="${x + width}"
    y2="${dividerY}"
    stroke="${dividerColor}"
    stroke-width="1.5"/>`;

  if (logoUrl) {
    out += `
  <image
    href="${esc(logoUrl)}"
    x="${logoX}"
    y="${logoY}"
    width="${logoWidth}"
    height="${logoHeight}"
    preserveAspectRatio="xMidYMid meet"/>`;
  }

  out += `
  <text
    x="${centerX}"
    y="${sloganY}"
    text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="28"
    font-weight="600"
    letter-spacing="0.5"
    fill="${accentColor}">
    ${esc(slogan)}
  </text>

  <text
    x="${centerX + 156}"
    y="${sloganY - 8}"
    text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="22"
    fill="${accentColor}">
    ✦
  </text>

  <text
    x="${centerX + 184}"
    y="${sloganY + 6}"
    text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="14"
    fill="${accentColor}"
    fill-opacity="0.75">
    ✦
  </text>`;

  if (serviceInfo) {
    out += `
  <text
    x="${x}"
    y="${finalServiceY}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="18"
    font-weight="400"
    fill="${textColor}">
    ${esc(serviceInfo)}
  </text>`;
  }

  out += `
</g>`;

  return out;
}

module.exports = {
  FOOTER_VERSION,
  footer
};
