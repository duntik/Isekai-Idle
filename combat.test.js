'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('./engine.js');
const Combat = require('./combat.js');

test('Combat engine: fresh combat initialization', () => {
  const s = E.fresh();
  const c = Combat.freshCombat(s, E);

  assert.equal(c.round, 1);
  assert.equal(c.finished, false);
  assert.equal(c.victory, false);
  assert.equal(c.playerHp > 0, true);
  assert.equal(c.playerPoise > 0, true);
  assert.equal(c.playerStamina, 100);
  assert.equal(c.enemyHp > 0, true);
  assert.equal(c.enemyPoise > 0, true);
  assert.equal(c.pearlUsed, false);
  assert.equal(Array.isArray(c.log), true);
  assert.equal(c.log.length >= 1, true);
});

test('Combat engine: validation and state sanitization', () => {
  assert.equal(Combat.validate(null), null);
  assert.equal(Combat.validate('invalid'), null);
  assert.equal(Combat.validate({}), null);

  const valid = Combat.validate({
    round: 3,
    foeName: 'Test Rival',
    foeType: 'armored',
    foePower: 30,
    playerHp: 80,
    playerMaxHp: 100,
    playerPoise: 20,
    playerMaxPoise: 40,
    playerStamina: 70,
    playerMaxStamina: 100,
    enemyHp: 50,
    enemyMaxHp: 120,
    enemyPoise: 15,
    enemyMaxPoise: 40,
    enemyStamina: 90,
    enemyIntent: 'heavy',
    enemyStunned: false,
    pearlUsed: false,
    log: [{ round: 1, ru: 'Привет', en: 'Hello' }],
    finished: false,
    victory: false
  });

  assert.notEqual(valid, null);
  assert.equal(valid.round, 3);
  assert.equal(valid.foeName, 'Test Rival');
  assert.equal(valid.foeType, 'armored');
});

test('Combat engine: tactical actions (thrust, heavy, parry, technique, pearl, pill)', () => {
  const s = E.fresh();
  s.resources.qi = 50;
  s.resources.pills = 2;
  s.cultivation.active = 'stance';
  s.combat = Combat.freshCombat(s, E);
  const c = s.combat;

  // 1. Parry action
  const initialStamina = c.playerStamina;
  Combat.act(s, 'parry', E);
  assert.equal(c.playerStamina >= initialStamina, true);
  assert.equal(c.log.length >= 2, true);

  // 2. Thrust action
  const enemyHpBeforeThrust = c.enemyHp;
  Combat.act(s, 'thrust', E);
  assert.equal(c.enemyHp < enemyHpBeforeThrust, true);

  // 3. Heavy action
  const enemyPoiseBeforeHeavy = c.enemyPoise;
  Combat.act(s, 'heavy', E);
  assert.equal(c.enemyPoise < enemyPoiseBeforeHeavy || c.enemyStunned, true);

  // 4. Martial technique action
  const qiBefore = s.resources.qi;
  Combat.act(s, 'technique', E);
  assert.equal(s.resources.qi < qiBefore, true);

  // 5. Sky Poison Pearl burst
  assert.equal(c.pearlUsed, false);
  Combat.act(s, 'pearl', E);
  assert.equal(c.pearlUsed, true);
  assert.equal(c.playerStamina, c.playerMaxStamina);

  // Re-use of pearl in same duel should fail
  assert.equal(Combat.act(s, 'pearl', E), false);

  // 6. Alchemical pill consumption
  const pillsBefore = s.resources.pills;
  Combat.act(s, 'pill', E);
  assert.equal(s.resources.pills, pillsBefore - 1);
});

test('Combat engine: guard break and stun turn', () => {
  const s = E.fresh();
  s.combat = Combat.freshCombat(s, E);
  s.combat.enemyPoise = 1;

  // Force heavy strike to break poise
  Combat.act(s, 'heavy', E);
  assert.match(s.combat.log[0].ru, /СТОЙКА ПРОБИТА/);
  assert.match(s.combat.log[0].en, /GUARD BROKEN/);
});

test('Combat engine: victory spoils and progression', () => {
  const s = E.fresh();
  s.combat = Combat.freshCombat(s, E);
  s.combat.enemyHp = 2; // Low hp so next strike finishes enemy

  const winsBefore = s.wins;
  const goldBefore = s.resources.gold;
  const herbsBefore = s.resources.herbs;
  const relicsBefore = s.resources.relics;

  Combat.act(s, 'thrust', E);
  assert.equal(s.combat.finished, true);
  assert.equal(s.combat.victory, true);
  assert.equal(s.wins, winsBefore + 1);
  assert.equal(s.resources.gold > goldBefore, true);
  assert.equal(s.resources.herbs > herbsBefore, true);
  assert.equal(s.resources.relics, relicsBefore + 1);
  assert.equal(s.cooldown, 300);
});

test('Combat engine: tactical retreat upon defeat', () => {
  const s = E.fresh();
  s.combat = Combat.freshCombat(s, E);
  s.combat.playerHp = 1;
  s.combat.enemyIntent = 'heavy';
  s.combat.enemyStunned = false;

  // Player performs a non-lethal action, enemy attacks and finishes player
  Combat.act(s, 'parry', E);
  assert.equal(s.combat.finished, true);
  assert.equal(s.combat.victory, false);
  assert.equal(s.cooldown, 60);
  assert.match(s.combat.log[0].ru, /Твои силы иссякли/);
});

test('Combat engine: momentum accumulation and full momentum critical burst', () => {
  const s = E.fresh();
  s.combat = Combat.freshCombat(s, E);
  s.combat.enemyHp = 200;
  s.combat.enemyMaxHp = 200;
  s.combat.momentum = 3;

  // With 3 momentum, next thrust or heavy consumes all momentum and deals critical burst
  Combat.act(s, 'thrust', E);
  assert.equal(s.combat.momentum, 0);
  const hasCritLog = s.combat.log.some(l => l.ru.includes('БОЕВОЙ КУРАЖ: РЕШАЮЩИЙ ВЫПАД'));
  assert.equal(hasCritLog, true);
});

test('Combat engine: Evil God Gate awakening when battered below 35% HP', () => {
  const s = E.fresh();
  s.combat = Combat.freshCombat(s, E);
  s.combat.playerHp = Math.floor(s.combat.playerMaxHp * 0.3); // Low HP trigger
  assert.equal(s.combat.evilGodAwakened, false);

  Combat.act(s, 'parry', E);
  assert.equal(s.combat.evilGodAwakened, true);
  const hasAwakeningLog = s.combat.log.some(l => l.ru.includes('ПРОБУЖДЕНИЕ ВРАТ ЗЛОГО БОГА'));
  assert.equal(hasAwakeningLog, true);
});

test('Combat engine: technique-specific profiles (stance, cloud, grove)', () => {
  const s = E.fresh();
  s.resources.qi = 50;

  // Stance: sets guardBuff for mitigating enemy attack
  s.cultivation.active = 'stance';
  s.combat = Combat.freshCombat(s, E);
  Combat.act(s, 'technique', E);
  const hasStanceLog = s.combat.log.some(l => l.ru.includes('Корни камня'));
  assert.equal(hasStanceLog, true);

  // Cloud: dodges enemy attack via evasion
  s.cultivation.active = 'cloud';
  s.combat = Combat.freshCombat(s, E);
  Combat.act(s, 'technique', E);
  const hasEvasionLog = s.combat.log.some(l => l.ru.includes('рассекает лишь остаточный силуэт в воздухе'));
  assert.equal(hasEvasionLog, true);

  // Grove: heals player HP
  s.cultivation.active = 'grove';
  s.combat = Combat.freshCombat(s, E);
  s.combat.playerHp = 20;
  Combat.act(s, 'technique', E);
  assert.equal(s.combat.playerHp > 20, true);
});

test('Combat engine: boss enrage trigger at 50% HP', () => {
  const s = E.fresh();
  s.combat = Combat.freshCombat(s, E);
  s.combat.enemyHp = Math.floor(s.combat.enemyMaxHp * 0.45);
  assert.equal(s.combat.bossPhaseTriggered, false);

  Combat.act(s, 'parry', E);
  assert.equal(s.combat.bossPhaseTriggered, true);
  const hasEnrageLog = s.combat.log.some(l => l.ru.includes('ЯРОСТЬ СОПЕРНИКА'));
  assert.equal(hasEnrageLog, true);
});

test('Combat engine: weapon venom coating and poison DoT', () => {
  const s = E.fresh();
  s.combat = Combat.freshCombat(s, E);
  s.alchemy.venoms.coated = { id: 'viper_fang', charges: 2 };

  // First strike with weapon coats enemy and applies stack
  Combat.act(s, 'thrust', E);
  assert.equal(s.alchemy.venoms.coated.charges, 1);
  assert.equal(s.combat.enemyPoisonStacks, 1);
  assert.equal(s.combat.enemyPoisonType, 'viper_fang');
  const hasPoisonLog = s.combat.log.some(l => l.ru.includes('ЯД: Клинок заражает противника'));
  assert.equal(hasPoisonLog, true);

  // Second strike expends last charge
  Combat.act(s, 'thrust', E);
  assert.equal(s.alchemy.venoms.coated.charges, 0);
  assert.equal(s.alchemy.venoms.coated.id, null);
  assert.equal(s.combat.enemyPoisonStacks, 2);

  // Poison DoT finish enemy test
  s.combat.enemyHp = 5;
  Combat.act(s, 'parry', E);
  assert.equal(s.combat.finished, true);
  assert.equal(s.combat.victory, true);
});

test('Combat engine: Jasmine sanctuary perks in combat (Burning Heart and Astral Barrier)', () => {
  const s = E.fresh();
  s.alchemy.jasmine.level = 5;
  s.combat = Combat.freshCombat(s, E);

  const origRandom = Math.random;
  try {
    // 1. Test Star God's Broken Shadow (force random < 0.40)
    Math.random = () => 0.1;
    s.combat.enemyIntent = 'thrust';
    Combat.act(s, 'parry', E);
    const hasShadowLog = s.combat.log.some(l => l.ru.includes('Тень Звездного Бога'));
    assert.equal(hasShadowLog, true);

    // 2. Astral Barrier fatal blow negation (force random >= 0.40 so enemy strike connects)
    Math.random = () => 0.9;
    s.combat.playerHp = 1;
    assert.equal(s.combat.starBarrierUsed, false);

    // Opponent deals fatal damage
    s.combat.enemyIntent = 'heavy';
    Combat.act(s, 'parry', E);

    // Life preserved via Astral Barrier!
    assert.equal(s.combat.starBarrierUsed, true);
    assert.equal(s.combat.finished, false);
    assert(s.combat.playerHp >= Math.floor(s.combat.playerMaxHp * 0.35));
    const hasBarrierLog = s.combat.log.some(l => l.ru.includes('Звездный Барьер Жасмин'));
    assert.equal(hasBarrierLog, true);
  } finally {
    Math.random = origRandom;
  }
});


