'use strict';
const assert = require('node:assert/strict');
const E = require('./engine.js');
const Ch6 = require('./chapter-six.js');

// 1. Verify 9 episodes exist in order with unique IDs
assert.equal(Ch6.beats.length, 9, 'Chapter 6 must have exactly 9 episodes');
const expectedIds = [
  'core-investiture',
  'sovereign-peak',
  'dao-treasure-inheritance',
  'mentoring-disciples',
  'dragon-god-body',
  'clan-hostility-siege',
  'crushing-the-elders',
  'imperial-preceptor-decree',
  'immortal-sect-founding'
];
for (let i = 0; i < expectedIds.length; i++) {
  assert.equal(Ch6.beats[i].id, expectedIds[i]);
  assert.equal(Ch6.beats[i].step, i);
}

// 2. Playthrough across all 4 sects
for (const sectKey of ['rescue', 'remains', 'invitation', 'gates']) {
  const s = E.fresh();
  s.stage = 5;
  s.world.location = 'city';
  s.world.admissionRoutes = sectKey === 'gates' ? [] : [sectKey];
  s.world.admission = sectKey;
  s.chapterSixStep = 0;

  // Step 0: Core Investiture
  assert(Ch6.isReady(s, 0));
  const b0 = Ch6.getBeat(s, 0, 'ru');
  assert.equal(b0.title, 'Указ Патриарха: Личный Преемник');
  assert(Ch6.action(s, null, E));
  assert.equal(s.chapterSixStep, 1);
  assert(s.resources.gold >= 150);

  // Step 1: Sovereign Peak
  assert(!Ch6.isReady(s, 1));
  s.body = 7.5;
  assert(Ch6.isReady(s, 1));
  assert(Ch6.action(s, null, E));
  assert.equal(s.chapterSixStep, 2);

  // Step 2: Dao Treasure Inheritance
  assert(!Ch6.isReady(s, 2));
  s.realm = 11;
  s.wins = 15;
  assert(Ch6.isReady(s, 2));
  assert(Ch6.action(s, null, E));
  assert.equal(s.chapterSixStep, 3);

  // Step 3: Mentoring Disciples
  assert(!Ch6.isReady(s, 3));
  s.resources.gold = 350;
  s.resources.relics = 12;
  assert(Ch6.isReady(s, 3));
  assert(Ch6.action(s, null, E));
  assert.equal(s.chapterSixStep, 4);

  // Step 4: Dragon God Body
  assert(!Ch6.isReady(s, 4));
  s.realm = 12;
  s.resources.qi = 150;
  assert(Ch6.isReady(s, 4));
  assert(Ch6.action(s, null, E));
  assert.equal(s.chapterSixStep, 5);

  // Step 5: Clan Hostility Siege
  assert(!Ch6.isReady(s, 5));
  s.wins = 16;
  s.body = 8.0;
  assert(Ch6.isReady(s, 5));
  const b5 = Ch6.getBeat(s, 5, 'ru');
  const scion = Ch6.getScion(sectKey);
  assert(b5.text.includes(scion.name[0]), `Scion text must interpolate ${scion.name[0]}`);
  assert(Ch6.action(s, null, E));
  assert.equal(s.chapterSixStep, 6);

  // Step 6: Crushing the Elders
  assert(!Ch6.isReady(s, 6));
  s.weapon = 3;
  s.mastery = 40;
  assert(Ch6.isReady(s, 6));
  assert(Ch6.action(s, null, E));
  assert.equal(s.chapterSixStep, 7);

  // Step 7: Imperial Preceptor Decree
  assert(!Ch6.isReady(s, 7));
  s.calm = 98;
  s.resources.qi = 180;
  assert(Ch6.isReady(s, 7));
  assert(Ch6.action(s, null, E));
  assert.equal(s.chapterSixStep, 8);

  // Step 8: Immortal Sect Founding
  assert(!Ch6.isReady(s, 8));
  s.realm = 14;
  s.wins = 18;
  s.resources.gold = 800;
  assert(Ch6.isReady(s, 8));
  assert(Ch6.action(s, null, E));
  assert.equal(s.chapterSixStep, 9);
  assert.equal(Ch6.isReady(s, 9), false);
  assert.equal(Ch6.getBeat(s, 9), null);
}

// 3. Test Directives & Fate Tree
const testState = E.fresh();
testState.stage = 5;
testState.chapterSixStep = 4;
const dir = Ch6.systemDirective(testState, 4, 'en');
assert(dir.header.includes('INSIGHT SYSTEM'));
assert(dir.world.length > 0);
assert(dir.system.length > 0);

const branchesRu = Ch6.getStoryBranches(testState, 'ru');
const branchesEn = Ch6.getStoryBranches(testState, 'en');
assert(branchesRu.length >= 2);
assert.equal(branchesRu.length, branchesEn.length);

console.log('PASS: Chapter 6 nine-episode progression, sect differentiation, and save validation');
