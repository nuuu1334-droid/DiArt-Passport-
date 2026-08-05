/**
 * DiArt Color Passport
 * File: passport/page1.js
 * Version: 3.0.0-approved
 *
 * Approved first page:
 * - official DiArt emblem
 * - season identity
 * - confidence block
 * - portrait
 * - four analysis scales
 * - natural palette
 * - Top-3 donut and nearest seasons
 * - service metadata
 * - branded footer
 */

"use strict";

const layout = require("./layout");
const svg = require("./svg");
const { drawLogo } = require("./components/logo");
const { portrait } = require("./components/photo");

const PAGE_1_VERSION = "3.0.0-approved";

function obj(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function arr(value) {
  return Array.isArray(value) ? value : [];
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function clamp(value, min = 0, max = 1) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function text({
  value,
  x,
  y,
  size,
  weight = 400,
  family = "Arial, Helvetica, sans-serif",
  fill = "#24160F",
  anchor = "start",
  tracking = 0,
  style = ""
}) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}"
    font-family="${family}" font-size="${size}" font-weight="${weight}"
    letter-spacing="${tracking}" fill="${fill}" style="${style}">${esc(value)}</text>`;
}

function panel(box, fill = "#FFFDFC", stroke = "#E7DDD3", radius = 16) {
  return `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}"
    rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
}

function wrapWords(value, maxChars) {
  const words = String(value || "").trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (!current || candidate.length <= maxChars) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function wrappedText({
  value,
  x,
  y,
  maxChars,
  maxLines,
  lineHeight,
  size,
  weight = 400,
  family = "Arial, Helvetica, sans-serif",
  fill = "#24160F",
  anchor = "start"
}) {
  return wrapWords(value, maxChars)
    .slice(0, maxLines)
    .map((line, index) =>
      text({
        value: line,
        x,
        y: y + index * lineHeight,
        size,
        weight,
        family,
        fill,
        anchor
      })
    )
    .join("");
}

function getPin(manifest, seasonId) {
  const normalized = seasonId === "true_spring" ? "warm_spring" : seasonId;
  return arr(obj(manifest).pins).find(pin => pin && pin.slug === normalized) || null;
}

function themeFrom(data) {
  const seasonId = obj(data.season).id;
  const manifest = obj(obj(data.assets).pin_manifest);
  const pin = getPin(manifest, seasonId);

  return {
    accent: pin && pin.color ? pin.color : "#7B3F20",
    ink: "#24160F",
    muted: "#6C5B50",
    line: "#E7DDD3",
    soft: "#F8F0E8",
    panel: "#FFFDFC",
    white: "#FFFFFF"
  };
}

function pinShape({
  cx,
  cy,
  size,
  color,
  symbol = "✦",
  selected = false
}) {
  const top = cy - size * 0.46;
  const bottom = cy + size * 0.54;
  const left = cx - size * 0.34;
  const right = cx + size * 0.34;
  const r = size * 0.31;

  return `
<g>
  <path d="
    M ${cx} ${bottom}
    C ${cx - size * 0.10} ${cy + size * 0.36},
      ${left} ${cy + size * 0.06},
      ${left} ${cy - size * 0.10}
    A ${r} ${r} 0 1 1 ${right} ${cy - size * 0.10}
    C ${right} ${cy + size * 0.06},
      ${cx + size * 0.10} ${cy + size * 0.36},
      ${cx} ${bottom}
    Z"
    fill="${color}"
    ${selected ? `stroke="#FFFFFF" stroke-width="${Math.max(1.4, size * 0.04)}"` : ""}/>
  <text x="${cx}" y="${top + size * 0.48}" text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="${size * 0.31}" font-weight="700" fill="#FFFFFF">${esc(symbol)}</text>
</g>`;
}

function seasonSymbol(seasonId) {
  const map = {
    light_spring: "✿",
    true_spring: "☼",
    warm_spring: "☼",
    bright_spring: "✹",
    light_summer: "✿",
    true_summer: "✦",
    soft_summer: "✿",
    soft_autumn: "❧",
    true_autumn: "❉",
    deep_autumn: "✦",
    bright_winter: "✦",
    true_winter: "❄",
    deep_winter: "◆"
  };
  return map[seasonId] || "✦";
}

function renderIdentity(data, theme) {
  const L = layout.PAGE_1;
  const season = obj(data.season);
  const confidence = obj(data.confidence);
  const assets = obj(data.assets);

  let out = "";

  out += drawLogo({
    href: assets.logo,
    x: L.logo.x,
    y: L.logo.y,
    width: L.logo.width,
    height: L.logo.height
  });

  out += text({
    value: "ТВОЙ ЦВЕТОТИП",
    x: L.identity.x + L.identity.width / 2,
    y: L.identity.eyebrowY,
    size: 14,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink,
    anchor: "middle",
    tracking: 1.1
  });

  out += text({
    value: season.name_ru || "",
    x: L.identity.x + L.identity.width / 2,
    y: L.identity.titleRuY,
    size: 38,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink,
    anchor: "middle"
  });

  out += text({
    value: season.name_en || "",
    x: L.identity.x + L.identity.width / 2,
    y: L.identity.titleEnY,
    size: 22,
    weight: 500,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink,
    anchor: "middle"
  });

  out += wrappedText({
    value: season.description_ru || "",
    x: L.identity.x + L.identity.width / 2,
    y: L.identity.descriptionY,
    maxChars: 34,
    maxLines: 2,
    lineHeight: L.identity.descriptionLineHeight,
    size: 15,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink,
    anchor: "middle"
  });

  out += panel(L.confidence, "#FFFDFC", theme.line, 14);

  out += text({
    value: "ДОСТОВЕРНОСТЬ АНАЛИЗА",
    x: L.confidence.x + L.confidence.width / 2,
    y: L.confidence.labelY,
    size: 8.5,
    weight: 700,
    fill: theme.ink,
    anchor: "middle"
  });

  out += text({
    value: `${confidence.percent ?? 0}%`,
    x: L.confidence.x + L.confidence.width / 2,
    y: L.confidence.percentY,
    size: 50,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink,
    anchor: "middle"
  });

  out += text({
    value: "★ ★ ★ ★ ★",
    x: L.confidence.x + L.confidence.width / 2,
    y: L.confidence.starsY,
    size: 18,
    weight: 700,
    fill: theme.accent,
    anchor: "middle",
    tracking: 1
  });

  out += `<rect x="${L.confidence.pillX}" y="${L.confidence.pillY}"
    width="${L.confidence.pillWidth}" height="${L.confidence.pillHeight}"
    rx="${L.confidence.pillHeight / 2}" fill="${theme.soft}"/>`;

  out += text({
    value: confidence.label_ru || "",
    x: L.confidence.pillX + L.confidence.pillWidth / 2,
    y: L.confidence.pillY + 16,
    size: 8.5,
    weight: 700,
    fill: theme.ink,
    anchor: "middle"
  });

  return out;
}

function scaleIcon(type, cx, cy, theme) {
  const r = 20;
  let icon = "";

  if (type === "temperature") {
    icon = `
      <line x1="${cx}" y1="${cy - 9}" x2="${cx}" y2="${cy + 5}"
        stroke="${theme.accent}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy + 9}" r="5" fill="${theme.accent}"/>
      <circle cx="${cx}" cy="${cy - 10}" r="3" fill="none"
        stroke="${theme.accent}" stroke-width="2"/>`;
  } else if (type === "depth") {
    icon = `
      <path d="M ${cx - 11} ${cy - 6} Q ${cx - 5} ${cy - 12} ${cx} ${cy - 6}
               Q ${cx + 5} ${cy} ${cx + 11} ${cy - 6}"
        fill="none" stroke="${theme.accent}" stroke-width="2.5"/>
      <path d="M ${cx - 11} ${cy + 2} Q ${cx - 5} ${cy - 4} ${cx} ${cy + 2}
               Q ${cx + 5} ${cy + 8} ${cx + 11} ${cy + 2}"
        fill="none" stroke="${theme.accent}" stroke-width="2.5"/>
      <path d="M ${cx - 11} ${cy + 10} Q ${cx - 5} ${cy + 4} ${cx} ${cy + 10}
               Q ${cx + 5} ${cy + 16} ${cx + 11} ${cy + 10}"
        fill="none" stroke="${theme.accent}" stroke-width="2.5"/>`;
  } else if (type === "contrast") {
    icon = `
      <circle cx="${cx}" cy="${cy}" r="11" fill="#FFFFFF"
        stroke="${theme.accent}" stroke-width="2"/>
      <path d="M ${cx} ${cy - 11}
               A 11 11 0 0 0 ${cx} ${cy + 11} Z"
        fill="${theme.accent}"/>`;
  } else {
    icon = `
      <text x="${cx}" y="${cy + 7}" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="24" fill="${theme.accent}">✦</text>`;
  }

  return `
<g>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${theme.soft}"
    stroke="${theme.line}" stroke-width="1"/>
  ${icon}
</g>`;
}

function renderScaleRow({
  type,
  titleRu,
  titleEn,
  leftRu,
  leftEn,
  rightRu,
  rightEn,
  position,
  top,
  theme
}) {
  const L = layout.PAGE_1.scalesPanel;
  const cy = top + 39;
  const markerX = L.scaleX1 + clamp(position) * (L.scaleX2 - L.scaleX1);

  let out = "";

  out += scaleIcon(type, L.iconX, cy, theme);

  out += text({
    value: titleRu,
    x: L.titleX,
    y: top + 25,
    size: 14,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink
  });

  out += text({
    value: titleEn,
    x: L.titleX,
    y: top + 43,
    size: 10,
    fill: theme.ink
  });

  out += text({
    value: leftRu,
    x: L.labelsX,
    y: top + 25,
    size: 9.5,
    fill: theme.ink
  });

  out += text({
    value: leftEn,
    x: L.labelsX,
    y: top + 42,
    size: 8.5,
    fill: theme.muted
  });

  out += text({
    value: rightRu,
    x: L.scaleX2 + 18,
    y: top + 25,
    size: 9.5,
    fill: theme.ink,
    anchor: "end"
  });

  out += text({
    value: rightEn,
    x: L.scaleX2 + 18,
    y: top + 42,
    size: 8.5,
    fill: theme.muted,
    anchor: "end"
  });

  out += `<line x1="${L.scaleX1}" y1="${top + 53}"
    x2="${L.scaleX2}" y2="${top + 53}"
    stroke="${theme.line}" stroke-width="4" stroke-linecap="round"/>`;

  out += `<line x1="${L.scaleX1}" y1="${top + 53}"
    x2="${markerX}" y2="${top + 53}"
    stroke="${theme.accent}" stroke-width="4" stroke-linecap="round"/>`;

  out += pinShape({
    cx: markerX,
    cy: top + 50,
    size: 28,
    color: theme.ink,
    symbol: "✦",
    selected: false
  });

  out += `<line x1="${L.x + 24}" y1="${top + L.rowHeight - 1}"
    x2="${L.x + L.width - 24}" y2="${top + L.rowHeight - 1}"
    stroke="${theme.line}" stroke-width="0.8"/>`;

  return out;
}

function renderPortraitAndScales(data, theme) {
  const L = layout.PAGE_1;
  const scales = obj(data.scales);
  let out = "";

  out += panel(L.portrait, "#FFFFFF", theme.line, L.portrait.radius);

  out += portrait({
    href: obj(data.source).photo_url,
    x: L.portrait.x + 3,
    y: L.portrait.y + 3,
    width: L.portrait.width - 6,
    height: L.portrait.height - 6,
    radius: L.portrait.radius - 3,
    borderWidth: 0
  });

  out += panel(L.scalesPanel, theme.panel, theme.line, L.scalesPanel.radius);

  out += renderScaleRow({
    type: "temperature",
    titleRu: "ТЕМПЕРАТУРА",
    titleEn: "Temperature",
    leftRu: "Холодная",
    leftEn: "Cool",
    rightRu: "Тёплая",
    rightEn: "Warm",
    position: obj(scales.temperature).position,
    top: L.scalesPanel.rows.temperature.top,
    theme
  });

  out += renderScaleRow({
    type: "depth",
    titleRu: "ГЛУБИНА",
    titleEn: "Depth",
    leftRu: "Светлая",
    leftEn: "Light",
    rightRu: "Глубокая",
    rightEn: "Deep",
    position: obj(scales.depth).position,
    top: L.scalesPanel.rows.depth.top,
    theme
  });

  out += renderScaleRow({
    type: "contrast",
    titleRu: "КОНТРАСТ",
    titleEn: "Contrast",
    leftRu: "Низкий",
    leftEn: "Low",
    rightRu: "Высокий",
    rightEn: "High",
    position: obj(scales.contrast).position,
    top: L.scalesPanel.rows.contrast.top,
    theme
  });

  out += renderScaleRow({
    type: "clarity",
    titleRu: "ЧИСТОТА",
    titleEn: "Clarity",
    leftRu: "Мягкая",
    leftEn: "Soft",
    rightRu: "Чистая",
    rightEn: "Clear",
    position: obj(scales.clarity).position,
    top: L.scalesPanel.rows.clarity.top,
    theme
  });

  return out;
}

function sampleCircle({
  id,
  href,
  fill,
  cx,
  cy,
  size,
  theme
}) {
  const r = size / 2;

  let out = `
<defs>
  <clipPath id="${id}">
    <circle cx="${cx}" cy="${cy}" r="${r}"/>
  </clipPath>
</defs>`;

  if (href) {
    out += `<image href="${esc(href)}"
      x="${cx - r}" y="${cy - r}" width="${size}" height="${size}"
      clip-path="url(#${id})" preserveAspectRatio="xMidYMid slice"/>`;
  } else {
    out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
  }

  out += `<circle cx="${cx}" cy="${cy}" r="${r}"
    fill="none" stroke="${theme.accent}" stroke-width="1.5"/>`;

  return out;
}

function renderNaturalItem({
  key,
  label,
  column,
  sample,
  natural,
  theme
}) {
  const L = layout.PAGE_1.naturalPalette;
  const cx = column.centerX;
  const cropCy = L.cropY + L.cropSize / 2;
  const source = obj(sample);
  const fallback = obj(natural);
  const fill = source.hex || fallback.hex || "#CCCCCC";
  const name = source.name_ru || fallback.name_ru || label;
  const swatches = arr(source.swatches).length
    ? arr(source.swatches).slice(0, 5)
    : [fill, fill, fill, fill, fill];

  let out = "";

  out += text({
    value: label,
    x: cx,
    y: L.itemY,
    size: 10,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink,
    anchor: "middle"
  });

  out += sampleCircle({
    id: `${key}ApprovedClip`,
    href: source.url,
    fill,
    cx,
    cy: cropCy,
    size: L.cropSize,
    theme
  });

  const totalWidth =
    swatches.length * L.swatchSize +
    (swatches.length - 1) * L.swatchGap;
  const startX = cx - totalWidth / 2;

  swatches.forEach((color, index) => {
    out += `<circle cx="${startX + index * (L.swatchSize + L.swatchGap) + L.swatchSize / 2}"
      cy="${L.swatchY + L.swatchSize / 2}" r="${L.swatchSize / 2}"
      fill="${color}"/>`;
  });

  out += wrappedText({
    value: name,
    x: cx,
    y: L.nameY,
    maxChars: 15,
    maxLines: 2,
    lineHeight: 17,
    size: 10.5,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink,
    anchor: "middle"
  });

  out += text({
    value: `HEX ${fill}`,
    x: cx,
    y: L.hexY,
    size: 9.5,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink,
    anchor: "middle"
  });

  return out;
}

function renderNaturalPalette(data, theme) {
  const L = layout.PAGE_1.naturalPalette;
  const samples = obj(data.photo_samples);
  const natural = obj(data.natural_colors);

  let out = panel(L, theme.panel, theme.line, L.radius);

  out += text({
    value: "ТВОЯ ПРИРОДНАЯ ПАЛИТРА",
    x: L.x + L.width / 2,
    y: L.titleY,
    size: 14,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink,
    anchor: "middle"
  });

  out += renderNaturalItem({
    key: "eye",
    label: "ГЛАЗА",
    column: L.columns[0],
    sample: samples.eye,
    natural: natural.eye,
    theme
  });

  out += renderNaturalItem({
    key: "hair",
    label: "ВОЛОСЫ",
    column: L.columns[1],
    sample: samples.hair,
    natural: natural.hair,
    theme
  });

  out += renderNaturalItem({
    key: "skin",
    label: "КОЖА",
    column: L.columns[2],
    sample: samples.skin,
    natural: natural.skin,
    theme
  });

  return out;
}

function polar(cx, cy, radius, angleDegrees) {
  const angle = (angleDegrees - 90) * Math.PI / 180;
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius
  };
}

function donutSegment({
  cx,
  cy,
  outerRadius,
  innerRadius,
  startAngle,
  endAngle,
  fill
}) {
  const startOuter = polar(cx, cy, outerRadius, endAngle);
  const endOuter = polar(cx, cy, outerRadius, startAngle);
  const startInner = polar(cx, cy, innerRadius, startAngle);
  const endInner = polar(cx, cy, innerRadius, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return `<path d="
    M ${startOuter.x} ${startOuter.y}
    A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}
    L ${startInner.x} ${startInner.y}
    A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${endInner.x} ${endInner.y}
    Z"
    fill="${fill}" stroke="#FFFFFF" stroke-width="1.2"/>`;
}

function renderNearestSeasons(data, theme) {
  const L = layout.PAGE_1.nearestSeasons;
  const top3 = arr(data.top3).slice(0, 3);
  const manifest = obj(obj(data.assets).pin_manifest);
  const total = top3.reduce(
    (sum, item) => sum + Math.max(0, Number(item.score) || 0),
    0
  ) || 1;

  let out = panel(L, theme.panel, theme.line, L.radius);

  out += text({
    value: "БЛИЖАЙШИЕ ЦВЕТОТИПЫ",
    x: L.x + L.width / 2,
    y: L.titleY,
    size: 14,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink,
    anchor: "middle"
  });

  let angle = 0;

  top3.forEach((item, index) => {
    const value = Math.max(0, Number(item.score) || 0);
    const sweep = value / total * 360;
    const pin = getPin(manifest, item.season_id);
    const color = pin && pin.color
      ? pin.color
      : [theme.accent, "#7B7A3D", "#23364A"][index];

    out += donutSegment({
      cx: L.donutCenterX,
      cy: L.donutCenterY,
      outerRadius: L.donutOuterRadius,
      innerRadius: L.donutInnerRadius,
      startAngle: angle,
      endAngle: angle + sweep,
      fill: color
    });

    const mid = angle + sweep / 2;
    const labelPoint = polar(
      L.donutCenterX,
      L.donutCenterY,
      (L.donutOuterRadius + L.donutInnerRadius) / 2,
      mid
    );

    out += text({
      value: `${Math.round(value)}%`,
      x: labelPoint.x,
      y: labelPoint.y + 4,
      size: 11,
      weight: 700,
      fill: theme.white,
      anchor: "middle"
    });

    angle += sweep;
  });

  out += `<circle cx="${L.donutCenterX}" cy="${L.donutCenterY}"
    r="${L.donutInnerRadius - 2}" fill="#FFFDFC"/>`;

  out += text({
    value: "DiArt",
    x: L.donutCenterX,
    y: L.donutCenterY + 5,
    size: 19,
    weight: 700,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink,
    anchor: "middle",
    style: "font-style:italic"
  });

  top3.forEach((item, index) => {
    const rowY = L.listY + index * L.listRowHeight;
    const pin = getPin(manifest, item.season_id);
    const color = pin && pin.color
      ? pin.color
      : [theme.accent, "#7B7A3D", "#23364A"][index];

    out += pinShape({
      cx: L.listX + 18,
      cy: rowY + 18,
      size: L.pinSize,
      color,
      symbol: seasonSymbol(item.season_id),
      selected: index === 0
    });

    out += text({
      value: item.name_ru || "",
      x: L.listX + 45,
      y: rowY + 15,
      size: 10.5,
      weight: 600,
      family: "Georgia, 'Times New Roman', serif",
      fill: theme.ink
    });

    out += text({
      value: `${Math.round(Number(item.score) || 0)}%`,
      x: L.x + L.width - 20,
      y: rowY + 19,
      size: 13,
      weight: 700,
      family: "Georgia, 'Times New Roman', serif",
      fill: theme.ink,
      anchor: "end"
    });
  });

  out += wrappedText({
    value: "Эти цветотипы имеют наиболее близкие характеристики к вашему природному колориту.",
    x: L.x + L.width / 2,
    y: L.noteY,
    maxChars: 52,
    maxLines: 2,
    lineHeight: 16,
    size: 10.5,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink,
    anchor: "middle"
  });

  return out;
}

function renderMeta(data, theme) {
  const L = layout.PAGE_1.meta;
  const passport = obj(data.passport);
  const items = [
    ["Паспорт создан:", passport.created_at || ""],
    ["AI-модель:", passport.ai_model || ""],
    ["База палитр:", passport.database_version ? `DiArt DB v${passport.database_version}` : ""]
  ];

  let out = panel(L, theme.panel, theme.line, L.radius);

  items.forEach((item, index) => {
    const col = L.columns[index];
    const centerX = col.x + col.width / 2;

    out += text({
      value: index === 0 ? "▣" : index === 1 ? "✣" : "◫",
      x: col.x + 14,
      y: L.iconY + 12,
      size: 25,
      fill: theme.accent,
      anchor: "middle"
    });

    out += text({
      value: item[0],
      x: col.x + 35,
      y: L.labelY,
      size: 9.5,
      family: "Georgia, 'Times New Roman', serif",
      fill: theme.ink
    });

    out += text({
      value: item[1],
      x: col.x + 35,
      y: L.valueY,
      size: 13,
      weight: 600,
      family: "Georgia, 'Times New Roman', serif",
      fill: theme.ink
    });

    if (index < 2) {
      const dividerX = index === 0 ? L.divider1X : L.divider2X;
      out += `<line x1="${dividerX}" y1="${L.y + 16}" x2="${dividerX}"
        y2="${L.y + L.height - 16}" stroke="${theme.line}" stroke-width="1"/>`;
    }
  });

  return out;
}

function renderFooter(data, theme) {
  const L = layout.PAGE_1.footer;
  const assets = obj(data.assets);

  let out = "";

  out += `<line x1="${L.x}" y1="${L.y}" x2="${L.x + L.width}"
    y2="${L.y}" stroke="${theme.line}" stroke-width="1"/>`;

  out += drawLogo({
    href: assets.logo,
    x: L.logoX,
    y: L.logoY,
    width: L.logoWidth,
    height: L.logoHeight
  });

  out += text({
    value: "✦",
    x: L.leftStarX,
    y: L.sloganY - 2,
    size: 14,
    fill: theme.accent,
    anchor: "middle"
  });

  out += text({
    value: "✦",
    x: L.rightStarX,
    y: L.sloganY - 2,
    size: 14,
    fill: theme.accent,
    anchor: "middle"
  });

  out += text({
    value: "Ц В Е Т   У К Р А Ш А Е Т   Т Е Б Я",
    x: L.x + L.width / 2,
    y: L.sloganY,
    size: 9,
    weight: 600,
    family: "Georgia, 'Times New Roman', serif",
    fill: theme.ink,
    anchor: "middle",
    tracking: 2
  });

  return out;
}

function validate(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Page 1: input data is missing.");
  }

  if (!obj(data.season).id) {
    throw new Error("Page 1: season.id is missing.");
  }

  if (!obj(data.confidence)) {
    throw new Error("Page 1: confidence is missing.");
  }

  if (!obj(data.scales)) {
    throw new Error("Page 1: scales are missing.");
  }

  if (!Array.isArray(data.top3) || data.top3.length < 3) {
    throw new Error("Page 1: top3 must contain three seasons.");
  }

  if (!obj(obj(data.assets).pin_manifest).pins) {
    throw new Error("Page 1: assets.pin_manifest is missing.");
  }
}

function buildPage1(data) {
  validate(data);

  const theme = themeFrom(data);
  const P = layout.PAGE;

  let out = svg.svg(P.width, P.height, P.viewBox);

  out += svg.defs(`
${svg.shadowFilter("shadow", {
  dx: 0,
  dy: 3,
  stdDeviation: 4,
  floodOpacity: 0.08
})}
<linearGradient id="approvedPageBackground" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0%" stop-color="#FFFDFC"/>
  <stop offset="100%" stop-color="#F8F1E9"/>
</linearGradient>`);

  out += `<rect x="0" y="0" width="${P.width}" height="${P.height}"
    rx="${P.outerRadius}" fill="url(#approvedPageBackground)"/>`;

  out += `<rect x="3" y="3" width="${P.width - 6}" height="${P.height - 6}"
    rx="${P.outerRadius}" fill="none" stroke="${theme.line}" stroke-width="1"/>`;

  out += renderIdentity(data, theme);
  out += renderPortraitAndScales(data, theme);
  out += renderNaturalPalette(data, theme);
  out += renderNearestSeasons(data, theme);
  out += renderMeta(data, theme);
  out += renderFooter(data, theme);

  out += svg.end();

  return out;
}

module.exports = {
  PAGE_1_VERSION,
  buildPage1
};
