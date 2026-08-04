/**
 * DiArt Passport
 * File: passport/page1.js
 * Version: 2.2.0
 *
 * Approved first page:
 * Identity Header, Portrait Frame, Harmony Scales,
 * Natural Palette, Color Orbit, service block and footer.
 */

"use strict";

const layout = require("./layout");
const svg = require("./svg");
const { drawLogo } = require("./components/logo");
const { portrait } = require("./components/photo");
const { buildColorOrbit } = require("./components/color_orbit");
const { footer } = require("./components/footer");

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

function clamp(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0.5;
  return Math.max(0, Math.min(1, n));
}

function txt({
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
  return `<text x="${x}" y="${y}" text-anchor="${anchor}"
    font-family="${family}" font-size="${size}" font-weight="${weight}"
    letter-spacing="${tracking}" fill="${fill}">${esc(value)}</text>`;
}

function panel({
  x,
  y,
  width,
  height,
  radius = 28,
  fill = "#FFFDFC",
  stroke = "#E4D8CC",
  strokeWidth = 1.5,
  shadow = true
}) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}"
    rx="${radius}" fill="${fill}" stroke="${stroke}"
    stroke-width="${strokeWidth}" ${shadow ? 'filter="url(#shadow)"' : ""}/>`;
}

function wrapped({
  value,
  x,
  y,
  maxChars = 32,
  lineHeight = 28,
  maxLines = 2,
  size = 20,
  weight = 400,
  fill = "#241912",
  anchor = "start"
}) {
  const words = String(value || "").trim().split(/\s+/).filter(Boolean);
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

  return lines.slice(0, maxLines).map((line, index) =>
    txt({
      value: line,
      x,
      y: y + index * lineHeight,
      size,
      weight,
      fill,
      anchor
    })
  ).join("");
}

function themeFrom(data) {
  const assets = obj(data.assets);
  const manifest = obj(assets.pin_manifest);
  const pins = arr(manifest.pins);
  const seasonId = obj(data.season).id;
  const current = pins.find(pin => pin && pin.slug === seasonId);

  return {
    accent: current && current.color ? current.color : "#5B2A0C",
    ink: "#241912",
    muted: "#71645B",
    line: "#DED2C6",
    border: "#E4D8CC",
    background: "#F8F2EB",
    surface: "#FFFDFC"
  };
}

function renderHeader(data, theme) {
  const L = layout.PAGE_1;
  const season = obj(data.season);
  const confidence = obj(data.confidence);
  let out = "";

  out += panel({
    x: L.header.x,
    y: L.header.y,
    width: L.header.width,
    height: L.header.height,
    radius: 30,
    stroke: theme.border
  });

  out += drawLogo({
    href: obj(data.assets).logo,
    x: L.logo.x,
    y: L.logo.y,
    width: L.logo.width,
    height: L.logo.height
  });

  out += txt({
    value: "DiArt Digital Color Passport",
    x: L.identity.x,
    y: L.identity.eyebrowY,
    size: 22,
    weight: 600,
    tracking: 2.4,
    fill: theme.muted
  });

  out += txt({
    value: season.name_ru || "",
    x: L.identity.x,
    y: L.identity.titleRuY,
    size: 66,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink
  });

  out += txt({
    value: season.name_en || "",
    x: L.identity.x,
    y: L.identity.titleEnY,
    size: 40,
    weight: 600,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.accent
  });

  out += wrapped({
    value: season.description_ru || "",
    x: L.identity.x,
    y: L.identity.descriptionY,
    maxChars: 54,
    lineHeight: 30,
    maxLines: 2,
    size: 26,
    fill: theme.muted
  });

  const centerX = L.confidence.x + L.confidence.width / 2;

  out += txt({
    value: "ДОСТОВЕРНОСТЬ",
    x: centerX,
    y: L.confidence.labelY,
    size: 19,
    weight: 700,
    tracking: 2,
    fill: theme.muted,
    anchor: "middle"
  });

  out += txt({
    value: `${confidence.percent ?? 0}%`,
    x: centerX,
    y: L.confidence.percentY,
    size: 82,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.accent,
    anchor: "middle"
  });

  out += `<rect x="${L.confidence.x + 20}" y="${L.confidence.pillY - 25}"
    width="${L.confidence.width - 40}" height="48" rx="24"
    fill="${theme.accent}" fill-opacity="0.10"/>`;

  out += txt({
    value: confidence.label_ru || "",
    x: centerX,
    y: L.confidence.pillY + 7,
    size: 20,
    weight: 600,
    fill: theme.accent,
    anchor: "middle"
  });

  return out;
}

function renderPortrait(data, theme) {
  const L = layout.PAGE_1.portrait;
  let out = "";

  out += panel({
    x: L.x,
    y: L.y,
    width: L.width,
    height: L.height,
    radius: 30,
    fill: "#FFFFFF",
    stroke: theme.accent,
    strokeWidth: 2
  });

  if (obj(data.source).photo_url) {
    out += portrait({
      href: data.source.photo_url,
      x: L.x + 10,
      y: L.y + 10,
      width: L.width - 20,
      height: L.height - 20,
      radius: 24
    });
  }

  return out;
}

function scaleRow({
  y,
  title,
  subtitle,
  leftLabel,
  rightLabel,
  position,
  panelBox,
  theme
}) {
  const titleX = panelBox.x + 34;
  const x1 = panelBox.x + 398;
  const x2 = panelBox.x + panelBox.width - 54;
  const lineY = y + 88;
  const markerX = x1 + clamp(position) * (x2 - x1);

  return `
<g>
  ${txt({ value: title, x: titleX, y: y + 32, size: 28, weight: 700, fill: theme.ink })}
  ${txt({ value: subtitle, x: titleX, y: y + 67, size: 21, fill: theme.muted })}
  ${txt({ value: leftLabel, x: x1, y: y + 36, size: 20, fill: theme.muted })}
  ${txt({ value: rightLabel, x: x2, y: y + 36, size: 20, fill: theme.muted, anchor: "end" })}
  <line x1="${x1}" y1="${lineY}" x2="${x2}" y2="${lineY}"
    stroke="${theme.line}" stroke-width="8" stroke-linecap="round"/>
  <line x1="${x1}" y1="${lineY}" x2="${markerX}" y2="${lineY}"
    stroke="${theme.accent}" stroke-width="8" stroke-linecap="round"/>
  <circle cx="${markerX}" cy="${lineY}" r="18" fill="#FFFFFF"
    stroke="${theme.accent}" stroke-width="5"/>
  <circle cx="${markerX}" cy="${lineY}" r="7" fill="${theme.accent}"/>
</g>`;
}

function renderScales(data, theme) {
  const L = layout.PAGE_1;
  const scales = obj(data.scales);
  let out = "";

  out += panel({
    x: L.scalesPanel.x,
    y: L.scalesPanel.y,
    width: L.scalesPanel.width,
    height: L.scalesPanel.height,
    radius: 30,
    stroke: theme.border
  });

  out += scaleRow({
    y: L.scaleRows.temperature.y,
    title: "Температура",
    subtitle: obj(scales.temperature).label_ru || "",
    leftLabel: "Холодная",
    rightLabel: "Тёплая",
    position: obj(scales.temperature).position,
    panelBox: L.scalesPanel,
    theme
  });

  out += scaleRow({
    y: L.scaleRows.depth.y,
    title: "Глубина",
    subtitle: obj(scales.depth).label_ru || "",
    leftLabel: "Светлая",
    rightLabel: "Глубокая",
    position: obj(scales.depth).position,
    panelBox: L.scalesPanel,
    theme
  });

  out += scaleRow({
    y: L.scaleRows.contrast.y,
    title: "Контраст",
    subtitle: obj(scales.contrast).label_ru || "",
    leftLabel: "Низкий",
    rightLabel: "Высокий",
    position: obj(scales.contrast).position,
    panelBox: L.scalesPanel,
    theme
  });

  out += scaleRow({
    y: L.scaleRows.clarity.y,
    title: "Чистота",
    subtitle: obj(scales.clarity).label_ru || "",
    leftLabel: "Мягкая",
    rightLabel: "Яркая",
    position: obj(scales.clarity).position,
    panelBox: L.scalesPanel,
    theme
  });

  return out;
}

function sampleCard({
  sample,
  fallback,
  x,
  y,
  width,
  id,
  label,
  theme
}) {
  sample = obj(sample);
  fallback = obj(fallback);

  const size = 154;
  const cx = x + width / 2;
  const cy = y + 104;
  const hex = sample.hex || fallback.hex || "#CCCCCC";
  const name = sample.name_ru || fallback.name_ru || "";
  const swatches = arr(sample.swatches);
  const colors = (swatches.length ? swatches : [hex, hex, hex, hex, hex]).slice(0, 5);

  let out = "";

  out += txt({
    value: label,
    x: cx,
    y: y + 20,
    size: 20,
    weight: 700,
    tracking: 1.8,
    fill: theme.muted,
    anchor: "middle"
  });

  out += `<defs><clipPath id="${id}">
    <circle cx="${cx}" cy="${cy}" r="${size / 2}"/>
  </clipPath></defs>`;

  if (sample.url) {
    out += `<image href="${esc(sample.url)}" x="${cx - size / 2}" y="${cy - size / 2}"
      width="${size}" height="${size}" clip-path="url(#${id})"
      preserveAspectRatio="xMidYMid slice"/>`;
  } else {
    out += `<circle cx="${cx}" cy="${cy}" r="${size / 2}" fill="${hex}"/>`;
  }

  out += `<circle cx="${cx}" cy="${cy}" r="${size / 2}" fill="none"
    stroke="${theme.accent}" stroke-width="4"/>`;

  const swatchY = y + 206;
  const swatchSize = 24;
  const gap = 8;
  const total = 5 * swatchSize + 4 * gap;
  colors.forEach((color, index) => {
    const sx = cx - total / 2 + index * (swatchSize + gap);
    out += `<rect x="${sx}" y="${swatchY}" width="${swatchSize}" height="${swatchSize}"
      rx="6" fill="${color}" stroke="#FFFFFF" stroke-width="1.5"/>`;
  });

  out += wrapped({
    value: name,
    x: cx,
    y: y + 270,
    maxChars: 18,
    lineHeight: 24,
    maxLines: 2,
    size: 19,
    weight: 600,
    fill: theme.ink,
    anchor: "middle"
  });

  out += txt({
    value: hex,
    x: cx,
    y: y + 324,
    size: 18,
    weight: 600,
    tracking: 1,
    fill: theme.muted,
    anchor: "middle"
  });

  return out;
}

function renderNaturalPalette(data, theme) {
  const L = layout.PAGE_1.naturalPalette;
  const samples = obj(data.photo_samples);
  const natural = obj(data.natural_colors);
  const columns = L.columns;
  const cardY = L.cropY - 62;
  let out = "";

  out += panel({
    x: L.x,
    y: L.y,
    width: L.width,
    height: L.height,
    radius: 30,
    stroke: theme.border
  });

  out += txt({
    value: "Природная палитра",
    x: L.x + 28,
    y: L.titleY,
    size: 34,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink
  });

  out += sampleCard({
    sample: samples.eye,
    fallback: natural.eye,
    x: columns[0].x,
    y: cardY,
    width: columns[0].width,
    id: "eyeSampleClip",
    label: "ГЛАЗА",
    theme
  });

  out += sampleCard({
    sample: samples.hair,
    fallback: natural.hair,
    x: columns[1].x,
    y: cardY,
    width: columns[1].width,
    id: "hairSampleClip",
    label: "ВОЛОСЫ",
    theme
  });

  out += sampleCard({
    sample: samples.skin,
    fallback: natural.skin,
    x: columns[2].x,
    y: cardY,
    width: columns[2].width,
    id: "skinSampleClip",
    label: "КОЖА",
    theme
  });

  return out;
}

function renderOrbit(data, theme) {
  const L = layout.PAGE_1.orbit;
  const assets = obj(data.assets);
  let out = "";

  out += panel({
    x: L.x,
    y: L.y,
    width: L.width,
    height: L.height,
    radius: 30,
    stroke: theme.border
  });

  out += txt({
    value: "Color Orbit",
    x: L.x + 30,
    y: L.titleY,
    size: 34,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink
  });

  out += buildColorOrbit({
    manifest: assets.pin_manifest,
    activeSeason: obj(data.season).id,
    top3: arr(data.top3).map(item => item.season_id),
    cx: L.centerX,
    cy: L.centerY,
    radius: L.outerRadius,
    pinSize: 54,
    assetsBaseUrl: assets.pins_base_url || ""
  });

  out += txt({
    value: "Ближайшие цветотипы определяются по температуре,",
    x: L.x + 30,
    y: L.noteY,
    size: 20,
    fill: theme.muted
  });

  out += txt({
    value: "глубине, чистоте и контрасту внешности.",
    x: L.x + 30,
    y: L.noteY + 30,
    size: 20,
    fill: theme.muted
  });

  return out;
}

function renderService(data, theme) {
  const L = layout.PAGE_1.service;
  const passport = obj(data.passport);
  const items = [
    ["Дата анализа", passport.created_at || ""],
    ["AI-модель", passport.ai_model || ""],
    ["База DiArt", passport.database_version ? `v${passport.database_version}` : ""]
  ];

  let out = panel({
    x: L.x,
    y: L.y,
    width: L.width,
    height: L.height,
    radius: 26,
    stroke: theme.border,
    shadow: false
  });

  items.forEach((item, index) => {
    const centerX = L.x + L.itemWidth * index + L.itemWidth / 2;

    out += txt({
      value: item[0],
      x: centerX,
      y: L.labelY,
      size: 20,
      weight: 600,
      fill: theme.muted,
      anchor: "middle"
    });

    out += txt({
      value: item[1],
      x: centerX,
      y: L.valueY,
      size: 25,
      weight: 700,
      fill: theme.ink,
      anchor: "middle"
    });
  });

  out += `<line x1="${L.divider1X}" y1="${L.y + 28}" x2="${L.divider1X}"
    y2="${L.y + L.height - 28}" stroke="${theme.line}" stroke-width="1.5"/>
  <line x1="${L.divider2X}" y1="${L.y + 28}" x2="${L.divider2X}"
    y2="${L.y + L.height - 28}" stroke="${theme.line}" stroke-width="1.5"/>`;

  return out;
}

function validate(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Page 1 data is missing.");
  }
  if (!obj(data.season).id) {
    throw new Error("Page 1 requires season.id.");
  }
  if (!obj(obj(data.assets).pin_manifest).pins) {
    throw new Error("Page 1 requires assets.pin_manifest.");
  }
}

function buildPage1(data) {
  validate(data);

  const theme = themeFrom(data);
  const L = layout.PAGE_1;
  let out = "";

  out += svg.svg(layout.PAGE.width, layout.PAGE.height, layout.PAGE.viewBox);

  out += svg.defs(`
${svg.shadowFilter("shadow")}
<linearGradient id="page1Background" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0%" stop-color="#FFFDFC"/>
  <stop offset="100%" stop-color="${theme.background}"/>
</linearGradient>`);

  out += `<rect x="0" y="0" width="${layout.PAGE.width}" height="${layout.PAGE.height}"
    rx="${layout.PAGE.outerRadius}" fill="url(#page1Background)"/>`;

  out += `<rect x="${layout.PAGE.margin}" y="${layout.PAGE.margin}"
    width="${layout.PAGE.width - layout.PAGE.margin * 2}"
    height="${layout.PAGE.height - layout.PAGE.margin * 2}"
    rx="${layout.PAGE.outerRadius}" fill="none" stroke="${theme.accent}"
    stroke-opacity="0.22" stroke-width="2"/>`;

  out += renderHeader(data, theme);
  out += renderPortrait(data, theme);
  out += renderScales(data, theme);
  out += renderNaturalPalette(data, theme);
  out += renderOrbit(data, theme);
  out += renderService(data, theme);

  out += footer({
    x: L.footer.x,
    y: L.footer.y,
    width: L.footer.width,
    height: L.footer.height,
    logoUrl: obj(data.assets).logo,
    logoX: L.footer.logoX,
    logoY: L.footer.logoY,
    logoWidth: L.footer.logoWidth,
    logoHeight: L.footer.logoHeight,
    sloganY: L.footer.sloganY,
    dividerColor: theme.line,
    textColor: theme.muted,
    accentColor: theme.accent,
    serviceInfo: obj(data.passport).id
      ? `Passport ID: ${data.passport.id}`
      : null
  });

  out += svg.end();
  return out;
}

module.exports = {
  buildPage1
};
