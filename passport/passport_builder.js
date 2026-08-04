/**
 * DiArt Passport
 * File: passport/passport_builder.js
 * Version: 2.0.0
 *
 * Final builder.
 * Builds both SVG pages.
 */

"use strict";

const { buildPage1 } = require("./page1");
const { buildPage2 } = require("./page2");

const PASSPORT_BUILDER_VERSION = "2.0.0";

function buildPassport(input) {
  if (!input || typeof input !== "object") {
    throw new Error("Passport Builder: input is missing.");
  }

  const page1 = buildPage1(input);
  const page2 = buildPage2(input);

  return {
    ok: true,
    builder_version: PASSPORT_BUILDER_VERSION,
    season: input.season ? input.season.id : null,
    confidence: input.confidence ? input.confidence.percent : null,
    pages: {
      page1_svg: page1,
      page2_svg: page2
    }
  };
}

module.exports = {
  PASSPORT_BUILDER_VERSION,
  buildPassport
};
