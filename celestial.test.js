'use strict';
const assert = require('node:assert/strict');
const Celestial = require('./celestial.js');

// 1. Verify 4 weather phenomena exist in order
assert.equal(Celestial.ORDER.length, 4);
assert.deepEqual(Celestial.ORDER, ['calm', 'rain', 'blood_moon', 'zenith']);

// 2. Test rotation cycle across 7200 seconds
const s = { time: 0 };
let w0 = Celestial.getCurrentWeather(s, 'ru');
assert.equal(w0.id, 'calm');
assert.equal(w0.icon, '🌌');
assert.equal(w0.qiMult, 1.5);
assert.equal(w0.remainingSeconds, 1800);

s.time = 1800;
let w1 = Celestial.getCurrentWeather(s, 'ru');
assert.equal(w1.id, 'rain');
assert.equal(w1.icon, '🌧️');
assert.equal(w1.gardenGrowthMult, 1.5);
assert.equal(w1.dewRateMult, 1.5);

s.time = 3600;
let w2 = Celestial.getCurrentWeather(s, 'ru');
assert.equal(w2.id, 'blood_moon');
assert.equal(w2.icon, '🌕');
assert.equal(w2.beastCoreBonus, 1);

s.time = 5400;
let w3 = Celestial.getCurrentWeather(s, 'ru');
assert.equal(w3.id, 'zenith');
assert.equal(w3.icon, '☀️');
assert.equal(w3.flameHeatMult, 1.25);
assert.equal(w3.danDuQiDiscount, 0.20);

// Wrap around at 7200s
s.time = 7200;
let w4 = Celestial.getCurrentWeather(s, 'ru');
assert.equal(w4.id, 'calm');

// 3. Test bilingual output and absence of Cyrillic in English mode
for (let t = 0; t < 7200; t += 600) {
  const st = { time: t };
  const en = Celestial.getCurrentWeather(st, 'en');
  assert(!/[А-Яа-яЁё]/.test(en.name), `EN name at t=${t} has Cyrillic: ${en.name}`);
  assert(!/[А-Яа-яЁё]/.test(en.desc), `EN desc at t=${t} has Cyrillic: ${en.desc}`);
  assert(!/[А-Яа-яЁё]/.test(en.perk), `EN perk at t=${t} has Cyrillic: ${en.perk}`);
}

console.log('PASS: Celestial weather cycles, deterministic calculation, and bilingual integrity');
