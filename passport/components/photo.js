/**
 * DiArt Passport
 * File: passport/components/photo.js
 * Version: 2.0.0
 *
 * Renders:
 * - main portrait
 * - circular photo samples for eye, hair and skin
 *
 * Supports:
 * - direct image URLs
 * - normalized crop regions
 * - safe XML escaping
 * - unique clipPath IDs
 */

"use strict";

const PHOTO_COMPONENT_VERSION = "2.0.0";

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function clamp(value, min, max) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return min;
  }

  return Math.min(max, Math.max(min, number));
}

function safeId(value, fallback) {
  const text = String(value || fallback || "clip")
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return text || fallback || "clip";
}

function imageElement({
  href,
  x,
  y,
  width,
  height,
  clipPathId = "",
  preserveAspectRatio = "xMidYMid slice",
  opacity = 1
}) {
  if (!href) return "";

  return `
<image
  href="${esc(href)}"
  x="${x}"
  y="${y}"
  width="${width}"
  height="${height}"
  opacity="${clamp(opacity, 0, 1)}"
  preserveAspectRatio="${esc(preserveAspectRatio)}"
  ${clipPathId ? `clip-path="url(#${safeId(clipPathId)})"` : ""}/>`;
}

function portrait({
  href,
  x,
  y,
  width,
  height,
  radius = 28,
  clipId = "portraitClip",
  borderColor = "#FFFFFF",
  borderWidth = 0,
  background = "#F1E8DF"
}) {
  const id = safeId(clipId, "portraitClip");

  let out = `
<defs>
  <clipPath id="${id}">
    <rect
      x="${x}"
      y="${y}"
      width="${width}"
      height="${height}"
      rx="${radius}"/>
  </clipPath>
</defs>

<rect
  x="${x}"
  y="${y}"
  width="${width}"
  height="${height}"
  rx="${radius}"
  fill="${background}"/>`;

  out += imageElement({
    href,
    x,
    y,
    width,
    height,
    clipPathId: id
  });

  if (borderWidth > 0) {
    out += `
<rect
  x="${x}"
  y="${y}"
  width="${width}"
  height="${height}"
  rx="${radius}"
  fill="none"
  stroke="${borderColor}"
  stroke-width="${borderWidth}"/>`;
  }

  return out;
}

function normalizedCropToImageBox({
  region,
  targetX,
  targetY,
  targetWidth,
  targetHeight
}) {
  const safeRegion = region && typeof region === "object"
    ? region
    : {};

  const rx = clamp(safeRegion.x, 0, 1);
  const ry = clamp(safeRegion.y, 0, 1);
  const rw = clamp(safeRegion.width, 0.01, 1);
  const rh = clamp(safeRegion.height, 0.01, 1);

  const scale = Math.max(
    targetWidth / rw,
    targetHeight / rh
  );

  return {
    x: targetX - rx * scale,
    y: targetY - ry * scale,
    width: scale,
    height: scale
  };
}

function circularSample({
  id,
  href,
  x,
  y,
  size,
  region = null,
  fill = "#CCCCCC",
  borderColor = "#FFFFFF",
  borderWidth = 4,
  shadow = false
}) {
  const clipId = safeId(id, "sampleClip");
  const radius = size / 2;
  const cx = x + radius;
  const cy = y + radius;

  let out = `
<defs>
  <clipPath id="${clipId}">
    <circle cx="${cx}" cy="${cy}" r="${radius}"/>
  </clipPath>
</defs>

<circle
  cx="${cx}"
  cy="${cy}"
  r="${radius}"
  fill="${fill}"
  ${shadow ? 'filter="url(#shadow)"' : ""}/>`;

  if (href) {
    if (region && typeof region === "object") {
      const box = normalizedCropToImageBox({
        region,
        targetX: x,
        targetY: y,
        targetWidth: size,
        targetHeight: size
      });

      out += imageElement({
        href,
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        clipPathId: clipId
      });
    } else {
      out += imageElement({
        href,
        x,
        y,
        width: size,
        height: size,
        clipPathId: clipId
      });
    }
  }

  out += `
<circle
  cx="${cx}"
  cy="${cy}"
  r="${radius}"
  fill="none"
  stroke="${borderColor}"
  stroke-width="${borderWidth}"/>`;

  return out;
}

function eyeSample(options) {
  return circularSample({
    ...options,
    id: options.id || "eyeSampleClip"
  });
}

function hairSample(options) {
  return circularSample({
    ...options,
    id: options.id || "hairSampleClip"
  });
}

function skinSample(options) {
  return circularSample({
    ...options,
    id: options.id || "skinSampleClip"
  });
}

module.exports = {
  PHOTO_COMPONENT_VERSION,
  portrait,
  circularSample,
  eyeSample,
  hairSample,
  skinSample,
  normalizedCropToImageBox
};
