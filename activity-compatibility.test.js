'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js');

const meditating=E.fresh();meditating.found=true;
E.advance(meditating,20);
assert.equal(meditating.body,0);
assert(meditating.resources.qi>0);
assert(E.action(meditating,'click','squat'));
assert.equal(meditating.activity,'rest');
const afterClick={body:meditating.body,qi:meditating.resources.qi,xp:meditating.xp};
E.advance(meditating,60);
assert.equal(meditating.body,afterClick.body);
assert.equal(meditating.resources.qi,afterClick.qi);
assert.equal(meditating.xp,afterClick.xp);
assert(E.action(meditating,'activity','meditate'));
E.advance(meditating,10);
assert(meditating.resources.qi>afterClick.qi);

const rejected=E.fresh();rejected.stamina=0;
assert(!E.action(rejected,'click','run'));
assert.equal(rejected.activity,'meditate');
assert(!E.action(rejected,'travel','city'));
assert.equal(rejected.activity,'meditate');
rejected.storyStep=4;rejected.calm=5;
assert(E.action(rejected,'travel','ruins'));
assert.equal(rejected.activity,'rest');
assert(!E.action(rejected,'activity','meditate'));
rejected.stamina=100;
assert(!E.action(rejected,'click','run'));

const sweeping=E.fresh();sweeping.storyStep=1;
assert(E.action(sweeping,'order','sweep'));
assert(E.action(sweeping,'click','sweep'));
assert.equal(sweeping.activity,'rest');
assert(sweeping.body>0);

function technique(key){
  const s=E.fresh();s.found=true;s.cultivation={active:key,learned:{[key]:{rank:1,progress:0}}};
  assert(E.action(s,'activity','technique'));return s;
}
for(const key of ['sky','breath','herb','seal','grove']){
  const s=technique(key);E.advance(s,30);assert.equal(s.body,0,key);assert(s.cultivation.learned[key].progress>0);
}
for(const key of ['stance','sword','cloud']){
  const s=technique(key),offline=structuredClone(s);
  for(let i=0;i<400;i++)E.advance(s,1);E.advance(offline,400);
  assert(s.body>0,key);assert.equal(s.activity,'technique');
  assert(Math.abs(s.body-offline.body)<1e-9,key);
  assert.equal(s.cultivation.learned[key].progress,E.techniqueNeeded(1));
  const before=s.body;E.advance(s,1000);assert.equal(s.body,before);
  s.cultivation.learned[key]={rank:5,progress:0};E.advance(s,100);assert.equal(s.body,before);
}
const cap=technique('stance');cap.body=10;E.advance(cap,30);assert.equal(cap.body,10);assert(cap.cultivation.learned.stance.progress>0);
const starved=technique('stance');starved.stamina=0;
assert.equal(E.techniquePractice(starved,'stance',10),0);assert.equal(starved.body,0);
const serialized=E.validate(JSON.parse(JSON.stringify(meditating)));assert.equal(serialized.activity,'meditate');
assert(E.action(serialized,'activity','rest'));
assert.equal(E.validate(JSON.parse(JSON.stringify(serialized))).activity,'rest');
console.log('PASS: incompatible activities, explicit resume, journey restrictions, contextual work and movement-only bounded technique practice');
