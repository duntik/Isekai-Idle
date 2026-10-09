'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),W=E.world,D=require('./data-view.js');
const s=E.fresh();assert(!E.action(s,'travel','mountains'));assert(!E.action(s,'travel','village'));
assert(E.action(s,'travel','forest'));assert(!E.action(s,'travel','city'));
E.advance(s,59);assert.equal(s.world.location,'village');assert.equal(s.world.encounter,null);
E.advance(s,1);assert.equal(s.world.location,'forest');assert(W.eligible(s,W.current(s)));s.world.encounter={location:'forest',index:0};
assert(E.action(s,'choice','learn'));assert(s.world.mentors.includes('herbalist'));assert.equal(s.resources.herbs,6);
assert(!E.action(s,'choice','learn'));assert(!E.action(s,'encounter'));E.advance(s,300);assert(E.action(s,'encounter'));
assert(W.eligible(s,W.current(s)));s.world.encounter={location:'forest',index:1};

// Death loses physical resources only, never progression or organization state.
s.realm=1;s.xp=7;s.body=2;s.mastery=1;s.style='ward';s.weapon=0;s.storyStep=4;s.found=true;s.calm=12;
s.resources.gold=20;s.resources.herbs=20;s.resources.reputation=8;s.resources.influence=9;s.resources.worlds=2;
const before=structuredClone(s);assert(E.power(s)<45);assert(E.action(s,'choice','fight'));
assert.equal(s.world.deaths,1);assert.equal(s.world.location,'village');assert.equal(s.resources.gold,10);assert.equal(s.resources.herbs,10);
for(const k of ['realm','xp','body','mastery','style','weapon','storyStep','found','calm','stage','life','souls','population','workers','buildings','wins'])assert.deepEqual(s[k],before[k]);
for(const k of ['reputation','influence','worlds'])assert.equal(s.resources[k],before.resources[k]);
assert.deepEqual(s.world.mentors,before.world.mentors);assert.equal(s.world.encounter,null);
assert.deepEqual(E.validate(s),s);

// Strong characters earn rewards; safe alternatives cannot kill a weak character.
const strong=E.fresh();strong.realm=3;strong.body=20;strong.world.location='city';strong.world.encounter={location:'city',index:1};
assert(E.action(strong,'choice','challenge'));assert.equal(strong.world.deaths,0);assert.equal(strong.resources.gold,30);
const safe=E.fresh();safe.world.location='ruins';safe.world.encounter={location:'ruins',index:1};assert(E.action(safe,'choice','retreat'));assert.equal(safe.world.deaths,0);assert.equal(safe.explored,20);

// Costs prevent free purchases; mentor bonuses are permanent and do not stack.
const helper=E.fresh();helper.world.location='city';helper.world.encounter={location:'city',index:0};assert(!E.action(helper,'choice','study'));
helper.resources.gold=10;assert(E.action(helper,'choice','study'));assert.equal(helper.resources.gold,0);assert.equal(W.bonus(helper).xp,1.15);
helper.world.encounter={location:'city',index:0};helper.resources.gold=10;assert(E.action(helper,'choice','study'));assert.equal(helper.world.mentors.length,1);
helper.found=true;E.action(helper,'activity','meditate');E.advance(helper,1);assert.equal(helper.xp,.05*1.15);

// Travel completes offline, but no choice or lethal encounter resolves itself.
const traveler=E.fresh();E.action(traveler,'order','ledger');E.action(traveler,'travel','city');
const online=structuredClone(traveler),offline=structuredClone(traveler);
for(let i=0;i<180;i++)E.advance(online,1);E.advance(offline,180);
assert.equal(offline.world.location,'city');assert(W.eligible(offline,W.current(offline)));assert.equal(offline.world.deaths,0);
assert(Math.abs(online.resources.gold-offline.resources.gold)<1e-8);assert.deepEqual(online.world,offline.world);
assert.deepEqual(E.validate(offline),offline);
const old=E.fresh();delete old.world;const migratedWorld=E.validate(old).world,defaults=W.fresh();defaults.seed=migratedWorld.seed;assert.deepEqual(migratedWorld,defaults);
const broken=E.fresh();broken.world.journey={destination:'mountains',remaining:30};assert.throws(()=>E.validate(broken));

// All encounters appear as neutral operations in data view.
for(const [location,list]of Object.entries(W.encounters))for(let index=0;index<list.length;index++){
  const preview=E.fresh();preview.stage=1;preview.world.location=location;preview.world.encounter={location,index};
  const html=D.render(preview,'world',E);assert(!/секта|герой|галактик|погиб|травниц|Жэнь|Белый Клык/.test(html));
  for(const c of list[index].choices)assert(html.includes(`data-value="${c.id}"`));
}
console.log('PASS: travel, encounter rotation, mentors, costs, safe/strong choices, death preserves progression, offline travel, migration, all neutral encounter controls');
