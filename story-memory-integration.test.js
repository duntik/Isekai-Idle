'use strict';
const assert=require('node:assert/strict');
const E=require('./engine.js'),W=E.world,M=W.memory,C=require('./save-code.js');
const scene=id=>W.encounters[id.split(':')[0]].find(e=>e.id===id);
function put(s,id){const e=scene(id),place=id.split(':')[0];assert(e,id);s.world.location=place;s.world.journey=null;s.world.encounter={location:place,index:W.encounters[place].indexOf(e),id};return e;}
function choose(s,id,key){const e=put(s,id);assert(W.eligible(s,e),id+' prerequisites');assert(E.action(s,'choice',key),id+'/'+key);}
(async()=>{
  const s=E.fresh();assert.deepEqual(M.people(s),[],'no acquaintances before a meeting');
  s.storyStep=1;M.recordStory(s,1);assert.deepEqual(M.people(s).map(p=>p.id),['mei']);
  choose(s,'village:0','lesson');assert(s.world.people.ren.trust>0);
  const trust=s.world.people.ren.trust;put(s,'village:0');E.action(s,'choice','lesson');assert.equal(s.world.people.ren.trust,trust,'repeat lessons cannot farm trust');
  put(s,'city:0');const before=structuredClone(s.world.people);assert(!E.action(s,'choice','study'));assert.deepEqual(s.world.people,before,'unaffordable action never happened');
  put(s,'city:1');assert(E.action(s,'choice','challenge'));assert.equal(s.world.deaths,1);assert.equal(s.world.people.bai.trust,0);assert.equal(s.world.people.bai.memories.at(-1).kind,'failure');assert(!s.world.director.decisions['city:1/challenge']);
  assert.equal(s.world.people.ren.trust,trust,'death preserves relationships');assert(!W.eligible(s,scene('city:rival-rumor')),'failure does not create victory follow-up');
  choose(s,'forest:2','guide');assert(W.eligible(s,scene('forest:sen-second-chance')));assert(!W.eligible(s,scene('forest:sen-lin-treatment')));
  choose(s,'forest:sen-second-chance','lin');assert(W.eligible(s,scene('forest:sen-lin-treatment')));choose(s,'forest:sen-lin-treatment','lesson');assert(s.world.mentors.includes('herbalist'));
  const declined=E.fresh();declined.world.director.decisions['village:lin-delivered/rest']=1;
  choose(declined,'village:mei-caravan','later');assert.equal(declined.world.people.mei.memories.at(-1).kind,'declined');assert.equal(declined.world.people.mei.trust,0);assert(!declined.world.completed.includes('village:mei-caravan'));assert(!W.eligible(declined,scene('city:ho-caravan-payment')));
  declined.resources.herbs=8;choose(declined,'village:mei-caravan','accept');assert.equal(declined.resources.herbs,0);assert(W.eligible(declined,scene('city:ho-caravan-payment')));assert(!declined.world.people.ho,'promise does not meet its distant recipient');
  choose(declined,'city:ho-caravan-payment','pay');assert.equal(declined.resources.gold,22);put(declined,'city:ho-caravan-payment');assert(!E.action(declined,'choice','medicine'),'cannot claim alternate reward after payment');assert.equal(declined.resources.pills,0);declined.world.encounter=null;
  const strong=E.fresh();strong.realm=3;strong.body=20;choose(strong,'city:1','challenge');assert(W.eligible(strong,scene('city:rival-rumor')));strong.calm=3;const rivalTrust=strong.world.people.bai.trust;choose(strong,'city:rival-rumor','witnesses');assert.equal(strong.world.people.bai.trust,rivalTrust,'clear a rumour without implied friendship');assert(W.eligible(strong,scene('city:rival-apology')));
  choose(strong,'city:rival-apology','distance');assert(!W.eligible(strong,scene('city:rival-apology')),'distance resolves the conversation');
  const seed=s.world.seed;for(let i=0;i<4;i++){M.people(s,'ru');M.people(s,'en');M.context(s,scene('forest:sen-second-chance'),'en');W.map(s);W.developmentPaths(s);W.pendingQuests(s);}assert.equal(s.world.seed,seed,'UI reads never reroll events');
  for(const p of M.people(s,'en'))assert(!/[А-Яа-яЁё]/.test(p.name+p.role+p.status+p.summary+p.memories.join('')),'English memory display');
  const saved=await C.decode(await C.encode(s),E);assert.deepEqual(saved.world.people,s.world.people);assert.deepEqual(saved,s);
  const legacy=E.fresh();legacy.storyStep=1;legacy.world.mentors=['trainer','herbalist','scholar'];delete legacy.world.people;const migrated=E.validate(legacy);assert(['mei','ren','lin','wei'].every(id=>migrated.world.people[id]));assert.deepEqual(E.validate(migrated),migrated,'migration stable after first load');
  console.log('PASS: causal alternatives, declined/failed outcomes, one-time rewards, relationship persistence, migration and deterministic display');
})().catch(e=>{console.error(e);process.exitCode=1;});
