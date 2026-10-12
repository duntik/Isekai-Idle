'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),W=E.world;
// Select a valid meeting deterministically; all costs, travel, waiting and rewards
// still use actual gameplay actions. No player stats or resources are injected.
function travel(s,place){if(s.world.location===place)return;assert(E.action(s,'travel',place));E.advance(s,W.locations[place].time);}
function meet(s,id,key){
  const place=id.split(':')[0];travel(s,place);E.advance(s,s.world.encounterCooldown);
  const scene=W.encounters[place].find(e=>e.id===id);assert(scene&&W.eligible(s,scene),id);
  s.world.encounter={location:place,id,index:W.encounters[place].indexOf(scene)};
  assert(E.action(s,'choice',key),`${id}/${key}`);
}
function click(s,key){while(!E.canClick(s,key))E.advance(s,1);assert(E.action(s,'click',key));E.advance(s,.6);}
function beginning(){
  const s=E.fresh();assert(E.action(s,'name','Lin Yue'));assert(E.action(s,'story'));
  assert(E.action(s,'order','sweep'));for(let i=0;i<10;i++)click(s,'sweep');
  assert(E.action(s,'claim-order'));assert(E.action(s,'story'));return s;
}
function lesson(s,key){assert(E.action(s,'learn-technique',key));assert.equal(s.cultivation.learned[key].rank,1);assert(E.action(s,'equip-technique',key));}
function quietMilestone(s){
  travel(s,'village');assert(E.action(s,'story'));assert(E.action(s,'activity','meditate'));
  E.advance(s,Math.max(0,(5-s.calm)/.02)+.01);assert(E.action(s,'story'));
  assert.equal(s.storyStep,4);assert(s.age<=900,`Opening took ${s.age} seconds`);
  assert.equal(s.realm,0);return s;
}
const labor=beginning();meet(labor,'village:1','work');meet(labor,'village:ren-load','lift');lesson(labor,'stance');
assert(E.action(labor,'technique-action','stone-load'));assert(labor.body>.12);
assert.equal(labor.activity,'rest');assert(!E.action(labor,'technique-action','stone-load'));
quietMilestone(labor);

const herbal=beginning();meet(herbal,'forest:0','learn');lesson(herbal,'herb');
const herbs=herbal.resources.herbs;assert(E.action(herbal,'technique-action','herb-listen'));assert.equal(herbal.resources.herbs,herbs+2);
meet(herbal,'forest:lin-leaves','identify');assert(herbal.world.completed.includes('forest:lin-leaves'));quietMilestone(herbal);

const archive=beginning();meet(archive,'village:2','letter');meet(archive,'city:wei-letter','deliver-letter');lesson(archive,'ink');
travel(archive,'ruins');const research=archive.explored;assert(E.action(archive,'technique-action','ink-read'));assert.equal(archive.explored,research+30);
quietMilestone(archive);
for(const[name,s]of [['labor',labor],['herbal',herbal],['archive',archive]]){
  assert.deepEqual(E.validate(JSON.parse(JSON.stringify(s))),s);
  console.log(`${name}: first technique, contextual action and fourth story milestone in ${Math.ceil(s.age/60)} minutes`);
}
// One hero can combine contacts, jobs and techniques; there is no class lock.
meet(labor,'forest:0','learn');lesson(labor,'herb');meet(labor,'village:2','letter');meet(labor,'city:wei-letter','deliver-letter');lesson(labor,'ink');
assert.deepEqual(Object.keys(labor.cultivation.learned).sort(),['herb','ink','stance']);
const mixed=E.validate(JSON.parse(JSON.stringify(labor)));assert.equal(mixed.cultivation.active,'ink');assert.equal(mixed.storyStep,4);
travel(mixed,'village');assert(E.action(mixed,'order','ledger'));E.advance(mixed,180);assert(E.action(mixed,'claim-order'));
assert.deepEqual(Object.keys(mixed.cultivation.learned).sort(),['herb','ink','stance']);
console.log('PASS: paced openings, causal apprenticeship, freely mixed paths and saved progress');
