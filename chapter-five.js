(function(root) {
  'use strict';

  const W = typeof module !== 'undefined' && module.exports ? require('./world.js') : root.IsekaiWorld;
  const S = typeof module !== 'undefined' && module.exports ? require('./sects.js') : root.IsekaiSects;

  const pairs = [];
  const text = (ru, en) => { pairs.push([ru, en]); return [ru, en]; };

  const scions = {
    rescue: { name: text('Му Чэньсяо', 'Mu Chenxiao'), role: text('первый боевой гений Павильона Ста Трав', 'first martial prodigy of the Hundred Herbs Pavilion') },
    remains: { name: text('Сяо Куанфэн', 'Xiao Kuangfeng'), role: text('неистовый мечник бури Главного Клана Сяо', 'ferocious gale swordsman of the Xiao Main Sect') },
    invitation: { name: text('Фэнь Илун', 'Fen Yilong'), role: text('старший витязь пламени Врат Горящих Небес', 'senior flame champion of the Burning Heaven Gate') },
    gates: { name: text('Те Лун', 'Tie Long'), role: text('несокрушимый исполин Железного Оплота', 'indomitable juggernaut of the Iron Bastion') }
  };

  text('правление Городом и защита долины.', 'governing the City and defending the valley.');
  text('Имперский чемпион', 'Imperial Champion');
  text('готовиться к финалу турнира.', 'prepare for the tournament finals.');
  text('СИСТЕМА ПРОЗРЕНИЯ · ИМПЕРСКИЙ ТУРНИР', 'INSIGHT SYSTEM · IMPERIAL TOURNAMENT');
  text('Турнирная слава', 'Tournament glory');
  text('Венец чемпиона', 'Champion’s crown');
  text('Арена Столицы достигнута', 'Capital Arena reached');
  text('Абсолютный Чемпион Турнира Семи Сект', 'Undisputed Champion of the Seven Sects');
  text('Великий Турнир завершён триумфом! Тяжёлый Меч Повелителя сотряс трибуны, а имя твоё золотыми рунами высечено на Имперском Монолите Славы.', 'The Grand Tournament ends in glorious victory! The Overlord Heavy Sword shook the arena, and your name is etched in golden runes upon the Imperial Monolith of Glory.');
  text('ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 3 · ТРИУМФ НА АРЕНЕ СЕКТ', 'AGAINST THE GODS · VOL. 3 · SEVEN SECTS ARENA TRIUMPH');
  text('Шаги пятой главы', 'Fifth chapter steps');
  text('Глава 5: Великий Турнир Сект', 'Chapter 5: Grand Tournament of Sects');
  text('Завершена', 'Completed');
  text('Сбор', 'Assembly');
  text('Вызов', 'Challenge');
  text('Оплот', 'Bastion');
  text('Буря', 'Storm');
  text('Облако', 'Asgard');
  text('Пламя', 'Flame');
  text('Тяжесть', 'Heavy Wrath');
  text('Заговор', 'Conspiracy');
  text('Венец', 'Champion');
  text('Сбор на Арене завершён', 'Arena Assembly complete');
  text('В пути или вне города', 'In transit or outside city');
  text('Занять место на Арене', 'Take position on Arena');
  text('Принять Имперский Вызов', 'Accept Imperial Challenge');
  text('Сразить чемпиона Оплота', 'Defeat Bastion Champion');
  text('Рассечь ветряные клинки', 'Sever Gale Blades');
  text('Преодолеть ледяной барьер', 'Overcome Ice Barrier');
  text('Сокрушить гения Горящих Небес', 'Shatter Burning Heaven Heir');
  text('Обрушить ярость Меча Повелителя', 'Unleash Overlord Sword Wrath');
  text('Разоблачить заговор на трибунах', 'Unmask grandstand conspiracy');
  text('Принять золотой венец Чемпиона', 'Accept Champion’s Golden Crown');
  text('Текущий эпизод (активный)', 'Current episode (active)');
  text('Глава 5 · Эпизод', 'Chapter 5 · Episode');
  text('📖 Открыть этот эпизод', '📖 Open this episode');
  text('Абсолютный Чемпион Империи', 'Undisputed Champion of the Empire');
  text('Все школы континента признали твою несокрушимую силу. Имя твоё вознеслось на вершину боевого мира Голубого Ветра.', 'All sects of the continent have acknowledged your invincible might. Your name ascends to the absolute peak of the Blue Wind martial realm.');

  const beats = [
    {
      id: 'tournament-assembly',
      step: 0,
      title: text('Сбор Великого Турнира в Столице', 'Grand Gathering of the Seven Sects'),
      text: text(
        'Колоссальная Арена Небесного Владыки в Имперской Столице заполняется десятками тысяч зрителей. Знамёна Семи Великих Сект реют на ветру. Делегации кланов оценивают соперников высокомерными взглядами, но когда ты выходишь в сектор участников, воздух вокруг сгущается от давления невидимой ауры.',
        'The colossal Heavenly Sovereign Arena in the Imperial Capital fills with tens of thousands of spectators. Banners of the Seven Great Sects flutter in the breeze. Clan delegations cast haughty glances at rivals, but as you step into the contenders’ ring, the air thickens with invisible aura pressure.'
      ),
      chronicle: text(
        'Ты вступил на великую Арену Столицы как главный представитель школы.',
        'You set foot onto the Capital’s Grand Arena as the chief representative of your school.'
      ),
      goal: text('Находиться в Городе без перехода (локация «city»).', 'Be at location "city" without active journey.'),
      button: text('Занять место на Арене Столицы', 'Take Position on Capital Arena'),
      location: 'city',
      reward: { gold: 120, reputation: 30 },
      ready: s => s.stage === 4 && !s.world.journey && s.world.location === 'city'
    },
    {
      id: 'arena-proclamation',
      step: 1,
      title: text('Провозглашение Имперского Вызова', 'Proclamation of the Imperial Challenge'),
      text: text(
        'Верховный судья Имперского Дворца ударяет в бронзовый гонг: «Да начнётся битва сильнейших гениев поколения!» По жеребьёвке тебе предстоит серия сложнейших боёв на выбывание. Твоё тело и меридианы готовы выдержать свирепый натиск сильнейших практиков континента.',
        'The Supreme Judge of the Imperial Palace strikes the bronze gong: “Let the clash of our generation’s finest prodigies begin!” By the tournament draw, you face an unrelenting series of elimination duels. Your vessel and meridians are primed to withstand the fierce assault of the continent’s elite.'
      ),
      chronicle: text(
        'Имперский вызов принят; имя твоё занесено в золотой список претендентов.',
        'The Imperial Challenge accepted; your name entered upon the Golden Contender Roster.'
      ),
      goal: text('Укрепить тело до 6.0 (тело ≥ 6.0).', 'Strengthen body to 6.0 (body stat ≥ 6.0).'),
      button: text('Принять боевой жребий Арены', 'Accept Arena Combat Draw'),
      location: 'city',
      reward: { qi: 80, reputation: 40 },
      ready: s => s.stage === 4 && !s.world.journey && s.body >= 6.0
    },
    {
      id: 'iron-bastion-clash',
      step: 2,
      title: text('Сокрушение титана Железного Оплота', 'Shattering the Iron Bastion Juggernaut'),
      text: text(
        'Первым на каменный помост выходит чемпион Железного Оплота — исполин в трёхслойных базальтовых доспехах. Его щит считается непробиваемым для меча. Сконцентрировав инерцию и силу циркуляции, ты обрушиваешь удар, раскалывающий его монолитный барьер на глазах у потрясённых трибун!',
        'First onto the stone stage steps the champion of the Iron Bastion — a titan clad in triple-layered basalt plate. His shield is deemed impenetrable. Gathering momentum and circulatory force, you unleash a blow that shatters his monolithic defense before the gasping galleries!'
      ),
      chronicle: text(
        'Непробиваемый щит Железного Оплота разбит в щепы; первая победа в турнире.',
        'The impenetrable shield of the Iron Bastion shattered; first tournament victory.'
      ),
      goal: text('Одержать не менее 11 побед и достичь 8-й ступени (ступень ≥ 8, побед ≥ 11).', 'Claim at least 11 victories and reach Realm 8 (realm ≥ 8, wins ≥ 11).'),
      button: text('Расколоть железную защиту', 'Shatter Iron Defense'),
      location: 'city',
      reward: { gold: 150, relics: 2 },
      ready: s => s.stage === 4 && !s.world.journey && s.realm >= 8 && s.wins >= 11
    },
    {
      id: 'storm-sword-duel',
      step: 3,
      title: text('Рассекая ветряные клинки клана Сяо', 'Severing the Gale Swords of the Xiao Clan'),
      text: text(
        'На помост взлетает надменный витязь Главного Клана Сяо. Его клинок создаёт сотни рассекающих вихрей ветра: «Ты посмел оскорбить имя нашей фамилии в провинции, червь!» Парируя выпады и предугадывая траекторию вихрей, ты перехватываешь инициативу и выбиваешь оружие из его ослабевших рук.',
        'Onto the stage glides the arrogant swordsman of the Xiao Main Sect. His blade conjures hundreds of slicing wind tornados: “You dared disgrace our clan’s name in the provinces, worm!” Parrying the gale flurries and reading their trajectory, you seize momentum and disarm him with pinpoint precision.'
      ),
      chronicle: text(
        'Вихри меча клана Сяо рассечены; высокомерный мастер повержен.',
        'The wind vortex blades of the Xiao Clan severed; the arrogant master humbled.'
      ),
      goal: text('Накопить 250 монет и 10 осколков (монеты ≥ 250, осколки ≥ 10).', 'Gather 250 coins and 10 shards (gold ≥ 250, relics ≥ 10).'),
      button: text('Обезоружить мастера ветра', 'Disarm the Wind Master'),
      location: 'city',
      reward: { gold: 180, reputation: 50 },
      ready: s => s.stage === 4 && !s.world.journey && (s.resources.gold || 0) >= 250 && (s.resources.relics || 0) >= 10
    },
    {
      id: 'asgard-ice-resonance',
      step: 4,
      title: text('Испытание Ледяного Облака', 'Resonance with the Frozen Cloud Barrier'),
      text: text(
        'В полуфинале тебе противостоит ледяная дева Обители Ледяного Облака. Её лазурный мороз сковывает дыхание и замедляет ток крови. Но древний нефритовый талисман, оставленный Маленькой Феей, начинает мерцать на твоей груди: ледяная аура признаёт тебя своим, открывая брешь для чистого бескровного завершения поединка.',
        'In the semi-finals, you face the frost maiden of the Frozen Cloud Asgard. Her azure frost numbs breath and chills the bloodstream. Yet the ancient jade talisman gifted by the Little Fairy pulses warmly upon your chest: the chilling aura acknowledges your karmic bond, yielding a graceful, bloodless victory.'
      ),
      chronicle: text(
        'Резонанс нефритового талисмана покорил ледяную стужу Ледяного Облака.',
        'Resonance of the jade talisman pacified the freezing chill of Frozen Cloud.'
      ),
      goal: text('Достичь 9-й ступени культивации и ци ≥ 100 (ступень ≥ 9, ци ≥ 100).', 'Attain Realm 9 and qi ≥ 100 (realm ≥ 9, qi ≥ 100).'),
      button: text('Растопить ледяную защиту', 'Melt the Frozen Defense'),
      location: 'city',
      reward: { qi: 120, reputation: 60 },
      ready: s => s.stage === 4 && !s.world.journey && s.realm >= 9 && (s.resources.qi || 0) >= 100
    },
    {
      id: 'burning-heir-standoff',
      step: 5,
      title: text('Поединок с Первым Гением Горящих Небес', 'Showdown with Burning Heaven Prodigy'),
      text: text(
        'Финал турнира. Против тебя выходит Фэнь Цзюэчэнь — наследник Врат Горящих Небес. Багровое пламя пожирает воздух арены: «Я испепелю тебя дотла перед глазами Принцессы!» Но жар его огня лишь забавляет Семя Злого Бога в твоём даньтяне: ты шагаешь сквозь стену огня, абсолютно невредимый!',
        'The tournament finals. Fen Juechen — heir of the Burning Heaven Gate — strides forward. Crimson fire devours the arena air: “I shall reduce you to ash before the Princess’s eyes!” Yet the scorching heat merely delights the Evil God’s Fire Seed within your dantian: you walk through the inferno untouched!'
      ),
      chronicle: text(
        'Пламя Горящих Небес поглощено без следа; наследник повергнут в ужас.',
        'The Burning Heaven inferno absorbed without a trace; the heir struck with dread.'
      ),
      goal: text('Одержать не менее 12 побед и тело ≥ 7.0 (побед ≥ 12, тело ≥ 7.0).', 'Attain at least 12 victories and body ≥ 7.0 (wins ≥ 12, body ≥ 7.0).'),
      button: text('Шагнуть сквозь багровое пламя', 'Walk Through the Crimson Fire'),
      location: 'city',
      reward: { gold: 200, reputation: 70 },
      ready: s => s.stage === 4 && !s.world.journey && s.wins >= 12 && s.body >= 7.0
    },
    {
      id: 'overlord-heavy-wrath',
      step: 6,
      title: text('Ярость Меча Повелителя: Расколотая Арена', 'Overlord Heavy Sword: Shattering the Arena'),
      text: text(
        'Обнажив исполинский Тяжёлый Меч Повелителя, ты вкладываешь в удар всю мощь истинной циркуляции. Чудовищная сила обрушивается на помост: каменные плиты арены взмывают в воздух и разлетаются тысячами осколков! Противник отброшен за пределы ринга, словно сухая ветвь бурей.',
        'Drawing the colossal Overlord Heavy Sword, you channel the complete fury of your profound channels. Monolithic force slams into the stage: stone pavers leap into the air, shattering into ten thousand fragments! Your foe is swept beyond the arena boundary like a dry leaf before a tempest.'
      ),
      chronicle: text(
        'Удар Меча Повелителя расколол арену; победа в решающем поединке турнира.',
        'The Overlord Sword strike shattered the arena floor; decisive tournament triumph.'
      ),
      goal: text('Улучшить оружие до уровня ≥ 2 и мастерство ≥ 30 (оружие ≥ 2, мастерство ≥ 30).', 'Upgrade weapon to level ≥ 2 and mastery ≥ 30 (weapon ≥ 2, mastery ≥ 30).'),
      button: text('Обрушить сокрушительный удар', 'Unleash the Devastating Strike'),
      location: 'city',
      reward: { gold: 250, relics: 3 },
      ready: s => s.stage === 4 && !s.world.journey && s.weapon >= 2 && s.mastery >= 30
    },
    {
      id: 'unmasking-treachery',
      step: 7,
      title: text('Разоблачение Заговора на Трибунах', 'Unmasking the Imperial Court Conspiracy'),
      text: text(
        'Обезумев от позора, старейшины Горящих Небес тайно активируют ядовитую формацию под трибунами, пытаясь устранить победителя и похитить принцессу. Но Небесная Жемчужина Яда моментально поглощает ядовитый туман, а ты прилюдно разоблачаешь предателей перед Императором!',
        'Maddened by humiliation, Burning Heaven elders secretly ignite a toxic formation beneath the galleries, plotting to execute the victor and seize the princess. Yet the Sky Poison Pearl instantly devours the venomous mist, and you expose the treachery before the Emperor himself!'
      ),
      chronicle: text(
        'Ядовитый заговор клана Горящих Небес нейтрализован Жемчужиной и разоблачён.',
        'Toxic conspiracy of Burning Heaven neutralized by the Pearl and publicly exposed.'
      ),
      goal: text('Спокойствие ≥ 95 и ци ≥ 120 (спокойствие ≥ 95, ци ≥ 120).', 'Calm ≥ 95 and qi ≥ 120 (calm ≥ 95, qi ≥ 120).'),
      button: text('Поглотить яд и разоблачить предателей', 'Absorb Poison & Expose Traitors'),
      location: 'city',
      reward: { reputation: 100, gold: 300 },
      ready: s => s.stage === 4 && !s.world.journey && s.calm >= 95 && (s.resources.qi || 0) >= 120
    },
    {
      id: 'champion-coronation',
      step: 8,
      title: text('Коронация Абсолютного Чемпиона Турнира', 'Coronation of the Grand Champion'),
      text: text(
        'Император Голубого Ветра лично поднимается с трона и венчает тебя Золотым Венцом Чемпиона: «Отныне ты — Первый Меч Империи и защитник нашего государства!» Тысячи зрителей и мастеров склоняются в благоговейном восторге. Твой статус легенды континента утверждён навсегда.',
        'The Emperor of Blue Wind rises from his throne and bestows upon you the Golden Crown of the Champion: “Henceforth, you are the First Sword of our Empire and the shield of our realm!” Thousands of cultivators and grandmasters bow in reverence. Your legend upon the continent is sealed forever.'
      ),
      chronicle: text(
        'Коронация Чемпиона завершена! Имя твоё вознесено на вершину боевого мира.',
        'Champion Coronation complete! Your name ascends to the peak of the martial world.'
      ),
      goal: text('Достичь 10-й ступени культивации, одержать не менее 13 побед и накопить 500 монет (ступень ≥ 10, побед ≥ 13, монеты ≥ 500).', 'Attain Realm 10, claim at least 13 victories and gather 500 coins (realm ≥ 10, wins ≥ 13, gold ≥ 500).'),
      button: text('Принять Золотой Венец Чемпиона', 'Accept Champion’s Golden Crown'),
      location: 'city',
      reward: { gold: 500, reputation: 150, relics: 5 },
      ready: s => s.stage === 4 && !s.world.journey && s.realm >= 10 && s.wins >= 13 && (s.resources.gold || 0) >= 500
    }
  ];

  function getScion(sectKey) {
    return scions[sectKey] || scions.gates;
  }

  // Pre-register interpolated scion duel variants for all sects
  for (const sc of Object.values(scions)) {
    const ruDuel = beats[3].text[0].replace('надменный витязь Главного Клана Сяо', `${sc.name[0]}, ${sc.role[0]}`);
    const enDuel = beats[3].text[1].replace('the arrogant swordsman of the Xiao Main Sect', `${sc.name[1]}, ${sc.role[1]}`);
    pairs.push([ruDuel, enDuel]);
  }

  function getBeat(s, index = (s.chapterFiveStep || 0), lang = 'ru') {
    if (s.stage < 4) return null;
    const base = beats[index];
    if (!base) return null;

    const sectKey = s.world.admission || 'gates';
    const scion = getScion(sectKey);
    const i = lang === 'en' ? 1 : 0;

    let textVal = base.text[i];
    if (base.id === 'storm-sword-duel') {
      textVal = textVal.replace(
        i === 0 ? 'надменный витязь Главного Клана Сяо' : 'the arrogant swordsman of the Xiao Main Sect',
        `${scion.name[i]}, ${scion.role[i]}`
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

  function isReady(s, step = (s.chapterFiveStep || 0)) {
    const b = beats[step];
    return b ? b.ready(s) : false;
  }

  function action(s, value, api) {
    const step = s.chapterFiveStep || 0;
    const b = beats[step];
    if (!b || !b.ready(s)) return false;

    for (const [k, v] of Object.entries(b.reward || {})) {
      if (s.resources[k] !== undefined) s.resources[k] += v;
    }
    if (api && api.log) {
      api.log(s, `【ГЛАВА 5 · ЭПИЗОД ${step + 1}】 ${b.title[0]} завершён! ${b.chronicle[0]}`);
    }

    s.chapterFiveStep = step + 1;
    return true;
  }

  function systemDirective(s, step = (s.chapterFiveStep || 0), lang = 'ru') {
    const i = lang === 'en' ? 1 : 0;
    const directives = {
      0: {
        world: text('Официальное место участника Арены Семи Сект и 120 монет', 'Official Seven Sects Arena contender seat & 120 coins'),
        system: text('Синхронизация с полем Арены · Подавление посторонних помех: 100%', 'Arena field synchronization · Interference suppression: 100%')
      },
      1: {
        world: text('Боевой жребий претендента на славу и 80 единиц Ци', 'Contender battle draw & 80 Profound Qi'),
        system: text('Имперский протокол активирован · Точность анализа боевых стоек +25%', 'Imperial protocol active · Stance analysis precision +25%')
      },
      2: {
        world: text('Осколки щита Оплота из лавового камня и 150 монет', 'Basalt shield fragments of the Bastion & 150 coins'),
        system: text('Пробитие брони зафиксировано · Урон по стойке увеличен на 30%', 'Armor pierce confirmed · Poise break damage boosted by 30%')
      },
      3: {
        world: text('Трофейный перстень мастера ветра и 180 монет', 'Wind Master’s trophy ring & 180 coins'),
        system: text('Анализ воздушных вихрей · Скорость парирования увеличена на 20%', 'Gale analysis complete · Parry speed boosted by 20%')
      },
      4: {
        world: text('Дар признания Ледяного Облака и 120 духовной энергии', 'Frozen Cloud recognition gift & 120 spiritual energy'),
        system: text('Резонанс талисмана Жасмин · Сопротивление холоду: абсолютное', 'Jasmine talisman resonance · Frost resistance: absolute')
      },
      5: {
        world: text('Унижение клана Горящих Небес и 200 монет триумфа', 'Humiliation of Burning Heaven & 200 triumph coins'),
        system: text('Семя Злого Бога поглотило эссенцию огня · Урон пламенем +40%', 'Evil God Seed absorbed fire essence · Flame damage +40%')
      },
      6: {
        world: text('Расколотый помост Арены и 250 монет за решающий нокаут', 'Shattered arena floor & 250 coins for decisive knockout'),
        system: text('Резонанс Меча Повелителя · Оглушение при ударе: максимальное', 'Overlord Sword resonance · Stun impact: maximum')
      },
      7: {
        world: text('Благодарность Принцессы и 300 монет за спасение трибун', 'Princess’s gratitude & 300 coins for grandstand rescue'),
        system: text('Жемчужина поглотила яд формации · Очищение от токсинов: 100%', 'Pearl absorbed formation poison · Toxin purge: 100%')
      },
      8: {
        world: text('Золотой Венец Чемпиона и 500 монет имперской награды', 'Champion’s Golden Crown & 500 imperial reward coins'),
        system: text('Великий Триумф! Достигнут статус Абсолютного Чемпиона Семи Сект', 'Grand Triumph! Undisputed Champion of Seven Sects attained')
      }
    };

    const d = directives[step] || {
      world: text('Награда Имперского Турнира', 'Imperial Tournament reward'),
      system: text('Развитие пути Чемпиона', 'Champion path advancement')
    };

    return {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · ИМПЕРСКИЙ ТУРНИР', 'INSIGHT SYSTEM · IMPERIAL TOURNAMENT')[i],
      prompt: `«[${beats[step] ? beats[step].goal[i] : (i === 1 ? 'Prepare for the next stage' : 'Готовиться к следующему этапу')}]».`,
      world: d.world[i],
      system: d.system[i]
    };
  }

  function getStoryBranches(s, lang = 'ru') {
    const curStep = s.stage > 4 ? 9 : (s.chapterFiveStep || 0);
    const i = lang === 'en' ? 1 : 0;
    const branches = [];

    if (curStep >= 2) {
      branches.push({
        id: 'ch5-bastion-shattered',
        title: text('Сокрушитель Оплота', 'Bastion Crusher')[i],
        desc: text('Ты расколол легендарный щит Железного Оплота, доказав неоспоримое превосходство своего стиля.', 'You shattered the legendary Iron Bastion shield, proving the absolute supremacy of your martial style.')[i],
        karma: text('Слава', 'Renown')[i],
        character: text('Те Лун', 'Tie Long')[i]
      });
    }

    if (curStep >= 4) {
      branches.push({
        id: 'ch5-ice-alliance',
        title: text('Узы Ледяного Облака', 'Frozen Cloud Alliance')[i],
        desc: text('Резонанс нефритового талисмана позволил одержать бескровную победу и укрепить узы с девами Ледяного Облака.', 'Resonance with the jade talisman secured a bloodless victory and deepened ties with the Frozen Cloud maidens.')[i],
        karma: text('Милосердие', 'Compassion')[i],
        character: text('Маленькая Фея', 'Little Fairy')[i]
      });
    }

    if (curStep >= 6) {
      branches.push({
        id: 'ch5-heavy-sword-triumph',
        title: text('Гнев Повелителя', 'Wrath of the Overlord')[i],
        desc: text('Взмах исполинского меча расколол Арену Столицы и низверг пламя Горящих Небес.', 'A swing of the colossal heavy sword cracked the Capital Arena and extinguished the Burning Heaven flame.')[i],
        karma: text('Доминирование', 'Dominance')[i],
        character: text('Фэнь Цзюэчэнь', 'Fen Juechen')[i]
      });
    }

    if (curStep >= 8) {
      branches.push({
        id: 'ch5-imperial-champion',
        title: text('Абсолютный Чемпион', 'Undisputed Champion')[i],
        desc: text('Приняв Золотой Венец из рук Императора, ты стал Первым Мечом Империи Голубого Ветра.', 'Accepting the Golden Crown from the Emperor, you became the First Sword of the Blue Wind Empire.')[i],
        karma: text('Триумф', 'Triumph')[i],
        character: text('Император Цан Вань', 'Emperor Cang Wan')[i]
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
    root.IsekaiChapterFive = api;
  }
})(globalThis);
