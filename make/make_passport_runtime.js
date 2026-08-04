/**
 * DiArt Passport
 * File: make/make_passport_runtime.js
 * Version: 1.0.0
 *
 * Runs modular DiArt Passport source files inside Make Code.
 *
 * Make inputs:
 * - layoutSource
 * - svgSource
 * - logoSource
 * - photoSource
 * - scalesSource
 * - colorOrbitSource
 * - naturalPaletteSource
 * - paletteGridSource
 * - footerSource
 * - page1Source
 * - page2Source
 * - passportBuilderSource
 * - passportInput
 *
 * Each *Source field must contain the raw JavaScript text downloaded from Git.
 * passportInput may be an object or JSON string.
 */

"use strict";

const RUNTIME_VERSION = "1.0.0";

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parseMaybeJson(value, fieldName) {
  if (isObject(value) || Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Поле "${fieldName}" не передано.`);
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
    const base = dirname(fromId);
    return normalizePath(`${base}/${raw}`);
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

  return {
    load
  };
}

function buildSourceMap(input) {
  const required = {
    "passport/layout.js": input.layoutSource,
    "passport/svg.js": input.svgSource,
    "passport/components/logo.js": input.logoSource,
    "passport/components/photo.js": input.photoSource,
    "passport/components/scales.js": input.scalesSource,
    "passport/components/color_orbit.js": input.colorOrbitSource,
    "passport/components/natural_palette.js": input.naturalPaletteSource,
    "passport/components/palette_grid.js": input.paletteGridSource,
    "passport/components/footer.js": input.footerSource,
    "passport/page1.js": input.page1Source,
    "passport/page2.js": input.page2Source,
    "passport/passport_builder.js": input.passportBuilderSource
  };

  const missing = Object.entries(required)
    .filter(([, source]) => typeof source !== "string" || !source.trim())
    .map(([id]) => id);

  if (missing.length) {
    throw new Error(
      `Не передан исходный код модулей: ${missing.join(", ")}`
    );
  }

  return required;
}

function main(input) {
  try {
    if (!isObject(input)) {
      throw new Error("Make Code не передал объект input.");
    }

    const sourceMap = buildSourceMap(input);
    const passportInput = parseMaybeJson(
      input.passportInput,
      "passportInput"
    );

    const modules = createModuleSystem(sourceMap);
    const builder = modules.load("passport/passport_builder.js");

    if (!builder || typeof builder.buildPassport !== "function") {
      throw new Error(
        "passport_builder.js не экспортирует функцию buildPassport()."
      );
    }

    const result = builder.buildPassport(passportInput);

    return {
      runtime_ok: true,
      runtime_version: RUNTIME_VERSION,
      result
    };
  } catch (error) {
    return {
      runtime_ok: false,
      runtime_version: RUNTIME_VERSION,
      error: {
        message:
          error && error.message
            ? error.message
            : "Неизвестная ошибка Make Passport Runtime."
      }
    };
  }
}

return main(input);
