/**
 * DiArt Passport
 * File: passport/components/natural_palette.js
 * Version: 1.0.0
 *
 * Draws the natural colors block:
 * - Skin
 * - Eyes
 * - Hair
 */

"use strict";

function colorCard({
title,
hex,
name,
x,
y,
width=180,
height=250
}){

return `
<rect
x="${x}"
y="${y}"
width="${width}"
height="${height}"
rx="20"
fill="#FFFFFF"
stroke="#E5D9CD"/>

<text
x="${x+20}"
y="${y+36}"
font-family="Arial"
font-size="22"
font-weight="700"
fill="#241912">${title}</text>

<rect
x="${x+20}"
y="${y+58}"
width="${width-40}"
height="96"
rx="12"
fill="${hex}"/>

<text
x="${x+20}"
y="${y+182}"
font-family="Arial"
font-size="20"
fill="#241912">${name}</text>

<text
x="${x+20}"
y="${y+214}"
font-family="Arial"
font-size="18"
fill="#8A7B70">${hex}</text>
`;
}

function naturalPalette({
skin,
eyes,
hair,
x,
y
}){

return (
colorCard({
title:"Кожа",
hex:skin.hex,
name:skin.name_ru,
x:x,
y:y
})+

colorCard({
title:"Глаза",
hex:eyes.hex,
name:eyes.name_ru,
x:x+200,
y:y
})+

colorCard({
title:"Волосы",
hex:hair.hex,
name:hair.name_ru,
x:x+400,
y:y
})
);

}

module.exports={
naturalPalette
};
