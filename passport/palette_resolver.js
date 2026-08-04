/**
 * DiArt Passport
 * File: passport/palette_resolver.js
 * Version: 1.0.0
 *
 * Resolves one seasonal palette from:
 * - DiArt Palette Database v2.1
 * - DiArt Master Color Research Library v3.9
 *
 * Palette Database defines:
 * - season
 * - palette order
 * - group assignment
 *
 * Master Color Library defines:
 * - canonical HEX
 * - RGB / LAB / LCH
 * - research metadata
 *
 * The resolver does not invent Russian color names.
 */

"use strict";

const RESOLVER_VERSION = "1.0.0";

const EXPECTED_GROUP_COUNTS = Object.freeze({
  signature: 4,
  core: 4,
  additional: 4,
  neutral: 6,
  accent: 6
});

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function fail(message, details) {
  const error = new Error(message);
  error.details = details || null;
  throw error;
}

function parseMaybeJson(value, fieldName) {
  if (isObject(value) || Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string" || !value.trim()) {
    fail(`Поле "${fieldName}" не передано.`);
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    fail(`Не удалось разобрать JSON в поле "${fieldName}".`, {
      field: fieldName,
      parser_message: error.message
    });
  }
}

function normalizeHex(value, fallback = "#CCCCCC") {
  if (typeof value !== "string") return fallback;

  const hex = value.trim().toUpperCase();

  if (/^#[0-9A-F]{6}$/.test(hex)) return hex;
  if (/^[0-9A-F]{6}$/.test(hex)) return `#${hex}`;

  return fallback;
}

function makeMasterIndex(masterLibrary) {
  const colors = Array.isArray(masterLibrary.colors)
    ? masterLibrary.colors
    : [];

  const byColorId = {};
  const bySlug = {};

  for (const color of colors) {
    if (!isObject(color)) continue;

    if (color.color_id) {
      byColorId[String(color.color_id)] = color;
    }

    if (color.slug) {
      bySlug[String(color.slug)] = color;
    }
  }

  return {
    byColorId,
    bySlug,
    count: colors.length
  };
}

function findSeason(paletteDatabase, seasonId) {
  const seasons = Array.isArray(paletteDatabase.seasons)
    ? paletteDatabase.seasons
    : [];

  return (
    seasons.find(season => season && season.id === seasonId) ||
    null
  );
}

function getMasterColor(entry, index) {
  if (!entry) return null;

  if (entry.color_id && index.byColorId[entry.color_id]) {
    return index.byColorId[entry.color_id];
  }

  if (entry.slug && index.bySlug[entry.slug]) {
    return index.bySlug[entry.slug];
  }

  return null;
}

function resolveName(entry, masterColor) {
  const entryName = isObject(entry.name) ? entry.name : {};
  const masterName =
    masterColor && isObject(masterColor.name)
      ? masterColor.name
      : {};

  return {
    ru:
      entryName.ru ||
      masterName.ru ||
      null,
    en:
      entryName.en ||
      masterName.en ||
      entry.slug ||
      "Unnamed color"
  };
}

function resolveCanonicalHex(entry, masterColor) {
  const masterHex =
    masterColor &&
    masterColor.research &&
    masterColor.research.canonical_hex;

  return normalizeHex(
    masterHex ||
    entry.canonical_hex ||
    "#CCCCCC"
  );
}

function resolveComputed(entry, masterColor) {
  if (
    masterColor &&
    isObject(masterColor.computed)
  ) {
    return {
      rgb: masterColor.computed.rgb || entry.rgb || null,
      lab: masterColor.computed.lab || entry.lab || null,
      lch: masterColor.computed.lch || entry.lch || null
    };
  }

  return {
    rgb: entry.rgb || null,
    lab: entry.lab || null,
    lch: entry.lch || null
  };
}

function resolveResearch(entry, masterColor) {
  const research =
    masterColor && isObject(masterColor.research)
      ? masterColor.research
      : {};

  return {
    status:
      research.status ||
      entry.research_status ||
      null,
    agreement:
      research.agreement ||
      entry.agreement ||
      null,
    hex_source:
      research.hex_source ||
      entry.hex_source ||
      null,
    canonical_hex_reason:
      research.canonical_hex_reason ||
      null
  };
}

function resolveEntry(entry, index, warnings) {
  const masterColor = getMasterColor(entry, index);

  if (!masterColor) {
    warnings.push(
      `Master Color Library: не найден цвет ${entry.color_id || entry.slug || entry.palette_entry_id}.`
    );
  }

  const name = resolveName(entry, masterColor);
  const computed = resolveComputed(entry, masterColor);
  const research = resolveResearch(entry, masterColor);

  if (!name.ru) {
    warnings.push(
      `Отсутствует русское название цвета ${entry.color_id || entry.slug || entry.palette_entry_id}.`
    );
  }

  return {
    palette_entry_id: entry.palette_entry_id || null,
    color_id:
      entry.color_id ||
      (masterColor && masterColor.color_id) ||
      null,
    slug:
      entry.slug ||
      (masterColor && masterColor.slug) ||
      null,
    group: entry.group || null,
    order: null,

    name_ru: name.ru,
    name_en: name.en,

    hex: resolveCanonicalHex(entry, masterColor),

    rgb: computed.rgb,
    lab: computed.lab,
    lch: computed.lch,

    research
  };
}

function groupColors(colors) {
  const groups = {
    signature: [],
    core: [],
    additional: [],
    neutral: [],
    accent: []
  };

  for (const color of colors) {
    if (groups[color.group]) {
      groups[color.group].push(color);
    }
  }

  return groups;
}

function validateGroupCounts(groups, warnings) {
  for (const [group, expected] of Object.entries(
    EXPECTED_GROUP_COUNTS
  )) {
    const actual = Array.isArray(groups[group])
      ? groups[group].length
      : 0;

    if (actual !== expected) {
      warnings.push(
        `Группа "${group}" содержит ${actual} цветов вместо ${expected}.`
      );
    }
  }
}

function resolvePalette({
  paletteDatabase,
  masterColorLibrary,
  seasonId
}) {
  try {
    const paletteDb = parseMaybeJson(
      paletteDatabase,
      "paletteDatabase"
    );

    const masterDb = parseMaybeJson(
      masterColorLibrary,
      "masterColorLibrary"
    );

    if (!seasonId || typeof seasonId !== "string") {
      fail("Не указан seasonId.");
    }

    const season = findSeason(paletteDb, seasonId);

    if (!season) {
      fail(`В Palette Database не найден сезон "${seasonId}".`);
    }

    const masterIndex = makeMasterIndex(masterDb);
    const warnings = [];

    const sourceColors = Array.isArray(season.colors)
      ? season.colors
      : [];

    const colors = sourceColors.map((entry, index) => {
      const resolved = resolveEntry(entry, masterIndex, warnings);
      resolved.order = index + 1;
      return resolved;
    });

    const groups = groupColors(colors);
    validateGroupCounts(groups, warnings);

    const missingRussianNames = colors.filter(
      color => !color.name_ru
    ).length;

    return {
      ok: true,
      stage: "palette_resolved",
      resolver_version: RESOLVER_VERSION,

      metadata: {
        season_id: seasonId,
        season_name: season.name || null,
        palette_database_version:
          paletteDb.metadata &&
          paletteDb.metadata.version
            ? String(paletteDb.metadata.version)
            : null,
        master_color_version:
          masterDb.metadata &&
          masterDb.metadata.version
            ? String(masterDb.metadata.version)
            : null,
        total_colors: colors.length,
        master_indexed_colors: masterIndex.count,
        missing_russian_names: missingRussianNames
      },

      palette: {
        season_id: seasonId,
        name: season.name || null,
        colors,
        groups
      },

      warnings
    };
  } catch (error) {
    return {
      ok: false,
      stage: "palette_resolver_failed",
      resolver_version: RESOLVER_VERSION,
      error: {
        message:
          error && error.message
            ? error.message
            : "Неизвестная ошибка Palette Resolver.",
        details:
          error && error.details
            ? error.details
            : null
      }
    };
  }
}

module.exports = {
  RESOLVER_VERSION,
  resolvePalette
};
