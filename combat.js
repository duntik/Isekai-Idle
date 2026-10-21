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
    const isImmaculate = (s.alchemy?.meridians?.pearlPurges > 0) && ((s.alchemy?.meridians?.danDu || 0) === 0);
    const pMaxPoise = Math.max(30, Math.floor(40 + s.body * 8 + s.weapon * 4 + (isImmaculate ? 10 : 0)));
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
      momentum: 0,
      evilGodAwakened: false,
      bossPhaseTriggered: false,
      guardBuff: 0,
      evasion: false,
      enemyPoisonStacks: 0,
      enemyPoisonType: null,
      starBarrierUsed: false,
      burningHeartAwakened: false,
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
      momentum: Math.min(3, Math.max(0, Math.floor(input.momentum || 0))),
      evilGodAwakened: !!input.evilGodAwakened,
      bossPhaseTriggered: !!input.bossPhaseTriggered,
      guardBuff: Math.max(0, Number(input.guardBuff) || 0),
      evasion: !!input.evasion,
      enemyPoisonStacks: Math.max(0, Math.floor(input.enemyPoisonStacks || 0)),
      enemyPoisonType: (input.enemyPoisonType && typeof input.enemyPoisonType === 'string') ? input.enemyPoisonType.slice(0, 40) : null,
      starBarrierUsed: !!input.starBarrierUsed,
      burningHeartAwakened: !!input.burningHeartAwakened,
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
    const counterMatches = (({ swift: 'swift', armored: 'piercing', mystic: 'ward' })[c.foeType] === s.style);
    const styleMult = counterMatches ? 1.35 : 1.0;
    const evilGodMult = (c.evilGodAwakened ? 1.35 : 1.0) * (c.evilGodPillSurge ? 1.40 : 1.0);
    const momentumMult = 1.0 + (c.momentum || 0) * 0.1;
    const jasmineLevel = s.alchemy?.jasmine?.level || 0;
    const burningHeartMult = (jasmineLevel >= 4 && c.playerHp <= Math.floor(c.playerMaxHp * 0.5)) ? 1.30 : 1.0;

    let pDamage = 0;
    let pPoiseDmg = 0;
    let pLogRu = '';
    let pLogEn = '';
    let interrupt = false;
    let critBurst = false;

    // Trigger full momentum critical burst if 3 stacks accumulated
    if ((actionKey === 'thrust' || actionKey === 'heavy') && (c.momentum || 0) >= 3) {
      critBurst = true;
      c.momentum = 0;
    }

    // 1. Process player action
    if (actionKey === 'thrust') {
      const stamCost = 15;
      const exhausted = c.playerStamina < stamCost;
      if (exhausted) {
        c.playerStamina = Math.min(c.playerMaxStamina, c.playerStamina + 10);
      } else {
        c.playerStamina -= stamCost;
      }
      let baseDmg = Math.max(8, Math.floor((8 + (s.mastery || 0) * 2 + (s.weapon || 0) * 3) * (1.45 ** (s.realm || 0)) * styleMult * evilGodMult * momentumMult * burningHeartMult));
      if (exhausted) baseDmg = Math.max(4, Math.floor(baseDmg * 0.45));

      if (critBurst) {
        pDamage = Math.floor(baseDmg * 1.85);
        pPoiseDmg = Math.floor(baseDmg * 1.3);
        pLogRu = `【БОЕВОЙ КУРАЖ: РЕШАЮЩИЙ ВЫПАД!】 Поймав ритм поединка, ты обрушиваешь взрывной критический выпад в уязвимое сочленение! Нанесено ${pDamage} урона (сбито ${pPoiseDmg} стойкости)!`;
        pLogEn = `【FULL MOMENTUM: CRITICAL THRUST!】 Seizing the duel’s flawless tempo, you unleash an explosive critical thrust into a vital seam! Dealt ${pDamage} damage (${pPoiseDmg} poise shattered)!`;
      } else if (c.enemyIntent === 'qi') {
        interrupt = true;
        pDamage = Math.floor(baseDmg * 1.5);
        pPoiseDmg = Math.floor(baseDmg * 0.8);
        c.momentum = Math.min(3, (c.momentum || 0) + 1);
        pLogRu = `Быстрый выпад в уязвимое сочленение! Ты срываешь концентрацию ци соперника: вспышка backfire наносит ${pDamage} урона (импульс +1)!`;
        pLogEn = `Swift thrust to a vital joint! You rupture foe’s qi concentration: violent backfire inflicts ${pDamage} damage (momentum +1)!`;
      } else {
        pDamage = baseDmg;
        pPoiseDmg = Math.floor(baseDmg * 0.6);
        pLogRu = `Молниеносный выпад пронзает защиту: нанесено ${pDamage} урона (сбито ${pPoiseDmg} стойкости).`;
        pLogEn = `Lightning thrust pierces the guard: dealt ${pDamage} damage (${pPoiseDmg} poise shattered).`;
      }

      if (s.alchemy?.venoms?.coated?.charges > 0 && s.alchemy.venoms.coated.id) {
        s.alchemy.venoms.coated.charges--;
        c.enemyPoisonType = s.alchemy.venoms.coated.id;
        c.enemyPoisonStacks = Math.min(5, (c.enemyPoisonStacks || 0) + 1);
        const vId = c.enemyPoisonType;
        if (s.alchemy.venoms.coated.charges <= 0) {
          s.alchemy.venoms.coated = { id: null, charges: 0 };
        }
        const Alc = typeof module !== 'undefined' && module.exports ? require('./alchemy.js') : globalThis.IsekaiAlchemy;
        const vDef = Alc?.VENOMS?.[vId];
        const vNameRu = vDef ? vDef.nameRu : vId;
        const vNameEn = vDef ? vDef.nameEn : vId;
        pLogRu += ` 【ЯД: Клинок заражает противника «${vNameRu}» (${c.enemyPoisonStacks} стак)!】`;
        pLogEn += ` 【VENOM: Blade infects foe with “${vNameEn}” (${c.enemyPoisonStacks} stack)!】`;
      }
    } else if (actionKey === 'heavy') {
      const stamCost = 28;
      const exhausted = c.playerStamina < stamCost;
      if (exhausted) {
        c.playerStamina = Math.min(c.playerMaxStamina, c.playerStamina + 10);
      } else {
        c.playerStamina -= stamCost;
      }
      let baseDmg = Math.max(12, Math.floor((14 + (s.body || 0) * 3 + (s.weapon || 0) * 4) * (1.45 ** (s.realm || 0)) * styleMult * evilGodMult * momentumMult * burningHeartMult));
      if (exhausted) baseDmg = Math.max(5, Math.floor(baseDmg * 0.4));

      if (critBurst) {
        pDamage = Math.floor(baseDmg * 1.9);
        pPoiseDmg = Math.floor(baseDmg * 2.8);
        pLogRu = `【БОЕВОЙ КУРАЖ: СОКРУШЕНИЕ НЕБЕС!】 Накопленный импульс взрывается чудовищным ударом! Оружие проламывает стойку на ${pDamage} урона (${pPoiseDmg} пробоя стойки)!`;
        pLogEn = `【FULL MOMENTUM: HEAVEN SHATTER!】 Surging momentum erupts into a monstrous crushing blow! Your weapon pulverizes foe’s stance for ${pDamage} damage (${pPoiseDmg} poise damage)!`;
      } else if (c.enemyIntent === 'defend') {
        pDamage = baseDmg;
        pPoiseDmg = Math.floor(baseDmg * 2.5);
        c.momentum = Math.min(3, (c.momentum || 0) + 1);
        pLogRu = `Сокрушающий силовой удар всем весом тела! Каменный треск — щит врага расколот (${pDamage} урона, ${pPoiseDmg} пробоя стойки, импульс +1)!`;
        pLogEn = `Crushing heavy strike with full body momentum! Stone shatter — foe’s guard is cracked (${pDamage} damage, ${pPoiseDmg} poise damage, momentum +1)!`;
      } else {
        pDamage = baseDmg;
        pPoiseDmg = Math.floor(baseDmg * 1.8);
        pLogRu = `Тяжёлый сокрушающий раскол сотрясает кости врага: нанесён тяжелейший удар на ${pDamage} урона!`;
        pLogEn = `Heavy crushing blow rattles the opponent’s bones: a devastating strike dealt ${pDamage} damage!`;
      }

      if (s.alchemy?.venoms?.coated?.charges > 0 && s.alchemy.venoms.coated.id) {
        s.alchemy.venoms.coated.charges--;
        c.enemyPoisonType = s.alchemy.venoms.coated.id;
        c.enemyPoisonStacks = Math.min(5, (c.enemyPoisonStacks || 0) + 1);
        const vId = c.enemyPoisonType;
        if (s.alchemy.venoms.coated.charges <= 0) {
          s.alchemy.venoms.coated = { id: null, charges: 0 };
        }
        const Alc = typeof module !== 'undefined' && module.exports ? require('./alchemy.js') : globalThis.IsekaiAlchemy;
        const vDef = Alc?.VENOMS?.[vId];
        const vNameRu = vDef ? vDef.nameRu : vId;
        const vNameEn = vDef ? vDef.nameEn : vId;
        pLogRu += ` 【ЯД: Клинок заражает противника «${vNameRu}» (${c.enemyPoisonStacks} стак)!】`;
        pLogEn += ` 【VENOM: Blade infects foe with “${vNameEn}” (${c.enemyPoisonStacks} stack)!】`;
      }
    } else if (actionKey === 'parry') {
      c.playerStamina = Math.min(c.playerMaxStamina, c.playerStamina + 28);
      c.playerPoise = Math.min(c.playerMaxPoise, c.playerPoise + 25);
      pDamage = Math.max(4, Math.floor((s.body * 1.5 + 5) * evilGodMult));
      pPoiseDmg = 10;
      if (c.enemyIntent === 'swift') {
        pDamage = Math.floor(pDamage * 2.5);
        c.momentum = Math.min(3, (c.momentum || 0) + 1);
        pLogRu = `Идеальное парирование! Вражеский выпад со свистом соскальзывает по гарде. Встречный контрудар локтем наносит ${pDamage} урона (импульс +1)!`;
        pLogEn = `Perfect parry! The enemy flurry glances off your guard. Your counter elbow strike strikes back for ${pDamage} damage (momentum +1)!`;
      } else {
        pLogRu = `Защитная стойка принята: дыхание выровнено (+28 выносливости), входящий урон будет значительно снижен.`;
        pLogEn = `Defensive posture adopted: breath stabilized (+28 stamina), incoming damage heavily mitigated.`;
      }
    } else if (actionKey === 'technique') {
      const qiCost = Math.min(s.resources.qi, 15);
      s.resources.qi = Math.max(0, s.resources.qi - qiCost);
      c.playerStamina = Math.max(0, c.playerStamina - 12);
      const techBase = Math.max(16, Math.floor((E.battlePower(s) * 0.95 + qiCost * 2.2) * evilGodMult));
      const activeTech = s.cultivation?.active;
      const techName = E.techniques[activeTech]?.name || 'Сутра Злого Неба';

      if (activeTech === 'sky') {
        // Evil God Sutra: Pure flame pierces armor directly to HP and burns enemy stamina
        pDamage = Math.floor(techBase * 1.35);
        pPoiseDmg = Math.floor(techBase * 0.4);
        c.enemyStamina = Math.max(0, (c.enemyStamina || 100) - 25);
        pLogRu = `Боевая техника «${techName}»! Багровые волны яростной ци Злого Бога обходят броню противника, испепеляя жизненные силы (${pDamage} чистого урона) и выжигая дыхание врага!`;
        pLogEn = `Martial technique “${techName}”! Crimson shockwaves of Evil God profound qi bypass foe’s guard, incinerating vitality (${pDamage} pure damage) and scorching their breath!`;
      } else if (activeTech === 'stance') {
        // Stone Roots: Seismic stance damage and half damage reduction next turn
        pDamage = techBase;
        pPoiseDmg = Math.floor(techBase * 1.8);
        c.playerPoise = Math.min(c.playerMaxPoise, c.playerPoise + 35);
        c.guardBuff = 0.5;
        pLogRu = `Боевая техника «${techName}»! Стопы врастают в базальт, порождая сейсмический раскол стойки (${pDamage} урона, ${pPoiseDmg} пробоя стойки)! Каменный покров поглотит 50% следующего урона!`;
        pLogEn = `Martial technique “${techName}”! Your stance roots into basalt, triggering a seismic stance shockwave (${pDamage} damage, ${pPoiseDmg} poise damage)! Stone mantle will absorb 50% of next damage!`;
      } else if (activeTech === 'cloud') {
        // Cloud Reach: Evasive feint guarantees dodging next attack and gains momentum
        pDamage = Math.floor(techBase * 1.25);
        pPoiseDmg = techBase;
        c.evasion = true;
        c.momentum = Math.min(3, (c.momentum || 0) + 1);
        pLogRu = `Боевая техника «${techName}»! Силуэт растворяется в лазурном тумане: рассекающий выпад поражает врага (${pDamage} урона), а ответный удар противника рассечёт лишь воздух!`;
        pLogEn = `Martial technique “${techName}”! Your silhouette dissolves into azure mist: a slicing flash strikes the foe (${pDamage} damage), while their retaliation will strike only empty air!`;
      } else if (activeTech === 'grove') {
        // Jade Circle: Life drain siphons HP and stamina
        pDamage = techBase;
        pPoiseDmg = techBase;
        const heal = Math.floor(pDamage * 0.35);
        c.playerHp = Math.min(c.playerMaxHp, c.playerHp + heal);
        c.playerStamina = Math.min(c.playerMaxStamina, c.playerStamina + 20);
        pLogRu = `Боевая техника «${techName}»! Изумрудное кольцо ци опутывает врага (${pDamage} урона), а очищенная жизненная роса восстанавливает +${heal} HP и +20 выносливости!`;
        pLogEn = `Martial technique “${techName}”! Emerald qi binds the foe (${pDamage} damage), siphoning vital dew back to restore +${heal} HP and +20 stamina!`;
      } else if (activeTech === 'sword') {
        // Mountain Pass Sword: Severe counter attack against heavy/swift
        let swordMult = 1.35;
        if (c.enemyIntent === 'heavy' || c.enemyIntent === 'swift') swordMult = 1.7;
        pDamage = Math.floor(techBase * swordMult);
        pPoiseDmg = Math.floor(techBase * 1.2);
        c.momentum = Math.min(3, (c.momentum || 0) + 1);
        pLogRu = `Боевая техника «${techName}»! Холодная сталь перехватывает остриё вражеского выпада: сокрушительный встречный удар рассекает плоть на ${pDamage} урона!`;
        pLogEn = `Martial technique “${techName}”! Cold steel intercepts the foe’s trajectory: a lethal counter riposte cuts deep for ${pDamage} damage!`;
      } else if (activeTech === 'seal') {
        // Void Seal: Rune locks enemy intent
        pDamage = techBase;
        pPoiseDmg = Math.floor(techBase * 1.5);
        interrupt = true;
        pLogRu = `Боевая техника «${techName}»! Мерцающие знаки древней печати сковывают меридианы врага (${pDamage} урона): замысел противника развеян, а ци запечатана!`;
        pLogEn = `Martial technique “${techName}”! Shimmering void runes bind the foe’s meridians (${pDamage} damage): enemy intent is nullified and qi sealed!`;
      } else {
        pDamage = techBase;
        pPoiseDmg = Math.floor(techBase * 1.2);
        pLogRu = `Боевая техника «${techName}» активирована! Багровые волны истинной ци прожигают барьер соперника на ${pDamage} урона!`;
        pLogEn = `Martial technique “${techName}” unleashed! Crimson shockwaves of profound qi scorch through foe’s barrier for ${pDamage} damage!`;
      }
    } else if (actionKey === 'pearl') {
      if (c.pearlUsed) return false;
      c.pearlUsed = true;
      const pearlDmg = Math.max(20, Math.floor(c.enemyHp * 0.35 + 15));
      pDamage = pearlDmg;
      pPoiseDmg = c.enemyPoise; // Shatters all poise!
      c.momentum = Math.min(3, (c.momentum || 0) + 2);
      c.playerHp = Math.min(c.playerMaxHp, c.playerHp + Math.floor(c.playerMaxHp * 0.25));
      c.playerStamina = c.playerMaxStamina;
      pLogRu = `【Вспышка Небесной Жемчужины Яда】 Багрово-изумрудный свет из левой ладони ослепляет врага! Яд растворяет ${pDamage} стойкости, сокрушая баланс противника (импульс +2)!`;
      pLogEn = `【Sky Poison Pearl Burst】 Emerald-crimson radiance erupts from your left palm! Divine toxic miasma melts away ${pDamage} vitality, completely shattering foe’s poise (momentum +2)!`;
    } else if (actionKey === 'pill' || actionKey.startsWith('pill:')) {
      const hasGenericPills = (s.resources.pills || 0) >= 1;
      let requestedRecipe = actionKey.startsWith('pill:') ? actionKey.slice(5) : null;
      if (!requestedRecipe && s.alchemy?.pouch?.[0] && (s.alchemy.inventory?.[s.alchemy.pouch[0]] > 0)) {
        requestedRecipe = s.alchemy.pouch[0];
      }
      const hasSpecificPill = requestedRecipe ? ((s.alchemy?.inventory?.[requestedRecipe] || 0) >= 1) : false;
      if (!hasGenericPills && !hasSpecificPill) return false;

      // Consume from inventory & sync with generic pills
      let isPure = false;
      if (requestedRecipe && s.alchemy?.inventory?.[requestedRecipe] > 0) {
        s.alchemy.inventory[requestedRecipe]--;
        if (s.alchemy.pureInventory?.[requestedRecipe] > 0) {
          s.alchemy.pureInventory[requestedRecipe]--;
          isPure = true;
        }
      }
      s.resources.pills = Math.max(0, (s.resources.pills || 1) - 1);

      if (!isPure) {
        const Alc = typeof module !== 'undefined' && module.exports ? require('./alchemy.js') : globalThis.IsekaiAlchemy;
        if (Alc && Alc.addDanDu) {
          Alc.addDanDu(s, 5);
        } else if (s.alchemy) {
          if (!s.alchemy.meridians) s.alchemy.meridians = { danDu: 0, purity: 100, totalCleansed: 0, pearlPurges: 0 };
          s.alchemy.meridians.danDu = Math.min(100, (s.alchemy.meridians.danDu || 0) + 5);
          s.alchemy.meridians.purity = Math.max(0, 100 - s.alchemy.meridians.danDu);
        }
      }

      const danDuSuffixRu = isPure ? ' (100% чистота Жемчужины: 0 Дань Ду)' : ' (Осадок смертного котла: +5 Дань Ду)';
      const danDuSuffixEn = isPure ? ' (100% Pearl purity: 0 Dan Du)' : ' (Mortal cauldron residue: +5 Dan Du)';

      if (requestedRecipe === 'vigor_broth') {
        const heal = Math.floor(c.playerMaxHp * (isPure ? 0.60 : 0.50));
        c.playerHp = Math.min(c.playerMaxHp, c.playerHp + heal);
        c.playerStamina = c.playerMaxStamina;
        pLogRu = `【Отвар бодрости и сытости】 Свежий эликсир Мэй мгновенно восстанавливает +${heal} HP и наполняет выносливость на 100%!${danDuSuffixRu}`;
        pLogEn = `【Vigor and Satiety Broth】 Mei’s nourishing broth instantly restores +${heal} HP and refills stamina to 100%!${danDuSuffixEn}`;
      } else if (requestedRecipe === 'body_pill') {
        const heal = Math.floor(c.playerMaxHp * 0.25);
        c.playerHp = Math.min(c.playerMaxHp, c.playerHp + heal);
        c.playerPoise = c.playerMaxPoise;
        c.guardBuff = 0.40;
        pLogRu = `【Пилюля закалки костей】 Кости Жэня твердеют, как гранит: +${heal} HP, стойка восстановлена (100%), защита усилена (-40% входящего урона)!${danDuSuffixRu}`;
        pLogEn = `【Bone-Tempering Pill】 Ren’s tempered bone formula: +${heal} HP, poise fully restored (100%), defense fortified (-40% damage taken)!${danDuSuffixEn}`;
      } else if (requestedRecipe === 'evil_god_pill') {
        c.momentum = 3;
        s.resources.qi = (s.resources.qi || 0) + 20;
        c.evilGodPillSurge = true;
        pLogRu = `【Пилюля Первородного Пламени】 Багровое пламя Сутры Злого Бога охватывает клинки: боевой кураж МАКСИМАЛЕН (импульс 3), Ци +20, сила ударов +40%!${danDuSuffixRu}`;
        pLogEn = `【Primordial Flame Pill】 Crimson fire of the Evil God Sutra ignites your weapon: MAX momentum (3), Qi +20, damage +40%!${danDuSuffixEn}`;
      } else if (requestedRecipe === 'calm_tea') {
        s.resources.qi = (s.resources.qi || 0) + 25;
        c.playerPoise = Math.min(c.playerMaxPoise, c.playerPoise + Math.floor(c.playerMaxPoise * 0.5));
        c.playerStamina = Math.min(c.playerMaxStamina, c.playerStamina + 40);
        pLogRu = `【Настой ясного сердца】 Лазурная прохлада Линя очищает каналы: истинная Ци +25, стойка стабилизирована (+50%), выносливость +40!${danDuSuffixRu}`;
        pLogEn = `【Clear Heart Infusion】 Lin’s azure tranquility purges turmoil: profound Qi +25, poise stabilized (+50%), stamina +40!${danDuSuffixEn}`;
      } else if (requestedRecipe === 'breakthrough_pill') {
        pDamage = Math.max(30, Math.floor(c.foePower * 0.4));
        pPoiseDmg = Math.floor(c.enemyMaxPoise * 0.6);
        c.playerHp = Math.min(c.playerMaxHp, c.playerHp + Math.floor(c.playerMaxHp * 0.3));
        pLogRu = `【Пилюля сокрушения преград】 Эссенция мастера Хо взрывается духовной волной: нанесено ${pDamage} урона барьеру врага (${pPoiseDmg} пробоя стойки), здоровье +30%!${danDuSuffixRu}`;
        pLogEn = `【Barrier-Shattering Pill】 Master Huo’s essence erupts into a profound shockwave: dealt ${pDamage} damage (${pPoiseDmg} poise damage), health +30%!${danDuSuffixEn}`;
      } else if (requestedRecipe === 'beast_temper_pill') {
        c.playerPoise = c.playerMaxPoise;
        c.momentum = Math.min(3, (c.momentum || 0) + 1);
        c.playerStamina = c.playerMaxStamina;
        const heal = Math.floor(c.playerMaxHp * 0.20);
        c.playerHp = Math.min(c.playerMaxHp, c.playerHp + heal);
        pLogRu = `【Пилюля Звериной Мощи】 Сила духовного зверя наполняет сухожилия: стойка полностью восстановлена (100%), здоровье +${heal}, выносливость полная, импульс +1!${danDuSuffixRu}`;
        pLogEn = `【Beast Tempering Pill】 Primal beast vigor surges through sinews: poise fully restored (100%), health +${heal}, stamina full, momentum +1!${danDuSuffixEn}`;
      } else {
        const heal = Math.floor(c.playerMaxHp * 0.45);
        c.playerHp = Math.min(c.playerMaxHp, c.playerHp + heal);
        c.playerStamina = c.playerMaxStamina;
        pLogRu = `Глоток алхимической пилюли! Эликсир мгновенно восстанавливает +${heal} HP и наполняет мышцы неутомимой силой!${danDuSuffixRu}`;
        pLogEn = `Swallowing an alchemical pill! The elixir instantly restores +${heal} HP and surges through your veins with fresh vigour!${danDuSuffixEn}`;
      }
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
      c.momentum = Math.min(3, (c.momentum || 0) + 1);
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
      if (s.alchemy?.buffs?.evilGodFights > 0) s.alchemy.buffs.evilGodFights--;
      E.taskPractice(s, 'combat');
      E.log(s, `Победа: ${c.foeName}. Твои успехи привлекли внимание более сильных противников.`);
      c.log.unshift({
        round: c.round,
        ru: `⚔ ПОБЕДА! Решающий удар сокрушает соперника: ${c.foeName} падает на колени, признавая твоё превосходство! Получено: ${goldReward} монет, ${herbReward} трав, 1 осколок.`,
        en: `⚔ VICTORY! Your decisive strike overwhelms the opponent: ${c.foeName} falls to their knees in defeat! Spoils: ${goldReward} coins, ${herbReward} herbs, 1 shard.`
      });
      return true;
    }

    // 2. Process enemy attack (if not stunned, interrupted, or evaded)
    if (c.enemyStunned) {
      c.enemyStunned = false; // Recovers from stun next round
    } else if (interrupt) {
      // Interrupted: enemy fails to attack
    } else if (c.evasion || (jasmineLevel >= 2 && Math.random() < 0.40)) {
      const isStarGod = !c.evasion;
      c.evasion = false;
      const eLogRu = isStarGod
        ? `✨ 【Тень Звездного Бога】 Твой шаг искажает пространство звёздным силуэтом! Атака ${c.foeName} рассекает лишь остаточную иллюзию!`
        : `${c.foeName} атакует со свирепой силой, но твой шаг уклонения безупречен — клинок рассекает лишь остаточный силуэт в воздухе!`;
      const eLogEn = isStarGod
        ? `✨ 【Star God's Broken Shadow】 Your footwork warps space with an astral afterimage! ${c.foeName}’s strike cleaves only residual starlight!`
        : `${c.foeName} strikes with fierce fury, but your evasive footwork is flawless — the blade cuts only an afterimage in the air!`;
      c.log.unshift({ round: c.round, ru: eLogRu, en: eLogEn });
    } else {
      let eDmg = Math.max(6, Math.floor(c.foePower * 0.35 + (c.round * 1.5)));
      if (actionKey === 'parry') {
        eDmg = Math.max(2, Math.floor(eDmg * 0.3));
      }
      if (c.enemyIntent === 'heavy') eDmg = Math.floor(eDmg * 1.4);
      if (c.enemyIntent === 'qi') eDmg = Math.floor(eDmg * 1.6);
      if (c.guardBuff) {
        eDmg = Math.max(1, Math.floor(eDmg * (1 - c.guardBuff)));
        c.guardBuff = 0;
      }

      c.playerHp = Math.max(0, c.playerHp - eDmg);
      const eLogRu = `${c.foeName} отвечает свирепой атакой (${intents[c.enemyIntent].ru}): получено ${eDmg} урона.`;
      const eLogEn = `${c.foeName} responds with a fierce attack (${intents[c.enemyIntent].en}): took ${eDmg} damage.`;
      c.log.unshift({ round: c.round, ru: eLogRu, en: eLogEn });

      // Check Player Defeat / Tactical Retreat
      if (c.playerHp <= 0) {
        if (jasmineLevel >= 5 && !c.starBarrierUsed) {
          c.starBarrierUsed = true;
          c.playerHp = Math.max(20, Math.floor(c.playerMaxHp * 0.35));
          c.playerPoise = Math.floor(c.playerMaxPoise * 0.5);
          c.log.unshift({
            round: c.round,
            ru: `🌟 【Звездный Барьер Жасмин】 Смертельный удар раскалывается о багровый звёздный щит принцессы Звездного Бога! Жасмин спасает твою жизнь (HP восстановлено до 35%)!`,
            en: `🌟 【Jasmine’s Astral Barrier】 Fatal blow shatters against the Star God Princess’s astral barrier! Jasmine saves your life (HP restored to 35%)!`
          });
        } else {
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
    }

    // 3. Evil God Gate Awakening check (when player is battered below 35% HP)
    if (!c.evilGodAwakened && c.playerHp > 0 && c.playerHp <= Math.floor(c.playerMaxHp * 0.35)) {
      c.evilGodAwakened = true;
      c.playerStamina = Math.min(c.playerMaxStamina, c.playerStamina + 25);
      c.playerPoise = Math.min(c.playerMaxPoise, c.playerPoise + 20);
      c.log.unshift({
        round: c.round,
        ru: '【ПРОБУЖДЕНИЕ ВРАТ ЗЛОГО БОГА!】 В глубине меридианов с грохотом распахиваются Врата Злой Души! Багровое пламя вырывается наружу, искажая пространство: урон возрастает на +35%, а раны запечатываются яростной ци!',
        en: '【EVIL GOD GATES UNSEALED!】 The Gate of Evil Soul violently erupts within your meridians! Raging crimson flames warp space: damage surges by +35%, sealing wounds with furious qi!'
      });
    }

    // 4. Boss Enrage / Phase Transition check (at <= 50% HP)
    let nextIntent = randomIntent(c.foeType);
    if (!c.bossPhaseTriggered && c.enemyHp > 0 && c.enemyHp <= Math.floor(c.enemyMaxHp * 0.5)) {
      c.bossPhaseTriggered = true;
      if (c.foeName.includes('Белого Клыка') || c.foeName.includes('разбойник') || c.foeName.includes('Bandit') || c.foeName.includes('Fang')) {
        nextIntent = 'heavy';
        c.log.unshift({
          round: c.round,
          ru: `【ЯРОСТЬ СОПЕРНИКА】 ${c.foeName} сплёвывает кровь и выхватывает зазубренный тесак: «Щенок, ты заставил меня драться всерьёз! Отведай Кровавый Коготь!» Враг готовит сокрушительный удар!`,
          en: `【FOE ENRAGED】 ${c.foeName} spits blood and unsheathes a serrated cleaver: “Whelp, you forced me to fight for real! Taste my Blood Claw!” The foe readies a devastating heavy blow!`
        });
      } else {
        nextIntent = 'qi';
        c.log.unshift({
          round: c.round,
          ru: `【ЯРОСТЬ СОПЕРНИКА】 ${c.foeName} с рычанием высвобождает скрытую ци: «Ты посмел ранить меня перед толпой?! Прими силу моего истинного искусства!» Пространство дрожит от всплеска энергии!`,
          en: `【FOE ENRAGED】 ${c.foeName} roars, unleashing latent qi: “You dare wound me before the crowd?! Taste the might of my true art!” The air trembles from an impending energy blast!`
        });
      }
    }

    // 5. Weapon Venom DoT resolution
    if (c.enemyHp > 0 && c.enemyPoisonStacks > 0 && c.enemyPoisonType) {
      const Alc = typeof module !== 'undefined' && module.exports ? require('./alchemy.js') : globalThis.IsekaiAlchemy;
      const vDef = Alc?.VENOMS?.[c.enemyPoisonType];
      const dotDmg = (vDef?.dotDmg || 6) * c.enemyPoisonStacks;
      const poiseDmg = (vDef?.poiseDmg || 0) * c.enemyPoisonStacks;
      c.enemyHp = Math.max(0, c.enemyHp - dotDmg);
      if (poiseDmg > 0) c.enemyPoise = Math.max(0, c.enemyPoise - poiseDmg);
      const vNameRu = vDef ? vDef.nameRu : c.enemyPoisonType;
      const vNameEn = vDef ? vDef.nameEn : c.enemyPoisonType;
      c.log.unshift({
        round: c.round,
        ru: `☠ Токсин «${vNameRu}» разъедает тело врага: -${dotDmg} HP${poiseDmg > 0 ? `, -${poiseDmg} стойкости` : ''}!`,
        en: `☠ Toxin “${vNameEn}” corrodes foe: -${dotDmg} HP${poiseDmg > 0 ? `, -${poiseDmg} poise` : ''}!`
      });
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
        if (s.alchemy?.buffs?.evilGodFights > 0) s.alchemy.buffs.evilGodFights--;
        E.taskPractice(s, 'combat');
        E.log(s, `Победа: ${c.foeName}. Твои успехи привлекли внимание более сильных противников.`);
        c.log.unshift({
          round: c.round,
          ru: `⚔ ПОБЕДА! Смертоносный яд окончательно сломил жизненные силы соперника: ${c.foeName} повержен! Получено: ${goldReward} монет, ${herbReward} трав, 1 осколок.`,
          en: `⚔ VICTORY! Lethal venom fully drains the opponent’s vitality: ${c.foeName} is vanquished! Spoils: ${goldReward} coins, ${herbReward} herbs, 1 shard.`
        });
        return true;
      }
    }

    // Prep next round
    c.round++;
    c.playerStamina = Math.min(c.playerMaxStamina, c.playerStamina + 14);
    c.enemyIntent = nextIntent;
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
