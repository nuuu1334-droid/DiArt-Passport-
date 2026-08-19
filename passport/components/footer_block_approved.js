/**
 * DiArt Passport
 * File: passport/components/footer_block_approved.js
 * Version: 5.0.0-corner-png-mirror
 *
 * FIRST PAGE — FOOTER.
 * One season-specific corner PNG is rendered on the left.
 * The right corner is the exact horizontal mirror of the same PNG.
 * Asset opacity is not modified by Builder.
 */

"use strict";

const FOOTER_BLOCK_VERSION = "5.0.1-corner-png-safe-clip";

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

function image({ href, x, y, width, height, transform = "" }) {
  if (!href) return "";
  return `<image href="${esc(href)}" x="${x}" y="${y}"
    width="${width}" height="${height}"
    preserveAspectRatio="xMidYMid meet"
    ${transform ? `transform="${transform}"` : ""}/>`;
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
  const footerX = -28;
  const ornamentWidth = 330;
  const ornamentHeight = 150;
  const ornamentY = 42;

  let out = `<g id="diart-footer-block" data-season="${esc(seasonId)}">`;

  // SAFE ORNAMENT ZONE.
  // Geometry stays exactly as in the approved working footer.
  // The clip only prevents any season PNG from escaping the footer bounds.
  // PAGE_1 footer horizontal bounds: x=28..752.
  out += `<defs>
    <clipPath id="diart-footer-ornament-safe">
      <rect x="28" y="${ornamentY}" width="724" height="${ornamentHeight}"/>
    </clipPath>
  </defs>`;

  out += `<g clip-path="url(#diart-footer-ornament-safe)">`;

  out += image({
    href: ornamentUrl,
    x: footerX,
    y: ornamentY,
    width: ornamentWidth,
    height: ornamentHeight
  });

  out += image({
    href: ornamentUrl,
    x: footerX,
    y: ornamentY,
    width: ornamentWidth,
    height: ornamentHeight,
    transform: "translate(768 0) scale(-1 1)"
  });

  out += `</g>`;

  // Brand layer stays outside the clip and therefore is never cut.
  out += image({ href: logoUrl, x: 294, y: 32, width: 180, height: 76 });

  out += text({
    value: slogan, x: centerX, y: 141, size: 24,
    weight: 600, fill: accentColor
  });

  if (passportId) {
    out += text({
      value: passportId, x: centerX, y: 170, size: 10,
      weight: 500, family: "Arial, Helvetica, sans-serif",
      fill: accentColor
    });
  }

  out += `</g>`;
  return out;
}

module.exports = { FOOTER_BLOCK_VERSION, buildFooterBlock };
