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
