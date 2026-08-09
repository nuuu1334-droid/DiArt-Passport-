/**
 * DiArt Passport
 * File: passport/components/natural_palette_block.js
 * Version: 1.0.0-approved
 *
 * BLOCK 3 — NATURAL PALETTE.
 *
 * Renders exactly:
 * - one rounded panel;
 * - three columns: eyes, hair, skin;
 * - circular photo sample or fallback color;
 * - five extracted swatches;
 * - Russian shade name;
 * - HEX value.
 */

"use strict";

const NATURAL_PALETTE_BLOCK_VERSION = "1.0.0-approved";

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

function wrapWords(value, maxChars) {
  const words = String(value || "").trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;

    if (!current || next.length <= maxChars) {
      current = next;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function wrappedText({
  value,
  x,
  y,
  maxChars,
  maxLines,
  lineHeight,
  size,
  weight = 400,
  fill = "#2C1A13",
  anchor = "middle"
}) {
  return wrapWords(value, maxChars)
    .slice(0, maxLines)
    .map((line, index) =>
      text({
        value: line,
        x,
        y: y + index * lineHeight,
        size,
        weight,
        fill,
        anchor
      })
    )
    .join("");
}

function circularSample({
  id,
  href,
  fill,
  cx,
  cy,
  radius,
  accentColor
}) {
  let out = `<defs>
    <clipPath id="${id}">
      <circle cx="${cx}" cy="${cy}" r="${radius}"/>
    </clipPath>
  </defs>`;

  out += `<circle cx="${cx}" cy="${cy}" r="${radius}"
    fill="${fill}"/>`;

  if (href) {
    out += `<image href="${esc(href)}"
      x="${cx - radius}" y="${cy - radius}"
      width="${radius * 2}" height="${radius * 2}"
      preserveAspectRatio="xMidYMid slice"
      clip-path="url(#${id})"/>`;
  }

  out += `<circle cx="${cx}" cy="${cy}" r="${radius}"
    fill="none" stroke="${accentColor}" stroke-width="1.8"/>`;

  return out;
}

function swatches({
  colors,
  fallbackHex,
  centerX,
  y
}) {
  const normalized = arr(colors)
    .map(color => normalizeHex(color, null))
    .filter(Boolean)
    .slice(0, 5);

  const finalColors = normalized.length
    ? normalized
    : [fallbackHex, fallbackHex, fallbackHex, fallbackHex, fallbackHex];

  const radius = 7;
  const gap = 17;
  const totalWidth = gap * (finalColors.length - 1);
  const firstX = centerX - totalWidth / 2;

  return finalColors
    .map((color, index) =>
      `<circle cx="${firstX + index * gap}" cy="${y}" r="${radius}"
        fill="${color}" stroke="#FFFDFC" stroke-width="1"/>`
    )
    .join("");
}

function renderNaturalItem({
  type,
  label,
  centerX,
  sample,
  fallback,
  accentColor
}) {
  const safeSample = obj(sample);
  const safeFallback = obj(fallback);

  const hex = normalizeHex(
    safeSample.hex,
    normalizeHex(safeFallback.hex, "#CCCCCC")
  );

  const name =
    safeSample.name_ru ||
    safeFallback.name_ru ||
    label;

  let out = `<g>`;

  out += text({
    value: label,
    x: centerX,
    y: 600,
    size: 10.5,
    weight: 700,
    anchor: "middle",
    tracking: 0.9
  });

  out += circularSample({
    id: `natural-${type}-clip`,
    href: safeSample.url || "",
    fill: hex,
    cx: centerX,
    cy: 656,
    radius: 43,
    accentColor
  });

  out += swatches({
    colors: safeSample.swatches,
    fallbackHex: hex,
    centerX,
    y: 716
  });

  out += wrappedText({
    value: name,
    x: centerX,
    y: 750,
    maxChars: 15,
    maxLines: 2,
    lineHeight: 16,
    size: 10.5,
    weight: 600,
    anchor: "middle"
  });

  out += text({
    value: `HEX ${hex}`,
    x: centerX,
    y: 796,
    size: 9.2,
    weight: 500,
    anchor: "middle"
  });

  out += `</g>`;
  return out;
}

function buildNaturalPaletteBlock({
  photoSamples = {},
  naturalColors = {},
  accentColor = "#8A4E25"
}) {
  const samples = obj(photoSamples);
  const natural = obj(naturalColors);

  let out = `<g id="diart-natural-palette-block">`;

  out += `<rect x="24" y="542" width="342" height="292"
    rx="18" fill="#FFFDFC" stroke="#DCCFC2" stroke-width="1"/>`;

  out += text({
  value: "ТВОЯ ПРИРОДНАЯ ПАЛИТРА",
  x: 195,
  y: 574,
  size: 14,
  weight: 700,
  fill: accentColor,
  anchor: "middle",
  tracking: 0.5
});

  out += renderNaturalItem({
    type: "eye",
    label: "ГЛАЗА",
    centerX: 82,
    sample: samples.eye,
    fallback: natural.eye,
    accentColor
  });

  out += renderNaturalItem({
    type: "hair",
    label: "ВОЛОСЫ",
    centerX: 195,
    sample: samples.hair,
    fallback: natural.hair,
    accentColor
  });

  out += renderNaturalItem({
    type: "skin",
    label: "КОЖА",
    centerX: 308,
    sample: samples.skin,
    fallback: natural.skin,
    accentColor
  });

  out += `</g>`;
  return out;
}

module.exports = {
  NATURAL_PALETTE_BLOCK_VERSION,
  buildNaturalPaletteBlock
};
