/**
 * DiArt Passport
 * File: passport/passport_builder.js
 * Version: 1.0.0
 *
 * Entry point.
 * Builds both passport pages.
 */

"use strict";

const { buildPage1 } = require("./page1");
const { buildPage2 } = require("./page2");

function validate(data){

if(!data) throw new Error("Passport data is missing.");

if(!data.season)
throw new Error("Season is missing.");

if(!data.palette)
throw new Error("Palette is missing.");

if(!data.source)
throw new Error("Photo source is missing.");

}

function buildPassport(data){

validate(data);

const page1 = buildPage1(data);
const page2 = buildPage2(data);

return {
    ok:true,
    version:"1.0.0",
    season:data.season.id,
    page1_svg:page1,
    page2_svg:page2
};

}

module.exports={
buildPassport
};
