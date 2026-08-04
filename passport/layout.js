/**
 * DiArt Color Passport
 * File: passport/layout.js
 * Version: 3.0.0-approved
 *
 * Fixed geometry for the approved DiArt Color Passport mockup.
 * One page: 768 × 1024 px.
 */

"use strict";

const LAYOUT_VERSION = "3.0.0-approved";

const PAGE = Object.freeze({
  width: 768,
  height: 1024,
  viewBox: "0 0 768 1024",
  outerRadius: 18,
  margin: 4
});

const TOKENS = Object.freeze({
  pageBackground: "#FBF7F1",
  panelBackground: "#FFFDFC",
  panelSoft: "#F8F0E8",
  ink: "#24160F",
  muted: "#6C5B50",
  line: "#E7DDD3",
  accentFallback: "#7B3F20",
  white: "#FFFFFF",
  panelRadius: 16,
  cardRadius: 10,
  thinStroke: 1,
  mediumStroke: 1.4
});

const PAGE_1 = Object.freeze({
  logo: Object.freeze({ x: 28, y: 24, width: 204, height: 146 }),

  identity: Object.freeze({
    x: 245, y: 28, width: 370, height: 154,
    eyebrowY: 48,
    titleRuY: 92,
    titleEnY: 126,
    descriptionY: 151,
    descriptionLineHeight: 20
  }),

  confidence: Object.freeze({
    x: 620, y: 28, width: 132, height: 154,
    labelY: 49,
    percentY: 106,
    starsY: 142,
    pillX: 632,
    pillY: 153,
    pillWidth: 108,
    pillHeight: 24
  }),

  portrait: Object.freeze({
    x: 28, y: 194, width: 302, height: 334, radius: 18
  }),

  scalesPanel: Object.freeze({
    x: 344, y: 194, width: 408, height: 334, radius: 18,
    rowHeight: 83.5,
    iconX: 374,
    titleX: 420,
    labelsX: 546,
    scaleX1: 596,
    scaleX2: 724,
    rows: Object.freeze({
      temperature: Object.freeze({ top: 208 }),
      depth: Object.freeze({ top: 291 }),
      contrast: Object.freeze({ top: 374 }),
      clarity: Object.freeze({ top: 457 })
    })
  }),

  naturalPalette: Object.freeze({
    x: 28, y: 542, width: 338, height: 298, radius: 18,
    titleX: 52,
    titleY: 574,
    itemY: 603,
    itemWidth: 100,
    itemGap: 5,
    columns: Object.freeze([
      Object.freeze({ x: 40, centerX: 90 }),
      Object.freeze({ x: 145, centerX: 195 }),
      Object.freeze({ x: 250, centerX: 300 })
    ]),
    cropSize: 88,
    cropY: 620,
    swatchY: 720,
    swatchSize: 13,
    swatchGap: 5,
    nameY: 758,
    hexY: 805
  }),

  nearestSeasons: Object.freeze({
    x: 378, y: 542, width: 374, height: 298, radius: 18,
    titleX: 468,
    titleY: 574,
    donutCenterX: 486,
    donutCenterY: 676,
    donutOuterRadius: 93,
    donutInnerRadius: 48,
    listX: 594,
    listY: 614,
    listRowHeight: 59,
    pinSize: 36,
    noteX: 415,
    noteY: 814,
    noteWidth: 302
  }),

  meta: Object.freeze({
    x: 28, y: 858, width: 724, height: 88, radius: 14,
    columns: Object.freeze([
      Object.freeze({ x: 56, width: 206 }),
      Object.freeze({ x: 281, width: 206 }),
      Object.freeze({ x: 506, width: 206 })
    ]),
    iconY: 878,
    labelY: 891,
    valueY: 917,
    divider1X: 268,
    divider2X: 493
  }),

  footer: Object.freeze({
    x: 28, y: 956, width: 724, height: 60,
    logoX: 298,
    logoY: 942,
    logoWidth: 172,
    logoHeight: 54,
    sloganY: 1006,
    leftStarX: 276,
    rightStarX: 492
  })
});

const PAGE_2 = Object.freeze({
  header: Object.freeze({
    titleX: 384,
    titleY: 47,
    leftStarX: 168,
    rightStarX: 600
  }),

  palette12: Object.freeze({
    x: 28, y: 76, width: 712, height: 385, radius: 16,
    titleY: 102,
    gridX: 42,
    gridY: 118,
    columns: 6,
    rows: 2,
    cardWidth: 103,
    cardHeight: 154,
    gapX: 10,
    gapY: 18,
    colorHeight: 78,
    nameY: 102,
    hexY: 137
  }),

  neutral: Object.freeze({
    x: 28, y: 474, width: 350, height: 195, radius: 16,
    titleY: 505,
    swatchX: 45,
    swatchY: 526,
    swatchWidth: 45,
    swatchHeight: 76,
    gap: 9,
    nameY: 619,
    hexY: 647
  }),

  accent: Object.freeze({
    x: 390, y: 474, width: 350, height: 195, radius: 16,
    titleY: 505,
    swatchX: 407,
    swatchY: 526,
    swatchWidth: 45,
    swatchHeight: 76,
    gap: 9,
    nameY: 619,
    hexY: 647
  }),

  usage: Object.freeze({
    x: 28, y: 686, width: 350, height: 235, radius: 16,
    titleX: 86,
    titleY: 716,
    iconX: 48,
    textX: 88,
    rowY: 750,
    rowHeight: 45,
    iconSize: 28
  }),

  important: Object.freeze({
    x: 390, y: 686, width: 350, height: 235, radius: 16,
    starX: 426,
    starY: 728,
    titleX: 463,
    titleY: 735,
    textX: 414,
    textY: 778,
    textWidth: 178,
    lineHeight: 22,
    branchX: 590,
    branchY: 705,
    branchWidth: 130,
    branchHeight: 196
  }),

  footer: Object.freeze({
    x: 28, y: 938, width: 712, height: 78,
    logoX: 298,
    logoY: 922,
    logoWidth: 172,
    logoHeight: 54,
    sloganY: 1007,
    leftStarX: 276,
    rightStarX: 492
  })
});

function validateBox(name, box, errors) {
  if (
    typeof box.x !== "number" ||
    typeof box.y !== "number" ||
    typeof box.width !== "number" ||
    typeof box.height !== "number"
  ) {
    errors.push(`${name}: invalid box.`);
    return;
  }

  if (
    box.x < 0 ||
    box.y < 0 ||
    box.x + box.width > PAGE.width ||
    box.y + box.height > PAGE.height
  ) {
    errors.push(`${name}: outside page bounds.`);
  }
}

function validateLayout() {
  const errors = [];

  [
    ["PAGE_1.portrait", PAGE_1.portrait],
    ["PAGE_1.scalesPanel", PAGE_1.scalesPanel],
    ["PAGE_1.naturalPalette", PAGE_1.naturalPalette],
    ["PAGE_1.nearestSeasons", PAGE_1.nearestSeasons],
    ["PAGE_1.meta", PAGE_1.meta],
    ["PAGE_1.footer", PAGE_1.footer],
    ["PAGE_2.palette12", PAGE_2.palette12],
    ["PAGE_2.neutral", PAGE_2.neutral],
    ["PAGE_2.accent", PAGE_2.accent],
    ["PAGE_2.usage", PAGE_2.usage],
    ["PAGE_2.important", PAGE_2.important],
    ["PAGE_2.footer", PAGE_2.footer]
  ].forEach(([name, box]) => validateBox(name, box, errors));

  return {
    ok: errors.length === 0,
    errors
  };
}

module.exports = {
  LAYOUT_VERSION,
  PAGE,
  TOKENS,
  PAGE_1,
  PAGE_2,
  validateLayout
};
