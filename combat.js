(function(root) {
  'use strict';

  const intents = {
    heavy: { id: 'heavy', ru: 'Сокрушительный замах', en: 'Crushing heavy strike', descRu: 'Враг заносит оружие для сокрушающего удара по стойке.', descEn: 'Foe raises their weapon for a crushing guard strike.' },
    swift: { id: 'swift', ru: 'Серия быстрых выпадов', en: 'Flurry of swift thrusts', descRu: 'Враг смещается по дуге, целясь в уязвимые суставы.', descEn: 'Foe circles around, aiming for vulnerable joints.' },
    defend: { id: 'defend', ru: 'Глухой покров защиты', en: 'Defensive profound shroud', descRu: 'Враг стягивает ци для укрепления брони и парирования.', descEn: 'Foe gathers qi to reinforce armor and parry.' },
    qi: { id: 'qi', ru: 'Концентрация духовного луча', en: 'Channeling a profound blast', descRu: 'Враг замирает, накапливая разрушительный всплеск энергии.', descEn: 'Foe halts, accumulating a devastating energy blast.' }
  };

  const intentKeys = ['heavy', 'swift', 'defend', 'qi'];

  function randomIntent(enemyType) {
    if (enemyType === 'swift') return Math.random() < 0.5 ? 'swift' : (Math.random() < 0.5 ? 'heavy' : 'defend');
    if (enemyType === 'armored') return Math.random() < 0.5 ? 'heavy' : (Math.random() < 0.5 ? 'defend' : 'qi');
    return Math.random() < 0.5 ? 'qi' : (Math.random() < 0.5 ? 'swift' : 'heavy');
  }

  function freshCombat(s, E) {
    const foe = E.enemy(s);
    const pMaxHp = Math.max(50, Math.floor(100 + s.body * 16 + (s.realm + 1) * 24 + s.weapon * 12));
    const pMaxPoise = Math.max(30, Math.floor(40 + s.body * 8 + s.weapon * 4));
    const eMaxHp = Math.max(60, Math.floor(foe.power * 2.4 + 70));
    const eMaxPoise = Math.max(25, Math.floor(foe.power * 0.75 + 35));

    return {
      round: 1,
      foeName: foe.name,
      foeType: foe.type,
      foePower: foe.power,
      playerHp: pMaxHp,
      playerMaxHp: pMaxHp,
      playerPoise: pMaxPoise,
      playerMaxPoise: pMaxPoise,
      playerStamina: 100,
      playerMaxStamina: 100,
      enemyHp: eMaxHp,
      enemyMaxHp: eMaxHp,
      enemyPoise: eMaxPoise,
      enemyMaxPoise: eMaxPoise,
      enemyStamina: 100,
      enemyIntent: randomIntent(foe.type),
      enemyStunned: false,
      pearlUsed: false,
      log: [
        {
          round: 1,
          ru: `На арену выходит ${foe.name} (сила ${foe.power}). Меридианы противника напряжены, воздух дрожит от боевой ауры!`,
          en: `${foe.name} (power ${foe.power}) steps onto the arena. Your opponent’s meridians surge, and the air quivers with combat aura!`
        }
      ],
      finished: false,
      victory: false
    };
  }

  function validate(input) {
    if (!input || typeof input !== 'object') return null;
    if (typeof input.foeName !== 'string' || !Number.isFinite(input.playerHp) || !Number.isFinite(input.enemyHp)) return null;
    return {
      round: Math.max(1, Math.floor(input.round || 1)),
      foeName: String(input.foeName).slice(0, 80),
      foeType: ['swift', 'armored', 'mystic'].includes(input.foeType) ? input.foeType : 'swift',
      foePower: Math.max(1, Math.floor(input.foePower || 18)),
      playerHp: Math.max(0, Math.floor(input.playerHp)),
      playerMaxHp: Math.max(1, Math.floor(input.playerMaxHp || 100)),
      playerPoise: Math.max(0, Math.floor(input.playerPoise || 0)),
      playerMaxPoise: Math.max(1, Math.floor(input.playerMaxPoise || 40)),
      playerStamina: Math.max(0, Math.floor(input.playerStamina || 0)),
      playerMaxStamina: Math.max(1, Math.floor(input.playerMaxStamina || 100)),
      enemyHp: Math.max(0, Math.floor(input.enemyHp)),
      enemyMaxHp: Math.max(1, Math.floor(input.enemyMaxHp || 100)),
      enemyPoise: Math.max(0, Math.floor(input.enemyPoise || 0)),
      enemyMaxPoise: Math.max(1, Math.floor(input.enemyMaxPoise || 40)),
      enemyStamina: Math.max(0, Math.floor(input.enemyStamina || 100)),
      enemyIntent: intentKeys.includes(input.enemyIntent) ? input.enemyIntent : 'heavy',
      enemyStunned: !!input.enemyStunned,
      pearlUsed: !!input.pearlUsed,
      log: Array.isArray(input.log) ? input.log.slice(0, 15).map(e => ({
        round: Number(e.round) || 1,
        ru: String(e.ru || '').slice(0, 300),
        en: String(e.en || '').slice(0, 300)
      })) : [],
      finished: !!input.finished,
      victory: !!input.victory
    };
  }

  function act(s, actionKey, E) {
    if (!s.combat || s.combat.finished) return false;
    const c = s.combat;
    const lang = root.IsekaiLocale?.language || 'ru';
    const counterMatches = (({ swift: 'swift', armored: 'piercing', mystic: 'ward' })[c.foeType] === s.style);
    const styleMult = counterMatches ? 1.35 : 1.0;

    let pDamage = 0;
    let pPoiseDmg = 0;
    let pLogRu = '';
    let pLogEn = '';
    let interrupt = false;

    // 1. Process player action
    if (actionKey === 'thrust') {
      if (c.playerStamina < 15) {
        c.playerStamina = Math.min(c.playerMaxStamina, c.playerStamina + 15);
      } else {
        c.playerStamina -= 15;
      }
      const baseDmg = Math.max(8, Math.floor((8 + s.mastery * 2 + s.weapon * 3) * (1.45 ** s.realm) * styleMult));
      pDamage = baseDmg;
      pPoiseDmg = Math.floor(baseDmg * 0.6);
      if (c.enemyIntent === 'qi') {
        interrupt = true;
        pDamage = Math.floor(pDamage * 1.5);
        pLogRu = `Быстрый выпад в уязвимое сочленение! Ты срываешь концентрацию ци соперника: вспышка backfire наносит ${pDamage} урона!`;
        pLogEn = `Swift thrust to a vital joint! You rupture foe’s qi concentration: violent backfire inflicts ${pDamage} damage!`;
      } else {
        pLogRu = `Молниеносный выпад пронзает защиту: нанесено ${pDamage} урона (сбито ${pPoiseDmg} стойкости).`;
        pLogEn = `Lightning thrust pierces the guard: dealt ${pDamage} damage (${pPoiseDmg} poise shattered).`;
      }
    } else if (actionKey === 'heavy') {
      const stamCost = 28;
      if (c.playerStamina >= stamCost) {
        c.playerStamina -= stamCost;
      } else {
        c.playerStamina = Math.min(c.playerMaxStamina, c.playerStamina + 10);
      }
      const baseDmg = Math.max(12, Math.floor((14 + s.body * 3 + s.weapon * 4) * (1.45 ** s.realm) * styleMult));
      pDamage = baseDmg;
      pPoiseDmg = Math.floor(baseDmg * 1.8);
      if (c.enemyIntent === 'defend') {
        pPoiseDmg = Math.floor(pPoiseDmg * 1.6);
        pLogRu = `Сокрушающий силовой удар всем весом тела! Каменный треск — щит врага расколот (${pDamage} урона, ${pPoiseDmg} пробоя стойки)!`;
        pLogEn = `Crushing heavy strike with full body momentum! Stone shatter — foe’s guard is cracked (${pDamage} damage, ${pPoiseDmg} poise damage)!`;
      } else {
        pLogRu = `Тяжёлый сокрушающий раскол сотрясает кости врага: нанесён тяжелейший удар на ${pDamage} урона!`;
        pLogEn = `Heavy crushing blow rattles the opponent’s bones: a devastating strike dealt ${pDamage} damage!`;
      }
    } else if (actionKey === 'parry') {
      c.playerStamina = Math.min(c.playerMaxStamina, c.playerStamina + 28);
      c.playerPoise = Math.min(c.playerMaxPoise, c.playerPoise + 25);
      pDamage = Math.max(4, Math.floor(s.body * 1.5 + 5));
      pPoiseDmg = 10;
      if (c.enemyIntent === 'swift') {
        pDamage = Math.floor(pDamage * 2.5);
        pLogRu = `Идеальное парирование! Вражеский выпад со свистом соскальзывает по гарде. Встречный контрудар локтем наносит ${pDamage} урона!`;
        pLogEn = `Perfect parry! The enemy flurry glances off your guard. Your counter elbow strike strikes back for ${pDamage} damage!`;
      } else {
        pLogRu = `Защитная стойка принята: дыхание выровнено (+28 выносливости), входящий урон будет значительно снижен.`;
        pLogEn = `Defensive posture adopted: breath stabilized (+28 stamina), incoming damage heavily mitigated.`;
      }
    } else if (actionKey === 'technique') {
      const qiCost = Math.min(s.resources.qi, 15);
      s.resources.qi = Math.max(0, s.resources.qi - qiCost);
      c.playerStamina = Math.max(0, c.playerStamina - 12);
      const techDmg = Math.max(16, Math.floor(E.battlePower(s) * 0.9 + qiCost * 2));
      pDamage = techDmg;
      pPoiseDmg = Math.floor(techDmg * 1.2);
      const techName = E.techniques[s.cultivation?.active]?.name || 'Сутра Злого Неба';
      pLogRu = `Боевая техника «${techName}» активирована! Багровые волны истинной ци прожигают барьер соперника на ${pDamage} урона!`;
      pLogEn = `Martial technique “${techName}” unleashed! Crimson shockwaves of profound qi scorch through foe’s barrier for ${pDamage} damage!`;
    } else if (actionKey === 'pearl') {
      if (c.pearlUsed) return false;
      c.pearlUsed = true;
      const pearlDmg = Math.max(20, Math.floor(c.enemyHp * 0.35 + 15));
      pDamage = pearlDmg;
      pPoiseDmg = c.enemyPoise; // Shatters all poise!
      c.playerHp = Math.min(c.playerMaxHp, c.playerHp + Math.floor(c.playerMaxHp * 0.25));
      c.playerStamina = c.playerMaxStamina;
      pLogRu = `【Вспышка Небесной Жемчужины Яда】 Багрово-изумрудный свет из левой ладони ослепляет врага! Яд растворяет ${pDamage} стойкости, сокрушая баланс противника!`;
      pLogEn = `【Sky Poison Pearl Burst】 Emerald-crimson radiance erupts from your left palm! Divine toxic miasma melts away ${pDamage} vitality, completely shattering foe’s poise!`;
    } else if (actionKey === 'pill') {
      if (s.resources.pills < 1) return false;
      s.resources.pills--;
      const heal = Math.floor(c.playerMaxHp * 0.45);
      c.playerHp = Math.min(c.playerMaxHp, c.playerHp + heal);
      c.playerStamina = c.playerMaxStamina;
      pLogRu = `Глоток алхимической пилюли чистоты! Эликсир мгновенно восстанавливает +${heal} HP и наполняет мышцы неутомимой силой!`;
      pLogEn = `Swallowing a pure alchemical pill! The elixir instantly restores +${heal} HP and surges through your veins with fresh vigour!`;
    } else {
      return false;
    }

    // Apply player damage to enemy
    c.enemyHp = Math.max(0, c.enemyHp - pDamage);
    c.enemyPoise = Math.max(0, c.enemyPoise - pPoiseDmg);

    // Check enemy Guard Break
    if (c.enemyPoise <= 0 && !c.enemyStunned) {
      c.enemyStunned = true;
      c.enemyPoise = Math.floor(c.enemyMaxPoise * 0.5);
      pLogRu += ' 【СТОЙКА ПРОБИТА! Враг ошеломлён и пропускает ход!】';
      pLogEn += ' 【GUARD BROKEN! Foe is staggered and loses their turn!】';
    }

    c.log.unshift({ round: c.round, ru: pLogRu, en: pLogEn });

    // Check Victory
    if (c.enemyHp <= 0) {
      c.finished = true;
      c.victory = true;
      const goldReward = Math.floor(30 * 1.8 ** s.wins);
      const herbReward = (s.wins + 1) * 10;
      s.resources.gold += goldReward;
      s.resources.herbs += herbReward;
      s.resources.relics += 1;
      s.wins++;
      s.cooldown = 300;
      E.taskPractice(s, 'combat');
      E.log(s, `Победа: ${c.foeName}. Твои успехи привлекли внимание более сильных противников.`);
      c.log.unshift({
        round: c.round,
        ru: `⚔ ПОБЕДА! Решающий удар сокрушает соперника: ${c.foeName} падает на колени, признавая твоё превосходство! Получено: ${goldReward} монет, ${herbReward} трав, 1 осколок.`,
        en: `⚔ VICTORY! Your decisive strike overwhelms the opponent: ${c.foeName} falls to their knees in defeat! Spoils: ${goldReward} coins, ${herbReward} herbs, 1 shard.`
      });
      return true;
    }

    // 2. Process enemy attack (if not stunned or interrupted)
    if (c.enemyStunned) {
      c.enemyStunned = false; // Recovers from stun next round
    } else if (interrupt) {
      // Interrupted: enemy fails to attack
    } else {
      let eDmg = Math.max(6, Math.floor(c.foePower * 0.35 + (c.round * 1.5)));
      if (actionKey === 'parry') {
        eDmg = Math.max(2, Math.floor(eDmg * 0.3));
      }
      if (c.enemyIntent === 'heavy') eDmg = Math.floor(eDmg * 1.4);
      if (c.enemyIntent === 'qi') eDmg = Math.floor(eDmg * 1.6);

      c.playerHp = Math.max(0, c.playerHp - eDmg);
      const eLogRu = `${c.foeName} отвечает свирепой атакой (${intents[c.enemyIntent].ru}): получено ${eDmg} урона.`;
      const eLogEn = `${c.foeName} responds with a fierce attack (${intents[c.enemyIntent].en}): took ${eDmg} damage.`;
      c.log.unshift({ round: c.round, ru: eLogRu, en: eLogEn });

      // Check Player Defeat / Tactical Retreat
      if (c.playerHp <= 0) {
        c.finished = true;
        c.victory = false;
        s.cooldown = 60;
        c.log.unshift({
          round: c.round,
          ru: `Твои силы иссякли под натиском ${c.foeName}. Жемчужина вспыхивает, укрывая тебя защитным пологом для отхода. Закаляй тело и возвращайся сильнее!`,
          en: `Your endurance falters beneath ${c.foeName}’s onslaught. The Sky Poison Pearl shields your tactical retreat. Temper your vessel and return stronger!`
        });
        return true;
      }
    }

    // Prep next round
    c.round++;
    c.playerStamina = Math.min(c.playerMaxStamina, c.playerStamina + 14);
    c.enemyIntent = randomIntent(c.foeType);
    c.log = c.log.slice(0, 15);
    return true;
  }

  const api = {
    freshCombat,
    validate,
    act,
    intents
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.IsekaiCombat = api;
})(globalThis);
