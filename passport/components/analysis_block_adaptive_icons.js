/**
 * DiArt Passport
 * File: passport/components/analysis_block.js
 * Version: 2.0.0-approved
 *
 * BLOCK 2 — PORTRAIT + ADAPTIVE ANALYSIS SCALES.
 *
 * Assets policy:
 * - analysis icons are selected from assets/icons/{season}/;
 * - marker pin is selected from assets/pins_svg/;
 * - no icon or pin is drawn by this file.
 */

"use strict";

const ANALYSIS_BLOCK_VERSION = "2.0.0-approved";

const ENGINE_TO_ASSET_SLUG = Object.freeze({
  true_spring: "warm_spring"
});

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

function clamp(value, min = 0, max = 1) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function normalizeSeasonId(value) {
  const seasonId = String(value || "").trim();
  return ENGINE_TO_ASSET_SLUG[seasonId] || seasonId;
}

function joinUrl(baseUrl, relativePath) {
  const base = String(baseUrl || "").trim().replace(/\/+$/, "");
  const path = String(relativePath || "").trim().replace(/^\/+/, "");

  if (!path) return "";
  if (/^data:/i.test(path) || /^https?:\/\//i.test(path)) return path;
  if (!base) return path;

  return `${base}/${path}`;
}

function findIconSeason(iconsManifest, seasonId) {
  const normalized = normalizeSeasonId(seasonId);

  return arr(obj(iconsManifest).seasons).find(
    item => item && item.slug === normalized
  ) || null;
}

function resolveIconUrls({
  iconsManifest,
  iconsBaseUrl,
  seasonId
}) {
  const season = findIconSeason(iconsManifest, seasonId);

  if (!season || !obj(season.files)) {
    throw new Error(
      `Analysis Block: icon assets not found for season "${seasonId}".`
    );
  }

  return {
    temperature: joinUrl(iconsBaseUrl, season.files.temperature),
    depth: joinUrl(iconsBaseUrl, season.files.depth),
    contrast: joinUrl(iconsBaseUrl, season.files.contrast),
    clarity: joinUrl(iconsBaseUrl, season.files.clarity)
  };
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
  height,
  preserveAspectRatio = "xMidYMid meet",
  clipPath = ""
}) {
  if (!href) return "";

  return `<image href="${esc(href)}" x="${x}" y="${y}"
    width="${width}" height="${height}"
    preserveAspectRatio="${preserveAspectRatio}"
    ${clipPath ? `clip-path="url(#${clipPath})"` : ""}/>`;
}

function portrait({
  href,
  x,
  y,
  width,
  height,
  radius
}) {
  const clipId = "diartAnalysisPortraitClip";

  let out = `<defs>
    <clipPath id="${clipId}">
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}"/>
    </clipPath>
  </defs>`;

  out += `<rect x="${x}" y="${y}" width="${width}" height="${height}"
    rx="${radius}" fill="#F2E9E0" stroke="#DCCFC2" stroke-width="1"/>`;

  if (href) {
    out += image({
      href,
      x,
      y,
      width,
      height,
      preserveAspectRatio: "xMidYMid slice",
      clipPath: clipId
    });
  } else {
    out += text({
      value: "ФОТО",
      x: x + width / 2,
      y: y + height / 2 + 5,
      size: 15,
      weight: 700,
      family: "Arial, Helvetica, sans-serif",
      fill: "#9B887A",
      anchor: "middle",
      tracking: 1.5
    });
  }

  return out;
}

function scaleRow({
  x,
  y,
  width,
  height,
  iconUrl,
  markerPinUrl,
  titleRu,
  titleEn,
  leftRu,
  leftEn,
  rightRu,
  rightEn,
  position,
  accentColor
}) {
  const iconX = x + 18;
  const iconY = y + 14;
  const iconSize = 48;

  const titleX = x + 78;
  const trackX1 = x + 224;
  const trackX2 = x + width - 30;
  const trackY = y + 57;
  const markerX = trackX1 + clamp(position) * (trackX2 - trackX1);

  let out = `<g>`;

  out += image({
    href: iconUrl,
    x: iconX,
    y: iconY,
    width: iconSize,
    height: iconSize
  });

  out += text({
    value: titleRu,
    x: titleX,
    y: y + 31,
    size: 13.2,
    weight: 700,
    fill: accentColor,
    tracking: 0.25
  });

  out += text({
    value: titleEn,
    x: titleX,
    y: y + 48,
    size: 9.5,
    family: "Arial, Helvetica, sans-serif",
    fill: "#6F5A4C"
  });

  out += text({
    value: leftRu,
    x: trackX1,
    y: y + 25,
    size: 8.9,
    family: "Arial, Helvetica, sans-serif",
    fill: "#2C1A13"
  });

  out += text({
    value: leftEn,
    x: trackX1,
    y: y + 40,
    size: 7.8,
    family: "Arial, Helvetica, sans-serif",
    fill: "#8B7769"
  });

  out += text({
    value: rightRu,
    x: trackX2,
    y: y + 25,
    size: 8.9,
    family: "Arial, Helvetica, sans-serif",
    fill: "#2C1A13",
    anchor: "end"
  });

  out += text({
    value: rightEn,
    x: trackX2,
    y: y + 40,
    size: 7.8,
    family: "Arial, Helvetica, sans-serif",
    fill: "#8B7769",
    anchor: "end"
  });

  out += `<line x1="${trackX1}" y1="${trackY}"
    x2="${trackX2}" y2="${trackY}"
    stroke="#DED1C4" stroke-width="4" stroke-linecap="round"/>`;

  out += `<line x1="${trackX1}" y1="${trackY}"
    x2="${markerX}" y2="${trackY}"
    stroke="${accentColor}" stroke-width="4" stroke-linecap="round"/>`;

  out += image({
    href: markerPinUrl,
    x: markerX - 18,
    y: trackY - 23,
    width: 36,
    height: 36
  });

  out += `<line x1="${x + 16}" y1="${y + height}"
    x2="${x + width - 16}" y2="${y + height}"
    stroke="#E7DDD3" stroke-width="1"/>`;

  out += `</g>`;
  return out;
}

function buildAnalysisBlock({
  seasonId,
  photoUrl = "",
  markerPinUrl = "",
  iconsManifest,
  iconsBaseUrl = "",
  scales = {},
  accentColor = "#8A4E25"
}) {
  const iconUrls = resolveIconUrls({
    iconsManifest,
    iconsBaseUrl,
    seasonId
  });

  const safeScales = obj(scales);

  const x = 24;
  const y = 194;
  const totalWidth = 728;
  const totalHeight = 334;

  const portraitX = x;
  const portraitWidth = 302;
  const gap = 14;
  const panelX = portraitX + portraitWidth + gap;
  const panelWidth = totalWidth - portraitWidth - gap;

  let out = `<g id="diart-analysis-block">`;

  out += portrait({
    href: photoUrl,
    x: portraitX,
    y,
    width: portraitWidth,
    height: totalHeight,
    radius: 18
  });

  out += `<rect x="${panelX}" y="${y}" width="${panelWidth}" height="${totalHeight}"
    rx="18" fill="#FFFDFC" stroke="#DCCFC2" stroke-width="1"/>`;

  const rowHeight = totalHeight / 4;

  out += scaleRow({
    x: panelX,
    y,
    width: panelWidth,
    height: rowHeight,
    iconUrl: iconUrls.temperature,
    markerPinUrl,
    titleRu: "ТЕМПЕРАТУРА",
    titleEn: "Temperature",
    leftRu: "Холодная",
    leftEn: "Cool",
    rightRu: "Тёплая",
    rightEn: "Warm",
    position: obj(safeScales.temperature).position,
    accentColor
  });

  out += scaleRow({
    x: panelX,
    y: y + rowHeight,
    width: panelWidth,
    height: rowHeight,
    iconUrl: iconUrls.depth,
    markerPinUrl,
    titleRu: "ГЛУБИНА",
    titleEn: "Depth",
    leftRu: "Светлая",
    leftEn: "Light",
    rightRu: "Глубокая",
    rightEn: "Deep",
    position: obj(safeScales.depth).position,
    accentColor
  });

  out += scaleRow({
    x: panelX,
    y: y + rowHeight * 2,
    width: panelWidth,
    height: rowHeight,
    iconUrl: iconUrls.contrast,
    markerPinUrl,
    titleRu: "КОНТРАСТ",
    titleEn: "Contrast",
    leftRu: "Низкий",
    leftEn: "Low",
    rightRu: "Высокий",
    rightEn: "High",
    position: obj(safeScales.contrast).position,
    accentColor
  });

  out += scaleRow({
    x: panelX,
    y: y + rowHeight * 3,
    width: panelWidth,
    height: rowHeight,
    iconUrl: iconUrls.clarity,
    markerPinUrl,
    titleRu: "ЧИСТОТА",
    titleEn: "Clarity",
    leftRu: "Мягкая",
    leftEn: "Soft",
    rightRu: "Чистая",
    rightEn: "Clear",
    position: obj(safeScales.clarity).position,
    accentColor
  });

  out += `</g>`;
  return out;
}

module.exports = {
  ANALYSIS_BLOCK_VERSION,
  normalizeSeasonId,
  resolveIconUrls,
  buildAnalysisBlock
};
