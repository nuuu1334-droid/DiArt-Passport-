/**
 * DiArt Passport
 * File: passport/passport_input_adapter.js
 * Version: 1.1.0
 */

"use strict";

const officialAssets = require("./asset_registry");
const ADAPTER_VERSION = "1.1.0";

const SEASONS = {
  light_spring: ["Светлая Весна", "Light Spring", "Светлый, тёплый и свежий природный колорит"],
  true_spring: ["Тёплая Весна", "True Spring", "Тёплый, ясный и золотистый природный колорит"],
  bright_spring: ["Яркая Весна", "Bright Spring", "Яркий, тёплый и контрастный природный колорит"],
  light_summer: ["Светлое Лето", "Light Summer", "Светлый, прохладный и мягкий природный колорит"],
  true_summer: ["Истинное Лето", "True Summer", "Прохладный, спокойный и гармоничный природный колорит"],
  soft_summer: ["Мягкое Лето", "Soft Summer", "Мягкий, прохладный и приглушённый природный колорит"],
  soft_autumn: ["Мягкая Осень", "Soft Autumn", "Мягкий, тёплый и приглушённый природный колорит"],
  true_autumn: ["Истинная Осень", "True Autumn", "Тёплый, насыщенный и землистый природный колорит"],
  deep_autumn: ["Глубокая Осень", "Deep Autumn", "Тёплый, глубокий и насыщенный природный колорит"],
  bright_winter: ["Яркая Зима", "Bright Winter", "Яркий, прохладный и контрастный природный колорит"],
  true_winter: ["Истинная Зима", "True Winter", "Прохладный, чистый и контрастный природный колорит"],
  deep_winter: ["Глубокая Зима", "Deep Winter", "Прохладный, глубокий и контрастный природный колорит"]
};

const SEASON_THEMES = {
  light_spring: {
    backgroundColor: "#FFF9EF",
    accentColor: "#8FB36A"
  },
  true_spring: {
    backgroundColor: "#FFF6E7",
    accentColor: "#D98B14"
  },
  bright_spring: {
    backgroundColor: "#FFF5F2",
    accentColor: "#D94C4C"
  },

  light_summer: {
    backgroundColor: "#F4F8FC",
    accentColor: "#6F8FAF"
  },
  true_summer: {
    backgroundColor: "#F2F5F8",
    accentColor: "#5F7E9B"
  },
  soft_summer: {
    backgroundColor: "#F6F4F5",
    accentColor: "#8C7284"
  },

  soft_autumn: {
    backgroundColor: "#FAF5EC",
    accentColor: "#9A7655"
  },
  true_autumn: {
    backgroundColor: "#FBF2E7",
    accentColor: "#B55F20"
  },
  deep_autumn: {
    backgroundColor: "#FBF4EC",
    accentColor: "#6A351D"
  },

  bright_winter: {
    backgroundColor: "#F8F5FA",
    accentColor: "#A00046"
  },
  true_winter: {
    backgroundColor: "#F3F6FA",
    accentColor: "#294B72"
  },
  deep_winter: {
    backgroundColor: "#F4F3F4",
    accentColor: "#352D38"
  }
};
function obj(v){return v&&typeof v==="object"&&!Array.isArray(v)?v:{};}
function arr(v){return Array.isArray(v)?v:[];}
function parse(v,name){
  if(v===undefined||v===null||v==="") return null;
  if(typeof v==="object") return v;
  try{return JSON.parse(v);}catch(e){throw new Error(`Некорректный JSON: ${name}`);}
}
function unwrapEngine(v){
  if(Array.isArray(v)) v=v[0];
  if(obj(v).result&&obj(v.result).runtime_version) return v.result;
  return v;
}
function clamp(v,min,max){
  const n=Number(v);
  return Number.isFinite(n)?Math.min(max,Math.max(min,n)):min;
}
function round(v,d=3){
  const p=Math.pow(10,d);
  return Math.round((Number(v)+Number.EPSILON)*p)/p;
}
function hex(v,fallback="#CCCCCC"){
  if(typeof v!=="string") return fallback;
  const x=v.trim().toUpperCase();
  if(/^#[0-9A-F]{6}$/.test(x)) return x;
  if(/^[0-9A-F]{6}$/.test(x)) return "#"+x;
  return fallback;
}
function weighted(scores,weights){
  scores=obj(scores);
  let a=0,b=0;
  for(const [k,w] of Object.entries(weights)){
    const s=Number(scores[k]);
    if(Number.isFinite(s)&&s>=0){a+=s*w;b+=s;}
  }
  return b?clamp(a/b,0,1):0.5;
}
function labelConfidence(p){
  if(p>=90)return"Очень высокая достоверность";
  if(p>=75)return"Высокая достоверность";
  if(p>=60)return"Вероятное совпадение";
  return"Предварительный результат";
}
function scaleLabel(type,value){
  const map={
    temperature:{cool:"Холодная",neutral_cool:"Нейтрально-холодная",neutral:"Нейтральная",neutral_warm:"Нейтрально-тёплая",warm:"Тёплая"},
    depth:{light:"Светлая",light_medium:"Светло-средняя",medium:"Средняя",medium_deep:"Средне-глубокая",deep:"Глубокая",very_dark:"Очень глубокая",very_deep:"Очень глубокая"},
    clarity:{muted:"Приглушённая",soft:"Мягкая",balanced:"Сбалансированная",clear:"Чистая",bright:"Яркая",moderate:"Сбалансированная"},
    contrast:{low:"Низкий",medium:"Средний",high:"Высокий",moderate:"Средний"}
  };
  return map[type]&&map[type][value]?map[type][value]:String(value||"").replace(/_/g," ");
}
function naturalName(value,fallback){
  const map={black:"Чёрный",dark_brown:"Тёмно-коричневый",medium_brown:"Коричневый",light_brown:"Светло-коричневый",hazel:"Ореховый",amber:"Янтарный",green:"Зелёный",blue:"Голубой",gray:"Серый"};
  return map[String(value||"").toLowerCase()]||fallback;
}
function formatDate(v){
  if(typeof v==="string"&&/^\d{2}\.\d{2}\.\d{4}$/.test(v)) return v;
  const d=v?new Date(v):new Date();
  return `${String(d.getDate()).padStart(2,"0")}.${String(d.getMonth()+1).padStart(2,"0")}.${d.getFullYear()}`;
}
function passportId(v,season){
  if(v&&String(v).trim()) return String(v).trim();
  const code=season.split("_").map(x=>x[0]).join("").toUpperCase();
  return `DIART-${code}-${Date.now().toString(36).toUpperCase()}`;
}
function top3(engine, pinManifest){
  const pins = arr(obj(pinManifest).pins);

  return arr(engine.season_ranking)
    .filter(x=>x&&!x.hard_excluded)
    .sort((a,b)=>Number(a.rank||999)-Number(b.rank||999))
    .slice(0,3)
    .map((x,i)=>{
      const s=SEASONS[x.season_id];

      if(!s){
        throw new Error(`Неизвестный сезон: ${x.season_id}`);
      }

      const assetSlug = officialAssets.normalizeSeasonId(x.season_id);

      const manifestPin = pins.find(
        p => p && String(p.slug) === assetSlug
      );

      return {
        rank:i+1,
        season_id:x.season_id,
        name_ru:s[0],
        name_en:s[1],

        score:round(
          x.score_after_modifiers !== undefined
            ? x.score_after_modifiers
            : x.base_score,
          1
        ),

        color:
          manifestPin && manifestPin.color
            ? String(manifestPin.color)
            : "#8A4E25",

        pin_url:
          officialAssets.pin(x.season_id)
      };
    });
}
function samples(raw,natural){
  raw=obj(raw);
  function one(key){
    const s=obj(raw[key]);
    return {
      url:typeof s.url==="string"?s.url:"",
      name_ru:s.name_ru||natural[key].name_ru,
      hex:hex(s.hex,natural[key].hex),
      swatches:arr(s.swatches).map(x=>hex(x,null)).filter(Boolean).slice(0,6)
    };
  }
  return {eye:one("eye"),hair:one("hair"),skin:one("skin")};
}
function main(input){
  try{
    input=obj(input);

    const engine=unwrapEngine(parse(input.engineResult,"engineResult"));
    const paletteResult=parse(input.paletteResult,"paletteResult");
    const pinManifest=parse(input.pinManifest,"pinManifest");
    const photoSamples=parse(input.photoSamples,"photoSamples")||{};

    if(!obj(engine).result||!engine.result.best_match) throw new Error("Некорректный output Color Engine.");
    if(!obj(paletteResult).palette) throw new Error("Некорректный output Palette Resolver.");

    const seasonId=String(engine.result.best_match);
    const seasonData=SEASONS[seasonId];
    if(!seasonData) throw new Error(`Неизвестный сезон: ${seasonId}`);

    const seasonTheme=SEASON_THEMES[seasonId] || {
  backgroundColor:"#FBF7F1",
  accentColor:"#8A4E25"
};
    const dims=obj(engine.dimension_results);
    const observed=obj(engine.observed_colors);
    const skin=obj(observed.skin),eyes=obj(observed.eyes),hair=obj(observed.hair);

    const natural={
      eye:{hex:hex(eyes.hex,"#777777"),name_ru:naturalName(eyes.primary_color,"Оттенок глаз")},
      hair:{hex:hex(hair.hex,"#555555"),name_ru:naturalName(hair.primary_color,"Оттенок волос")},
      skin:{hex:hex(skin.hex,"#D8B49A"),name_ru:skin.surface_tone||"Оттенок кожи"}
    };

    const confidencePercent=Math.round(clamp(engine.result.confidence_percent,0,100));
    const meta=obj(paletteResult.metadata);
    const warnings=[
      ...arr(paletteResult.warnings),
      ...(!input.photoUrl?["photoUrl не передан."]:[]),
      ...(!input.logoUrl?["logoUrl не передан."]:[]),
      ...(!pinManifest?["pinManifest не передан."]:[])
    ];

    return {
      ok:true,
      stage:"passport_input_normalized",
      adapter_version:ADAPTER_VERSION,
      result:{
        adapter:{name:"DiArt Passport Input Adapter",version:ADAPTER_VERSION},
        passport:{
          id:passportId(input.passportId,seasonId),
          created_at:formatDate(input.createdAt),
          client_name:typeof input.clientName==="string"?input.clientName.trim():"",
          ai_model:typeof input.aiModel==="string"&&input.aiModel.trim()?input.aiModel.trim():"Не указана",
          engine_runtime_version:String(engine.runtime_version||""),
          extractor_version:engine.extractor&&engine.extractor.version?String(engine.extractor.version):"",
          database_version:meta.palette_database_version||"",
          master_color_version:meta.master_color_version||""
        },
        source:{photo_url:typeof input.photoUrl==="string"?input.photoUrl.trim():""},
        quality:{
          overall_quality:engine.quality&&engine.quality.overall_quality||null,
          continue_analysis:engine.quality&&engine.quality.continue_analysis,
          problems:engine.quality&&arr(engine.quality.problems),
          limitations:engine.quality&&arr(engine.quality.limitations)
        },
        season:{id:seasonId,name_ru:seasonData[0],name_en:seasonData[1],description_ru:seasonData[2]},
        backgroundColor:seasonTheme.backgroundColor,
        accentColor:seasonTheme.accentColor,
        confidence:{
          value:round(clamp(engine.result.confidence,0,1)),
          percent:confidencePercent,
          level:String(engine.result.confidence_level||""),
          label_ru:labelConfidence(confidencePercent),
          decision_status:String(engine.result.decision_status||""),
          score_gap_to_second:round(clamp(engine.result.score_gap_to_second,0,100),1)
        },
        scales:{
          temperature:{
            classification:dims.temperature.classification,
            label_ru:scaleLabel("temperature",dims.temperature.classification),
            position:round(weighted(dims.temperature.scores,{cool:0,neutral:0.5,warm:1}))
          },
          depth:{
            classification:dims.value.classification,
            label_ru:scaleLabel("depth",dims.value.classification),
            position:round(weighted(dims.value.scores,{light:0,medium:0.5,deep:1}))
          },
          clarity:{
            classification:dims.chroma.classification,
            label_ru:scaleLabel("clarity",dims.chroma.classification),
            position:round(weighted(dims.chroma.scores,{muted:0,soft:0.25,balanced:0.5,clear:0.75,bright:1}))
          },
          contrast:{
            classification:dims.contrast.classification,
            label_ru:scaleLabel("contrast",dims.contrast.classification),
            position:round(weighted(dims.contrast.scores,{low:0,medium:0.5,high:1}))
          }
        },
        top3:top3(engine,pinManifest),
        natural_colors:natural,
        photo_samples:samples(photoSamples,natural),
        palette:paletteResult.palette,
        assets:{
          logo:typeof input.logoUrl==="string"?input.logoUrl.trim():"",
          pin_manifest:pinManifest
        },
        harmony_guide:arr(input.harmonyGuide),
        important_note:typeof input.importantNote==="string"?input.importantNote:"",
        warnings
      }
    };
  }catch(error){
    return {
      ok:false,
      stage:"passport_input_adapter_failed",
      adapter_version:ADAPTER_VERSION,
      error:{message:error&&error.message?error.message:"Неизвестная ошибка Input Adapter."}
    };
  }
}

module.exports={ADAPTER_VERSION,main};
