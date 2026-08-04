/**
 * DiArt Passport
 * File: passport/layout.js
 * Version: 2.0.0
 *
 * Final geometry for the approved two-page passport.
 * SVG viewBox: 0 0 1536 2048
 */

"use strict";

const LAYOUT_VERSION = "2.0.0";

const PAGE = Object.freeze({
  width: 1536,
  height: 2048,
  viewBox: "0 0 1536 2048",
  outerRadius: 34,
  margin: 38
});

const COLORS = Object.freeze({
  paper: "#FBF7F1",
  paperAlt: "#FFFDFC",
  ink: "#241912",
  muted: "#71645B",
  border: "#E4D8CC",
  line: "#DED2C6",
  white: "#FFFFFF"
});

const PAGE_1 = Object.freeze({
  header: Object.freeze({
    x: 56,
    y: 48,
    width: 1424,
    height: 278
  }),

  logo: Object.freeze({
    x: 62,
    y: 58,
    width: 250,
    height: 188
  }),

  identity: Object.freeze({
    x: 318,
    y: 58,
    width: 760,
    height: 220,
    eyebrowY: 82,
    titleRuY: 150,
    titleEnY: 210,
    descriptionY: 254
  }),

  confidence: Object.freeze({
    x: 1110,
    y: 66,
    width: 338,
    height: 226,
    labelY: 100,
    percentY: 190,
    starsY: 230,
    pillY: 266
  }),

  portrait: Object.freeze({
    x: 56,
    y: 338,
    width: 570,
    height: 664
  }),

  scalesPanel: Object.freeze({
    x: 652,
    y: 338,
    width: 828,
    height: 664
  }),

  scaleRows: Object.freeze({
    temperature: Object.freeze({ y: 366 }),
    depth: Object.freeze({ y: 523 }),
    contrast: Object.freeze({ y: 680 }),
    clarity: Object.freeze({ y: 837 })
  }),

  naturalPalette: Object.freeze({
    x: 56,
    y: 1026,
    width: 626,
    height: 616,
    titleY: 1080,
    cropY: 1164,
    columns: Object.freeze([
      Object.freeze({ x: 78, width: 182 }),
      Object.freeze({ x: 278, width: 182 }),
      Object.freeze({ x: 478, width: 182 })
    ])
  }),

  orbit: Object.freeze({
    x: 706,
    y: 1026,
    width: 774,
    height: 616,
    titleY: 1080,
    centerX: 1092,
    centerY: 1320,
    outerRadius: 176,
    noteY: 1576
  }),

  service: Object.freeze({
    x: 56,
    y: 1668,
    width: 1424,
    height: 166,
    itemWidth: 474.6666667,
    labelY: 1726,
    valueY: 1774,
    divider1X: 530.6666667,
    divider2X: 1005.3333333
  }),

  footer: Object.freeze({
    x: 56,
    y: 1850,
    width: 1424,
    height: 138,
    logoX: 650,
    logoY: 1858,
    logoWidth: 236,
    logoHeight: 84,
    sloganY: 1970
  })
});

const PAGE_2 = Object.freeze({
  header: Object.freeze({
    x: 56,
    y: 48,
    width: 1424,
    height: 120,
    titleY: 108
  }),

  paletteGallery: Object.freeze({
    x: 56,
    y: 182,
    width: 1424,
    height: 744,
    titleY: 232
  }),

  neutralBase: Object.freeze({
    x: 56,
    y: 954,
    width: 696,
    height: 372,
    titleY: 1006,
    swatchesX: 84,
    swatchesY: 1060,
    swatchWidth: 86,
    swatchHeight: 190,
    gap: 20
  }),

  accents: Object.freeze({
    x: 780,
    y: 954,
    width: 700,
    height: 372,
    titleY: 1006,
    swatchesX: 808,
    swatchesY: 1060,
    swatchWidth: 86,
    swatchHeight: 190,
    gap: 20
  }),

  harmonyGuide: Object.freeze({
    x: 56,
    y: 1354,
    width: 868,
    height: 446,
    titleY: 1410,
    itemX: 88,
    textX: 182,
    itemStartY: 1470,
    itemGap: 86
  }),

  important: Object.freeze({
    x: 952,
    y: 1354,
    width: 528,
    height: 446,
    titleY: 1452,
    textX: 1004,
    textY: 1530,
    branchX: 1240,
    branchY: 1432,
    branchWidth: 204,
    branchHeight: 318
  }),

  footer: Object.freeze({
    x: 56,
    y: 1824,
    width: 1424,
    height: 164,
    logoX: 650,
    logoY: 1842,
    logoWidth: 236,
    logoHeight: 84,
    sloganY: 1970
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
    ["PAGE_1.header", PAGE_1.header],
    ["PAGE_1.portrait", PAGE_1.portrait],
    ["PAGE_1.scalesPanel", PAGE_1.scalesPanel],
    ["PAGE_1.naturalPalette", PAGE_1.naturalPalette],
    ["PAGE_1.orbit", PAGE_1.orbit],
    ["PAGE_1.service", PAGE_1.service],
    ["PAGE_1.footer", PAGE_1.footer],
    ["PAGE_2.header", PAGE_2.header],
    ["PAGE_2.paletteGallery", PAGE_2.paletteGallery],
    ["PAGE_2.neutralBase", PAGE_2.neutralBase],
    ["PAGE_2.accents", PAGE_2.accents],
    ["PAGE_2.harmonyGuide", PAGE_2.harmonyGuide],
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
  COLORS,
  PAGE_1,
  PAGE_2,
  validateLayout
};
