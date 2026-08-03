/**
 * DiArt Passport
 * File: passport/svg.js
 * Version: 1.0.0
 */

"use strict";

const SVG_NS = "http://www.w3.org/2000/svg";

function svg(width, height, viewBox) {
  return `<svg xmlns="${SVG_NS}" width="${width}" height="${height}" viewBox="${viewBox}">`;
}

function end() {
  return "</svg>";
}

function defs(content = "") {
  return `<defs>${content}</defs>`;
}

function group(content = "", attrs = "") {
  return `<g ${attrs}>${content}</g>`;
}

function rect(x, y, width, height, fill = "none", rx = 0, attrs = "") {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}" fill="${fill}" ${attrs}/>`;
}

function circle(cx, cy, r, fill = "none", attrs = "") {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${attrs}/>`;
}

function line(x1, y1, x2, y2, attrs = "") {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${attrs}/>`;
}

function image(href, x, y, width, height, attrs = "") {
  return `<image href="${href}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" ${attrs}/>`;
}

function text(value, x, y, attrs = "") {
  return `<text x="${x}" y="${y}" ${attrs}>${escape(value)}</text>`;
}

function path(d, attrs = "") {
  return `<path d="${d}" ${attrs}/>`;
}

function clipPath(id, body) {
  return `<clipPath id="${id}">${body}</clipPath>`;
}

function shadowFilter(id="shadow"){
  return `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%">
<feDropShadow dx="0" dy="8" stdDeviation="12" flood-opacity="0.15"/>
</filter>`;
}

function escape(v){
  return String(v)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;");
}

module.exports = {
  svg,
  end,
  defs,
  group,
  rect,
  circle,
  line,
  image,
  text,
  path,
  clipPath,
  shadowFilter
};
