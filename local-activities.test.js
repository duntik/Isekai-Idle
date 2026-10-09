const assert=require('node:assert/strict'),E=require('./engine.js');
const s=E.fresh();assert(!E.action(s,'activity','explore'));assert(!E.action(s,'click','scout'));
s.world.location='forest';assert(E.action(s,'activity','explore'));E.advance(s,3600);assert(s.resources.herbs>0);assert.equal(s.resources.relics,0);assert.equal(s.explored,0);assert(!s.found);assert(!E.action(s,'click','scout'));
assert(E.action(s,'travel','ruins'));const h=s.resources.herbs;E.advance(s,60);assert.equal(s.resources.herbs,h);assert(E.activityRunning(s));E.advance(s,599);assert(!s.found);E.advance(s,1);assert(s.found);assert(s.resources.relics>0);
s.stage=2;s.world.location='city';assert(E.action(s,'activity','mission'));E.advance(s,100);const rep=s.resources.reputation;assert(rep>0);E.action(s,'travel','forest');const online=structuredClone(s),offline=structuredClone(s);for(let i=0;i<160;i++)E.advance(online,1);E.advance(offline,160);assert.deepEqual(online.world,offline.world);assert.equal(offline.resources.reputation,rep);assert(!E.activityRunning(offline));assert.equal(offline.activity,'mission');assert(!E.action(offline,'activity','mission'));
assert(E.action(offline,'activity','meditate'));const xp=offline.xp;E.advance(offline,100);assert(offline.xp>xp);assert(offline.calm>0);
const old=E.fresh();old.activity='explore';old.explored=500;const migrated=E.validate(old);E.advance(migrated,100);assert.equal(migrated.explored,500);assert(!migrated.found);assert(!E.activityRunning(migrated));
const first=E.fresh();first.found=true;first.world.location='village';assert(E.validate(first).found);
console.log('PASS: local exploration, real temple discovery, paused travel, assignments, offline parity and preserved old progress');
