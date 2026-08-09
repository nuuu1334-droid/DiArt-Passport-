/**
 * DiArt Passport
 * File: passport/components/information_panel_block.js
 * Version: 1.0.0-approved
 *
 * FIRST PAGE — BLOCK 5: INFORMATION PANEL.
 *
 * Renders exactly:
 * - three equal information cells;
 * - adaptive information icons from Assets;
 * - date, AI model and palette database version;
 * - two vertical separators.
 *
 * This file does not draw the icons.
 */

"use strict";

const INFORMATION_PANEL_VERSION = "1.0.0-approved";

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

function normalizeSeasonId(value) {
  const seasonId = String(value || "").trim();
  return ENGINE_TO_ASSET_SLUG[seasonId] || seasonId;
}

function joinUrl(baseUrl, relativePath) {
  const path = String(relativePath || "").trim();

  if (!path) return "";
  if (/^data:/i.test(path) || /^https?:\/\//i.test(path)) return path;

  const base = String(baseUrl || "").trim().replace(/\/+$/, "");
  if (!base) return path;

  return `${base}/${path.replace(/^\/+/, "")}`;
}

function resolveIconUrls({
  iconManifest,
  iconsBaseUrl,
  seasonId
}) {
  const normalized = normalizeSeasonId(seasonId);

  const season = arr(obj(iconManifest).seasons).find(
    item => item && item.slug === normalized
  );

  if (!season || !obj(season.files)) {
    throw new Error(
      `Information Panel: icon assets not found for season "${seasonId}".`
    );
  }

  return {
    calendar: joinUrl(iconsBaseUrl, season.files.calendar),
    brain: joinUrl(iconsBaseUrl, season.files.brain),
    database: joinUrl(iconsBaseUrl, season.files.database)
  };
}

function text({
  value,
  x,
  y,
  size,
  weight = 400,
  family = "Arial, Helvetica, sans-serif",
  fill = "#2C1A13",
  anchor = "start",
  tracking = 0
}) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}"
    font-family="${family}" font-size="${size}" font-weight="${weight}"
    letter-spacing="${tracking}" fill="${fill}">${esc(value)}</text>`;
}

function valueSize(value) {
  const length = String(value || "").trim().length;

  if (length <= 11) return 15;
  if (length <= 16) return 13.5;
  if (length <= 22) return 12;
  return 10.8;
}

function renderCell({
  x,
  y,
  width,
  iconUrl,
  label,
  value
}) {
  const iconSize = 36;
  const iconX = x + 22;
  const centerY = y + 47;

  let out = `<g>`;

  out += `<image href="${esc(iconUrl)}"
    x="${iconX}" y="${centerY - iconSize / 2}"
    width="${iconSize}" height="${iconSize}"
    preserveAspectRatio="xMidYMid meet"/>`;

  out += text({
    value: label,
    x: x + 72,
    y: y + 34,
    size: 9.5,
    weight: 600,
    fill: "#746052",
    tracking: 0.2
  });

  out += text({
    value,
    x: x + 72,
    y: y + 59,
    size: valueSize(value),
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: "#2C1A13"
  });

  out += `</g>`;
  return out;
}

function buildInformationPanelBlock({
  seasonId,
  iconManifest,
  iconsBaseUrl = "",
  createdDate = "",
  aiModel = "",
  databaseVersion = "",
  accentColor = "#8A4E25"
}) {
  const icons = resolveIconUrls({
    iconManifest,
    iconsBaseUrl,
    seasonId
  });

  const panelX = 24;
  const panelY = 28;
  const panelWidth = 728;
  const panelHeight = 94;

  const cellWidth = panelWidth / 3;

  let out = `<g id="diart-information-panel">`;

  out += `<rect x="${panelX}" y="${panelY}"
    width="${panelWidth}" height="${panelHeight}"
    rx="18" fill="#FFFDFC"
    stroke="#DCCFC2" stroke-width="1"/>`;

  out += renderCell({
    x: panelX,
    y: panelY,
    width: cellWidth,
    iconUrl: icons.calendar,
    label: "ПАСПОРТ СОЗДАН",
    value: createdDate
    fill: accentColor,
  });

  out += renderCell({
    x: panelX + cellWidth,
    y: panelY,
    width: cellWidth,
    iconUrl: icons.brain,
    label: "AI-МОДЕЛЬ",
    value: aiModel
    fill: accentColor,
  });

  out += renderCell({
    x: panelX + cellWidth * 2,
    y: panelY,
    width: cellWidth,
    iconUrl: icons.database,
    label: "БАЗА ПАЛИТР",
    value: databaseVersion
    fill: accentColor,
  });

  out += `<line x1="${panelX + cellWidth}" y1="${panelY + 18}"
    x2="${panelX + cellWidth}" y2="${panelY + panelHeight - 18}"
    stroke="${accentColor}" stroke-opacity="0.18" stroke-width="1"/>`;

  out += `<line x1="${panelX + cellWidth * 2}" y1="${panelY + 18}"
    x2="${panelX + cellWidth * 2}" y2="${panelY + panelHeight - 18}"
    stroke="${accentColor}" stroke-opacity="0.18" stroke-width="1"/>`;

  out += `</g>`;
  return out;
}

module.exports = {
  INFORMATION_PANEL_VERSION,
  normalizeSeasonId,
  resolveIconUrls,
  buildInformationPanelBlock
};
