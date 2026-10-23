(function(root) {
  'use strict';

  const pairs = [];
  const text = (ru, en) => { pairs.push([ru, en]); return [ru, en]; };

  const PHENOMENA = {
    calm: {
      id: 'calm',
      icon: '🌌',
      name: text('Штиль Небесного Свода', 'Celestial Starlight Calm'),
      desc: text(
        'Небесный купол чист, духовные звёзды озаряют ночные тропы. Медитация приносит глубокое прозрение.',
        'The heavenly canopy is crystal clear, spiritual stars lighting nocturnal paths. Meditation yields profound insight.'
      ),
      perk: text(
        'Накопление Ци в медитации +50%, прирост спокойствия +25%.',
        'Meditation Qi accumulation +50%, calm gain +25%.'
      ),
      qiMult: 1.5,
      calmMult: 1.25,
      gardenGrowthMult: 1.0,
      dewRateMult: 1.0,
      beastCoreBonus: 0,
      flameHeatMult: 1.0,
      danDuQiDiscount: 0
    },
    rain: {
      id: 'rain',
      icon: '🌧️',
      name: text('Духовный Дождь', 'Spiritual Rain'),
      desc: text(
        'Тёплый ливень, напоённый небесной росой, питает духовные травы и ускоряет рост делянок Сада.',
        'A warm rain saturated with heavenly dew nourishes spiritual herbs and accelerates garden growth.'
      ),
      perk: text(
        'Скорость роста трав в Саду +50%, конденсация Живительной Росы +50%, сбор трав +40%.',
        'Garden herb growth speed +50%, Living Dew condensation +50%, herb gathering +40%.'
      ),
      qiMult: 1.0,
      calmMult: 1.0,
      gardenGrowthMult: 1.5,
      dewRateMult: 1.5,
      beastCoreBonus: 0,
      flameHeatMult: 1.0,
      danDuQiDiscount: 0
    },
    blood_moon: {
      id: 'blood_moon',
      icon: '🌕',
      name: text('Прилив Кровавой Луны', 'Blood Moon Tide'),
      desc: text(
        'Алая луна пробуждает первобытную ярость зверей Хребта и манит тайных торговцев Чёрной Луны.',
        'The crimson moon stirs the primordial rage of mountain beasts and lures secretive Black Moon traders.'
      ),
      perk: text(
        'Экспедиции Хребта приносят +1 Ядро Зверя, награда за победу на Арене +20%.',
        'Beast expeditions grant +1 Beast Core, Arena victory rewards +20%.'
      ),
      qiMult: 1.0,
      calmMult: 1.0,
      gardenGrowthMult: 1.0,
      dewRateMult: 1.0,
      beastCoreBonus: 1,
      flameHeatMult: 1.0,
      danDuQiDiscount: 0
    },
    zenith: {
      id: 'zenith',
      icon: '☀️',
      name: text('Солнечный Зенит Ян', 'Solar Yang Zenith'),
      desc: text(
        'Истинное солнце Ян наполняет алхимические котлы яростным жаром, сжигающим скверну и шлаки.',
        'The true Yang sun fills alchemy cauldrons with fierce heat, burning away impurities and slag.'
      ),
      perk: text(
        'Алхимический жар пламени +25%, очищение меридианов Жемчужиной требует на 20% меньше Ци.',
        'Alchemy flame heat +25%, Pearl meridian purge requires 20% less Qi.'
      ),
      qiMult: 1.0,
      calmMult: 1.0,
      gardenGrowthMult: 1.0,
      dewRateMult: 1.0,
      beastCoreBonus: 0,
      flameHeatMult: 1.25,
      danDuQiDiscount: 0.20
    }
  };

  const ORDER = ['calm', 'rain', 'blood_moon', 'zenith'];
  const PHASE_DURATION = 1800; // 30 minutes per phase
  const CYCLE_DURATION = PHASE_DURATION * ORDER.length; // 7200s (2 hours)

  function getCurrentWeather(s, lang = 'ru') {
    const t = Math.max(0, Number(s?.time || 0));
    const cycleTime = t % CYCLE_DURATION;
    const index = Math.floor(cycleTime / PHASE_DURATION);
    const key = ORDER[index] || 'calm';
    const p = PHENOMENA[key];
    const remaining = Math.max(0, PHASE_DURATION - (cycleTime % PHASE_DURATION));
    const i = (lang === 'en') ? 1 : 0;

    return {
      id: p.id,
      icon: p.icon,
      name: p.name[i],
      desc: p.desc[i],
      perk: p.perk[i],
      remainingSeconds: Math.ceil(remaining),
      qiMult: p.qiMult,
      calmMult: p.calmMult,
      gardenGrowthMult: p.gardenGrowthMult,
      dewRateMult: p.dewRateMult,
      beastCoreBonus: p.beastCoreBonus,
      flameHeatMult: p.flameHeatMult,
      danDuQiDiscount: p.danDuQiDiscount
    };
  }

  function getWeatherEffect(s, effectKey) {
    if (!s || (s.stage !== undefined && s.stage < 2)) {
      return effectKey.endsWith('Bonus') ? 0 : 1.0;
    }
    const w = getCurrentWeather(s, 'ru');
    return w[effectKey] !== undefined ? w[effectKey] : 1.0;
  }

  const api = {
    PHENOMENA,
    ORDER,
    PHASE_DURATION,
    CYCLE_DURATION,
    getCurrentWeather,
    getWeatherEffect,
    pairs
  };

  if (typeof IsekaiLocale !== 'undefined' && IsekaiLocale.add) {
    IsekaiLocale.add(pairs);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.IsekaiCelestial = api;
  }
})(globalThis);
