(function(root) {
  'use strict';

  const INGREDIENTS = {
    mountain_herb: {
      id: 'mountain_herb',
      nameRu: 'Горный чабрец',
      nameEn: 'Mountain Thyme',
      descRu: 'Дикорастущий душистый чабрец со склонов долины.',
      descEn: 'Fragrant wild thyme gathered from valley slopes.',
      icon: '🌿',
      cost: 4
    },
    spring_water: {
      id: 'spring_water',
      nameRu: 'Вода Серебряного ключа',
      nameEn: 'Silver Spring Water',
      descRu: 'Кристально чистая вода из подземного горного родника.',
      descEn: 'Crystal clear water from an underground mountain spring.',
      icon: '💧',
      cost: 3
    },
    spirit_clover: {
      id: 'spirit_clover',
      nameRu: 'Лазурный клевер',
      nameEn: 'Azure Clover',
      descRu: 'Трава, накапливающая природную духовную энергию.',
      descEn: 'Herb that concentrates natural spiritual qi.',
      icon: '🍀',
      cost: 7
    },
    iron_root: {
      id: 'iron_root',
      nameRu: 'Столетний железный корень',
      nameEn: 'Century Iron Root',
      descRu: 'Твёрдый, как базальт, корень для закалки связок и костей.',
      descEn: 'Basalt-hard root used to temper sinews and bones.',
      icon: '🪵',
      cost: 12
    },
    frost_lotus: {
      id: 'frost_lotus',
      nameRu: 'Морозный колокольчик',
      nameEn: 'Frost Bellflower',
      descRu: 'Охлаждающий цветок, усмиряющий буйство истинной ци.',
      descEn: 'Cooling flower that soothes turbulent profound qi.',
      icon: '❄️',
      cost: 16
    },
    flame_bloom: {
      id: 'flame_bloom',
      nameRu: 'Огненный зверобой',
      nameEn: 'Flame Bloom',
      descRu: 'Жгучий цветок, разгоняющий кровь по заблокированным каналам.',
      descEn: 'Fiery blossom that accelerates blood through blocked channels.',
      icon: '🔥',
      cost: 18
    },
    relic_dust: {
      id: 'relic_dust',
      nameRu: 'Нефритовая пыль',
      nameEn: 'Jade Relic Dust',
      descRu: 'Перетёртый порошок древних алтарных реликвий.',
      descEn: 'Finely ground powder of ancient altar relics.',
      icon: '✨',
      cost: 28
    },
    poison_sac: {
      id: 'poison_sac',
      nameRu: 'Ядовитая железа',
      nameEn: 'Venom Gland',
      descRu: 'Смертоносный яд лесных тварей, очищаемый лишь Жемчужиной Злого Неба.',
      descEn: 'Deadly beast venom, purifiable only by the Sky Poison Pearl.',
      icon: '🧪',
      cost: 32
    }
  };

  const RANKS = [
    { rank: 1, xpReq: 0, ru: 'Новичок ступки', en: 'Mortar Novice', perkRu: 'Базовые восстанавливающие отвары.', perkEn: 'Basic recovery decoctions.' },
    { rank: 2, xpReq: 50, ru: 'Младший травник', en: 'Junior Herbalist', perkRu: '+10% к шансу успеха в котле, закалка костей.', perkEn: '+10% crucible success chance, bone tempering.' },
    { rank: 3, xpReq: 150, ru: 'Мастер пламени', en: 'Flame Master', perkRu: 'Варка пилюль прорыва и сутры Первородного Пламени.', perkEn: 'Brewing barrier pills and Primordial Flame sutra.' },
    { rank: 4, xpReq: 350, ru: 'Алхимик Серебряного Моста', en: 'Silver Bridge Alchemist', perkRu: 'Экономия 25% сырья при варке.', perkEn: '25% chance to save ingredients during brewing.' },
    { rank: 5, xpReq: 750, ru: 'Владыка Небесного Котла', en: 'Celestial Crucible Sovereign', perkRu: 'Гарантированный критический успех в котле.', perkEn: 'Guaranteed critical success in normal crucible.' }
  ];

  const RECIPES = {
    vigor_broth: {
      id: 'vigor_broth',
      nameRu: 'Отвар бодрости и сытости',
      nameEn: 'Vigor and Satiety Broth',
      descRu: 'Сытный травяной отвар по совету Мэй. Мгновенно восстанавливает выносливость и снимает усталость.',
      descEn: 'Hearty herbal broth following Mei’s advice. Instantly restores stamina and dispels fatigue.',
      icon: '🥣',
      reqLevel: 1,
      ingredients: { mountain_herb: 2, spring_water: 1 },
      pearlQi: 5,
      effectRu: '+40 выносливости (Жемчужина: +60)',
      effectEn: '+40 stamina (Pearl: +60)',
      apply(s, isPearl, isCrit) {
        const bonus = isPearl ? 60 : (isCrit ? 50 : 40);
        s.stamina = Math.min((s.staminaMax || 100), s.stamina + bonus);
        s.resources.pills = (s.resources.pills || 0) + 1;
        return {
          ru: `Отвар выпит: выносливость восполнена на +${bonus}! 1 пилюля добавлена в запас.`,
          en: `Broth consumed: stamina restored by +${bonus}! 1 pill added to inventory.`
        };
      }
    },
    body_pill: {
      id: 'body_pill',
      nameRu: 'Пилюля закалки костей',
      nameEn: 'Bone-Tempering Pill',
      descRu: 'Секрет старика Жэня: сплавление железного корня и чабреца закаляет связки и тело.',
      descEn: 'Old Ren’s secret: fusing iron root and thyme tempers sinews and the vessel.',
      icon: '🏋️',
      reqLevel: 2,
      ingredients: { iron_root: 1, mountain_herb: 2 },
      pearlQi: 10,
      effectRu: 'Тело +0.15, выносл. +15 (Жемчужина: Тело +0.25, выносл. +25)',
      effectEn: 'Body +0.15, stamina +15 (Pearl: Body +0.25, stamina +25)',
      apply(s, isPearl, isCrit) {
        const bodyGain = isPearl ? 0.25 : (isCrit ? 0.20 : 0.15);
        const stamGain = isPearl ? 25 : 15;
        s.body = Math.min(10 * (s.realm + 1), s.body + bodyGain);
        s.stamina = Math.min((s.staminaMax || 100), s.stamina + stamGain);
        s.resources.pills = (s.resources.pills || 0) + 1;
        return {
          ru: `Пилюля закалки усвоена: Тело +${bodyGain.toFixed(2)}, выносливость +${stamGain}!`,
          en: `Bone-tempering pill absorbed: Body +${bodyGain.toFixed(2)}, stamina +${stamGain}!`
        };
      }
    },
    calm_tea: {
      id: 'calm_tea',
      nameRu: 'Настой ясного сердца',
      nameEn: 'Clear Heart Infusion',
      descRu: 'Рецепт травника Линя: охлаждает каналы, усмиряет буйство мыслей и ускоряет медитацию.',
      descEn: 'Herbalist Lin’s formula: cools channels, calms turmoil and accelerates meditation.',
      icon: '🍵',
      reqLevel: 2,
      ingredients: { spirit_clover: 2, frost_lotus: 1 },
      pearlQi: 12,
      effectRu: 'Спокойствие +4, медитация x1.25 (Жемчужина: Спокойствие +8, x1.5)',
      effectEn: 'Calm +4, meditation x1.25 (Pearl: Calm +8, x1.5)',
      apply(s, isPearl, isCrit) {
        const calmGain = isPearl ? 8 : (isCrit ? 6 : 4);
        s.calm = Math.min(100, (s.calm || 0) + calmGain);
        if (!s.alchemy.buffs) s.alchemy.buffs = {};
        s.alchemy.buffs.meditationBoostUntil = Date.now() + (isPearl ? 1800000 : 900000);
        return {
          ru: `Настой ясного сердца принят: Спокойствие +${calmGain}, медитация ускорена!`,
          en: `Clear Heart Infusion drunk: Calm +${calmGain}, meditation accelerated!`
        };
      }
    },
    breakthrough_pill: {
      id: 'breakthrough_pill',
      nameRu: 'Пилюля сокрушения преград',
      nameEn: 'Barrier-Shattering Pill',
      descRu: 'Формула аптекаря Хо: эссенция духа, дарующая колоссальное понимание для прорыва меридианов.',
      descEn: 'Apothecary Huo’s formula: spiritual essence granting great insight for meridian breakthrough.',
      icon: '⚡',
      reqLevel: 3,
      ingredients: { spirit_clover: 2, flame_bloom: 1, relic_dust: 1 },
      pearlQi: 20,
      effectRu: 'Понимание +20 для Прорыва (Жемчужина: Понимание +35)',
      effectEn: 'Understanding +20 for Breakthrough (Pearl: Understanding +35)',
      apply(s, isPearl, isCrit) {
        const xpGain = isPearl ? 35 : (isCrit ? 26 : 20);
        s.xp = (s.xp || 0) + xpGain;
        s.resources.pills = (s.resources.pills || 0) + 1;
        return {
          ru: `Пилюля сокрушения преград усвоена: Понимание +${xpGain}! Путь к Прорыву открыт!`,
          en: `Barrier-shattering pill absorbed: Understanding +${xpGain}! Path to Breakthrough is open!`
        };
      }
    },
    evil_god_pill: {
      id: 'evil_god_pill',
      nameRu: 'Пилюля Первородного Пламени',
      nameEn: 'Primordial Flame Pill',
      descRu: 'Древняя алхимия Сутры Злого Неба: ядовитая железа, очищенная пламенем Жемчужины в чистую силу.',
      descEn: 'Ancient Evil God sutra alchemy: venom gland purified by the Pearl’s flame into sheer power.',
      icon: '🔥',
      reqLevel: 3,
      ingredients: { flame_bloom: 1, poison_sac: 1 },
      pearlQi: 25,
      requiresPearl: true,
      effectRu: '+25% к боевой мощи на 3 боя, Ци +15 (Жемчужина: +40% на 4 боя, Ци +25)',
      effectEn: '+25% combat power for 3 fights, Qi +15 (Pearl: +40% for 4 fights, Qi +25)',
      apply(s, isPearl, isCrit) {
        if (!s.alchemy.buffs) s.alchemy.buffs = {};
        const fights = isPearl ? 4 : 3;
        const qiBonus = isPearl ? 25 : 15;
        s.alchemy.buffs.evilGodFights = (s.alchemy.buffs.evilGodFights || 0) + fights;
        s.resources.qi = (s.resources.qi || 0) + qiBonus;
        s.resources.pills = (s.resources.pills || 0) + 1;
        return {
          ru: `Сутра Злого Неба активирована: +40% боевой мощи на ${fights} боя, истинная Ци +${qiBonus}!`,
          en: `Evil Sky Sutra surge: +40% battle power for ${fights} duels, profound Qi +${qiBonus}!`
        };
      }
    }
  };

  function fresh() {
    return {
      level: 1,
      xp: 0,
      unlockedRecipes: ['vigor_broth'],
      ingredients: {
        mountain_herb: 5,
        spring_water: 3,
        spirit_clover: 2,
        iron_root: 0,
        frost_lotus: 0,
        flame_bloom: 0,
        relic_dust: 0,
        poison_sac: 0
      },
      buffs: {
        evilGodFights: 0,
        meditationBoostUntil: 0
      },
      stats: {
        brews: 0,
        success: 0,
        crit: 0,
        fail: 0,
        pearlPurified: 0
      },
      log: []
    };
  }

  function validate(input) {
    const base = fresh();
    if (!input || typeof input !== 'object') return base;
    base.level = Math.max(1, Math.min(5, Math.floor(input.level || 1)));
    base.xp = Math.max(0, Math.floor(input.xp || 0));

    // Ensure level matches XP
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (base.xp >= RANKS[i].xpReq) {
        base.level = Math.max(base.level, RANKS[i].rank);
        break;
      }
    }

    if (Array.isArray(input.unlockedRecipes)) {
      base.unlockedRecipes = [...new Set(['vigor_broth', ...input.unlockedRecipes.filter(r => Object.hasOwn(RECIPES, r))])];
    }

    if (input.ingredients && typeof input.ingredients === 'object') {
      for (const k of Object.keys(INGREDIENTS)) {
        base.ingredients[k] = Math.max(0, Math.floor(input.ingredients[k] || 0));
      }
    }

    if (input.buffs && typeof input.buffs === 'object') {
      base.buffs.evilGodFights = Math.max(0, Math.floor(input.buffs.evilGodFights || 0));
      base.buffs.meditationBoostUntil = Math.max(0, Math.floor(input.buffs.meditationBoostUntil || 0));
    }

    if (input.stats && typeof input.stats === 'object') {
      for (const k of ['brews', 'success', 'crit', 'fail', 'pearlPurified']) {
        base.stats[k] = Math.max(0, Math.floor(input.stats[k] || 0));
      }
    }

    if (Array.isArray(input.log)) {
      base.log = input.log.slice(0, 10).map(e => ({
        ru: String(e.ru || '').slice(0, 250),
        en: String(e.en || '').slice(0, 250)
      }));
    }

    return base;
  }

  function canBrew(s, recipeId, mode = 'crucible') {
    if (!s || !s.alchemy) return false;
    const r = RECIPES[recipeId];
    if (!r) return false;
    if (!s.alchemy.unlockedRecipes.includes(recipeId)) return false;
    if (s.alchemy.level < r.reqLevel) return false;

    // Check ingredients
    for (const [ingId, count] of Object.entries(r.ingredients)) {
      if ((s.alchemy.ingredients[ingId] || 0) < count) return false;
    }

    if (mode === 'pearl') {
      if ((s.resources.qi || 0) < r.pearlQi) return false;
    } else {
      if (r.requiresPearl) return false; // Poison requires divine pearl
    }

    return true;
  }

  function brew(s, recipeId, mode = 'crucible', E = null) {
    if (!canBrew(s, recipeId, mode)) return false;
    const r = RECIPES[recipeId];
    const alc = s.alchemy;
    alc.stats.brews++;

    // Spend ingredients (with level 4 ingredient saving perk)
    const saveIngredients = alc.level >= 4 && Math.random() < 0.25;
    if (!saveIngredients) {
      for (const [ingId, count] of Object.entries(r.ingredients)) {
        alc.ingredients[ingId] = Math.max(0, alc.ingredients[ingId] - count);
      }
    }

    let isSuccess = false;
    let isCrit = false;
    let isPearl = (mode === 'pearl');
    let xpGained = 0;
    let logRu = '';
    let logEn = '';

    if (isPearl) {
      // 100% Sky Poison Pearl divine purification
      s.resources.qi = Math.max(0, (s.resources.qi || 0) - r.pearlQi);
      isSuccess = true;
      alc.stats.success++;
      alc.stats.pearlPurified++;
      xpGained = 25;
      const res = r.apply(s, true, false);
      logRu = `【Очищение Жемчужиной Яда】 100% чистая пилюля «${r.nameRu}» создана без токсинов! ${res.ru} (+25 опыта алхимии)`;
      logEn = `【Sky Poison Pearl Purification】 100% pure pill “${r.nameEn}” refined without impurities! ${res.en} (+25 alchemy XP)`;
    } else {
      // Crucible roll
      const baseChance = 0.70 + (alc.level - r.reqLevel) * 0.05;
      const roll = Math.random();
      const critThreshold = alc.level >= 5 ? 1.0 : 0.15;

      if (roll < critThreshold) {
        isSuccess = true;
        isCrit = true;
        alc.stats.success++;
        alc.stats.crit++;
        xpGained = 20;
        const res = r.apply(s, false, true);
        logRu = `【Критический успех в котле】 Превосходное качество «${r.nameRu}»! ${res.ru} (+20 опыта)`;
        logEn = `【Crucible Critical Success】 Superior quality “${r.nameEn}”! ${res.en} (+20 XP)`;
      } else if (roll < baseChance) {
        isSuccess = true;
        alc.stats.success++;
        xpGained = 15;
        const res = r.apply(s, false, false);
        logRu = `【Успешная варка】 Сварено лекарство «${r.nameRu}». ${res.ru} (+15 опыта)`;
        logEn = `【Crucible Success】 Brewed remedy “${r.nameEn}”. ${res.en} (+15 XP)`;
      } else {
        // Failure
        alc.stats.fail++;
        xpGained = 8;
        logRu = `【Неудача в котле】 Пламя взметнулось выше меры: сырьё обратилось в алхимический шлак. Ты извлекаешь ценный урок (+8 опыта).`;
        logEn = `【Crucible Failure】 The flame flared too high: ingredients burned into slag. You extract a valuable lesson (+8 XP).`;
      }
    }

    // Add XP and level up if threshold reached
    alc.xp += xpGained;
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (alc.xp >= RANKS[i].xpReq && alc.level < RANKS[i].rank) {
        alc.level = RANKS[i].rank;
        const rankUpMsgRu = `★ Новый ранг алхимии: «${RANKS[i].ru}»!`;
        const rankUpMsgEn = `★ New alchemy rank: “${RANKS[i].en}”!`;
        logRu += ` ${rankUpMsgRu}`;
        logEn += ` ${rankUpMsgEn}`;
        if (E && E.log) E.log(s, rankUpMsgRu);
        break;
      }
    }

    if (saveIngredients) {
      logRu += ' (Секреты Серебряного Моста сберегли сырьё!)';
      logEn += ' (Silver Bridge mastery preserved your ingredients!)';
    }

    alc.log.unshift({ ru: logRu, en: logEn });
    alc.log = alc.log.slice(0, 10);
    return isSuccess;
  }

  function buy(s, itemId, count = 1) {
    if (!s || !s.alchemy) return false;
    count = Math.max(1, Math.floor(count));

    if (itemId.startsWith('recipe_')) {
      const recId = itemId.replace('recipe_', '');
      const r = RECIPES[recId];
      if (!r || s.alchemy.unlockedRecipes.includes(recId)) return false;
      const price = recId === 'body_pill' ? 35 : (recId === 'calm_tea' ? 45 : 80);
      if (s.resources.gold < price) return false;
      s.resources.gold -= price;
      s.alchemy.unlockedRecipes.push(recId);
      s.alchemy.log.unshift({
        ru: `Куплен рецепт: «${r.nameRu}» у аптекаря Хо за ${price} монет.`,
        en: `Purchased recipe: “${r.nameEn}” from Apothecary Huo for ${price} coins.`
      });
      return true;
    }

    const ing = INGREDIENTS[itemId];
    if (!ing) return false;
    const totalCost = ing.cost * count;
    if (s.resources.gold < totalCost) return false;

    s.resources.gold -= totalCost;
    s.alchemy.ingredients[itemId] = (s.alchemy.ingredients[itemId] || 0) + count;
    return true;
  }

  function sellPill(s, kind = 'standard', count = 1) {
    if (!s || (s.resources.pills || 0) < 1) return false;
    count = Math.min(s.resources.pills, Math.max(1, Math.floor(count)));

    if (kind === 'pure') {
      // 100% Pure pearl pill: 45 gold + 1 reputation
      const goldGain = 45 * count;
      const repGain = 1 * count;
      s.resources.pills -= count;
      s.resources.gold += goldGain;
      s.resources.reputation = (s.resources.reputation || 0) + repGain;
      s.alchemy.log.unshift({
        ru: `Продано ${count} пилюль 100% чистоты мастеру Хо за ${goldGain} монет и +${repGain} репутации!`,
        en: `Sold ${count} 100% pure pills to Master Huo for ${goldGain} coins and +${repGain} reputation!`
      });
      return true;
    } else {
      // Standard pill: 20 gold
      const goldGain = 20 * count;
      s.resources.pills -= count;
      s.resources.gold += goldGain;
      s.alchemy.log.unshift({
        ru: `Продано ${count} пилюль в аптеку за ${goldGain} монет.`,
        en: `Sold ${count} pills to the apothecary for ${goldGain} coins.`
      });
      return true;
    }
  }

  function grindRelic(s) {
    if (!s || (s.resources.relics || 0) < 1) return false;
    s.resources.relics--;
    s.alchemy.ingredients.relic_dust = (s.alchemy.ingredients.relic_dust || 0) + 2;
    s.alchemy.log.unshift({
      ru: `Осколок алтаря перетёрт в ступке в 2 щепотки Нефритовой пыли.`,
      en: `Altar relic ground in a mortar into 2 pinches of Jade Relic Dust.`
    });
    return true;
  }

  function advance(s, dt) {
    if (!s || !s.alchemy || !s.alchemy.buffs) return;
    if (s.alchemy.buffs.meditationBoostUntil > 0 && Date.now() > s.alchemy.buffs.meditationBoostUntil) {
      s.alchemy.buffs.meditationBoostUntil = 0;
    }
  }

  const api = {
    INGREDIENTS,
    RANKS,
    RECIPES,
    fresh,
    validate,
    canBrew,
    brew,
    buy,
    sellPill,
    grindRelic,
    advance
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.IsekaiAlchemy = api;
})(globalThis);
