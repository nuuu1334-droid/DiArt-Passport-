/**
 * DiArt Passport
 * File: passport/components/nearest_seasons_block.js
 * Version: 1.0.0-approved
 *
 * BLOCK 4 — NEAREST SEASONS.
 *
 * Renders exactly:
 * - one rounded panel;
 * - proportional donut chart based on Top-3 scores;
 * - official DiArt logo asset in the center;
 * - official season pin assets in the list;
 * - season names and percentages;
 * - explanatory note.
 *
 * The file does not draw logo or pins.
 */

"use strict";

const NEAREST_SEASONS_BLOCK_VERSION = "2.0.0-approved";

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function arr(value) {
  return Array.isArray(value) ? value : [];
}

function clamp(value, min = 0, max = 100) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
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

function image({
  href,
  x,
  y,
  width,
  height
}) {
  if (!href) return "";

  return `<image href="${esc(href)}" x="${x}" y="${y}"
    width="${width}" height="${height}"
    preserveAspectRatio="xMidYMid meet"/>`;
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

function polar(cx, cy, radius, angleDegrees) {
  const angle = (angleDegrees - 90) * Math.PI / 180;

  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius
  };
}

function donutSegment({
  cx,
  cy,
  outerRadius,
  innerRadius,
  startAngle,
  endAngle,
  fill
}) {
  const startOuter = polar(cx, cy, outerRadius, endAngle);
  const endOuter = polar(cx, cy, outerRadius, startAngle);
  const startInner = polar(cx, cy, innerRadius, startAngle);
  const endInner = polar(cx, cy, innerRadius, endAngle);

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return `<path d="
    M ${startOuter.x} ${startOuter.y}
    A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}
    L ${startInner.x} ${startInner.y}
    A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${endInner.x} ${endInner.y}
    Z"
    fill="${fill}"
    stroke="#FFFDFC"
    stroke-width="1.3"/>`;
}

function normalizeTop3(top3) {
  const rows = arr(top3).slice(0, 3).map((item, index) => ({
    rank: index + 1,
    season_id: item && item.season_id ? String(item.season_id) : "",
    name_ru: item && item.name_ru ? String(item.name_ru) : "",
    score: clamp(item && item.score, 0, 100),
    color: item && item.color ? String(item.color) : "#8A4E25",
    pin_url: item && item.pin_url ? String(item.pin_url) : ""
  }));

  const total = rows.reduce((sum, item) => sum + item.score, 0);

  if (total <= 0) {
    return rows.map(item => ({
      ...item,
      ratio: 1 / Math.max(rows.length, 1)
    }));
  }

  return rows.map(item => ({
    ...item,
    ratio: item.score / total
  }));
}

function buildNearestSeasonsBlock({
  top3,
  logoUrl,
  accentColor = "#8A4E25"
}) {
  const rows = normalizeTop3(top3);

  const panelX = 378;
  const panelY = 542;
  const panelWidth = 374;
  const panelHeight = 292;

  /*
   * Balanced content grid:
   * - equal left and right inner margins: 24 px;
   * - donut column and list column have equal visual width;
   * - donut and three-pin list share the same vertical center;
   * - explanatory text has equal spacing above and below.
   */
  const contentTop = 594;
  const contentBottom = 774;
  const contentCenterY = (contentTop + contentBottom) / 2;

  const donutColumnX = panelX + 24;
  const donutColumnWidth = 164;
  const listColumnX = donutColumnX + donutColumnWidth + 10;
  const listColumnWidth = panelX + panelWidth - 24 - listColumnX;

  const donutCx = donutColumnX + donutColumnWidth / 2;
  const donutCy = contentCenterY;
  const outerRadius = 78;
  const innerRadius = 43;

  const listRowHeight = 58;
  const listTotalHeight = listRowHeight * 3;
  const listStartY = contentCenterY - listTotalHeight / 2;

  let out = `<g id="diart-nearest-seasons-block">`;

  out += `<rect x="${panelX}" y="${panelY}"
    width="${panelWidth}" height="${panelHeight}"
    rx="18" fill="#FFFDFC" stroke="#DCCFC2" stroke-width="1"/>`;

  out += text({
    value: "БЛИЖАЙШИЕ ЦВЕТОТИПЫ",
    x: panelX + panelWidth / 2,
    y: panelY + 32,
    size: 14,
    weight: 700,
    fill: accentColor,
    anchor: "middle",
    tracking: 0.5
  });

  let currentAngle = 0;

  rows.forEach(item => {
    const sweep = item.ratio * 360;
    const endAngle = currentAngle + sweep;

    out += donutSegment({
      cx: donutCx,
      cy: donutCy,
      outerRadius,
      innerRadius,
      startAngle: currentAngle,
      endAngle,
      fill: item.color
    });

    const midAngle = currentAngle + sweep / 2;
    const labelPoint = polar(
      donutCx,
      donutCy,
      (outerRadius + innerRadius) / 2,
      midAngle
    );

    out += text({
      value: `${Math.round(item.score)}%`,
      x: labelPoint.x,
      y: labelPoint.y + 4,
      size: 9.8,
      weight: 700,
      family: "Arial, Helvetica, sans-serif",
      fill: "#FFFFFF",
      anchor: "middle"
    });

    currentAngle = endAngle;
  });

  out += `<circle cx="${donutCx}" cy="${donutCy}"
    r="${innerRadius - 2}" fill="#FFFDFC"/>`;

  out += image({
    href: logoUrl,
    x: donutCx - 31,
    y: donutCy - 20,
    width: 62,
    height: 40
  });

  rows.forEach((item, index) => {
    const rowCenterY = listStartY + listRowHeight * index + listRowHeight / 2;
    const pinSize = 42;
    const pinX = listColumnX;
    const pinY = rowCenterY - pinSize / 2;

    const nameX = pinX + pinSize + 9;
    const percentX = listColumnX + listColumnWidth;
    const nameWidth = percentX - 42 - nameX;
    const maxChars = Math.max(8, Math.floor(nameWidth / 5.7));
    const nameLines = wrapWords(item.name_ru, maxChars).slice(0, 2);
    const nameStartY = rowCenterY - (nameLines.length - 1) * 7.5 + 4;

    out += image({
      href: item.pin_url,
      x: pinX,
      y: pinY,
      width: pinSize,
      height: pinSize
    });

    nameLines.forEach((line, lineIndex) => {
      out += text({
        value: line,
        x: nameX,
        y: nameStartY + lineIndex * 15,
        size: 9.8,
        weight: 600
      });
    });

    out += text({
      value: `${Math.round(item.score)}%`,
      x: percentX,
      y: rowCenterY + 5,
      size: 14,
      weight: 700,
      anchor: "end"
    });
  });

  out += wrappedText({
    value: "Эти цветотипы имеют наиболее близкие характеристики к вашему природному колориту.",
    x: panelX + panelWidth / 2,
    y: 802,
    maxChars: 52,
    maxLines: 2,
    lineHeight: 15,
    size: 9.8,
    fill: "#5F4D42",
    anchor: "middle"
  });

  out += `</g>`;
  return out;
}

module.exports = {
  NEAREST_SEASONS_BLOCK_VERSION,
  normalizeTop3,
  buildNearestSeasonsBlock
};
