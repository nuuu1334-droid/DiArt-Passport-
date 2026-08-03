/**
 * DiArt Passport
 * File: passport/components/footer.js
 * Version: 1.0.0
 *
 * Draws the approved DiArt footer:
 * - divider
 * - official logo
 * - slogan
 * - service information
 */

"use strict";

function escapeXml(value) {
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
  logoUrl,
  logoX,
  logoY,
  logoWidth,
  logoHeight,
  slogan = "Цвет украшает тебя ✨",
  sloganY,
  dividerColor = "#D9CEC2",
  textColor = "#6F6259",
  accentColor = "#8B5E3C",
  serviceInfo = null
}) {
  const dividerY = y + 2;

  const logo = logoUrl
    ? `
<image
  href="${escapeXml(logoUrl)}"
  x="${logoX}"
  y="${logoY}"
  width="${logoWidth}"
  height="${logoHeight}"
  preserveAspectRatio="xMidYMid meet"/>`
    : "";

  const service = serviceInfo
    ? `
<text
  x="${x}"
  y="${y + height - 18}"
  font-family="Arial, Helvetica, sans-serif"
  font-size="18"
  font-weight="400"
  fill="${textColor}">
  ${escapeXml(serviceInfo)}
</text>`
    : "";

  return `
<g id="diart-footer">
  <line
    x1="${x}"
    y1="${dividerY}"
    x2="${x + width}"
    y2="${dividerY}"
    stroke="${dividerColor}"
    stroke-width="1.5"/>

  ${logo}

  <text
    x="${x + width / 2}"
    y="${sloganY}"
    text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="28"
    font-weight="600"
    fill="${accentColor}">
    ${escapeXml(slogan)}
  </text>

  ${service}
</g>`;
}

module.exports = {
  footer
};
