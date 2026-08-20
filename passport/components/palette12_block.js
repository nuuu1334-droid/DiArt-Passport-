/**
 * DiArt Passport
 * File: passport/components/palette12_block.js
 * Version: 1.0.0
 *
 * PAGE 2 — BLOCK: 12 COLORS OF YOUR PALETTE.
 *
 * Design rules:
 * - visually continues approved Page 1;
 * - same serif typography as approved Page 1;
 * - dynamic season accent/text/line colors are passed from Page 2;
 * - no invented color names;
 * - every color displays English name, Russian name and HEX;
 * - exactly 12 seasonal colors: signature + core + additional.
 */

"use strict";

const PALETTE12_BLOCK_VERSION = "1.0.0";

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

function fitLabel(value, maxChars) {
  const str = String(value || "").trim();
  if (!str) return "—";
  if (str.length <= maxChars) return str;
  return `${str.slice(0, Math.max(1, maxChars - 1)).trim()}…`;
}

function collectMainColors(palette) {
  const safePalette = obj(palette);
  const groups = obj(safePalette.groups);

  const grouped = [
    ...arr(groups.signature),
    ...arr(groups.core),
    ...arr(groups.additional)
  ].filter(Boolean);

  if (grouped.length) {
    return grouped.slice(0, 12);
  }

  return arr(safePalette.colors)
    .filter(color =>
      color &&
      ["signature", "core", "additional"].includes(color.group)
    )
    .slice(0, 12);
}

function renderColorCard({
  color,
  x,
  y,
  width,
  height,
  swatchHeight,
  textColor,
  mutedColor,
  lineColor
}) {
  const safe = obj(color);
  const hex = normalizeHex(safe.hex || safe.canonical_hex);
  const nameEn = safe.name_en || obj(safe.name).en || "—";
  const nameRu = safe.name_ru || obj(safe.name).ru || "—";

  let out = `<g class="diart-palette12-card">`;

  out += `<rect x="${x}" y="${y}" width="${width}" height="${height}"
    rx="12" fill="#FFFDFC" stroke="${lineColor}" stroke-width="1"/>`;

  out += `<path d="M ${x + 12} ${y}
    H ${x + width - 12}
    Q ${x + width} ${y} ${x + width} ${y + 12}
    V ${y + swatchHeight}
    H ${x}
    V ${y + 12}
    Q ${x} ${y} ${x + 12} ${y} Z"
    fill="${hex}"/>`;

  out += text({
    value: fitLabel(nameEn, 16),
    x: x + width / 2,
    y: y + swatchHeight + 24,
    size: 10.2,
    weight: 700,
    fill: textColor,
    anchor: "middle"
  });

  out += text({
    value: fitLabel(nameRu, 18),
    x: x + width / 2,
    y: y + swatchHeight + 42,
    size: 9.4,
    weight: 500,
    fill: textColor,
    anchor: "middle"
  });

  out += text({
    value: hex,
    x: x + width / 2,
    y: y + height - 13,
    size: 8.7,
    weight: 500,
    family: "Arial, Helvetica, sans-serif",
    fill: mutedColor,
    anchor: "middle",
    tracking: 0.15
  });

  out += `</g>`;
  return out;
}

function buildPalette12Block({
  palette,

  x = 24,
  y = 86,
  width = 720,
  height = 382,

  accentColor = "#8A4E25",
  textColor = "#2C1A13",
  mutedColor = "#6F5544",
  lineColor = "#DCCFC2",
  panelColor = "#FFFDFC"
}) {
  const colors = collectMainColors(palette);

  const columns = 6;
  const rows = 2;

  const innerX = x + 16;
  const gridY = y + 58;
  const gapX = 9;
  const gapY = 16;

  const cardWidth = (width - 32 - gapX * (columns - 1)) / columns;
  const cardHeight = 137;
  const swatchHeight = 70;

  let out = `<g id="diart-palette12-block">`;

  out += `<rect x="${x}" y="${y}" width="${width}" height="${height}"
    rx="18" fill="${panelColor}" stroke="${lineColor}" stroke-width="1"/>`;

  out += text({
    value: "12 ЦВЕТОВ ТВОЕЙ ПАЛИТРЫ",
    x: x + width / 2,
    y: y + 34,
    size: 14,
    weight: 700,
    fill: accentColor,
    anchor: "middle",
    tracking: 0.55
  });

  for (let index = 0; index < 12; index += 1) {
    const color = colors[index] || {};
    const row = Math.floor(index / columns);
    const column = index % columns;

    const cardX = innerX + column * (cardWidth + gapX);
    const cardY = gridY + row * (cardHeight + gapY);

    out += renderColorCard({
      color,
      x: cardX,
      y: cardY,
      width: cardWidth,
      height: cardHeight,
      swatchHeight,
      textColor,
      mutedColor,
      lineColor
    });
  }

  out += `</g>`;
  return out;
}

module.exports = {
  PALETTE12_BLOCK_VERSION,
  buildPalette12Block
};
