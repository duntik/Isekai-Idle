'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),W=E.world;
function meet(s,location,id,choice){
  s.world.location=location;s.world.journey=null;
  s.world.encounter={location,id,index:W.encounters[location].findIndex(e=>e.id===id)};
  assert(E.action(s,'choice',choice));
}

// A fresh stranger has no employer. A meeting unlocks only that person's jobs.
const s=E.fresh();
for(const kind of Object.keys(E.orders))assert(!E.action(s,'order',kind));
assert(E.action(s,'story'));
assert(E.canOrder(s,'sweep'));assert(!E.canOrder(s,'ledger'));assert(!E.canOrder(s,'haul'));
meet(s,'village','village:1','work');assert(E.canOrder(s,'ledger'));
assert(E.action(s,'order','ledger'));E.advance(s,60);
assert.equal(s.employment.order.progress,60);

// Work belongs to one employer and one place, including background and collection.
const progress=s.employment.order.progress;
s.world.location='city';E.advance(s,300);
assert.equal(s.employment.order.progress,progress);assert(!E.activityRunning(s));
assert(!E.action(s,'claim-order'));
s.world.location='village';E.advance(s,120);assert.equal(s.employment.order.progress,180);
s.world.location='city';assert(!E.action(s,'claim-order'));
s.world.location='village';assert(E.action(s,'claim-order'));assert.equal(s.employment.completed,1);
assert(E.action(s,'order','sweep'));assert(E.action(s,'click','sweep'));
const swept=s.employment.order.progress;
s.world.location='city';E.advance(s,10);assert(!E.action(s,'click','sweep'));
assert.equal(s.employment.order.progress,swept);
s.world.location='village';assert(E.action(s,'click','sweep'));
assert.equal(s.employment.order.progress,swept+1);
assert.deepEqual(E.validate(JSON.parse(JSON.stringify(s))),s);

// The courier route must open the city before sect membership to avoid a circular gate.
const courier=E.fresh();assert(!W.canTravel(courier,'city'));
assert(!E.action(courier,'travel','city'));assert.equal(courier.world.journey,null);
meet(courier,'village','village:2','letter');assert(W.canTravel(courier,'city'));
assert(E.action(courier,'travel','city'));E.advance(courier,W.locations.city.time);
assert.equal(courier.world.location,'city');
meet(courier,'city','city:wei-letter','deliver-letter');
assert(courier.world.completed.includes('city:wei-letter'));
assert.equal(courier.world.admission,null);assert(E.canOrder(courier,'ledger'));

// Fog reveals nearby paths and encounters while rendering leaves story randomness intact.
const explorer=E.fresh();
assert.deepEqual(W.map(explorer).nodes.map(n=>n.id),['village']);
const initialFog=W.map(explorer).fogCount;
assert(E.action(explorer,'story'));assert(W.map(explorer).fogCount<initialFog);
const snapshot=JSON.stringify(explorer);
W.map(explorer);W.map(explorer,'en');assert.equal(JSON.stringify(explorer),snapshot);
assert(E.action(explorer,'travel','forest'));E.advance(explorer,W.locations.forest.time);
explorer.world.encounter=null;explorer.world.encounterCooldown=0;
assert(W.map(explorer).nodes.some(n=>n.id==='dark-forest'&&n.locked));
assert(E.action(explorer,'map-inspect','dark-forest'));
assert.equal(explorer.world.location,'forest');assert.equal(explorer.world.encounter,null);
assert(!explorer.world.map.explored.includes('dark-forest'));
assert.equal(explorer.world.deaths,0);
explorer.realm=1;assert(E.action(explorer,'map-inspect','dark-forest'));
assert(explorer.world.map.explored.includes('dark-forest'));
assert.equal(W.current(explorer).id,'forest:1');
assert.deepEqual(E.validate(JSON.parse(JSON.stringify(explorer))),explorer);

// Older saves keep their location and permanent contacts without a map field.
const legacy=structuredClone(courier);delete legacy.world.map;
const migrated=E.validate(legacy);assert.equal(migrated.world.location,'city');
assert(migrated.world.contacts.includes('scholar'));assert(W.map(migrated).nodes.some(n=>n.id==='city'));

// Recorded encounter sites lead back to accepted follow-ups, not a completed introduction.
const continuation=E.fresh();continuation.storyStep=1;continuation.world.location='forest';continuation.body=8;
const scene=W.encounters.forest.find(scene=>scene.generated&&!scene.payoff&&W.eligible(continuation,scene)&&scene.choices.find(c=>c.id==='labor').requires(continuation));
assert(scene);continuation.world.map.sites.push(scene.id);meet(continuation,'forest',scene.id,'labor');
continuation.world.encounterCooldown=0;
assert(W.map(continuation).nodes.some(node=>node.id===`site:${scene.id}`&&!node.locked));
assert(E.action(continuation,'map-inspect',`site:${scene.id}`));assert.equal(W.current(continuation).id,scene.id+':return');
assert(E.action(continuation,'choice','claim'));assert.equal(W.recognition(continuation),1);
assert(W.map(continuation).nodes.find(node=>node.id===`site:${scene.id}`).locked);
console.log('PASS: meeting-based jobs, exact-place work/payment, courier passage, fog, safe refusal, map follow-ups and migration');
