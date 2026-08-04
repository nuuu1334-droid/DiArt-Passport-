/**
 * DiArt Passport
 * File: make/make_diart_passport_pipeline.js
 * Version: 1.0.0
 *
 * Full Make runtime:
 * Color Engine output
 * + Palette Database
 * + Master Color Library
 * + manifest / assets
 * -> Palette Resolver
 * -> Passport Input Adapter
 * -> Passport Builder
 * -> two SVG pages
 *
 * Required Make inputs:
 * SOURCE FILES FROM GIT:
 * - layoutSource
 * - svgSource
 * - logoSource
 * - photoSource
 * - colorOrbitSource
 * - naturalPaletteSource
 * - footerSource
 * - page1Source
 * - page2Source
 * - passportBuilderSource
 * - paletteResolverSource
 * - passportInputAdapterSource
 *
 * DATA:
 * - engineResult
 * - paletteDatabase
 * - masterColorLibrary
 * - pinManifest
 * - photoUrl
 * - logoUrl
 *
 * OPTIONAL:
 * - photoSamples
 * - aiModel
 * - clientName
 * - createdAt
 * - passportId
 * - harmonyGuide
 * - importantNote
 */

"use strict";

const PIPELINE_VERSION = "1.0.0";

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parseMaybeJson(value, fieldName, fallback = null) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (isObject(value) || Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string") {
    throw new Error(
      `Поле "${fieldName}" должно быть объектом или JSON-строкой.`
    );
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(
      `Не удалось разобрать JSON в поле "${fieldName}": ${error.message}`
    );
  }
}

function normalizePath(path) {
  const parts = [];

  String(path || "")
    .replace(/\\/g, "/")
    .split("/")
    .forEach(part => {
      if (!part || part === ".") return;

      if (part === "..") {
        parts.pop();
        return;
      }

      parts.push(part);
    });

  let normalized = parts.join("/");

  if (!normalized.endsWith(".js")) {
    normalized += ".js";
  }

  return normalized;
}

function dirname(path) {
  const normalized = normalizePath(path);
  const parts = normalized.split("/");
  parts.pop();
  return parts.join("/");
}

function resolveRequest(fromId, request) {
  const raw = String(request || "").trim();

  if (!raw) {
    throw new Error(`Пустой require() в модуле "${fromId}".`);
  }

  if (raw.startsWith(".")) {
    return normalizePath(`${dirname(fromId)}/${raw}`);
  }

  return normalizePath(raw);
}

function createModuleSystem(sourceMap) {
  const cache = {};

  function load(moduleId) {
    const id = normalizePath(moduleId);

    if (cache[id]) {
      return cache[id].exports;
    }

    const source = sourceMap[id];

    if (typeof source !== "string" || !source.trim()) {
      throw new Error(`Исходный код модуля "${id}" не найден.`);
    }

    const module = {
      id,
      exports: {}
    };

    cache[id] = module;

    function localRequire(request) {
      return load(resolveRequest(id, request));
    }

    try {
      const execute = new Function(
        "module",
        "exports",
        "require",
        `"use strict";\n${source}\n//# sourceURL=${id}`
      );

      execute(module, module.exports, localRequire);
    } catch (error) {
      delete cache[id];

      throw new Error(
        `Ошибка выполнения модуля "${id}": ${error.message}`
      );
    }

    return module.exports;
  }

  return { load };
}

function buildSourceMap(input) {
  const sourceMap = {
    "passport/layout.js": input.layoutSource,
    "passport/svg.js": input.svgSource,
    "passport/components/logo.js": input.logoSource,
    "passport/components/photo.js": input.photoSource,
    "passport/components/color_orbit.js": input.colorOrbitSource,
    "passport/components/natural_palette.js": input.naturalPaletteSource,
    "passport/components/footer.js": input.footerSource,
    "passport/page1.js": input.page1Source,
    "passport/page2.js": input.page2Source,
    "passport/passport_builder.js": input.passportBuilderSource,
    "passport/palette_resolver.js": input.paletteResolverSource,
    "passport/passport_input_adapter.js": input.passportInputAdapterSource
  };

  const missing = Object.entries(sourceMap)
    .filter(([, source]) => typeof source !== "string" || !source.trim())
    .map(([moduleId]) => moduleId);

  if (missing.length) {
    throw new Error(
      `Не переданы исходники модулей: ${missing.join(", ")}`
    );
  }

  return sourceMap;
}

function runPipeline(input) {
  const sourceMap = buildSourceMap(input);
  const modules = createModuleSystem(sourceMap);

  const paletteResolver = modules.load(
    "passport/palette_resolver.js"
  );

  const passportAdapter = modules.load(
    "passport/passport_input_adapter.js"
  );

  const passportBuilder = modules.load(
    "passport/passport_builder.js"
  );

  if (
    !paletteResolver ||
    typeof paletteResolver.resolvePalette !== "function"
  ) {
    throw new Error(
      "palette_resolver.js не экспортирует resolvePalette()."
    );
  }

  if (
    !passportAdapter ||
    typeof passportAdapter.main !== "function"
  ) {
    throw new Error(
      "passport_input_adapter.js не экспортирует main()."
    );
  }

  if (
    !passportBuilder ||
    typeof passportBuilder.buildPassport !== "function"
  ) {
    throw new Error(
      "passport_builder.js не экспортирует buildPassport()."
    );
  }

  const engineResult = parseMaybeJson(
    input.engineResult,
    "engineResult"
  );

  const paletteDatabase = parseMaybeJson(
    input.paletteDatabase,
    "paletteDatabase"
  );

  const masterColorLibrary = parseMaybeJson(
    input.masterColorLibrary,
    "masterColorLibrary"
  );

  const pinManifest = parseMaybeJson(
    input.pinManifest,
    "pinManifest"
  );

  const photoSamples = parseMaybeJson(
    input.photoSamples,
    "photoSamples",
    {}
  );

  let seasonId = null;
  let engine = engineResult;

  if (Array.isArray(engine)) {
    engine = engine[0];
  }

  if (
    isObject(engine) &&
    isObject(engine.result) &&
    engine.result.runtime_version
  ) {
    engine = engine.result;
  }

  if (
    isObject(engine) &&
    isObject(engine.result) &&
    engine.result.best_match
  ) {
    seasonId = engine.result.best_match;
  }

  if (!seasonId) {
    throw new Error(
      "Не удалось получить best_match из Color Engine."
    );
  }

  const paletteResult = paletteResolver.resolvePalette({
    paletteDatabase,
    masterColorLibrary,
    seasonId
  });

  if (!paletteResult || paletteResult.ok !== true) {
    const message =
      paletteResult &&
      paletteResult.error &&
      paletteResult.error.message
        ? paletteResult.error.message
        : "Palette Resolver завершился с ошибкой.";

    throw new Error(message);
  }

  const adapterResult = passportAdapter.main({
    engineResult,
    paletteResult,
    pinManifest,
    photoUrl: input.photoUrl,
    logoUrl: input.logoUrl,
    photoSamples,
    aiModel: input.aiModel,
    clientName: input.clientName,
    createdAt: input.createdAt,
    passportId: input.passportId,
    harmonyGuide: input.harmonyGuide,
    importantNote: input.importantNote
  });

  if (!adapterResult || adapterResult.ok !== true) {
    const message =
      adapterResult &&
      adapterResult.error &&
      adapterResult.error.message
        ? adapterResult.error.message
        : "Passport Input Adapter завершился с ошибкой.";

    throw new Error(message);
  }

  const passportResult = passportBuilder.buildPassport(
    adapterResult
  );

  if (!passportResult || passportResult.ok !== true) {
    const message =
      passportResult &&
      passportResult.error &&
      passportResult.error.message
        ? passportResult.error.message
        : "Passport Builder завершился с ошибкой.";

    throw new Error(message);
  }

  return {
    ok: true,
    stage: "diart_passport_pipeline_completed",
    pipeline_version: PIPELINE_VERSION,

    season_id: passportResult.season_id,
    passport_id: passportResult.passport_id,
    confidence_percent:
      passportResult.confidence_percent,

    page_1_svg: passportResult.page_1_svg,
    page_2_svg: passportResult.page_2_svg,

    page_1_filename:
      passportResult.page_1_filename,

    page_2_filename:
      passportResult.page_2_filename,

    warnings: [
      ...(Array.isArray(paletteResult.warnings)
        ? paletteResult.warnings
        : []),
      ...(Array.isArray(adapterResult.result.warnings)
        ? adapterResult.result.warnings
        : []),
      ...(Array.isArray(passportResult.warnings)
        ? passportResult.warnings
        : [])
    ]
  };
}

function main(input) {
  try {
    if (!isObject(input)) {
      throw new Error("Make Code не передал объект input.");
    }

    return runPipeline(input);
  } catch (error) {
    return {
      ok: false,
      stage: "diart_passport_pipeline_failed",
      pipeline_version: PIPELINE_VERSION,
      error: {
        message:
          error && error.message
            ? error.message
            : "Неизвестная ошибка DiArt Passport Pipeline."
      }
    };
  }
}

return main(input);
