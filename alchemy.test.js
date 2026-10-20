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

test('Alchemy engine: Spiritual Garden initial state and strict save validation', () => {
  const alc = Alchemy.fresh();
  assert.equal(alc.garden.unlockedPlots, 2);
  assert.equal(alc.garden.dew, 1);
  assert.equal(alc.garden.dewMax, 5);
  assert.equal(alc.garden.seeds.mountain_herb_seed, 2);
  assert.equal(alc.garden.seeds.spirit_clover_seed, 1);
  assert.equal(alc.garden.plots.length, 6);
  assert.equal(alc.garden.plots[0].seed, null);

  // Strict deep-equal invariant for save validation
  assert.deepEqual(Alchemy.validate(Alchemy.fresh()), Alchemy.fresh());
  assert.deepEqual(Alchemy.validate(JSON.parse(JSON.stringify(Alchemy.fresh()))), Alchemy.fresh());

  // Legacy save migration with missing garden field
  const legacy = {
    level: 2,
    xp: 80,
    unlockedRecipes: ['vigor_broth', 'body_pill'],
    inventory: { vigor_broth: 1 },
    ingredients: { mountain_herb: 5 }
  };
  const migrated = Alchemy.validate(legacy);
  assert.equal(migrated.garden.unlockedPlots, 2);
  assert.equal(migrated.garden.dew, 1);
  assert.equal(migrated.garden.seeds.mountain_herb_seed, 2);
  assert.equal(migrated.garden.plots.length, 6);
});

test('Alchemy engine: Garden seed planting and growth stage progression', () => {
  const s = {
    resources: { gold: 100, herbs: 0, qi: 50, pills: 0 },
    alchemy: Alchemy.fresh()
  };

  // Plot 0 is unlocked and empty
  assert.equal(Alchemy.canPlant(s, 0, 'mountain_herb_seed'), true);
  // Plot 2 is locked at start
  assert.equal(Alchemy.canPlant(s, 2, 'mountain_herb_seed'), false);

  // Plant mountain_herb_seed (matureTime = 180s)
  assert.equal(Alchemy.plant(s, 0, 'mountain_herb_seed'), true);
  assert.equal(s.alchemy.garden.seeds.mountain_herb_seed, 1);
  assert.equal(s.alchemy.garden.plots[0].seed, 'mountain_herb_seed');
  assert.equal(s.alchemy.garden.plots[0].growthSeconds, 0);

  // Stage 1: Sprout (0s < 180s)
  let stage = Alchemy.getPlotStage(s.alchemy.garden.plots[0]);
  assert.equal(stage.stage, 'sprout');
  assert.equal(stage.progressPercent, 0);
  assert.equal(Alchemy.canHarvest(s, 0), false);

  // Advance 90s: halfway through sprout
  Alchemy.advance(s, 90);
  stage = Alchemy.getPlotStage(s.alchemy.garden.plots[0]);
  assert.equal(stage.stage, 'sprout');
  assert.equal(stage.progressPercent, 50);
  assert.equal(Alchemy.canHarvest(s, 0), false);

  // Advance another 90s (total 180s = matureTime): Stage 2: Mature
  Alchemy.advance(s, 90);
  stage = Alchemy.getPlotStage(s.alchemy.garden.plots[0]);
  assert.equal(stage.stage, 'mature');
  assert.equal(Alchemy.canHarvest(s, 0), true);

  // Advance to 3 * 180s = 540s: Stage 3: Century-Aged
  Alchemy.advance(s, 360);
  stage = Alchemy.getPlotStage(s.alchemy.garden.plots[0]);
  assert.equal(stage.stage, 'century');
  assert.equal(Alchemy.canHarvest(s, 0), true);

  // Advance to 8 * 180s = 1440s: Stage 4: Millennium Transmuted
  Alchemy.advance(s, 900);
  stage = Alchemy.getPlotStage(s.alchemy.garden.plots[0]);
  assert.equal(stage.stage, 'millennium');
  assert.equal(Alchemy.canHarvest(s, 0), true);
});

test('Alchemy engine: Garden Dew condensation, watering, and Qi infusion', () => {
  const s = {
    resources: { gold: 100, herbs: 0, qi: 50, pills: 0 },
    alchemy: Alchemy.fresh()
  };

  // Initial dew = 1
  assert.equal(s.alchemy.garden.dew, 1);

  // Advance 1800s (30 min) -> Dew should condense +1 drop (total 2)
  Alchemy.advance(s, 1800);
  assert.equal(s.alchemy.garden.dew, 2);

  // Plant a seed in plot 0
  Alchemy.plant(s, 0, 'spirit_clover_seed');
  const plot = s.alchemy.garden.plots[0];
  assert.equal(plot.watered, false);

  // Water plot with Dew
  assert.equal(Alchemy.canWater(s, 0), true);
  assert.equal(Alchemy.waterPlot(s, 0), true);
  assert.equal(s.alchemy.garden.dew, 1);
  assert.equal(plot.watered, true);
  assert.equal(plot.growthSeconds >= 3600, true); // instant +1 hr

  // Once watered, cannot water again until harvested
  assert.equal(Alchemy.canWater(s, 0), false);

  // Qi infusion: costs 15 Qi, adds +1800s
  const growthBefore = plot.growthSeconds;
  assert.equal(Alchemy.canInfuse(s, 0), true);
  assert.equal(Alchemy.infusePlot(s, 0), true);
  assert.equal(s.resources.qi, 35); // 50 - 15
  assert.equal(plot.infused, true);
  assert.equal(plot.growthSeconds, growthBefore + 1800);

  // Watered growth multiplier check: 10 seconds of dt gives 15 seconds of growth (1.5x)
  const gBefore = plot.growthSeconds;
  Alchemy.advance(s, 10);
  assert.equal(plot.growthSeconds, gBefore + 15);
});

test('Alchemy engine: Garden harvesting at mature, century, and millennium stages', () => {
  const s = {
    resources: { gold: 100, herbs: 0, qi: 50, pills: 0 },
    alchemy: Alchemy.fresh()
  };

  // Test 1: Mature harvest
  Alchemy.plant(s, 0, 'mountain_herb_seed');
  // Mountain herb mature time = 180s
  s.alchemy.garden.plots[0].growthSeconds = 200;
  const herbsBefore = s.alchemy.ingredients.mountain_herb;
  const harvestSuccess = Alchemy.harvest(s, 0);
  assert.equal(harvestSuccess, true);
  assert.equal(s.alchemy.ingredients.mountain_herb > herbsBefore, true);
  assert.equal(s.alchemy.garden.plots[0].seed, null); // cleared

  // Test 2: Century harvest yields aged herb + guaranteed seed return
  Alchemy.plant(s, 0, 'spirit_clover_seed');
  s.alchemy.garden.plots[0].growthSeconds = 480 * 4; // Century stage
  const agedBefore = s.alchemy.ingredients.aged_spirit_clover;
  const cloverSeedsBefore = s.alchemy.garden.seeds.spirit_clover_seed;
  assert.equal(Alchemy.harvest(s, 0), true);
  assert.equal(s.alchemy.ingredients.aged_spirit_clover, agedBefore + 1);
  assert.equal(s.alchemy.garden.seeds.spirit_clover_seed, cloverSeedsBefore + 1);

  // Test 3: Millennium harvest with watered mutation
  s.alchemy.garden.seeds.flame_bloom_seed = 1;
  Alchemy.plant(s, 1, 'flame_bloom_seed');
  s.alchemy.garden.plots[1].watered = true;
  s.alchemy.garden.plots[1].growthSeconds = 1800 * 9; // Millennium stage
  assert.equal(Alchemy.harvest(s, 1), true);
  assert.equal(s.alchemy.garden.stats.millenniumMutations >= 0, true);
  assert.equal(s.alchemy.garden.plots[1].seed, null);
});

test('Alchemy engine: Garden plot unlocking and Jasmine dialogue interaction', () => {
  const s = {
    resources: { gold: 500, herbs: 0, qi: 100, relics: 1, pills: 0 },
    alchemy: Alchemy.fresh()
  };

  // Initially 2 plots unlocked
  assert.equal(s.alchemy.garden.unlockedPlots, 2);

  // Plot 2 requires Alchemy rank 2, 20 Qi, 50 gold
  assert.equal(Alchemy.canUnlockPlot(s, 2), false); // rank 1 currently

  // Advance alchemy rank to 2
  s.alchemy.level = 2;
  assert.equal(Alchemy.canUnlockPlot(s, 2), true);
  assert.equal(Alchemy.unlockPlot(s, 2), true);
  assert.equal(s.alchemy.garden.unlockedPlots, 3);
  assert.equal(s.resources.qi, 80); // 100 - 20
  assert.equal(s.resources.gold, 450); // 500 - 50

  // Plot 3 requires rank 3
  assert.equal(Alchemy.canUnlockPlot(s, 3), false);

  // Jasmine dialogue
  // All plots empty
  const quoteEmpty = Alchemy.getJasmineGardenQuote(s, 'ru');
  assert.match(quoteEmpty, /ленивый глупец/);

  // Growing plants
  Alchemy.plant(s, 0, 'mountain_herb_seed');
  const quoteGrowing = Alchemy.getJasmineGardenQuote(s, 'ru');
  assert.match(quoteGrowing, /Изначальный Источник наполняет ростки/);

  // Century plants
  s.alchemy.garden.plots[0].growthSeconds = 180 * 4;
  const quoteCentury = Alchemy.getJasmineGardenQuote(s, 'en');
  assert.match(quoteCentury, /absorbed century qi/);
});


