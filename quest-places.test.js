'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),W=E.world;
function open(s,location,id){s.world.location=location;s.world.encounterCooldown=0;s.world.encounter={location,id,index:W.encounters[location].findIndex(e=>e.id===id)};}
const routes=[['village-mill','village','village:ren-balance','carry','beam','tong'],['forest-garden','village','village:lin-delivered','herbs','seeds','sui'],['ruins-observatory','city','city:wei-return','study','mirror','qiao']];
for(const[place,origin,quest,choice,discovery,person]of routes){
  const s=E.fresh();E.action(s,'story');s.body=3;s.calm=5;s.stamina=100;s.resources.herbs=20;s.world.mentors=['trainer','herbalist','scholar'];s.world.contacts=['scholar'];
  assert(!W.knownLocations(s).includes(place));assert(!W.map(s).nodes.some(n=>n.id===place));assert(!E.action(s,'travel',place));
  // Prerequisites belong to the earlier meetings in each existing quest chain.
  s.world.director.decisions['village:ren-load/lift']=1;s.world.director.decisions['forest:lin-clinic/prepare']=1;s.world.director.decisions['ruins:wei-compare/compare']=1;
  open(s,origin,quest);assert(E.action(s,'choice',choice));assert(W.knownLocations(s).includes(place));assert(s.events[0].text.includes('Открыта дорога:'));
  assert(!s.world.people[person]);assert.equal(s.world.visits[place],0);
  const parent=W.locations[place].parent;s.world.location=parent;s.world.encounter=null;
  const seed=s.world.seed;const map=W.map(s);assert(map.nodes.some(n=>n.id===place));assert(map.edges.some(e=>e.from===parent&&e.to===place));assert.equal(s.world.seed,seed);
  assert(E.action(s,'atlas-note',{id:place,text:'Вернуться за знаниями'}));assert(E.action(s,'atlas-pin',place));
  assert(E.action(s,'travel',place));const before=E.returnReport.snapshot(s);E.advance(s,3600);assert.equal(s.world.location,place);assert.equal(W.current(s).id,place+':0');assert(s.world.people[person]);assert(!s.world.completed.includes(place+':0'));assert.equal(s.world.deaths,0);
  const report=E.returnReport.describe(E,before,s,3600,'en');assert(!report.activity.includes('undefined'));assert(!/[А-Яа-яЁё]/.test(report.activity));assert(!E.action(s,'atlas-survey'));assert(!E.canActivity(s,'work'));
  assert(E.action(s,'choice',discovery));assert(s.world.completed.includes(place+':0'));assert.deepEqual(E.validate(JSON.parse(JSON.stringify(s))),s);
  const seen=[];for(let i=0;i<20;i++){s.world.encounter=null;s.world.encounterCooldown=0;assert(E.action(s,'encounter'));const scene=W.current(s);assert(!seen.slice(-2).includes(scene.id));seen.push(scene.id);}assert(new Set(seen).size===3);
  // Being in a main region different from the route entrance cannot skip its approach.
  s.world.location=parent==='village'?'forest':'village';s.world.encounter=null;assert(!E.action(s,'travel',place));
}
const old=E.fresh();for(const k of Object.keys(W.questPlaces.locations))delete old.world.visits[k];const migrated=E.validate(old);for(const k of Object.keys(W.questPlaces.locations))assert.equal(migrated.world.visits[k],0);
console.log('PASS: completed quests reveal real routes, parent access, travel before meeting, important discoveries, recurring variety, notes, saves and legacy visits');
