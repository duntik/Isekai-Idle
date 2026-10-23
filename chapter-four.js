(function(root) {
  'use strict';

  const W = typeof module !== 'undefined' && module.exports ? require('./world.js') : root.IsekaiWorld;
  const S = typeof module !== 'undefined' && module.exports ? require('./sects.js') : root.IsekaiSects;

  const pairs = [];
  const text = (ru, en) => { pairs.push([ru, en]); return [ru, en]; };

  const scions = {
    rescue: { name: text('Люй Циншань', 'Lu Qingshan'), role: text('наследник Зала Тысячи Пилюль', 'heir of the Thousand Pills Hall') },
    remains: { name: text('Сяо Куаньюнь', 'Xiao Kuangyun'), role: text('младший мастер Главного Клана Сяо', 'young master of the Xiao Main Sect') },
    invitation: { name: text('Фэнь Цзюэчэнь', 'Fen Juechen'), role: text('младший господин Врат Горящих Небес', 'young master of the Burning Heaven Gate') },
    gates: { name: text('Те Хуан', 'Tie Huang'), role: text('старший чемпион Железного Легиона', 'senior champion of the Iron Legion') }
  };

  text('жизнь в Имперской Столице Голубого Ветра.', 'life in the Blue Wind Imperial City.');
  text('Имперский избранник', 'Imperial Chosen');
  text('готовиться к турниру дворца.', 'prepare for the palace tournament.');
  text('СИСТЕМА ПРОЗРЕНИЯ · ИМПЕРСКАЯ ДИРЕКТИВА', 'INSIGHT SYSTEM · IMPERIAL DIRECTIVE');
  text('Имперское признание', 'Imperial recognition');
  text('Божественное наследие', 'Divine legacy');
  text('Имперский Тракт достигнут', 'Imperial Highway reached');
  text('Первый Мастер Империи Голубого Ветра', 'First Master of the Blue Wind Empire');
  text('Заговор Секты Горящих Небес повержен, кровь Божественного Дракона течёт в твоих жилах, и принцесса Лань Сюэжо с гордостью вручает тебе печать Первого Мастера Империи.', 'The conspiracy of the Burning Heaven Clan has been thwarted, the blood of the Divine Dragon flows through your veins, and Princess Cang Yue proudly bestows upon you the seal of the Empire’s First Master.');
  text('ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 2 · ВЕЛИКИЙ ТРИУМФ ИМПЕРИИ', 'AGAINST THE GODS · VOL. 2 · IMPERIAL SOVEREIGN TRIUMPH');
  text('Шаги четвёртой главы', 'Fourth chapter steps');
  text('Глава 4: Имперская Столица', 'Chapter 4: Imperial Capital');
  text('Завершена', 'Completed');
  text('Тракт', 'Highway');
  text('Принцесса', 'Princess');
  text('Экзамен', 'Exam');
  text('Гильдия', 'Guild');
  text('Дракон', 'Dragon');
  text('Вызов', 'Duel');
  text('Турнир', 'Tournament');
  text('Защита', 'Defense');
  text('Триумф', 'Triumph');
  text('Тракт в Столицу пройден', 'Imperial Highway traveled');
  text('В пути или вне города', 'In transit or outside city');
  text('Войти в ворота Столицы', 'Enter Capital gates');
  text('Аудиенция у Принцессы', 'Audience with Princess');
  text('Постигать боевую технику', 'Study martial technique');
  text('Посетить Главный Павильон', 'Visit Grand Pavilion');
  text('Испытание Божественного Дракона', 'Dragon God Trial');
  text('Сразиться с надменным мастером', 'Duel arrogant master');
  text('Выйти на арену Имперского Турнира', 'Enter Imperial Tournament arena');
  text('Защитить честь Дворца', 'Defend Palace honor');
  text('Принять звание Великого Мастера', 'Accept Sovereign Title');
  text('Текущий эпизод (активный)', 'Current episode (active)');
  text('Глава 4 · Эпизод', 'Chapter 4 · Episode');
  text('📖 Открыть этот эпизод', '📖 Open this episode');
  text('Первый Мастер Империи', 'Sovereign Master of the Empire');
  text('Имперский Турнир завершён, кровь Истинного Дракона пылает в твоих жилах. Имя твоё запечатлено в анналах Голубого Ветра.', 'The Imperial Tournament is won, the True Dragon blood burns within your veins. Your name is etched into the annals of Blue Wind.');
  text('ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 3 · ТРИУМФ ИМПЕРСКОГО МАСТЕРА', 'AGAINST THE GODS · VOL. 3 · IMPERIAL SOVEREIGN TRIUMPH');

  const beats = [
    {
      id: 'imperial-road',
      step: 0,
      title: text('Имперский Тракт и Врата Столицы', 'Imperial Highway & Capital Gates'),
      text: text(
        'Покинув пределы региональных сект, ты ступаешь на мощёный белым мрамором Имперский Тракт. Вдали, под сенью лазурных облаков, вздымаются исполинские крепостные стены Имперской Столицы Голубого Ветра. Поток торговцев, культиваторов на духовных зверях и бронированных колесниц наполняет золотые врата. Небесная Жемчужина Яда пульсирует ровным жаром, откликаясь на обилие редких целебных трав и концентрацию имперской Ци.',
        'Leaving the boundaries of regional sects behind, you step onto the white-marble paved Imperial Highway. In the distance beneath azure clouds rise the gargantuan battlements of the Blue Wind Imperial City. A vibrant tide of merchants, cultivators upon spiritual mounts, and armored carriages flows through the golden gates. The Sky Poison Pearl pulses steadily, resonating with rich herbs and imperial Qi.'
      ),
      chronicle: text(
        'Преодолев тысячи ли, ты вступаешь в Имперскую Столицу Голубого Ветра.',
        'Traversing thousands of leagues, you enter the Blue Wind Imperial City.'
      ),
      goal: text('Прибыть в Город (находиться в локации «city» без перехода).', 'Arrive at the City (be at location "city" without journey active).'),
      button: text('Войти в Главные Врата Столицы', 'Enter Capital Main Gates'),
      location: 'city',
      reward: { gold: 100, reputation: 25 },
      ready: s => s.stage === 3 && !s.world.journey && s.world.location === 'city'
    },
    {
      id: 'princess-encounter',
      step: 1,
      title: text('Встреча с Принцессой Лань Сюэжо', 'Meeting Princess Lan Xueruo'),
      text: text(
        'В чайном павильоне у озера Полумесяца к тебе подходит благородная дева под шёлковой лазурной вуалью — принцесса Лань Сюэжо (Цан Юэ). Прослышав о юноше с непостижимыми медицинскими талантами и сокрушительным боевым стилем, она лично предлагает тебе рекомендацию во Дворец Голубого Ветра. Чтобы принять предложение царственной особы, твоё духовное понимание и фундамент тела должны быть безупречны.',
        'At a tea pavilion beside Crescent Lake, a noble maiden cloaked in azure silk approaches you — Princess Lan Xueruo (Cang Yue). Having heard rumors of a youth possessing miraculous medical mastery and overwhelming martial power, she personally offers a recommendation to the Blue Wind Profound Palace. To accept her patronage, your understanding and body foundation must be flawless.'
      ),
      chronicle: text(
        'Принцесса Лань Сюэжо лично вручила рекомендательный нефрит во Дворец Голубого Ветра.',
        'Princess Lan Xueruo personally bestowed an imperial recommendation jade for the Profound Palace.'
      ),
      goal: text('Укрепить тело до 5.0 (показатель тела ≥ 5.0).', 'Strengthen body to 5.0 (body stat ≥ 5.0).'),
      button: text('Принять рекомендательный нефрит Принцессы', 'Accept Princess’s Recommendation Jade'),
      location: 'city',
      reward: { reputation: 40, qi: 60 },
      ready: s => s.stage === 3 && !s.world.journey && s.body >= 5.0
    },
    {
      id: 'hall-examination',
      step: 2,
      title: text('Вступительное испытание Зала Воинской Славы', 'Martial Hall Entrance Trial'),
      text: text(
        'Перед вратами Дворца Голубого Ветра выстроились сотни надменных отпрысков кланов. Старейшины оценивают силу удара на Монолите Тысячи Цзиней. Подойдя к монолиту, ты концентрируешь истинную энергию: взрывной удар заставляет древний камень содрогнуться, а высеченные руны вспыхивают слепящим золотым светом! Присутствующие замирают в гробовом молчании.',
        'Before the gates of the Blue Wind Profound Palace gather hundreds of haughty clan scions. Elders evaluate martial strikes against the Ten Thousand Jin Monolith. Stepping forward, you channel profound force: your explosive blow shakes the ancient stone to its core, lighting carved runes with blinding golden radiance! The onlookers fall dead silent.'
      ),
      chronicle: text(
        'Монолит Тысячи Цзиней расколот твоим ударом: статус элитного адепта Дворца утверждён.',
        'The Ten Thousand Jin Monolith cracked under your strike: elite adept status confirmed.'
      ),
      goal: text('Достичь 7-й ступени культивации и одержать не менее 8 побед (ступень ≥ 7, побед ≥ 8).', 'Reach Realm 7 and claim at least 8 victories (realm ≥ 7, wins ≥ 8).'),
      button: text('Сокрушить Монолит Испытания', 'Shatter the Trial Monolith'),
      location: 'city',
      reward: { gold: 120, relics: 2 },
      ready: s => s.stage === 3 && !s.world.journey && s.realm >= 7 && s.wins >= 8
    },
    {
      id: 'black-moon-headquarters',
      step: 3,
      title: text('Павильон Главного Управляющего Чёрной Луны', 'Black Moon Headquarters & Master Yue'),
      text: text(
        'В самом сердце Столицы возвышается девятиярусная Пагода Чёрной Луны. Облачившись в Мантию Божественного Лекаря, ты вступаешь в тайный покой верховного управляющего Юэ. Предъявив пилюли 100% божественной чистоты, ты заключаешь союз с могущественнейшей торговой гильдией континента. Управляющий Юэ с трепетом склоняет голову, открывая доступ к сокровищницам запретных рецептов.',
        'At the vibrant core of the Capital looms the nine-tiered Black Moon Pagoda. Donning the Miracle Doctor’s Mantle, you enter the private sanctuary of Chief Manager Yue. Presenting pills of 100% divine purity, you forge an alliance with the continent’s most untouchable guild. Manager Yue bows in awe, unlocking access to vaults of forbidden alchemical scrolls.'
      ),
      chronicle: text(
        'Главный Управляющий Гильдии Чёрной Луны признал твой авторитет Божественного Лекаря.',
        'The Chief Manager of the Black Moon Guild recognized your authority as a Miracle Doctor.'
      ),
      goal: text('Накопить не менее 120 монет и 40 трав (монет ≥ 120, трав ≥ 40).', 'Accumulate at least 120 coins and 40 herbs (gold ≥ 120, herbs ≥ 40).'),
      button: text('Заключить имперский пакт с Гильдией Чёрной Луны', 'Seal Imperial Pact with Black Moon Guild'),
      location: 'city',
      reward: { gold: 150, reputation: 50 },
      ready: s => s.stage === 3 && !s.world.journey && (s.resources.gold || 0) >= 120 && (s.resources.herbs || 0) >= 40
    },
    {
      id: 'dragon-god-trial',
      step: 4,
      title: text('Испытание Божественного Дракона: Капля Бессмертной Крови', 'Trial of the Dragon God: Drop of Immortal Blood'),
      text: text(
        'Следуя тайным указаниям Жасмин, ты проникаешь в древнюю расселину под Имперским Плато — Запечатанное Чистилище Изначального Дракона. Дух Древнего Лазурного Дракона испытывает твою волю девятью волнами драконьего давления. Выстояв под сокрушительной тяжестью, ты впитываешь Каплю Крови Божественного Дракона! Твои кости обретают несокрушимость алмаза, а сила тяжелых ударов возрастает многократно.',
        'Guided by Jasmine’s spiritual whispers, you descend into an abyssal rift beneath the Imperial Plateau — the Primordial Dragon’s Sealed Purgatory. The soul of the Ancient Azure Dragon tests your willpower against nine crushing waves of draconic might. Enduring the trial, you absorb a drop of Divine Dragon Blood! Your bones gain adamantine resilience, and heavy strikes surge with draconic fury.'
      ),
      chronicle: text(
        'Кровь Божественного Дракона пробуждена: кости и меридианы обрели несокрушимую броню.',
        'The Divine Dragon Blood has awakened: bones and meridians gained indestructible armor.'
      ),
      goal: text('Накопить не менее 80 духовной энергии и исследовать местность не менее 800 сек (ци ≥ 80, исследование ≥ 800).', 'Gather at least 80 qi and explore for at least 800 seconds (qi ≥ 80, explored ≥ 800).'),
      button: text('Поглотить Кровь Божественного Дракона', 'Absorb the Divine Dragon Blood'),
      location: 'city',
      reward: { qi: 100, relics: 4 },
      ready: s => s.stage === 3 && !s.world.journey && (s.resources.qi || 0) >= 80 && (s.explored || 0) >= 800
    },
    {
      id: 'burning-heaven-clash',
      step: 5,
      title: text('Схватка с элитным наследником клана', 'Clash with Clan Elite Scion'),
      text: text(
        'На главной площади перед Имперским Дворцом дорогу тебе преграждает отпрыск влиятельного старейшины. Ослеплённый завистью к твоей славе, он обнажает клинок с криком: «Безродный чужак не смеет стоять рядом с принцессой!» Взвесив в руке Тяжёлый Меч Повелителя, ты обрушиваешь удар чудовищного веса, впечатывая надменного гения в мраморную брусчатку!',
        'On the grand plaza before the Imperial Palace, the scion of an influential elder blocks your path. Blinded by envy of your renown, he draws his weapon roaring: “A nameless stray dares not stand beside the Princess!” Raising your Overlord Heavy Sword, you unleash a blow of staggering weight, smashing the arrogant genius into the marble plaza!'
      ),
      chronicle: text(
        'Надменный наследник повержен на глазах имперской знати одним сокрушительным ударом.',
        'The arrogant heir was crushed before imperial nobility in a single devastating strike.'
      ),
      goal: text('Одержать не менее 9 побед на Арене (побед ≥ 9).', 'Claim at least 9 victories in the Arena (wins ≥ 9).'),
      button: text('Сокрушить надменного зачинщика', 'Crush the Arrogant Provoker'),
      location: 'city',
      reward: { gold: 180, reputation: 60 },
      ready: s => s.stage === 3 && !s.world.journey && s.wins >= 9
    },
    {
      id: 'imperial-ranking',
      step: 6,
      title: text('Великий Турнир Имперского Дворца', 'Imperial Palace Ranking Tournament'),
      text: text(
        'Зал Небесного Владыки наполнен рёвом сотен тысяч зрителей. Сильнейшие ученики со всей Империи Голубого Ветра борются за звание Первого Меча. Раунд за раундом ты сокрушаешь чемпионов столичных павильонов, не отступая ни на шаг. Зрители скандируют твоё имя, признавая рождение новой легенды континента.',
        'The Celestial Sovereign Hall roars with hundreds of thousands of spectators. Foremost disciples across the entire Blue Wind Empire compete for the title of First Blade. Round after round, you demolish the champions of capital pavilions without yielding a step. The arena chants your name, honoring the rise of a new continent legend.'
      ),
      chronicle: text(
        'Великий Турнир Имперского Дворца покорён: титул Первого Меча Столицы завоёван.',
        'The Imperial Palace Ranking Tournament conquered: First Blade title secured.'
      ),
      goal: text('Достичь 8-й ступени культивации и одержать 10 побед (ступень ≥ 8, побед ≥ 10).', 'Achieve Realm 8 and secure 10 victories (realm ≥ 8, wins ≥ 10).'),
      button: text('Выйти в финал Имперского Турнира', 'Enter Imperial Tournament Finals'),
      location: 'city',
      reward: { gold: 220, relics: 3 },
      ready: s => s.stage === 3 && !s.world.journey && s.realm >= 8 && s.wins >= 10
    },
    {
      id: 'empire-honor',
      step: 7,
      title: text('Защита Империи от Заговора Горящих Небес', 'Defending the Empire from Burning Heaven Plot'),
      text: text(
        'Тайные лазутчики Врат Горящих Небес пытаются похитить принцессу Лань Сюэжо во время ночного банкета. Распахнув барьер Небесной Жемчужины и призвав пламя Злого Бога, ты в одиночку встаешь на пути элитных убийц. Пламя и буря клинков озаряют ночные крыши дворца: заговор сокрушён, а принцесса в безопасности в твоих руках.',
        'Covert assassins of the Burning Heaven Gate attempt to abduct Princess Lan Xueruo during a midnight feast. Manifesting the Sky Poison Pearl’s barrier and invoking the Evil God’s flame, you stand alone against the elite assassins. Fire and a storm of blades illuminate the palace rooftops: the conspiracy is shattered, and the Princess is safe in your arms.'
      ),
      chronicle: text(
        'Заговор враждебных сект сокрушён: жизнь принцессы спасена, а Император склоняет главу в благодарности.',
        'The hostile sect plot was foiled: the Princess saved, and the Emperor bows in gratitude.'
      ),
      goal: text('Накопить не менее 120 спокойствия и 100 духовной энергии (спокойствие ≥ 120, ци ≥ 100).', 'Accumulate at least 120 calm and 100 qi (calm ≥ 120, qi ≥ 100).'),
      button: text('Испепелить заговорщиков пламенем Злого Бога', 'Incinerate Conspirators with Evil God’s Flame'),
      location: 'city',
      reward: { reputation: 120, gold: 250 },
      ready: s => s.stage === 3 && !s.world.journey && s.calm >= 95 && (s.resources.qi || 0) >= 100
    },
    {
      id: 'imperial-sovereign-triumph',
      step: 8,
      title: text('Триумф Первого Мастера Империи', 'Triumph of the Imperial Sovereign'),
      text: text(
        'Император Голубого Ветра лично возлагает на твои плечи Золотую Мантию Защитника Империи. Дворец признаёт тебя сильнейшим практиком молодого поколения. Врата к основанию собственной могущественной державы распахнуты навстречу судьбе — настало время подчинить себе сам Имперский Город!',
        'The Blue Wind Emperor personally drapes the Golden Mantle of Empire Defender over your shoulders. The Palace acknowledges you as the supreme cultivator of the young generation. The gateway to founding your own sovereign dominion swings wide — it is time to assume rule over the Imperial City itself!'
      ),
      chronicle: text(
        'Титул Великого Мастера Империи скреплён золотой печатью Голубого Ветра.',
        'The title of Imperial Sovereign Master is sealed with the Golden Crest of Blue Wind.'
      ),
      goal: text('Достичь 9-й ступени культивации, 11 побед и накопить 450 монет (ступень ≥ 9, побед ≥ 11, монет ≥ 450).', 'Achieve Realm 9, 11 victories and gather 450 coins (realm ≥ 9, wins ≥ 11, gold ≥ 450).'),
      button: text('Принять Золотую Мантию Защитника Империи', 'Accept Golden Imperial Defender Mantle'),
      location: 'city',
      reward: { gold: 450, reputation: 150, relics: 6 },
      ready: s => s.stage === 3 && !s.world.journey && s.realm >= 9 && s.wins >= 11 && (s.resources.gold || 0) >= 450
    }
  ];

  function getScion(sectKey) {
    return scions[sectKey] || scions.gates;
  }

  // Pre-register interpolated scion duel variants for all sects
  for (const sc of Object.values(scions)) {
    const ruDuel = beats[5].text[0].replace('отпрыск влиятельного старейшины', `${sc.name[0]}, ${sc.role[0]}`);
    const enDuel = beats[5].text[1].replace('the scion of an influential elder', `${sc.name[1]}, ${sc.role[1]}`);
    pairs.push([ruDuel, enDuel]);
  }

  function getBeat(s, index = (s.chapterFourStep || 0), lang = 'ru') {
    if (s.stage < 3) return null;
    const base = beats[index];
    if (!base) return null;

    const sectKey = s.world.admission || 'gates';
    const scion = getScion(sectKey);
    const i = lang === 'en' ? 1 : 0;

    let textVal = base.text[i];
    if (base.id === 'burning-heaven-clash') {
      textVal = lang === 'en'
        ? base.text[1].replace('the scion of an influential elder', `${scion.name[1]}, ${scion.role[1]}`)
        : base.text[0].replace('отпрыск влиятельного старейшины', `${scion.name[0]}, ${scion.role[0]}`);
    }

    return {
      id: base.id,
      step: base.step,
      title: base.title[i],
      text: textVal,
      chronicle: base.chronicle[i],
      goal: base.goal[i],
      button: base.button[i],
      location: base.location,
      reward: base.reward,
      ready: base.ready
    };
  }

  function isReady(s, index = (s.chapterFourStep || 0)) {
    if (s.stage !== 3) return false;
    const b = beats[index];
    return b ? b.ready(s) : false;
  }

  function action(s, value, api) {
    if (s.stage !== 3) return false;
    const cur = s.chapterFourStep || 0;
    if (cur >= beats.length) return false;
    const beat = beats[cur];
    if (!beat || !beat.ready(s)) return false;

    // Grant rewards
    for (const [k, v] of Object.entries(beat.reward || {})) {
      if (s.resources[k] !== undefined) s.resources[k] += v;
    }

    s.chapterFourStep = cur + 1;
    if (api && api.log) {
      api.log(s, `Глава 4: ${beat.title[0]} завершена.`);
    }
    return true;
  }

  function systemDirective(s, step = (s.chapterFourStep || 0), lang = 'ru') {
    const isEn = lang === 'en';
    const directives = {
      0: {
        header: text('ДИРЕКТИВА СИСТЕМЫ ПРОЗРЕНИЯ · ИМПЕРСКАЯ СТОЛИЦА', 'INSIGHT SYSTEM DIRECTIVE · IMPERIAL CAPITAL'),
        prompt: text('Обнаружен крупный центр духовной концентрации: Имперская Столица Голубого Ветра. Рекомендовано завершить переход и войти в городские врата.', 'Major spiritual nexus detected: Blue Wind Imperial City. Recommended to complete transit and pass through the city gates.'),
        world: text('Белокаменный тракт Империи и торговые ряды Столицы', 'White marble Imperial highway and Capital merchant arcades'),
        system: text('Синхронизация карты Столицы и разблокировка имперских маршрутов', 'Capital map synchronization and imperial routes unlocked')
      },
      1: {
        header: text('ДИРЕКТИВА СИСТЕМЫ ПРОЗРЕНИЯ · СВЯЗЬ С ИМПЕРСКОЙ ЗНАТЬЮ', 'INSIGHT SYSTEM DIRECTIVE · IMPERIAL NOBILITY BOND'),
        prompt: text('Обнаружен носитель царственной духовной крови: Принцесса Лань Сюэжо. Укрепите тело до ранга 5.0 для выдерживания рекомендательного нефрита.', 'Bearer of royal spiritual bloodline detected: Princess Lan Xueruo. Strengthen body to rank 5.0 to sustain the recommendation jade.'),
        world: text('Рекомендательный нефрит во Дворец Голубого Ветра от Принцессы', 'Palace recommendation jade personally bestowed by Princess'),
        system: text('Укрепление физического фундамента и повышение репутации в Столице', 'Physical foundation reinforced and Capital reputation enhanced')
      },
      2: {
        header: text('ДИРЕКТИВА СИСТЕМЫ ПРОЗРЕНИЯ · ИСПЫТАНИЕ МОНОЛИТА', 'INSIGHT SYSTEM DIRECTIVE · MONOLITH TRIAL'),
        prompt: text('Испытание Зала Воинской Славы требует сокрушительной боевой мощи. Необходима 7-я ступень культивации и 8 побед на Арене.', 'Martial Glory Hall trial requires overwhelming combat prowess. Realm 7 and 8 Arena victories required.'),
        world: text('Признание экзаменаторов и доступ к техникам среднего двора', 'Examiners’ acclaim and access to Middle Court techniques'),
        system: text('Открытие рангового рейтинга элитных практиков Дворца', 'Palace elite ranking ledger unlocked')
      },
      3: {
        header: text('ДИРЕКТИВА СИСТЕМЫ ПРОЗРЕНИЯ · ПАКТ ЧЁРНОЙ ЛУНЫ', 'INSIGHT SYSTEM DIRECTIVE · BLACK MOON PACT'),
        prompt: text('Рекомендовано явиться в Главный Павильон Чёрной Луны в мантии Лекаря. Подготовьте запасы золота и целебных трав.', 'Recommended to present at Black Moon Grand Pagoda in Doctor’s attire. Prepare stocks of gold and medicinal herbs.'),
        world: text('Золотая карта почётного гостя Гильдии Чёрной Луны', 'Black Moon Guild Gold VIP Guest Card'),
        system: text('Скидка на аукционную комиссию и допуск к редким рецептам', 'Auction commission discount and access to rare sutras')
      },
      4: {
        header: text('ДИРЕКТИВА СИСТЕМЫ ПРОЗРЕНИЯ · КРОВЬ БОЖЕСТВЕННОГО ДРАКОНА', 'INSIGHT SYSTEM DIRECTIVE · DIVINE DRAGON BLOOD'),
        prompt: text('Обнаружено древнее Чистилище Лазурного Дракона. Накопите не менее 80 духовной ци и исследуйте недра Столицы для слияния с драконьей кровью.', 'Ancient Azure Dragon Purgatory detected. Gather at least 80 qi and explore subterranean Capital to assimilate dragon blood.'),
        world: text('Капля Крови Божественного Дракона: алмазная плотность костей', 'Drop of Divine Dragon Blood: adamantine bone density'),
        system: text('Пассивное снижение всего получаемого физического урона на 15%', 'Passive reduction of all incoming physical damage by 15%')
      },
      5: {
        header: text('ДИРЕКТИВА СИСТЕМЫ ПРОЗРЕНИЯ · СОКРУШЕНИЕ СОПЕРНИКА', 'INSIGHT SYSTEM DIRECTIVE · RIVAL SMITE'),
        prompt: text('Агрессия со стороны кланового наследника. Одержите не менее 9 побед на Арене и преподайте урок высокомерному гению.', 'Hostility from clan heir detected. Secure at least 9 Arena victories and discipline the haughty scion.'),
        world: text('Безусловный авторитет среди учеников Имперского Дворца', 'Undisputed prestige among Imperial Palace adepts'),
        system: text('Увеличение урона тяжёлых атак меча на 20%', 'Heavy sword attack damage increased by 20%')
      },
      6: {
        header: text('ДИРЕКТИВА СИСТЕМЫ ПРОЗРЕНИЯ · ИМПЕРСКИЙ ТУРНИР', 'INSIGHT SYSTEM DIRECTIVE · IMPERIAL TOURNAMENT'),
        prompt: text('Главный Турнир Столицы начался. Достигните 8-й ступени культивации и 10 побед для покорения финала.', 'Capital Grand Tournament underway. Reach Realm 8 and 10 victories to conquer the finals.'),
        world: text('Лазурный меч Первого Мастера Столицы и признание Императора', 'Azure Blade of the Capital First Master and Emperor’s recognition'),
        system: text('Бонус к накоплению боевого импульса на Арене (+1 стак)', 'Arena momentum accumulation boosted (+1 stack)')
      },
      7: {
        header: text('ДИРЕКТИВА СИСТЕМЫ ПРОЗРЕНИЯ · ЗАЩИТА ПРИНЦЕССЫ', 'INSIGHT SYSTEM DIRECTIVE · PRINCESS RESCUE'),
        prompt: text('Критическая угроза жизни Лань Сюэжо: ночной заговор убийц. Поддерживайте покой разума и призовите пламя Злого Бога.', 'Critical threat to Lan Xueruo’s life: nocturnal assassin ambush. Maintain mental calm and summon Evil God’s flame.'),
        world: text('Нерушимый вечный союз с Императорской Семьёй Голубого Ветра', 'Eternal unbreakable alliance with Blue Wind Imperial Family'),
        system: text('Снятие ограничений на развитие собственной имперской фракции', 'Limits on founding sovereign imperial faction removed')
      },
      8: {
        header: text('ДИРЕКТИВА СИСТЕМЫ ПРОЗРЕНИЯ · ТРИУМФ ВЕЛИКОГО МАСТЕРА', 'INSIGHT SYSTEM DIRECTIVE · SOVEREIGN ASCENSION'),
        prompt: text('Финальное испытание 4-й главы. Достигните 9-й ступени, 11 побед и 450 монет для коронации Защитником Империи.', 'Final milestone of Chapter 4. Reach Realm 9, 11 victories and 450 gold to be crowned Defender of the Empire.'),
        world: text('Золотая Мантия Защитника Империи и право владения Столичным Округом', 'Golden Imperial Defender Mantle and Capital Domain dominion rights'),
        system: text('Том 3 завершён · Открыт Этап 4: «Правитель Города»', 'Volume 3 complete · Stage 4: "City Sovereign" unlocked')
      }
    };

    const d = directives[step] || directives[0];
    const idx = isEn ? 1 : 0;
    return {
      header: d.header[idx],
      prompt: d.prompt[idx],
      world: d.world[idx],
      system: d.system[idx]
    };
  }

  function getStoryBranches(s, lang = 'ru') {
    const isEn = lang === 'en';
    const branches = [];
    const step = s.chapterFourStep || 0;

    branches.push({
      id: 'ch4-princess',
      chapter: 4,
      title: isEn ? 'Princess Lan Xueruo Alliance' : 'Союз с Принцессой Лань Сюэжо',
      desc: isEn
        ? 'Accepted imperial recommendation into the Blue Wind Profound Palace.'
        : 'Принята личная имперская рекомендация принцессы во Дворец Голубого Ветра.',
      chosen: step >= 2,
      active: step === 1,
      karma: '+25 Благородство / Nobility',
      character: 'Лань Сюэжо / Lan Xueruo'
    });

    branches.push({
      id: 'ch4-dragon-god',
      chapter: 4,
      title: isEn ? 'Azure Dragon Purgatory Trial' : 'Испытание Чистилища Лазурного Дракона',
      desc: isEn
        ? 'Endured nine crushing waves to assimilate the Primordial Dragon Blood.'
        : 'Выдержаны девять волн драконьего давления, поглощена Кровь Истинного Дракона.',
      chosen: step >= 5,
      active: step === 4,
      karma: '+40 Несокрушимость / Adamantine Will',
      character: 'Дух Древнего Дракона / Azure Dragon'
    });

    branches.push({
      id: 'ch4-empire-defense',
      chapter: 4,
      title: isEn ? 'Salvation of the Imperial Line' : 'Спасение Императорской Династии',
      desc: isEn
        ? 'Shielded Princess Lan Xueruo and crushed the Burning Heaven Clan conspiracy.'
        : 'Защищена принцесса Лань Сюэжо и испепелены ночные лазутчики Врат Горящих Небес.',
      chosen: step >= 8,
      active: step === 7,
      karma: '+50 Защитник Империи / Imperial Defender',
      character: 'Император Цан Юэ / Blue Wind Emperor'
    });

    return branches;
  }

  const api = {
    beats,
    pairs,
    getBeat,
    isReady,
    action,
    systemDirective,
    getStoryBranches,
    getScion
  };

  if (typeof IsekaiLocale !== 'undefined' && IsekaiLocale.add) {
    IsekaiLocale.add(pairs);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.IsekaiChapterFour = api;
  }
})(globalThis);
