/**
 * DiArt Passport
 * File: passport/page2.js
 * Version: 2.0.0
 *
 * Second page of the approved passport.
 */

"use strict";

const layout = require("./layout");
const svg = require("./svg");
const { drawLogo } = require("./components/logo");
const { paletteGrid } = require("./components/palette_grid");
const { footer } = require("./components/footer");

function panel(x,y,w,h){
return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="28"
fill="#FFFDFC" stroke="#E4D8CC"/>`;
}

function txt(v,x,y,s,w=400,c="#241912"){
return `<text x="${x}" y="${y}" font-family="Arial"
font-size="${s}" font-weight="${w}" fill="${c}">${v}</text>`;
}

function buildPage2(data){

const L=layout.PAGE_2;

let out="";

out+=svg.svg(layout.PAGE.width,layout.PAGE.height,layout.PAGE.viewBox);

out+=svg.defs(svg.shadowFilter("shadow"));

out+=`<rect width="${layout.PAGE.width}" height="${layout.PAGE.height}" fill="#FCF8F4"/>`;

out+=panel(L.header.x,L.header.y,L.header.width,L.header.height);

out+=drawLogo({
href:data.assets.logo,
x:L.logo.x,
y:L.logo.y,
width:L.logo.width,
height:L.logo.height
});

out+=txt("Персональная палитра",L.header.x+150,L.header.y+62,38,700);

out+=paletteGrid({
palette:data.palette,
x:L.palette.x,
y:L.palette.y
});

out+=panel(L.recommendations.x,L.recommendations.y,L.recommendations.width,L.recommendations.height);

out+=txt("Лучше всего подходят",L.recommendations.x+24,L.recommendations.y+42,26,700);

(data.palette.signature||[]).slice(0,6).forEach((c,i)=>{
out+=txt("• "+(c.name_ru||c.hex),L.recommendations.x+34,L.recommendations.y+86+i*32,20);
});

out+=panel(L.avoid.x,L.avoid.y,L.avoid.width,L.avoid.height);

out+=txt("Избегать",L.avoid.x+24,L.avoid.y+42,26,700);

(data.palette.avoid||[]).slice(0,6).forEach((c,i)=>{
out+=txt("• "+(c.name_ru||c.hex),L.avoid.x+34,L.avoid.y+86+i*32,20);
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
sloganY:L.footer.sloganY,
serviceInfo:data.passport.id
});

out+=svg.end();

return out;

}

module.exports={buildPage2};
