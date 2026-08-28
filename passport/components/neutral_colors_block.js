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

const NEUTRAL_COLORS_BLOCK_VERSION = "1.1.0-wrap-names";

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

function wrapWords(value, maxChars = 12, maxLines = 2) {
  const str = String(value || "").trim();
  if (!str) return ["—"];

  const words = str.split(/\s+/).filter(Boolean);
  if (!words.length) return ["—"];

  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;

    if (candidate.length <= maxChars || !current) {
      current = candidate;
      continue;
    }

    lines.push(current);
    current = word;

    if (lines.length >= maxLines - 1) break;
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  return lines.slice(0, maxLines);
}

function multilineText({
  lines,
  x,
  y,
  lineHeight,
  size,
  weight = 400,
  family = "Georgia, 'Times New Roman', serif",
  fill = "#2C1A13",
  anchor = "middle"
}) {
  const safeLines = Array.isArray(lines) && lines.length ? lines : ["—"];

  return `<text x="${x}" y="${y}" text-anchor="${anchor}"
    font-family="${family}" font-size="${size}" font-weight="${weight}"
    fill="${fill}">${safeLines.map((line, index) =>
      `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${esc(line)}</tspan>`
    ).join("")}</text>`;
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

    const enLines = wrapWords(nameEn, 10, 2);
    const ruLines = wrapWords(nameRu, 11, 2);

    out += multilineText({
      lines: enLines,
      x: sx + swatchWidth / 2,
      y: swatchY + swatchHeight + 18,
      lineHeight: 9,
      size: 7.4,
      weight: 700,
      fill: textColor,
      anchor: "middle"
    });

    out += multilineText({
      lines: ruLines,
      x: sx + swatchWidth / 2,
      y: swatchY + swatchHeight + 40,
      lineHeight: 8.5,
      size: 6.8,
      weight: 500,
      fill: textColor,
      anchor: "middle"
    });

    out += text({
      value: hex,
      x: sx + swatchWidth / 2,
      y: y + height - 9,
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
