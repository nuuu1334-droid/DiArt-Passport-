/**
 * DiArt Passport
 * File: passport/components/header.js
 * Version: 3.0.0-approved
 *
 * BLOCK 1 — HEADER.
 *
 * Renders exactly:
 * - official transparent DiArt logo asset;
 * - dynamic season title and description;
 * - premium confidence card;
 * - five vector stars;
 * - full-width confidence badge.
 */

"use strict";

const HEADER_VERSION = "3.0.0-approved";

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function titleSize(value) {
  const length = String(value || "").trim().length;
  if (length <= 13) return 40;
  if (length <= 16) return 36;
  if (length <= 19) return 32;
  return 28;
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

function confidenceText(percent, providedLabel) {
  if (providedLabel && String(providedLabel).trim()) {
    return String(providedLabel).trim().toUpperCase();
  }

  if (percent >= 90) return "ОЧЕНЬ ВЫСОКАЯ ДОСТОВЕРНОСТЬ";
  if (percent >= 75) return "ВЫСОКАЯ ДОСТОВЕРНОСТЬ";
  if (percent >= 60) return "ВЕРОЯТНОЕ СОВПАДЕНИЕ";
  return "ПРЕДВАРИТЕЛЬНЫЙ РЕЗУЛЬТАТ";
}

function starPath(cx, cy, outerRadius, innerRadius) {
  const points = [];

  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + i * Math.PI / 5;

    points.push(
      `${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`
    );
  }

  return `<polygon points="${points.join(" ")}"/>`;
}

function fiveStars({
  centerX,
  centerY,
  starOuterRadius,
  starInnerRadius,
  gap,
  fill
}) {
  const totalWidth = starOuterRadius * 2 * 5 + gap * 4;
  const firstX = centerX - totalWidth / 2 + starOuterRadius;

  let out = `<g fill="${fill}">`;

  for (let index = 0; index < 5; index += 1) {
    const cx = firstX + index * (starOuterRadius * 2 + gap);
    out += starPath(cx, centerY, starOuterRadius, starInnerRadius);
  }

  out += `</g>`;
  return out;
}

function buildConfidenceCard({
  x,
  y,
  width,
  height,
  percent,
  label,
  accentColor
}) {
  const safePercent = Math.round(clamp(percent, 0, 100));
  const cx = x + width / 2;

  let out = `<g id="diart-confidence-card">`;

  out += `<rect x="${x}" y="${y}" width="${width}" height="${height}"
    rx="18" fill="#FFFDFC" stroke="#D8B68B" stroke-width="1.4"/>`;

  out += `<line x1="${x + 18}" y1="${y + 38}"
    x2="${x + width - 18}" y2="${y + 38}"
    stroke="#E7D6C2" stroke-width="1"/>`;

  out += text({
    value: "ДОСТОВЕРНОСТЬ",
    x: cx,
    y: y + 22,
    size: 8.8,
    weight: 700,
    family: "Arial, Helvetica, sans-serif",
    fill: "#6F5544",
    anchor: "middle",
    tracking: 1
  });

  out += text({
    value: "АНАЛИЗА",
    x: cx,
    y: y + 34,
    size: 8.8,
    weight: 700,
    family: "Arial, Helvetica, sans-serif",
    fill: "#6F5544",
    anchor: "middle",
    tracking: 1
  });

  out += text({
    value: `${safePercent}%`,
    x: cx,
    y: y + 91,
    size: 50,
    weight: 700,
    fill: "#2C1A13",
    anchor: "middle"
  });

  out += fiveStars({
    centerX: cx,
    centerY: y + 117,
    starOuterRadius: 6.4,
    starInnerRadius: 2.9,
    gap: 5.2,
    fill: "#C58C3A"
  });

  out += `<rect x="${x + 7}" y="${y + 132}"
    width="${width - 14}" height="27" rx="13.5"
    fill="#F6E8D8" stroke="#D8B68B" stroke-width="0.8"/>`;

  out += text({
    value: confidenceText(safePercent, label),
    x: cx,
    y: y + 150,
    size: 6.7,
    weight: 700,
    family: "Arial, Helvetica, sans-serif",
    fill: accentColor,
    anchor: "middle",
    tracking: 0.15
  });

  out += `</g>`;
  return out;
}

function buildHeader({
  logoUrl,
  season,
  confidence,
  accentColor = "#8A4E25"
}) {
  const safeSeason = season && typeof season === "object" ? season : {};
  const safeConfidence =
    confidence && typeof confidence === "object" ? confidence : {};

  const nameRu = safeSeason.name_ru || "";
  const nameEn = safeSeason.name_en || "";
  const description = safeSeason.description_ru || "";

  let out = `<g id="diart-header">`;

  out += `<image href="${esc(logoUrl)}" x="24" y="13"
    width="222" height="164" preserveAspectRatio="xMidYMid meet"/>`;

  const centerX = 432;

  out += text({
    value: "ТВОЙ ЦВЕТОТИП",
    x: centerX,
    y: 43,
    size: 14,
    weight: 700,
    fill: "#2C1A13",
    anchor: "middle",
    tracking: 0.9
  });

  out += text({
    value: nameRu,
    x: centerX,
    y: 91,
    size: titleSize(nameRu),
    weight: 700,
    fill: "#2C1A13",
    anchor: "middle"
  });

  out += text({
    value: nameEn,
    x: centerX,
    y: 124,
    size: 21,
    weight: 500,
    fill: "#2C1A13",
    anchor: "middle"
  });

  out += wrappedText({
    value: description,
    x: centerX,
    y: 149,
    maxChars: 39,
    maxLines: 2,
    lineHeight: 18,
    size: 13.5,
    fill: "#2C1A13",
    anchor: "middle"
  });

  out += buildConfidenceCard({
    x: 626,
    y: 17,
    width: 126,
    height: 164,
    percent: safeConfidence.percent,
    label: safeConfidence.label_ru,
    accentColor
  });

  out += `</g>`;
  return out;
}

module.exports = {
  HEADER_VERSION,
  buildHeader
};
