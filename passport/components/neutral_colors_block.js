/**
 * DiArt Passport
 * File: passport/components/neutral_colors_block.js
 * Version: 1.0.0
 *
 * PAGE 2 — BLOCK: NEUTRAL COLORS.
 *
 * Rules:
 * - exactly 6 colors from palette.groups.neutral;
 * - English name + Russian name + HEX;
 * - typography and panel language continue approved Page 1 / palette12 block;
 * - all season-dependent colors are passed from Page 2;
 * - no invented color names.
 */

"use strict";

const NEUTRAL_COLORS_BLOCK_VERSION = "1.0.0";

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function obj(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function arr(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeHex(value, fallback = "#CCCCCC") {
  if (typeof value !== "string") return fallback;
  const hex = value.trim().toUpperCase();
  if (/^#[0-9A-F]{6}$/.test(hex)) return hex;
  if (/^[0-9A-F]{6}$/.test(hex)) return `#${hex}`;
  return fallback;
}

function text({
  value,
  x,
  y,
  size,
  weight = 400,
  family = "Georgia, 'Times New Roman', serif",
  fill = "#2C1A13",
  anchor = "start",
  tracking = 0
}) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}"
    font-family="${family}" font-size="${size}" font-weight="${weight}"
    letter-spacing="${tracking}" fill="${fill}">${esc(value)}</text>`;
}

function fit(value, maxChars) {
  const str = String(value || "").trim();
  if (!str) return "—";
  if (str.length <= maxChars) return str;
  return `${str.slice(0, Math.max(1, maxChars - 1)).trim()}…`;
}

function collectNeutralColors(palette) {
  const safePalette = obj(palette);
  const groups = obj(safePalette.groups);

  if (arr(groups.neutral).length) {
    return arr(groups.neutral).slice(0, 6);
  }

  return arr(safePalette.colors)
    .filter(color => color && color.group === "neutral")
    .slice(0, 6);
}

function buildNeutralColorsBlock({
  palette,

  x = 24,
  y = 500,
  width = 350,
  height = 188,

  accentColor = "#8A4E25",
  textColor = "#2C1A13",
  mutedColor = "#6F5544",
  lineColor = "#DCCFC2",
  panelColor = "#FFFDFC"
}) {
  const colors = collectNeutralColors(palette);

  const innerX = x + 16;
  const swatchY = y + 57;
  const gap = 8;
  const swatchWidth = (width - 32 - gap * 5) / 6;
  const swatchHeight = 61;

  let out = `<g id="diart-neutral-colors-block">`;

  out += `<rect x="${x}" y="${y}" width="${width}" height="${height}"
    rx="18" fill="${panelColor}" stroke="${lineColor}" stroke-width="1"/>`;

  out += text({
    value: "НЕЙТРАЛЬНЫЕ ЦВЕТА",
    x: x + width / 2,
    y: y + 34,
    size: 14,
    weight: 700,
    fill: accentColor,
    anchor: "middle",
    tracking: 0.45
  });

  for (let i = 0; i < 6; i += 1) {
    const color = obj(colors[i]);
    const hex = normalizeHex(color.hex || color.canonical_hex);
    const nameEn = color.name_en || obj(color.name).en || "—";
    const nameRu = color.name_ru || obj(color.name).ru || "—";

    const sx = innerX + i * (swatchWidth + gap);

    out += `<rect x="${sx}" y="${swatchY}" width="${swatchWidth}" height="${swatchHeight}"
      rx="8" fill="${hex}" stroke="${lineColor}" stroke-width="0.8"/>`;

    out += text({
      value: fit(nameEn, 11),
      x: sx + swatchWidth / 2,
      y: swatchY + swatchHeight + 20,
      size: 7.7,
      weight: 700,
      fill: textColor,
      anchor: "middle"
    });

    out += text({
      value: fit(nameRu, 12),
      x: sx + swatchWidth / 2,
      y: swatchY + swatchHeight + 35,
      size: 7.1,
      weight: 500,
      fill: textColor,
      anchor: "middle"
    });

    out += text({
      value: hex,
      x: sx + swatchWidth / 2,
      y: y + height - 13,
      size: 6.7,
      weight: 500,
      family: "Arial, Helvetica, sans-serif",
      fill: mutedColor,
      anchor: "middle"
    });
  }

  out += `</g>`;
  return out;
}

module.exports = {
  NEUTRAL_COLORS_BLOCK_VERSION,
  buildNeutralColorsBlock
};
