'use strict';
const assert = require('node:assert/strict');
const E = require('./engine.js');
const W = E.world;
const A = E.atlas;

// 1. Fresh state: player knows village, but hasn't visited forest yet.
const s = E.fresh();
const initialForest = A.overview(s, E, 'forest', 'ru');
assert.equal(initialForest.visited, false);
assert.equal(initialForest.tier, 0);
assert(initialForest.desc.includes('Неизведанная область'));
assert(initialForest.bonus.includes('ещё не разведаны'));
assert(initialForest.danger.includes('не разведаны'));

// Pure English reading check
const enForest = A.overview(s, E, 'forest', 'en');
assert.equal(enForest.visited, false);
assert(!/[А-Яа-яЁё]/.test(JSON.stringify(enForest)));
assert(enForest.desc.includes('Unexplored area'));

// 2. Story step 1: Mei tells player about forest & ruins
E.action(s, 'story'); // step 0 -> 1
const rumorForest = A.overview(s, E, 'forest', 'ru');
assert.equal(rumorForest.visited, false);
assert.equal(rumorForest.tier, 1);
assert(rumorForest.desc.includes('По слухам'));
assert(rumorForest.desc.includes('травами'));
assert(rumorForest.danger.includes('звериные глаза'));

const journalForestRumor = A.journal(s, E, 'forest', 'ru');
assert(journalForestRumor.summary.includes('со слов и слухов'));
assert(journalForestRumor.facts.some(f => f.includes('Слух')));

// 3. Visiting the forest
assert(E.action(s, 'travel', 'forest'));
E.advance(s, W.locations.forest.time);
assert.equal(s.world.location, 'forest');

const visitedForest = A.overview(s, E, 'forest', 'ru');
assert.equal(visitedForest.visited, true);
assert.equal(visitedForest.tier, 2);
assert(visitedForest.desc.includes('Лес Шепчущих Корней'));
assert(visitedForest.bonus.includes('прояснятся после осмотра'));
assert(visitedForest.danger.includes('ещё не проверены'));

// 4. Meeting character: Herbalist Lin
s.world.encounter = { location: 'forest', index: 0, id: 'forest:0' };
E.world.memory.recordMeeting(s, E.world.current(s));
const metLinOverview = A.overview(s, E, 'forest', 'ru');
assert(metLinOverview.desc.includes('Линь'));
const metLinJournal = A.journal(s, E, 'forest', 'ru');
assert(metLinJournal.facts.some(f => f.includes('Линь')));

// 5. Gathering resources: Herbs
assert(E.action(s, 'choice', 'gather'));
const gatheredJournal = A.journal(s, E, 'forest', 'ru');
assert(gatheredJournal.resources.includes('Травы'));
assert(gatheredJournal.facts.some(f => f.includes('Сбор трав проверен лично')));

// 6. Surveying surroundings
assert(E.action(s, 'atlas-survey'));
const surveyedForest = A.overview(s, E, 'forest', 'ru');
assert.equal(surveyedForest.tier, 3); // surveyed (1 survey)
assert.equal(surveyedForest.surveys, 1);
assert(surveyedForest.bonus.includes('+50%'));
assert(surveyedForest.danger.includes('Опушка безопасна'));

// Second survey unlocks shortcut trail and tier 4 (mastered/inhabited)
E.advance(s, 300);
assert(E.action(s, 'atlas-survey'));
const masteredForest = A.overview(s, E, 'forest', 'ru');
assert.equal(masteredForest.tier, 4); // 2 surveys + people met
assert.equal(masteredForest.trail, true);

// 7. Verify seed unchanged and bilingual pure reading
const seed = s.world.seed;
const beforeSnapshot = JSON.stringify(s);
const enFinal = A.overview(s, E, 'forest', 'en');
const enJournal = A.journal(s, E, 'forest', 'en');
assert.equal(s.world.seed, seed);
assert.equal(JSON.stringify(s), beforeSnapshot);
assert(!/[А-Яа-яЁё]/.test(JSON.stringify(enFinal)));
assert(!/[А-Яа-яЁё]/.test(JSON.stringify(enJournal)));

console.log('PASS: progressive location knowledge fog of war, rumors, visits, NPC residences, resource harvest and surveys');
