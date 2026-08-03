/**
 * DiArt Passport Input Adapter
 * Version: 1.0.0
 *
 * Purpose:
 * Converts the real DiArt Color Engine v4.9.1 output plus Make inputs
 * into one stable object for Passport Builder.js.
 *
 * Expected Make Code input fields:
 * - engineResult      required: Color Engine module result (object or JSON string)
 * - photoUrl          required: original Cloudinary image URL
 * - aiModel           optional: visible model label, e.g. "GPT-4.1"
 * - paletteDatabase   required later: DiArt Palette Database v2.1 (object or JSON string)
 * - createdAt         optional: "DD.MM.YYYY" or ISO date
 * - passportId        optional
 * - clientName        optional
 * - assets            optional: object or JSON string
 * - photoSamples      optional: object or JSON string
 *
 * Make entry point:
 * return main(input);
 */

"use strict";

const ADAPTER_VERSION = "1.0.0";

const SEASONS = Object.freeze({
  light_spring: {
    id: "light_spring",
    name_ru: "Светлая Весна",
    name_en: "Light Spring",
    description_ru: "Светлый, тёплый и свежий природный колорит"
  },
  true_spring: {
    id: "true_spring",
    name_ru: "Тёплая Весна",
    name_en: "True Spring",
    description_ru: "Тёплый, ясный и золотистый природный колорит"
  },
  bright_spring: {
    id: "bright_spring",
    name_ru: "Яркая Весна",
    name_en: "Bright Spring",
    description_ru: "Яркий, тёплый и контрастный природный колорит"
  },
  light_summer: {
    id: "light_summer",
    name_ru: "Светлое Лето",
    name_en: "Light Summer",
    description_ru: "Светлый, прохладный и мягкий природный колорит"
  },
  true_summer: {
    id: "true_summer",
    name_ru: "Истинное Лето",
    name_en: "True Summer",
    description_ru: "Прохладный, спокойный и гармоничный природный колорит"
  },
  soft_summer: {
    id: "soft_summer",
    name_ru: "Мягкое Лето",
    name_en: "Soft Summer",
    description_ru: "Мягкий, прохладный и приглушённый природный колорит"
  },
  soft_autumn: {
    id: "soft_autumn",
    name_ru: "Мягкая Осень",
    name_en: "Soft Autumn",
    description_ru: "Мягкий, тёплый и приглушённый природный колорит"
  },
  true_autumn: {
    id: "true_autumn",
    name_ru: "Истинная Осень",
    name_en: "True Autumn",
    description_ru: "Тёплый, насыщенный и землистый природный колорит"
  },
  deep_autumn: {
    id: "deep_autumn",
    name_ru: "Глубокая Осень",
    name_en: "Deep Autumn",
    description_ru: "Тёплый, глубокий и насыщенный природный колорит"
  },
  bright_winter: {
    id: "bright_winter",
    name_ru: "Яркая Зима",
    name_en: "Bright Winter",
    description_ru: "Яркий, прохладный и контрастный природный колорит"
  },
  true_winter: {
    id: "true_winter",
    name_ru: "Истинная Зима",
    name_en: "True Winter",
    description_ru: "Прохладный, чистый и контрастный природный колорит"
  },
  deep_winter: {
    id: "deep_winter",
    name_ru: "Глубокая Зима",
    name_en: "Deep Winter",
    description_ru: "Прохладный, глубокий и контрастный природный колорит"
  }
});

const CLASSIFICATION_LABELS = Object.freeze({
  temperature: {
    cool: "Холодная",
    neutral_cool: "Нейтрально-холодная",
    neutral: "Нейтральная",
    neutral_warm: "Нейтрально-тёплая",
    warm: "Тёплая"
  },
  depth: {
    light: "Светлая",
    light_medium: "Светло-средняя",
    medium: "Средняя",
    medium_deep: "Средне-глубокая",
    deep: "Глубокая",
    very_dark: "Очень глубокая",
    very_deep: "Очень глубокая"
  },
  clarity: {
    muted: "Приглушённая",
    soft: "Мягкая",
    balanced: "Сбалансированная",
    clear: "Чистая",
    bright: "Яркая",
    moderate: "Сбалансированная"
  },
  contrast: {
    low: "Низкий",
    medium: "Средний",
    high: "Высокий",
    moderate: "Средний"
  }
});

const NATURAL_COLOR_LABELS = Object.freeze({
  black: "Чёрный",
  soft_black: "Мягкий чёрный",
  dark_brown: "Тёмно-коричневый",
  medium_brown: "Коричневый",
  light_brown: "Светло-коричневый",
  golden_brown: "Золотисто-коричневый",
  warm_brown: "Тёплый коричневый",
  cool_brown: "Холодный коричневый",
  ash_brown: "Пепельно-коричневый",
  chestnut: "Каштановый",
  dark_chestnut: "Тёмно-каштановый",
  hazel: "Ореховый",
  amber: "Янтарный",
  green: "Зелёный",
  olive_green: "Оливково-зелёный",
  gray_green: "Серо-зелёный",
  blue: "Голубой",
  dark_blue: "Тёмно-синий",
  gray_blue: "Серо-голубой",
  gray: "Серый"
});

function fail(message, details) {
  const error = new Error(message);
  error.details = details || null;
  throw error;
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parseMaybeJson(value, fieldName, fallback) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (isObject(value) || Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string") {
    fail(`Поле "${fieldName}" должно быть объектом или JSON-строкой.`, {
      field: fieldName,
      received_type: typeof value
    });
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

function unwrapMakeBundle(value) {
  let current = value;

  // Typical pasted Make output: [ { result: { ... } } ]
  if (Array.isArray(current)) {
    if (current.length === 0) {
      fail("Color Engine вернул пустой массив.");
    }
    current = current[0];
  }

  // Typical Make Code module wrapper: { logs, executionTimeMs, result }
  if (
    isObject(current) &&
    isObject(current.result) &&
    Object.prototype.hasOwnProperty.call(current.result, "runtime_version")
  ) {
    current = current.result;
  }

  // Additional defensive unwrapping: { result: { ok, runtime_version, ... } }
  if (
    isObject(current) &&
    !Object.prototype.hasOwnProperty.call(current, "runtime_version") &&
    isObject(current.result) &&
    Object.prototype.hasOwnProperty.call(current.result, "runtime_version")
  ) {
    current = current.result;
  }

  return current;
}

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function round(value, digits) {
  const factor = Math.pow(10, digits);
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

function normalizeHex(value, fallback) {
  if (typeof value !== "string") return fallback;
  const raw = value.trim().toUpperCase();

  if (/^#[0-9A-F]{6}$/.test(raw)) return raw;
  if (/^[0-9A-F]{6}$/.test(raw)) return `#${raw}`;

  return fallback;
}

function sumValues(object, keys) {
  return keys.reduce((sum, key) => {
    const value = Number(object && object[key]);
    return sum + (Number.isFinite(value) ? Math.max(0, value) : 0);
  }, 0);
}

function weightedPosition(scores, weights, fallback) {
  if (!isObject(scores)) return fallback;

  const keys = Object.keys(weights);
  const total = sumValues(scores, keys);

  if (total <= 0) return fallback;

  const weighted = keys.reduce((sum, key) => {
    const score = Number(scores[key]);
    if (!Number.isFinite(score) || score < 0) return sum;
    return sum + score * weights[key];
  }, 0);

  return clamp(weighted / total, 0, 1);
}

function getTemperaturePosition(scores) {
  return weightedPosition(
    scores,
    { cool: 0, neutral: 0.5, warm: 1 },
    0.5
  );
}

function getDepthPosition(scores) {
  return weightedPosition(
    scores,
    { light: 0, medium: 0.5, deep: 1 },
    0.5
  );
}

function getClarityPosition(scores) {
  return weightedPosition(
    scores,
    {
      muted: 0,
      soft: 0.25,
      balanced: 0.5,
      clear: 0.75,
      bright: 1
    },
    0.5
  );
}

function getContrastPosition(scores) {
  return weightedPosition(
    scores,
    { low: 0, medium: 0.5, high: 1 },
    0.5
  );
}

function getConfidenceLabel(percent) {
  const value = clamp(percent, 0, 100);

  if (value >= 90) return "Очень высокая достоверность";
  if (value >= 75) return "Высокая достоверность";
  if (value >= 60) return "Вероятное совпадение";
  return "Предварительный результат";
}

function titleCaseRussian(value) {
  if (typeof value !== "string" || value.length === 0) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function compactSkinName(skin) {
  const surfaceTone = String(skin && skin.surface_tone || "").trim();
  const undertone = String(skin && skin.undertone_observation || "").trim();
  const family = String(skin && skin.undertone_family || "").trim();
  const depth = String(skin && skin.depth || "").trim();

  const depthLabels = {
    very_light: "Очень светлый",
    light: "Светлый",
    light_medium: "Светлый",
    medium: "Средний",
    medium_deep: "Средне-глубокий",
    deep: "Глубокий",
    dark: "Глубокий"
  };

  const undertoneLabels = {
    warm: "тёплый",
    neutral_warm: "нейтрально-тёплый",
    neutral: "нейтральный",
    neutral_cool: "нейтрально-холодный",
    cool: "холодный"
  };

  const familyLabels = {
    beige_neutral: "бежевый",
    beige_warm: "тёплый бежевый",
    beige_cool: "холодный бежевый",
    peach: "персиковый",
    peach_beige: "бежево-персиковый",
    olive: "оливковый",
    golden: "золотисто-бежевый",
    rosy: "розовато-бежевый"
  };

  const generated = [
    depthLabels[depth] || "",
    familyLabels[family] || undertoneLabels[undertone] || ""
  ].filter(Boolean).join(" ");

  if (generated) {
    return titleCaseRussian(generated);
  }

  if (surfaceTone) {
    const shortened = surfaceTone
      .replace(/\s+с\s+л[её]гкой.*$/i, "")
      .replace(/\s+с\s+выраженной.*$/i, "")
      .trim();

    return titleCaseRussian(shortened || surfaceTone);
  }

  return "Оттенок кожи";
}

function mapNaturalColorName(value, fallback) {
  const key = String(value || "").trim().toLowerCase();
  if (NATURAL_COLOR_LABELS[key]) return NATURAL_COLOR_LABELS[key];

  if (key) {
    return titleCaseRussian(key.replace(/_/g, " "));
  }

  return fallback;
}

function buildSeasonReference(seasonId) {
  const season = SEASONS[seasonId];

  if (!season) {
    fail(`Неизвестный цветотип "${seasonId}".`, {
      season_id: seasonId,
      allowed_seasons: Object.keys(SEASONS)
    });
  }

  return { ...season };
}

function buildScale(dimension, key, labelKey, positionCalculator) {
  if (!isObject(dimension)) {
    fail(`В Color Engine отсутствует dimension_results.${key}.`);
  }

  const classification = String(dimension.classification || "").trim();
  const labels = CLASSIFICATION_LABELS[labelKey] || {};

  return {
    classification,
    label_ru: labels[classification] || titleCaseRussian(classification.replace(/_/g, " ")),
    confidence: round(clamp(dimension.confidence, 0, 1), 3),
    position: round(positionCalculator(dimension.scores || {}), 3),
    scores: isObject(dimension.scores) ? { ...dimension.scores } : {}
  };
}

function buildTop3(seasonRanking) {
  if (!Array.isArray(seasonRanking) || seasonRanking.length < 3) {
    fail("Color Engine должен вернуть минимум три элемента season_ranking.");
  }

  return seasonRanking
    .filter(item => isObject(item) && !item.hard_excluded)
    .sort((a, b) => {
      const rankA = Number.isFinite(Number(a.rank)) ? Number(a.rank) : 999;
      const rankB = Number.isFinite(Number(b.rank)) ? Number(b.rank) : 999;
      return rankA - rankB;
    })
    .slice(0, 3)
    .map((item, index) => {
      const season = buildSeasonReference(String(item.season_id || "").trim());
      const rawScore = Number(
        item.score_after_modifiers !== undefined
          ? item.score_after_modifiers
          : item.base_score
      );

      return {
        rank: index + 1,
        season_id: season.id,
        name_ru: season.name_ru,
        name_en: season.name_en,
        score: round(clamp(rawScore, 0, 100), 1)
      };
    });
}

function findPaletteSeason(database, seasonId) {
  if (!database) return null;

  const seasons = Array.isArray(database.seasons) ? database.seasons : [];
  return seasons.find(item => item && item.id === seasonId) || null;
}

function normalizePaletteSeason(database, seasonId, warnings) {
  if (!database) {
    warnings.push("paletteDatabase не передана. Палитровые блоки пока недоступны.");
    return null;
  }

  const season = findPaletteSeason(database, seasonId);

  if (!season) {
    warnings.push(`В Palette Database не найден сезон "${seasonId}".`);
    return null;
  }

  const colors = Array.isArray(season.colors) ? season.colors : [];

  const normalizeColor = color => ({
    palette_entry_id: color.palette_entry_id || null,
    color_id: color.color_id || null,
    slug: color.slug || null,
    name_ru: color.name && color.name.ru ? color.name.ru : null,
    name_en: color.name && color.name.en ? color.name.en : null,
    group: color.group || null,
    hex: normalizeHex(color.canonical_hex, "#CCCCCC")
  });

  const normalizedColors = colors.map(normalizeColor);

  const byGroup = group => normalizedColors.filter(color => color.group === group);

  const groups = {
    signature: byGroup("signature"),
    core: byGroup("core"),
    additional: byGroup("additional"),
    neutral: byGroup("neutral"),
    accent: byGroup("accent")
  };

  const expectedCounts = {
    signature: 4,
    core: 4,
    additional: 4,
    neutral: 6,
    accent: 6
  };

  Object.keys(expectedCounts).forEach(group => {
    if (groups[group].length !== expectedCounts[group]) {
      warnings.push(
        `Группа "${group}" содержит ${groups[group].length} цветов вместо ${expectedCounts[group]}.`
      );
    }
  });

  const missingRussianNames = normalizedColors.filter(color => !color.name_ru).length;

  if (missingRussianNames > 0) {
    warnings.push(
      `У ${missingRussianNames} цветов сезона "${seasonId}" отсутствуют русские названия.`
    );
  }

  return {
    season_id: seasonId,
    name: season.name || null,
    colors: normalizedColors,
    groups
  };
}

function formatDate(value) {
  if (typeof value === "string" && /^\d{2}\.\d{2}\.\d{4}$/.test(value.trim())) {
    return value.trim();
  }

  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    fail(`Некорректная дата createdAt: "${value}".`);
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

function createPassportId(provided, seasonId) {
  const cleanProvided = String(provided || "").trim();
  if (cleanProvided) return cleanProvided;

  const timestamp = Date.now().toString(36).toUpperCase();
  const seasonCode = seasonId
    .split("_")
    .map(part => part.charAt(0))
    .join("")
    .toUpperCase();

  return `DIART-${seasonCode}-${timestamp}`;
}

function validateEngine(engine) {
  if (!isObject(engine)) {
    fail("engineResult не содержит объект Color Engine.");
  }

  if (engine.ok !== true) {
    fail("Color Engine завершился без ok=true.", {
      ok: engine.ok,
      stage: engine.stage
    });
  }

  if (engine.stage !== "completed") {
    fail("Color Engine не завершил полный расчёт.", {
      stage: engine.stage
    });
  }

  if (!isObject(engine.result)) {
    fail("В Color Engine отсутствует итоговый объект result.");
  }

  if (!engine.result.best_match) {
    fail("В Color Engine отсутствует result.best_match.");
  }

  if (!isObject(engine.dimension_results)) {
    fail("В Color Engine отсутствует dimension_results.");
  }

  if (!Array.isArray(engine.season_ranking)) {
    fail("В Color Engine отсутствует season_ranking.");
  }
}

function buildNaturalColors(observedColors) {
  const observed = isObject(observedColors) ? observedColors : {};
  const eyes = isObject(observed.eyes) ? observed.eyes : {};
  const hair = isObject(observed.hair) ? observed.hair : {};
  const skin = isObject(observed.skin) ? observed.skin : {};

  return {
    eye: {
      hex: normalizeHex(eyes.hex, "#777777"),
      name_ru: mapNaturalColorName(eyes.primary_color, "Оттенок глаз"),
      technical_name: eyes.primary_color || null,
      secondary_description: eyes.secondary_color || null,
      confidence: round(clamp(eyes.confidence, 0, 1), 3)
    },
    hair: {
      hex: normalizeHex(hair.hex, "#555555"),
      name_ru: mapNaturalColorName(hair.primary_color, "Оттенок волос"),
      technical_name: hair.primary_color || null,
      confidence: round(clamp(hair.confidence, 0, 1), 3)
    },
    skin: {
      hex: normalizeHex(skin.hex, "#D8B49A"),
      name_ru: compactSkinName(skin),
      technical_name: skin.surface_tone || null,
      confidence: round(clamp(skin.confidence, 0, 1), 3)
    }
  };
}

function normalizePhotoSamples(value, naturalColors) {
  const samples = isObject(value) ? value : {};

  function normalizeSample(key, natural) {
    const sample = isObject(samples[key]) ? samples[key] : {};
    const swatches = Array.isArray(sample.swatches)
      ? sample.swatches
          .map(item => normalizeHex(item, null))
          .filter(Boolean)
          .slice(0, 6)
      : [];

    return {
      url: typeof sample.url === "string" ? sample.url.trim() : "",
      name_ru: typeof sample.name_ru === "string" && sample.name_ru.trim()
        ? sample.name_ru.trim()
        : natural.name_ru,
      hex: normalizeHex(sample.hex, natural.hex),
      swatches
    };
  }

  return {
    eye: normalizeSample("eye", naturalColors.eye),
    hair: normalizeSample("hair", naturalColors.hair),
    skin: normalizeSample("skin", naturalColors.skin)
  };
}

function main(input) {
  try {
    if (!isObject(input)) {
      fail("Make Code не передал объект input.");
    }

    const engineRaw = parseMaybeJson(input.engineResult, "engineResult", null);
    const engine = unwrapMakeBundle(engineRaw);
    validateEngine(engine);

    const paletteDatabase = parseMaybeJson(
      input.paletteDatabase,
      "paletteDatabase",
      null
    );

    const assets = parseMaybeJson(input.assets, "assets", {});
    const rawPhotoSamples = parseMaybeJson(
      input.photoSamples,
      "photoSamples",
      {}
    );

    const warnings = [];

    const seasonId = String(engine.result.best_match).trim();
    const season = buildSeasonReference(seasonId);

    const confidencePercent = Math.round(
      clamp(engine.result.confidence_percent, 0, 100)
    );

    const dimensions = engine.dimension_results;
    const naturalColors = buildNaturalColors(engine.observed_colors);
    const photoSamples = normalizePhotoSamples(rawPhotoSamples, naturalColors);
    const normalizedPalette = normalizePaletteSeason(
      paletteDatabase,
      seasonId,
      warnings
    );

    const photoUrl = typeof input.photoUrl === "string"
      ? input.photoUrl.trim()
      : "";

    if (!photoUrl) {
      warnings.push("photoUrl не передан. Portrait Frame не сможет показать исходное фото.");
    }

    const normalized = {
      adapter: {
        name: "DiArt Passport Input Adapter",
        version: ADAPTER_VERSION
      },

      passport: {
        id: createPassportId(input.passportId, seasonId),
        created_at: formatDate(input.createdAt),
        client_name: typeof input.clientName === "string"
          ? input.clientName.trim()
          : "",
        ai_model: typeof input.aiModel === "string" && input.aiModel.trim()
          ? input.aiModel.trim()
          : "Не указана",
        engine_runtime_version: String(engine.runtime_version || ""),
        engine_internal_version:
          engine.engine && engine.engine.version
            ? String(engine.engine.version)
            : "",
        extractor_version:
          engine.extractor && engine.extractor.version
            ? String(engine.extractor.version)
            : "",
        database_version:
          paletteDatabase &&
          paletteDatabase.metadata &&
          paletteDatabase.metadata.version
            ? String(paletteDatabase.metadata.version)
            : ""
      },

      source: {
        photo_url: photoUrl
      },

      quality: {
        overall_quality:
          engine.quality && engine.quality.overall_quality
            ? engine.quality.overall_quality
            : null,
        continue_analysis:
          engine.quality && typeof engine.quality.continue_analysis === "boolean"
            ? engine.quality.continue_analysis
            : null,
        problems:
          engine.quality && Array.isArray(engine.quality.problems)
            ? engine.quality.problems
            : [],
        limitations:
          engine.quality && Array.isArray(engine.quality.limitations)
            ? engine.quality.limitations
            : [],
        extractor_global_reliability:
          engine.extractor && engine.extractor.global_reliability !== undefined
            ? round(clamp(engine.extractor.global_reliability, 0, 1), 3)
            : null
      },

      season,

      confidence: {
        value: round(clamp(engine.result.confidence, 0, 1), 3),
        percent: confidencePercent,
        level: String(engine.result.confidence_level || ""),
        label_ru: getConfidenceLabel(confidencePercent),
        decision_status: String(engine.result.decision_status || ""),
        score_gap_to_second: round(
          clamp(engine.result.score_gap_to_second, 0, 100),
          1
        ),
        request_better_photo: Boolean(engine.result.request_better_photo)
      },

      scales: {
        temperature: buildScale(
          dimensions.temperature,
          "temperature",
          "temperature",
          getTemperaturePosition
        ),
        depth: buildScale(
          dimensions.value,
          "value",
          "depth",
          getDepthPosition
        ),
        clarity: buildScale(
          dimensions.chroma,
          "chroma",
          "clarity",
          getClarityPosition
        ),
        contrast: buildScale(
          dimensions.contrast,
          "contrast",
          "contrast",
          getContrastPosition
        )
      },

      top3: buildTop3(engine.season_ranking),

      natural_colors: naturalColors,

      photo_samples: photoSamples,

      palette: normalizedPalette,

      assets: isObject(assets) ? assets : {},

      diagnostics: {
        runtime_version: engine.runtime_version || null,
        loaded_files: Array.isArray(engine.loaded_files)
          ? engine.loaded_files
          : [],
        confusion_resolution: isObject(engine.confusion_resolution)
          ? engine.confusion_resolution
          : null
      },

      warnings
    };

    return {
      ok: true,
      stage: "passport_input_normalized",
      adapter_version: ADAPTER_VERSION,
      result: normalized
    };
  } catch (error) {
    return {
      ok: false,
      stage: "passport_input_adapter_failed",
      adapter_version: ADAPTER_VERSION,
      error: {
        message: error && error.message
          ? error.message
          : "Неизвестная ошибка адаптера.",
        details: error && error.details ? error.details : null
      }
    };
  }
}

return main(input);
