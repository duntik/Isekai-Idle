'use strict';
const assert = require('node:assert/strict');
const E = require('./engine.js');
const Ch2 = require('./chapter-two.js');

// 1. Verify 9 episodes exist in order with unique IDs
assert.equal(Ch2.beats.length, 9, 'Chapter 2 must have exactly 9 episodes');
const expectedIds = [
  'outer-arrival',
  'sect-duties',
  'foundation-scriptures',
  'mentor-exam',
  'pill-refining',
  'weapon-mastery',
  'scion-conflict',
  'forbidden-archive',
  'outer-tournament'
];
for (let i = 0; i < expectedIds.length; i++) {
  assert.equal(Ch2.beats[i].id, expectedIds[i]);
  assert.equal(Ch2.beats[i].step, i);
}

// 2. Playthrough across all 4 sects
for (const sectKey of ['rescue', 'remains', 'invitation', 'gates']) {
  const s = E.fresh();
  s.stage = 1;
  s.world.location = 'city';
  s.world.admissionRoutes = sectKey === 'gates' ? [] : [sectKey];
  s.world.admission = sectKey;
  s.chapterTwoStep = 0;

  // Step 0: Outer Arrival
  assert(Ch2.isReady(s, 0));
  const b0 = Ch2.getBeat(s, 0, 'ru');
  assert.equal(b0.title, 'Врата великой секты');
  assert(E.action(s, 'story'));
  assert.equal(s.chapterTwoStep, 1);
  assert(s.resources.gold >= 25);

  // Step 1: Sect Duties
  assert(!Ch2.isReady(s, 1));
  s.body = 2.5;
  assert(Ch2.isReady(s, 1));
  assert(E.action(s, 'story'));
  assert.equal(s.chapterTwoStep, 2);

  // Step 2: Foundation Scriptures
  assert(!Ch2.isReady(s, 2));
  s.resources.qi = 15;
  assert(Ch2.isReady(s, 2));
  assert(E.action(s, 'story'));
  assert.equal(s.chapterTwoStep, 3);

  // Step 3: Mentor Exam
  assert(!Ch2.isReady(s, 3));
  s.realm = 2;
  s.resources.qi = 25;
  assert(Ch2.isReady(s, 3));
  assert(E.action(s, 'story'));
  assert.equal(s.chapterTwoStep, 4);

  // Step 4: Pill Refining
  assert(!Ch2.isReady(s, 4));
  s.resources.herbs = 15;
  assert(Ch2.isReady(s, 4));
  assert(E.action(s, 'story'));
  assert.equal(s.chapterTwoStep, 5);

  // Step 5: Weapon Mastery
  assert(!Ch2.isReady(s, 5));
  s.weapon = 1;
  assert(Ch2.isReady(s, 5));
  assert(E.action(s, 'story'));
  assert.equal(s.chapterTwoStep, 6);

  // Step 6: Scion Conflict
  assert(!Ch2.isReady(s, 6));
  s.wins = 2;
  assert(Ch2.isReady(s, 6));
  const b6 = Ch2.getBeat(s, 6, 'ru');
  const scion = Ch2.getScion(sectKey);
  assert(b6.text.includes(scion.name[0]), `Scion text must interpolate ${scion.name[0]}`);
  assert(E.action(s, 'story'));
  assert.equal(s.chapterTwoStep, 7);

  // Step 7: Forbidden Archive
  assert(!Ch2.isReady(s, 7));
  s.xp = 50;
  assert(Ch2.isReady(s, 7));
  assert(E.action(s, 'story'));
  assert.equal(s.chapterTwoStep, 8);

  // Step 8: Outer Tournament
  assert(!Ch2.isReady(s, 8));
  s.realm = 3;
  s.wins = 3;
  s.resources.gold = 150;
  assert(Ch2.isReady(s, 8));
  assert(E.action(s, 'story'));
  assert.equal(s.chapterTwoStep, 9);

  // 3. Save validation roundtrip at step 9
  const clone = E.validate(JSON.parse(JSON.stringify(s)));
  assert.equal(clone.chapterTwoStep, 9, 'Validation must preserve chapterTwoStep === 9');

  // 4. Bilingual check for all beats & directives
  for (let step = 0; step < 9; step++) {
    const ruBeat = Ch2.getBeat(s, step, 'ru');
    const enBeat = Ch2.getBeat(s, step, 'en');
    assert(!/[А-Яа-яЁё]/.test(enBeat.title), `EN Beat ${step} title must have no Cyrillic`);
    assert(!/[А-Яа-яЁё]/.test(enBeat.text), `EN Beat ${step} text must have no Cyrillic`);
    assert(!/[А-Яа-яЁё]/.test(enBeat.goal), `EN Beat ${step} goal must have no Cyrillic`);
    assert(!/[А-Яа-яЁё]/.test(enBeat.button), `EN Beat ${step} button must have no Cyrillic`);

    const ruDir = Ch2.systemDirective(s, step, 'ru');
    const enDir = Ch2.systemDirective(s, step, 'en');
    assert(!/[А-Яа-яЁё]/.test(enDir.header), `EN Directive ${step} header must have no Cyrillic`);
    assert(!/[А-Яа-яЁё]/.test(enDir.prompt), `EN Directive ${step} prompt must have no Cyrillic`);
    assert(!/[А-Яа-яЁё]/.test(enDir.world), `EN Directive ${step} world must have no Cyrillic`);
    assert(!/[А-Яа-яЁё]/.test(enDir.system), `EN Directive ${step} system must have no Cyrillic`);
  }
}

console.log('PASS: Chapter 2 nine-episode progression, sect differentiation, and save validation');
