/**
 * DiArt Passport
 * File: passport/components/palette_usage_block.js
 * Version: 1.0.0
 *
 * PAGE 2 — BLOCK: "КАК НОСИТЬ СВОИ ЦВЕТА"
 *
 * Four fixed recommendations:
 * 1. БАЗА
 * 2. ОСНОВНАЯ ПАЛИТРА
 * 3. АКЦЕНТЫ
 * 4. СОЧЕТАНИЯ
 *
 * Icons are inline SVG and dynamically use accentColor.
 * No external icon assets are required.
 */

"use strict";

const PALETTE_USAGE_BLOCK_VERSION = "1.0.0";

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function text({
  value, x, y, size, weight = 400,
  family = "Georgia, 'Times New Roman', serif",
  fill = "#2C1A13", anchor = "start", tracking = 0
}) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}"
    font-family="${family}" font-size="${size}" font-weight="${weight}"
    letter-spacing="${tracking}" fill="${fill}">${esc(value)}</text>`;
}

function linesText({
  lines, x, y, lineHeight, size, weight = 400,
  family = "Georgia, 'Times New Roman', serif",
  fill = "#2C1A13", anchor = "middle"
}) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}"
    font-family="${family}" font-size="${size}" font-weight="${weight}"
    fill="${fill}">${lines.map((line, index) =>
      `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${esc(line)}</tspan>`
    ).join("")}</text>`;
}

function iconBase(cx, cy, color) {
  return `
  <g transform="translate(${cx - 27} ${cy - 27})"
     fill="none" stroke="${color}" stroke-width="1.8"
     stroke-linecap="round" stroke-linejoin="round">
    <rect x="7" y="10" width="40" height="35" rx="3"/>
    <line x1="7" y1="18" x2="47" y2="18"/>
    <path d="M19 18v-3c0-4 6-4 6 0v3"/>
    <path d="M29 18v-3c0-4 6-4 6 0v3"/>
    <path d="M17 24h10l-2 15h-6z"/>
    <path d="M31 24h8l2 15h-12z"/>
    <line x1="15" y1="49" x2="39" y2="49"/>
  </g>`;
}

function iconMain(cx, cy, color) {
  return `
  <g transform="translate(${cx - 27} ${cy - 27})"
     fill="none" stroke="${color}" stroke-width="1.8"
     stroke-linecap="round" stroke-linejoin="round">
    <path d="M27 9c7 0 11 5 11 11v8c0 6-4 10-11 10s-11-4-11-10v-8c0-6 4-11 11-11z"/>
    <path d="M17 21c2-8 8-10 10-10s8 2 10 10"/>
    <path d="M11 47c2-9 8-13 16-13s14 4 16 13"/>
    <path d="M15 43c5-3 10-5 12-8 3 3 8 5 13 8"/>
  </g>`;
}

function iconAccent(cx, cy, color) {
  return `
  <g transform="translate(${cx - 27} ${cy - 27})"
     fill="none" stroke="${color}" stroke-width="1.8"
     stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="27" width="27" height="18" rx="3"/>
    <path d="M9 31l13.5 8L36 31"/>
    <path d="M14 27c1-7 16-7 17 0"/>
    <ellipse cx="41" cy="17" rx="4" ry="7"/>
    <ellipse cx="48" cy="17" rx="4" ry="7"/>
    <path d="M38 40c5-7 9-10 12-13"/>
    <path d="M42 42c4-5 7-8 10-10"/>
  </g>`;
}

function iconCombine(cx, cy, color) {
  return `
  <g transform="translate(${cx - 27} ${cy - 27})">
    <circle cx="21" cy="26" r="12" fill="${color}" fill-opacity="0.10"
      stroke="${color}" stroke-width="1.8"/>
    <circle cx="34" cy="18" r="12" fill="${color}" fill-opacity="0.15"
      stroke="${color}" stroke-width="1.8"/>
    <circle cx="38" cy="32" r="12" fill="${color}" fill-opacity="0.07"
      stroke="${color}" stroke-width="1.8"/>
  </g>`;
}

function buildPaletteUsageBlock({
  x = 24,
  y = 708,
  width = 720,
  height = 190,
  accentColor = "#8A4E25",
  textColor = "#2C1A13",
  mutedColor = "#6F5544",
  lineColor = "#DCCFC2",
  panelColor = "#FFFDFC"
}) {
  const items = [
    {
      title: ["БАЗА"],
      body: ["Нейтральные оттенки —", "для крупных вещей", "и основы гардероба."],
      icon: iconBase
    },
    {
      title: ["ОСНОВНАЯ", "ПАЛИТРА"],
      body: ["Цвета основной палитры —", "для одежды у лица", "и главных элементов."],
      icon: iconMain
    },
    {
      title: ["АКЦЕНТЫ"],
      body: ["Акцентные оттенки —", "для аксессуаров, деталей", "и цветовых пятен."],
      icon: iconAccent
    },
    {
      title: ["СОЧЕТАНИЯ"],
      body: ["Сочетай оттенки палитры", "в гармоничных пропорциях", "и нужном контрасте."],
      icon: iconCombine
    }
  ];

  const padding = 18;
  const gap = 10;
  const cardW = (width - padding * 2 - gap * 3) / 4;
  const cardH = 134;
  const cardY = y + 43;

  let out = `<g id="diart-palette-usage-block">`;

  out += `<rect x="${x}" y="${y}" width="${width}" height="${height}"
    rx="18" fill="${panelColor}" stroke="${lineColor}" stroke-width="1"/>`;

  out += text({
    value: "КАК НОСИТЬ СВОИ ЦВЕТА",
    x: x + width / 2,
    y: y + 28,
    size: 14,
    weight: 700,
    fill: accentColor,
    anchor: "middle",
    tracking: 0.45
  });

  items.forEach((item, i) => {
    const cardX = x + padding + i * (cardW + gap);
    const centerX = cardX + cardW / 2;

    out += `<rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}"
      rx="14" fill="#FFFFFF" fill-opacity="0.42"
      stroke="${accentColor}" stroke-opacity="0.12" stroke-width="0.8"/>`;

    out += item.icon(centerX, cardY + 35, accentColor);

    const titleY = cardY + 72;
    out += linesText({
      lines: item.title,
      x: centerX,
      y: titleY,
      lineHeight: 10,
      size: 8.6,
      weight: 700,
      fill: accentColor
    });

    const bodyY = item.title.length === 2 ? cardY + 99 : cardY + 91;
    out += linesText({
      lines: item.body,
      x: centerX,
      y: bodyY,
      lineHeight: 10.5,
      size: 7.3,
      weight: 400,
      fill: textColor
    });
  });

  out += `</g>`;
  return out;
}

module.exports = {
  PALETTE_USAGE_BLOCK_VERSION,
  buildPaletteUsageBlock
};
