/**
 * DiArt Passport
 * File: passport/components/palette_grid.js
 * Version: 1.0.0
 *
 * Draws seasonal palette grid.
 */

"use strict";

function swatch({
x,
y,
size=86,
hex,
name,
code
}){

return `
<rect
x="${x}"
y="${y}"
width="${size}"
height="${size}"
rx="12"
fill="${hex}"
stroke="#DDD2C7"/>

<text
x="${x}"
y="${y+108}"
font-size="18"
font-family="Arial"
fill="#241912">${name}</text>

<text
x="${x}"
y="${y+132}"
font-size="16"
font-family="Arial"
fill="#8A7B70">${code}</text>
`;
}

function paletteGrid({
colors,
x,
y,
columns=6,
cell=106,
gap=18
}){

let svg="";

colors.forEach((c,i)=>{

const col=i%columns;
const row=Math.floor(i/columns);

svg+=swatch({
x:x+col*(cell+gap),
y:y+row*(cell+56),
hex:c.hex,
name:c.name_ru,
code:c.hex
});

});

return svg;

}

module.exports={
paletteGrid
};
