'use strict';
const assert = require('node:assert/strict');
const E = require('./engine.js');
const Ch4 = require('./chapter-four.js');

// 1. Verify 9 episodes exist in order with unique IDs
assert.equal(Ch4.beats.length, 9, 'Chapter 4 must have exactly 9 episodes');
const expectedIds = [
  'imperial-road',
  'princess-encounter',
  'hall-examination',
  'black-moon-headquarters',
  'dragon-god-trial',
  'burning-heaven-clash',
  'imperial-ranking',
  'empire-honor',
  'imperial-sovereign-triumph'
];
for (let i = 0; i < expectedIds.length; i++) {
  assert.equal(Ch4.beats[i].id, expectedIds[i]);
  assert.equal(Ch4.beats[i].step, i);
}

// 2. Playthrough across all 4 sects
for (const sectKey of ['rescue', 'remains', 'invitation', 'gates']) {
  const s = E.fresh();
  s.stage = 3;
  s.world.location = 'city';
  s.world.admissionRoutes = sectKey === 'gates' ? [] : [sectKey];
  s.world.admission = sectKey;
  s.chapterFourStep = 0;

  // Step 0: Imperial Road
  assert(Ch4.isReady(s, 0));
  const b0 = Ch4.getBeat(s, 0, 'ru');
  assert.equal(b0.title, 'Имперский Тракт и Врата Столицы');
  assert(Ch4.action(s, null, E));
  assert.equal(s.chapterFourStep, 1);
  assert(s.resources.gold >= 100);

  // Step 1: Princess Encounter
  assert(!Ch4.isReady(s, 1));
  s.body = 5.0;
  assert(Ch4.isReady(s, 1));
  assert(Ch4.action(s, null, E));
  assert.equal(s.chapterFourStep, 2);

  // Step 2: Hall Examination
  assert(!Ch4.isReady(s, 2));
  s.realm = 7;
  s.wins = 8;
  assert(Ch4.isReady(s, 2));
  assert(Ch4.action(s, null, E));
  assert.equal(s.chapterFourStep, 3);

  // Step 3: Black Moon Headquarters
  assert(!Ch4.isReady(s, 3));
  s.resources.gold = 150;
  s.resources.herbs = 50;
  assert(Ch4.isReady(s, 3));
  assert(Ch4.action(s, null, E));
  assert.equal(s.chapterFourStep, 4);

  // Step 4: Dragon God Trial
  assert(!Ch4.isReady(s, 4));
  s.resources.qi = 100;
  s.explored = 850;
  assert(Ch4.isReady(s, 4));
  assert(Ch4.action(s, null, E));
  assert.equal(s.chapterFourStep, 5);

  // Step 5: Burning Heaven Clash
  assert(!Ch4.isReady(s, 5));
  s.wins = 9;
  assert(Ch4.isReady(s, 5));
  const b5 = Ch4.getBeat(s, 5, 'ru');
  const scion = Ch4.getScion(sectKey);
  assert(b5.text.includes(scion.name[0]), `Scion text must interpolate ${scion.name[0]}`);
  assert(Ch4.action(s, null, E));
  assert.equal(s.chapterFourStep, 6);

  // Step 6: Imperial Ranking
  assert(!Ch4.isReady(s, 6));
  s.realm = 8;
  s.wins = 10;
  assert(Ch4.isReady(s, 6));
  assert(Ch4.action(s, null, E));
  assert.equal(s.chapterFourStep, 7);

  // Step 7: Empire Honor
  assert(!Ch4.isReady(s, 7));
  s.calm = 95;
  s.resources.qi = 120;
  assert(Ch4.isReady(s, 7));
  assert(Ch4.action(s, null, E));
  assert.equal(s.chapterFourStep, 8);

  // Step 8: Imperial Sovereign Triumph
  assert(!Ch4.isReady(s, 8));
  s.realm = 9;
  s.wins = 11;
  s.resources.gold = 500;
  assert(Ch4.isReady(s, 8));
  assert(Ch4.action(s, null, E));
  assert.equal(s.chapterFourStep, 9);

  // 3. Save validation roundtrip at step 9
  const clone = E.validate(JSON.parse(JSON.stringify(s)));
  assert.equal(clone.chapterFourStep, 9, 'Validation must preserve chapterFourStep === 9');

  // 4. Bilingual check for all beats & directives
  for (let step = 0; step < 9; step++) {
    const ruBeat = Ch4.getBeat(s, step, 'ru');
    const enBeat = Ch4.getBeat(s, step, 'en');
    assert(!/[А-Яа-яЁё]/.test(enBeat.title), `EN Beat ${step} title must have no Cyrillic`);
    assert(!/[А-Яа-яЁё]/.test(enBeat.text), `EN Beat ${step} text must have no Cyrillic`);
    assert(!/[А-Яа-яЁё]/.test(enBeat.goal), `EN Beat ${step} goal must have no Cyrillic`);
    assert(!/[А-Яа-яЁё]/.test(enBeat.button), `EN Beat ${step} button must have no Cyrillic`);

    const ruDir = Ch4.systemDirective(s, step, 'ru');
    const enDir = Ch4.systemDirective(s, step, 'en');
    assert(!/[А-Яа-яЁё]/.test(enDir.header), `EN Directive ${step} header must have no Cyrillic`);
    assert(!/[А-Яа-яЁё]/.test(enDir.prompt), `EN Directive ${step} prompt must have no Cyrillic`);
    assert(!/[А-Яа-яЁё]/.test(enDir.world), `EN Directive ${step} world must have no Cyrillic`);
    assert(!/[А-Яа-яЁё]/.test(enDir.system), `EN Directive ${step} system must have no Cyrillic`);
  }
}

console.log('PASS: Chapter 4 nine-episode progression, sect differentiation, and save validation');
