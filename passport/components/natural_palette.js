/**
 * DiArt Passport
 * File: passport/components/natural_palette.js
 * Version: 2.0.0
 *
 * Draws the approved Natural Palette block:
 * - eye
 * - hair
 * - skin
 * - real circular crops
 * - 5–6 extracted swatches
 * - Russian shade name
 * - main HEX
 */

"use strict";

const {
  eyeSample,
  hairSample,
  skinSample
} = require("./photo");

const NATURAL_PALETTE_VERSION = "2.0.0";

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
  family = "Arial, Helvetica, sans-serif",
  fill = "#241912",
  anchor = "start",
  tracking = 0
}) {
  return `
<text
  x="${x}"
  y="${y}"
  text-anchor="${anchor}"
  font-family="${family}"
  font-size="${size}"
  font-weight="${weight}"
  letter-spacing="${tracking}"
  fill="${fill}">
  ${esc(value)}
</text>`;
}

function wrapWords(value, maxChars) {
  const words = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;

    if (!current || candidate.length <= maxChars) {
      current = candidate;
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
  maxChars = 18,
  maxLines = 2,
  lineHeight = 24,
  size = 19,
  weight = 600,
  fill = "#241912",
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

function buildSwatches({
  colors,
  fallbackHex,
  centerX,
  y,
  size = 24,
  gap = 8,
  radius = 6
}) {
  const source = arr(colors)
    .map(color => normalizeHex(color, null))
    .filter(Boolean)
    .slice(0, 6);

  const finalColors = source.length
    ? source
    : [
        fallbackHex,
        fallbackHex,
        fallbackHex,
        fallbackHex,
        fallbackHex
      ];

  const count = finalColors.length;
  const totalWidth = count * size + (count - 1) * gap;
  const startX = centerX - totalWidth / 2;

  return finalColors
    .map((color, index) => `
<rect
  x="${startX + index * (size + gap)}"
  y="${y}"
  width="${size}"
  height="${size}"
  rx="${radius}"
  fill="${color}"
  stroke="#FFFFFF"
  stroke-width="1.5"/>`)
    .join("");
}

function sampleRenderer(type) {
  if (type === "eye") return eyeSample;
  if (type === "hair") return hairSample;
  if (type === "skin") return skinSample;

  throw new Error(`Natural Palette: unknown sample type "${type}".`);
}

function renderNaturalSample({
  type,
  label,
  sample,
  fallback,
  x,
  y,
  width,
  cropSize = 154,
  accentColor = "#5B2A0C",
  textColor = "#241912",
  mutedColor = "#71645B"
}) {
  sample = obj(sample);
  fallback = obj(fallback);

  const centerX = x + width / 2;
  const cropX = centerX - cropSize / 2;
  const cropY = y + 34;
  const hex = normalizeHex(sample.hex, normalizeHex(fallback.hex));
  const name = sample.name_ru || fallback.name_ru || label;
  const href = sample.url || "";
  const region = obj(sample.region);
  const renderSample = sampleRenderer(type);

  let out = "";

  out += text({
    value: label,
    x: centerX,
    y: y,
    size: 20,
    weight: 700,
    tracking: 1.8,
    fill: mutedColor,
    anchor: "middle"
  });

  out += renderSample({
    href,
    x: cropX,
    y: cropY,
    size: cropSize,
    region: Object.keys(region).length ? region : null,
    fill: hex,
    borderColor: accentColor,
    borderWidth: 4,
    shadow: false
  });

  out += buildSwatches({
    colors: sample.swatches,
    fallbackHex: hex,
    centerX,
    y: cropY + cropSize + 24
  });

  out += wrappedText({
    value: name,
    x: centerX,
    y: cropY + cropSize + 86,
    maxChars: 20,
    maxLines: 2,
    lineHeight: 24,
    size: 19,
    weight: 600,
    fill: textColor
  });

  out += text({
    value: hex,
    x: centerX,
    y: cropY + cropSize + 144,
    size: 18,
    weight: 600,
    tracking: 1,
    fill: mutedColor,
    anchor: "middle"
  });

  return out;
}

function naturalPalette({
  eye,
  hair,
  skin,
  naturalColors,
  columns,
  y,
  accentColor = "#5B2A0C",
  textColor = "#241912",
  mutedColor = "#71645B"
}) {
  const natural = obj(naturalColors);
  const cols = arr(columns);

  if (cols.length < 3) {
    throw new Error(
      "Natural Palette: columns must contain three layout columns."
    );
  }

  let out = "";

  out += renderNaturalSample({
    type: "eye",
    label: "ГЛАЗА",
    sample: eye,
    fallback: natural.eye,
    x: cols[0].x,
    y,
    width: cols[0].width,
    accentColor,
    textColor,
    mutedColor
  });

  out += renderNaturalSample({
    type: "hair",
    label: "ВОЛОСЫ",
    sample: hair,
    fallback: natural.hair,
    x: cols[1].x,
    y,
    width: cols[1].width,
    accentColor,
    textColor,
    mutedColor
  });

  out += renderNaturalSample({
    type: "skin",
    label: "КОЖА",
    sample: skin,
    fallback: natural.skin,
    x: cols[2].x,
    y,
    width: cols[2].width,
    accentColor,
    textColor,
    mutedColor
  });

  return out;
}

module.exports = {
  NATURAL_PALETTE_VERSION,
  renderNaturalSample,
  naturalPalette
};
