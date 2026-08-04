/**
 * DiArt Passport
 * File: passport/components/palette_grid.js
 * Version: 2.0.0
 *
 * Renders grouped palette blocks:
 * signature, core, additional, neutral, accent.
 */

"use strict";

const PALETTE_GRID_VERSION = "2.0.0";

function esc(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function arr(v){return Array.isArray(v)?v:[];}

function title(text,x,y){
return `<text x="${x}" y="${y}" font-family="Arial" font-size="22" font-weight="700" fill="#241912">${esc(text)}</text>`;
}

function swatch(hex,name,x,y,w,h){
return `<g>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${hex}"/>
<text x="${x+w/2}" y="${y+h+22}" text-anchor="middle" font-family="Arial" font-size="14" fill="#241912">${esc(name||"")}</text>
<text x="${x+w/2}" y="${y+h+40}" text-anchor="middle" font-family="Arial" font-size="12" fill="#71645B">${hex}</text>
</g>`;
}

function block(label,colors,x,y,cols){
let out=title(label,x,y);
const cellW=78,cellH=54,gap=16;
arr(colors).forEach((c,i)=>{
 const col=i%cols,row=Math.floor(i/cols);
 out+=swatch(c.hex||"#CCC",c.name_ru||"",x+col*(cellW+gap),y+18+row*104,cellW,cellH);
});
return out;
}

function paletteGrid({palette,x,y}){
palette=palette||{};
let out="";
out+=block("Signature",palette.signature,x,y,3);
out+=block("Core",palette.core,x,y+270,4);
out+=block("Additional",palette.additional,x,y+640,4);
out+=block("Neutral",palette.neutral,x+470,y,3);
out+=block("Accent",palette.accent,x+470,y+270,3);
return out;
}

module.exports={
PALETTE_GRID_VERSION,
paletteGrid
};
