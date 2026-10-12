'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js');
function hero(){const s=E.fresh();E.action(s,'story');s.world.location='forest';s.world.encounter=null;s.stamina=100;s.resources.herbs=0;return s;}
const s=hero();s.activity='meditate';assert(E.action(s,'forest-search','deep'));assert.equal(s.activity,'rest');assert.equal(s.stamina,85);
const scene=E.world.current(s);assert(scene.exploration);assert.equal(s.world.deaths,0);
const saved=E.validate(JSON.parse(JSON.stringify(s)));assert.equal(E.world.current(saved).id,scene.id);
const risky=scene.choices.find(c=>c.danger),preview=E.choiceExplanation(s,scene,risky,'en');assert(!preview.risk.includes('Power check'));assert(preview.risk.includes('retreat'));assert(preview.available);
assert(!E.action(s,'forest-search','trail'));assert(E.action(s,'choice','retreat'));assert.equal(s.world.deaths,0);assert.equal(s.resources.herbs,0);
const weak=hero();weak.resources.gold=40;weak.resources.herbs=10;const body=weak.body;assert(E.action(weak,'forest-search','deep'));assert(E.action(weak,'choice','press'));assert.equal(weak.world.deaths,1);assert.equal(weak.resources.gold,20);assert.equal(weak.resources.herbs,5);assert.equal(weak.body,body);assert.equal(weak.world.location,'village');
const strong=hero();strong.realm=5;strong.body=60;assert(E.action(strong,'forest-search','trail'));assert(E.action(strong,'choice','press'));assert.equal(strong.world.deaths,0);assert(strong.resources.herbs>=8);
const offline=hero();assert(E.action(offline,'forest-search','deep'));E.advance(offline,3600);assert.equal(offline.world.deaths,0);assert(E.world.current(offline));
const away=hero();away.world.location='village';assert(!E.action(away,'forest-search','deep'));
console.log('PASS: deliberate exploration, warning before commitment, retreat, save, offline safety and retained development after resource loss');
