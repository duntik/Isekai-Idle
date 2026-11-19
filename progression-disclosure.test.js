'use strict';
const assert = require('node:assert/strict');
const E = require('./engine.js');
const Ch2 = require('./chapter-two.js');

// 1. Fresh state in Stage 0: strictly minimal mortal start
const s0 = E.fresh();
assert.equal(s0.stage, 0);
assert.equal(s0.storyStep, 0);
assert.equal(E.isUnlocked(s0, 'map'), false, 'Map must be locked at mortal start');
assert.equal(E.isUnlocked(s0, 'combat'), false, 'Combat must be locked at mortal start');
assert.equal(E.isUnlocked(s0, 'alchemy'), false, 'Alchemy must be locked in Chapter 1');
assert.equal(E.isUnlocked(s0, 'sect'), false, 'Sect must be locked in Chapter 1');
assert.equal(E.isUnlocked(s0, 'clinic'), false, 'Clinic must be locked in Chapter 1');
assert.equal(E.isUnlocked(s0, 'garden'), false, 'Garden must be locked in Chapter 1');
assert.equal(E.isUnlocked(s0, 'jasmine'), false, 'Jasmine must be locked in Chapter 1');
assert.equal(E.mapTier(s0), 0, 'Stage 0 must be Map Tier 0');
assert.equal(E.getCanonicalChapter(s0), 1, 'Stage 0 Step 0 must be Canonical Chapter 1');
assert.equal(E.getTome(s0).id, 1, 'Stage 0 must be Tome 1');

// 2. Progressive unlock within Chapter 1
// Step 0 -> Step 1 (fed by Mei)
assert(E.action(s0, 'name', 'Ли Юнь'));
assert(E.action(s0, 'story'));
assert.equal(E.isUnlocked(s0, 'map'), false);
assert.equal(E.isUnlocked(s0, 'combat'), false);
assert.equal(E.isUnlocked(s0, 'alchemy'), false);
assert.equal(E.getCanonicalChapter(s0), 2);

// Step 1 -> Step 2
s0.world.location = 'village';
s0.world.encounter = { location: 'village', index: 1, id: 'village:1' };
assert(E.action(s0, 'choice', 'work'));
assert(E.action(s0, 'order', 'ledger'));
E.advance(s0, 180);
assert(E.action(s0, 'claim-order'));
assert(E.action(s0, 'story'));
assert.equal(E.isUnlocked(s0, 'map'), false);
assert.equal(E.isUnlocked(s0, 'combat'), false);
assert.equal(E.isUnlocked(s0, 'alchemy'), false);
assert.equal(E.getCanonicalChapter(s0), 3);

// Step 2 -> Step 3
while (s0.body < 2) { E.advance(s0, 10); assert(E.action(s0, 'click', 'squat')); }
assert(E.action(s0, 'story'));
assert.equal(E.isUnlocked(s0, 'map'), false);
assert.equal(E.isUnlocked(s0, 'combat'), false);
assert.equal(E.isUnlocked(s0, 'alchemy'), false);
assert.equal(E.getCanonicalChapter(s0), 4);

// Step 3 -> Step 4
E.action(s0, 'activity', 'meditate');
E.advance(s0, 250);
assert(E.action(s0, 'story'));
assert.equal(E.isUnlocked(s0, 'map'), true, 'Map unlocks at step 4 upon finding ancient ruins');
assert.equal(E.isUnlocked(s0, 'combat'), false, 'Combat remains locked at step 4');
assert.equal(E.isUnlocked(s0, 'alchemy'), false, 'Alchemy remains strictly locked in Chapter 1');
assert.equal(E.mapTier(s0), 0, 'Chapter 1 map remains Tier 0 (crude sketch)');
assert.equal(E.getCanonicalChapter(s0), 5);

// Step 4 -> Step 5
E.action(s0, 'travel', 'ruins');
E.advance(s0, 600);
assert(E.action(s0, 'activity', 'explore'));
E.advance(s0, 600);
assert(s0.found, 'Ruins discovered');
assert(E.action(s0, 'story'));
assert.equal(E.isUnlocked(s0, 'map'), true);
assert.equal(E.isUnlocked(s0, 'combat'), false);
assert.equal(E.isUnlocked(s0, 'alchemy'), false);
assert.equal(E.getCanonicalChapter(s0), 6);

// Step 5 -> Step 6: Roadblock encounter unlocks Combat
assert(E.action(s0, 'activity', 'meditate'));
E.advance(s0, 1201);
assert(E.action(s0, 'breakthrough'));
assert.equal(E.isUnlocked(s0, 'alchemy'), false, 'Breakthrough in Chapter 1 must NOT unlock alchemy');
E.action(s0, 'travel', 'village');
E.advance(s0, 180);
assert(E.action(s0, 'story'));
assert.equal(E.isUnlocked(s0, 'combat'), true, 'Combat unlocks at step 6 upon facing White Fang bandits');
assert.equal(E.isUnlocked(s0, 'alchemy'), false, 'Alchemy remains locked at step 6');
assert.equal(E.getCanonicalChapter(s0), 7);

// 3. Stage 1 (Outer Disciple): Alchemy strictly locked until Step 4 (Pill Hall)
const s1 = E.fresh();
s1.stage = 1;
s1.world.location = 'city';
s1.world.admission = 'gates';
s1.chapterTwoStep = 0;
assert.equal(E.mapTier(s1), 1, 'Stage 1 is Map Tier 1');
assert.equal(E.isUnlocked(s1, 'map'), true);
assert.equal(E.isUnlocked(s1, 'combat'), true);
assert.equal(E.isUnlocked(s1, 'sect'), true);
assert.equal(E.isUnlocked(s1, 'alchemy'), false, 'Alchemy must be locked at start of Chapter 2 (Outer chores)');
assert.equal(E.getTome(s1).id, 2, 'Stage 1 must be Tome 2');
assert.equal(E.getCanonicalChapter(s1), 8, 'Stage 1 step 0 must be Canonical Chapter 8');

// Step 0 -> 1: Sect duties
assert(E.action(s1, 'story'));
assert.equal(s1.chapterTwoStep, 1);
assert.equal(E.isUnlocked(s1, 'alchemy'), false);
assert.equal(E.getCanonicalChapter(s1), 9);

// Step 1 -> 2: Scripture pavilion
s1.body = 2.5;
assert(E.action(s1, 'story'));
assert.equal(s1.chapterTwoStep, 2);
assert.equal(E.isUnlocked(s1, 'pavilion'), true, 'Pavilion unlocks at step 2');
assert.equal(E.isUnlocked(s1, 'alchemy'), false);
assert.equal(E.getCanonicalChapter(s1), 10);

// Step 2 -> 3: Mentor exam
s1.resources.qi = 15;
assert(E.action(s1, 'story'));
assert.equal(s1.chapterTwoStep, 3);
assert.equal(E.isUnlocked(s1, 'clinic'), true, 'Clinic unlocks at step 3');
assert.equal(E.isUnlocked(s1, 'alchemy'), false);
assert.equal(E.getCanonicalChapter(s1), 11);

// Step 3 -> 4: Pill Hall admission!
s1.realm = 2;
s1.resources.qi = 25;
assert(E.action(s1, 'story'));
assert.equal(s1.chapterTwoStep, 4);
assert.equal(E.isUnlocked(s1, 'alchemy'), true, 'Alchemy unlocks upon completing Step 3 (entering Pill Hall)');
assert.equal(E.isUnlocked(s1, 'auction'), true);
assert.equal(E.isUnlocked(s1, 'garden'), false, 'Garden remains locked until Step 5');
assert.equal(E.isUnlocked(s1, 'jasmine'), false, 'Jasmine remains locked until Step 7');
assert.equal(E.getCanonicalChapter(s1), 12);

// Step 4 -> 5: Beast Range and Garden
s1.resources.herbs = 15;
assert(E.action(s1, 'story'));
assert.equal(s1.chapterTwoStep, 5);
assert.equal(E.isUnlocked(s1, 'garden'), true, 'Garden unlocks at step 5');
assert.equal(E.isUnlocked(s1, 'beastRange'), true, 'Beast Range unlocks at step 5');
assert.equal(E.isUnlocked(s1, 'jasmine'), false);
assert.equal(E.getCanonicalChapter(s1), 13);

// Step 6 -> 7: Jasmine Sanctuary
s1.weapon = 1;
assert(E.action(s1, 'story')); // step 5 -> 6
s1.wins = 2;
assert(E.action(s1, 'story')); // step 6 -> 7
assert.equal(E.isUnlocked(s1, 'jasmine'), true, 'Jasmine sanctuary unlocks at step 7');
assert.equal(E.getCanonicalChapter(s1), 14);

// 4. Canonical chapter range validation across all 8 stages
for (let stage = 0; stage < 8; stage++) {
  const st = E.fresh();
  st.stage = stage;
  for (let step = 0; step < 9; step++) {
    st.storyStep = step;
    st.chapterTwoStep = step;
    st.chapterThreeStep = step;
    st.chapterFourStep = step;
    st.chapterFiveStep = step;
    st.chapterSixStep = step;
    const ch = E.getCanonicalChapter(st);
    assert(ch >= 1 && ch <= 56, `Canonical chapter ${ch} out of bounds for stage ${stage}`);
    assert.equal(ch >= stage * 7 + 1, true, `Stage ${stage} chapter ${ch} below min expected`);
    assert.equal(ch <= stage * 7 + 7, true, `Stage ${stage} chapter ${ch} above max expected`);
  }
}

// 5. Anti-spoiler save validation sanitization
const maliciousSave = E.fresh();
maliciousSave.stage = 0;
maliciousSave.unlocked = {
  alchemy: true,
  garden: true,
  clinic: true,
  auction: true,
  jasmine: true,
  map: true
};
const sanitized = E.validate(maliciousSave);
assert.equal(sanitized.unlocked.alchemy, false, 'Validator must sanitize stage 0 alchemy unlock');
assert.equal(sanitized.unlocked.garden, false, 'Validator must sanitize stage 0 garden unlock');
assert.equal(sanitized.unlocked.clinic, false, 'Validator must sanitize stage 0 clinic unlock');
assert.equal(sanitized.unlocked.auction, false, 'Validator must sanitize stage 0 auction unlock');
assert.equal(sanitized.unlocked.jasmine, false, 'Validator must sanitize stage 0 jasmine unlock');
assert.equal(E.isUnlocked(sanitized, 'alchemy'), false, 'isUnlocked must evaluate to false for stage 0');

// 6. Tomes dictionary integrity
assert.equal(E.tomes.length, 10, 'There must be exactly 10 canonical tomes');
for (const tome of E.tomes) {
  assert(tome.id >= 1 && tome.id <= 10, 'Tome id must be 1..10');
  assert(typeof tome.name === 'string' && tome.name.length > 0, 'Tome Russian name required');
  assert(typeof tome.en === 'string' && tome.en.length > 0, 'Tome English name required');
  assert(!/[А-Яа-яЁё]/.test(tome.en), 'Tome English name must have no Cyrillic characters');
}

console.log('PASS: progressive disclosure, chapter gating, map tiers, canonical 56 chapters and save sanitization');
