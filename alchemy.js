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
      combatEffectRu: 'В бою: +50% макс. HP и 100% выносливости',
      combatEffectEn: 'In combat: +50% max HP and 100% stamina',
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
      combatEffectRu: 'В бою: 100% стойкости и укрепление защиты на 2 хода (-40% урона)',
      combatEffectEn: 'In combat: 100% poise and fortified guard for 2 rounds (-40% damage)',
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
      combatEffectRu: 'В бою: Ци +25, +50% стойкости, очищение каналов',
      combatEffectEn: 'In combat: Qi +25, +50% poise, channels cleansed',
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
      combatEffectRu: 'В бою: духовный взрыв наносит урон барьеру врага (пробой стойки) и лечит +30% HP',
      combatEffectEn: 'In combat: spiritual wave shatters enemy barrier (poise break) and restores +30% HP',
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
      combatEffectRu: 'В бою: боевой кураж МАКСИМАЛЕН (импульс 3), Ци +20, сила ударов +40%',
      combatEffectEn: 'In combat: MAX momentum (3), Qi +20, +40% strike damage',
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

  const PATIENTS = {
    ba_strained: {
      id: 'ba_strained',
      nameRu: 'Дядя Ба (Возчик)',
      nameEn: 'Uncle Ba (Carter)',
      conditionRu: 'Надрыв связок и растяжение плеча при разгрузке тяжелой повозки с провизией.',
      conditionEn: 'Torn sinews and shoulder strain from unloading a heavy provision wagon.',
      reqPill: 'vigor_broth',
      reqPillNameRu: 'Отвар бодрости и сытости',
      reqPillNameEn: 'Vigor and Satiety Broth',
      rewardRu: '+35 монет, +1 репутация, +15 опыта алхимии',
      rewardEn: '+35 coins, +1 reputation, +15 alchemy XP',
      rewardGold: 35,
      rewardRep: 1,
      rewardXp: 15
    },
    hunter_poison: {
      id: 'hunter_poison',
      nameRu: 'Охотник Дарий',
      nameEn: 'Hunter Darius',
      conditionRu: 'Укус железистой гадюки в чащобе. Тёмный яд медленно разъедает меридианы руки.',
      conditionEn: 'Ironclaw viper bite in the thicket. Dark venom slowly corrodes arm meridians.',
      reqPill: 'calm_tea',
      pearlAlt: true,
      pearlQi: 15,
      reqPillNameRu: 'Настой ясного сердца (или очищение Жемчужиной, 15 Ци)',
      reqPillNameEn: 'Clear Heart Infusion (or Pearl purge, 15 Qi)',
      rewardRu: '+60 монет, +2 репутации, +2 железы яда, +25 опыта',
      rewardEn: '+60 coins, +2 reputation, +2 venom glands, +25 XP',
      rewardGold: 60,
      rewardRep: 2,
      rewardXp: 25,
      rewardIngredient: { poison_sac: 2 }
    },
    apprentice_fracture: {
      id: 'apprentice_fracture',
      nameRu: 'Ученик Бо (Аптека)',
      nameEn: 'Apprentice Bo (Apothecary)',
      conditionRu: 'Тяжёлый перелом костей предплечья при падении со скалы во время сбора трав.',
      conditionEn: 'Severe forearm bone fracture after falling from crags while gathering herbs.',
      reqPill: 'body_pill',
      reqPillNameRu: 'Пилюля закалки костей',
      reqPillNameEn: 'Bone-Tempering Pill',
      rewardRu: '+75 монет, +2 репутации, +1 нефритовая пыль, +30 опыта',
      rewardEn: '+75 coins, +2 reputation, +1 jade dust, +30 XP',
      rewardGold: 75,
      rewardRep: 2,
      rewardXp: 30,
      rewardIngredient: { relic_dust: 1 }
    },
    elder_dandu: {
      id: 'elder_dandu',
      nameRu: 'Старейшина Юнь',
      nameEn: 'Elder Yun',
      conditionRu: '30 лет приёма неочищенных смертных пилюль привели к тяжелейшему окаменению меридианов токсинами Дань Ду.',
      conditionEn: '30 years of impure mortal pills caused severe meridian calcification by Dan Du toxins.',
      reqPill: 'breakthrough_pill',
      pearlAlt: true,
      pearlQi: 25,
      reqPillNameRu: 'Пилюля сокрушения преград (или очищение Жемчужиной, 25 Ци)',
      reqPillNameEn: 'Barrier-Shattering Pill (or Pearl purge, 25 Qi)',
      rewardRu: '+150 монет, +5 репутации, +1 осколок алтаря, +50 опыта',
      rewardEn: '+150 coins, +5 reputation, +1 relic shard, +50 XP',
      rewardGold: 150,
      rewardRep: 5,
      rewardXp: 50,
      rewardRelic: 1
    }
  };

  const FORAGE_TABLES = {
    village: {
      id: 'village',
      nameRu: 'Склоны Долины Плывущих Облаков',
      nameEn: 'Slopes of Floating Cloud Valley',
      descRu: 'Душистый дикорастущий чабрец и родниковая вода горных ключей.',
      descEn: 'Fragrant wild thyme and pure mountain spring water.',
      herbs: [
        { id: 'mountain_herb', min: 2, max: 3 },
        { id: 'spring_water', min: 1, max: 2 }
      ],
      rareHerb: 'spirit_clover',
      rareChance: 0.35
    },
    pass: {
      id: 'pass',
      nameRu: 'Каменистые тропы Перевала',
      nameEn: 'Rocky Paths of Cloud Pass',
      descRu: 'Твёрдые железные корни среди расселин и выветренных утесов.',
      descEn: 'Basalt-hard iron roots among rocky crevices and weathered cliffs.',
      herbs: [
        { id: 'iron_root', min: 1, max: 2 },
        { id: 'mountain_herb', min: 1, max: 2 }
      ],
      rareHerb: 'flame_bloom',
      rareChance: 0.30
    },
    forest: {
      id: 'forest',
      nameRu: 'Чащоба Звериного Хребта',
      nameEn: 'Beast Range Thickets',
      descRu: 'Лазурный клевер, морозные колокольчики и ядовитые железы диких тварей.',
      descEn: 'Azure clover, frost bellflowers and venom glands of wild beasts.',
      herbs: [
        { id: 'spirit_clover', min: 1, max: 2 },
        { id: 'frost_lotus', min: 1, max: 1 }
      ],
      rareHerb: 'poison_sac',
      rareChance: 0.35
    },
    ruins: {
      id: 'ruins',
      nameRu: 'Древние Алтарные Руины',
      nameEn: 'Ancient Altar Ruins',
      descRu: 'Огненный зверобой и древняя нефритовая пыль со священных плит.',
      descEn: 'Flame blooms and jade relic dust from sacred stone slabs.',
      herbs: [
        { id: 'flame_bloom', min: 1, max: 2 },
        { id: 'relic_dust', min: 1, max: 1 }
      ],
      rareHerb: 'poison_sac',
      rareChance: 0.40
    },
    city: {
      id: 'city',
      nameRu: 'Сады и Торговые Ряды Города',
      nameEn: 'City Gardens and Market Stalls',
      descRu: 'Свежие травы из пригородных садов и чистые родники.',
      descEn: 'Fresh herbs from suburban gardens and clear springs.',
      herbs: [
        { id: 'mountain_herb', min: 1, max: 2 },
        { id: 'spring_water', min: 1, max: 1 },
        { id: 'spirit_clover', min: 1, max: 1 }
      ],
      rareHerb: 'iron_root',
      rareChance: 0.25
    }
  };

  const REGIONAL_MARKETS = {
    village: {
      nameRu: 'Деревня и Постоялый Двор',
      nameEn: 'Village & Crossroads Inn',
      descRu: 'Возчики и крестьяне охотно скупают восстанавливающие отвары (+35 монет).',
      descEn: 'Carters and villagers readily buy recovery broths (+35 coins).',
      buys: {
        vigor_broth: 35,
        body_pill: 40,
        calm_tea: 35,
        breakthrough_pill: 75,
        evil_god_pill: 90
      }
    },
    pass: {
      nameRu: 'Горный Перевал и Застава',
      nameEn: 'Mountain Pass & Garrison',
      descRu: 'Караванщики и стражи заставы платят щедрое золото за пилюли закалки костей (+50 монет).',
      descEn: 'Caravan guards and scouts pay generously for bone-tempering pills (+50 coins).',
      buys: {
        vigor_broth: 35,
        body_pill: 50,
        calm_tea: 40,
        breakthrough_pill: 85,
        evil_god_pill: 100
      }
    },
    forest: {
      nameRu: 'Лагерь Охотников в Лесу',
      nameEn: 'Hunters’ Camp in the Forest',
      descRu: 'Охотники и травники ценят настой ясного сердца (+55 монет) для защиты разума.',
      descEn: 'Hunters and herbalists value clear heart infusion (+55 coins) to protect the mind.',
      buys: {
        vigor_broth: 30,
        body_pill: 45,
        calm_tea: 55,
        breakthrough_pill: 90,
        evil_god_pill: 110
      }
    },
    city: {
      nameRu: 'Город Серебряного Моста · Гильдия Черной Луны',
      nameEn: 'Silver Bridge City · Black Moon Guild',
      descRu: 'Купцы Гильдии Черной Луны скупают пилюли прорыва (+120 монет) и платят за 100% чистоту (+60 монет, +1 реп.).',
      descEn: 'Black Moon Guild merchants purchase barrier pills (+120 coins) and pay extra for 100% purity (+60 coins, +1 rep).',
      buys: {
        vigor_broth: 30,
        body_pill: 45,
        calm_tea: 50,
        breakthrough_pill: 120,
        evil_god_pill: 125,
        pure: 60
      }
    },
    ruins: {
      nameRu: 'Святилище Древних Руин',
      nameEn: 'Sanctuary of Ancient Ruins',
      descRu: 'Искатели артефактов и культиваторы платят огромное золото за пилюли Первородного Пламени (+140 монет).',
      descEn: 'Artifact seekers and rogue cultivators pay immense gold for Primordial Flame pills (+140 coins).',
      buys: {
        vigor_broth: 25,
        body_pill: 40,
        calm_tea: 45,
        breakthrough_pill: 100,
        evil_god_pill: 140
      }
    }
  };

  function fresh() {
    return {
      level: 1,
      xp: 0,
      unlockedRecipes: ['vigor_broth'],
      inventory: {
        vigor_broth: 0,
        body_pill: 0,
        calm_tea: 0,
        breakthrough_pill: 0,
        evil_god_pill: 0
      },
      pouch: ['vigor_broth', null, null],
      patients: ['ba_strained', 'hunter_poison'],
      forageCooldown: 0,
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
        pearlPurified: 0,
        patientsTreated: 0,
        forages: 0,
        pillsTraded: 0
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

    if (input.inventory && typeof input.inventory === 'object') {
      for (const k of Object.keys(base.inventory)) {
        base.inventory[k] = Math.max(0, Math.floor(input.inventory[k] || 0));
      }
    }

    if (Array.isArray(input.pouch)) {
      base.pouch = [
        input.pouch[0] && Object.hasOwn(RECIPES, input.pouch[0]) ? input.pouch[0] : (input.pouch[0] === null ? null : 'vigor_broth'),
        input.pouch[1] && Object.hasOwn(RECIPES, input.pouch[1]) ? input.pouch[1] : null,
        input.pouch[2] && Object.hasOwn(RECIPES, input.pouch[2]) ? input.pouch[2] : null
      ];
    }

    if (Array.isArray(input.patients)) {
      const valid = input.patients.filter(p => Object.hasOwn(PATIENTS, p));
      base.patients = valid.length > 0 ? [...new Set(valid)] : ['ba_strained', 'hunter_poison'];
    }

    base.forageCooldown = Math.max(0, Number(input.forageCooldown) || 0);

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
      for (const k of ['brews', 'success', 'crit', 'fail', 'pearlPurified', 'patientsTreated', 'forages', 'pillsTraded']) {
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

  function maxBrew(s, recipeId, mode = 'crucible') {
    if (!canBrew(s, recipeId, mode)) return 0;
    const r = RECIPES[recipeId];
    if (!r) return 0;
    let maxCount = 999;
    for (const [ingId, count] of Object.entries(r.ingredients)) {
      const has = s.alchemy.ingredients[ingId] || 0;
      maxCount = Math.min(maxCount, Math.floor(has / count));
    }
    if (mode === 'pearl') {
      const qi = s.resources.qi || 0;
      maxCount = Math.min(maxCount, Math.floor(qi / (r.pearlQi || 1)));
    }
    return Math.max(0, maxCount);
  }

  function brew(s, recipeId, mode = 'crucible', E = null, batchCount = 1) {
    if (!canBrew(s, recipeId, mode)) return false;
    const r = RECIPES[recipeId];
    const alc = s.alchemy;
    const isPearl = (mode === 'pearl');

    const totalToBrew = Math.max(1, Math.min(batchCount || 1, maxBrew(s, recipeId, mode) || 1));
    let anySuccess = false;
    let successfulCount = 0;

    for (let step = 0; step < totalToBrew; step++) {
      if (!canBrew(s, recipeId, mode)) break;
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
        const rankBonus = (alc.level >= 2) ? 0.10 : 0;
        const baseChance = Math.min(0.95, 0.70 + (alc.level - r.reqLevel) * 0.05 + rankBonus);
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

      if (isSuccess) {
        anySuccess = true;
        successfulCount++;
        if (!alc.inventory) alc.inventory = {};
        alc.inventory[recipeId] = (alc.inventory[recipeId] || 0) + 1;
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
    }

    alc.log = alc.log.slice(0, 10);
    return isPearl ? true : anySuccess;
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

    // Deduct from inventory tracking
    if (s.alchemy && s.alchemy.inventory) {
      let remaining = count;
      for (const recId of Object.keys(s.alchemy.inventory)) {
        const has = s.alchemy.inventory[recId] || 0;
        const take = Math.min(has, remaining);
        s.alchemy.inventory[recId] -= take;
        remaining -= take;
        if (remaining <= 0) break;
      }
    }

    if (kind === 'pure') {
      // 100% Pure pearl pill: 45 gold + 1 reputation
      const goldGain = 45 * count;
      const repGain = 1 * count;
      s.resources.pills -= count;
      s.resources.gold += goldGain;
      s.resources.reputation = (s.resources.reputation || 0) + repGain;
      if (s.alchemy) {
        s.alchemy.stats.pillsTraded = (s.alchemy.stats.pillsTraded || 0) + count;
        s.alchemy.log.unshift({
          ru: `Продано ${count} пилюль 100% чистоты мастеру Хо за ${goldGain} монет и +${repGain} репутации!`,
          en: `Sold ${count} 100% pure pills to Master Huo for ${goldGain} coins and +${repGain} reputation!`
        });
      }
      return true;
    } else {
      // Standard pill: 20 gold
      const goldGain = 20 * count;
      s.resources.pills -= count;
      s.resources.gold += goldGain;
      if (s.alchemy) {
        s.alchemy.stats.pillsTraded = (s.alchemy.stats.pillsTraded || 0) + count;
        s.alchemy.log.unshift({
          ru: `Продано ${count} пилюль в аптеку за ${goldGain} монет.`,
          en: `Sold ${count} pills to the apothecary for ${goldGain} coins.`
        });
      }
      return true;
    }
  }

  function sellSpecificPill(s, recipeId, count = 1, location = 'village') {
    if (!s || !s.alchemy) return false;
    count = Math.max(1, Math.floor(count));
    const invCount = s.alchemy.inventory?.[recipeId] || 0;
    const pillCount = s.resources.pills || 0;
    if (invCount < count && pillCount < count) return false;

    const locKey = location || s.world?.location || 'village';
    const market = REGIONAL_MARKETS[locKey] || REGIONAL_MARKETS.village;
    const unitPrice = market.buys[recipeId] || 25;
    const goldGain = unitPrice * count;

    s.resources.gold += goldGain;
    if (s.alchemy.inventory?.[recipeId] >= count) {
      s.alchemy.inventory[recipeId] -= count;
    }
    s.resources.pills = Math.max(0, (s.resources.pills || 0) - count);
    s.alchemy.stats.pillsTraded = (s.alchemy.stats.pillsTraded || 0) + count;

    let repGain = 0;
    if (recipeId === 'breakthrough_pill' || recipeId === 'evil_god_pill') {
      repGain = count;
      s.resources.reputation = (s.resources.reputation || 0) + repGain;
    }

    const rec = RECIPES[recipeId];
    const recNameRu = rec ? rec.nameRu : recipeId;
    const recNameEn = rec ? rec.nameEn : recipeId;
    const locNameRu = market.nameRu;
    const locNameEn = market.nameEn;

    s.alchemy.log.unshift({
      ru: `【Караванная торговля】 Продано ${count} шт. «${recNameRu}» (${locNameRu}) за ${goldGain} монет${repGain ? ` и +${repGain} реп.` : ''}!`,
      en: `【Caravan Trade】 Sold ${count}x “${recNameEn}” (${locNameEn}) for ${goldGain} coins${repGain ? ` and +${repGain} rep` : ''}!`
    });
    s.alchemy.log = s.alchemy.log.slice(0, 10);
    return true;
  }

  function canForage(s, location = null) {
    if (!s || !s.alchemy) return false;
    if ((s.stamina || 0) < 10) return false;
    if ((s.alchemy.forageCooldown || 0) > 0) return false;
    return true;
  }

  function forage(s, location = null, E = null) {
    if (!canForage(s, location)) return false;
    const alc = s.alchemy;
    s.stamina = Math.max(0, (s.stamina || 0) - 10);
    alc.forageCooldown = 15;
    alc.stats.forages = (alc.stats.forages || 0) + 1;

    const locKey = location || s.world?.location || 'village';
    const table = FORAGE_TABLES[locKey] || FORAGE_TABLES.village;

    const gathered = [];
    for (const h of table.herbs) {
      const count = Math.floor(Math.random() * (h.max - h.min + 1)) + h.min;
      alc.ingredients[h.id] = (alc.ingredients[h.id] || 0) + count;
      const ing = INGREDIENTS[h.id];
      gathered.push({ count, ing });
    }

    let rareFound = null;
    if (table.rareHerb && Math.random() < table.rareChance) {
      alc.ingredients[table.rareHerb] = (alc.ingredients[table.rareHerb] || 0) + 1;
      rareFound = INGREDIENTS[table.rareHerb];
    }

    alc.xp += 10;
    // Check rank up
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (alc.xp >= RANKS[i].xpReq && alc.level < RANKS[i].rank) {
        alc.level = RANKS[i].rank;
        const rankUpMsgRu = `★ Новый ранг алхимии: «${RANKS[i].ru}»!`;
        const rankUpMsgEn = `★ New alchemy rank: “${RANKS[i].en}”!`;
        alc.log.unshift({ ru: rankUpMsgRu, en: rankUpMsgEn });
        if (E && E.log) E.log(s, rankUpMsgRu);
        break;
      }
    }

    const itemsRu = gathered.map(g => `${g.ing.icon} ${g.ing.nameRu} ×${g.count}`).join(', ');
    const itemsEn = gathered.map(g => `${g.ing.icon} ${g.ing.nameEn} ×${g.count}`).join(', ');
    const rareRu = rareFound ? ` Редкая находка: ${rareFound.icon} ${rareFound.nameRu}!` : '';
    const rareEn = rareFound ? ` Rare find: ${rareFound.icon} ${rareFound.nameEn}!` : '';

    alc.log.unshift({
      ru: `【Сбор трав · ${table.nameRu}】 Найдено: ${itemsRu}.${rareRu} (+10 опыта)`,
      en: `【Herb Foraging · ${table.nameEn}】 Gathered: ${itemsEn}.${rareEn} (+10 XP)`
    });
    alc.log = alc.log.slice(0, 10);
    return true;
  }

  function canTreatPatient(s, patientId, usePearl = false) {
    if (!s || !s.alchemy) return false;
    const patient = PATIENTS[patientId];
    if (!patient) return false;
    if (!s.alchemy.patients || !s.alchemy.patients.includes(patientId)) return false;

    if (usePearl) {
      const qiCost = patient.pearlQi || 15;
      return (s.resources.qi || 0) >= qiCost;
    } else {
      const hasReqPill = (s.alchemy.inventory?.[patient.reqPill] || 0) >= 1;
      const hasGenericPills = (s.resources.pills || 0) >= 1;
      return hasReqPill || hasGenericPills;
    }
  }

  function treatPatient(s, patientId, usePearl = false, E = null) {
    if (!canTreatPatient(s, patientId, usePearl)) return false;
    const alc = s.alchemy;
    const patient = PATIENTS[patientId];

    if (usePearl) {
      const qiCost = patient.pearlQi || 15;
      s.resources.qi = Math.max(0, (s.resources.qi || 0) - qiCost);
      alc.stats.pearlPurified = (alc.stats.pearlPurified || 0) + 1;
    } else {
      if (alc.inventory?.[patient.reqPill] > 0) {
        alc.inventory[patient.reqPill]--;
      }
      s.resources.pills = Math.max(0, (s.resources.pills || 1) - 1);
    }

    // Grant rewards
    s.resources.gold += patient.rewardGold || 0;
    s.resources.reputation = (s.resources.reputation || 0) + (patient.rewardRep || 0);
    if (patient.rewardRelic) {
      s.resources.relics = (s.resources.relics || 0) + patient.rewardRelic;
    }
    if (patient.rewardIngredient) {
      for (const [k, v] of Object.entries(patient.rewardIngredient)) {
        alc.ingredients[k] = (alc.ingredients[k] || 0) + v;
      }
    }

    alc.xp += patient.rewardXp || 20;
    alc.stats.patientsTreated = (alc.stats.patientsTreated || 0) + 1;

    // Check rank up
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (alc.xp >= RANKS[i].xpReq && alc.level < RANKS[i].rank) {
        alc.level = RANKS[i].rank;
        const rankUpMsgRu = `★ Новый ранг алхимии: «${RANKS[i].ru}»!`;
        const rankUpMsgEn = `★ New alchemy rank: “${RANKS[i].en}”!`;
        alc.log.unshift({ ru: rankUpMsgRu, en: rankUpMsgEn });
        if (E && E.log) E.log(s, rankUpMsgRu);
        break;
      }
    }

    // Rotate patient roster
    alc.patients = alc.patients.filter(p => p !== patientId);
    const allPatientKeys = Object.keys(PATIENTS);
    const unserved = allPatientKeys.filter(p => p !== patientId && !alc.patients.includes(p));
    if (unserved.length > 0) {
      alc.patients.push(unserved[0]);
    } else if (alc.patients.length === 0) {
      alc.patients = ['ba_strained', 'hunter_poison'];
    }

    const logRu = usePearl
      ? `【Лекарь с Небес · Очищение Жемчужиной】 «${patient.nameRu}» исцелен без токсинов! Получено: +${patient.rewardGold} монет, +${patient.rewardRep} репутации, +${patient.rewardXp} опыта.`
      : `【Клиника Лекаря】 Снадобье «${patient.reqPillNameRu}» исцелило «${patient.nameRu}»! Получено: +${patient.rewardGold} монет, +${patient.rewardRep} репутации, +${patient.rewardXp} опыта.`;

    const logEn = usePearl
      ? `【Miracle Doctor · Pearl Purge】 “${patient.nameEn}” cured without impurities! Received: +${patient.rewardGold} coins, +${patient.rewardRep} rep, +${patient.rewardXp} XP.`
      : `【Miracle Doctor Clinic】 Remedy “${patient.reqPillNameEn}” healed “${patient.nameEn}”! Received: +${patient.rewardGold} coins, +${patient.rewardRep} rep, +${patient.rewardXp} XP.`;

    alc.log.unshift({ ru: logRu, en: logEn });
    alc.log = alc.log.slice(0, 10);
    if (E && E.log) E.log(s, `Клиника: ${patient.nameRu} исцелен (+${patient.rewardGold} монет, +${patient.rewardRep} реп.)`);
    return true;
  }

  function equipPouch(s, recipeId, slotIndex = 0) {
    if (!s || !s.alchemy) return false;
    slotIndex = Math.max(0, Math.min(2, Math.floor(slotIndex)));
    if (!Array.isArray(s.alchemy.pouch)) s.alchemy.pouch = ['vigor_broth', null, null];
    if (!recipeId || recipeId === 'none') {
      s.alchemy.pouch[slotIndex] = null;
      return true;
    }
    if (!RECIPES[recipeId]) return false;
    s.alchemy.pouch[slotIndex] = recipeId;
    return true;
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
    if (!s || !s.alchemy) return;
    if (typeof dt === 'number' && dt > 0) {
      if (s.alchemy.forageCooldown > 0) {
        s.alchemy.forageCooldown = Math.max(0, s.alchemy.forageCooldown - dt);
      }
    }
    if (s.alchemy.buffs && s.alchemy.buffs.meditationBoostUntil > 0) {
      if (typeof dt === 'number' && dt > 0) {
        s.alchemy.buffs.meditationBoostUntil -= dt * 1000;
      }
      if (Date.now() > s.alchemy.buffs.meditationBoostUntil) {
        s.alchemy.buffs.meditationBoostUntil = 0;
      }
    }
  }

  const api = {
    INGREDIENTS,
    RANKS,
    RECIPES,
    PATIENTS,
    FORAGE_TABLES,
    REGIONAL_MARKETS,
    fresh,
    validate,
    canBrew,
    maxBrew,
    brew,
    buy,
    sellPill,
    sellSpecificPill,
    grindRelic,
    canTreatPatient,
    treatPatient,
    canForage,
    forage,
    equipPouch,
    advance
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.IsekaiAlchemy = api;
})(globalThis);
