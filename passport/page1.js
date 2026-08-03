/**
 * DiArt Passport
 * File: passport/page1.js
 * Version: 1.0.0
 *
 * Assembles Page 1 from components.
 */

"use strict";

const layout = require("./layout");
const svg = require("./svg");

const { drawLogo } = require("./components/logo");
const { portrait, crop } = require("./components/photo");
const { scale } = require("./components/scales");
const { orbit } = require("./components/color_orbit");
const { naturalPalette } = require("./components/natural_palette");
const { footer } = require("./components/footer");

function buildPage1(data){

const L=layout.PAGE_1;

let out="";

out+=svg.svg(
layout.PAGE.width,
layout.PAGE.height,
layout.PAGE.viewBox
);

out+=svg.defs(svg.shadowFilter());

out+=svg.rect(
0,
0,
layout.PAGE.width,
layout.PAGE.height,
layout.COLORS.paper
);

out+=drawLogo({
href:data.assets.logo,
x:L.logo.x,
y:L.logo.y,
width:L.logo.width,
height:L.logo.height
});

out+=portrait({
href:data.source.photo_url,
x:L.portrait.x,
y:L.portrait.y,
width:L.portrait.width,
height:L.portrait.height
});

out+=naturalPalette({
skin:data.natural_colors.skin,
eyes:data.natural_colors.eye,
hair:data.natural_colors.hair,
x:L.naturalPalette.x+22,
y:L.naturalPalette.y+54
});

out+=orbit({
cx:L.orbit.centerX,
cy:L.orbit.centerY,
radius:L.orbit.outerRadius,
active:data.season.id,
top3:data.top3.map(x=>x.season_id)
});

out+=scale({
title:"Temperature",
value:data.scales.temperature.position,
leftLabel:"Cool",
rightLabel:"Warm",
x:1040,
y:390
});

out+=scale({
title:"Value",
value:data.scales.depth.position,
leftLabel:"Light",
rightLabel:"Deep",
x:1040,
y:545
});

out+=scale({
title:"Contrast",
value:data.scales.contrast.position,
leftLabel:"Low",
rightLabel:"High",
x:1040,
y:700
});

out+=scale({
title:"Chroma",
value:data.scales.clarity.position,
leftLabel:"Soft",
rightLabel:"Bright",
x:1040,
y:855
});

out+=footer({
x:L.footer.x,
y:L.footer.y,
width:L.footer.width,
height:L.footer.height,
logoUrl:data.assets.logo,
logoX:L.footer.logoX,
logoY:L.footer.logoY,
logoWidth:L.footer.logoWidth,
logoHeight:L.footer.logoHeight,
sloganY:L.footer.sloganY
});

out+=svg.end();

return out;

}

module.exports={
buildPage1
};
