'use strict';
const assert = require('node:assert/strict');
const E = require('./engine.js');
const Ch5 = require('./chapter-five.js');

// 1. Verify 9 episodes exist in order with unique IDs
assert.equal(Ch5.beats.length, 9, 'Chapter 5 must have exactly 9 episodes');
const expectedIds = [
  'tournament-assembly',
  'arena-proclamation',
  'iron-bastion-clash',
  'storm-sword-duel',
  'asgard-ice-resonance',
  'burning-heir-standoff',
  'overlord-heavy-wrath',
  'unmasking-treachery',
  'champion-coronation'
];
for (let i = 0; i < expectedIds.length; i++) {
  assert.equal(Ch5.beats[i].id, expectedIds[i]);
  assert.equal(Ch5.beats[i].step, i);
}

// 2. Playthrough across all 4 sects
for (const sectKey of ['rescue', 'remains', 'invitation', 'gates']) {
  const s = E.fresh();
  s.stage = 4;
  s.world.location = 'city';
  s.world.admissionRoutes = sectKey === 'gates' ? [] : [sectKey];
  s.world.admission = sectKey;
  s.chapterFiveStep = 0;

  // Step 0: Tournament Assembly
  assert(Ch5.isReady(s, 0));
  const b0 = Ch5.getBeat(s, 0, 'ru');
  assert.equal(b0.title, 'Сбор Великого Турнира в Столице');
  assert(Ch5.action(s, null, E));
  assert.equal(s.chapterFiveStep, 1);
  assert(s.resources.gold >= 120);

  // Step 1: Arena Proclamation
  assert(!Ch5.isReady(s, 1));
  s.body = 6.0;
  assert(Ch5.isReady(s, 1));
  assert(Ch5.action(s, null, E));
  assert.equal(s.chapterFiveStep, 2);

  // Step 2: Iron Bastion Clash
  assert(!Ch5.isReady(s, 2));
  s.realm = 8;
  s.wins = 11;
  assert(Ch5.isReady(s, 2));
  assert(Ch5.action(s, null, E));
  assert.equal(s.chapterFiveStep, 3);

  // Step 3: Storm Sword Duel
  assert(!Ch5.isReady(s, 3));
  s.resources.gold = 250;
  s.resources.relics = 10;
  assert(Ch5.isReady(s, 3));
  const b3 = Ch5.getBeat(s, 3, 'ru');
  const scion = Ch5.getScion(sectKey);
  assert(b3.text.includes(scion.name[0]), `Scion text must interpolate ${scion.name[0]}`);
  assert(Ch5.action(s, null, E));
  assert.equal(s.chapterFiveStep, 4);

  // Step 4: Asgard Ice Resonance
  assert(!Ch5.isReady(s, 4));
  s.realm = 9;
  s.resources.qi = 100;
  assert(Ch5.isReady(s, 4));
  assert(Ch5.action(s, null, E));
  assert.equal(s.chapterFiveStep, 5);

  // Step 5: Burning Heir Standoff
  assert(!Ch5.isReady(s, 5));
  s.wins = 12;
  s.body = 7.0;
  assert(Ch5.isReady(s, 5));
  assert(Ch5.action(s, null, E));
  assert.equal(s.chapterFiveStep, 6);

  // Step 6: Overlord Heavy Wrath
  assert(!Ch5.isReady(s, 6));
  s.weapon = 2;
  s.mastery = 30;
  assert(Ch5.isReady(s, 6));
  assert(Ch5.action(s, null, E));
  assert.equal(s.chapterFiveStep, 7);

  // Step 7: Unmasking Treachery
  assert(!Ch5.isReady(s, 7));
  s.calm = 95;
  s.resources.qi = 120;
  assert(Ch5.isReady(s, 7));
  assert(Ch5.action(s, null, E));
  assert.equal(s.chapterFiveStep, 8);

  // Step 8: Champion Coronation
  assert(!Ch5.isReady(s, 8));
  s.realm = 10;
  s.wins = 13;
  s.resources.gold = 500;
  assert(Ch5.isReady(s, 8));
  assert(Ch5.action(s, null, E));
  assert.equal(s.chapterFiveStep, 9);
  assert.equal(Ch5.isReady(s, 9), false);
  assert.equal(Ch5.getBeat(s, 9), null);
}

// 3. Test Directives & Fate Tree
const testState = E.fresh();
testState.stage = 4;
testState.chapterFiveStep = 4;
const dir = Ch5.systemDirective(testState, 4, 'en');
assert(dir.header.includes('INSIGHT SYSTEM'));
assert(dir.world.length > 0);
assert(dir.system.length > 0);

const branchesRu = Ch5.getStoryBranches(testState, 'ru');
const branchesEn = Ch5.getStoryBranches(testState, 'en');
assert(branchesRu.length >= 2);
assert.equal(branchesRu.length, branchesEn.length);

console.log('PASS: Chapter 5 nine-episode progression, sect differentiation, and save validation');
