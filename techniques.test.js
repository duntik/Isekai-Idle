const assert=require('node:assert/strict');
const E=require('./engine.js');
const setup=()=>{const s=E.fresh();s.stage=1;s.found=true;s.realm=3;s.resources.qi=10000;s.resources.herbs=10000;return s;};
const s=setup();assert.equal(E.action(s,'learn-technique','sword'),false);assert.equal(E.action(s,'equip-technique','sky'),false);
assert(E.action(s,'learn-technique','sky'));assert.equal(s.cultivation.active,'sky');assert.equal(s.cultivation.learned.sky.rank,1);
assert.equal(E.action(s,'learn-technique','sky'),false);
E.action(s,'activity','technique');E.advance(s,239);assert.equal(E.action(s,'learn-technique','sky'),false);E.advance(s,1);assert(E.action(s,'learn-technique','sky'));
assert.equal(s.cultivation.learned.sky.rank,2);assert.equal(s.cultivation.learned.sky.progress,0);
const basic=setup(),med=setup();E.action(med,'learn-technique','sky');E.advance(basic,100);E.advance(med,100);assert(Math.abs(med.xp/basic.xp-1.08)<1e-8);
const body=setup();body.world.mentors.push('trainer');assert(E.action(body,'learn-technique','stance'));assert(E.action(body,'click','squat'));assert(Math.abs(body.body-.04*1.1*1.15*1.08)<1e-8);const before=body.body;E.advance(body,86400);assert.equal(body.body,before);
const fighter=setup(),unarmed=E.power(fighter);fighter.world.mentors.push('swordsman');assert(E.action(fighter,'learn-technique','sword'));assert(E.power(fighter)>unarmed);
for(const[k,route]of [['grove','rescue'],['cloud','remains'],['seal','invitation']]){const a=setup();a.world.admissionRoutes=[route];a.world.admission=route;assert.equal(E.action(a,'learn-technique',k),false);a.stage=2;assert(E.action(a,'learn-technique',k));assert.deepEqual(E.validate(JSON.parse(JSON.stringify(a))),a);}
const saved=JSON.parse(JSON.stringify(s));assert.deepEqual(E.validate(saved),s);saved.cultivation.active='sword';assert.throws(()=>E.validate(saved));saved.cultivation.active='sky';saved.cultivation.learned.sky.rank=6;assert.throws(()=>E.validate(saved));
const old=setup();delete old.cultivation;assert.deepEqual(E.validate(old).cultivation,{active:null,learned:{}});
const dead=setup();dead.realm=0;dead.world.mentors.push('trainer');E.action(dead,'learn-technique','stance');dead.world.location='city';dead.world.encounter={location:'city',index:1};E.action(dead,'choice','challenge');assert.equal(dead.world.deaths,1);assert.equal(dead.cultivation.learned.stance.rank,1);
for(let rank=s.cultivation.learned.sky.rank;rank<5;rank++){E.advance(s,E.techniqueNeeded(rank));assert(E.action(s,'learn-technique','sky'));}assert.equal(E.action(s,'learn-technique','sky'),false);
console.log('PASS: sources, sect prerequisites, ranks, active effects, offline practice, no passive body, death and migration');
