'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),W=E.world;
function open(s,k,beat){const id=`city:sect-${k}-${beat}`,scene=W.encounters.city.find(e=>e.id===id);assert(W.eligible(s,scene));s.world.encounterCooldown=0;s.world.encounter={location:'city',index:W.encounters.city.indexOf(scene),id};return scene;}
for(const k of Object.keys(E.sects.schools)){
  const s=E.fresh();s.stage=2;s.realm=3;s.found=true;s.calm=5;s.resources.herbs=100;s.resources.qi=100;s.world.location='city';s.world.admission=k;s.world.admissionRoutes=k==='gates'?[]:[k];
  const technique=E.sects.schools[k].technique;
  assert(!E.canLearn(s,technique));assert(!E.action(s,'apply-sect','gates'));
  assert(W.causalLeads(s).some(q=>q.id===`city:sect-${k}-welcome`));assert(!W.causalLeads(s).some(q=>q.id===`city:sect-${k}-library`));
  for(const other of Object.keys(E.sects.schools).filter(x=>x!==k))assert(!W.eligible(s,W.encounters.city.find(e=>e.id===`city:sect-${other}-welcome`)));
  open(s,k,'welcome');assert(E.action(s,'choice','oath'));assert(!W.eligible(s,W.encounters.city.find(e=>e.id===`city:sect-${k}-welcome`)));
  for(let i=0;i<2;i++){s.stamina=100;open(s,k,'duty');assert(E.action(s,'choice','serve'));}
  assert.equal(E.sects.info(s,k).duties,2);open(s,k,'library');assert(E.action(s,'choice','read'));assert(E.canLearn(s,technique));assert(E.action(s,'learn-technique',technique));assert(E.action(s,'equip-technique',technique));
  const scene=open(s,k,'rival');assert(E.choiceExplanation(s,scene,scene.choices[0],'en').available);assert(E.action(s,'choice','resolve'));assert(!W.eligible(s,scene));
  assert.deepEqual(E.validate(JSON.parse(JSON.stringify(s))),s);assert(E.sects.info(s,k,'en').perk.includes('15%'));assert(!/[А-Яа-я]/.test(E.sects.progress(s,k,'en')));
  if(k==='gates'){const before=s.body;assert(E.action(s,'technique-action','iron-lift'));assert(s.body>before);assert.equal(E.validate(s).cultivation.actionCooldowns['iron-lift'],60);}
}
const veteran=E.fresh();veteran.stage=2;veteran.world.admission='gates';veteran.cultivation.learned.cloud={rank:1,progress:240};veteran.resources.qi=100;veteran.resources.herbs=100;assert(E.canLearn(veteran,'cloud'),'Previously learned techniques remain usable and upgradeable');
const before=E.fresh(),after=E.fresh();before.body=after.body=2;before.stage=after.stage=2;after.world.admission='gates';E.action(before,'click','squat');E.action(after,'click','squat');assert(Math.abs((after.body-2)/(before.body-2)-1.15)<1e-10);
console.log('PASS: four exclusive schools, earned library access, contextual duties, unique rivalry solutions, persistent membership, class bonus and legacy techniques');
