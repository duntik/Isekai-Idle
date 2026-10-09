'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),W=E.world;
const generated=Object.values(W.encounters).flat().filter(e=>e.generated);
assert.equal(generated.length,1080);
assert.equal(new Set(generated.map(e=>e.id)).size,1080);
function show(s,scene){s.world.journey=null;s.world.location=scene.id.split(':')[0];s.world.encounter={location:s.world.location,id:scene.id,index:W.encounters[s.world.location].indexOf(scene)};}
function returnScene(scene){return generated.find(e=>e.id===`${scene.id}:return`);}
// Every compatible template has usable choices and a causally gated payoff.
for(const scene of generated.filter(e=>!e.payoff)){
  const s=E.fresh(),phase=+scene.id.split(':')[2];s.stage=[1,2,4][phase];s.world.admission='gates';s.body=200;s.stamina=100;
  for(const k of Object.keys(s.resources))s.resources[k]=1000;
  s.cultivation.learned=Object.fromEntries(Object.keys(E.techniques).map(k=>[k,{rank:3,progress:0}]));
  assert(W.eligible(s,scene));assert(!W.eligible(s,returnScene(scene)));
  for(const c of scene.choices)assert(W.canChoice(s,c,E));
  show(s,scene);assert(E.action(s,'choice','study'));assert(!W.eligible(s,scene));assert(W.eligible(s,returnScene(scene)));
  assert.equal(W.recognition(s),0);const copy=E.validate(JSON.parse(JSON.stringify(s)));assert.deepEqual(copy.world,s.world);
  show(s,returnScene(scene));assert(W.sceneText(returnScene(scene),'text','en',s).includes('method you demonstrated'));
  assert(E.action(s,'choice','lesson'));assert.equal(W.recognition(s),1);assert.equal(Object.keys(s.world.director.pending).length,0);
  assert(s.cultivation.learned[scene.choices.find(c=>c.id==='study').technique].progress>0);
  assert(!E.action(s,'choice','claim'));assert(!W.eligible(s,returnScene(scene)));
}
const base=generated.find(e=>e.id==='forest:generated:0:0:0:raiders'),follow=returnScene(base);
const weak=E.fresh();weak.stage=1;show(weak,base);const before=JSON.stringify(weak);
assert(!E.action(weak,'choice','labor'));assert(!E.action(weak,'choice','study'));assert(!E.action(weak,'choice','supply'));assert.equal(JSON.stringify(weak),before);
assert(E.action(weak,'choice','skip'));assert(W.eligible(weak,base));assert.equal(W.recognition(weak),0);assert(!W.eligible(weak,follow));
show(weak,base);assert(E.action(weak,'choice','fight'));assert.equal(weak.world.deaths,1);assert(!W.eligible(weak,follow));assert(!weak.world.director.pending[base.id]);
// Delaying a reward cannot transfer its recognition into a later chapter.
const delayed=E.fresh();delayed.stage=1;delayed.resources.herbs=100;show(delayed,base);assert(E.action(delayed,'choice','supply'));
const pendingSave=E.validate(JSON.parse(JSON.stringify(delayed)));assert(W.eligible(pendingSave,follow));
for(let seed=1;seed<=50;seed++){const waiting=E.validate(JSON.parse(JSON.stringify(pendingSave)));waiting.world.seed=seed;const seen=new Set();for(let i=0;i<8;i++){waiting.world.encounter=null;waiting.world.encounterCooldown=0;E.action(waiting,'encounter');seen.add(W.current(waiting).id);}assert(seen.has(follow.id));}
const deathPending=E.validate(JSON.parse(JSON.stringify(pendingSave)));deathPending.realm=0;deathPending.body=0;deathPending.world.location='city';deathPending.world.encounter={location:'city',index:1};assert(E.action(deathPending,'choice','challenge'));assert.equal(deathPending.world.deaths,1);assert.deepEqual(deathPending.world.director.pending,pendingSave.world.director.pending);
delayed.stage=2;show(delayed,follow);assert(E.action(delayed,'choice','claim'));assert.equal(W.recognition(delayed),0);assert.equal(delayed.world.director.paths[1].trade,1);
// A playable peaceful route reaches the same gate, with cultivation still required.
const peaceful=E.fresh();peaceful.stage=1;peaceful.found=true;peaceful.realm=3;peaceful.world.admission='gates';
for(const k of Object.keys(peaceful.resources))peaceful.resources[k]=10000;
for(const scene of generated.filter(e=>e.id.startsWith('forest:generated:0:')&&!e.payoff).slice(0,W.recognitionNeeded(peaceful))){show(peaceful,scene);assert(E.action(peaceful,'choice','supply'));show(peaceful,returnScene(scene));assert(E.action(peaceful,'choice','claim'));}
assert.equal(peaceful.wins,0);assert(E.canAdvance(peaceful));peaceful.realm=2;assert(!E.canAdvance(peaceful));peaceful.realm=3;
assert(E.action(peaceful,'advance'));assert.equal(peaceful.stage,2);assert.equal(W.recognition(peaceful),0);
assert(E.chapterIntro(peaceful).includes('люди, которым ты помог'));const introduction=E.chapterIntro(peaceful);peaceful.wins=6;assert.equal(E.chapterIntro(peaceful),introduction);
const replay=E.validate(JSON.parse(JSON.stringify(pendingSave)));
for(let i=0;i<30;i++)for(const s of [pendingSave,replay]){s.world.encounter=null;s.world.encounterCooldown=0;E.action(s,'encounter');if(s===replay)assert.deepEqual(s.world,pendingSave.world);}
for(const field of ['paths','pending']){const bad=E.fresh();bad.world.director[field]=[];assert.throws(()=>E.validate(bad));}
const bad=E.fresh();bad.world.director.pending[base.id]={stage:0,route:'trade'};assert.throws(()=>E.validate(bad));
const stale=E.fresh();stale.stage=2;stale.resources.herbs=100;show(stale,base);assert(!E.action(stale,'choice','supply'));assert(E.action(stale,'choice','skip'));
console.log('PASS: 1080 valid local scenes, causal outcomes, skill and resource gates, practice rewards, peaceful advancement, chapter attribution, save replay and failed combat');
