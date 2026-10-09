const assert=require('node:assert/strict');
const E=require('./engine.js');
for(const [route,location,index,id] of [
  ['rescue','forest',2,'heal'],['remains','ruins',3,'return-remains'],['invitation','ruins',4,'invitation'],['gates',null,null,null]
]){
  const s=E.fresh();s.stage=1;s.found=true;s.realm=3;s.wins=3;s.resources.gold=150;s.resources.relics=3;s.resources.herbs=10;
  assert.equal(E.canAdvance(s),false);
  if(location){s.world.location=location;s.world.encounter={location,index};assert(E.action(s,'choice',id));assert.deepEqual(s.world.admissionRoutes,[route]);}
  assert.equal(E.action(s,'apply-sect',route),false);
  s.world.location='city';assert(E.action(s,'apply-sect',route));assert(E.canAdvance(s));
  assert.deepEqual(E.validate(JSON.parse(JSON.stringify(s))),s);
  s.world.encounter={location:'city',index:1};assert(E.action(s,'choice','challenge'));assert.equal(s.world.deaths,1);assert.equal(s.world.admission,route);
  Object.assign(s.resources,{gold:150,relics:3});assert(E.action(s,'advance'));assert.equal(s.stage,2);
  assert.equal(E.action(s,'apply-sect','gates'),false);
  if(route==='rescue')assert.equal(s.resources.herbs,22.5);
  if(route==='remains')assert.equal(s.mastery,1);
  if(route==='invitation')assert.equal(s.resources.qi,40);
  if(route==='gates')assert.equal(s.resources.reputation,10);
}
const old=E.fresh();delete old.world.admission;delete old.world.admissionRoutes;assert.equal(E.validate(old).world.admission,null);
const invalid=E.fresh();invalid.stage=1;invalid.world.admission='rescue';assert.throws(()=>E.validate(invalid));
console.log('PASS: four admission paths, prerequisites, gifts, death persistence, save round trips and migration');
