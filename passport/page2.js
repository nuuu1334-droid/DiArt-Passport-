/**
 * DiArt Passport
 * File: passport/page2.js
 * Version: 2.0.0
 *
 * Approved Page 2 assembly:
 * - Palette Gallery: Signature / Core / Additional
 * - Neutral Base
 * - Accent Collection
 * - Harmony Guide
 * - Important Note
 * - DiArt Signature footer
 */

"use strict";

const layout = require("./layout");
const svg = require("./svg");
const { footer } = require("./components/footer");

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function textLine({
  value,
  x,
  y,
  size,
  weight = 400,
  family = "Arial, Helvetica, sans-serif",
  fill = "#241912",
  anchor = "start",
  tracking = 0,
  italic = false
}) {
  return `
<text
  x="${x}"
  y="${y}"
  text-anchor="${anchor}"
  font-family="${family}"
  font-size="${size}"
  font-weight="${weight}"
  font-style="${italic ? "italic" : "normal"}"
  letter-spacing="${tracking}"
  fill="${fill}">
  ${escapeXml(value)}
</text>`;
}

function roundedPanel({
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
  return `
<rect
  x="${x}"
  y="${y}"
  width="${width}"
  height="${height}"
  rx="${radius}"
  fill="${fill}"
  stroke="${stroke}"
  stroke-width="${strokeWidth}"
  ${shadow ? 'filter="url(#shadow)"' : ""}/>`;
}

function splitWords(value, maxChars) {
  const words = String(value || "").trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;

    if (candidate.length <= maxChars || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function renderWrappedText({
  value,
  x,
  y,
  maxChars,
  lineHeight,
  size,
  weight = 400,
  fill = "#241912",
  family = "Arial, Helvetica, sans-serif",
  anchor = "start",
  maxLines = 3
}) {
  const lines = splitWords(value, maxChars).slice(0, maxLines);
  let out = "";

  lines.forEach((line, index) => {
    out += textLine({
      value: line,
      x,
      y: y + index * lineHeight,
      size,
      weight,
      fill,
      family,
      anchor
    });
  });

  return out;
}

function resolveTheme(data) {
  const manifest = data.assets && data.assets.pin_manifest;
  const seasonId = data.season && data.season.id;
  const pin = manifest && Array.isArray(manifest.pins)
    ? manifest.pins.find(item => item.slug === seasonId)
    : null;

  const accent = pin && pin.color || "#5B2A0C";

  return {
    accent,
    ink: "#241912",
    muted: "#71645B",
    line: "#DED2C6",
    border: "#E4D8CC",
    background: "#F8F2EB",
    surface: "#FFFDFC"
  };
}

function normalizeColor(color, fallbackName) {
  return {
    name_ru:
      color && color.name_ru ||
      color && color.name && color.name.ru ||
      fallbackName ||
      "Оттенок",
    name_en:
      color && color.name_en ||
      color && color.name && color.name.en ||
      "",
    hex:
      color && color.hex ||
      color && color.canonical_hex ||
      "#CCCCCC",
    group:
      color && color.group ||
      ""
  };
}

function getPaletteGroups(data) {
  const palette = data.palette || {};
  const groups = palette.groups || {};

  if (
    Array.isArray(groups.signature) ||
    Array.isArray(groups.core) ||
    Array.isArray(groups.additional)
  ) {
    return {
      signature: safeArray(groups.signature).map((c, i) =>
        normalizeColor(c, `Signature ${i + 1}`)
      ),
      core: safeArray(groups.core).map((c, i) =>
        normalizeColor(c, `Core ${i + 1}`)
      ),
      additional: safeArray(groups.additional).map((c, i) =>
        normalizeColor(c, `Additional ${i + 1}`)
      ),
      neutral: safeArray(groups.neutral).map((c, i) =>
        normalizeColor(c, `Neutral ${i + 1}`)
      ),
      accent: safeArray(groups.accent).map((c, i) =>
        normalizeColor(c, `Accent ${i + 1}`)
      )
    };
  }

  const colors = safeArray(palette.colors).map(normalizeColor);
  const byGroup = group => colors.filter(color => color.group === group);

  return {
    signature: byGroup("signature"),
    core: byGroup("core"),
    additional: byGroup("additional"),
    neutral: byGroup("neutral"),
    accent: byGroup("accent")
  };
}

function renderPageHeader(data, theme) {
  const L = layout.PAGE_2;
  const season = data.season || {};
  let out = "";

  out += textLine({
    value: "Персональная палитра",
    x: L.header.x,
    y: L.header.titleY,
    size: 56,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink
  });

  out += textLine({
    value: `${season.name_ru || ""} · ${season.name_en || ""}`,
    x: L.header.x,
    y: L.header.titleY + 44,
    size: 24,
    weight: 600,
    fill: theme.accent
  });

  return out;
}

function renderPaletteCard({
  color,
  x,
  y,
  width,
  height,
  colorHeight,
  theme
}) {
  const name = color.name_ru || color.name_en || "Оттенок";
  const hex = color.hex || "#CCCCCC";

  let out = "";

  out += roundedPanel({
    x,
    y,
    width,
    height,
    radius: 18,
    fill: "#FFFFFF",
    stroke: theme.border,
    shadow: false
  });

  out += `
<rect
  x="${x}"
  y="${y}"
  width="${width}"
  height="${colorHeight}"
  rx="18"
  fill="${hex}"/>`;

  out += `
<rect
  x="${x}"
  y="${y + colorHeight - 18}"
  width="${width}"
  height="18"
  fill="${hex}"/>`;

  out += renderWrappedText({
    value: name,
    x: x + width / 2,
    y: y + colorHeight + 42,
    maxChars: 18,
    lineHeight: 24,
    size: 20,
    weight: 700,
    fill: theme.ink,
    anchor: "middle",
    maxLines: 2
  });

  out += textLine({
    value: "HEX",
    x: x + width / 2,
    y: y + height - 42,
    size: 16,
    weight: 700,
    tracking: 2,
    fill: theme.muted,
    anchor: "middle"
  });

  out += textLine({
    value: hex,
    x: x + width / 2,
    y: y + height - 16,
    size: 18,
    weight: 600,
    fill: theme.muted,
    anchor: "middle"
  });

  return out;
}

function renderPaletteGallery(data, theme, groups) {
  const L = layout.PAGE_2;
  let out = "";

  out += roundedPanel({
    x: L.paletteGallery.x,
    y: L.paletteGallery.y,
    width: L.paletteGallery.width,
    height: L.paletteGallery.height,
    radius: 30,
    fill: "#FFFDFC",
    stroke: theme.border
  });

  out += textLine({
    value: "Palette Gallery",
    x: L.paletteGallery.x + 28,
    y: L.paletteGallery.titleY,
    size: 34,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink
  });

  const sections = [
    {
      title: "SIGNATURE COLORS",
      colors: groups.signature.slice(0, 4)
    },
    {
      title: "CORE COLORS",
      colors: groups.core.slice(0, 4)
    },
    {
      title: "ADDITIONAL COLORS",
      colors: groups.additional.slice(0, 4)
    }
  ];

  const sectionWidth = 438;
  const sectionGap = 24;
  const startX = L.paletteGallery.x + 28;
  const titleY = L.paletteGallery.y + 104;
  const cardY = L.paletteGallery.y + 144;
  const cardWidth = 96;
  const cardHeight = 488;
  const cardGap = 10;
  const colorHeight = 280;

  sections.forEach((section, sectionIndex) => {
    const sectionX = startX + sectionIndex * (sectionWidth + sectionGap);

    out += textLine({
      value: section.title,
      x: sectionX,
      y: titleY,
      size: 18,
      weight: 700,
      tracking: 2.2,
      fill: theme.accent
    });

    section.colors.forEach((color, colorIndex) => {
      out += renderPaletteCard({
        color,
        x: sectionX + colorIndex * (cardWidth + cardGap),
        y: cardY,
        width: cardWidth,
        height: cardHeight,
        colorHeight,
        theme
      });
    });
  });

  return out;
}

function renderColorStrip({
  title,
  colors,
  box,
  theme
}) {
  let out = "";

  out += roundedPanel({
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
    radius: 28,
    fill: "#FFFDFC",
    stroke: theme.border
  });

  out += textLine({
    value: title,
    x: box.x + 28,
    y: box.titleY,
    size: 32,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink
  });

  colors.slice(0, 6).forEach((color, index) => {
    const x = box.swatchesX + index * (box.swatchWidth + box.gap);
    const y = box.swatchesY;

    out += `
<rect
  x="${x}"
  y="${y}"
  width="${box.swatchWidth}"
  height="${box.swatchHeight}"
  rx="16"
  fill="${color.hex}"
  stroke="${theme.border}"
  stroke-width="1.2"/>`;

    out += textLine({
      value: color.hex,
      x: x + box.swatchWidth / 2,
      y: y + box.swatchHeight + 34,
      size: 16,
      weight: 600,
      fill: theme.muted,
      anchor: "middle"
    });
  });

  return out;
}

function renderGuideIcon(x, y, index, theme) {
  const number = index + 1;

  return `
<circle
  cx="${x}"
  cy="${y}"
  r="28"
  fill="${theme.accent}"
  fill-opacity="0.12"
  stroke="${theme.accent}"
  stroke-width="2"/>

<text
  x="${x}"
  y="${y + 8}"
  text-anchor="middle"
  font-family="Georgia, 'Times New Roman', serif"
  font-size="24"
  font-weight="700"
  fill="${theme.accent}">
  ${number}
</text>`;
}

function renderHarmonyGuide(data, theme) {
  const L = layout.PAGE_2.harmonyGuide;
  const guide = safeArray(data.harmony_guide);

  const rules = guide.length >= 4
    ? guide.slice(0, 4)
    : [
        "Используйте один фирменный оттенок как основу образа.",
        "Добавляйте нейтральные цвета для спокойного баланса.",
        "Акцентные оттенки применяйте дозированно — в деталях.",
        "Сочетайте цвета из одной температурной и глубинной зоны."
      ];

  let out = "";

  out += roundedPanel({
    x: L.x,
    y: L.y,
    width: L.width,
    height: L.height,
    radius: 30,
    fill: "#FFFDFC",
    stroke: theme.border
  });

  out += textLine({
    value: "Harmony Guide",
    x: L.x + 28,
    y: L.titleY,
    size: 34,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink
  });

  rules.forEach((rule, index) => {
    const cy = L.itemStartY + index * L.itemGap;

    out += renderGuideIcon(L.itemX + 28, cy - 10, index, theme);

    out += renderWrappedText({
      value: rule,
      x: L.textX,
      y: cy - 3,
      maxChars: 54,
      lineHeight: 28,
      size: 22,
      weight: 500,
      fill: theme.ink,
      maxLines: 2
    });
  });

  return out;
}

function renderImportant(data, theme) {
  const L = layout.PAGE_2.important;
  const note =
    data.important_note ||
    "Палитра — это ориентир, а не ограничение. Используйте её как основу для одежды, аксессуаров и деталей образа.";

  let out = "";

  out += roundedPanel({
    x: L.x,
    y: L.y,
    width: L.width,
    height: L.height,
    radius: 30,
    fill: theme.accent,
    stroke: theme.accent,
    shadow: true
  });

  out += textLine({
    value: "Важно",
    x: L.x + 48,
    y: L.titleY,
    size: 38,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: "#FFFFFF"
  });

  out += renderWrappedText({
    value: note,
    x: L.textX,
    y: L.textY,
    maxChars: 34,
    lineHeight: 38,
    size: 24,
    weight: 500,
    fill: "#FFFFFF",
    maxLines: 6
  });

  out += `
<path
  d="M ${L.branchX} ${L.branchY}
     C ${L.branchX + 80} ${L.branchY + 36},
       ${L.branchX + 92} ${L.branchY + 142},
       ${L.branchX + L.branchWidth} ${L.branchY + L.branchHeight}"
  fill="none"
  stroke="#FFFFFF"
  stroke-opacity="0.28"
  stroke-width="4"
  stroke-linecap="round"/>`;

  return out;
}

function validatePage2Data(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Page 2 data is missing.");
  }

  if (!data.season || !data.season.id) {
    throw new Error("Page 2 requires season.id.");
  }

  if (!data.palette) {
    throw new Error("Page 2 requires palette.");
  }
}

function buildPage2(data) {
  validatePage2Data(data);

  const theme = resolveTheme(data);
  const groups = getPaletteGroups(data);
  const L = layout.PAGE_2;

  let out = "";

  out += svg.svg(
    layout.PAGE.width,
    layout.PAGE.height,
    layout.PAGE.viewBox
  );

  out += svg.defs(`
${svg.shadowFilter("shadow")}
<linearGradient id="page2Background" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0%" stop-color="#FFFDFC"/>
  <stop offset="100%" stop-color="${theme.background}"/>
</linearGradient>
`);

  out += `
<rect
  x="0"
  y="0"
  width="${layout.PAGE.width}"
  height="${layout.PAGE.height}"
  rx="${layout.PAGE.outerRadius}"
  fill="url(#page2Background)"/>`;

  out += `
<rect
  x="${layout.PAGE.margin}"
  y="${layout.PAGE.margin}"
  width="${layout.PAGE.width - layout.PAGE.margin * 2}"
  height="${layout.PAGE.height - layout.PAGE.margin * 2}"
  rx="${layout.PAGE.outerRadius}"
  fill="none"
  stroke="${theme.accent}"
  stroke-opacity="0.22"
  stroke-width="2"/>`;

  out += renderPageHeader(data, theme);
  out += renderPaletteGallery(data, theme, groups);

  out += renderColorStrip({
    title: "Neutral Base",
    colors: groups.neutral,
    box: L.neutralBase,
    theme
  });

  out += renderColorStrip({
    title: "Accent Collection",
    colors: groups.accent,
    box: L.accents,
    theme
  });

  out += renderHarmonyGuide(data, theme);
  out += renderImportant(data, theme);

  out += footer({
    x: L.footer.x,
    y: L.footer.y,
    width: L.footer.width,
    height: L.footer.height,
    logoUrl: data.assets && data.assets.logo,
    logoX: L.footer.logoX,
    logoY: L.footer.logoY,
    logoWidth: L.footer.logoWidth,
    logoHeight: L.footer.logoHeight,
    sloganY: L.footer.sloganY,
    dividerColor: theme.line,
    textColor: theme.muted,
    accentColor: theme.accent,
    serviceInfo: data.passport && data.passport.id
      ? `Passport ID: ${data.passport.id}`
      : null
  });

  out += svg.end();

  return out;
}

module.exports = {
  buildPage2
};
