/**
 * DiArt Passport
 * File: passport/index.js
 * Version: 1.0.0
 *
 * Public API.
 */

"use strict";

const layout = require("./layout");
const svg = require("./svg");

const { buildPage1 } = require("./page1");
const { buildPage2 } = require("./page2");

const { buildPassport } = require("./passport_builder");

module.exports = {

    version: "1.0.0",

    layout,

    svg,

    buildPage1,

    buildPage2,

    buildPassport

};
