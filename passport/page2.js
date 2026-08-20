/**
 * DiArt Passport
 * File: passport/page2.js
 * Version: 3.0.0-rebuild-step1
 *
 * PAGE 2 — REBUILD, STEP 1.
 *
 * Current scope:
 * - same page size/background/frame language as approved Page 1;
 * - Page 2 title in the same serif typography;
 * - new approved-in-progress 12-color palette block;
 * - EXACT same approved footer component as Page 1.
 *
 * Other Page 2 blocks will be connected one by one after visual approval.
 */

"use strict";

const { buildPalette12Block } = require("./components/palette12_block");
const { buildFooterBlock } = require("./components/footer_block_approved");

const PAGE2_VERSION = "3.0.0-rebuild-step1";
const PAGE_WIDTH = 768;
const PAGE_HEIGHT = 1134;

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

function group(content, transform = "") {
  return `<g${transform ? ` transform="${esc(transform)}"` : ""}>${content}</g>`;
}

function text({
  value,
  x,
  y,
  size,
  weight = 400,
  family = "Georgia, 'Times New Roman', serif",
  fill = "#2C1A13",
  anchor = "middle",
  tracking = 0
}) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}"
    font-family="${family}" font-size="${size}" font-weight="${weight}"
    letter-spacing="${tracking}" fill="${fill}">${esc(value)}</text>`;
}

function buildPage2(data) {
  const safe = obj(data);
  const assets = obj(safe.assets);
  const season = obj(safe.season);
  const passport = obj(safe.passport);

  const backgroundColor = safe.backgroundColor || "#FBF7F1";
  const accentColor = safe.accentColor || "#8A4E25";

  // Deliberately derived from Page 1 visual language.
  // These remain quiet neutrals while the season controls background + accent.
  const textColor = "#2C1A13";
  const mutedColor = "#6F5544";
  const lineColor = "#DCCFC2";
  const panelColor = "#FFFDFC";

  let out = `<svg xmlns="http://www.w3.org/2000/svg"
    width="${PAGE_WIDTH}" height="${PAGE_HEIGHT}"
    viewBox="0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}">`;

  // EXACT same page background behavior as approved Page 1.
  out += `<rect width="${PAGE_WIDTH}" height="${PAGE_HEIGHT}"
    rx="24" fill="${backgroundColor}"/>`;

  // EXACT same outer frame language as approved Page 1.
  out += `<rect x="8" y="8"
    width="${PAGE_WIDTH - 16}" height="${PAGE_HEIGHT - 16}"
    rx="20" fill="none"
    stroke="${accentColor}"
    stroke-opacity="0.16" stroke-width="1"/>`;

  // PAGE 2 HEADER.
  out += `<g id="diart-page2-header">`;

  out += text({
    value: "Твоя палитра и рекомендации",
    x: PAGE_WIDTH / 2,
    y: 53,
    size: 25,
    weight: 600,
    fill: textColor
  });

  out += text({
    value: [season.name_ru, season.name_en].filter(Boolean).join(" · "),
    x: PAGE_WIDTH / 2,
    y: 76,
    size: 11,
    weight: 600,
    family: "Arial, Helvetica, sans-serif",
    fill: accentColor,
    tracking: 0.35
  });

  out += `</g>`;

  // STEP 1 — NEW 12-COLOR PALETTE BLOCK.
  out += buildPalette12Block({
    palette: safe.palette,

    x: 24,
    y: 96,
    width: 720,
    height: 382,

    accentColor,
    textColor,
    mutedColor,
    lineColor,
    panelColor
  });

  /*
   * RESERVED SPACE FOR NEXT APPROVED BLOCKS:
   *
   *  - neutral_colors_block
   *  - accent_colors_block
   *  - palette_usage_block
   *  - important_block
   *
   * They are intentionally NOT rendered yet.
   * We first visually approve palette12_block in the real Make → Cloudinary → Telegram flow.
   */

  // EXACT SAME APPROVED FOOTER COMPONENT AND POSITION AS PAGE 1.
  out += group(
    buildFooterBlock({
      seasonId: season.id,
      ornamentUrl: assets.footer_ornament,
      logoUrl: assets.logo,
      slogan: "Цвет украшает тебя",
      passportId: passport.id || "",
      accentColor
    }),
    "translate(0 942)"
  );

  out += `</svg>`;
  return out;
}

module.exports = {
  PAGE2_VERSION,
  PAGE_WIDTH,
  PAGE_HEIGHT,
  buildPage2
};
