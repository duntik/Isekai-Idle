const assert=require('node:assert/strict'),E=require('./engine.js'),W=E.world;
function sequence(seed,location){const s=E.fresh();s.world.seed=seed;s.stage=1;s.world.location=location;const seen=[];
  for(let i=0;i<100;i++){s.world.encounter=null;s.world.encounterCooldown=0;assert(E.action(s,'encounter'));const scene=W.current(s);assert(W.eligible(s,scene));assert(scene.id.startsWith(location+':'));assert(!seen.slice(-2).includes(scene.id));seen.push(scene.id);}
  return seen;
}
for(const location of Object.keys(W.locations)){const a=sequence(1234,location),b=sequence(1234,location),c=sequence(4321,location);assert.deepEqual(a,b);assert.notDeepEqual(a,c);assert(new Set(a).size>=3);}
const s=E.fresh();s.stage=1;s.world.location='forest';s.world.encounter={location:'forest',index:2};s.resources.herbs=5;assert(E.action(s,'choice','heal'));assert(s.world.completed.includes('forest:2'));assert(!W.eligible(s,W.encounters.forest[2]));
s.world.mentors.push('herbalist');assert(!W.eligible(s,W.encounters.forest[0]));assert(W.eligible(s,W.encounters.forest[4]));
for(const[index,route,id]of [[3,'remains','return-remains'],[4,'invitation','invitation']]){s.world.location='ruins';s.world.encounter={location:'ruins',index};assert(E.action(s,'choice',id));assert(s.world.admissionRoutes.includes(route));assert(!W.eligible(s,W.encounters.ruins[index]));}
const clone=E.validate(JSON.parse(JSON.stringify(s)));for(let i=0;i<30;i++){for(const state of [s,clone]){state.world.encounter=null;state.world.encounterCooldown=0;E.action(state,'encounter');}assert.deepEqual(s.world,clone.world);}
const disciple=E.fresh();disciple.stage=2;assert(!W.eligible(disciple,W.encounters.city[4]));disciple.world.admission='gates';assert(W.eligible(disciple,W.encounters.city[4]));assert(!W.eligible(disciple,W.encounters.forest[2]));
const worker=E.fresh();assert(E.action(worker,'order','sweep'));worker.world.location='forest';assert(!E.action(worker,'click','sweep'));assert(E.action(worker,'cancel-order'));assert(!E.action(worker,'order','sweep'));worker.world.location='city';assert(E.action(worker,'order','sweep'));E.action(worker,'travel','forest');assert(!E.action(worker,'click','sweep'));
const old=E.fresh();for(const k of ['seed','recent','completed'])delete old.world[k];const migrated=E.validate(old);assert.equal(migrated.world.seed,2166136261);assert.deepEqual(migrated.world.completed,[]);
const bad=E.fresh();bad.world.completed=['city:0'];assert.throws(()=>E.validate(bad));
console.log('PASS: random local pools, varied sequences, no immediate repeats, story conditions, unique finds, saved random sequence, local jobs and migration');
