/**
 * DiArt Passport
 * File: passport/components/photo.js
 * Version: 1.0.0
 *
 * Renders:
 * - main portrait
 * - eye crop
 * - hair crop
 * - skin crop
 */

"use strict";

function portrait({
  href,
  x,
  y,
  width,
  height,
  radius = 28
}) {

return `
<defs>
<clipPath id="portraitClip">
<rect
x="${x}"
y="${y}"
width="${width}"
height="${height}"
rx="${radius}"/>
</clipPath>
</defs>

<image
href="${href}"
x="${x}"
y="${y}"
width="${width}"
height="${height}"
clip-path="url(#portraitClip)"
preserveAspectRatio="xMidYMid slice"/>
`;
}

function crop({
id,
href,
x,
y,
size
}){

const r=size/2;

return `
<defs>
<clipPath id="${id}">
<circle
cx="${x+r}"
cy="${y+r}"
r="${r}"/>
</clipPath>
</defs>

<image
href="${href}"
x="${x}"
y="${y}"
width="${size}"
height="${size}"
clip-path="url(#${id})"
preserveAspectRatio="xMidYMid slice"/>

<circle
cx="${x+r}"
cy="${y+r}"
r="${r}"
fill="none"
stroke="#FFFFFF"
stroke-width="4"/>
`;
}

module.exports={
portrait,
crop
};
