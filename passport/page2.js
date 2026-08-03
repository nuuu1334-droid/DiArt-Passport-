/**
 * DiArt Passport
 * File: passport/page2.js
 * Version: 1.0.0
 *
 * Assembles Page 2.
 */

"use strict";

const layout = require("./layout");
const svg = require("./svg");

const { drawLogo } = require("./components/logo");
const { paletteGrid } = require("./components/palette_grid");
const { footer } = require("./components/footer");

function buildPage2(data){

const L=layout.PAGE_2;

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

out+=svg.text(
"Персональная палитра",
80,
110,
'font-size="56" font-family="Georgia" font-weight="700" fill="#241912"'
);

out+=paletteGrid({
colors:data.palette.colors,
x:L.paletteGallery.gridX,
y:L.paletteGallery.gridY
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
buildPage2
};
