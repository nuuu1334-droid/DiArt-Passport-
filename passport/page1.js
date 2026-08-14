/**
 * DiArt Passport
 * File: PassportBuilder/page1.js
 * Version: 1.2.0-approved-components
 *
 * FINAL FIRST PAGE ASSEMBLY.
 */

"use strict";

const { buildHeader } = require("./components/header_block_approved");
const { buildAnalysisBlock } = require("./components/analysis_block_adaptive_icons");
const { buildNaturalPaletteBlock } = require("./components/natural_palette_block_approved");
const { buildNearestSeasonsBlock } = require("./components/nearest_seasons_block_balanced");
const { buildInformationPanelBlock } = require("./components/information_panel_block_approved");
const { buildFooterBlock } = require("./components/footer_block_approved");

const PAGE1_VERSION = "1.2.0-approved-components";
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

function arr(value) {
  return Array.isArray(value) ? value : [];
}

function group(content, transform = "") {
  return `<g${transform ? ` transform="${esc(transform)}"` : ""}>${content}</g>`;
}

function buildPage1(data) {
  const safe = obj(data);
  const assets = obj(safe.assets);
  const season = obj(safe.season);
  const passport = obj(safe.passport);

  let out = `<svg xmlns="http://www.w3.org/2000/svg"
    width="${PAGE_WIDTH}" height="${PAGE_HEIGHT}"
    viewBox="0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}">`;

  out += `<rect width="${PAGE_WIDTH}" height="${PAGE_HEIGHT}"
    rx="24" fill="${safe.backgroundColor || "#FBF7F1"}"/>`;

  out += `<rect x="8" y="8"
    width="${PAGE_WIDTH - 16}" height="${PAGE_HEIGHT - 16}"
    rx="20" fill="none"
    stroke="${safe.accentColor || "#8A4E25"}"
    stroke-opacity="0.16" stroke-width="1"/>`;

  out += buildHeader({
    logoUrl: assets.logo,
    season,
    confidence: safe.confidence,
    accentColor: safe.accentColor
  });

  out += buildAnalysisBlock({
    seasonId: season.id,
    photoUrl: obj(safe.source).photo_url,
    markerPinUrl: assets.active_pin,
    iconsManifest: assets.analysis_icons_manifest,
    iconsBaseUrl: assets.base_url || "",
    scales: safe.scales,
    accentColor: safe.accentColor
  });

  out += buildNaturalPaletteBlock({
    photoSamples: safe.photo_samples,
    naturalColors: safe.natural_colors,
    accentColor: safe.accentColor
  });

  out += buildNearestSeasonsBlock({
    top3: arr(safe.top3).slice(0, 3),
    logoUrl: assets.logo,
    accentColor: safe.accentColor
  });

  out += group(
    buildInformationPanelBlock({
      seasonId: season.id,
      iconManifest: assets.info_icons_manifest,
      iconsBaseUrl: assets.base_url || "",
      createdDate: passport.created_at || "",
      aiModel: passport.ai_model || "",
      databaseVersion: passport.database_version || "",
      accentColor: safe.accentColor
    }),
    "translate(0 820)"
  );

  out += group(
    buildFooterBlock({
      seasonId: season.id,
      ornamentUrl: assets.footer_ornament,
      logoUrl: assets.logo,
      slogan: "Цвет украшает тебя",
      passportId: passport.id || "",
      accentColor: safe.accentColor
    }),
    "translate(0 942)"
  );

  out += `</svg>`;
  return out;
}

module.exports = {
  PAGE1_VERSION,
  PAGE_WIDTH,
  PAGE_HEIGHT,
  buildPage1
};
