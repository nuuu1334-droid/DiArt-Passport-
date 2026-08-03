/**
 * DiArt Passport
 * File: passport/components/color_orbit.js
 * Version: 1.0.0
 *
 * Draws the 12-season orbit.
 */

"use strict";

const SEASONS = [
"light_spring",
"true_spring",
"bright_spring",
"light_summer",
"true_summer",
"soft_summer",
"soft_autumn",
"true_autumn",
"deep_autumn",
"bright_winter",
"true_winter",
"deep_winter"
];

function orbit({
cx,
cy,
radius,
active,
top3=[]
}){

let svg="";

SEASONS.forEach((season,index)=>{

const angle=((360/12)*index-90)*(Math.PI/180);

const x=cx+Math.cos(angle)*radius;
const y=cy+Math.sin(angle)*radius;

const isActive=season===active;
const isTop=top3.includes(season);

const fill=isActive?"#6E4A35":isTop?"#C5A37B":"#ECE3DA";
const stroke=isActive?"#6E4A35":"#D6CABE";
const r=isActive?30:isTop?26:22;

svg+=`
<circle
cx="${x}"
cy="${y}"
r="${r}"
fill="${fill}"
stroke="${stroke}"
stroke-width="2"/>`;

});

svg+=`
<circle
cx="${cx}"
cy="${cy}"
r="${radius-72}"
fill="none"
stroke="#E5D8CC"
stroke-width="2"/>`;

return svg;

}

module.exports={
orbit
};
