/**
 * DiArt Passport
 * File: passport/components/scales.js
 * Version: 1.0.0
 *
 * Draws Temperature / Value / Chroma / Contrast scales.
 */

"use strict";

function scale({
title,
value,
leftLabel,
rightLabel,
x,
y,
width=340,
pinColor="#8B5E3C"
}){

const pinX=x+(width*value);

return `
<text
x="${x}"
y="${y}"
font-family="Arial"
font-size="26"
font-weight="700"
fill="#241912">${title}</text>

<text
x="${x}"
y="${y+58}"
font-size="20"
fill="#7A6A60">${leftLabel}</text>

<text
x="${x+width}"
y="${y+58}"
text-anchor="end"
font-size="20"
fill="#7A6A60">${rightLabel}</text>

<line
x1="${x}"
y1="${y+84}"
x2="${x+width}"
y2="${y+84}"
stroke="#DDD2C7"
stroke-width="6"
stroke-linecap="round"/>

<circle
cx="${pinX}"
cy="${y+84}"
r="12"
fill="${pinColor}"/>

<circle
cx="${pinX}"
cy="${y+84}"
r="20"
fill="none"
stroke="${pinColor}"
stroke-width="2"/>
`;
}

module.exports={
scale
};
