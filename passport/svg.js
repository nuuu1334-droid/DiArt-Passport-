/**
 * DiArt Passport
 * File: passport/svg.js
 * Version: 2.0.0
 *
 * Shared SVG helpers for both passport pages.
 */

"use strict";

const SVG_VERSION = "2.0.0";
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function attrs(attributes = {}) {
  return Object.entries(attributes)
    .filter(([, value]) =>
      value !== undefined &&
      value !== null &&
      value !== false &&
      value !== ""
    )
    .map(([key, value]) => `${key}="${esc(value)}"`)
    .join(" ");
}

function svg(width, height, viewBox) {
  return `<svg xmlns="${SVG_NAMESPACE}" width="${width}" height="${height}" viewBox="${esc(viewBox)}">`;
}

function end() {
  return "</svg>";
}

function defs(content = "") {
  return `<defs>${content}</defs>`;
}

function group(content = "", attributes = {}) {
  return `<g ${attrs(attributes)}>${content}</g>`;
}

function rect({
  x,
  y,
  width,
  height,
  rx = 0,
  ry = null,
  fill = "none",
  stroke = null,
  strokeWidth = null,
  opacity = null,
  filter = null,
  id = null
}) {
  return `<rect ${attrs({
    id,
    x,
    y,
    width,
    height,
    rx,
    ry: ry ?? rx,
    fill,
    stroke,
    "stroke-width": strokeWidth,
    opacity,
    filter
  })}/>`;
}

function circle({
  cx,
  cy,
  r,
  fill = "none",
  stroke = null,
  strokeWidth = null,
  opacity = null,
  filter = null,
  id = null
}) {
  return `<circle ${attrs({
    id,
    cx,
    cy,
    r,
    fill,
    stroke,
    "stroke-width": strokeWidth,
    opacity,
    filter
  })}/>`;
}

function line({
  x1,
  y1,
  x2,
  y2,
  stroke = "#000000",
  strokeWidth = 1,
  linecap = null,
  dasharray = null,
  opacity = null
}) {
  return `<line ${attrs({
    x1,
    y1,
    x2,
    y2,
    stroke,
    "stroke-width": strokeWidth,
    "stroke-linecap": linecap,
    "stroke-dasharray": dasharray,
    opacity
  })}/>`;
}

function image({
  href,
  x,
  y,
  width,
  height,
  preserveAspectRatio = "xMidYMid slice",
  clipPath = null,
  opacity = null
}) {
  if (!href) return "";

  return `<image ${attrs({
    href,
    x,
    y,
    width,
    height,
    preserveAspectRatio,
    "clip-path": clipPath,
    opacity
  })}/>`;
}

function text({
  value,
  x,
  y,
  fontFamily = "Arial, Helvetica, sans-serif",
  fontSize = 24,
  fontWeight = 400,
  fill = "#241912",
  textAnchor = "start",
  letterSpacing = 0,
  fontStyle = null,
  opacity = null
}) {
  return `<text ${attrs({
    x,
    y,
    "font-family": fontFamily,
    "font-size": fontSize,
    "font-weight": fontWeight,
    fill,
    "text-anchor": textAnchor,
    "letter-spacing": letterSpacing,
    "font-style": fontStyle,
    opacity
  })}>${esc(value)}</text>`;
}

function path({
  d,
  fill = "none",
  stroke = null,
  strokeWidth = null,
  linecap = null,
  linejoin = null,
  opacity = null,
  filter = null
}) {
  return `<path ${attrs({
    d,
    fill,
    stroke,
    "stroke-width": strokeWidth,
    "stroke-linecap": linecap,
    "stroke-linejoin": linejoin,
    opacity,
    filter
  })}/>`;
}

function clipPath(id, content) {
  return `<clipPath id="${esc(id)}">${content}</clipPath>`;
}

function shadowFilter(
  id = "shadow",
  {
    dx = 0,
    dy = 8,
    stdDeviation = 12,
    floodColor = "#000000",
    floodOpacity = 0.15
  } = {}
) {
  return `
<filter id="${esc(id)}" x="-25%" y="-25%" width="150%" height="160%">
  <feDropShadow
    dx="${dx}"
    dy="${dy}"
    stdDeviation="${stdDeviation}"
    flood-color="${floodColor}"
    flood-opacity="${floodOpacity}"/>
</filter>`;
}

function linearGradient(
  id,
  stops,
  {
    x1 = "0%",
    y1 = "0%",
    x2 = "100%",
    y2 = "100%"
  } = {}
) {
  const body = (Array.isArray(stops) ? stops : [])
    .map(stop => `<stop ${attrs({
      offset: stop.offset,
      "stop-color": stop.color,
      "stop-opacity": stop.opacity
    })}/>`).join("");

  return `<linearGradient ${attrs({ id, x1, y1, x2, y2 })}>${body}</linearGradient>`;
}

module.exports = {
  SVG_VERSION,
  SVG_NAMESPACE,
  esc,
  attrs,
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
  shadowFilter,
  linearGradient
};
