/**
 * DiArt Passport
 * File: passport/passport_builder.js
 * Version: 3.1.0
 *
 * Final entry point.
 * Accepts either:
 * - normalized passport object
 * - wrapper from passport_input_adapter.js
 *
 * Returns:
 * - two SVG pages
 * - file names
 * - passport metadata
 * - warnings
 */

"use strict";

const { buildPage1 } = require("./page1");
const { buildPage2 } = require("./page2");

const PASSPORT_BUILDER_VERSION = "3.1.0";

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function unwrapInput(input) {
  if (
    isObject(input) &&
    input.ok === true &&
    input.stage === "passport_input_normalized" &&
    isObject(input.result)
  ) {
    return input.result;
  }

  if (isObject(input) && isObject(input.result) && input.result.season) {
    return input.result;
  }

  if (isObject(input) && input.season) {
    return input;
  }

  throw new Error(
    "Passport Builder: не удалось распознать входные данные."
  );
}

function sanitizeFilePart(value, fallback) {
  const result = String(value || fallback || "passport")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё_-]+/gi, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return result || fallback || "passport";
}

function validate(data) {
  if (!isObject(data)) {
    throw new Error("Passport Builder: data is missing.");
  }

  if (!isObject(data.season) || !data.season.id) {
    throw new Error("Passport Builder: season.id is missing.");
  }

  if (!isObject(data.confidence)) {
    throw new Error("Passport Builder: confidence is missing.");
  }

  if (!isObject(data.scales)) {
    throw new Error("Passport Builder: scales are missing.");
  }

  if (!Array.isArray(data.top3) || data.top3.length < 3) {
    throw new Error("Passport Builder: top3 must contain 3 seasons.");
  }

  if (!isObject(data.palette)) {
    throw new Error("Passport Builder: palette is missing.");
  }

  if (
    !isObject(data.assets) ||
    !isObject(data.assets.pin_manifest)
  ) {
    throw new Error(
      "Passport Builder: assets.pin_manifest is missing."
    );
  }
}

function buildPassport(input) {
  try {
    const data = unwrapInput(input);
    validate(data);

    const page1Svg = buildPage1(data);
    const page2Svg = buildPage2(data);

    const passportId = sanitizeFilePart(
      data.passport && data.passport.id,
      "diart_passport"
    );

    const seasonId = sanitizeFilePart(
      data.season.id,
      "season"
    );

    return {
      ok: true,
      stage: "passport_built",
      builder_version: PASSPORT_BUILDER_VERSION,

      passport_id:
        data.passport && data.passport.id
          ? data.passport.id
          : null,

      season_id: data.season.id,

      confidence_percent:
        Number.isFinite(Number(data.confidence.percent))
          ? Number(data.confidence.percent)
          : null,

      page_1_svg: page1Svg,
      page_2_svg: page2Svg,

      page_1_filename:
        `${passportId}_${seasonId}_page_1.svg`,

      page_2_filename:
        `${passportId}_${seasonId}_page_2.svg`,

      warnings:
        Array.isArray(data.warnings)
          ? data.warnings
          : []
    };
  } catch (error) {
    return {
      ok: false,
      stage: "passport_builder_failed",
      builder_version: PASSPORT_BUILDER_VERSION,
      error: {
        message:
          error && error.message
            ? error.message
            : "Неизвестная ошибка Passport Builder."
      }
    };
  }
}

module.exports = {
  PASSPORT_BUILDER_VERSION,
  buildPassport
};
