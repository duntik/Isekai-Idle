(function(root) {
  'use strict';

  const W = typeof module !== 'undefined' && module.exports ? require('./world.js') : root.IsekaiWorld;
  const S = typeof module !== 'undefined' && module.exports ? require('./sects.js') : root.IsekaiSects;

  const pairs = [];
  const text = (ru, en) => { pairs.push([ru, en]); return [ru, en]; };

  const scions = {
    rescue: { name: text('Старейшина Му', 'Elder Mu'), role: text('главный хранитель Павильона Ста Трав', 'grand keeper of the Hundred Herbs Pavilion') },
    remains: { name: text('Патриарх Сяо', 'Patriarch Xiao'), role: text('лидер Главного Клана Сяо', 'leader of the Xiao Main Sect') },
    invitation: { name: text('Фэнь Дуаньхунь', 'Fen Duanhun'), role: text('глава Врат Горящих Небес', 'master of the Burning Heaven Gate') },
    gates: { name: text('Командор Те', 'Commander Tie'), role: text('верховный воевода Железного Оплота', 'supreme warlord of the Iron Bastion') }
  };

  text('владычество над источниками планеты.', 'dominion over planetary sources.');
  text('Прямой ученик Патриарха', 'Patriarch’s Direct Disciple');
  text('готовиться к защите секты.', 'prepare to defend the sect.');
  text('СИСТЕМА ПРОЗРЕНИЯ · ПРЯМОЙ ПРЕЕМНИК', 'INSIGHT SYSTEM · DIRECT SUCCESSOR');
  text('Наследие Дао', 'Dao Heritage');
  text('Великий Преемник', 'Supreme Successor');
  text('Пик Преемника освоен', 'Successor Peak established');
  text('Прямой Ученик и Наследник Дао', 'Core Disciple & Dao Successor');
  text('Церемония посвящения завершена! Патриарх вручил тебе Нефритовый Скипетр Наследника, а все старейшины и тысячи учеников склонились перед твоей волей.', 'The initiation ceremony is complete! The Patriarch bestowed upon you the Successor’s Jade Scepter, and all elders and thousands of disciples bow before your sovereign will.');
  text('ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 3 · НАСЛЕДНИК БОЖЕСТВЕННОГО ДАО', 'AGAINST THE GODS · VOL. 3 · DIVINE DAO SUCCESSOR');
  text('Шаги шестой главы', 'Sixth chapter steps');
  text('Глава 6: Прямой ученик', 'Chapter 6: Direct Disciple');
  text('Завершена', 'Completed');
  text('Указ', 'Decree');
  text('Пик', 'Peak');
  text('Реликвия', 'Relic');
  text('Смотр', 'Review');
  text('Тело', 'Dragon Body');
  text('Осада', 'Siege');
  text('Разгром', 'Crush');
  text('Защитник', 'Protector');
  text('Школа', 'Ascension');
  text('В пути или вне города', 'In transit or outside city');
  text('Принять Золотой Указ Патриарха', 'Accept Patriarch’s Golden Decree');
  text('Активировать формацию Пика', 'Activate Peak Formation');
  text('Унаследовать древнюю реликвию', 'Inherit Ancient Relic');
  text('Провести смотр учеников', 'Review Sect Disciples');
  text('Завершить переплавку Тела Дракона', 'Complete Dragon Body Refinement');
  text('Возглавить оборону секты', 'Lead Sect Defense');
  text('Испепелить вражеский легион', 'Annihilate Hostile Legion');
  text('Принять титул Защитника Государства', 'Accept Sovereign Protector Title');
  text('Основать несокрушимую державу', 'Found the Sovereign Realm');
  text('Текущий эпизод (активный)', 'Current episode (active)');
  text('Глава 6 · Эпизод', 'Chapter 6 · Episode');
  text('📖 Открыть этот эпизод', '📖 Open this episode');
  text('Верховный Преемник и Владыка Секты', 'Supreme Successor & Sect Sovereign');
  text('Все кланы и секты признали твоё абсолютное владычество. Имя твоё сияет среди звёзд, а школа твоя стала непререкаемым оплотом мира.', 'All clans and sects have acknowledged your supreme dominion. Your name shines among the stars, and your sect stands as the undisputed bastion of the world.');

  const beats = [
    {
      id: 'core-investiture',
      step: 0,
      title: text('Указ Патриарха: Личный Преемник', 'Patriarch’s Decree: Direct Successor'),
      text: text(
        'После триумфа на Арене Столицы Патриарх и Совет Верховных Старейшин лично встречают тебя у главных врат. Под звон ритуальных колоколов зачитывается Золотой Указ: отныне ты наречён единственным Прямым Учеником и полноправным преемником школы! Твой статус превосходит старейшин залов.',
        'Following your triumph on the Capital Arena, the Patriarch and High Council of Elders greet you at the main gates. Amidst the resonance of ritual bronze bells, the Golden Decree is proclaimed: henceforth, you are anointed as the sole Direct Disciple and rightful successor of the school! Your status surpasses hall elders.'
      ),
      chronicle: text(
        'Золотой Указ Патриарха утверждён; ты официально наречён Прямым Преемником.',
        'The Patriarch’s Golden Decree sealed; you are officially anointed as Direct Successor.'
      ),
      goal: text('Находиться в Городе без перехода (локация «city»).', 'Be at location "city" without active journey.'),
      button: text('Принять Золотой Указ Патриарха', 'Accept Patriarch’s Golden Decree'),
      location: 'city',
      reward: { gold: 150, reputation: 50 },
      ready: s => s.stage === 5 && !s.world.journey && s.world.location === 'city'
    },
    {
      id: 'sovereign-peak',
      step: 1,
      title: text('Обустройство Пика Первого Преемника', 'Establishing the Successor’s Spirit Peak'),
      text: text(
        'Тебе выделен высочайший горный пик, парящий среди лазурных облаков. Здесь бьют чистейшие родники духовной Ци, а в пещерах медитации время течёт по особым небесным законам. Укрепив физическое основание, ты активируешь древнюю защитную формацию Пика.',
        'The highest mountain peak floating amidst azure clouds is bestowed upon you. Pure spiritual Qi springs well up here, and inside meditation grottos time flows by divine laws. Tempering your physical foundation, you awaken the ancient protective array of the Peak.'
      ),
      chronicle: text(
        'Пик Первого Преемника обустроен; защитная духовная формация сияет в небесах.',
        'The Successor’s Spirit Peak established; the protective spiritual array shines.'
      ),
      goal: text('Укрепить тело до 7.5 (тело ≥ 7.5).', 'Strengthen body to 7.5 (body stat ≥ 7.5).'),
      button: text('Активировать формацию Пика', 'Activate Peak Formation'),
      location: 'city',
      reward: { qi: 100, reputation: 40 },
      ready: s => s.stage === 5 && !s.world.journey && s.body >= 7.5
    },
    {
      id: 'dao-treasure-inheritance',
      step: 2,
      title: text('Наследие Древнего Дао Школы', 'Inheritance of the Ancient Sect Dao Relic'),
      text: text(
        'Патриарх ведёт тебя в родовую усыпальницу секты, сокрытую глубоко в недрах священной горы. В хрустальном ларце покоится древняя реликвия Изначального Дракона. Погрузив ладонь в сакральный алтарь, ты принимаешь наследие школы, впитывая первозданные тайны мироздания.',
        'The Patriarch escorts you into the ancestral crypt hidden deep inside the sacred mountain. In a crystalline reliquary rests the ancient Primordial Dragon Relic. Plunging your palm into the sacred altar, you accept the school’s legacy, absorbing primordial cosmic mysteries.'
      ),
      chronicle: text(
        'Древнее наследие Дао получено; духовные каналы озарены первозданным светом.',
        'Ancient Dao heritage inherited; spiritual channels illuminated with primordial light.'
      ),
      goal: text('Одержать не менее 15 побед и достичь 11-й ступени (ступень ≥ 11, побед ≥ 15).', 'Claim at least 15 victories and reach Realm 11 (realm ≥ 11, wins ≥ 15).'),
      button: text('Унаследовать древнюю реликвию', 'Inherit Ancient Relic'),
      location: 'city',
      reward: { gold: 200, relics: 3 },
      ready: s => s.stage === 5 && !s.world.journey && s.realm >= 11 && s.wins >= 15
    },
    {
      id: 'mentoring-disciples',
      step: 3,
      title: text('Смотр и наставничество учеников', 'Review and Mentorship of Disciples'),
      text: text(
        'На главной площади секты выстраиваются тысячи учеников всех павильонов. По воле Патриарха ты проводишь смотр и демонстрируешь основы высшей циркуляции Ци. Поражённые ученики падают ниц, признавая твой абсолютный авторитет и принося клятвы вечной преданности.',
        'Upon the sect’s grand plaza assemble thousands of disciples from every pavilion. By the Patriarch’s decree, you conduct a grand review and demonstrate the supreme circulation of profound energy. Awe-struck disciples prostrate themselves, swearing eternal fealty to your leadership.'
      ),
      chronicle: text(
        'Смотр учеников проведён; авторитет Прямого Преемника непререкаем.',
        'Disciple review complete; the authority of the Direct Successor is absolute.'
      ),
      goal: text('Накопить 350 монет и 12 осколков (монеты ≥ 350, осколки ≥ 12).', 'Gather 350 coins and 12 shards (gold ≥ 350, relics ≥ 12).'),
      button: text('Принять присягу учеников', 'Accept Disciples’ Fealty Oath'),
      location: 'city',
      reward: { gold: 220, reputation: 60 },
      ready: s => s.stage === 5 && !s.world.journey && (s.resources.gold || 0) >= 350 && (s.resources.relics || 0) >= 12
    },
    {
      id: 'dragon-god-body',
      step: 4,
      title: text('Пробуждение Тела Божественного Дракона', 'Awakening the Divine Dragon Body'),
      text: text(
        'В уединении тайной пещеры капля Крови Дракона окончательно сливается с костным мозгом. Твои кости обретают алмазную нерушимость, а плоть излучает золотистое сияние Изначального Зверя. Обычное духовное оружие бессильно даже поцарапать твою кожу.',
        'Within the secluded mystery grotto, the drop of Dragon Blood fuses completely with your bone marrow. Your skeleton attains diamond invulnerability, and your flesh radiates the golden light of the Primordial Beast. Mortal spiritual weapons shatter upon your skin.'
      ),
      chronicle: text(
        'Тело Божественного Дракона пробуждено; алмазная нерушимость плоти достигнута.',
        'Divine Dragon Body awakened; diamond invulnerability of the vessel attained.'
      ),
      goal: text('Достичь 12-й ступени культивации и ци ≥ 150 (ступень ≥ 12, ци ≥ 150).', 'Attain Realm 12 and qi ≥ 150 (realm ≥ 12, qi ≥ 150).'),
      button: text('Завершить переплавку костей', 'Complete Bone Refinement'),
      location: 'city',
      reward: { qi: 150, reputation: 70 },
      ready: s => s.stage === 5 && !s.world.journey && s.realm >= 12 && (s.resources.qi || 0) >= 150
    },
    {
      id: 'clan-hostility-siege',
      step: 5,
      title: text('Осада Врат Горящих Небес', 'Repelling the Siege of Burning Heaven'),
      text: text(
        'Враждебная армада Врат Горящих Небес, не смирившись с потерей власти, окружает горную цепь школы. Багровые осадные формации сотрясают скалы. Патриарх вручает тебе Боевой Штандарт: ты выходишь навстречу вражескому авангарду во главе элитных витязей секты!',
        'The vengeful armada of the Burning Heaven Gate, refusing to accept their decline, besieges the sect’s mountain perimeter. Crimson siege arrays rock the cliffs. The Patriarch entrusts you with the War Banner: you stride forth at the vanguard of the sect’s elite warriors!'
      ),
      chronicle: text(
        'Ты возглавил оборону школы против карательной армады враждебного клана.',
        'You spearheaded the defense of the school against the invading clan armada.'
      ),
      goal: text('Одержать не менее 16 побед и тело ≥ 8.0 (побед ≥ 16, тело ≥ 8.0).', 'Attain at least 16 victories and body ≥ 8.0 (wins ≥ 16, body ≥ 8.0).'),
      button: text('Встретить вражеский авангард', 'Confront Hostile Vanguard'),
      location: 'city',
      reward: { gold: 250, reputation: 80 },
      ready: s => s.stage === 5 && !s.world.journey && s.wins >= 16 && s.body >= 8.0
    },
    {
      id: 'crushing-the-elders',
      step: 6,
      title: text('Испепеление карательного легиона', 'Annihilating the Punitive Vanguard'),
      text: text(
        'В эпической битве у подножия пика верховные старейшины клана обрушивают свои сильнейшие техники. Но Тяжёлый Меч Повелителя в твоих руках вспыхивает пламенем Злого Бога: один круговой взмах обращает осадные боевые орудия и старейшин врага в пепел!',
        'In an epic clash at the peak’s base, the supreme elders of the hostile clan unleash forbidden arts. Yet the Overlord Heavy Sword in your grasp ignites with Evil God’s flame: a single whirlwind cleave reduces their siege engines and elders to scattered ash!'
      ),
      chronicle: text(
        'Карательный легион враждебного клана сокрушён; осада школы полностью снята.',
        'The punitive vanguard annihilated; the siege of the school decisively broken.'
      ),
      goal: text('Улучшить оружие до уровня ≥ 3 и мастерство ≥ 40 (оружие ≥ 3, мастерство ≥ 40).', 'Upgrade weapon to level ≥ 3 and mastery ≥ 40 (weapon ≥ 3, mastery ≥ 40).'),
      button: text('Испепелить вражеский легион', 'Annihilate Hostile Legion'),
      location: 'city',
      reward: { gold: 300, relics: 4 },
      ready: s => s.stage === 5 && !s.world.journey && s.weapon >= 3 && s.mastery >= 40
    },
    {
      id: 'imperial-preceptor-decree',
      step: 7,
      title: text('Верховный Защитник Государства', 'Supreme Sovereign Protector Decree'),
      text: text(
        'Спасённая Империя ликует. Император и принцесса Цан Юэ прибывают на Пик Преемника с верховным эдиктом: провозглашение тебя Государственным Наставником и Хранителем Поднебесной! Враждующие кланы склоняют знамёна, признавая твою священную власть.',
        'The rescued Empire rejoices. The Emperor and Princess Cang Yue arrive at the Successor’s Peak bearing the Supreme Edict: proclaiming you State Preceptor and Sovereign Protector of the Realm! Rival clans lower their banners, kneeling in submission.'
      ),
      chronicle: text(
        'Титул Верховного Защитника Государства утверждён императорским эдиктом.',
        'Title of Supreme Sovereign Protector of the Realm confirmed by imperial edict.'
      ),
      goal: text('Спокойствие ≥ 98 и ци ≥ 180 (спокойствие ≥ 98, ци ≥ 180).', 'Calm ≥ 98 and qi ≥ 180 (calm ≥ 98, qi ≥ 180).'),
      button: text('Принять титул Защитника Государства', 'Accept Sovereign Protector Title'),
      location: 'city',
      reward: { reputation: 150, gold: 400 },
      ready: s => s.stage === 5 && !s.world.journey && s.calm >= 98 && (s.resources.qi || 0) >= 180
    },
    {
      id: 'immortal-sect-founding',
      step: 8,
      title: text('Возвышение Непобедимой Школы', 'Ascension of the Sovereign Dao Sect'),
      text: text(
        'Патриарх торжественно передаёт тебе Великую Печать Патриарха: «Отныне ты не просто преемник, но истинный владыка нашего пути!» Твоя школа объединяет весь континент, открывая врата к великим тайнам межзвёздных порталов и галактических миров.',
        'The Patriarch solemnly confers upon you the Grand Sovereign Seal: “Henceforth, you are not merely our successor, but the true sovereign master of our immortal dao!” Your sect unifies the continent, opening the gateway to stellar portals and galaxy realms.'
      ),
      chronicle: text(
        'Школа вознесена на вершину славы! Ты признан истинным Владыкой континента.',
        'The sect ascends to the pinnacle of glory! You are hailed as Sovereign of the realm.'
      ),
      goal: text('Достичь 14-й ступени культивации, одержать не менее 18 побед и накопить 800 монет (ступень ≥ 14, побед ≥ 18, монеты ≥ 800).', 'Attain Realm 14, claim at least 18 victories and gather 800 coins (realm ≥ 14, wins ≥ 18, gold ≥ 800).'),
      button: text('Принять Печать Верховного Владыки', 'Accept Supreme Sovereign Seal'),
      location: 'city',
      reward: { gold: 800, reputation: 250, relics: 6 },
      ready: s => s.stage === 5 && !s.world.journey && s.realm >= 14 && s.wins >= 18 && (s.resources.gold || 0) >= 800
    }
  ];

  function getScion(sectKey) {
    return scions[sectKey] || scions.gates;
  }

  // Pre-register interpolated scion duel variants for all sects
  for (const sc of Object.values(scions)) {
    const ruDuel = beats[5].text[0].replace('Враждебная армада Врат Горящих Небес', `Карательный легион под началом ${sc.name[0]}, ${sc.role[0]}`);
    const enDuel = beats[5].text[1].replace('The vengeful armada of the Burning Heaven Gate', `The punitive armada led by ${sc.name[1]}, ${sc.role[1]}`);
    pairs.push([ruDuel, enDuel]);
  }

  function getBeat(s, index = (s.chapterSixStep || 0), lang = 'ru') {
    if (s.stage < 5) return null;
    const base = beats[index];
    if (!base) return null;

    const sectKey = s.world.admission || 'gates';
    const scion = getScion(sectKey);
    const i = lang === 'en' ? 1 : 0;

    let textVal = base.text[i];
    if (base.id === 'clan-hostility-siege') {
      textVal = textVal.replace(
        i === 0 ? 'Враждебная армада Врат Горящих Небес' : 'The vengeful armada of the Burning Heaven Gate',
        i === 0 ? `Карательный легион под началом ${scion.name[0]}, ${scion.role[0]}` : `The punitive armada led by ${scion.name[1]}, ${scion.role[1]}`
      );
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

  function isReady(s, step = (s.chapterSixStep || 0)) {
    const b = beats[step];
    return b ? b.ready(s) : false;
  }

  function action(s, value, api) {
    const step = s.chapterSixStep || 0;
    const b = beats[step];
    if (!b || !b.ready(s)) return false;

    for (const [k, v] of Object.entries(b.reward || {})) {
      if (s.resources[k] !== undefined) s.resources[k] += v;
    }
    if (api && api.log) {
      api.log(s, `【ГЛАВА 6 · ЭПИЗОД ${step + 1}】 ${b.title[0]} завершён! ${b.chronicle[0]}`);
    }

    s.chapterSixStep = step + 1;
    return true;
  }

  function systemDirective(s, step = (s.chapterSixStep || 0), lang = 'ru') {
    const i = lang === 'en' ? 1 : 0;
    const directives = {
      0: {
        world: text('Золотой Указ Патриарха и 150 монет преемника', 'Patriarch’s Golden Decree & 150 successor coins'),
        system: text('Статус Прямого Преемника утверждён · Все полномочия секты разблокированы', 'Direct Successor status confirmed · All sect authorities unlocked')
      },
      1: {
        world: text('Пик Первого Преемника и 100 единиц духовной Ци', 'First Successor’s Peak & 100 Profound Qi'),
        system: text('Горная духовная формация синхронизирована · Прирост Ци +30%', 'Mountain spiritual array synced · Qi gain +30%')
      },
      2: {
        world: text('Реликвия Изначального Дракона и 200 монет наследия', 'Primordial Dragon Relic & 200 heritage coins'),
        system: text('Слияние с древним Дао · Скорость постижения сутр ×2', 'Fusing with ancient Dao · Scripture insight speed ×2')
      },
      3: {
        world: text('Клятва верности сотен учеников и 220 монет казны', 'Disciples’ fealty oath & 220 treasury coins'),
        system: text('Аура молодого мастера активна · Мораль секты максимальная', 'Young Master aura active · Sect morale maximum')
      },
      4: {
        world: text('Тело Божественного Дракона и 150 духовной энергии', 'Divine Dragon Body & 150 spiritual energy'),
        system: text('Алмазные кости сформированы · Снижение получаемого урона на 35%', 'Diamond bones forged · Incoming damage reduced by 35%')
      },
      5: {
        world: text('Боевой Штандарт секты и 250 монет триумфа', 'Sect War Banner & 250 triumph coins'),
        system: text('Командный протокол активирован · Боевой дух защитников +50%', 'Command protocol active · Defender battle spirit +50%')
      },
      6: {
        world: text('Разбитые знамёна врагов и 300 монет за победу', 'Shattered enemy standards & 300 victory coins'),
        system: text('Осада сокрушена · Угроза секте полностью нейтрализована', 'Siege crushed · Threat to the sect completely neutralized')
      },
      7: {
        world: text('Императорский Эдикт Защитника Государства и 400 монет', 'Imperial Edict of Sovereign Protector & 400 coins'),
        system: text('Союз с Империей скреплён навечно · Престиж школы: абсолютный', 'Imperial alliance sealed forever · Sect prestige: absolute')
      },
      8: {
        world: text('Великая Печать Владыки и 800 монет имперской казны', 'Grand Sovereign Seal & 800 imperial treasury coins'),
        system: text('Великое Вознесение! Достигнут статус Верховного Владыки Мира', 'Grand Ascension! Status of Supreme Sovereign of the Realm achieved')
      }
    };

    const d = directives[step] || {
      world: text('Награда Прямого Преемника', 'Direct Successor reward'),
      system: text('Развитие пути Владыки', 'Sovereign path advancement')
    };

    return {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · ПРЯМОЙ ПРЕЕМНИК', 'INSIGHT SYSTEM · DIRECT SUCCESSOR')[i],
      prompt: `«[${beats[step] ? beats[step].goal[i] : (i === 1 ? 'Prepare for cosmic ascension' : 'Готовиться к космическому вознесению')}]».`,
      world: d.world[i],
      system: d.system[i]
    };
  }

  function getStoryBranches(s, lang = 'ru') {
    const curStep = s.stage > 5 ? 9 : (s.chapterSixStep || 0);
    const i = lang === 'en' ? 1 : 0;
    const branches = [];

    if (curStep >= 2) {
      branches.push({
        id: 'ch6-sovereign-peak-claimed',
        title: text('Владыка Пика', 'Peak Sovereign')[i],
        desc: text('Ты обустроил парящий Пик Преемника, подчинив потоки небесной Ци.', 'You established the floating Successor Peak, mastering the currents of celestial Qi.')[i],
        karma: text('Власть', 'Authority')[i],
        character: text('Патриарх', 'Patriarch')[i]
      });
    }

    if (curStep >= 4) {
      branches.push({
        id: 'ch6-dragon-bones-tempered',
        title: text('Алмазные Кости Дракона', 'Diamond Dragon Bones')[i],
        desc: text('Костный мозг переплавлен в Тело Божественного Дракона; клинок бессилен пред твоей плотью.', 'Bone marrow fused into the Divine Dragon Body; blades shatter upon your flesh.')[i],
        karma: text('Бессмертие', 'Immortality')[i],
        character: text('Божественный Дракон', 'Divine Dragon')[i]
      });
    }

    if (curStep >= 6) {
      branches.push({
        id: 'ch6-siege-crusher',
        title: text('Сокрушитель Осады', 'Siege Crusher')[i],
        desc: text('Карательная армада враждебного клана обращена в пепел твоим сокрушительным взмахом.', 'The invading clan armada was reduced to ash by your devastating sword sweep.')[i],
        karma: text('Доминирование', 'Dominance')[i],
        character: text('Фэнь Дуаньхунь', 'Fen Duanhun')[i]
      });
    }

    if (curStep >= 8) {
      branches.push({
        id: 'ch6-supreme-sovereign',
        title: text('Верховный Владыка', 'Supreme Sovereign')[i],
        desc: text('Приняв Печать Патриарха и статус Защитника Государства, ты объединил все школы мира.', 'Accepting the Patriarch’s Seal and Sovereign Protector status, you unified all sects of the world.')[i],
        karma: text('Триумф', 'Triumph')[i],
        character: text('Принцесса Цан Юэ', 'Princess Cang Yue')[i]
      });
    }

    return branches;
  }

  const api = {
    beats,
    getBeat,
    isReady,
    action,
    systemDirective,
    getStoryBranches,
    getScion,
    pairs
  };

  if (typeof IsekaiLocale !== 'undefined' && IsekaiLocale.add) {
    IsekaiLocale.add(pairs);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.IsekaiChapterSix = api;
  }
})(globalThis);
