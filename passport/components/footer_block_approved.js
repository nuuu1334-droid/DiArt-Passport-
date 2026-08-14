/**
 * DiArt Passport
 * File: passport/components/footer_block.js
 * Version: 4.0.0-abstract-fullwidth-svg
 *
 * FIRST PAGE — FOOTER.
 * Uses one season-specific abstract SVG ornament across the full page width.
 * Canvas standard of the ornament asset: 768 × 220, transparent background.
 */

"use strict";

const FOOTER_BLOCK_VERSION = "4.0.1-herbarium-edge-alignment";

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
  preserveAspectRatio = "xMidYMid meet" }) {
  if (!href) return "";
  return `<image href="${esc(href)}" x="${x}" y="${y}"
    width="${width}" height="${height}"
    preserveAspectRatio="${preserveAspectRatio}" opacity="${opacity}"/>`;
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

  let out = `<g id="diart-footer-block" data-season="${esc(seasonId)}">`;

  // One approved abstract ornament, full width. The Page 1 assembly translates
  // this component to y=942, so y=-28 maps the 220 px asset exactly to
  // page y=914..1134 (the bottom edge of the 1134 px page).
  // Ornament is intentionally widened beyond the page edges.
  // This moves both herbarium corners outward, closer to the same
  // left/right alignment used by the passport blocks, without changing
  // the approved artwork itself.
  out += image({
    href: ornamentUrl,
    x: -48,
    y: -28,
    width: 864,
    height: 220,
    opacity: 1,
    preserveAspectRatio: "xMidYMid meet"
  });

  // Brand layer stays above the ornament. The approved artwork is intentionally
  // light in the center so logo / slogan / ID remain readable.
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
