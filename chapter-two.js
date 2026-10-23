(function(root){
  'use strict';

  const W = typeof module !== 'undefined' && module.exports ? require('./world.js') : root.IsekaiWorld;
  const S = typeof module !== 'undefined' && module.exports ? require('./sects.js') : root.IsekaiSects;

  const pairs = [];
  const text = (ru, en) => { pairs.push([ru, en]); return [ru, en]; };

  const scions = {
    rescue: { name: text('Люй Фэн', 'Lu Feng'), role: text('племянник старейшины Зала Пилюль', 'nephew of the Pill Hall Elder') },
    remains: { name: text('Сяо Цзянь', 'Xiao Jian'), role: text('высокомерный сын мастера меча', 'arrogant son of the Sword Master') },
    invitation: { name: text('Хань Мин', 'Han Ming'), role: text('кузен архивариуса тайных знаков', 'cousin of the Secret Sigils Archivist') },
    gates: { name: text('Те Шань', 'Tie Shan'), role: text('племянник начальника стражи оплота', 'nephew of the Bastion Guard Chief') }
  };

  text('жизнь во внешнем дворе секты.', 'life in the outer sect courtyard.');
  text('Шаги второй главы', 'Second chapter steps');
  text('Глава 2: Врата секты', 'Chapter 2: Sect Gates');
  text('Завершена', 'Completed');
  text('Врата', 'Gates');
  text('Труд', 'Labor');
  text('Свитки', 'Scrolls');
  text('Смотр', 'Exam');
  text('Пилюли', 'Pills');
  text('Оружие', 'Arms');
  text('Вызов', 'Duel');
  text('Архив', 'Archive');
  text('Турнир', 'Tournament');
  text('Врата секты достигнуты', 'Sect gates reached');
  text('В пути или вне города', 'In transit or outside city');
  text('Войти в ворота города', 'Enter city gates');
  text('Упражнения', 'Exercises');
  text('Медитировать для накопления ци', 'Meditate to accumulate qi');
  text('Медитация активна (+ци)', 'Meditation active (+qi)');
  text('Боевая мощь', 'Power');
  text('Выйти на арену чести', 'Enter arena of honor');
  text('Постигать основы (медитация)', 'Study foundation (meditation)');
  text('Постижение свитков идёт', 'Studying scriptures active');
  text('Сразиться в турнире внешних учеников', 'Fight in outer disciples’ tournament');
  text('Текущий эпизод (активный)', 'Current episode (active)');
  text('Глава 2 · Эпизод', 'Chapter 2 · Episode');
  text('📖 Открыть этот эпизод', '📖 Open this episode');
  text('Первый ученик внешнего круга', 'Top Disciple of the Outer Circle');
  text('Турнир завершён, лазурный пояс получен. Врата внутреннего двора распахнуты навстречу истинным тайнам культивации.', 'The tournament is won, the azure sash bestowed. The inner gates swing wide toward the true mysteries of cultivation.');
  text('ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 1 · ФИНАЛ ВРАТ СЕКТЫ', 'AGAINST THE GODS · VOL. 1 · FINALE OF SECT GATES');
  text('Сварено пилюль: ', 'Pills brewed: ');
  text('Оружие: ', 'Weapon: ');
  text('Боевой стиль: ', 'Combat style: ');
  text('✦ Присесть (-3)', '✦ Squat (-3)');
  text('✦ Пробежка (-5)', '✦ Run (-5)');
  text('⚡ Совершить Прорыв меридианов', '⚡ Perform Meridian Breakthrough');
  text('☯ Медитировать для накопления ци', '☯ Meditate to accumulate qi');
  text('⚔ Выйти на арену чести', '⚔ Enter arena of honor');
  text('☯ Постигать основы (медитация)', '☯ Study foundation (meditation)');
  text('🧪 Открыть Алхимический котёл', '🧪 Open Alchemy Crucible');
  text('⚔ Закалить оружие', '⚔ Temper weapon');
  text('☯ Медитировать для расшифровки', '☯ Meditate for decryption');
  text('⚔ Сразиться на арене турнира', '⚔ Fight in tournament arena');
  text('Стиль: ', 'Style: ');
  text('Равновесие', 'Balanced');
  text('Быстрый шаг', 'Swift step');
  text('Пробивающий удар', 'Piercing strike');
  text('Духовный заслон', 'Spiritual ward');

  const beats = [
    // Beat 0: Arrival at Outer Court & Neophyte Registration
    {
      id: 'outer-arrival',
      step: 0,
      title: text('Врата великой секты', 'Gates of the Great Sect'),
      text: text(
        'Повозка дяди Ба остаётся у городских ворот, а перед тобой вздымаются монументальные каменные своды секты. Десятки молодых людей в пыльных одеждах с замиранием сердца ждут решения распорядителей. Предъявив рекомендательный знак, полученный у Серебряного Моста, ты проходишь сквозь массивные створки во внешний двор. Дежурный смотритель придирчиво осматривает твою печать и выдаёт серые одежды послушника с деревянной биркой внешнего круга: первый шаг в обители бессмертных сделан.',
        'Uncle Ba’s cart remains at the city gates, while before you loom the monumental stone vaults of the sect. Scores of youths in dusty garments wait with bated breath before the overseers. Presenting the recommendation token received at the Silver Bridge, you pass beneath the massive gates into the outer courtyard. The duty steward sternly examines your seal and issues the gray robes of an initiate along with the wooden plaque of the outer ring: your first step into the immortal domain is taken.'
      ),
      chronicle: text(
        'Деревянная бирка ученика закреплена на поясе. Холод гранитных плит напоминает: здесь никто не спросит о твоём благородстве, важна лишь чистота пути.',
        'The wooden disciple plaque is fastened to your sash. The cold granite pavers remind you: here no one asks of noble blood, only the purity of the path matters.'
      ),
      goal: text('Подтвердить регистрацию в журнале внешнего двора секты.', 'Confirm your registration in the outer court ledger of the sect.'),
      button: text('Принять одежды послушника', 'Accept initiate robes'),
      location: 'city',
      reward: { gold: 25 },
      ready: s => s.stage === 1 && !s.world.journey && s.world.location === 'city'
    },

    // Beat 1: Assignment of Sect Duties & Initiation Labor
    {
      id: 'sect-duties',
      step: 1,
      title: text('Послушание и честный труд', 'Initiation and Honest Labor'),
      text: text(
        '«Прежде чем прикасаться к свиткам и обнажать духовное оружие, каждый послушник обязан доказать свою преданность и выдержку!» — разносится громовой голос старшего надсмотрщика по плацу. Бессмертный путь не терпит праздности: одни направляются на расчистку горных троп и прополку террас с целебными травами, другие — к жаровням плавилен и базальтовым карьерам. Честный труд разгоняет кровь по очищенным каналам и приносит первые заслуги перед школой.',
        '“Before touching scriptures or brandishing spiritual arms, every initiate must prove their diligence and grit!” booms the senior warden across the parade grounds. The immortal path tolerates no idleness: some are assigned to clear mountain paths and weed medicinal terraces, others to smelting braers and basalt quarries. Honest labor circulates blood through cleansed channels and earns your first merit points.'
      ),
      chronicle: text(
        'Первая смена послушания завершена. Мышцы приятно ноют от напряжения, а жетон ученика скреплён первой официальной печатью за службу.',
        'The first shift of sect duties is complete. Muscles ache with satisfying strain, and your disciple plaque bears its first official merit seal.'
      ),
      goal: text('Выполнить трудовой заказ или укрепить тело тренировками (тело ≥ 2.5).', 'Complete a work contract or temper your body through training (body ≥ 2.5).'),
      button: text('Сдать нормы послушания', 'Submit duty merit'),
      location: 'city',
      reward: { gold: 35, reputation: 10 },
      ready: s => s.stage === 1 && !s.world.journey && s.world.location === 'city' && (s.body >= 2.5 || (s.clicks.squat + s.clicks.run >= 25) || s.employment.completed >= 1)
    },

    // Beat 2: Pavilion of Sacred Scriptures
    {
      id: 'foundation-scriptures',
      step: 2,
      title: text('Павильон священных свитков', 'Pavilion of Sacred Scriptures'),
      text: text(
        'Заслужив первые почести послушания, ты переступаешь порог Павильона Священных Свитков. Воздух здесь напоён ароматом сухой сосновой смолы и древнего пергамента. Сотни стеллажей уходят ввысь к резным стропилам пагоды. Дежурный смотритель архива указывает на полки базовых техник школы. Сосредоточив внутренний взор, ты впитываешь структуру движения энергии и постигаешь основы циркуляции, укрепляя свой духовный фундамент.',
        'Having earned your first merit of obedience, you step across the threshold of the Pavilion of Sacred Scriptures. The air here is rich with the scent of aged pine resin and ancient parchment. Tier upon tier of book-stacks rise toward the carved rafters of the pagoda. The archival duty elder gestures toward the shelves of foundational sect techniques. Focusing your inner sight, you absorb the circulation flows of profound energy, fortifying your spiritual foundation.'
      ),
      chronicle: text(
        'Свитки базовых техник секты изучены. Чистая энергия наполняет даньтянь, а духовное понимание вышло на новый уровень.',
        'The sect’s foundational scrolls have been studied. Pristine qi fills your dantian, lifting your spiritual perception to new heights.'
      ),
      goal: text('Накопить не менее 15 ци, изучить вторую технику или развить понимание до 30.', 'Accumulate at least 15 qi, learn a second technique, or raise insight to 30.'),
      button: text('Запечатлеть основы в памяти', 'Imprint foundations in memory'),
      location: 'city',
      reward: { qi: 25, relics: 1 },
      ready: s => s.stage === 1 && !s.world.journey && s.world.location === 'city' && (s.resources.qi >= 15 || Object.keys(s.cultivation.learned).length >= 2 || s.xp >= 30)
    },

    // Beat 3: Elder Mentor's Trial: Channel Examination
    {
      id: 'mentor-exam',
      step: 3,
      title: text('Испытание наставника школы', 'Elder Mentor’s Trial'),
      text: text(
        'Наступает день ежемесячного смотра основ. Наставник школы собирает новичков у алтаря духа. Тяжёлая ладонь мастера опускается на твоё плечо, вливая тонкую струну лазурной ци для проверки даньтяня. Взгляд наставника внезапно замирает: «Странно... Каналы от рождения несут следы тяжёлых повреждений, но текущая в них сила поразительно чиста, словно ключевая вода без крупицы мирской скверны!» Мастер скупо одобряет твою стойкость и дарует доступ к рукописи базовых дыхательных приёмов секты.',
        'The day of the monthly foundation inspection arrives. The sect instructor gathers neophytes before the spirit altar. The master’s heavy palm rests on your shoulder, sending a thread of azure qi to probe your dantian. The instructor’s gaze suddenly stiffens: “Remarkable... Your meridians bear scars of severe birth defects, yet the vitality flowing within is astonishingly pristine, like spring water without a speck of mortal taint!” The master nods in approval and grants access to the sect’s core breathing manuscript.'
      ),
      chronicle: text(
        'Осмотр наставника пройден. Небесная Жемчужина Яда скрыла истинную тайну божественного очищения, оставив лишь впечатление безупречного упорства.',
        'The instructor’s inspection is passed. The Sky Poison Pearl concealed the divine origin of your purification, leaving only an impression of flawless grit.'
      ),
      goal: text('Достичь 2-й ступени культивации (Прорыв меридианов II) и накопить от 20 духовной энергии.', 'Reach cultivation Realm 2 (Meridian Breakthrough II) and accumulate at least 20 spiritual qi.'),
      button: text('Показать чистоту каналов наставнику', 'Demonstrate channel purity to mentor'),
      location: 'city',
      reward: { qi: 25, reputation: 15 },
      ready: s => s.stage === 1 && !s.world.journey && s.world.location === 'city' && s.realm >= 2 && s.resources.qi >= 20
    },

    // Beat 4: Pill Hall and Pearl Purification
    {
      id: 'pill-refining',
      step: 4,
      title: text('Зал Пилюль и Очищение Жемчужины', 'Pill Hall and Pearl Purification'),
      text: text(
        'В Зале Пилюль секты царит нестерпимый жар: сотни бронзовых котлов гудят над подземным огнём, а воздух пропитан горечью лекарственной гари. Ученики-алхимики стонут от неудач: обычные травы содержат ядовитые шлаки, отравляющие эликсиры. Подойдя к жаровне, ты незаметно погружаешь пучок горных трав в ладонь. Небесная Жемчужина Яда мгновенно высасывает весь смертоносный осадок — рождённая пилюля сияет безупречным изумрудным блеском абсолютной стопроцентной чистоты без капли токсинов! Старейшина Зала Пилюль потрясённо разглядывает творение новичка.',
        'Searing heat dominates the sect’s Pill Hall: scores of bronze cauldrons roar over subterranean flames, the air thick with the acrid stench of medicinal ash. Apprentice alchemists groan over failures: common herbs harbor mortal impurities that taint ordinary brews. Stepping to a brazier, you discreetly channel a handful of mountain herbs through your palm. The Sky Poison Pearl hungrily siphons every trace of toxic dross — the resulting elixir glows with a mesmerizing emerald brilliance of absolute 100% purity without a speck of pill poison! The Pill Hall Elder gapes in stunned disbelief.'
      ),
      chronicle: text(
        'Безупречная пилюля сварена без капли токсинов. Слава о твоём редком алхимическом чутье разнеслась среди мастеров Зала Пилюль.',
        'A flawless pill was brewed with zero medicinal poison. Renown of your uncanny alchemical intuition spreads among the masters of the Pill Hall.'
      ),
      goal: text('Сварить любую пилюлю в котле или собрать от 15 трав для алхимического запаса.', 'Brew any pill in the crucible or gather at least 15 herbs for alchemical reserves.'),
      button: text('Предъявить очищенную пилюлю мастерам', 'Present purified pill to the masters'),
      location: 'city',
      reward: { herbs: 15, gold: 40, reputation: 15 },
      ready: s => s.stage === 1 && !s.world.journey && s.world.location === 'city' && ((s.alchemy && s.alchemy.stats && s.alchemy.stats.brews >= 1) || s.resources.herbs >= 15 || s.resources.pills >= 1)
    },

    // Beat 5: Weapon Tempering and Combat Style
    {
      id: 'weapon-mastery',
      step: 5,
      title: text('Закалка оружия и боевой стиль', 'Weapon Tempering and Combat Style'),
      text: text(
        'На открытом плацу под горным ветром инструктор оружия секты проверяет готовность учеников к настоящим сражениям. Одни упражняются с прямыми клинками, другие закаляют кулаки о железное дерево или выверяют стойку щита. «Оружие — это продолжение меридианов! Выбери свой боевой стиль и закали клинок, иначе в первом же настоящем бою вражеская ци расколет твоё оружие в щепки!» Ты выбираешь боевой ритм и проводишь серию сокрушительных выпадов, заставляя стального инструктора уважительно приподнять бровь.',
        'Upon the windswept outer grounds, the sect arms instructor evaluates disciples’ readiness for authentic mortal combat. Some spar with straight swords, others condition knuckles against ironwood or test defensive poise. “A weapon is but an extension of your meridians! Hone your combat style and forge your steel, or the first blast of hostile qi in the wild will shatter your blade to splinters!” Aligning your martial tempo, you execute a barrage of precise strikes that earns an approving nod from the stern instructor.'
      ),
      chronicle: text(
        'Боевой стиль утверждён, а клинок закалён духовной энергией. Твоя боевая мощь готова к вызовам арены чести.',
        'Combat style confirmed and weapon tempered with spiritual intent. Your battle poise is primed for the trials of the honor arena.'
      ),
      goal: text('Закалить оружие до 1-го ранга, сменить боевой стиль или развить боевое мастерство.', 'Temper your weapon to rank 1, change combat style, or raise weapon mastery.'),
      button: text('Продемонстрировать боевую форму', 'Demonstrate martial form'),
      location: 'city',
      reward: { gold: 50, reputation: 20 },
      ready: s => s.stage === 1 && !s.world.journey && s.world.location === 'city' && (s.weapon >= 1 || s.mastery >= 1 || s.style !== 'balanced' || (s.world.visits && s.world.visits.mountains > 0))
    },

    // Beat 6: Confrontation with the Arrogant Scion
    {
      id: 'scion-conflict',
      step: 6,
      title: text('Вызов высокомерного наследника', 'Challenge of the Arrogant Scion'),
      text: text(
        'Твои успехи не остаются незамеченными. На выходе из Зала Пилюль дорогу преграждает группа старших внешних учеников. Впереди выступает надменный юноша в шёлковых одеждах с золотым шитьём — отпрыск влиятельного старейшины. «Эй, безродный выскочка! Слышал, мастера хвалят твои эликсиры и форму каналов? Ты возомнил о себе слишком много. Отдай свою месячную долю пилюль и опусти глаза, если не хочешь провести остаток года в лазарете!» Вокруг собирается толпа адептов: время отстоять честь и показать, чего стоит закалка!',
        'Your rapid rise does not go unnoticed. Leaving the Pill Hall, a coterie of senior outer disciples blocks your path. Stepping forward with an arrogant sneer is a silk-clad youth with golden embroidery — the scion of an influential elder. “Hey, clanless upstart! Word is the masters praise your elixirs and channel purity? You’ve grown far too bold. Surrender your monthly pill quota and keep your head down, unless you fancy spending the semester in the infirmary!” A crowd gathers: it is time to defend your honor!'
      ),
      chronicle: text(
        'Вызов высокомерного отпрыска принят. Ты показал, что твёрдость духа и отточенная техника сокрушают любое напускное превосходство.',
        'The arrogant scion’s provocation was met head-on. You proved that iron resolve and refined technique shatter hollow arrogance.'
      ),
      goal: text('Одержать не менее 2 побед на арене или доказать силу (побед ≥ 2 или побед ≥ 1 и сила ≥ 60).', 'Achieve at least 2 arena victories or prove your might (wins ≥ 2 or wins ≥ 1 and power ≥ 60).'),
      button: text('Поставить выскочку на место', 'Put the arrogant scion in his place'),
      location: 'city',
      reward: { gold: 60, reputation: 30 },
      ready: s => s.stage === 1 && !s.world.journey && s.world.location === 'city' && (s.wins >= 2 || (s.wins >= 1 && (E => E.power(s) >= 60)(typeof module !== 'undefined' && module.exports ? require('./engine.js') : root.Isekai)))
    },

    // Beat 7: Secret Passage to the Forbidden Archive
    {
      id: 'forbidden-archive',
      step: 7,
      title: text('Тайный лаз в Запретный архив', 'Secret Passage to the Forbidden Archive'),
      text: text(
        'Глубокой ночью Небесная Жемчужина Яда в левой ладони начинает тревожно пульсировать жаром. Следуя зову невидимой багрово-изумрудной нити, ты бесшумно огибаешь ночные патрули и спускаешься в заброшенные катакомбы под фундаментом архивной пагоды. В тупиковом коридоре за потрескавшейся кладкой обнаруживается древняя дверь, покрытая запечатывающим чёрным пеплом. Веками никто не рисковал прикоснуться к ядовитой порче древних чар, но ладонь с Жемчужиной жадно поглощает губительный смрад, открывая тайник с запретными реликвиями эпохи Злого Бога!',
        'In the dead of night, the Sky Poison Pearl in your left palm pulses with a hot, rhythmic urgency. Guided by an invisible crimson-emerald thread, you slip past nocturnal sentries and descend into the forgotten crypts beneath the archival pagoda. Behind a fractured wall lies an ancient portal coated in sealing black ash. For centuries, none dared touch the toxic curse of these ancient wards, but your pearl-bearing hand hungrily drinks the baleful miasma, unsealing a hidden vault of ancient forbidden relics from the Evil God era!'
      ),
      chronicle: text(
        'Древняя печать поглощена Небесной Жемчужиной. В твоих руках сияют редчайшие духовные осколки, необходимые для решающего восхождения.',
        'The ancient seal was absorbed by the Sky Poison Pearl. In your grasp gleam rare spiritual relics required for the decisive ascension.'
      ),
      goal: text('Накопить понимание и реликвии для подготовки к турниру (понимание ≥ 50, осколки ≥ 3).', 'Accumulate understanding and relics in preparation for the tournament (understanding ≥ 50, relics ≥ 3).'),
      button: text('Забрать очищенные реликвии', 'Claim cleansed relics'),
      location: 'city',
      reward: { relics: 3, qi: 35 },
      ready: s => s.stage === 1 && !s.world.journey && s.world.location === 'city' && s.xp >= 50
    },

    // Beat 8: Grand Outer Disciples' Tournament
    {
      id: 'outer-tournament',
      step: 8,
      title: text('Турнир чести внешних учеников', 'The Grand Outer Disciples’ Tournament'),
      text: text(
        'Над главной площадью секты звучат боевые барабаны. Великий ежегодный турнир внешнего круга собрал сотни адептов и старейшин на парящих трибунах. На каменном помосте решается, кто получит право перешагнуть порог внутренних палат и обрести звание полноправного ученика секты. Выходя в финал под прицелом сотен взглядов, ты демонстрируешь сокрушительную мощь очищенных меридианов. Финальный удар потрясает каменные плиты — трибуны взрываются возгласами восхищения, а сам великий наставник лично вручает тебе лазурный шёлковый пояс!',
        'War drums thunder over the central plaza of the sect. The Grand Annual Outer Circle Tournament has gathered hundreds of disciples and high elders upon soaring viewing pavilions. On the stone arena, it is decided who earns the right to cross into the inner halls as a recognized outer disciple. Reaching the grand finale under the scrutiny of hundreds, you unleash the devastating might of your purified meridians. Your final strike rocks the arena pavers — the audience erupts in awe, and the head mentor personally fastens the azure silk sash of honor!'
      ),
      chronicle: text(
        'Турнир внешних учеников выигран! Имя новоявленного гения разносится по всем павильонам Города Полумесяца, а врата к внутренней жизни школы распахнуты настежь.',
        'The Outer Disciples’ Tournament is won! The name of the rising prodigy echoes across the pavilions of Crescent City, and the gates to the inner sect swing wide open.'
      ),
      goal: text('Одержать не менее 3 побед на испытаниях и достичь 3-й ступени (ступень 3, побед ≥ 3, монет ≥ 150).', 'Achieve at least 3 duel victories and reach Realm 3 (realm 3, wins ≥ 3, gold ≥ 150).'),
      button: text('Принять титул первого ученика', 'Accept Title of Champion Disciple'),
      location: 'city',
      reward: { gold: 150, reputation: 50 },
      ready: s => s.stage === 1 && !s.world.journey && s.world.location === 'city' && s.realm >= 3 && s.wins >= 3 && s.resources.gold >= 150
    }
  ];

  function getScion(sectKey) {
    return scions[sectKey] || scions.gates;
  }

  // Pre-register interpolated scion duel variants for all sects
  for (const sc of Object.values(scions)) {
    const ruDuel = beats[6].text[0].replace('отпрыск влиятельного старейшины', `${sc.name[0]}, ${sc.role[0]}`);
    const enDuel = beats[6].text[1].replace('the scion of an influential elder', `${sc.name[1]}, ${sc.role[1]}`);
    pairs.push([ruDuel, enDuel]);
  }

  function getBeat(s, index = (s.chapterTwoStep || 0), lang = 'ru') {
    if (s.stage !== 1) return null;
    const base = beats[index];
    if (!base) return null;

    const sectKey = s.world.admission || 'gates';
    const scion = getScion(sectKey);
    const i = lang === 'en' ? 1 : 0;

    let textVal = base.text[i];
    if (base.id === 'scion-conflict') {
      textVal = lang === 'en'
        ? textVal.replace('the scion of an influential elder', `${scion.name[1]}, ${scion.role[1]}`)
        : textVal.replace('отпрыск влиятельного старейшины', `${scion.name[0]}, ${scion.role[0]}`);
    }

    const beat = {
      ...base,
      title: base.title[i],
      text: textVal,
      chronicle: base.chronicle[i],
      microText: base.chronicle[i],
      goal: base.goal[i],
      button: base.button[i],
      sect: sectKey,
      scionName: scion.name[i],
      scionRole: scion.role[i]
    };

    return beat;
  }

  function isReady(s, index = (s.chapterTwoStep || 0)) {
    if (s.stage !== 1) return false;
    const b = beats[index];
    return b ? b.ready(s) : false;
  }

  function action(s, value, api) {
    if (s.stage !== 1) return false;
    const step = s.chapterTwoStep || 0;
    if (step >= beats.length) return false;

    const b = beats[step];
    if (!b || !b.ready(s)) return false;

    // Apply rewards
    for (const [k, v] of Object.entries(b.reward || {})) {
      s.resources[k] = (s.resources[k] || 0) + v;
    }

    if (step === 6) {
      // Scion confrontation: guarantee at least 2 wins
      s.wins = Math.max(s.wins, 2);
    } else if (step === 7) {
      // Forbidden archive relics
      s.resources.relics = Math.max(s.resources.relics, 3);
    } else if (step === 8) {
      // Tournament finale: ensure wins >= 3 and gold >= 150
      s.wins = Math.max(s.wins, 3);
      s.resources.gold = Math.max(s.resources.gold, 150);
    }

    s.chapterTwoStep = (s.chapterTwoStep || 0) + 1;
    if (s.unlocked) {
      s.unlocked.sect = true;
      if (step >= 1) s.unlocked.pavilion = true;
      if (step >= 2) s.unlocked.clinic = true;
      if (step >= 3) { s.unlocked.auction = true; s.unlocked.flames = true; s.unlocked.cauldrons = true; }
      if (step >= 4) { s.unlocked.beastRange = true; s.unlocked.venoms = true; }
      if (step >= 6) s.unlocked.jasmine = true;
    }
    if (api?.log) {
      const lang = root.IsekaiLocale?.language || 'ru';
      api.log(s, lang === 'en' ? `Chapter 2: ${b.title[1]}` : `Глава 2: ${b.title[0]}`);
    }
    return true;
  }

  const directiveDefs = [
    // 0: Arrival
    {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · ПРОТОКОЛ ВРАТ СЕКТЫ', 'INSIGHT SYSTEM · SECT ENTRY PROTOCOL'),
      prompt: text(
        '«[Прибытие подтверждено. Целевая область: Внешнее святилище Великой Секты. Директива: подтвердить регистрацию и привязать жетон послушника к системе]».',
        '“[Arrival confirmed. Target domain: Great Sect Outer Sanctuary. Directive: complete registration and link disciple token to system]”.'
      ),
      world: text('Одежды послушника и медное жалование (+25 монет)', 'Initiate robes & copper allowance (+25 coins)'),
      system: text('Резонанс Жемчужины +0.5% · Мышечный каркас +0.1', 'Pearl resonance +0.5% · Muscular foundation +0.1')
    },
    // 1: Duties
    {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · ОЦЕНКА ЗАСЛУГ', 'INSIGHT SYSTEM · MERIT EVALUATION'),
      prompt: text(
        '«[Рекомендация: закалка меридианов через физическое послушание. Наработка мышечной памяти и сбор заслуг перед сектой]».',
        '“[Recommendation: channel conditioning through repetitive labor. Build muscle memory and accumulate sect merits]”.'
      ),
      world: text('Печать признания заслуг (+10 репутации, +35 монет)', 'Sect merit seal (+10 reputation, +35 coins)'),
      system: text('Плотность сухожилий +0.2 · Синхронизация выносливости', 'Tendon durability +0.2 · Stamina regeneration synchronized')
    },
    // 2: Scriptures
    {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · ПОСТИЖЕНИЕ СВИТКОВ', 'INSIGHT SYSTEM · SCRIPTURE COMPREHENSION'),
      prompt: text(
        '«[Обнаружен Павильон Свитков. Рекомендация: впитать циркуляцию базовых сутр школы и укрепить ядро ци]».',
        '“[Scripture Pavilion located. Recommendation: absorb core circulation paths and fortify inner qi foundation]”.'
      ),
      world: text('Свитки базовых техник секты (+25 энергии, +1 осколок)', 'Foundational scripture scrolls (+25 qi, +1 relic)'),
      system: text('Калибровка потоков ци +10% · Духовное прозрение углублено', 'Qi circulation calibrated +10% · Spiritual comprehension deepened')
    },
    // 3: Mentor exam
    {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · АУДИТ МЕРИДИАНОВ', 'INSIGHT SYSTEM · MERIDIAN AUDIT'),
      prompt: text(
        '«[Приближение экзаменатора. Запущен протокол маскировки: скрыть эманации Небесного Яда, проецируя безупречную чистоту каналов]».',
        '“[Elder inspection imminent. Masking Protocol engaged: conceal Heavenly Poison signature, project pure cultivation foundation]”.'
      ),
      world: text('Личная похвала наставника (+15 репутации, +25 энергии)', 'Mentor’s personal commendation (+15 reputation, +25 qi)'),
      system: text('Протокол маскировки 100% стабилен · Плотность ци +10%', 'Concealment protocol 100% stable · Qi density +10%')
    },
    // 4: Pill refining
    {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · ОЧИЩЕНИЕ ЭЛИКСИРОВ', 'INSIGHT SYSTEM · ELIXIR PURIFICATION'),
      prompt: text(
        '«[Зал Пилюль: токсичные примеси сырья снижают эффективность. Протокол Небесной Жемчужины: очистить травы до 100% чистоты]».',
        '“[Pill Hall: toxic impurities impair efficacy. Sky Poison Pearl Protocol: purify herbs to 100% absolute purity]”.'
      ),
      world: text('Очищенная пилюля абсолютной чистоты (+15 трав, +40 монет, +15 репутации)', 'Purified 100% flawless pill (+15 herbs, +40 coins, +15 rep)'),
      system: text('Алхимический резонанс открыт · Токсины полностью нейтрализованы', 'Alchemical resonance engaged · Medicinal poison fully neutralized')
    },
    // 5: Weapon mastery
    {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · БОЕВАЯ ФОРМА', 'INSIGHT SYSTEM · COMBAT FORM'),
      prompt: text(
        '«[Испытание оружия: синхронизировать выбранный боевой стиль с меридианами клинка. Рекомендация: отточить боевую точность]».',
        '“[Weapon trial: synchronize chosen martial tempo with blade meridians. Recommendation: sharpen combat poise]”.'
      ),
      world: text('Закалка оружия и признание инструктора (+50 монет, +20 репутации)', 'Tempered weapon & instructor acclaim (+50 coins, +20 rep)'),
      system: text('Боевой стиль зафиксирован · Эффективность выпадов +15%', 'Combat style locked · Strike precision +15%')
    },
    // 6: Scion duel
    {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · ТАКТИЧЕСКИЙ БОЙ', 'INSIGHT SYSTEM · TACTICAL ENGAGEMENT'),
      prompt: text(
        '«[Обнаружена враждебная сущность: высокомерный отпрыск старейшины. Тактическая рекомендация: сокрушить спесь показательным выпадом]».',
        '“[Hostile entity detected: arrogant elder scion. Tactical assessment: counter arrogance with decisive martial strike]”.'
      ),
      world: text('Признание на арене двора (+30 репутации, +60 монет)', 'Reputation in outer court (+30 rep, +60 coins)'),
      system: text('Боевые инстинкты отточены · Зафиксирована крупная победа', 'Combat instincts refined · First major victory recorded')
    },
    // 7: Forbidden archive
    {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · БОЖЕСТВЕННЫЙ РЕЗОНАНС', 'INSIGHT SYSTEM · DIVINE RESONANCE'),
      prompt: text(
        '«[Приоритетный сигнал: Небесная Жемчужина захватила древний запрет под пагодой архива. Протокол очищения яда готов]».',
        '“[High-priority signal: Sky Poison Pearl locked onto ancient forbidden ward beneath script pagoda. Purification protocol ready]”.'
      ),
      world: text('3 древних духовных осколка и 35 духовной энергии', '3 ancient spirit relics & 35 spiritual qi'),
      system: text('Стих Злого Бога расшифрован: открыт прорыв на 3 ступень', 'Evil God verse decoded: Realm 3 breakthrough unlocked')
    },
    // 8: Tournament finale
    {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · ТРИУМФ ТУРНИРА', 'INSIGHT SYSTEM · TOURNAMENT ASCENSION'),
      prompt: text(
        '«[Большой Турнир Внешнего Круга: продемонстрируйте совершенство пути и завоюйте титул первого ученика школы]».',
        '“[Grand Tournament of Outer Disciples: demonstrate full path mastery and claim title of Champion Initiate]”.'
      ),
      world: text('Титул Первого Ученика (+50 репутации, +150 монет)', 'Title of Top Initiate (+50 reputation, +150 coins)'),
      system: text('Допуск во Внутренний Двор открыт · Финал Тома 1 достигнут', 'Inner Sect breakthrough unlocked · Volume 1 Climax reached')
    }
  ];

  function systemDirective(s, index = (s.chapterTwoStep || 0), lang = 'ru') {
    const i = lang === 'en' ? 1 : 0;
    const def = directiveDefs[index] || directiveDefs[0];
    return {
      header: def.header[i],
      prompt: def.prompt[i],
      world: def.world[i],
      system: def.system[i]
    };
  }

  function getStoryBranches(s, lang = 'ru') {
    const en = lang === 'en';
    const sectKey = s.world.admission || 'gates';
    const scion = getScion(sectKey);

    return beats.map((b, idx) => {
      const curStep = s.chapterTwoStep || 0;
      const isPast = curStep > idx;
      const isCurrent = curStep === idx;
      const sectName = S?.schools?.[sectKey]?.name?.[en ? 1 : 0] || sectKey;

      return {
        step: idx,
        chapter: en ? `Vol. 1 · Ch. 2 · Ep. ${idx + 1}` : `Том 1 · Глава 2 · Эп. ${idx + 1}`,
        title: b.title[en ? 1 : 0],
        summary: b.chronicle[en ? 1 : 0],
        status: isPast ? 'completed' : (isCurrent ? 'current' : 'locked'),
        chosenId: isPast ? `ch2-opt-${idx}` : null,
        options: [
          {
            id: `ch2-opt-${idx}`,
            title: b.button[en ? 1 : 0],
            desc: b.goal[en ? 1 : 0],
            chosen: isPast,
            impact: en ? `Sect: ${sectName} · Merit acknowledged` : `Секта: ${sectName} · Заслуги признаны`,
            reward: Object.entries(b.reward || {}).map(([k, v]) => `+${v} ${k}`).join(', '),
            unlocked: en ? `Unlocks Chapter 2 Episode ${idx + 2}` : `Открывает эпизод ${idx + 2} второй главы`
          }
        ]
      };
    });
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

  if (root.IsekaiLocale) root.IsekaiLocale.add(pairs);

  root.IsekaiChapterTwo = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(globalThis);
