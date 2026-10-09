'use strict';
const assert = require('node:assert/strict');
const E = require('./engine.js');

// A real new character can reach the first chapter without injected resources.
const s = E.fresh();
assert.equal(E.action(s, 'activity', 'meditate'), true);
assert.equal(E.action(s, 'story'), true);
E.action(s,'activity','work');E.advance(s,50);assert.equal(E.action(s,'story'),true);
assert.equal(E.action(s, 'build', 'dorm'), false);
assert.equal(E.action(s, 'advance'), false);
E.action(s, 'activity', 'explore'); E.advance(s, 599); assert.equal(s.found, false);
E.advance(s, 1); assert.equal(s.found, true);
E.action(s, 'activity', 'train'); E.advance(s, 700);
assert.equal(E.action(s,'story'),true);
E.action(s,'activity','meditate');E.advance(s,250);assert.equal(E.action(s,'story'),true);
assert.equal(E.action(s,'story'),true);
assert.equal(E.action(s, 'fight'), true);
assert.equal(E.action(s, 'fight'), false);
E.action(s, 'activity', 'explore'); E.advance(s, 4000);
assert.equal(s.xp, E.needed(s));
assert.equal(E.action(s, 'breakthrough'), true);
assert.equal(E.action(s,'story'),true);assert.equal(E.action(s,'story'),true);
assert.equal(E.action(s, 'advance'), true);
assert.equal(s.stage, 1);

// Equivalent foreground and offline production, including starvation and timers.
const organization = E.fresh(); organization.stage = 6; organization.realm = 18; organization.found = true;
organization.activity = 'meditate'; organization.population = 3; organization.workers.alchemist = 2;
organization.resources.herbs = 3; organization.resources.qi = 5; organization.buildings.market = 1;
organization.routes = [{ remaining: 20 }]; organization.expedition = { kind: 'colonize', remaining: 25 };
const online = structuredClone(organization), offline = structuredClone(organization);
for (let i = 0; i < 360; i++) E.advance(online, 10);
E.advance(offline, 3600); assert.deepEqual(online, offline);
assert.equal(offline.resources.worlds, 1); assert.equal(offline.expedition, null);
assert(offline.resources.herbs >= 0 && offline.resources.qi >= 0);
const capped = E.fresh(); E.advance(capped, 200000); assert.equal(capped.age, 86400);

// Every chapter has a reachable gate; late systems stay locked before their chapter.
for (let stage = 0; stage < 7; stage++) {
  const character = E.fresh(); character.stage = stage; character.found = true;
  character.realm = E.stages[stage].realm; character.wins = E.stages[stage].wins;
  character.storyStep = E.story.length;
  Object.assign(character.resources, E.stages[stage].cost);
  assert.equal(E.action(character, 'advance'), true); assert.equal(character.stage, stage + 1);
  assert.equal(E.action(character, 'advance'), false);
  E.validate(character);
}
const town = E.fresh(); town.stage = 4; town.resources.gold = 10000; town.resources.wood = 10000; town.resources.ore = 10000; town.resources.supplies = 1000;
assert.equal(E.action(town, 'route'), false); assert.equal(E.action(town, 'build', 'market'), true);
assert.equal(E.action(town, 'route'), true); assert.equal(E.action(town, 'route'), false);
const world = E.fresh(); world.stage = 5; world.realm = 18; world.resources.qi = 2000; world.resources.supplies = 300;
assert.equal(E.action(world, 'portal'), true); assert.equal(E.action(world, 'portal'), false);
E.advance(world, 7200); assert.equal(world.resources.worlds, 1);
assert.equal(E.action(world, 'colonize'), false);
world.stage = 6; assert.equal(E.action(world, 'colonize'), false);
world.buildings.fleet = 2; world.resources.cosmic = 100; assert.equal(E.action(world, 'colonize'), true);
E.advance(world, 14400); assert.equal(world.resources.worlds, 2);

const invalid = E.fresh(); invalid.workers.miner = 1;
assert.throws(() => E.validate(invalid));
const imported = E.validate(JSON.parse(JSON.stringify(offline))); assert.deepEqual(imported, offline);
const legacy = E.fresh(); legacy.stage = 7; legacy.realm = 24; legacy.souls = 2;
assert.equal(E.action(legacy, 'rebirth'), true); assert.equal(legacy.souls, 6); assert.equal(legacy.stage, 0); assert.equal(legacy.life, 2);
assert.equal(legacy.storyStep,0);assert.equal(legacy.stamina,100);

// Active actions share a cooldown and stamina budget; no unlimited instant gains.
const active=E.fresh();assert.equal(E.action(active,'click','breathe'),true);
assert.equal(active.xp,0);assert.equal(active.resources.qi,0);assert.equal(active.calm,.2);
assert.equal(E.action(active,'click','sweep'),false);E.advance(active,.6);
const goldBefore=active.resources.gold;assert.equal(E.action(active,'click','sweep'),true);assert.equal(active.resources.gold-goldBefore,.4);
active.stamina=1;E.advance(active,.6);assert.equal(E.action(active,'click','run'),false);
E.advance(active,20);assert.equal(E.action(active,'click','run'),true);assert.equal(active.body,.07);
active.body=10;E.advance(active,1);assert.equal(E.action(active,'click','squat'),false);
active.body=0;E.advance(active,250);assert.equal(active.stamina,100);
active.explored=598;assert.equal(E.action(active,'click','scout'),true);assert.equal(active.found,true);
E.advance(active,1);assert.equal(E.action(active,'click','scout'),false);
assert.equal(E.action(active,'click','breathe'),true);assert(active.xp>=.12);assert.equal(active.resources.qi,.25);
active.stage=2;E.advance(active,1);assert.equal(E.action(active,'click','sweep'),false);
assert.deepEqual(E.validate(JSON.parse(JSON.stringify(active))),active);

// Story rewards are claimed once and cannot bypass an unfinished objective.
const plot=E.fresh();assert.equal(E.action(plot,'story'),true);assert.equal(plot.resources.gold,5);
assert.equal(E.action(plot,'story'),false);assert.equal(plot.resources.gold,5);
for(let i=0;i<10;i++){E.advance(plot,1);assert(E.action(plot,'click','sweep'));}
assert.equal(E.action(plot,'story'),true);assert.equal(plot.storyStep,2);
plot.realm=1;plot.wins=1;plot.found=true;plot.resources.herbs=100;
assert.equal(E.canAdvance(plot),false);
const old=E.fresh();old.stage=3;old.realm=8;old.resources.gold=123;
for(const key of ['stamina','clickCooldown','calm','storyStep','clicks'])delete old[key];
const upgraded=E.validate(old);assert.equal(upgraded.resources.gold,123);assert.equal(upgraded.realm,8);assert.equal(upgraded.storyStep,E.story.length);
const malformed=E.fresh();malformed.stamina=101;assert.throws(()=>E.validate(malformed));
console.log('PASS: first playable arc, chapter gates, offline parity, alchemy shortages, trade routes, portals, colonies, imports, rebirth');
