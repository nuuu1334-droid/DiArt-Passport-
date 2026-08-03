/**
 * DiArt Passport
 * File: passport/components/cards.js
 * Version: 1.0.0
 */

"use strict";

function panel({
  x,
  y,
  width,
  height,
  radius = 24,
  fill = "#FFFFFF",
  stroke = "#E7DDD3",
  strokeWidth = 1.5,
  shadow = true
}) {

  const filter = shadow ? ' filter="url(#shadow)"' : "";

  return `
<rect
    x="${x}"
    y="${y}"
    width="${width}"
    height="${height}"
    rx="${radius}"
    fill="${fill}"
    stroke="${stroke}"
    stroke-width="${strokeWidth}"${filter}
/>`;
}

function sectionTitle({
  title,
  x,
  y
}) {

  return `
<text
    x="${x}"
    y="${y}"
    font-family="Georgia"
    font-size="34"
    font-weight="700"
    fill="#241912">
${title}
</text>`;
}

function divider({
  x1,
  y1,
  x2,
  y2
}) {

  return `
<line
    x1="${x1}"
    y1="${y1}"
    x2="${x2}"
    y2="${y2}"
    stroke="#E7DDD3"
    stroke-width="1"/>
`;
}

function badge({
  x,
  y,
  width,
  height,
  text,
  fill="#F4ECE4",
  color="#241912"
}) {

  return `
<rect
    x="${x}"
    y="${y}"
    width="${width}"
    height="${height}"
    rx="${height/2}"
    fill="${fill}"/>

<text
    x="${x+width/2}"
    y="${y+height/2+8}"
    text-anchor="middle"
    font-family="Arial"
    font-size="22"
    font-weight="600"
    fill="${color}">
${text}
</text>`;
}

module.exports = {
  panel,
  sectionTitle,
  divider,
  badge
};
