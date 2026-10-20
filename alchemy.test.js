'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const Alchemy = require('./alchemy.js');

test('Alchemy engine: fresh initialization and validation', () => {
  const alc = Alchemy.fresh();
  assert.equal(alc.level, 1);
  assert.equal(alc.xp, 0);
  assert.equal(alc.unlockedRecipes.includes('vigor_broth'), true);
  assert.equal(alc.ingredients.mountain_herb, 5);
  assert.equal(alc.ingredients.spring_water, 3);
  assert.equal(alc.stats.brews, 0);

  // Validation
  const validated = Alchemy.validate(null);
  assert.equal(validated.level, 1);
  assert.equal(validated.unlockedRecipes.length >= 1, true);

  const migrated = Alchemy.validate({
    level: 2,
    xp: 60,
    unlockedRecipes: ['vigor_broth', 'body_pill'],
    ingredients: { mountain_herb: 10 }
  });
  assert.equal(migrated.level, 2);
  assert.equal(migrated.xp, 60);
  assert.equal(migrated.ingredients.mountain_herb, 10);
  assert.equal(migrated.ingredients.spring_water, 0);
});

test('Alchemy engine: recipe brewing in normal crucible mode', () => {
  const s = {
    resources: { gold: 100, herbs: 20, qi: 50, pills: 0 },
    stamina: 20,
    staminaMax: 100,
    body: 1.0,
    realm: 1,
    alchemy: Alchemy.fresh()
  };

  assert.equal(Alchemy.canBrew(s, 'vigor_broth', 'crucible'), true);
  const herbsBefore = s.alchemy.ingredients.mountain_herb;
  const waterBefore = s.alchemy.ingredients.spring_water;

  // Brew
  Alchemy.brew(s, 'vigor_broth', 'crucible');
  assert.equal(s.alchemy.stats.brews, 1);
  assert.equal(s.alchemy.ingredients.mountain_herb < herbsBefore || s.alchemy.level >= 4, true);
  assert.equal(s.alchemy.ingredients.spring_water < waterBefore || s.alchemy.level >= 4, true);
  assert.equal(s.alchemy.xp > 0, true);
  assert.equal(s.alchemy.log.length >= 1, true);
});

test('Alchemy engine: Sky Poison Pearl 100% divine purification', () => {
  const s = {
    resources: { gold: 100, herbs: 20, qi: 50, pills: 0 },
    stamina: 20,
    staminaMax: 100,
    body: 1.0,
    realm: 1,
    alchemy: Alchemy.fresh()
  };

  const qiBefore = s.resources.qi;
  assert.equal(Alchemy.canBrew(s, 'vigor_broth', 'pearl'), true);

  // Brew with pearl
  const success = Alchemy.brew(s, 'vigor_broth', 'pearl');
  assert.equal(success, true);
  assert.equal(s.alchemy.stats.pearlPurified, 1);
  assert.equal(s.resources.qi < qiBefore, true);
  assert.equal(s.stamina, 80); // 20 + 60
  assert.match(s.alchemy.log[0].ru, /Очищение Жемчужиной Яда/);
  assert.match(s.alchemy.log[0].en, /Sky Poison Pearl Purification/);
});

test('Alchemy engine: Apothecary shop purchases and selling pure pills', () => {
  const s = {
    resources: { gold: 100, herbs: 20, qi: 50, pills: 3, reputation: 0, relics: 2 },
    stamina: 50,
    staminaMax: 100,
    body: 1.0,
    realm: 1,
    alchemy: Alchemy.fresh()
  };

  // Buy ingredients
  assert.equal(Alchemy.buy(s, 'iron_root', 2), true);
  assert.equal(s.alchemy.ingredients.iron_root, 2);
  assert.equal(s.resources.gold, 100 - (12 * 2));

  // Buy recipe
  assert.equal(Alchemy.buy(s, 'recipe_body_pill'), true);
  assert.equal(s.alchemy.unlockedRecipes.includes('body_pill'), true);

  // Selling pills: standard vs pure
  const goldBefore = s.resources.gold;
  assert.equal(Alchemy.sellPill(s, 'standard', 1), true);
  assert.equal(s.resources.gold, goldBefore + 20);
  assert.equal(s.resources.pills, 2);

  assert.equal(Alchemy.sellPill(s, 'pure', 1), true);
  assert.equal(s.resources.gold, goldBefore + 20 + 45);
  assert.equal(s.resources.reputation, 1);
  assert.equal(s.resources.pills, 1);

  // Grind relic
  assert.equal(Alchemy.grindRelic(s), true);
  assert.equal(s.resources.relics, 1);
  assert.equal(s.alchemy.ingredients.relic_dust, 2);
});

test('Alchemy engine: regional herb foraging and cooldown', () => {
  const s = {
    resources: { gold: 100, herbs: 20, qi: 50, pills: 0 },
    stamina: 50,
    staminaMax: 100,
    world: { location: 'village', journey: null },
    alchemy: Alchemy.fresh()
  };

  assert.equal(Alchemy.canForage(s, 'village'), true);
  const herbsBefore = s.alchemy.ingredients.mountain_herb;

  // Forage in village
  const success = Alchemy.forage(s, 'village');
  assert.equal(success, true);
  assert.equal(s.stamina, 40); // 50 - 10
  assert.equal(s.alchemy.ingredients.mountain_herb > herbsBefore, true);
  assert.equal(s.alchemy.stats.forages, 1);
  assert.equal(s.alchemy.forageCooldown > 0, true);

  // While on cooldown, canForage is false
  assert.equal(Alchemy.canForage(s, 'village'), false);

  // Advance cooldown timer
  Alchemy.advance(s, 60);
  assert.equal(s.alchemy.forageCooldown, 0);
  assert.equal(Alchemy.canForage(s, 'village'), true);

  // Forage in ruins
  s.stamina = 50;
  const dustBefore = s.alchemy.ingredients.relic_dust;
  const flameBefore = s.alchemy.ingredients.flame_bloom;
  assert.equal(Alchemy.forage(s, 'ruins'), true);
  assert.equal(s.alchemy.ingredients.relic_dust > dustBefore || s.alchemy.ingredients.flame_bloom > flameBefore, true);
});

test('Alchemy engine: Miracle Doctor Clinic patient treatment', () => {
  const s = {
    resources: { gold: 50, reputation: 0, qi: 50, pills: 0 },
    stamina: 50,
    alchemy: Alchemy.fresh()
  };

  // Uncle Ba requires vigor_broth
  assert.equal(Alchemy.canTreatPatient(s, 'ba_strained', false), false);
  s.alchemy.inventory.vigor_broth = 1;
  assert.equal(Alchemy.canTreatPatient(s, 'ba_strained', false), true);

  // Treat Uncle Ba with pill
  const treatBa = Alchemy.treatPatient(s, 'ba_strained', false);
  assert.equal(treatBa, true);
  assert.equal(s.alchemy.inventory.vigor_broth, 0);
  assert.equal(s.alchemy.patients.includes('ba_strained'), false);
  assert.equal(s.resources.gold, 50 + 35);
  assert.equal(s.resources.reputation, 1);
  assert.equal(s.alchemy.stats.patientsTreated, 1);

  // Hunter Darius poisoned, can treat via Sky Poison Pearl alternative purge
  assert.equal(Alchemy.canTreatPatient(s, 'hunter_poison', true), true);
  const qiBefore = s.resources.qi;
  const poisonSacBefore = s.alchemy.ingredients.poison_sac;

  const treatHunter = Alchemy.treatPatient(s, 'hunter_poison', true);
  assert.equal(treatHunter, true);
  assert.equal(s.resources.qi, qiBefore - 15);
  assert.equal(s.alchemy.ingredients.poison_sac, poisonSacBefore + 2);
  assert.equal(s.alchemy.patients.includes('hunter_poison'), false);
  assert.equal(s.alchemy.stats.patientsTreated, 2);
});

test('Alchemy engine: regional market pill trading and arbitrage', () => {
  const s = {
    resources: { gold: 0, pills: 0 },
    alchemy: Alchemy.fresh()
  };

  s.alchemy.inventory.vigor_broth = 3;
  // In village, vigor_broth buys for 35 coins
  assert.equal(Alchemy.sellSpecificPill(s, 'vigor_broth', 1, 'village'), true);
  assert.equal(s.resources.gold, 35);
  assert.equal(s.alchemy.inventory.vigor_broth, 2);
  assert.equal(s.alchemy.stats.pillsTraded, 1);

  // In ruins (ancient ruins sanctuary), evil_god_pill sells for 140 coins
  s.alchemy.inventory.evil_god_pill = 2;
  assert.equal(Alchemy.sellSpecificPill(s, 'evil_god_pill', 2, 'ruins'), true);
  assert.equal(s.resources.gold, 35 + (140 * 2));
  assert.equal(s.alchemy.inventory.evil_god_pill, 0);
  assert.equal(s.alchemy.stats.pillsTraded, 3);
});

test('Alchemy engine: combat pouch equipping and unequipping', () => {
  const s = {
    alchemy: Alchemy.fresh()
  };

  assert.equal(s.alchemy.pouch[0], 'vigor_broth');
  assert.equal(s.alchemy.pouch[1], null);

  // Equip body_pill to slot 1
  assert.equal(Alchemy.equipPouch(s, 'body_pill', 1), true);
  assert.equal(s.alchemy.pouch[1], 'body_pill');

  // Unequip slot 0
  assert.equal(Alchemy.equipPouch(s, 'none', 0), true);
  assert.equal(s.alchemy.pouch[0], null);
});

