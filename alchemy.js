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
    },
    aged_mountain_herb: {
      id: 'aged_mountain_herb',
      nameRu: 'Столетний горный чабрец',
      nameEn: 'Century Mountain Thyme',
      descRu: 'Чабрец, вобравший 100 лет первородной ци Жемчужины. Снимает пилюльные токсины и дарует +35% крита.',
      descEn: 'Thyme concentrated with 100 years of Pearl qi. Removes pill toxins and grants +35% crit.',
      icon: '🌿',
      cost: 25
    },
    aged_spirit_clover: {
      id: 'aged_spirit_clover',
      nameRu: 'Столетний лазурный клевер',
      nameEn: 'Century Azure Clover',
      descRu: 'Клевер вековой концентрации, сияющий лазурным ореолом.',
      descEn: 'Century-aged clover radiating an azure spiritual halo.',
      icon: '🍀',
      cost: 35
    },
    aged_iron_root: {
      id: 'aged_iron_root',
      nameRu: 'Столетний адамантовый корень',
      nameEn: 'Century Adamantine Root',
      descRu: 'Закалённый веками корень крепостью драконьей кости.',
      descEn: 'Century-tempered root as unyielding as dragon bone.',
      icon: '🪵',
      cost: 50
    },
    aged_frost_lotus: {
      id: 'aged_frost_lotus',
      nameRu: 'Столетний ледяной лотос',
      nameEn: 'Century Frost Lotus',
      descRu: 'Вековой кристальный цветок безупречной чистоты.',
      descEn: 'Century-aged crystalline blossom of flawless purity.',
      icon: '❄️',
      cost: 65
    },
    aged_flame_bloom: {
      id: 'aged_flame_bloom',
      nameRu: 'Столетний огненный зверобой',
      nameEn: 'Century Flame Bloom',
      descRu: 'Вековой огненный цветок, пылающий золотым жаром.',
      descEn: 'Century-aged flame blossom blazing with golden heat.',
      icon: '🔥',
      cost: 70
    },
    aged_poison_sac: {
      id: 'aged_poison_sac',
      nameRu: 'Очищенная эссенция яда',
      nameEn: 'Purified Venom Essence',
      descRu: 'Вековой очищенный яд Небесной Жемчужины, лишённый вреда для сосуда.',
      descEn: 'Century-aged purified Pearl venom essence, harmless to the cultivator’s vessel.',
      icon: '🧪',
      cost: 85
    },
    divine_petals: {
      id: 'divine_petals',
      nameRu: 'Священные лепестки Жемчужины',
      nameEn: 'Divine Pearl Petals',
      descRu: 'Божественные лепестки тысячелетней мутации первозданного хаоса.',
      descEn: 'Divine petals from millennial mutation of primordial chaos.',
      icon: '🌸',
      cost: 120
    }
  };

  const SEEDS = {
    mountain_herb_seed: {
      id: 'mountain_herb_seed',
      nameRu: 'Семя горного чабреца',
      nameEn: 'Mountain Thyme Seed',
      descRu: 'Семя дикорастущего чабреца со склонов долины.',
      descEn: 'Wild thyme seed from valley slopes.',
      icon: '🌱',
      herbId: 'mountain_herb',
      agedHerbId: 'aged_mountain_herb',
      matureTime: 180,
      cost: 6
    },
    spirit_clover_seed: {
      id: 'spirit_clover_seed',
      nameRu: 'Семя лазурного клевера',
      nameEn: 'Azure Clover Seed',
      descRu: 'Семя духовного клевера, тянущееся к первородной ци.',
      descEn: 'Spiritual clover seed drawn to primordial qi.',
      icon: '🍀',
      herbId: 'spirit_clover',
      agedHerbId: 'aged_spirit_clover',
      matureTime: 480,
      cost: 12
    },
    iron_root_seed: {
      id: 'iron_root_seed',
      nameRu: 'Семя железного корня',
      nameEn: 'Iron Root Seed',
      descRu: 'Тяжёлое семя для выращивания железного корня.',
      descEn: 'Heavy seed for growing iron roots.',
      icon: '🪵',
      herbId: 'iron_root',
      agedHerbId: 'aged_iron_root',
      matureTime: 900,
      cost: 20
    },
    frost_lotus_seed: {
      id: 'frost_lotus_seed',
      nameRu: 'Семя морозного колокольчика',
      nameEn: 'Frost Lotus Seed',
      descRu: 'Ледяное семя, дышащее горной прохладой.',
      descEn: 'Icy seed breathing mountain chill.',
      icon: '❄️',
      herbId: 'frost_lotus',
      agedHerbId: 'aged_frost_lotus',
      matureTime: 1800,
      cost: 28
    },
    flame_bloom_seed: {
      id: 'flame_bloom_seed',
      nameRu: 'Семя огненного зверобоя',
      nameEn: 'Flame Bloom Seed',
      descRu: 'Жгучее семя, вобравшее частицу первородного пламени.',
      descEn: 'Fiery seed harboring a spark of primordial flame.',
      icon: '🔥',
      herbId: 'flame_bloom',
      agedHerbId: 'aged_flame_bloom',
      matureTime: 1800,
      cost: 30
    },
    poison_spore: {
      id: 'poison_spore',
      nameRu: 'Ядовитая спора Чащоб',
      nameEn: 'Beast Miasma Spore',
      descRu: 'Концентрированная спора ядовитых тварей.',
      descEn: 'Concentrated spore of venomous beasts.',
      icon: '🧪',
      herbId: 'poison_sac',
      agedHerbId: 'aged_poison_sac',
      matureTime: 2700,
      cost: 45
    },
    primordial_seed: {
      id: 'primordial_seed',
      nameRu: 'Реликтовое семя Хаоса',
      nameEn: 'Relic Primordial Seed',
      descRu: 'Древнейшее семя Небес. Прорастая в Жемчужине, рождает священные лепестки.',
      descEn: 'Ancient celestial seed. Sprouting inside the Pearl yields divine petals.',
      icon: '✨',
      herbId: 'divine_petals',
      agedHerbId: 'divine_petals',
      matureTime: 3600,
      cost: 80
    }
  };

  const PLOT_UNLOCK_REQS = [
    { plotIndex: 0, reqRank: 1, qi: 0, gold: 0, relics: 0, nameRu: 'Алтарная делянка у чистой воды I', nameEn: 'Altar Plot by Clear Water I' },
    { plotIndex: 1, reqRank: 1, qi: 0, gold: 0, relics: 0, nameRu: 'Алтарная делянка у чистой воды II', nameEn: 'Altar Plot by Clear Water II' },
    { plotIndex: 2, reqRank: 2, qi: 20, gold: 50, relics: 0, nameRu: 'Очищенная лазурная земля', nameEn: 'Cleansed Azure Soil' },
    { plotIndex: 3, reqRank: 3, qi: 40, gold: 150, relics: 0, nameRu: 'Делянка пламени Злого Бога', nameEn: 'Evil God Flame Soil' },
    { plotIndex: 4, reqRank: 4, qi: 80, gold: 400, relics: 1, nameRu: 'Терраса Пятицветной Нефритовой Земли', nameEn: 'Five-Color Jade Earth Terrace' },
    { plotIndex: 5, reqRank: 5, qi: 150, gold: 1000, relics: 2, nameRu: 'Сердцевина Жемчужины Изначального Хаоса', nameEn: 'Core of Primordial Chaos Pearl' }
  ];

  const RANKS = [
    { rank: 1, xpReq: 0, ru: 'Новичок ступки', en: 'Mortar Novice', perkRu: 'Базовые восстанавливающие отвары.', perkEn: 'Basic recovery decoctions.' },
    { rank: 2, xpReq: 50, ru: 'Младший травник', en: 'Junior Herbalist', perkRu: '+10% к шансу успеха в котле, закалка костей.', perkEn: '+10% crucible success chance, bone tempering.' },
    { rank: 3, xpReq: 150, ru: 'Мастер пламени', en: 'Flame Master', perkRu: 'Варка пилюль прорыва и сутры Первородного Пламени.', perkEn: 'Brewing barrier pills and Primordial Flame sutra.' },
    { rank: 4, xpReq: 350, ru: 'Алхимик Серебряного Моста', en: 'Silver Bridge Alchemist', perkRu: 'Экономия 25% сырья при варке.', perkEn: '25% chance to save ingredients during brewing.' },
    { rank: 5, xpReq: 750, ru: 'Владыка Небесного Котла', en: 'Celestial Crucible Sovereign', perkRu: 'Гарантированный критический успех в котле.', perkEn: 'Guaranteed critical success in normal crucible.' }
  ];

  function addDanDu(s, amount) {
    if (!s || !s.alchemy) return 0;
    if (!s.alchemy.meridians) s.alchemy.meridians = fresh().meridians;
    const m = s.alchemy.meridians;
    const prev = m.danDu || 0;
    m.danDu = Math.max(0, Math.min(100, prev + amount));
    m.purity = Math.max(0, 100 - m.danDu);
    return m.danDu - prev;
  }

  function cleanseDanDu(s, amount) {
    if (!s || !s.alchemy) return 0;
    if (!s.alchemy.meridians) s.alchemy.meridians = fresh().meridians;
    const m = s.alchemy.meridians;
    const cleansed = Math.min(m.danDu || 0, amount);
    m.danDu = Math.max(0, (m.danDu || 0) - cleansed);
    m.purity = Math.max(0, 100 - m.danDu);
    m.totalCleansed = (m.totalCleansed || 0) + cleansed;
    return cleansed;
  }

  function canMeridianPurge(s) {
    if (!s || !s.alchemy) return false;
    const m = s.alchemy.meridians || { danDu: 0 };
    return (m.danDu > 0) && ((s.resources?.qi || 0) >= 15);
  }

  function meridianPurge(s) {
    if (!canMeridianPurge(s)) return false;
    s.resources.qi -= 15;
    const m = s.alchemy.meridians;
    const cleansed = Math.min(m.danDu, 30);
    m.danDu = Math.max(0, m.danDu - cleansed);
    m.purity = Math.max(0, 100 - m.danDu);
    m.totalCleansed = (m.totalCleansed || 0) + cleansed;
    m.pearlPurges = (m.pearlPurges || 0) + 1;
    s.alchemy.xp = (s.alchemy.xp || 0) + 15;
    const logRu = `【Очищение Жемчужиной Яда】 Багрово-изумрудный свет Небесной Жемчужины омыл 54 глубоких входа: растворено ${cleansed} токсинов Дань Ду! Чистота меридианов: ${m.purity}%.`;
    const logEn = `【Sky Poison Pearl Purge】 Emerald-crimson radiance cleansed the 54 profound entrances: purged ${cleansed} Dan Du toxins! Meridian purity: ${m.purity}%.`;
    s.alchemy.log.unshift({ ru: logRu, en: logEn });
    s.alchemy.log = s.alchemy.log.slice(0, 10);
    const E = typeof module !== 'undefined' && module.exports ? require('./engine.js') : root.IsekaiEngine;
    if (E && E.log) E.log(s, logRu);
    return true;
  }

  function meridianPurity(s) {
    if (!s || !s.alchemy || !s.alchemy.meridians) return 100;
    return s.alchemy.meridians.purity !== undefined ? s.alchemy.meridians.purity : Math.max(0, 100 - (s.alchemy.meridians.danDu || 0));
  }

  function getDanDuStatus(s, lang = 'ru') {
    const danDu = s?.alchemy?.meridians?.danDu || 0;
    const pearlPurges = s?.alchemy?.meridians?.pearlPurges || 0;
    const isEn = lang === 'en';
    if (danDu === 0 && pearlPurges > 0) {
      return {
        tier: 'immaculate',
        name: isEn ? 'Immaculate Celestial Meridians' : 'Безупречные Небесные Меридианы',
        desc: isEn ? 'Flawless qi channels (+15% meditation speed, +10 poise)' : 'Безупречные каналы (+15% к скорости ци, +10 стойки)',
        badgeClass: 'meridian-badge-immaculate'
      };
    }
    if (danDu <= 20) {
      return {
        tier: 'clean',
        name: isEn ? 'Clean Meridians' : 'Чистые меридианы',
        desc: isEn ? 'Normal qi circulation, minimal residue' : 'Нормальная циркуляция ци, минимальный осадок',
        badgeClass: 'meridian-badge-clean'
      };
    }
    if (danDu <= 50) {
      return {
        tier: 'slight',
        name: isEn ? 'Mild Alchemical Dregs' : 'Пилюльный осадок',
        desc: isEn ? '-10% meditation speed' : '-10% к скорости медитации',
        badgeClass: 'meridian-badge-slight'
      };
    }
    if (danDu <= 80) {
      return {
        tier: 'calcified',
        name: isEn ? 'Channel Calcification' : 'Окаменение каналов',
        desc: isEn ? '-25% meditation speed, -15% stamina recovery' : '-25% к скорости медитации, -15% восстановления выносливости',
        badgeClass: 'meridian-badge-calcified'
      };
    }
    return {
      tier: 'crisis',
      name: isEn ? 'Dan Du Crisis' : 'Кризис Дань Ду',
      desc: isEn ? '-40% meditation speed, breakthrough BLOCKED!' : '-40% к скорости медитации, прорыв ЗАБЛОКИРОВАН!',
      badgeClass: 'meridian-badge-crisis'
    };
  }

  function consumePill(s, recipeId) {
    if (!s || !s.alchemy) return false;
    const alc = s.alchemy;
    if (!alc.inventory || (alc.inventory[recipeId] || 0) < 1) return false;
    const r = RECIPES[recipeId];
    if (!r) return false;

    alc.inventory[recipeId]--;
    s.resources.pills = Math.max(0, (s.resources.pills || 1) - 1);

    const isPure = (alc.pureInventory?.[recipeId] || 0) > 0;
    if (isPure) {
      alc.pureInventory[recipeId]--;
    } else {
      addDanDu(s, 4);
    }

    const res = r.apply(s, isPure, false);
    const danDuNoteRu = isPure ? ' (100% чистота Жемчужины, 0 Дань Ду)' : ' (+4 токсина Дань Ду)';
    const danDuNoteEn = isPure ? ' (100% Pearl purity, 0 Dan Du)' : ' (+4 Dan Du toxins)';
    const logRu = isPure 
      ? `【Приём 100% чистой пилюли】 Проглочена пилюля «${r.nameRu}» без примесей! ${res.ru}${danDuNoteRu}`
      : `【Приём пилюли】 Проглочена пилюля «${r.nameRu}». ${res.ru}${danDuNoteRu}`;
    const logEn = isPure
      ? `【Consuming 100% Pure Pill】 Swallowed pure “${r.nameEn}”! ${res.en}${danDuNoteEn}`
      : `【Consuming Pill】 Swallowed “${r.nameEn}”. ${res.en}${danDuNoteEn}`;

    alc.log.unshift({ ru: logRu, en: logEn });
    alc.log = alc.log.slice(0, 10);
    const E = typeof module !== 'undefined' && module.exports ? require('./engine.js') : root.IsekaiEngine;
    if (E && E.log) E.log(s, logRu);
    return true;
  }

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
        const cleansed = cleanseDanDu(s, isPearl ? 12 : 8);
        const purgeNoteRu = cleansed > 0 ? ` Меридианы омыты от токсинов Дань Ду (-${cleansed}).` : '';
        const purgeNoteEn = cleansed > 0 ? ` Meridians cleansed of Dan Du toxins (-${cleansed}).` : '';
        return {
          ru: `Настой ясного сердца принят: Спокойствие +${calmGain}, медитация ускорена!${purgeNoteRu}`,
          en: `Clear Heart Infusion drunk: Calm +${calmGain}, meditation accelerated!${purgeNoteEn}`
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
    },
    century_vitality: {
      id: 'century_vitality',
      nameRu: 'Пилюля Столетней Жизни',
      nameEn: 'Century Vitality Dan',
      descRu: 'Сваренная на вековом чабреце и лазурном клевере, пилюля навсегда расширяет пределы выносливости.',
      descEn: 'Brewed with century thyme and azure clover, this pill permanently expands stamina reserves.',
      icon: '🌿',
      reqLevel: 3,
      ingredients: { aged_mountain_herb: 1, aged_spirit_clover: 1, spring_water: 2 },
      pearlQi: 15,
      effectRu: 'Макс. выносливость навсегда +2.0 (Жемчужина: +3.0)',
      effectEn: 'Max stamina permanently +2.0 (Pearl: +3.0)',
      combatEffectRu: 'В бою: 100% выносливости и барьер 30% HP',
      combatEffectEn: 'In combat: 100% stamina and 30% HP barrier',
      apply(s, isPearl, isCrit) {
        const bonus = isPearl ? 3.0 : (isCrit ? 2.5 : 2.0);
        s.staminaMax = Math.min(250, (s.staminaMax || 100) + bonus);
        s.stamina = s.staminaMax;
        s.resources.pills = (s.resources.pills || 0) + 1;
        const cleansed = cleanseDanDu(s, isPearl ? 20 : 15);
        const purgeNoteRu = cleansed > 0 ? ` Вековой сбор растворил токсины Дань Ду (-${cleansed})!` : '';
        const purgeNoteEn = cleansed > 0 ? ` Century harvest dissolved Dan Du toxins (-${cleansed})!` : '';
        return {
          ru: `Пилюля Столетней Жизни усвоена: макс. выносливость увеличена на +${bonus.toFixed(1)}!${purgeNoteRu}`,
          en: `Century Vitality Dan absorbed: max stamina increased by +${bonus.toFixed(1)}!${purgeNoteEn}`
        };
      }
    },
    iron_dragon_pill: {
      id: 'iron_dragon_pill',
      nameRu: 'Пилюля Кости Железного Дракона',
      nameEn: 'Iron Dragon Pill',
      descRu: 'Сплавление адамантового корня и векового пламени закаляет кости драконьей прочностью.',
      descEn: 'Fusing adamantine root and century flame tempers bones with dragon durability.',
      icon: '🐉',
      reqLevel: 3,
      ingredients: { aged_iron_root: 1, aged_flame_bloom: 1 },
      pearlQi: 20,
      effectRu: 'Тело +0.40, выносл. +40 (Жемчужина: Тело +0.60, выносл. +60)',
      effectEn: 'Body +0.40, stamina +40 (Pearl: Body +0.60, stamina +60)',
      combatEffectRu: 'В бою: чешуя дракона снижает урон на -50% на 3 хода',
      combatEffectEn: 'In combat: dragon scales reduce damage by -50% for 3 turns',
      apply(s, isPearl, isCrit) {
        const bodyGain = isPearl ? 0.60 : (isCrit ? 0.50 : 0.40);
        const stamGain = isPearl ? 60 : 40;
        s.body = Math.min(10 * (s.realm + 1), s.body + bodyGain);
        s.stamina = Math.min((s.staminaMax || 100), s.stamina + stamGain);
        s.resources.pills = (s.resources.pills || 0) + 1;
        return {
          ru: `Пилюля Железного Дракона усвоена: Тело +${bodyGain.toFixed(2)}, выносливость +${stamGain}!`,
          en: `Iron Dragon Pill absorbed: Body +${bodyGain.toFixed(2)}, stamina +${stamGain}!`
        };
      }
    },
    nine_revolutions: {
      id: 'nine_revolutions',
      nameRu: 'Пилюля Девяти Превращений Духа',
      nameEn: 'Nine Revolutions Dan',
      descRu: 'Великое снадобье на священных лепестках хаоса. Дарует прозрение и колоссальный приток истинной ци.',
      descEn: 'Grand elixir of divine chaos petals. Grants breakthrough insight and a colossal surge of true qi.',
      icon: '🌌',
      reqLevel: 4,
      ingredients: { divine_petals: 1, aged_spirit_clover: 1, relic_dust: 1 },
      pearlQi: 25,
      effectRu: 'Понимание +80 XP, Ци +60 (Жемчужина: +120 XP, Ци +90)',
      effectEn: 'Insight +80 XP, Qi +60 (Pearl: +120 XP, Qi +90)',
      combatEffectRu: 'В бою: Ци +60, мгновенный сброс перезарядки техник',
      combatEffectEn: 'In combat: Qi +60, resets technique cooldowns',
      apply(s, isPearl, isCrit) {
        const xpGain = isPearl ? 120 : (isCrit ? 100 : 80);
        const qiGain = isPearl ? 90 : (isCrit ? 75 : 60);
        s.xp = (s.xp || 0) + xpGain;
        s.resources.qi = (s.resources.qi || 0) + qiGain;
        s.resources.pills = (s.resources.pills || 0) + 1;
        return {
          ru: `Пилюля Девяти Превращений усвоена: Понимание +${xpGain} XP, истинная ци +${qiGain}!`,
          en: `Nine Revolutions Dan absorbed: Insight +${xpGain} XP, true qi +${qiGain}!`
        };
      }
    },
    sky_nirvana: {
      id: 'sky_nirvana',
      nameRu: 'Пилюля Нирваны Злого Неба',
      nameEn: 'Sky Poison Nirvana Pill',
      descRu: 'Священный эликсир на лепестках хаоса и очищенном яде. Дарует ярость Злого Бога в боях.',
      descEn: 'Sacred elixir of chaos petals and purified venom. Grants Evil God fury in battle.',
      icon: '⚡',
      reqLevel: 4,
      ingredients: { divine_petals: 1, aged_poison_sac: 1, aged_frost_lotus: 1 },
      pearlQi: 30,
      requiresPearl: true,
      effectRu: 'Ярость Злого Бога на 5 боёв (MAX импульс, урон +50%)',
      effectEn: 'Evil God Fury for 5 battles (MAX momentum, damage +50%)',
      combatEffectRu: 'В бою: макс. урон и 20% вампиризм HP',
      combatEffectEn: 'In combat: max damage and 20% HP vampirism',
      apply(s, isPearl, isCrit) {
        if (!s.alchemy.buffs) s.alchemy.buffs = {};
        const fights = isPearl ? 8 : (isCrit ? 6 : 5);
        s.alchemy.buffs.evilGodFights = (s.alchemy.buffs.evilGodFights || 0) + fights;
        s.resources.pills = (s.resources.pills || 0) + 1;
        return {
          ru: `Пилюля Нирваны принята: Сила Злого Бога пробуждена на следующие ${fights} боёв!`,
          en: `Sky Poison Nirvana Pill consumed: Evil God fury awakened for next ${fights} battles!`
        };
      }
    },
    dragon_vitality: {
      id: 'dragon_vitality',
      nameRu: 'Пилюля Драконьей Жизненной Силы',
      nameEn: 'Dragon Vitality Dan',
      descRu: 'Утерянное снадобье драконьей силы: навсегда увеличивает Тело и выносливость.',
      descEn: 'Lost elixir of dragon might: permanently enhances Body and maximum stamina.',
      icon: '🐉',
      reqLevel: 3,
      ingredients: { iron_root: 2, flame_bloom: 1, spring_water: 1 },
      pearlQi: 20,
      effectRu: 'Тело +0.30, макс. выносл. +5.0 (Жемчужина: Тело +0.50, выносл. +8.0)',
      effectEn: 'Body +0.30, max stamina +5.0 (Pearl: Body +0.50, stamina +8.0)',
      combatEffectRu: 'В бою: 100% HP и щит 40% на 3 хода',
      combatEffectEn: 'In combat: 100% HP and 40% shield for 3 rounds',
      apply(s, isPearl, isCrit) {
        const bodyGain = isPearl ? 0.50 : (isCrit ? 0.40 : 0.30);
        const stamGain = isPearl ? 8.0 : 5.0;
        s.body = Math.min(10 * (s.realm + 1), s.body + bodyGain);
        s.staminaMax = Math.min(300, (s.staminaMax || 100) + stamGain);
        s.stamina = s.staminaMax;
        s.resources.pills = (s.resources.pills || 0) + 1;
        return {
          ru: `Пилюля Драконьей Жизненной Силы усвоена: Тело +${bodyGain.toFixed(2)}, макс. выносливость +${stamGain.toFixed(1)}!`,
          en: `Dragon Vitality Dan absorbed: Body +${bodyGain.toFixed(2)}, max stamina +${stamGain.toFixed(1)}!`
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
      rewardRu: '+35 монет, +1 репутация, +1 семя чабреца, +15 опыта алхимии',
      rewardEn: '+35 coins, +1 reputation, +1 thyme seed, +15 alchemy XP',
      rewardGold: 35,
      rewardRep: 1,
      rewardXp: 15,
      rewardSeed: { mountain_herb_seed: 1 }
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
      rewardRu: '+60 монет, +2 репутации, +2 железы яда, +1 спора яда, +25 опыта',
      rewardEn: '+60 coins, +2 reputation, +2 venom glands, +1 poison spore, +25 XP',
      rewardGold: 60,
      rewardRep: 2,
      rewardXp: 25,
      rewardIngredient: { poison_sac: 2 },
      rewardSeed: { poison_spore: 1 }
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
      rewardRu: '+75 монет, +2 репутации, +1 нефритовая пыль, +1 семя корня, +30 опыта',
      rewardEn: '+75 coins, +2 reputation, +1 jade dust, +1 root seed, +30 XP',
      rewardGold: 75,
      rewardRep: 2,
      rewardXp: 30,
      rewardIngredient: { relic_dust: 1 },
      rewardSeed: { iron_root_seed: 1 }
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
      rewardRu: '+150 монет, +5 репутации, +1 осколок алтаря, +1 семя Хаоса, +50 опыта',
      rewardEn: '+150 coins, +5 reputation, +1 relic shard, +1 Chaos seed, +50 XP',
      rewardGold: 150,
      rewardRep: 5,
      rewardXp: 50,
      rewardRelic: 1,
      rewardSeed: { primordial_seed: 1 }
    },
    vip_xiao_tiannan: {
      id: 'vip_xiao_tiannan',
      isVip: true,
      nameRu: 'Патриарх Сяо Тяньнань (Ветвь Сяо)',
      nameEn: 'Patriarch Xiao Tiannan (Xiao Branch)',
      conditionRu: 'Меридианы сына Сяо Лочэна сокрушены загадочным мастером. Патриарх молит о спасении наследника.',
      conditionEn: 'Son Xiao Luocheng’s meridians crushed by an unknown expert. The Patriarch pleads for his heir.',
      reqPill: 'nine_revolutions',
      pearlAlt: true,
      pearlQi: 35,
      reqPillNameRu: 'Пилюля Девяти Превращений (или исцеление Жемчужиной, 35 Ци)',
      reqPillNameEn: 'Nine Revolutions Dan (or Pearl purge, 35 Qi)',
      rewardRu: '+500 монет, +10 репутации, +2 реликвии, +2 семени Хаоса, +80 опыта',
      rewardEn: '+500 coins, +10 reputation, +2 relics, +2 Chaos seeds, +80 XP',
      rewardGold: 500,
      rewardRep: 10,
      rewardXp: 80,
      rewardRelic: 2,
      rewardSeed: { primordial_seed: 2 }
    },
    vip_pu_he: {
      id: 'vip_pu_he',
      isVip: true,
      nameRu: 'Управляющий Пу Хэ (Палата Чёрной Луны)',
      nameEn: 'Manager Pu He (Black Moon Chamber)',
      conditionRu: 'Ледяной яд сковал даньтянь управляющего. Требуется высшее очищение Жемчужиной или Пилюля Нирваны.',
      conditionEn: 'Frost poison seized the manager’s dantian. Requires supreme Pearl purification or a Sky Nirvana Pill.',
      reqPill: 'sky_nirvana',
      pearlAlt: true,
      pearlQi: 40,
      reqPillNameRu: 'Пилюля Нирваны Злого Неба (или очищение Жемчужиной, 40 Ци)',
      reqPillNameEn: 'Sky Poison Nirvana Pill (or Pearl purge, 40 Qi)',
      rewardRu: '+850 монет, +15 репутации, +3 реликвии, +3 семени Хаоса, +120 опыта',
      rewardEn: '+850 coins, +15 reputation, +3 relics, +3 Chaos seeds, +120 XP',
      rewardGold: 850,
      rewardRep: 15,
      rewardXp: 120,
      rewardRelic: 3,
      rewardSeed: { primordial_seed: 3 }
    },
    vip_elder_ziji: {
      id: 'vip_elder_ziji',
      isVip: true,
      nameRu: 'Старейшина Цзы Цзи (Торговая Палата)',
      nameEn: 'Elder Zi Ji (Merchant Chamber)',
      conditionRu: 'Вековой застой на пике земного царства из-за повреждения вен. Лишь чистая эссенция дракона вернёт силу.',
      conditionEn: 'Century stagnation at peak Earth Realm from vein trauma. Only pure dragon essence can restore vitality.',
      reqPill: 'iron_dragon_pill',
      pearlAlt: true,
      pearlQi: 30,
      reqPillNameRu: 'Пилюля Кости Железного Дракона (или очищение Жемчужиной, 30 Ци)',
      reqPillNameEn: 'Iron Dragon Pill (or Pearl purge, 30 Qi)',
      rewardRu: '+650 монет, +12 репутации, +2 реликвии, +2 семени Хаоса, +100 опыта',
      rewardEn: '+650 coins, +12 reputation, +2 relics, +2 Chaos seeds, +100 XP',
      rewardGold: 650,
      rewardRep: 12,
      rewardXp: 100,
      rewardRelic: 2,
      rewardSeed: { primordial_seed: 2 }
    }
  };

  const BLACK_MOON_VIP_TIERS = {
    iron: {
      id: 'iron',
      nameRu: 'Железная карта Чёрной Луны',
      nameEn: 'Black Moon Iron VIP Card',
      minGold: 0,
      feeRate: 0.15,
      icon: '🪙',
      badgeClass: 'vip-badge-iron',
      descRu: 'Базовая комиссия аукциона: 15%. Доступ к открытым торгам.',
      descEn: 'Standard auction fee: 15%. Access to open bidding.'
    },
    bronze: {
      id: 'bronze',
      nameRu: 'Бронзовая карта Чёрной Луны',
      nameEn: 'Black Moon Bronze VIP Card',
      minGold: 300,
      feeRate: 0.10,
      icon: '🥉',
      badgeClass: 'vip-badge-bronze',
      descRu: 'Сниженная комиссия: 10%. Приветствие управляющего Пу Хэ.',
      descEn: 'Reduced fee: 10%. Commended by Manager Pu He.'
    },
    silver: {
      id: 'silver',
      nameRu: 'Серебряная карта Чёрной Луны',
      nameEn: 'Black Moon Silver VIP Card',
      minGold: 1000,
      feeRate: 0.07,
      icon: '🥈',
      badgeClass: 'vip-badge-silver',
      descRu: 'Сниженная комиссия: 7%. Персональная ложа торгов.',
      descEn: 'Reduced fee: 7%. Private bidding chamber.'
    },
    gold: {
      id: 'gold',
      nameRu: 'Золотая карта Чёрной Луны',
      nameEn: 'Black Moon Gold VIP Card',
      minGold: 3000,
      feeRate: 0.04,
      icon: '🥇',
      badgeClass: 'vip-badge-gold',
      descRu: 'Привилегированная комиссия: 4%. Аукционисты лично кланяются мастеру.',
      descEn: 'Privileged fee: 4%. Auctioneers personally bow to the master.'
    },
    purple: {
      id: 'purple',
      nameRu: 'Пурпурно-Нефритовая карта Чёрной Луны',
      nameEn: 'Black Moon Purple Jade VIP Card',
      minGold: 8000,
      feeRate: 0.02,
      icon: '💎',
      badgeClass: 'vip-badge-purple',
      descRu: 'Высшая карта континента: комиссия 2%! Доступ к закрытой сокровищнице Палаты.',
      descEn: 'Supreme continent card: 2% fee! Unrestricted access to the Chamber’s secret vaults.'
    }
  };

  function getBlackMoonVipTier(totalGold = 0) {
    if (totalGold >= 8000) return BLACK_MOON_VIP_TIERS.purple;
    if (totalGold >= 3000) return BLACK_MOON_VIP_TIERS.gold;
    if (totalGold >= 1000) return BLACK_MOON_VIP_TIERS.silver;
    if (totalGold >= 300) return BLACK_MOON_VIP_TIERS.bronze;
    return BLACK_MOON_VIP_TIERS.iron;
  }

  const AUCTION_CATALOG = {
    recipe_dragon_vitality: {
      id: 'recipe_dragon_vitality',
      nameRu: 'Древний свиток: «Пилюля Драконьей Жизненной Силы»',
      nameEn: 'Ancient Scroll: “Dragon Vitality Dan”',
      descRu: 'Утерянный рецепт секты Горящих Небес. Навсегда повышает Тело и выносливость.',
      descEn: 'Lost recipe of the Burning Heaven Clan. Permanently enhances Body and stamina.',
      costGold: 250,
      type: 'recipe',
      recipeId: 'dragon_vitality',
      icon: '📜'
    },
    spatial_ring: {
      id: 'spatial_ring',
      nameRu: 'Пространственное кольцо Чёрной Луны',
      nameEn: 'Black Moon Spatial Ring',
      descRu: 'Кольцо со складчатым пространством. Расширяет боевую сумку до 4 ячеек!',
      descEn: 'Folded-space ring. Expands combat pouch to 4 slots!',
      costGold: 450,
      type: 'pouch_upgrade',
      icon: '💍'
    },
    primordial_seed_lot: {
      id: 'primordial_seed_lot',
      nameRu: 'Лот Небесных Семян (3 шт.)',
      nameEn: 'Primordial Seed Lot (3 pcs)',
      descRu: 'Редчайшие семена из глубин Первобытного Леса для сада Жемчужины.',
      descEn: 'Rarest seeds from the Primordial Forest depths for the Pearl garden.',
      costGold: 350,
      type: 'seeds',
      seeds: { primordial_seed: 3 },
      icon: '🌱'
    },
    star_jade_cauldron: {
      id: 'star_jade_cauldron',
      nameRu: 'Котёл Звёздного Нефрита',
      nameEn: 'Star Jade Cauldron',
      descRu: 'Древний артефактный котёл: снижает шанс неудачи варки до 0% и дарует +20% к криту!',
      descEn: 'Ancient artifact crucible: eliminates crucible failures (0%) and grants +20% crit chance!',
      costGold: 600,
      type: 'cauldron_upgrade',
      icon: '🏺'
    }
  };

  const AUCTION_BIDDERS = [
    {
      id: 'xiao_scion',
      nameRu: 'Молодой мастер Сяо',
      nameEn: 'Young Master Xiao',
      quoteRu: '«Ничтожества! Никто в Городе Нового Месяца не посмеет спорить о богатстве с сектой Сяо! Я поднимаю цену!»',
      quoteEn: '“Fools! No one in New Moon City dares dispute wealth with the Xiao Sect! I raise the bid!”'
    },
    {
      id: 'blaze_elder',
      nameRu: 'Старейшина Пылающих Небес',
      nameEn: 'Burning Heaven Elder',
      quoteRu: '«Такая чистота эссенции?! Без малейшего следа токсинов Дань Ду?! Этот лот должен стать достоянием наших учеников!»',
      quoteEn: '“Such essence purity?! Without a shred of Dan Du toxins?! This lot must belong to our disciples!”'
    },
    {
      id: 'iron_master',
      nameRu: 'Глава Палаты Железного Бастиона',
      nameEn: 'Iron Bastion Chamber Master',
      quoteRu: '«Сяо, придержи язык! Караваны Железного Бастиона не считают медяки. Я удваиваю предложение!»',
      quoteEn: '“Xiao, hold your tongue! Iron Bastion caravans don’t pinch coppers. I double the offer!”'
    },
    {
      id: 'imperial_envoy',
      nameRu: 'Посланник Императорской Семьи',
      nameEn: 'Imperial Palace Envoy',
      quoteRu: '«Его Императорское Величество высоко оценит такое сокровище. Палата Чёрной Луны, запишите лот за мной!»',
      quoteEn: '“His Imperial Majesty will prize such treasure. Black Moon Chamber, record this lot under my name!”'
    },
    {
      id: 'cloud_merchant',
      nameRu: 'Купец Гильдии Золотого Шелка',
      nameEn: 'Golden Silk Merchant Guildmaster',
      quoteRu: '«Мои склады ломятся от золота. Назовите вашу цену, почтенный аукционист, я беру всё!»',
      quoteEn: '“My vaults overflow with gold. Name your price, honored auctioneer, I take it all!”'
    }
  ];

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
        evil_god_pill: 0,
        century_vitality: 0,
        iron_dragon_pill: 0,
        nine_revolutions: 0,
        sky_nirvana: 0,
        dragon_vitality: 0
      },
      pureInventory: {
        vigor_broth: 0,
        body_pill: 0,
        calm_tea: 0,
        breakthrough_pill: 0,
        evil_god_pill: 0,
        century_vitality: 0,
        iron_dragon_pill: 0,
        nine_revolutions: 0,
        sky_nirvana: 0,
        dragon_vitality: 0
      },
      pouch: ['vigor_broth', null, null],
      patients: ['ba_strained', 'hunter_poison'],
      forageCooldown: 0,
      maskUnlocked: false,
      maskActive: false,
      blackMoon: {
        unlocked: false,
        vipTier: 'iron',
        totalAuctionGold: 0,
        activeAuction: null,
        catalogPurchased: [],
        cauldronUpgrade: false,
        pouchUpgrade: false
      },
      ingredients: {
        mountain_herb: 5,
        spring_water: 3,
        spirit_clover: 2,
        iron_root: 0,
        frost_lotus: 0,
        flame_bloom: 0,
        relic_dust: 0,
        poison_sac: 0,
        aged_mountain_herb: 0,
        aged_spirit_clover: 0,
        aged_iron_root: 0,
        aged_frost_lotus: 0,
        aged_flame_bloom: 0,
        aged_poison_sac: 0,
        divine_petals: 0
      },
      garden: {
        unlockedPlots: 2,
        dew: 1,
        dewMax: 5,
        dewProgress: 0,
        seeds: {
          mountain_herb_seed: 2,
          spirit_clover_seed: 1,
          iron_root_seed: 0,
          frost_lotus_seed: 0,
          flame_bloom_seed: 0,
          poison_spore: 0,
          primordial_seed: 0
        },
        plots: [
          { id: 0, seed: null, growthSeconds: 0, watered: false, infused: false },
          { id: 1, seed: null, growthSeconds: 0, watered: false, infused: false },
          { id: 2, seed: null, growthSeconds: 0, watered: false, infused: false },
          { id: 3, seed: null, growthSeconds: 0, watered: false, infused: false },
          { id: 4, seed: null, growthSeconds: 0, watered: false, infused: false },
          { id: 5, seed: null, growthSeconds: 0, watered: false, infused: false }
        ],
        stats: {
          planted: 0,
          harvested: 0,
          centuryHarvested: 0,
          millenniumMutations: 0,
          dewUsed: 0,
          qiInfused: 0
        }
      },
      buffs: {
        evilGodFights: 0,
        meditationBoostUntil: 0
      },
      meridians: {
        danDu: 0,
        purity: 100,
        totalCleansed: 0,
        pearlPurges: 0
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

    if (input.pureInventory && typeof input.pureInventory === 'object') {
      for (const k of Object.keys(base.pureInventory)) {
        base.pureInventory[k] = Math.max(0, Math.floor(input.pureInventory[k] || 0));
      }
    }

    base.maskUnlocked = !!(input.maskUnlocked || (input.level && input.level >= 2) || (input.stage && input.stage >= 1));
    base.maskActive = !!(input.maskActive && base.maskUnlocked);

    if (input.blackMoon && typeof input.blackMoon === 'object') {
      base.blackMoon.unlocked = !!input.blackMoon.unlocked;
      base.blackMoon.totalAuctionGold = Math.max(0, Math.floor(input.blackMoon.totalAuctionGold || 0));
      base.blackMoon.vipTier = getBlackMoonVipTier(base.blackMoon.totalAuctionGold).id;
      base.blackMoon.cauldronUpgrade = !!input.blackMoon.cauldronUpgrade;
      base.blackMoon.pouchUpgrade = !!input.blackMoon.pouchUpgrade;
      if (Array.isArray(input.blackMoon.catalogPurchased)) {
        base.blackMoon.catalogPurchased = [...new Set(input.blackMoon.catalogPurchased.filter(k => Object.hasOwn(AUCTION_CATALOG, k)))];
      }
      if (input.blackMoon.activeAuction && typeof input.blackMoon.activeAuction === 'object') {
        const a = input.blackMoon.activeAuction;
        if (a.recipeId && Object.hasOwn(RECIPES, a.recipeId)) {
          base.blackMoon.activeAuction = {
            recipeId: a.recipeId,
            count: Math.max(1, Math.floor(a.count || 1)),
            isPure: !!a.isPure,
            basePrice: Math.max(1, Math.floor(a.basePrice || 1)),
            currentBid: Math.max(1, Math.floor(a.currentBid || 1)),
            round: Math.max(1, Math.min(5, Math.floor(a.round || 1))),
            maxRounds: Math.max(2, Math.min(5, Math.floor(a.maxRounds || 3))),
            highestBidderRu: String(a.highestBidderRu || '').slice(0, 80),
            highestBidderEn: String(a.highestBidderEn || '').slice(0, 80),
            bidHistory: Array.isArray(a.bidHistory) ? a.bidHistory.slice(0, 10).map(bh => ({
              round: Math.floor(bh.round || 1),
              bidderRu: String(bh.bidderRu || '').slice(0, 80),
              bidderEn: String(bh.bidderEn || '').slice(0, 80),
              amount: Math.max(1, Math.floor(bh.amount || 1)),
              quoteRu: String(bh.quoteRu || '').slice(0, 200),
              quoteEn: String(bh.quoteEn || '').slice(0, 200)
            })) : [],
            settled: !!a.settled
          };
        }
      }
    }

    if (Array.isArray(input.pouch)) {
      const pLen = base.blackMoon.pouchUpgrade ? 4 : 3;
      base.pouch = [];
      for (let i = 0; i < pLen; i++) {
        const item = input.pouch[i];
        if (item && Object.hasOwn(RECIPES, item)) {
          base.pouch.push(item);
        } else if (i === 0 && item !== null) {
          base.pouch.push('vigor_broth');
        } else {
          base.pouch.push(null);
        }
      }
    } else if (base.blackMoon.pouchUpgrade && base.pouch.length < 4) {
      base.pouch.push(null);
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

    if (input.garden && typeof input.garden === 'object') {
      base.garden.unlockedPlots = Math.max(2, Math.min(6, Math.floor(input.garden.unlockedPlots || 2)));
      base.garden.dew = Math.max(0, Math.min(5, Math.floor(input.garden.dew !== undefined ? input.garden.dew : 1)));
      base.garden.dewMax = 5;
      base.garden.dewProgress = Math.max(0, Math.min(1800, Number(input.garden.dewProgress) || 0));

      if (input.garden.seeds && typeof input.garden.seeds === 'object') {
        for (const k of Object.keys(SEEDS)) {
          base.garden.seeds[k] = Math.max(0, Math.floor(input.garden.seeds[k] || 0));
        }
      }

      if (Array.isArray(input.garden.plots)) {
        base.garden.plots = base.garden.plots.map((dp, idx) => {
          const inp = input.garden.plots[idx];
          if (!inp || typeof inp !== 'object') return dp;
          const validSeed = inp.seed && Object.hasOwn(SEEDS, inp.seed) ? inp.seed : null;
          return {
            id: idx,
            seed: validSeed,
            growthSeconds: Math.max(0, Number(inp.growthSeconds) || 0),
            watered: !!inp.watered,
            infused: !!inp.infused
          };
        });
      }

      if (input.garden.stats && typeof input.garden.stats === 'object') {
        for (const k of ['planted', 'harvested', 'centuryHarvested', 'millenniumMutations', 'dewUsed', 'qiInfused']) {
          base.garden.stats[k] = Math.max(0, Math.floor(input.garden.stats[k] || 0));
        }
      }
    }

    if (input.buffs && typeof input.buffs === 'object') {
      base.buffs.evilGodFights = Math.max(0, Math.floor(input.buffs.evilGodFights || 0));
      base.buffs.meditationBoostUntil = Math.max(0, Math.floor(input.buffs.meditationBoostUntil || 0));
    }

    if (input.meridians && typeof input.meridians === 'object') {
      base.meridians.danDu = Math.max(0, Math.min(100, Math.floor(input.meridians.danDu || 0)));
      base.meridians.purity = Math.max(0, Math.min(100, Math.floor(input.meridians.purity !== undefined ? input.meridians.purity : (100 - base.meridians.danDu))));
      base.meridians.totalCleansed = Math.max(0, Math.floor(input.meridians.totalCleansed || 0));
      base.meridians.pearlPurges = Math.max(0, Math.floor(input.meridians.pearlPurges || 0));
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
        const hasCauldronUpgrade = !!alc.blackMoon?.cauldronUpgrade;
        const rankBonus = (alc.level >= 2) ? 0.10 : 0;
        const baseChance = hasCauldronUpgrade ? 1.0 : Math.min(0.95, 0.70 + (alc.level - r.reqLevel) * 0.05 + rankBonus);
        const roll = Math.random();
        const critBonus = hasCauldronUpgrade ? 0.20 : 0;
        const critThreshold = alc.level >= 5 ? 1.0 : (0.15 + critBonus);

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
        if (isPearl) {
          if (!alc.pureInventory) alc.pureInventory = fresh().pureInventory;
          alc.pureInventory[recipeId] = (alc.pureInventory[recipeId] || 0) + 1;
        } else {
          addDanDu(s, isCrit ? 2 : 4);
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
      const prices = {
        body_pill: 35,
        calm_tea: 45,
        breakthrough_pill: 80,
        century_vitality: 120,
        iron_dragon_pill: 180,
        nine_revolutions: 350,
        sky_nirvana: 500
      };
      const price = prices[recId] || 80;
      if (s.resources.gold < price) return false;
      s.resources.gold -= price;
      s.alchemy.unlockedRecipes.push(recId);
      s.alchemy.log.unshift({
        ru: `Куплен рецепт: «${r.nameRu}» у аптекаря Хо за ${price} монет.`,
        en: `Purchased recipe: “${r.nameEn}” from Apothecary Huo for ${price} coins.`
      });
      return true;
    }

    if (SEEDS[itemId]) {
      const seed = SEEDS[itemId];
      const totalCost = seed.cost * count;
      if (s.resources.gold < totalCost) return false;
      s.resources.gold -= totalCost;
      if (!s.alchemy.garden) s.alchemy.garden = fresh().garden;
      s.alchemy.garden.seeds[itemId] = (s.alchemy.garden.seeds[itemId] || 0) + count;
      s.alchemy.log.unshift({
        ru: `Куплено ${count} шт. семян «${seed.nameRu}» у мастера Хо за ${totalCost} монет.`,
        en: `Purchased ${count} “${seed.nameEn}” seeds from Master Huo for ${totalCost} coins.`
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
      if (s.alchemy && s.alchemy.pureInventory) {
        let remaining = count;
        for (const recId of Object.keys(s.alchemy.pureInventory)) {
          const has = s.alchemy.pureInventory[recId] || 0;
          const take = Math.min(has, remaining);
          s.alchemy.pureInventory[recId] -= take;
          remaining -= take;
          if (remaining <= 0) break;
        }
      }
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

    let seedFound = null;
    const seedChances = {
      village: { id: 'mountain_herb_seed', chance: 0.40 },
      forest: { id: 'spirit_clover_seed', chance: 0.30 },
      pass: { id: 'iron_root_seed', chance: 0.35 },
      ruins: { id: 'flame_bloom_seed', chance: 0.35 },
      city: { id: 'spirit_clover_seed', chance: 0.30 }
    };
    const sc = seedChances[locKey] || seedChances.village;
    if (sc && Math.random() < sc.chance && SEEDS[sc.id]) {
      if (!alc.garden) alc.garden = fresh().garden;
      alc.garden.seeds[sc.id] = (alc.garden.seeds[sc.id] || 0) + 1;
      seedFound = SEEDS[sc.id];
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
    const seedRu = seedFound ? ` Найдено семя: ${seedFound.icon} ${seedFound.nameRu}!` : '';
    const seedEn = seedFound ? ` Seed found: ${seedFound.icon} ${seedFound.nameEn}!` : '';

    alc.log.unshift({
      ru: `【Сбор трав · ${table.nameRu}】 Найдено: ${itemsRu}.${rareRu}${seedRu} (+10 опыта)`,
      en: `【Herb Foraging · ${table.nameEn}】 Gathered: ${itemsEn}.${rareEn}${seedEn} (+10 XP)`
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

    // Grant rewards (with +25% bonus under Miracle Doctor Mask disguise)
    const maskBonus = alc.maskActive ? 1.25 : 1.0;
    const goldEarned = Math.round((patient.rewardGold || 0) * maskBonus);
    const repEarned = Math.round((patient.rewardRep || 0) * maskBonus);

    s.resources.gold += goldEarned;
    s.resources.reputation = (s.resources.reputation || 0) + repEarned;
    if (patient.rewardRelic) {
      s.resources.relics = (s.resources.relics || 0) + patient.rewardRelic;
    }
    if (patient.rewardIngredient) {
      for (const [k, v] of Object.entries(patient.rewardIngredient)) {
        alc.ingredients[k] = (alc.ingredients[k] || 0) + v;
      }
    }
    if (patient.rewardSeed) {
      if (!alc.garden) alc.garden = fresh().garden;
      for (const [k, v] of Object.entries(patient.rewardSeed)) {
        alc.garden.seeds[k] = (alc.garden.seeds[k] || 0) + v;
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
    const unserved = allPatientKeys.filter(p => {
      if (p === patientId || alc.patients.includes(p)) return false;
      if (PATIENTS[p].isVip && !alc.maskActive) return false;
      return true;
    });
    if (unserved.length > 0) {
      alc.patients.push(unserved[0]);
    } else if (alc.patients.length === 0) {
      alc.patients = ['ba_strained', 'hunter_poison'];
    }

    const docTitleRu = alc.maskActive ? 'Божественный Лекарь Хуанфу Хэ' : 'Лекарь с Небес';
    const docTitleEn = alc.maskActive ? 'Miracle Doctor Huangfu He' : 'Miracle Doctor';

    const logRu = usePearl
      ? `【${docTitleRu} · Очищение Жемчужиной】 «${patient.nameRu}» исцелен без токсинов! Получено: +${goldEarned} монет, +${repEarned} репутации, +${patient.rewardXp} опыта.`
      : `【${docTitleRu}】 Снадобье «${patient.reqPillNameRu}» исцелило «${patient.nameRu}»! Получено: +${goldEarned} монет, +${repEarned} репутации, +${patient.rewardXp} опыта.`;

    const logEn = usePearl
      ? `【${docTitleEn} · Pearl Purge】 “${patient.nameEn}” cured without impurities! Received: +${goldEarned} coins, +${repEarned} rep, +${patient.rewardXp} XP.`
      : `【${docTitleEn} Clinic】 Remedy “${patient.reqPillNameEn}” healed “${patient.nameEn}”! Received: +${goldEarned} coins, +${repEarned} rep, +${patient.rewardXp} XP.`;

    alc.log.unshift({ ru: logRu, en: logEn });
    alc.log = alc.log.slice(0, 10);
    if (E && E.log) E.log(s, `Клиника: ${patient.nameRu} исцелен (+${goldEarned} монет, +${repEarned} реп.)`);
    return true;
  }

  function equipPouch(s, recipeId, slotIndex = 0) {
    if (!s || !s.alchemy) return false;
    const maxSlot = s.alchemy.blackMoon?.pouchUpgrade ? 3 : 2;
    slotIndex = Math.max(0, Math.min(maxSlot, Math.floor(slotIndex)));
    const targetLen = s.alchemy.blackMoon?.pouchUpgrade ? 4 : 3;
    if (!Array.isArray(s.alchemy.pouch)) s.alchemy.pouch = ['vigor_broth', null, null];
    while (s.alchemy.pouch.length < targetLen) s.alchemy.pouch.push(null);

    if (!recipeId || recipeId === 'none') {
      s.alchemy.pouch[slotIndex] = null;
      return true;
    }
    if (!RECIPES[recipeId]) return false;
    s.alchemy.pouch[slotIndex] = recipeId;
    return true;
  }

  function isMaskUnlocked(s) {
    if (!s || !s.alchemy) return false;
    return !!(s.alchemy.maskUnlocked || s.alchemy.level >= 2 || (s.stage || 0) >= 1);
  }

  function canToggleMask(s) {
    return isMaskUnlocked(s);
  }

  function toggleMask(s, E = null) {
    if (!canToggleMask(s)) return false;
    const alc = s.alchemy;
    alc.maskUnlocked = true;
    alc.maskActive = !alc.maskActive;

    if (alc.maskActive) {
      // Add VIP patients if not present
      for (const pId of ['vip_xiao_tiannan', 'vip_pu_he', 'vip_elder_ziji']) {
        if (!alc.patients.includes(pId)) {
          alc.patients.push(pId);
        }
      }
    }

    const logRu = alc.maskActive
      ? '🎭 Маска Божественного Лекаря надета! Ты принимаешь облик легендарного мастера Хуанфу Хэ. Знатные кланы трепещут перед твоим искусством.'
      : '🎭 Маска снята. Твоя истинная личность вновь открыта миру.';
    const logEn = alc.maskActive
      ? '🎭 Mask of the Divine Doctor donned! You assume the persona of Grandmaster Huangfu He. Noble clans revere your transcendent craft.'
      : '🎭 Mask removed. Your true identity is revealed to the world once more.';

    alc.log.unshift({ ru: logRu, en: logEn });
    alc.log = alc.log.slice(0, 10);
    if (E && E.log) E.log(s, logRu);
    return true;
  }

  function canAccessAuction(s) {
    if (!s || !s.alchemy) return false;
    return !!(s.stage >= 1 || s.world?.location === 'city' || s.alchemy.level >= 2 || s.alchemy.blackMoon?.unlocked || s.alchemy.maskActive);
  }

  function canStartAuction(s, recipeId, count = 1, usePure = false) {
    if (!canAccessAuction(s)) return false;
    const alc = s.alchemy;
    if (!alc.blackMoon) alc.blackMoon = fresh().blackMoon;
    if (alc.blackMoon.activeAuction && !alc.blackMoon.activeAuction.settled) return false;
    if (!RECIPES[recipeId]) return false;
    count = Math.max(1, Math.floor(count));
    if ((alc.inventory?.[recipeId] || 0) < count) return false;
    if (usePure && (alc.pureInventory?.[recipeId] || 0) < count) return false;
    return true;
  }

  function startAuction(s, recipeId, count = 1, usePure = false, E = null) {
    if (!canStartAuction(s, recipeId, count, usePure)) return false;
    const alc = s.alchemy;
    const r = RECIPES[recipeId];
    count = Math.max(1, Math.floor(count));

    // Deduct inventory
    alc.inventory[recipeId] -= count;
    if (usePure) {
      alc.pureInventory[recipeId] -= count;
    }
    s.resources.pills = Math.max(0, (s.resources.pills || count) - count);

    // Calculate initial bid
    const baseUnit = REGIONAL_MARKETS.city?.buys?.[recipeId] || 40;
    const pureMult = usePure ? 3.5 : 1.0;
    const maskMult = alc.maskActive ? 1.25 : 1.0;
    const startBid = Math.round(baseUnit * count * pureMult * maskMult);

    const firstBidder = AUCTION_BIDDERS[0];
    alc.blackMoon.activeAuction = {
      recipeId,
      count,
      isPure: !!usePure,
      basePrice: startBid,
      currentBid: startBid,
      round: 1,
      maxRounds: 3,
      highestBidderRu: firstBidder.nameRu,
      highestBidderEn: firstBidder.nameEn,
      bidHistory: [
        {
          round: 1,
          bidderRu: firstBidder.nameRu,
          bidderEn: firstBidder.nameEn,
          amount: startBid,
          quoteRu: firstBidder.quoteRu,
          quoteEn: firstBidder.quoteEn
        }
      ],
      settled: false
    };

    const pureTagRu = usePure ? ' (100% чистота Жемчужины)' : '';
    const pureTagEn = usePure ? ' (100% Pearl purity)' : '';
    const logRu = `🏛 Палата Чёрной Луны: ${count} шт. «${r.nameRu}»${pureTagRu} выставлены на торги! Начальная ставка: ${startBid} монет (${firstBidder.nameRu}).`;
    const logEn = `🏛 Black Moon Chamber: ${count}x “${r.nameEn}”${pureTagEn} listed for auction! Opening bid: ${startBid} coins (${firstBidder.nameEn}).`;

    alc.log.unshift({ ru: logRu, en: logEn });
    alc.log = alc.log.slice(0, 10);
    if (E && E.log) E.log(s, logRu);
    return true;
  }

  function canAuctionStep(s) {
    if (!s || !s.alchemy?.blackMoon) return false;
    const a = s.alchemy.blackMoon.activeAuction;
    if (!a || a.settled) return false;
    return a.round < a.maxRounds;
  }

  function auctionStep(s, E = null) {
    if (!canAuctionStep(s)) return false;
    const alc = s.alchemy;
    const a = alc.blackMoon.activeAuction;
    a.round++;

    const bidderIndex = (a.round - 1) % AUCTION_BIDDERS.length;
    const bidder = AUCTION_BIDDERS[bidderIndex];
    const escalation = 1.35 + (a.round * 0.1);
    const newBid = Math.round(a.currentBid * escalation);

    a.currentBid = newBid;
    a.highestBidderRu = bidder.nameRu;
    a.highestBidderEn = bidder.nameEn;
    a.bidHistory.push({
      round: a.round,
      bidderRu: bidder.nameRu,
      bidderEn: bidder.nameEn,
      amount: newBid,
      quoteRu: bidder.quoteRu,
      quoteEn: bidder.quoteEn
    });

    if (a.round >= a.maxRounds) {
      a.settled = true;
    }

    const logRu = `🔨 Раунд ${a.round}/${a.maxRounds}: ${bidder.nameRu} поднимает ставку до ${newBid} монет!`;
    const logEn = `🔨 Round ${a.round}/${a.maxRounds}: ${bidder.nameEn} raises the bid to ${newBid} coins!`;
    alc.log.unshift({ ru: logRu, en: logEn });
    alc.log = alc.log.slice(0, 10);
    if (E && E.log) E.log(s, logRu);
    return true;
  }

  function canAuctionCollect(s) {
    if (!s || !s.alchemy?.blackMoon) return false;
    const a = s.alchemy.blackMoon.activeAuction;
    return !!(a && a.settled);
  }

  function auctionCollect(s, E = null) {
    if (!canAuctionCollect(s)) return false;
    const alc = s.alchemy;
    const a = alc.blackMoon.activeAuction;
    const tier = getBlackMoonVipTier(alc.blackMoon.totalAuctionGold);
    const fee = Math.round(a.currentBid * tier.feeRate);
    const netPayout = a.currentBid - fee;

    s.resources.gold += netPayout;
    alc.blackMoon.totalAuctionGold += a.currentBid;
    alc.blackMoon.vipTier = getBlackMoonVipTier(alc.blackMoon.totalAuctionGold).id;
    alc.stats.pillsTraded = (alc.stats.pillsTraded || 0) + a.count;

    const r = RECIPES[a.recipeId];
    const rNameRu = r ? r.nameRu : a.recipeId;
    const rNameEn = r ? r.nameEn : a.recipeId;

    const logRu = `🏛 Торги завершены! ${a.count} шт. «${rNameRu}» проданы с молотка за ${a.currentBid} монет (${a.highestBidderRu}). Комиссия палаты (${Math.round(tier.feeRate * 100)}%): -${fee}. Получено: +${netPayout} чистого золота!`;
    const logEn = `🏛 Auction concluded! ${a.count}x “${rNameEn}” hammered down for ${a.currentBid} coins (${a.highestBidderEn}). Chamber fee (${Math.round(tier.feeRate * 100)}%): -${fee}. Received: +${netPayout} net gold!`;

    alc.log.unshift({ ru: logRu, en: logEn });
    alc.log = alc.log.slice(0, 10);
    if (E && E.log) E.log(s, logRu);

    alc.blackMoon.activeAuction = null;
    return true;
  }

  function canBuyAuctionLot(s, lotId) {
    if (!canAccessAuction(s)) return false;
    const lot = AUCTION_CATALOG[lotId];
    if (!lot) return false;
    const alc = s.alchemy;
    if (!alc.blackMoon) alc.blackMoon = fresh().blackMoon;
    if (['recipe', 'pouch_upgrade', 'cauldron_upgrade'].includes(lot.type)) {
      if (alc.blackMoon.catalogPurchased.includes(lotId)) return false;
    }
    return (s.resources.gold || 0) >= lot.costGold;
  }

  function buyAuctionLot(s, lotId, E = null) {
    if (!canBuyAuctionLot(s, lotId)) return false;
    const alc = s.alchemy;
    const lot = AUCTION_CATALOG[lotId];

    s.resources.gold -= lot.costGold;
    alc.blackMoon.catalogPurchased.push(lotId);

    if (lot.type === 'recipe') {
      if (!alc.unlockedRecipes.includes(lot.recipeId)) {
        alc.unlockedRecipes.push(lot.recipeId);
      }
    } else if (lot.type === 'pouch_upgrade') {
      alc.blackMoon.pouchUpgrade = true;
      if (!Array.isArray(alc.pouch)) alc.pouch = ['vigor_broth', null, null];
      while (alc.pouch.length < 4) alc.pouch.push(null);
    } else if (lot.type === 'cauldron_upgrade') {
      alc.blackMoon.cauldronUpgrade = true;
    } else if (lot.type === 'seeds') {
      if (!alc.garden) alc.garden = fresh().garden;
      for (const [seedId, count] of Object.entries(lot.seeds)) {
        alc.garden.seeds[seedId] = (alc.garden.seeds[seedId] || 0) + count;
      }
    }

    const logRu = `📜 Приобретено на аукционе: «${lot.nameRu}» (-${lot.costGold} монет).`;
    const logEn = `📜 Purchased at auction: “${lot.nameEn}” (-${lot.costGold} coins).`;
    alc.log.unshift({ ru: logRu, en: logEn });
    alc.log = alc.log.slice(0, 10);
    if (E && E.log) E.log(s, logRu);
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

  function getPlotStage(plot) {
    if (!plot || !plot.seed || !SEEDS[plot.seed]) {
      return { stage: 'empty', progress: 0, progressPercent: 0, labelRu: 'Пустая делянка', labelEn: 'Empty plot', nextTime: 0 };
    }
    const seed = SEEDS[plot.seed];
    const T = seed.matureTime;
    const t = plot.growthSeconds || 0;

    if (t < T) {
      const pct = Math.floor((t / T) * 100);
      return {
        stage: 'sprout',
        progress: t,
        progressPercent: pct,
        labelRu: '🌱 Росток',
        labelEn: '🌱 Sprout',
        nextTime: Math.max(0, Math.ceil(T - t))
      };
    }
    if (t < 3 * T) {
      const pct = Math.min(100, Math.floor(((t - T) / (2 * T)) * 100));
      return {
        stage: 'mature',
        progress: t,
        progressPercent: pct,
        labelRu: '🌿 Зрелая трава (10 лет)',
        labelEn: '🌿 Mature Herb (10y)',
        nextTime: Math.max(0, Math.ceil(3 * T - t))
      };
    }
    if (t < 8 * T) {
      const pct = Math.min(100, Math.floor(((t - 3 * T) / (5 * T)) * 100));
      return {
        stage: 'century',
        progress: t,
        progressPercent: pct,
        labelRu: '✨ Вековой реликт (100 лет)',
        labelEn: '✨ Century Relic (100y)',
        nextTime: Math.max(0, Math.ceil(8 * T - t))
      };
    }
    return {
      stage: 'millennium',
      progress: t,
      progressPercent: 100,
      labelRu: '🌌 Тысячелетняя мутация (1000 лет)',
      labelEn: '🌌 Millennium Mutation (1000y)',
      nextTime: 0
    };
  }

  function canPlant(s, plotIndex, seedId) {
    if (!s || !s.alchemy || !s.alchemy.garden) return false;
    const g = s.alchemy.garden;
    plotIndex = Math.floor(plotIndex);
    if (plotIndex < 0 || plotIndex >= g.unlockedPlots) return false;
    const plot = g.plots[plotIndex];
    if (!plot || plot.seed) return false;
    if (!SEEDS[seedId] || (g.seeds[seedId] || 0) < 1) return false;
    return true;
  }

  function plant(s, plotIndex, seedId, E = null) {
    if (!canPlant(s, plotIndex, seedId)) return false;
    const g = s.alchemy.garden;
    const plot = g.plots[plotIndex];
    const seed = SEEDS[seedId];

    g.seeds[seedId]--;
    plot.seed = seedId;
    plot.growthSeconds = 0;
    plot.watered = false;
    plot.infused = false;
    g.stats.planted = (g.stats.planted || 0) + 1;

    const logRu = `🌱 Семя «${seed.nameRu}» бережно посажено в делянку #${plotIndex + 1}. Изначальный Хаос питает росток.`;
    const logEn = `🌱 Seed “${seed.nameEn}” planted in plot #${plotIndex + 1}. Primordial Chaos nourishes the sprout.`;
    s.alchemy.log.unshift({ ru: logRu, en: logEn });
    s.alchemy.log = s.alchemy.log.slice(0, 10);
    if (E && E.log) E.log(s, `Сад Жемчужины: посажено семя «${seed.nameRu}».`);
    return true;
  }

  function canWater(s, plotIndex) {
    if (!s || !s.alchemy || !s.alchemy.garden) return false;
    const g = s.alchemy.garden;
    plotIndex = Math.floor(plotIndex);
    if (plotIndex < 0 || plotIndex >= g.unlockedPlots) return false;
    const plot = g.plots[plotIndex];
    if (!plot || !plot.seed || plot.watered) return false;
    return (g.dew || 0) >= 1;
  }

  function waterPlot(s, plotIndex, E = null) {
    if (!canWater(s, plotIndex)) return false;
    const g = s.alchemy.garden;
    const plot = g.plots[plotIndex];

    g.dew = Math.max(0, g.dew - 1);
    plot.watered = true;
    plot.growthSeconds += 3600; // instant +1 hr growth
    g.stats.dewUsed = (g.stats.dewUsed || 0) + 1;

    const logRu = `💧 Капля Живительной Росы оросила делянку #${plotIndex + 1}! Рост ускорен на +50%, добавлено +1 час развития.`;
    const logEn = `💧 Pearl Dew Drop watered plot #${plotIndex + 1}! Growth rate boosted by +50%, +1 hr growth added.`;
    s.alchemy.log.unshift({ ru: logRu, en: logEn });
    s.alchemy.log = s.alchemy.log.slice(0, 10);
    if (E && E.log) E.log(s, `Сад Жемчужины: делянка #${plotIndex + 1} орошена росой.`);
    return true;
  }

  function canInfuse(s, plotIndex) {
    if (!s || !s.alchemy || !s.alchemy.garden) return false;
    const g = s.alchemy.garden;
    plotIndex = Math.floor(plotIndex);
    if (plotIndex < 0 || plotIndex >= g.unlockedPlots) return false;
    const plot = g.plots[plotIndex];
    if (!plot || !plot.seed) return false;
    return (s.resources.qi || 0) >= 15;
  }

  function infusePlot(s, plotIndex, E = null) {
    if (!canInfuse(s, plotIndex)) return false;
    const g = s.alchemy.garden;
    const plot = g.plots[plotIndex];

    s.resources.qi = Math.max(0, (s.resources.qi || 0) - 15);
    plot.infused = true;
    plot.growthSeconds += 1800; // instant +30 min
    g.stats.qiInfused = (g.stats.qiInfused || 0) + 1;

    const logRu = `⚡ Вливание 15 Истинной Ци в делянку #${plotIndex + 1}! Корни вобрали силу (+30 минут роста).`;
    const logEn = `⚡ Infused 15 True Qi into plot #${plotIndex + 1}! Roots absorbed divine energy (+30 min growth).`;
    s.alchemy.log.unshift({ ru: logRu, en: logEn });
    s.alchemy.log = s.alchemy.log.slice(0, 10);
    if (E && E.log) E.log(s, `Сад Жемчужины: в делянку #${plotIndex + 1} влита Ци.`);
    return true;
  }

  function canHarvest(s, plotIndex) {
    if (!s || !s.alchemy || !s.alchemy.garden) return false;
    const g = s.alchemy.garden;
    plotIndex = Math.floor(plotIndex);
    if (plotIndex < 0 || plotIndex >= g.unlockedPlots) return false;
    const plot = g.plots[plotIndex];
    if (!plot || !plot.seed || !SEEDS[plot.seed]) return false;
    return (plot.growthSeconds || 0) >= SEEDS[plot.seed].matureTime;
  }

  function harvest(s, plotIndex, E = null) {
    if (!canHarvest(s, plotIndex)) return false;
    const alc = s.alchemy;
    const g = alc.garden;
    const plot = g.plots[plotIndex];
    const seed = SEEDS[plot.seed];
    const stageInfo = getPlotStage(plot);
    const stage = stageInfo.stage;

    let xpGain = 15;
    let normalYield = 2;
    let agedYield = 0;
    let seedReturn = 0;
    let divineYield = 0;
    let relicDustYield = 0;

    if (stage === 'mature') {
      normalYield = 2 + (Math.random() < 0.5 ? 1 : 0);
      seedReturn = Math.random() < 0.35 ? 1 : 0;
      xpGain = 15;
    } else if (stage === 'century') {
      normalYield = 3 + (Math.random() < 0.5 ? 1 : 0);
      agedYield = 1;
      seedReturn = 1; // guaranteed seed back
      xpGain = 40;
      g.stats.centuryHarvested = (g.stats.centuryHarvested || 0) + 1;
    } else if (stage === 'millennium') {
      normalYield = 4 + (Math.random() < 0.5 ? 1 : 0);
      agedYield = 1;
      seedReturn = 1 + (Math.random() < 0.5 ? 1 : 0);
      xpGain = 75;
      const mutationChance = plot.watered ? 0.75 : 0.50;
      if (Math.random() < mutationChance) {
        divineYield = 1 + (Math.random() < 0.35 ? 1 : 0);
        relicDustYield = 1;
        g.stats.millenniumMutations = (g.stats.millenniumMutations || 0) + 1;
      }
    }

    // Apply yields
    alc.ingredients[seed.herbId] = (alc.ingredients[seed.herbId] || 0) + normalYield;
    if (agedYield > 0 && seed.agedHerbId) {
      alc.ingredients[seed.agedHerbId] = (alc.ingredients[seed.agedHerbId] || 0) + agedYield;
    }
    if (divineYield > 0) {
      alc.ingredients.divine_petals = (alc.ingredients.divine_petals || 0) + divineYield;
    }
    if (relicDustYield > 0) {
      alc.ingredients.relic_dust = (alc.ingredients.relic_dust || 0) + relicDustYield;
    }
    if (seedReturn > 0) {
      g.seeds[plot.seed] = (g.seeds[plot.seed] || 0) + seedReturn;
    }

    alc.xp += xpGain;
    g.stats.harvested = (g.stats.harvested || 0) + 1;

    // Rank up check
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

    // Clear plot
    plot.seed = null;
    plot.growthSeconds = 0;
    plot.watered = false;
    plot.infused = false;

    const yieldSummaryRu = [
      `${normalYield} шт. «${INGREDIENTS[seed.herbId]?.nameRu || seed.herbId}»`,
      agedYield ? `${agedYield} шт. «${INGREDIENTS[seed.agedHerbId]?.nameRu || seed.agedHerbId}»` : '',
      divineYield ? `${divineYield} шт. Священных Лепестков` : '',
      seedReturn ? `${seedReturn} семя` : ''
    ].filter(Boolean).join(', ');

    const yieldSummaryEn = [
      `${normalYield} pcs “${INGREDIENTS[seed.herbId]?.nameEn || seed.herbId}”`,
      agedYield ? `${agedYield} pcs “${INGREDIENTS[seed.agedHerbId]?.nameEn || seed.agedHerbId}”` : '',
      divineYield ? `${divineYield} pcs Divine Petals` : '',
      seedReturn ? `${seedReturn} seed` : ''
    ].filter(Boolean).join(', ');

    const logRu = `🌾 Урожай делянки #${plotIndex + 1} (${stageInfo.labelRu}): получено ${yieldSummaryRu} (+${xpGain} опыта алхимии).`;
    const logEn = `🌾 Harvested plot #${plotIndex + 1} (${stageInfo.labelEn}): received ${yieldSummaryEn} (+${xpGain} alchemy XP).`;
    alc.log.unshift({ ru: logRu, en: logEn });
    alc.log = alc.log.slice(0, 10);
    if (E && E.log) E.log(s, `Сад Жемчужины: собран урожай с делянки #${plotIndex + 1}.`);
    return true;
  }

  function harvestAll(s, E = null) {
    if (!s || !s.alchemy || !s.alchemy.garden) return false;
    let any = false;
    for (let i = 0; i < s.alchemy.garden.unlockedPlots; i++) {
      if (canHarvest(s, i)) {
        if (harvest(s, i, E)) any = true;
      }
    }
    return any;
  }

  function canUnlockPlot(s, plotIndex) {
    if (!s || !s.alchemy || !s.alchemy.garden) return false;
    const g = s.alchemy.garden;
    plotIndex = Math.floor(plotIndex);
    if (plotIndex !== g.unlockedPlots || plotIndex >= 6) return false;
    const req = PLOT_UNLOCK_REQS[plotIndex];
    if (!req) return false;
    if (s.alchemy.level < req.reqRank) return false;
    if ((s.resources.qi || 0) < req.qi) return false;
    if ((s.resources.gold || 0) < req.gold) return false;
    if ((s.resources.relics || 0) < req.relics) return false;
    return true;
  }

  function unlockPlot(s, plotIndex, E = null) {
    if (!canUnlockPlot(s, plotIndex)) return false;
    const g = s.alchemy.garden;
    const req = PLOT_UNLOCK_REQS[plotIndex];

    s.resources.qi = Math.max(0, (s.resources.qi || 0) - req.qi);
    s.resources.gold = Math.max(0, (s.resources.gold || 0) - req.gold);
    if (req.relics > 0) {
      s.resources.relics = Math.max(0, (s.resources.relics || 0) - req.relics);
    }
    g.unlockedPlots++;

    const logRu = `✨ Пробуждена новая духовная делянка #${g.unlockedPlots}: «${req.nameRu}»! Пространство Жемчужины расширяется.`;
    const logEn = `✨ Awakened new spiritual plot #${g.unlockedPlots}: “${req.nameEn}”! The Pearl’s space expands.`;
    s.alchemy.log.unshift({ ru: logRu, en: logEn });
    s.alchemy.log = s.alchemy.log.slice(0, 10);
    if (E && E.log) E.log(s, `Сад Жемчужины: открыта делянка #${g.unlockedPlots}.`);
    return true;
  }

  function getJasmineGardenQuote(s, lang = 'ru') {
    const isEn = lang === 'en';
    if (!s || !s.alchemy || !s.alchemy.garden) {
      return isEn
        ? '“Cultivate the sacred realm with reverence, mortal.”'
        : '«Взращивай священный сад с благоговением, смертный.»';
    }
    const g = s.alchemy.garden;
    const activePlots = g.plots.slice(0, g.unlockedPlots);
    const hasMillennium = activePlots.some(p => p.seed && getPlotStage(p).stage === 'millennium');
    const hasCentury = activePlots.some(p => p.seed && getPlotStage(p).stage === 'century');
    const allEmpty = activePlots.every(p => !p.seed);

    if (hasMillennium) {
      return isEn
        ? '“Oh?.. Even in the God Realm, such petals are worth their weight in astral jade. It seems your clumsiness is not entirely hopeless.”'
        : '«О?.. Даже в Царстве Богов такие лепестки ценятся на вес звездного нефрита. Похоже, твоя неуклюжесть не совсем безнадёжна.»';
    }
    if (hasCentury) {
      return isEn
        ? '“Not bad. The stem absorbed century qi without a single crack. Take it to the cauldron before the essence disperses.”'
        : '«Неплохо. Стебель вобрал столетнюю ци без единой трещины. Неси в котёл, пока эссенция не рассеялась в воздухе.»';
    }
    if (allEmpty) {
      return isEn
        ? '“You possess a Heavenly Treasure of Primordial Chaos and leave its sacred soil empty?! Plant seeds immediately, you lazy fool!”'
        : '«Ты получил в руки Небесное Сокровище Изначального Хаоса и держишь его священную землю пустой?! Немедленно посади семена, ленивый глупец!»';
    }
    return isEn
      ? '“The Primordial Spring fills the sprouts with divine force. Don’t just stand there — use dew or infuse qi if you are in a hurry.”'
      : '«Изначальный Источник наполняет ростки божественной силой. Не стой без дела — используй росу или влей каплю ци, если торопишься.»';
  }

  function advance(s, dt) {
    if (!s || !s.alchemy) return;
    if (typeof dt === 'number' && dt > 0) {
      if (s.alchemy.forageCooldown > 0) {
        s.alchemy.forageCooldown = Math.max(0, s.alchemy.forageCooldown - dt);
      }
      // Garden advancement
      if (s.alchemy.garden) {
        const g = s.alchemy.garden;
        // Dew condensation: 1 drop per 1800s (30 min) up to dewMax (5)
        if (g.dew < (g.dewMax || 5)) {
          g.dewProgress = (g.dewProgress || 0) + dt;
          while (g.dewProgress >= 1800 && g.dew < (g.dewMax || 5)) {
            g.dew++;
            g.dewProgress -= 1800;
          }
          if (g.dew >= (g.dewMax || 5)) g.dewProgress = 0;
        } else {
          g.dewProgress = 0;
        }

        // Plot growth
        const unlocked = Math.min(6, g.unlockedPlots || 2);
        for (let i = 0; i < unlocked; i++) {
          const plot = g.plots?.[i];
          if (plot && plot.seed && SEEDS[plot.seed]) {
            const seed = SEEDS[plot.seed];
            const rate = plot.watered ? 1.5 : 1.0;
            const cap = seed.matureTime * 8 + 3600;
            plot.growthSeconds = Math.min(cap, (plot.growthSeconds || 0) + dt * rate);
          }
        }
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
    SEEDS,
    PLOT_UNLOCK_REQS,
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
    getPlotStage,
    canPlant,
    plant,
    canWater,
    waterPlot,
    canInfuse,
    infusePlot,
    canHarvest,
    harvest,
    harvestAll,
    canUnlockPlot,
    unlockPlot,
    getJasmineGardenQuote,
    advance,
    addDanDu,
    cleanseDanDu,
    canMeridianPurge,
    meridianPurge,
    meridianPurity,
    getDanDuStatus,
    consumePill,
    BLACK_MOON_VIP_TIERS,
    AUCTION_CATALOG,
    AUCTION_BIDDERS,
    getBlackMoonVipTier,
    isMaskUnlocked,
    canToggleMask,
    toggleMask,
    canAccessAuction,
    canStartAuction,
    startAuction,
    canAuctionStep,
    auctionStep,
    canAuctionCollect,
    auctionCollect,
    canBuyAuctionLot,
    buyAuctionLot
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.IsekaiAlchemy = api;
})(globalThis);
