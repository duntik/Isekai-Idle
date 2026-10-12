const assert=require('node:assert/strict'),E=require('./engine.js'),W=E.world;
const generated=W.encounters.village.filter(x=>x.generated&&!x.payoff);
const a=generated.find(x=>x.id==='village:generated:0:0:0:weather'),b=generated.find(x=>x.id==='village:generated:0:0:1:mistake');
const s=E.fresh();s.body=3;s.stamina=100;
function open(state,scene){state.world.location=scene.id.split(':')[0];state.world.encounter={location:state.world.location,index:W.encounters[state.world.location].indexOf(scene),id:scene.id};}
assert(W.eligible(s,a));open(s,a);assert(E.action(s,'choice','labor'));assert(!W.eligible(s,b),'one person cannot offer a second outstanding job');
const payoff=W.encounters.village.find(x=>x.id===a.id+':return');assert(W.eligible(s,payoff));open(s,payoff);assert(E.action(s,'choice','claim'));assert(W.eligible(s,b));
assert.match(W.sceneText(b,'text','en',s),/already completed work together/);
const saved=E.validate(JSON.parse(JSON.stringify(s)));assert.equal(W.sceneText(b,'text','en',saved),W.sceneText(b,'text','en',s));assert.deepEqual(saved.world.people,s.world.people);
const seed=s.world.seed;W.sceneText(b,'text','en',s);assert.equal(s.world.seed,seed,'reading causality consumes no RNG');
const gold=s.resources.gold;open(s,payoff);assert.equal(E.action(s,'choice','claim'),false);assert.equal(s.resources.gold,gold,'stale payoff cannot duplicate rewards');
const causal=Object.values(W.encounters).flat().filter(x=>x.causal);assert.equal(causal.length,8);
const leads=E.fresh();assert.deepEqual(W.causalLeads(leads),[]);
leads.world.director.decisions['forest:2/guide']=1;
assert(W.causalLeads(leads,'en').some(q=>q.id==='forest:sen-second-chance'&&q.location==='forest'));
leads.world.completed.push('forest:sen-second-chance');assert(!W.causalLeads(leads).some(q=>q.id==='forest:sen-second-chance'));
for(const scene of causal){assert(scene.person);assert(scene.cause);assert(scene.en.title);assert(scene.en.text);for(const c of scene.choices)assert(c.en.label);}
console.log('PASS: actor-specific unfinished tasks, completed-work context, save persistence, deterministic reading, causal bilingual metadata and replay protection');
