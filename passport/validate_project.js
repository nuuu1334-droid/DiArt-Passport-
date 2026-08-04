/**
 * DiArt Passport
 * File: passport/validate_project.js
 * Version: 1.0.0
 *
 * Checks that the project is assembled correctly.
 */

"use strict";

const index = require("./index");

function validateProject() {

    const errors = [];

    if (!index.buildPassport)
        errors.push("buildPassport missing");

    if (!index.buildPage1)
        errors.push("buildPage1 missing");

    if (!index.buildPage2)
        errors.push("buildPage2 missing");

    if (!index.resolvePalette)
        errors.push("resolvePalette missing");

    if (!index.normalizePassportInput)
        errors.push("normalizePassportInput missing");

    if (!index.components)
        errors.push("components missing");

    return {

        ok: errors.length === 0,

        version: index.version,

        errors

    };

}

module.exports = {

    validateProject

};
