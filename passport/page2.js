/**
 * DiArt Passport
 * File: passport/page2.js
 * Version: 2.1.0
 *
 * Approved second page:
 * Palette Gallery, Neutral Base, Accent Collection,
 * Harmony Guide, Important Note and DiArt Signature footer.
 */

"use strict";

const layout = require("./layout");
const svg = require("./svg");
const { footer } = require("./components/footer");

const PAGE_2_VERSION = "2.1.0";

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

function wrapWords(value, maxChars) {
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
  fill = "#241912",
  anchor = "start"
}) {
  return wrapWords(value, maxChars)
    .slice(0, maxLines)
    .map((line, index) =>
      txt({
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

function resolveTheme(data) {
  const assets = obj(data.assets);
  const manifest = obj(assets.pin_manifest);
  const seasonId = obj(data.season).id;
  const pin = arr(manifest.pins).find(item => item && item.slug === seasonId)
    || arr(manifest.pins).find(
      item => seasonId === "true_spring" && item.slug === "warm_spring"
    );

  return {
    accent: pin && pin.color ? pin.color : "#5B2A0C",
    ink: "#241912",
    muted: "#71645B",
    line: "#DED2C6",
    border: "#E4D8CC",
    background: "#F8F2EB",
    surface: "#FFFDFC"
  };
}

function getGroups(data) {
  const palette = obj(data.palette);
  const groups = obj(palette.groups);

  if (Object.keys(groups).length) {
    return {
      signature: arr(groups.signature),
      core: arr(groups.core),
      additional: arr(groups.additional),
      neutral: arr(groups.neutral),
      accent: arr(groups.accent)
    };
  }

  const colors = arr(palette.colors);

  return {
    signature: colors.filter(c => c && c.group === "signature"),
    core: colors.filter(c => c && c.group === "core"),
    additional: colors.filter(c => c && c.group === "additional"),
    neutral: colors.filter(c => c && c.group === "neutral"),
    accent: colors.filter(c => c && c.group === "accent")
  };
}

function colorName(color) {
  return color && (
    color.name_ru ||
    (color.name && color.name.ru) ||
    color.name_en ||
    (color.name && color.name.en)
  ) || "Оттенок";
}

function colorHex(color) {
  return color && (color.hex || color.canonical_hex) || "#CCCCCC";
}

function paletteCard({
  color,
  x,
  y,
  width,
  height,
  colorHeight,
  theme
}) {
  const name = colorName(color);
  const hex = colorHex(color);
  let out = "";

  out += panel({
    x,
    y,
    width,
    height,
    radius: 18,
    fill: "#FFFFFF",
    stroke: theme.border,
    shadow: false
  });

  out += `<rect x="${x}" y="${y}" width="${width}" height="${colorHeight}"
    rx="18" fill="${hex}"/>
  <rect x="${x}" y="${y + colorHeight - 18}" width="${width}" height="18"
    fill="${hex}"/>`;

  out += wrappedText({
    value: name,
    x: x + width / 2,
    y: y + colorHeight + 36,
    maxChars: 16,
    maxLines: 2,
    lineHeight: 22,
    size: 17,
    weight: 700,
    fill: theme.ink,
    anchor: "middle"
  });

  out += txt({
    value: "HEX",
    x: x + width / 2,
    y: y + height - 38,
    size: 14,
    weight: 700,
    tracking: 1.6,
    fill: theme.muted,
    anchor: "middle"
  });

  out += txt({
    value: hex,
    x: x + width / 2,
    y: y + height - 15,
    size: 16,
    weight: 600,
    fill: theme.muted,
    anchor: "middle"
  });

  return out;
}

function renderHeader(data, theme) {
  const L = layout.PAGE_2.header;
  const season = obj(data.season);
  let out = "";

  out += txt({
    value: "Персональная палитра",
    x: L.x,
    y: L.titleY,
    size: 56,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink
  });

  out += txt({
    value: `${season.name_ru || ""} · ${season.name_en || ""}`,
    x: L.x,
    y: L.titleY + 44,
    size: 24,
    weight: 600,
    fill: theme.accent
  });

  return out;
}

function renderPaletteGallery(groups, theme) {
  const L = layout.PAGE_2.paletteGallery;
  const sections = [
    ["SIGNATURE COLORS", groups.signature.slice(0, 4)],
    ["CORE COLORS", groups.core.slice(0, 4)],
    ["ADDITIONAL COLORS", groups.additional.slice(0, 4)]
  ];

  let out = panel({
    x: L.x,
    y: L.y,
    width: L.width,
    height: L.height,
    radius: 30,
    stroke: theme.border
  });

  out += txt({
    value: "Palette Gallery",
    x: L.x + 28,
    y: L.titleY,
    size: 34,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink
  });

  const sectionWidth = 438;
  const sectionGap = 24;
  const startX = L.x + 28;
  const titleY = L.y + 104;
  const cardY = L.y + 144;
  const cardWidth = 96;
  const cardHeight = 488;
  const cardGap = 10;
  const colorHeight = 280;

  sections.forEach((section, sectionIndex) => {
    const sectionX = startX + sectionIndex * (sectionWidth + sectionGap);

    out += txt({
      value: section[0],
      x: sectionX,
      y: titleY,
      size: 18,
      weight: 700,
      tracking: 2,
      fill: theme.accent
    });

    section[1].forEach((color, colorIndex) => {
      out += paletteCard({
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

function renderColorStrip(title, colors, box, theme) {
  let out = panel({
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
    radius: 28,
    stroke: theme.border
  });

  out += txt({
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
    const hex = colorHex(color);

    out += `<rect x="${x}" y="${y}" width="${box.swatchWidth}"
      height="${box.swatchHeight}" rx="16" fill="${hex}"
      stroke="${theme.border}" stroke-width="1.2"/>`;

    out += txt({
      value: hex,
      x: x + box.swatchWidth / 2,
      y: y + box.swatchHeight + 34,
      size: 15,
      weight: 600,
      fill: theme.muted,
      anchor: "middle"
    });
  });

  return out;
}

function renderHarmonyGuide(data, theme) {
  const L = layout.PAGE_2.harmonyGuide;
  const rules = arr(data.harmony_guide).length >= 4
    ? arr(data.harmony_guide).slice(0, 4)
    : [
        "Используйте один фирменный оттенок как основу образа.",
        "Добавляйте нейтральные цвета для спокойного баланса.",
        "Акцентные оттенки применяйте дозированно — в деталях.",
        "Сочетайте цвета одной температуры и близкой глубины."
      ];

  let out = panel({
    x: L.x,
    y: L.y,
    width: L.width,
    height: L.height,
    radius: 30,
    stroke: theme.border
  });

  out += txt({
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

    out += `<circle cx="${L.itemX + 28}" cy="${cy - 10}" r="28"
      fill="${theme.accent}" fill-opacity="0.12"
      stroke="${theme.accent}" stroke-width="2"/>`;

    out += txt({
      value: index + 1,
      x: L.itemX + 28,
      y: cy - 2,
      size: 22,
      weight: 700,
      family: "Georgia, 'Times New Roman', serif",
      fill: theme.accent,
      anchor: "middle"
    });

    out += wrappedText({
      value: rule,
      x: L.textX,
      y: cy - 3,
      maxChars: 54,
      maxLines: 2,
      lineHeight: 28,
      size: 22,
      weight: 500,
      fill: theme.ink
    });
  });

  return out;
}

function renderImportant(data, theme) {
  const L = layout.PAGE_2.important;
  const note = data.important_note ||
    "Палитра — это ориентир, а не ограничение. Используйте её как основу для одежды, аксессуаров и деталей образа.";

  let out = panel({
    x: L.x,
    y: L.y,
    width: L.width,
    height: L.height,
    radius: 30,
    fill: theme.accent,
    stroke: theme.accent
  });

  out += txt({
    value: "Важно",
    x: L.x + 48,
    y: L.titleY,
    size: 38,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: "#FFFFFF"
  });

  out += wrappedText({
    value: note,
    x: L.textX,
    y: L.textY,
    maxChars: 34,
    maxLines: 6,
    lineHeight: 38,
    size: 24,
    weight: 500,
    fill: "#FFFFFF"
  });

  out += `<path d="M ${L.branchX} ${L.branchY}
    C ${L.branchX + 80} ${L.branchY + 36},
      ${L.branchX + 92} ${L.branchY + 142},
      ${L.branchX + L.branchWidth} ${L.branchY + L.branchHeight}"
    fill="none" stroke="#FFFFFF" stroke-opacity="0.28"
    stroke-width="4" stroke-linecap="round"/>`;

  return out;
}

function validate(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Page 2 data is missing.");
  }

  if (!obj(data.season).id) {
    throw new Error("Page 2 requires season.id.");
  }

  if (!obj(data.palette)) {
    throw new Error("Page 2 requires palette.");
  }
}

function buildPage2(data) {
  validate(data);

  const theme = resolveTheme(data);
  const groups = getGroups(data);
  const L = layout.PAGE_2;
  let out = "";

  out += svg.svg(layout.PAGE.width, layout.PAGE.height, layout.PAGE.viewBox);

  out += svg.defs(`
${svg.shadowFilter("shadow")}
<linearGradient id="page2Background" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0%" stop-color="#FFFDFC"/>
  <stop offset="100%" stop-color="${theme.background}"/>
</linearGradient>`);

  out += `<rect x="0" y="0" width="${layout.PAGE.width}"
    height="${layout.PAGE.height}" rx="${layout.PAGE.outerRadius}"
    fill="url(#page2Background)"/>`;

  out += `<rect x="${layout.PAGE.margin}" y="${layout.PAGE.margin}"
    width="${layout.PAGE.width - layout.PAGE.margin * 2}"
    height="${layout.PAGE.height - layout.PAGE.margin * 2}"
    rx="${layout.PAGE.outerRadius}" fill="none"
    stroke="${theme.accent}" stroke-opacity="0.22" stroke-width="2"/>`;

  out += renderHeader(data, theme);
  out += renderPaletteGallery(groups, theme);
  out += renderColorStrip("Neutral Base", groups.neutral, L.neutralBase, theme);
  out += renderColorStrip("Accent Collection", groups.accent, L.accents, theme);
  out += renderHarmonyGuide(data, theme);
  out += renderImportant(data, theme);

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
      : ""
  });

  out += svg.end();
  return out;
}

module.exports = {
  PAGE_2_VERSION,
  buildPage2
};
