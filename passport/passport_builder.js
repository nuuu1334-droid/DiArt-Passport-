/**
 * DiArt Passport
 * File: passport/passport_builder.js
 * Version: 3.0.0
 *
 * Main entry point for building the approved two-page SVG passport.
 *
 * Accepted input:
 * 1) normalized passport object
 * 2) adapter wrapper:
 *    {
 *      ok: true,
 *      stage: "passport_input_normalized",
 *      result: { ...normalized passport data... }
 *    }
 *
 * Output:
 * {
 *   ok: true,
 *   stage: "passport_built",
 *   builder_version: "3.0.0",
 *   passport_id: "...",
 *   season_id: "deep_autumn",
 *   page_1_svg: "<svg ...>",
 *   page_2_svg: "<svg ...>",
 *   page_1_filename: "...",
 *   page_2_filename: "...",
 *   warnings: []
 * }
 */

"use strict";

const { buildPage1 } = require("./page1");
const { buildPage2 } = require("./page2");

const BUILDER_VERSION = "3.0.0";

const REQUIRED_SCALE_KEYS = [
  "temperature",
  "depth",
  "clarity",
  "contrast"
];

const REQUIRED_PALETTE_GROUPS = {
  signature: 4,
  core: 4,
  additional: 4,
  neutral: 6,
  accent: 6
};

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function fail(message, details) {
  const error = new Error(message);
  error.details = details || null;
  throw error;
}

function sanitizeFilePart(value, fallback = "passport") {
  const text = String(value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё_-]+/gi, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return text || fallback;
}

function unwrapInput(rawInput) {
  if (!rawInput) {
    fail("Passport Builder не получил входные данные.");
  }

  if (
    isObject(rawInput) &&
    rawInput.ok === true &&
    rawInput.stage === "passport_input_normalized" &&
    isObject(rawInput.result)
  ) {
    return cloneJson(rawInput.result);
  }

  if (isObject(rawInput) && isObject(rawInput.result) && rawInput.result.season) {
    return cloneJson(rawInput.result);
  }

  if (isObject(rawInput) && rawInput.season) {
    return cloneJson(rawInput);
  }

  fail("Passport Builder не распознал структуру входных данных.", {
    expected:
      "normalized passport object or passport_input_normalized wrapper"
  });
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function ensureObject(value) {
  return isObject(value) ? value : {};
}

function normalizeAssetManifest(data, warnings) {
  data.assets = ensureObject(data.assets);

  if (!isObject(data.assets.pin_manifest)) {
    warnings.push(
      "assets.pin_manifest отсутствует. Color Orbit не сможет использовать 12 фирменных пинов."
    );
  }

  if (!data.assets.logo) {
    warnings.push(
      "assets.logo отсутствует. Эмблема DiArt не будет отображена."
    );
  }
}

function normalizePhotoData(data, warnings) {
  data.source = ensureObject(data.source);
  data.photo_samples = ensureObject(data.photo_samples);
  data.natural_colors = ensureObject(data.natural_colors);

  if (!data.source.photo_url) {
    warnings.push(
      "source.photo_url отсутствует. На первой странице не будет портрета."
    );
  }

  const sampleKeys = ["eye", "hair", "skin"];

  for (const key of sampleKeys) {
    data.photo_samples[key] = ensureObject(data.photo_samples[key]);
    data.natural_colors[key] = ensureObject(data.natural_colors[key]);

    if (!data.photo_samples[key].url) {
      warnings.push(
        `photo_samples.${key}.url отсутствует. Будет использована цветовая заливка по HEX.`
      );
    }
  }
}

function normalizePassportMeta(data) {
  data.passport = ensureObject(data.passport);

  if (!data.passport.id) {
    data.passport.id = `DIART-${Date.now().toString(36).toUpperCase()}`;
  }

  if (!data.passport.created_at) {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    data.passport.created_at = `${day}.${month}.${year}`;
  }

  if (!data.passport.ai_model) {
    data.passport.ai_model = "Не указана";
  }

  if (!data.passport.database_version) {
    data.passport.database_version = "";
  }
}

function normalizeSeason(data) {
  data.season = ensureObject(data.season);

  if (!data.season.id) {
    fail("Не указан season.id.");
  }

  if (!data.season.name_ru) {
    fail("Не указано season.name_ru.");
  }

  if (!data.season.name_en) {
    fail("Не указано season.name_en.");
  }

  if (!data.season.description_ru) {
    data.season.description_ru = "";
  }
}

function normalizeConfidence(data) {
  data.confidence = ensureObject(data.confidence);

  const percent = Number(data.confidence.percent);

  if (!Number.isFinite(percent)) {
    fail("Не указан confidence.percent.");
  }

  data.confidence.percent = Math.max(0, Math.min(100, Math.round(percent)));

  if (!data.confidence.label_ru) {
    if (data.confidence.percent >= 90) {
      data.confidence.label_ru = "Очень высокая достоверность";
    } else if (data.confidence.percent >= 75) {
      data.confidence.label_ru = "Высокая достоверность";
    } else if (data.confidence.percent >= 60) {
      data.confidence.label_ru = "Вероятное совпадение";
    } else {
      data.confidence.label_ru = "Предварительный результат";
    }
  }
}

function normalizeScales(data) {
  data.scales = ensureObject(data.scales);

  for (const key of REQUIRED_SCALE_KEYS) {
    const scale = ensureObject(data.scales[key]);

    if (!Object.prototype.hasOwnProperty.call(scale, "position")) {
      fail(`Не указано scales.${key}.position.`);
    }

    const position = Number(scale.position);

    if (!Number.isFinite(position)) {
      fail(`scales.${key}.position должно быть числом.`);
    }

    scale.position = Math.max(0, Math.min(1, position));
    scale.label_ru = scale.label_ru || "";

    data.scales[key] = scale;
  }
}

function normalizeTop3(data) {
  data.top3 = ensureArray(data.top3);

  if (data.top3.length < 3) {
    fail("Для Color Orbit требуется минимум три элемента top3.");
  }

  data.top3 = data.top3
    .slice(0, 3)
    .map((item, index) => {
      const value = ensureObject(item);

      if (!value.season_id) {
        fail(`У top3[${index}] отсутствует season_id.`);
      }

      return {
        rank: Number.isFinite(Number(value.rank))
          ? Number(value.rank)
          : index + 1,
        season_id: String(value.season_id),
        name_ru: value.name_ru || "",
        name_en: value.name_en || "",
        score: Number.isFinite(Number(value.score))
          ? Number(value.score)
          : 0
      };
    });
}

function normalizeColor(color, group, index) {
  const value = ensureObject(color);

  return {
    palette_entry_id: value.palette_entry_id || null,
    color_id: value.color_id || null,
    slug: value.slug || null,
    name_ru:
      value.name_ru ||
      (value.name && value.name.ru) ||
      `Цвет ${index + 1}`,
    name_en:
      value.name_en ||
      (value.name && value.name.en) ||
      "",
    group: value.group || group,
    hex:
      value.hex ||
      value.canonical_hex ||
      "#CCCCCC"
  };
}

function normalizePalette(data, warnings) {
  data.palette = ensureObject(data.palette);
  data.palette.groups = ensureObject(data.palette.groups);

  const flatColors = ensureArray(data.palette.colors);

  for (const [group, expectedCount] of Object.entries(
    REQUIRED_PALETTE_GROUPS
  )) {
    let groupColors = ensureArray(data.palette.groups[group]);

    if (groupColors.length === 0 && flatColors.length > 0) {
      groupColors = flatColors.filter(color => color && color.group === group);
    }

    groupColors = groupColors.map((color, index) =>
      normalizeColor(color, group, index)
    );

    if (groupColors.length < expectedCount) {
      warnings.push(
        `Палитровая группа "${group}" содержит ${groupColors.length} цветов вместо ${expectedCount}.`
      );
    }

    data.palette.groups[group] = groupColors;
  }

  data.palette.colors = [
    ...data.palette.groups.signature,
    ...data.palette.groups.core,
    ...data.palette.groups.additional,
    ...data.palette.groups.neutral,
    ...data.palette.groups.accent
  ];

  const missingRussianNames = data.palette.colors.filter(
    color => !color.name_ru || /^Цвет \d+$/.test(color.name_ru)
  ).length;

  if (missingRussianNames > 0) {
    warnings.push(
      `У ${missingRussianNames} цветов отсутствуют утверждённые русские названия.`
    );
  }
}

function normalizeOptionalContent(data) {
  if (!Array.isArray(data.harmony_guide)) {
    data.harmony_guide = [];
  }

  if (typeof data.important_note !== "string") {
    data.important_note = "";
  }
}

function validateManifestSeason(data, warnings) {
  const manifest =
    data.assets &&
    data.assets.pin_manifest;

  if (!isObject(manifest) || !Array.isArray(manifest.pins)) {
    return;
  }

  const seasonExists = manifest.pins.some(
    pin => pin && pin.slug === data.season.id
  );

  if (!seasonExists) {
    warnings.push(
      `В pin_manifest не найден сезон "${data.season.id}".`
    );
  }
}

function preparePassportData(rawInput) {
  const data = unwrapInput(rawInput);
  const warnings = ensureArray(data.warnings).map(String);

  normalizePassportMeta(data);
  normalizeSeason(data);
  normalizeConfidence(data);
  normalizeScales(data);
  normalizeTop3(data);
  normalizePalette(data, warnings);
  normalizeAssetManifest(data, warnings);
  normalizePhotoData(data, warnings);
  normalizeOptionalContent(data);
  validateManifestSeason(data, warnings);

  data.warnings = warnings;

  return data;
}

function buildPassport(rawInput) {
  try {
    const data = preparePassportData(rawInput);

    const page1Svg = buildPage1(data);
    const page2Svg = buildPage2(data);

    const passportId = sanitizeFilePart(
      data.passport.id,
      "diart_passport"
    );

    const seasonId = sanitizeFilePart(
      data.season.id,
      "season"
    );

    return {
      ok: true,
      stage: "passport_built",
      builder_version: BUILDER_VERSION,
      passport_id: data.passport.id,
      season_id: data.season.id,
      page_1_svg: page1Svg,
      page_2_svg: page2Svg,
      page_1_filename:
        `${passportId}_${seasonId}_page_1.svg`,
      page_2_filename:
        `${passportId}_${seasonId}_page_2.svg`,
      warnings: data.warnings
    };
  } catch (error) {
    return {
      ok: false,
      stage: "passport_builder_failed",
      builder_version: BUILDER_VERSION,
      error: {
        message:
          error && error.message
            ? error.message
            : "Неизвестная ошибка Passport Builder.",
        details:
          error && error.details
            ? error.details
            : null
      }
    };
  }
}

module.exports = {
  BUILDER_VERSION,
  preparePassportData,
  buildPassport
};
