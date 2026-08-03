/**
 * DiArt Color Passport — Layout
 * File: passport/layout.js
 * Version: 1.0.0
 * Fixed geometry for approved two-page passport.
 */

"use strict";

const LAYOUT_VERSION = "1.0.0";

const PAGE = Object.freeze({
  width: 1536,
  height: 2048,
  viewBox: "0 0 1536 2048",
  outerRadius: 34,
  margin: 38,
  contentLeft: 56,
  contentRight: 1480,
  contentTop: 48,
  contentBottom: 1988
});

const GRID = Object.freeze({ unit: 8, gutter: 24, smallGap: 12, mediumGap: 20, largeGap: 32 });
const RADII = Object.freeze({ page: 34, panel: 28, card: 22, smallCard: 16, photo: 30, swatch: 12, pill: 999 });
const STROKES = Object.freeze({ hairline: 1, regular: 1.5, strong: 2 });

const TYPOGRAPHY = Object.freeze({
  serif: "Georgia, 'Times New Roman', serif",
  sans: "Arial, Helvetica, sans-serif",
  sizes: Object.freeze({
    micro: 18, tiny: 20, small: 24, body: 28, bodyLarge: 32,
    label: 26, section: 34, subtitle: 38, titleEn: 46,
    titleRu: 66, confidence: 78, paletteName: 22,
    paletteHex: 20, footer: 20
  }),
  weights: Object.freeze({ regular: 400, medium: 500, semibold: 600, bold: 700 }),
  tracking: Object.freeze({ normal: 0, wide: 2, extraWide: 5 })
});

const COLORS = Object.freeze({
  paper: "#FBF7F1",
  paperAlt: "#FFFDFC",
  ink: "#241912",
  inkSoft: "#6F6259",
  border: "#E4D8CC",
  borderSoft: "#EEE5DC",
  white: "#FFFFFF",
  black: "#000000",
  shadow: "#000000"
});

const PAGE_1 = Object.freeze({
  header: Object.freeze({ x: 56, y: 48, width: 1424, height: 278 }),
  logo: Object.freeze({ x: 62, y: 58, width: 250, height: 188 }),
  identity: Object.freeze({
    x: 318, y: 58, width: 760, height: 220,
    eyebrowY: 78, titleRuY: 142, titleEnY: 206, descriptionY: 252
  }),
  confidence: Object.freeze({
    x: 1110, y: 66, width: 338, height: 226,
    labelY: 98, percentY: 188, starsY: 236, pillY: 258
  }),
  portrait: Object.freeze({
    x: 56, y: 338, width: 570, height: 664,
    imageX: 56, imageY: 338, imageWidth: 570, imageHeight: 664
  }),
  scalesPanel: Object.freeze({
    x: 652, y: 338, width: 828, height: 664,
    paddingX: 34, paddingTop: 28, rowHeight: 145, rowGap: 12
  }),
  scaleRows: Object.freeze({
    temperature: Object.freeze({ y: 366 }),
    depth: Object.freeze({ y: 523 }),
    contrast: Object.freeze({ y: 680 }),
    clarity: Object.freeze({ y: 837 })
  }),
  scale: Object.freeze({
    iconX: 690, iconSize: 86, titleX: 804,
    titleYDelta: 32, subtitleYDelta: 64,
    leftLabelX: 1052, rightLabelX: 1408, labelsYDelta: 34,
    lineX1: 1048, lineX2: 1394, lineYDelta: 82,
    pinWidth: 48, pinHeight: 60
  }),
  naturalPalette: Object.freeze({
    x: 56, y: 1026, width: 626, height: 616, titleY: 1080,
    columns: Object.freeze([
      Object.freeze({ x: 78, width: 182 }),
      Object.freeze({ x: 278, width: 182 }),
      Object.freeze({ x: 478, width: 182 })
    ]),
    cropY: 1164, cropSize: 154,
    swatchesY: 1344, swatchSize: 24, swatchGap: 8,
    nameY: 1424, hexY: 1482
  }),
  orbit: Object.freeze({
    x: 706, y: 1026, width: 774, height: 616, titleY: 1080,
    centerX: 1046, centerY: 1312, outerRadius: 176, innerRadius: 92,
    legendX: 1222, legendY: 1174, legendRowHeight: 96, noteY: 1578
  }),
  service: Object.freeze({
    x: 56, y: 1668, width: 1424, height: 166, itemWidth: 474,
    iconY: 1710, labelY: 1724, valueY: 1772,
    divider1X: 530, divider2X: 1004
  }),
  footer: Object.freeze({
    x: 56, y: 1850, width: 1424, height: 138,
    logoX: 650, logoY: 1858, logoWidth: 236, logoHeight: 84,
    sloganY: 1970
  })
});

const PAGE_2 = Object.freeze({
  header: Object.freeze({ x: 56, y: 48, width: 1424, height: 120, titleY: 110 }),
  paletteGallery: Object.freeze({
    x: 56, y: 182, width: 1424, height: 744, titleY: 232,
    gridX: 84, gridY: 270, columns: 6, rows: 2,
    cardWidth: 214, cardHeight: 286, columnGap: 20, rowGap: 26,
    colorHeight: 152
  }),
  neutralBase: Object.freeze({
    x: 56, y: 954, width: 696, height: 372, titleY: 1006,
    swatchesX: 84, swatchesY: 1060, swatchWidth: 86,
    swatchHeight: 190, gap: 20
  }),
  accents: Object.freeze({
    x: 780, y: 954, width: 700, height: 372, titleY: 1006,
    swatchesX: 808, swatchesY: 1060, swatchWidth: 86,
    swatchHeight: 190, gap: 20
  }),
  harmonyGuide: Object.freeze({
    x: 56, y: 1354, width: 868, height: 446, titleY: 1410,
    itemX: 88, textX: 182, itemStartY: 1470, itemGap: 86, iconSize: 56
  }),
  important: Object.freeze({
    x: 952, y: 1354, width: 528, height: 446,
    titleY: 1452, textX: 1004, textY: 1530,
    branchX: 1240, branchY: 1432, branchWidth: 204, branchHeight: 318
  }),
  footer: Object.freeze({
    x: 56, y: 1824, width: 1424, height: 164,
    logoX: 650, logoY: 1842, logoWidth: 236, logoHeight: 84,
    sloganY: 1970
  })
});

const COMPONENTS = Object.freeze({
  pin: Object.freeze({ sourceViewBox: "0 0 512 640", defaultWidth: 56, defaultHeight: 70 }),
  crop: Object.freeze({ diameter: 154, borderWidth: 4 }),
  swatch: Object.freeze({ small: 24, medium: 42, large: 86 }),
  star: Object.freeze({ small: 22, medium: 32, large: 44 }),
  icon: Object.freeze({ scale: 54, service: 48, guide: 56 })
});

function getPageLayout(pageNumber) {
  if (pageNumber === 1) return PAGE_1;
  if (pageNumber === 2) return PAGE_2;
  throw new Error(`Unknown page number: ${pageNumber}`);
}

function validateLayout() {
  const errors = [];
  const sections = [
    ["PAGE_1.header", PAGE_1.header],
    ["PAGE_1.portrait", PAGE_1.portrait],
    ["PAGE_1.scalesPanel", PAGE_1.scalesPanel],
    ["PAGE_1.naturalPalette", PAGE_1.naturalPalette],
    ["PAGE_1.orbit", PAGE_1.orbit],
    ["PAGE_1.service", PAGE_1.service],
    ["PAGE_1.footer", PAGE_1.footer],
    ["PAGE_2.paletteGallery", PAGE_2.paletteGallery],
    ["PAGE_2.neutralBase", PAGE_2.neutralBase],
    ["PAGE_2.accents", PAGE_2.accents],
    ["PAGE_2.harmonyGuide", PAGE_2.harmonyGuide],
    ["PAGE_2.important", PAGE_2.important],
    ["PAGE_2.footer", PAGE_2.footer]
  ];

  for (const [name, box] of sections) {
    if (box.x < 0 || box.y < 0 || box.x + box.width > PAGE.width || box.y + box.height > PAGE.height) {
      errors.push(`${name} is outside page bounds.`);
    }
  }

  return { ok: errors.length === 0, errors };
}

const DIART_LAYOUT = Object.freeze({
  version: LAYOUT_VERSION,
  PAGE,
  GRID,
  RADII,
  STROKES,
  TYPOGRAPHY,
  COLORS,
  PAGE_1,
  PAGE_2,
  COMPONENTS,
  getPageLayout,
  validateLayout
});

if (typeof module !== "undefined" && module.exports) {
  module.exports = DIART_LAYOUT;
}

DIART_LAYOUT;
