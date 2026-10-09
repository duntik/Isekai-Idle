const assert=require('node:assert/strict'),E=require('./engine.js'),W=E.world;
// Every currently available important acquaintance is offered within a bound,
// regardless of the seed. Declining the opportunity never accepts it for you.
for(let seed=1;seed<=200;seed++)for(const[location,ids]of [
  ['village',['village:0']],['forest',['forest:0','forest:2']],['city',['city:0']],['ruins',['ruins:2','ruins:3','ruins:4']],['mountains',['mountains:0']]
]){
  const s=E.fresh();s.world.seed=seed;s.stage=1;s.world.location=location;s.resources.herbs=100;
  const seen=new Set();for(let i=0;i<6+ids.length-1;i++){s.world.encounter=null;s.world.encounterCooldown=0;assert(E.action(s,'encounter'));seen.add(W.current(s).id);}
  for(const id of ids)assert(seen.has(id),`${seed}: missing ${id}`);assert.equal(s.stage,1);assert.equal(s.world.mentors.length,0);
}
const s=E.fresh();s.world.location='city';s.world.encounter={location:'city',index:1};assert(E.action(s,'choice','avoid'));
const follow=W.encounters.village.find(e=>e.id==='village:road-return');assert(W.eligible(s,follow));s.world.location='village';s.world.encounter={location:'village',index:W.encounters.village.indexOf(follow),id:follow.id};assert(E.action(s,'choice','road-herbs'));assert(!W.eligible(s,follow));assert.equal(s.world.director.decisions['city:1/avoid'],1);
const source=E.fresh();source.stage=1;source.world.location='forest';source.world.seed=42;E.action(source,'encounter');const before=W.current(source).id,saved=JSON.parse(JSON.stringify(source));
W.encounters.forest.reverse();try{const loaded=E.validate(saved);assert.equal(W.current(loaded).id,before);assert.equal(W.current(source).id,before);}finally{W.encounters.forest.reverse();}
const clone=E.validate(JSON.parse(JSON.stringify(s)));for(let i=0;i<20;i++){for(const x of [s,clone]){x.world.encounter=null;x.world.encounterCooldown=0;E.action(x,'encounter');}assert.deepEqual(s.world,clone.world);}
const death=E.fresh();death.world.director.decisions['city:1/avoid']=1;death.world.location='city';death.world.encounter={location:'city',index:1};assert(E.action(death,'choice','challenge'));assert.equal(death.world.director.decisions['city:1/avoid'],1);assert.equal(death.world.director.decisions['city:1/challenge'],undefined);
const old=E.fresh();delete old.world.director;assert.deepEqual(E.validate(old).world.director,{misses:{},decisions:{}});
const bad=E.fresh();bad.world.director.decisions['invented']=1;assert.throws(()=>E.validate(bad));
console.log('PASS: bounded opportunities over 200 seeds, causal follow-ups, stable scene IDs, saved director, death and migration');
