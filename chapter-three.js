(function(root){
  'use strict';

  const W = typeof module !== 'undefined' && module.exports ? require('./world.js') : root.IsekaiWorld;
  const S = typeof module !== 'undefined' && module.exports ? require('./sects.js') : root.IsekaiSects;

  const pairs = [];
  const text = (ru, en) => { pairs.push([ru, en]); return [ru, en]; };

  const scions = {
    rescue: { name: text('Старший брат Му', 'Senior Brother Mu'), role: text('первый ученик Зала Тысячи Трав', 'top disciple of the Thousand Herbs Pavilion') },
    remains: { name: text('Сяо Куанту', 'Xiao Kuangtu'), role: text('неистовый мечник клана Сяо', 'ferocious swordsman of the Xiao Clan') },
    invitation: { name: text('Фэн Байшуан', 'Feng Baishuang'), role: text('секретный мастер стужи Пустого Неба', 'covert frost adept of the Empty Sky') },
    gates: { name: text('Янь Ба', 'Yan Ba'), role: text('несокрушимый исполин Каменного Оплота', 'indomitable juggernaut of the Stone Bastion') }
  };

  text('жизнь во внутреннем дворе секты.', 'life in the inner sect courtyard.');
  text('Шаги третьей главы', 'Third chapter steps');
  text('Глава 3: Истинный ученик', 'Chapter 3: The True Disciple');
  text('Завершена', 'Completed');
  text('Обитель', 'Sanctuary');
  text('Сутры', 'Scriptures');
  text('Семи Сект', '7-Sects');
  text('Вызов', 'Challenge');
  text('Экспедиция', 'Expedition');
  text('Пламя', 'Flame Seed');
  text('Спасение', 'Rescue');
  text('Шквал', 'Beast Tide');
  text('Триумф', 'Triumph');
  text('Внутренний двор достигнут', 'Inner sanctuary reached');
  text('В пути или вне города', 'In transit or outside city');
  text('Войти в ворота города', 'Enter city gates');
  text('Упражнения', 'Exercises');
  text('Медитировать для накопления ци', 'Meditate to accumulate qi');
  text('Медитация активна (+ци)', 'Meditation active (+qi)');
  text('Боевая мощь', 'Power');
  text('Выйти на арену турнира семи сект', 'Enter 7-Sects tournament arena');
  text('Постигать сокровенные сутры', 'Study sacred scriptures');
  text('Постижение сутр активно', 'Studying scriptures active');
  text('Сразиться с чемпионами сект', 'Fight against sect champions');
  text('Текущий эпизод (активный)', 'Current episode (active)');
  text('Глава 3 · Эпизод', 'Chapter 3 · Episode');
  text('📖 Открыть этот эпизод', '📖 Open this episode');
  text('Истинный ученик великой секты', 'True Disciple of the Great Sect');
  text('Испытание Хребта Зверей преодолено, пламя Злого Бога горит в груди, а ледяная фея спасена. Имя мастера гремит по всему континенту.', 'The Beast Range trial is conquered, the Evil God Flame burns within, and the ice fairy is saved. The master’s name resounds across the continent.');
  text('ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 1 · ФИНАЛ ИСТИННОГО УЧЕНИКА', 'AGAINST THE GODS · VOL. 1 · FINALE OF TRUE DISCIPLE');

  const beats = [
    // Beat 0: Inner Court Sanctuary & Azure Disciple Mantle
    {
      id: 'inner-sanctuary',
      step: 0,
      title: text('Внутренний двор и Павильон Заслуг', 'Inner Sanctuary and Merit Hall'),
      text: text(
        'После победы на турнире внешнего круга массивные резные врата из лазурного нефрита распахиваются перед тобой. Внутренний двор секты разительно отличается от шумного плаца: здесь царит благоговейная тишина, воздух насыщен концентрированной духовной ци, а вдоль вымощенных белым мрамором аллей возвышаются уединённые пагоды старших учеников. Распорядитель Павильона Заслуг с почтением вручает тебе шёлковые лазурные одежды внутреннего ученика и серебряный жетон с выгравированным знаком школы. С этого мгновения ты больше не послушник, а полноправный наследник древних боевых традиций.',
        'Following your victory in the outer tournament, monumental jade gates swing wide before you. The sect’s inner sanctuary stands in stark contrast to the clamorous outer grounds: reverent silence reigns, the atmosphere vibrates with dense spiritual qi, and solitary pagodas of elder disciples rise along white marble paths. The Merit Hall steward respectfully confers upon you the azure silk robes of an inner disciple and a silver medal engraved with the school’s insignia. From this moment forth, you are no mere initiate, but a recognized successor to ancient martial heritage.'
      ),
      chronicle: text(
        'Лазурные одежды внутреннего ученика надеты. Серебряный жетон звенит на поясе, знаменуя вход в элиту секты.',
        'The azure robes of an inner disciple are donned. The silver token chimes on your sash, marking your entry into the sect elite.'
      ),
      goal: text('Подтвердить принятие лазурного облачения во внутреннем дворе секты.', 'Confirm your azure robes in the inner sanctuary of the sect.'),
      button: text('Принять серебряный жетон ученика', 'Accept Silver Disciple Token'),
      location: 'city',
      reward: { gold: 50, qi: 30, reputation: 15 },
      ready: s => s.stage === 2 && !s.world.journey && s.world.location === 'city'
    },

    // Beat 1: Sacred Martial Arts Scripture Library
    {
      id: 'sacred-scriptures',
      step: 1,
      title: text('Зал Сокровенных Техник', 'Hall of Sacred Scriptures'),
      text: text(
        'Серебряный жетон открывает доступ на второй ярус Великой Библиотеки, куда заказан путь внешним ученикам. На парящих нефритовых постаментах покоятся свитки Земного и Небесного рангов, защищённые мерцающими духовными барьерами. Старейшина-хранитель предупреждает: «Свитки древних не прощают слабости плоти. Лишь тот, чьё тело закалено до твёрдости звёздного железа, способен выдержать отдачу истинных боевых искусств!» Сосредоточив внутреннюю циркуляцию, ты постигаешь сокровенные линии циркуляции силы, укрепляя мышечный каркас.',
        'Your silver token grants access to the second tier of the Great Library, forever barred to outer disciples. Upon floating jade pedestals rest Earth and Heaven rank scrolls, shielded by shimmering spiritual wards. The guardian elder cautions: “Ancient scriptures show no mercy to weak flesh. Only one whose physical foundation is tempered like astral iron can endure the recoil of true martial arts!” Focusing your inner circulation, you internalize profound energy meridians, fortifying your physical shell.'
      ),
      chronicle: text(
        'Сокровенные сутры второго яруса изучены. Меридианы насыщены новой мощью, открывая путь к высшему боевому мастерству.',
        'The sacred second-tier sutras are mastered. Meridians surge with new might, unlocking the gateway to supreme martial arts.'
      ),
      goal: text('Закалить физическое тело тренировками (тело ≥ 4.0) или повысить мастерство (мастерство ≥ 1).', 'Temper your physical body (body ≥ 4.0) or elevate mastery (mastery ≥ 1).'),
      button: text('Запечатлеть сутры в памяти', 'Inscribe Sutras into Soul'),
      location: 'city',
      reward: { qi: 40, mastery: 1, reputation: 15 },
      ready: s => s.stage === 2 && !s.world.journey && s.world.location === 'city' && (s.body >= 4.0 || s.mastery >= 1)
    },

    // Beat 2: Crescent City 7-Sects Grand Tournament
    {
      id: 'crescent-tournament',
      step: 2,
      title: text('Великий Турнир Семи Сект', 'Grand 7-Sects Tournament'),
      text: text(
        'На центральной площади Города Полумесяца воздвигнута колоссальная парящая арена Семи Сект. Десятки тысяч зрителей заполняют трибуны, а в небесах парят ложи патриархов великих кланов и старейшин. Твоя секта выставила сильнейших представителей поколения, и на твои плечи ложится честь защитить имя школы. Барабаны войны сотрясают поднебесье, объявляя начало первых отборочных поединков. Сокрушая претендентов стремительными ударами, ты завоёвываешь признание судей и доказываешь право биться за высший венец славы.',
        'Upon the grand plaza of Crescent City rises the colossal floating arena of the Seven Sects. Tens of thousands of spectators pack the galleries, while patriarchs of great clans and sect elders hover above on spirit platforms. Your sect has fielded the generation’s finest, and upon your shoulders rests the honor of the school. War drums shake the heavens, heralding the elimination bouts. Crushing challengers with swift precision, you earn the judges’ reverence and prove your claim to the crown of glory.'
      ),
      chronicle: text(
        'Отборочные бои Турнира Семи Сект пройдены с триумфом! Слава восходящего гения гремит среди всех семи великих школ.',
        'The preliminary rounds of the 7-Sects Tournament are won with triumph! The prodigy’s fame resounds across all seven great schools.'
      ),
      goal: text('Одержать не менее 4 побед на испытаниях и достичь 4-й ступени (ступень ≥ 4, побед ≥ 4).', 'Attain at least 4 duel victories and reach Realm 4 (realm ≥ 4, wins ≥ 4).'),
      button: text('Принять лавры победителя отбора', 'Accept Eliminator Honors'),
      location: 'city',
      reward: { gold: 100, reputation: 30, qi: 30 },
      ready: s => s.stage === 2 && !s.world.journey && s.realm >= 4 && s.wins >= 4
    },

    // Beat 3: Confrontation with Arrogant Clan Scions
    {
      id: 'scion-reckoning',
      step: 3,
      title: text('Схватка с надменными гениями', 'Clash with Arrogant Prodigies'),
      text: text(
        'Успех безродного ученика вызывает ярость среди знатных наследников древних фамилий. Высокомерный отпрыск влиятельного старейшины преграждает путь к подиуму: «Ты смеешь затмевать благородную кровь своими дешёвыми трюками?! Сегодня я переломаю твои жалкие меридианы на глазах у всего города!» Разгорается яростная схватка чести. На глазах тысяч зрителей твои очищенные каналы высвобождают шквал безупречной энергии, вдребезги разбивая надменный барьер противника и впечатывая его в каменный помост.',
        'The sudden ascent of an unknown disciple incites fury among highborn scions of ancient bloodlines. The arrogant scion of an influential elder blocks your path to the podium: “You dare outshine noble blood with cheap parlor tricks?! Today I shall snap your wretched veins before the entire city!” A ferocious duel of honor erupts. Before thousands of onlookers, your purified channels unleash a devastating storm of flawless energy, shattering the scion’s haughty ward and smashing him into the arena flagstones.'
      ),
      chronicle: text(
        'Высокомерный зачинщик повержен на арене чести. Истинная сила не нуждается в знатном происхождении.',
        'The arrogant challenger lies broken upon the arena pavers. True power bows to no pedigree.'
      ),
      goal: text('Одержать верх в поединках и довести счёт побед до 5 (побед ≥ 5).', 'Prevail in martial trials and reach 5 victories (wins ≥ 5).'),
      button: text('Утвердить триумф на арене', 'Assert Triumph on Arena'),
      location: 'city',
      reward: { gold: 120, relics: 2, reputation: 25 },
      ready: s => s.stage === 2 && !s.world.journey && s.wins >= 5
    },

    // Beat 4: Expedition into Ten Thousand Beast Range
    {
      id: 'beast-expedition',
      step: 4,
      title: text('Экспедиция в Хребет Десяти Тысяч Зверей', 'Expedition into Ten Thousand Beast Range'),
      text: text(
        'В награду за доблесть на турнире Совет Старейшин поручает тебе возглавить глубокую вылазку в запретный Хребет Десяти Тысяч Зверей. Древние первобытные чащи кишат свирепыми духами-зверями, охраняющими тысячелетние духовные травы и залежи звёздных кристаллов. Пробираясь сквозь туманные ущелья и отражая атаки клыкастых хищников, ты собираешь драгоценные образцы реликтовой флоры. Небесная Жемчужина Яда жадно впитывает витающие в воздухе эманации дикой природы, ускоряя рост побегов в твоём внутреннем саду.',
        'In recognition of your arena valor, the Council of Elders assigns you to lead a deep expedition into the forbidden Ten Thousand Beast Range. Ancient primeval woods teem with savage spirit beasts guarding millennium spiritual herbs and veins of astral ore. Navigating misty gorges and repelling venomous predators, you harvest precious relic flora. The Sky Poison Pearl eagerly drinks the primal wild aura, accelerating growth throughout your inner pocket garden.'
      ),
      chronicle: text(
        'Горные тропы Хребта Зверей исследованы. Собраны редчайшие духовные травы и ядра древних хищников.',
        'The mountain passes of the Beast Range are mapped. Rarest spirit herbs and ancient predator beast cores are secured.'
      ),
      goal: text('Собрать запасы трав и исследовать древние тропы (травы ≥ 30, исследование ≥ 700).', 'Gather herb supplies and explore wild trails (herbs ≥ 30, research ≥ 700).'),
      button: text('Доставить дары Хребта Зверей', 'Deliver Beast Range Trophies'),
      location: 'city',
      reward: { herbs: 25, relics: 2, gold: 80 },
      ready: s => s.stage === 2 && !s.world.journey && (s.resources.herbs || 0) >= 30 && (s.explored || 0) >= 700
    },

    // Beat 5: Awakening of the Evil God's Fire Seed
    {
      id: 'fire-seed-awakening',
      step: 5,
      title: text('Пробуждение Семени Злого Бога: Огонь', 'Awakening the Evil God’s Fire Seed'),
      text: text(
        'В глубинах подземных базальтовых разломов под Хребтом Зверей ты натыкаешься на ревущую магматическую лагуну. В самом сердце кипящей лавы парит алый кристалл, источающий первозданную божественную ауру — Семя Злого Бога: Огонь! Обычного культиватора эта лава испепелила бы за мгновение, но Небесная Жемчужина распахивает барьер абсолютной защиты. Войдя в огненный шквал, ты сливаешься с Семенем Злого Бога. Всепоглощающее пламя очищает твои меридианы от последних шлаков, наделяя тело абсолютным иммунитетом к пламени и зажигая неугасимый алхимический огонь.',
        'Deep within subterranean basalt rifts beneath the Beast Range, you discover a roaring magma lagoon. At the center of boiling molten rock hovers a crimson crystal radiating primordial divine aura — the Evil God’s Fire Seed! Ordinary cultivators would be reduced to cinder in a breath, but the Sky Poison Pearl erects an absolute protective barrier. Stepping into the fiery vortex, you merge with the Fire Seed. Primordial flames purge remaining impurities from your meridians, bestowing absolute fire immunity and igniting an inextinguishable alchemical flame.'
      ),
      chronicle: text(
        'Семя Злого Бога: Огонь пробуждено! Пламя Нирваны пылает в меридианах, даруя власть над яростным алхимическим огнём.',
        'The Evil God’s Fire Seed awakens! Nirvana flame blazes through your meridians, granting dominion over ferocious alchemical fire.'
      ),
      goal: text('Накопить чистую духовную энергию и достичь 5-й ступени (ступень ≥ 5, энергия ≥ 50).', 'Accumulate pure spiritual qi and attain Realm 5 (realm ≥ 5, qi ≥ 50).'),
      button: text('Слить пламя Злого Бога с душой', 'Fuse Evil God Flame with Soul'),
      location: 'city',
      reward: { qi: 60, relics: 3, gold: 100 },
      ready: s => s.stage === 2 && !s.world.journey && s.realm >= 5 && (s.resources.qi || 0) >= 50
    },

    // Beat 6: Rescuing the Frozen Cloud Fairy Chu Yuechan
    {
      id: 'fairy-salvation',
      step: 6,
      title: text('Спасение Маленькой Феи', 'Rescuing the Frozen Cloud Fairy'),
      text: text(
        'Покидая огненные разломы, ты слышишь слабый стон у подножия ледяного утёса. На окровавленном снегу лежит женщина неземной красоты в белоснежных одеждах Обители Ледяного Облака — Чу Юэчэнь, известная миру как Маленькая Фея. Она смертельно ранена ядом древней ядовитой гидры: морозная ци в её теле замерзает, а смертоносный яд подступает к сердцу. Обычные лекари были бы бессильны, но ты прижимаешь ладонь с Небесной Жемчужиной к её ледяной коже. Божественный артефакт втягивает всю черноту яда без остатка, возвращая румянец на её прекрасные щёки.',
        'Leaving the magma rift, you hear a faint gasp at the base of an icy crag. Upon bloodstained snow lies a woman of unearthly grace clad in snow-white robes of the Frozen Cloud Asgard — Chu Yuechan, revered across the empire as the Little Fairy. She is mortally afflicted by ancient hydra venom: freezing qi stiffens in her veins while lethal poison creeps toward her heart. Mortal physicians would despair, but pressing the Sky Poison Pearl against her cold skin, the divine relic draws out every drop of corruption, restoring gentle warmth and life to her pale cheeks.'
      ),
      chronicle: text(
        'Маленькая Фея Чу Юэчэнь спасена от гибельного яда. Нерасторжимая кармическая связь соединила ваши судьбы.',
        'The Little Fairy Chu Yuechan is saved from lethal venom. An unbreakable karmic thread binds your destinies together.'
      ),
      goal: text('Использовать силу Жемчужины и духовные осколки для очищения яда (осколки ≥ 8, энергия ≥ 140).', 'Channel the Pearl’s power and relic shards to purge the venom (shards ≥ 8, qi ≥ 140).'),
      button: text('Исцелить Маленькую Фею', 'Heal the Little Fairy'),
      location: 'city',
      reward: { reputation: 50, relics: 3, gold: 100 },
      ready: s => s.stage === 2 && !s.world.journey && (s.resources.relics || 0) >= 8 && (s.resources.qi || 0) >= 140
    },

    // Beat 7: Defense Against the Raging Beast Tide
    {
      id: 'beast-tide-defense',
      step: 7,
      title: text('Оборона аванпоста от Звериного Шквала', 'Defense Against the Beast Tide'),
      text: text(
        'Пробуждение подземного огня встревожило владык глубин Хребта Зверей. Земля сотрясается от топота миллионов лап: колоссальный Звериный Шквал накатывает на передовой форпост секты и торговые тракты долины! Старшие ученики и наставники занимают оборону на зубчатых стенах. Встав во главе передового отряда с пылающим клинком Злого Бога, ты встречаешь волну свирепых хищников. Твоё пламя выжигает ряды чудовищ, а ядовитые эманации Жемчужины обращают натиск тварей в паническое бегство!',
        'The awakening of subterranean flame stirs primal monarchs of the Beast Range abyss. The mountains tremble beneath millions of charging paws: a colossal Beast Tide surges toward the sect’s frontier fortress and valley caravan routes! Senior disciples and mentors take their posts upon crenelated walls. Standing at the vanguard with your sword ablaze in Evil God Fire, you meet the monstrous deluge. Your incandescent fire sears through beasts while the Pearl’s venomous pressure shatters the vanguard into headlong flight!'
      ),
      chronicle: text(
        'Звериный Шквал разбит вдребезги! Стены форпоста устояли, а имя защитника долины вписано золотыми буквами в анналы секты.',
        'The Beast Tide is shattered! The fortress bastions hold firm, and the defender’s name is inscribed in gold within sect annals.'
      ),
      goal: text('Отразить натиск зверей на испытаниях и укрепить культивацию (ступень ≥ 5, побед ≥ 6).', 'Repel the beast onslaught in trials and advance cultivation (realm ≥ 5, wins ≥ 6).'),
      button: text('Сокрушить вожаков Звериного Шквала', 'Shatter Beast Tide Monarchs'),
      location: 'city',
      reward: { gold: 200, reputation: 60, relics: 4 },
      ready: s => s.stage === 2 && !s.world.journey && s.realm >= 5 && s.wins >= 6
    },

    // Beat 8: Sovereign Ascension & Gateway to Glory
    {
      id: 'sovereign-ascension',
      step: 8,
      title: text('Триумф Истинного Ученика', 'Triumph of the Sovereign Disciple'),
      text: text(
        'Перед лицом Великого Собрания Патриарх секты лично вручает тебе Золотой Указ Истинного Наследника. Ты прошёл путь от безвестного чужака со сломанными каналами до непререкаемого столпа секты, подчинившего огонь Злого Бога и спасшего непорочную фею. Весь город склоняет головы в почтении. Твои силы переросли границы одной школы: впереди маячит создание собственного убежища, объединение верных последователей и возвышение самостоятельной секты на руинах древних святилищ!',
        'Before the Grand Assembly, the Sect Patriarch personally bestows upon you the Golden Decree of the Sovereign Successor. You have walked the path from a nameless crippled outcast to an untouchable pillar of the sect, mastering Evil God Fire and rescuing the immaculate fairy. The entire city bows in reverence. Your power now eclipses the boundaries of a single school: ahead lies the founding of your own sanctuary, uniting loyal disciples, and raising an independent sect upon the sacred ruins!'
      ),
      chronicle: text(
        'Титул Истинного Наследника закреплён золотой печатью! Врата к созданию собственной великой секты распахнуты навстречу судьбе.',
        'The Title of Sovereign Successor is sealed in gold! The gateway to founding your own sovereign sect swings wide toward destiny.'
      ),
      goal: text('Достичь 6-й ступени, одержать не менее 7 побед и накопить 300 монет (ступень ≥ 6, побед ≥ 7, монет ≥ 300).', 'Achieve Realm 6, attain at least 7 victories and gather 300 coins (realm ≥ 6, wins ≥ 7, gold ≥ 300).'),
      button: text('Принять золотой указ преемника', 'Accept Golden Successor Decree'),
      location: 'city',
      reward: { gold: 300, reputation: 100, relics: 5 },
      ready: s => s.stage === 2 && !s.world.journey && s.realm >= 6 && s.wins >= 7 && (s.resources.gold || 0) >= 300
    }
  ];

  function getScion(sectKey) {
    return scions[sectKey] || scions.gates;
  }

  // Pre-register interpolated scion duel variants for all sects
  for (const sc of Object.values(scions)) {
    const ruDuel = beats[3].text[0].replace('отпрыск влиятельного старейшины', `${sc.name[0]}, ${sc.role[0]}`);
    const enDuel = beats[3].text[1].replace('the scion of an influential elder', `${sc.name[1]}, ${sc.role[1]}`);
    pairs.push([ruDuel, enDuel]);
  }

  function getBeat(s, index = (s.chapterThreeStep || 0), lang = 'ru') {
    if (s.stage < 2) return null;
    const base = beats[index];
    if (!base) return null;

    const sectKey = s.world.admission || 'gates';
    const scion = getScion(sectKey);
    const i = lang === 'en' ? 1 : 0;

    let textVal = base.text[i];
    if (base.id === 'scion-reckoning') {
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

  function isReady(s, index = (s.chapterThreeStep || 0)) {
    if (s.stage !== 2) return false;
    const b = beats[index];
    return b ? b.ready(s) : false;
  }

  function action(s, value, api) {
    if (s.stage !== 2) return false;
    const step = s.chapterThreeStep || 0;
    if (step >= beats.length) return false;

    const b = beats[step];
    if (!b || !b.ready(s)) return false;

    // Apply rewards
    for (const [k, v] of Object.entries(b.reward || {})) {
      s.resources[k] = (s.resources[k] || 0) + v;
    }

    if (step === 2) {
      // Crescent tournament: guarantee at least 4 wins
      s.wins = Math.max(s.wins, 4);
    } else if (step === 3) {
      // Scion reckoning: guarantee at least 5 wins
      s.wins = Math.max(s.wins, 5);
    } else if (step === 7) {
      // Beast tide defense: guarantee at least 6 wins
      s.wins = Math.max(s.wins, 6);
    } else if (step === 8) {
      // Sovereign finale: ensure wins >= 7 and gold >= 300
      s.wins = Math.max(s.wins, 7);
      s.resources.gold = Math.max(s.resources.gold, 300);
    }

    s.chapterThreeStep = (s.chapterThreeStep || 0) + 1;
    if (s.unlocked) {
      s.unlocked.sect = true;
      s.unlocked.clinic = true;
      s.unlocked.auction = true;
      s.unlocked.flames = true;
      s.unlocked.cauldrons = true;
      s.unlocked.pavilion = true;
      s.unlocked.beastRange = true;
      s.unlocked.venoms = true;
      s.unlocked.jasmine = true;
    }
    if (api?.log) {
      const lang = root.IsekaiLocale?.language || 'ru';
      api.log(s, lang === 'en' ? `Chapter 3: ${b.title[1]}` : `Глава 3: ${b.title[0]}`);
    }
    return true;
  }

  const directiveDefs = [
    // 0: Sanctuary
    {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · ПРОТОКОЛ ВНУТРЕННЕГО ДВОРА', 'INSIGHT SYSTEM · INNER SANCTUARY PROTOCOL'),
      prompt: text(
        '«[Вход во внутренний двор зарегистрирован. Лазурный статус присвоен. Рекомендация: утвердить новый уровень полномочий]».',
        '“[Inner sanctuary entry registered. Azure status bestowed. Recommendation: confirm upgraded clearance]”.'
      ),
      world: text('Шёлковые лазурные одежды и серебряный жетон (+50 монет, +30 ци)', 'Azure silk robes & silver medallion (+50 coins, +30 qi)'),
      system: text('Резонанс Жемчужины +1.0% · Духовная проводимость каналов +15%', 'Pearl resonance +1.0% · Channel conductivity +15%')
    },
    // 1: Scriptures
    {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · СВИТКИ ВТОРОГО ЯРУСА', 'INSIGHT SYSTEM · SECOND TIER SCRIPTURES'),
      prompt: text(
        '«[Обнаружены сутры Земного ранга. Протокол Небесного Яда: компенсировать мышечную нагрузку повышенной плотностью ци]».',
        '“[Earth-rank scriptures located. Sky Poison Protocol: buffer muscular strain with heightened qi density]”.'
      ),
      world: text('Освоение древних сутр (+40 ци, +1 мастерство)', 'Mastery of ancient scriptures (+40 qi, +1 mastery)'),
      system: text('Синхронизация боевых меридианов +20% · Сила удара увеличена', 'Martial meridian synchronization +20% · Strike power amplified')
    },
    // 2: Tournament
    {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · ТУРНИР СЕМИ СЕКТ', 'INSIGHT SYSTEM · 7-SECTS TOURNAMENT'),
      prompt: text(
        '«[Турнир Семи Сект начат. Сканирование соперников: выявлены скрытые слабости в стойках бойцов великих школ]».',
        '“[7-Sects Tournament initiated. Opponent scan: vulnerable apertures detected in rival stances]”.'
      ),
      world: text('Триумф на отборочной арене (+100 монет, +30 репутации)', 'Triumph in elimination bouts (+100 coins, +30 rep)'),
      system: text('Боевой расчёт 100% точен · Тактическое превосходство подтверждено', 'Combat calculation 100% accurate · Tactical superiority confirmed')
    },
    // 3: Scion duel
    {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · ДУЭЛЬ ЧЕСТИ', 'INSIGHT SYSTEM · DUEL OF HONOR'),
      prompt: text(
        '«[Провокация надменного гения зафиксирована. Рекомендация: сокрушить барьер противника безжалостным контраударом]».',
        '“[Arrogant prodigy provocation logged. Recommendation: shatter target ward with decisive counter-blow]”.'
      ),
      world: text('Позор надменного клана (+120 монет, +2 осколка)', 'Humiliation of arrogant clan (+120 coins, +2 shards)'),
      system: text('Спесь соперника сломлена · Репутация мастера признана городом', 'Rival arrogance crushed · Master reputation recognized by city')
    },
    // 4: Beast Range
    {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · ХРЕБЕТ ЗВЕРЕЙ', 'INSIGHT SYSTEM · BEAST RANGE EXPLORATION'),
      prompt: text(
        '«[Вход в запретные дебри Хребта Зверей. Сигнатура реликтовых трав обнаружена в туманных распадках]».',
        '“[Entry into forbidden Beast Range wilds. Relic herb signatures detected in foggy gorges]”.'
      ),
      world: text('Реликтовые сборы Хребта Зверей (+25 трав, +2 осколка, +80 монет)', 'Beast Range relic harvest (+25 herbs, +2 shards, +80 coins)'),
      system: text('Внутренний сад Жемчужины насыщен дикой эссенцией · Скорость роста +25%', 'Inner Pearl Garden saturated with wild essence · Growth rate +25%')
    },
    // 5: Fire Seed
    {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · СЕМЯ ЗЛОГО БОГА', 'INSIGHT SYSTEM · EVIL GOD FIRE SEED'),
      prompt: text(
        '«[Аномальный температурный градиент. Резонанс первозданного огня 100%! Активация абсолютного иммунитета к пламени]».',
        '“[Anomalous thermal gradient. Primordial fire resonance 100%! Absolute flame immunity engaged]”.'
      ),
      world: text('Слияние с Семенем Злого Бога: Огонь (+60 ци, +3 осколка)', 'Fusion with Evil God Fire Seed (+60 qi, +3 shards)'),
      system: text('Огненные врата Злого Бога открыты · Неугасимое алхимическое пламя зажжено', 'Evil God Fire Gate unlocked · Inextinguishable alchemical flame ignited')
    },
    // 6: Fairy Rescue
    {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · ОЧИЩЕНИЕ ЛЕДЯНОЙ ФЕИ', 'INSIGHT SYSTEM · FROZEN FAIRY PURIFICATION'),
      prompt: text(
        '«[Критическое отравление Чу Юэчэнь. Протокол Небесного Яда: поглотить яд древней гидры без вреда для носительницы]».',
        '“[Critical poisoning of Chu Yuechan detected. Sky Poison Protocol: absorb ancient hydra venom safely]”.'
      ),
      world: text('Чу Юэчэнь спасена от гибели (+50 репутации, +3 осколка, +100 монет)', 'Chu Yuechan saved from death (+50 reputation, +3 shards, +100 coins)'),
      system: text('Кармическая связь с Обителью Ледяного Облака закреплена · Древний яд усвоен', 'Karmic bond with Frozen Cloud Asgard sealed · Ancient venom assimilated')
    },
    // 7: Beast Tide
    {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · ОБОРОНА ОТ ЗВЕРИНОГО ШКВАЛА', 'INSIGHT SYSTEM · BEAST TIDE DEFENSE'),
      prompt: text(
        '«[Опасность высшего уровня: Звериный Шквал накатывает на форпост. Директива: высвободить пламя Злого Бога по фронту]».',
        '“[Max tier alert: Beast Tide converging on outpost. Directive: unleash Evil God Fire across front line]”.'
      ),
      world: text('Оборона форпоста завершена победой (+200 монет, +60 репутации, +4 осколка)', 'Outpost defense triumphantly secured (+200 coins, +60 rep, +4 shards)'),
      system: text('Орда чудовищ рассеяна · Имя великого защитника гремит по всей долине', 'Monster horde routed · Great defender’s name echoes across valley')
    },
    // 8: Sovereign Finale
    {
      header: text('СИСТЕМА ПРОЗРЕНИЯ · ТРИУМФ НАСЛЕДНИКА', 'INSIGHT SYSTEM · SOVEREIGN SUCCESSOR'),
      prompt: text(
        '«[Все ступени испытаний ученика завершены. Золотой указ преемника получен. Готовность к основанию собственной секты 100%]».',
        '“[All disciple trials fulfilled. Golden Successor decree bestowed. Readiness to establish sovereign sect 100%]”.'
      ),
      world: text('Золотой указ преемника (+300 монет, +100 репутации, +5 осколков)', 'Golden Successor decree (+300 coins, +100 rep, +5 shards)'),
      system: text('Путь Истинного Ученика завершён · Врата к созданию собственной великой секты открыты', 'Path of True Disciple completed · Gate to founding sovereign sect unlocked')
    }
  ];

  function systemDirective(s, step = (s.chapterThreeStep || 0), lang = 'ru') {
    const def = directiveDefs[step] || directiveDefs[0];
    const i = lang === 'en' ? 1 : 0;
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
      const curStep = s.chapterThreeStep || 0;
      const isPast = curStep > idx;
      const isCurrent = curStep === idx;
      const sectName = S?.schools?.[sectKey]?.name?.[en ? 1 : 0] || sectKey;

      return {
        step: idx,
        chapter: en ? `Vol. 1 · Ch. 3 · Ep. ${idx + 1}` : `Том 1 · Глава 3 · Эп. ${idx + 1}`,
        title: b.title[en ? 1 : 0],
        summary: b.chronicle[en ? 1 : 0],
        status: isPast ? 'completed' : (isCurrent ? 'current' : 'locked'),
        chosenId: isPast ? `ch3-opt-${idx}` : null,
        options: [
          {
            id: `ch3-opt-${idx}`,
            title: b.button[en ? 1 : 0],
            desc: b.goal[en ? 1 : 0],
            chosen: isPast,
            impact: en ? `Sect: ${sectName} · Inner prestige acknowledged` : `Секта: ${sectName} · Внутренний престиж признан`,
            reward: Object.entries(b.reward || {}).map(([k, v]) => `+${v} ${k}`).join(', '),
            unlocked: en ? `Unlocks Chapter 3 Episode ${idx + 2}` : `Открывает эпизод ${idx + 2} третьей главы`
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

  root.IsekaiChapterThree = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(globalThis);
