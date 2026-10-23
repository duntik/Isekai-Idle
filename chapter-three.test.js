'use strict';
const assert = require('node:assert/strict');
const E = require('./engine.js');
const Ch3 = require('./chapter-three.js');

// 1. Verify 9 episodes exist in order with unique IDs
assert.equal(Ch3.beats.length, 9, 'Chapter 3 must have exactly 9 episodes');
const expectedIds = [
  'inner-sanctuary',
  'sacred-scriptures',
  'crescent-tournament',
  'scion-reckoning',
  'beast-expedition',
  'fire-seed-awakening',
  'fairy-salvation',
  'beast-tide-defense',
  'sovereign-ascension'
];
for (let i = 0; i < expectedIds.length; i++) {
  assert.equal(Ch3.beats[i].id, expectedIds[i]);
  assert.equal(Ch3.beats[i].step, i);
}

// 2. Playthrough across all 4 sects
for (const sectKey of ['rescue', 'remains', 'invitation', 'gates']) {
  const s = E.fresh();
  s.stage = 2;
  s.world.location = 'city';
  s.world.admissionRoutes = sectKey === 'gates' ? [] : [sectKey];
  s.world.admission = sectKey;
  s.chapterThreeStep = 0;

  // Step 0: Inner Sanctuary
  assert(Ch3.isReady(s, 0));
  const b0 = Ch3.getBeat(s, 0, 'ru');
  assert.equal(b0.title, 'Внутренний двор и Павильон Заслуг');
  assert(Ch3.action(s, null, E));
  assert.equal(s.chapterThreeStep, 1);
  assert(s.resources.gold >= 50);

  // Step 1: Sacred Scriptures
  assert(!Ch3.isReady(s, 1));
  s.body = 4.0;
  assert(Ch3.isReady(s, 1));
  assert(Ch3.action(s, null, E));
  assert.equal(s.chapterThreeStep, 2);

  // Step 2: Crescent Tournament
  assert(!Ch3.isReady(s, 2));
  s.realm = 4;
  s.wins = 4;
  assert(Ch3.isReady(s, 2));
  assert(Ch3.action(s, null, E));
  assert.equal(s.chapterThreeStep, 3);

  // Step 3: Scion Reckoning
  assert(!Ch3.isReady(s, 3));
  s.wins = 5;
  assert(Ch3.isReady(s, 3));
  const b3 = Ch3.getBeat(s, 3, 'ru');
  const scion = Ch3.getScion(sectKey);
  assert(b3.text.includes(scion.name[0]), `Scion text must interpolate ${scion.name[0]}`);
  assert(Ch3.action(s, null, E));
  assert.equal(s.chapterThreeStep, 4);

  // Step 4: Beast Expedition
  assert(!Ch3.isReady(s, 4));
  s.resources.herbs = 30;
  s.explored = 700;
  assert(Ch3.isReady(s, 4));
  assert(Ch3.action(s, null, E));
  assert.equal(s.chapterThreeStep, 5);

  // Step 5: Fire Seed Awakening
  assert(!Ch3.isReady(s, 5));
  s.realm = 5;
  s.resources.qi = 50;
  assert(Ch3.isReady(s, 5));
  assert(Ch3.action(s, null, E));
  assert.equal(s.chapterThreeStep, 6);

  // Step 6: Fairy Salvation
  assert(!Ch3.isReady(s, 6));
  s.resources.relics = 8;
  s.resources.qi = 140;
  assert(Ch3.isReady(s, 6));
  assert(Ch3.action(s, null, E));
  assert.equal(s.chapterThreeStep, 7);

  // Step 7: Beast Tide Defense
  assert(!Ch3.isReady(s, 7));
  s.realm = 5;
  s.wins = 6;
  assert(Ch3.isReady(s, 7));
  assert(Ch3.action(s, null, E));
  assert.equal(s.chapterThreeStep, 8);

  // Step 8: Sovereign Ascension
  assert(!Ch3.isReady(s, 8));
  s.realm = 6;
  s.wins = 7;
  s.resources.gold = 300;
  assert(Ch3.isReady(s, 8));
  assert(Ch3.action(s, null, E));
  assert.equal(s.chapterThreeStep, 9);

  // 3. Save validation roundtrip at step 9
  const clone = E.validate(JSON.parse(JSON.stringify(s)));
  assert.equal(clone.chapterThreeStep, 9, 'Validation must preserve chapterThreeStep === 9');

  // 4. Bilingual check for all beats & directives
  for (let step = 0; step < 9; step++) {
    const ruBeat = Ch3.getBeat(s, step, 'ru');
    const enBeat = Ch3.getBeat(s, step, 'en');
    assert(!/[А-Яа-яЁё]/.test(enBeat.title), `EN Beat ${step} title must have no Cyrillic`);
    assert(!/[А-Яа-яЁё]/.test(enBeat.text), `EN Beat ${step} text must have no Cyrillic`);
    assert(!/[А-Яа-яЁё]/.test(enBeat.goal), `EN Beat ${step} goal must have no Cyrillic`);
    assert(!/[А-Яа-яЁё]/.test(enBeat.button), `EN Beat ${step} button must have no Cyrillic`);

    const ruDir = Ch3.systemDirective(s, step, 'ru');
    const enDir = Ch3.systemDirective(s, step, 'en');
    assert(!/[А-Яа-яЁё]/.test(enDir.header), `EN Directive ${step} header must have no Cyrillic`);
    assert(!/[А-Яа-яЁё]/.test(enDir.prompt), `EN Directive ${step} prompt must have no Cyrillic`);
    assert(!/[А-Яа-яЁё]/.test(enDir.world), `EN Directive ${step} world must have no Cyrillic`);
    assert(!/[А-Яа-яЁё]/.test(enDir.system), `EN Directive ${step} system must have no Cyrillic`);
  }
}

console.log('PASS: Chapter 3 nine-episode progression, sect differentiation, and save validation');
