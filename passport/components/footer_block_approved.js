/**
 * DiArt Passport
 * File: passport/components/footer_block_approved.js
 * Version: 4.0.1-herbarium-edge-shift
 *
 * FIRST PAGE — FOOTER.
 * Approved herbarium is NOT redrawn, resized, recolored or re-opacity-adjusted.
 * Only horizontal positioning changes:
 * - left half: 28 px outward
 * - right half: 28 px outward
 */

"use strict";

const FOOTER_BLOCK_VERSION = "4.0.1-herbarium-edge-shift";

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function text({ value, x, y, size, weight = 400,
  family = "Georgia, 'Times New Roman', serif",
  fill = "#2C1A13", anchor = "middle", tracking = 0 }) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}"
    font-family="${family}" font-size="${size}" font-weight="${weight}"
    letter-spacing="${tracking}" fill="${fill}">${esc(value)}</text>`;
}

function image({ href, x, y, width, height, opacity = 1,
  preserveAspectRatio = "xMidYMid meet", clipPath = "" }) {
  if (!href) return "";
  return `<image href="${esc(href)}" x="${x}" y="${y}"
    width="${width}" height="${height}"
    preserveAspectRatio="${preserveAspectRatio}" opacity="${opacity}"${clipPath ? ` clip-path="url(#${clipPath})"` : ""}/>`;
}

function buildFooterBlock({
  seasonId = "",
  ornamentUrl = "",
  logoUrl = "",
  slogan = "Цвет украшает тебя",
  passportId = "",
  accentColor = "#8A4E25"
}) {
  const width = 768;
  const centerX = width / 2;
  const edgeShift = 28;

  let out = `<g id="diart-footer-block" data-season="${esc(seasonId)}">`;

  // Split only for positioning. The same approved 768×220 asset is used twice,
  // at exactly the same size. No scale, opacity or artwork changes.
  out += `<defs>
    <clipPath id="diart-footer-left"><rect x="0" y="-28" width="384" height="220"/></clipPath>
    <clipPath id="diart-footer-right"><rect x="384" y="-28" width="384" height="220"/></clipPath>
  </defs>`;

  // Left herbarium moves toward the left page edge.
  out += image({
    href: ornamentUrl,
    x: -edgeShift,
    y: -28,
    width: 768,
    height: 220,
    opacity: 1,
    preserveAspectRatio: "xMidYMid meet",
    clipPath: "diart-footer-left"
  });

  // Right herbarium moves toward the right page edge.
  out += image({
    href: ornamentUrl,
    x: edgeShift,
    y: -28,
    width: 768,
    height: 220,
    opacity: 1,
    preserveAspectRatio: "xMidYMid meet",
    clipPath: "diart-footer-right"
  });

  // Brand layer is unchanged.
  out += image({ href: logoUrl, x: 294, y: 32, width: 180, height: 76 });

  out += text({
    value: slogan,
    x: centerX,
    y: 141,
    size: 24,
    weight: 600,
    fill: accentColor
  });

  if (passportId) {
    out += text({
      value: passportId,
      x: centerX,
      y: 170,
      size: 10,
      weight: 500,
      family: "Arial, Helvetica, sans-serif",
      fill: accentColor
    });
  }

  out += `</g>`;
  return out;
}

module.exports = { FOOTER_BLOCK_VERSION, buildFooterBlock };
