/**
 * DiArt Passport
 * File: passport/components/color_orbit.js
 * Version: 2.1.0
 *
 * Draws the approved DiArt Color Orbit with 12 official SVG pins.
 *
 * Input:
 * {
 *   manifest,
 *   activeSeason,
 *   top3,
 *   cx,
 *   cy,
 *   radius,
 *   pinSize,
 *   assetsBaseUrl
 * }
 */

"use strict";

const ORBIT_VERSION = "2.1.0";

const ENGINE_TO_MANIFEST_SLUG = Object.freeze({
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

function arr(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeSeasonId(value) {
  const seasonId = String(value || "").trim();
  return ENGINE_TO_MANIFEST_SLUG[seasonId] || seasonId;
}

function polar(cx, cy, radius, angleDegrees) {
  const angle = (angleDegrees - 90) * Math.PI / 180;

  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius
  };
}

function joinUrl(baseUrl, filePath) {
  const file = String(filePath || "").trim();

  if (!file) return "";

  if (/^https?:\/\//i.test(file)) {
    return file;
  }

  const base = String(baseUrl || "").trim();

  if (!base) {
    return file;
  }

  return `${base.replace(/\/+$/, "")}/${file.replace(/^\/+/, "")}`;
}

function findPin(manifest, seasonId) {
  const normalized = normalizeSeasonId(seasonId);

  return arr(manifest && manifest.pins).find(
    pin => pin && pin.slug === normalized
  ) || null;
}

function renderPin({
  pin,
  x,
  y,
  size,
  isActive,
  isTop3,
  rank,
  assetsBaseUrl
}) {
  const scale = isActive ? 1.28 : isTop3 ? 1.12 : 0.92;
  const renderedSize = size * scale;
  const ringRadius = renderedSize * 0.54;
  const fileUrl = joinUrl(assetsBaseUrl, pin.file);

  const ringFill = isActive
    ? pin.color
    : isTop3
      ? pin.color
      : "#FFFFFF";

  const ringOpacity = isActive
    ? 0.15
    : isTop3
      ? 0.08
      : 0;

  const ringStroke = isActive || isTop3
    ? pin.color
    : "#D9CEC2";

  const ringWidth = isActive
    ? 4
    : isTop3
      ? 2.5
      : 1.4;

  let out = `
<g data-season="${esc(pin.slug)}">
  <circle
    cx="${x}"
    cy="${y}"
    r="${ringRadius + 10}"
    fill="${ringFill}"
    fill-opacity="${ringOpacity}"
    stroke="${ringStroke}"
    stroke-width="${ringWidth}"/>`;

  if (fileUrl) {
    out += `
  <image
    href="${esc(fileUrl)}"
    x="${x - renderedSize / 2}"
    y="${y - renderedSize / 2}"
    width="${renderedSize}"
    height="${renderedSize}"
    preserveAspectRatio="xMidYMid meet"/>`;
  } else {
    out += `
  <circle
    cx="${x}"
    cy="${y}"
    r="${renderedSize * 0.36}"
    fill="${pin.color}"/>`;
  }

  if (isTop3 && rank) {
    const badgeX = x + ringRadius * 0.72;
    const badgeY = y - ringRadius * 0.72;

    out += `
  <circle
    cx="${badgeX}"
    cy="${badgeY}"
    r="${isActive ? 16 : 14}"
    fill="${pin.color}"
    stroke="#FFFFFF"
    stroke-width="3"/>

  <text
    x="${badgeX}"
    y="${badgeY + 5}"
    text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif"
    font-size="${isActive ? 15 : 13}"
    font-weight="700"
    fill="#FFFFFF">${rank}</text>`;
  }

  out += `
  <text
    x="${x}"
    y="${y + ringRadius + 36}"
    text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif"
    font-size="${isActive ? 18 : 15}"
    font-weight="${isActive || isTop3 ? 700 : 500}"
    fill="${isActive || isTop3 ? "#241912" : "#71645B"}">
    ${esc(pin.name_ru)}
  </text>
</g>`;

  return out;
}

function renderCenter({
  pin,
  cx,
  cy
}) {
  if (!pin) return "";

  return `
<g id="color-orbit-center">
  <circle
    cx="${cx}"
    cy="${cy}"
    r="90"
    fill="${pin.color}"
    filter="url(#shadow)"/>

  <circle
    cx="${cx}"
    cy="${cy}"
    r="78"
    fill="none"
    stroke="#FFFFFF"
    stroke-opacity="0.45"
    stroke-width="2"/>

  <text
    x="${cx}"
    y="${cy - 14}"
    text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="24"
    font-weight="700"
    fill="#FFFFFF">
    ${esc(pin.name_ru)}
  </text>

  <text
    x="${cx}"
    y="${cy + 22}"
    text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif"
    font-size="16"
    font-weight="500"
    fill="#FFFFFF"
    fill-opacity="0.92">
    ${esc(pin.name_en)}
  </text>
</g>`;
}

function buildColorOrbit({
  manifest,
  activeSeason,
  top3 = [],
  cx,
  cy,
  radius = 176,
  pinSize = 54,
  assetsBaseUrl = ""
}) {
  if (!manifest || !Array.isArray(manifest.pins)) {
    throw new Error("Color Orbit: manifest.pins отсутствует.");
  }

  if (!activeSeason) {
    throw new Error("Color Orbit: activeSeason отсутствует.");
  }

  const pins = manifest.pins;
  const activeSlug = normalizeSeasonId(activeSeason);
  const topSlugs = top3.map(normalizeSeasonId);
  const activePin = findPin(manifest, activeSeason);

  if (!activePin) {
    throw new Error(
      `Color Orbit: в manifest не найден сезон "${activeSeason}".`
    );
  }

  let out = `<g id="diart-color-orbit">`;

  out += `
<circle
  cx="${cx}"
  cy="${cy}"
  r="${radius}"
  fill="none"
  stroke="#E4D8CC"
  stroke-width="2"/>

<circle
  cx="${cx}"
  cy="${cy}"
  r="${radius - 38}"
  fill="none"
  stroke="#E4D8CC"
  stroke-width="1"
  stroke-dasharray="5 10"
  stroke-opacity="0.7"/>`;

  pins.forEach((pin, index) => {
    const point = polar(cx, cy, radius, index * 30);
    const isActive = pin.slug === activeSlug;
    const topIndex = topSlugs.indexOf(pin.slug);
    const isTop3 = topIndex >= 0;

    out += renderPin({
      pin,
      x: point.x,
      y: point.y,
      size: pinSize,
      isActive,
      isTop3,
      rank: isTop3 ? topIndex + 1 : null,
      assetsBaseUrl
    });
  });

  out += renderCenter({
    pin: activePin,
    cx,
    cy
  });

  out += "</g>";

  return out;
}

module.exports = {
  ORBIT_VERSION,
  normalizeSeasonId,
  buildColorOrbit
};
