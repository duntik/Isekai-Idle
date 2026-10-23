(function(root){
  'use strict';

  function safeText(ru, en, lang){
    return lang === 'en' ? en : ru;
  }

  function getStoryBranches(s, lang){
    const en = lang === 'en';
    const step = Number.isInteger(s?.storyStep) ? s.storyStep : 0;
    const stage = Number.isInteger(s?.stage) ? s.stage : 0;

    return [
      {
        step: 0,
        chapter: en ? 'Prologue' : 'Пролог',
        title: en ? 'Pass Incident: The Broken Wagon' : 'Инцидент на перевале: Сломанная повозка',
        summary: en ? 'Awakening with crippled profound channels beside Uncle Ba\'s overturned cart.' : 'Пробуждение с повреждёнными глубокими каналами у разбитой повозки дяди Ба.',
        status: step > 0 ? 'completed' : 'current',
        chosenId: s.prologueAction || null,
        options: [
          {
            id: 'shoulder',
            title: en ? 'Hoist axle with shoulder' : 'Подставить плечо под ось',
            desc: en ? 'Heave the loaded cart from the ditch with brute physical effort, ignoring agonizing meridian spasms.' : 'Вытащить гружёную повозку из канавы физическим усилием вопреки судорогам каналов.',
            chosen: s.prologueAction === 'shoulder',
            impact: en
              ? 'Uncle Ba was stunned by your selfless grit. Upon reaching the inn, he personally vouched for you to Lady Mei (+1 Mei Trust), securing hot stew and hearth shelter.'
              : 'Дядя Ба был поражён твоей самоотверженностью. По прибытии он лично поручился за тебя перед Мэй (+1 к доверию Мэй), обеспечив горячую похлёбку и ночлег у очага.',
            reward: en ? '+0.3 Body Tempering, Uncle Ba\'s Voucher, Mei\'s initial trust' : '+0.3 к Закалке тела, Поручительство Ба, Доверие Мэй',
            unlocked: en ? 'Dialogue: Uncle Ba\'s heartfelt thanks & Mei\'s warm reception' : 'Диалог: Благодарность дяди Ба и тёплый приём хозяйки Мэй'
          },
          {
            id: 'stones',
            title: en ? 'Brace ruts with flat stones' : 'Укрепить колею камнями',
            desc: en ? 'Keep calm and lay river slabs to construct a sturdy ramp for the heavy wheels.' : 'Сохранять хладнокровие и вымостить выезд из колеи плоскими речными камнями.',
            chosen: s.prologueAction === 'stones',
            impact: en
              ? 'Uncle Ba admired your analytical composure. Village herbalist Lin later heard of your patient eye for mountain stones.'
              : 'Дядя Ба восхитился твоей рассудительностью и хладнокровием. Травница Линь позже узнала о твоём внимательном взгляде на породу.',
            reward: en ? '+1.0 Calm, +0.2 Technique insight' : '+1.0 к Спокойствию, +0.2 к Технике',
            unlocked: en ? 'Dialogue: Ba\'s remarks on composure & Lin\'s herbal curiosity' : 'Диалог: Похвала Ба за выдержку и интерес травницы Линь'
          },
          {
            id: 'scout',
            title: en ? 'Scout ravine for dry bypass' : 'Осмотреть ущелье и найти сухой обход',
            desc: en ? 'Search the mountain trail for a safe dry passage through the rocks without straining the carriage.' : 'Осмотреть горную тропу и провести упряжь по сухим каменным уступам без перегрузки.',
            chosen: s.prologueAction === 'scout',
            impact: en
              ? 'Careful scouting avoided any strain on your crippled channels. Uncle Ba shared copper coins, and you spotted a faint spirit shard in the brush.'
              : 'Осторожная разведка уберегла повреждённые каналы от надрыва. Дядя Ба отсыпал медных монет, а в кустах блеснул слабый осколок духа.',
            reward: en ? '+5 Copper coins, +1 Spirit Shard' : '+5 медных монет, +1 Осколок духа',
            unlocked: en ? 'Dialogue: Safe bypass notes & merchant thrift' : 'Диалог: Заметки о безопасных тропах и бережливости'
          }
        ]
      },
      {
        step: 1,
        chapter: en ? 'Step 1' : 'Шаг 1',
        title: en ? 'Mei\'s Yard: Sweeping to Collapse' : 'Двор хозяйки Мэй: Труд до изнеможения',
        summary: en ? 'Shelter at the crossroads inn; clearing mud and debris with a heavy bamboo broom.' : 'Приют на постоялом дворе; расчистка двора от грязи и щебня тяжёлой бамбуковой метлой.',
        status: step > 1 ? 'completed' : (step === 1 ? 'current' : 'locked'),
        chosenId: (step > 1 || s.fed) ? 'sweep' : null,
        options: [
          {
            id: 'sweep',
            title: en ? 'Clear the flooded yard with bamboo broom' : 'Расчистить затопленный двор бамбуковой метлой',
            desc: en ? 'Sweeping mud and rubble despite agonizing meridian spasms until the System awakens.' : 'Сметать грязь и щебень вопреки жгучим судорогам каналов, пока не пробудится Система.',
            chosen: Boolean(step > 1 || s.fed),
            impact: en
              ? 'Lady Mei provided warm stew and a corner by the hearth. Near mortal collapse, the Sky Poison Pearl awakened in your left palm, unlocking the cultivation interface.'
              : 'Хозяйка Мэй накормила горячей похлёбкой и пустила к очагу. На грани изнеможения Небесная Жемчужина Яда пробудилась в левой ладони, открыв интерфейс Системы.',
            reward: en ? 'System Awakening, +1.0 Max Stamina, Hearth Shelter' : 'Пробуждение Системы, +1.0 к выносливости, Кров у очага',
            unlocked: en ? 'Dialogue: Mei\'s maternal care & Old Ren\'s watchful gaze from the well' : 'Диалог: Забота хозяйки Мэй и взгляд старика Жэня у колодца'
          }
        ]
      },
      {
        step: 2,
        chapter: en ? 'Step 2' : 'Шаг 2',
        title: en ? 'Foundation Tempering: Body vs Technique' : 'Закалка фундамента: Тело или Техника',
        summary: en ? 'Overcoming crippled channels through brutal physical conditioning or delicate breath manual study.' : 'Преодоление спазма каналов через телесную закалку или изучение свитков дыхания.',
        status: step > 2 ? 'completed' : (step === 2 ? 'current' : 'locked'),
        chosenId: s.chapterOneTraining || (step > 2 ? 'body' : null),
        options: [
          {
            id: 'body',
            title: en ? 'Old Ren\'s Horse Stance & Heavy Labor' : 'Стойка всадника и закалка тела у Жэня',
            desc: en ? 'When meridians are crippled, temper flesh and bone through brutal physical conditioning at the stone well.' : 'Когда меридианы спазмированы, ковать кости и сухожилия упорным телесным трудом у колодца.',
            chosen: s.chapterOneTraining === 'body' || (step > 2 && s.chapterOneTraining !== 'technique'),
            impact: en
              ? 'Old Ren recognized the unbreakable spirit of an ancient lineage. He taught you the breathing rhythm for stone squats and hauling.'
              : 'Старик Жэнь разглядел несгибаемый дух древнего рода. Он поставил дыхание для глубоких приседаний и переноски каменных глыб.',
            reward: en ? '+2.0 Body Tempering, Old Ren\'s Respect (+2 Trust)' : '+2.0 к Закалке тела, Уважение старика Жэня (+2 к доверию)',
            unlocked: en ? 'Dialogue: Old Ren\'s battle lore & stone stance practice' : 'Диалог: Боевой опыт Жэня и стойка на камнях'
          },
          {
            id: 'technique',
            title: en ? 'Ancient Manual Study & Channel Alignment' : 'Изучение древних свитков и дыхания',
            desc: en ? 'Study breathing manuals in the quiet loft, gently guiding dormant Qi around the blocked passages.' : 'Изучать старые бамбуковые свитки, направляя дремлющую ци в обход заблокированных узлов.',
            chosen: s.chapterOneTraining === 'technique',
            impact: en
              ? 'Gained profound theoretical understanding of channel flows and hidden acupuncture points, preparing for pill refinement.'
              : 'Обретено глубокое понимание меридианных потоков и тайных акупунктурных точек для очищения пилюль.',
            reward: en ? '+2.0 Technique Mastery, +3.0 Calm' : '+2.0 к Технике, +3.0 к Спокойствию',
            unlocked: en ? 'Dialogue: Scholar Wei\'s historical notes on ancient lineages' : 'Диалог: Исторические заметки архивиста Вэя о древних родах'
          }
        ]
      },
      {
        step: 3,
        chapter: en ? 'Step 3' : 'Шаг 3',
        title: en ? 'Stream Meditation: Resonance of the Pearl' : 'Медитация у ручья: Резонанс Жемчужины',
        summary: en ? 'Finding stillness beside the mountain cascade; awakening spiritual senses.' : 'Обретение покоя у горного каскада; пробуждение духовного чутья.',
        status: step > 3 ? 'completed' : (step === 3 ? 'current' : 'locked'),
        chosenId: (step > 3 || s.calm >= 5) ? 'resonance' : null,
        options: [
          {
            id: 'resonance',
            title: en ? 'Harmonize the Sky Poison Pearl' : 'Гармонизация Небесной Жемчужины Яда',
            desc: en ? 'Quiet contemplation by the mountain cascade brings the turbulent Pearl into spiritual equilibrium.' : 'Созерцание горного каскада приводит мятежную Жемчужину в духовное равновесие.',
            chosen: Boolean(step > 3 || s.calm >= 5),
            impact: en
              ? 'The Pearl resonated with the ancient mountain peak, unveiling the forgotten overgrown path leading to the ruined shrine.'
              : 'Жемчужина срезонировала с древней вершиной, явив взору забытую заросшую тропу к развалинам горного святилища.',
            reward: en ? 'Access to Mountain Ruins, +5.0 Calm' : 'Открытие Развалин храма, +5.0 к Спокойствию',
            unlocked: en ? 'Dialogue: Murmurs of ancient crimson flames on the cliffs' : 'Диалог: Слухи о древнем алом пламени на утёсах'
          }
        ]
      },
      {
        step: 4,
        chapter: en ? 'Step 4' : 'Шаг 4',
        title: en ? 'Mountain Ruins: Evil God Legacy' : 'Развалины храма: Наследие Злого Бога',
        summary: en ? 'Ancient altar sanctuary; purifying corrupted miasma and receiving Jasmine\'s covenant.' : 'Древнее святилище; очищение ядовитой миазмы и завет Жасмин.',
        status: step > 4 ? 'completed' : (step === 4 ? 'current' : 'locked'),
        chosenId: (step > 4 || s.found) ? 'altar' : null,
        options: [
          {
            id: 'altar',
            title: en ? 'Cleanse the Crimson Altar with the Pearl' : 'Очистить алый алтарь силой Жемчужины',
            desc: en ? 'Draw the poisonous miasma from the ancient altar, revealing the primordial Evil God Sutra.' : 'Втянуть ядовитую миазму древнего алтаря, открыв первозданные письмена Сутры Злого Бога.',
            chosen: Boolean(step > 4 || s.found),
            impact: en
              ? 'Purified the corrupted altar. Sensed the sealed presence of the Crimson Princess (Jasmine). Acquired the divine technique manual and valley spirit herbs.'
              : 'Алтарь очищен от скверны. Ощутилось присутствие Алой Владычицы (Жасмин). Обретена божественная техника и горные травы.',
            reward: en ? 'Technique: Evil God Sutra, +10 Mountain Herbs, Jasmine\'s Covenant' : 'Техника: Сутра Злого Бога, +10 Горных трав, Завет Жасмин',
            unlocked: en ? 'Dialogue: Jasmine\'s cryptic telepathic rebuke & guidance' : 'Диалог: Насмешливый мысленный упрёк и наставление Жасмин'
          }
        ]
      },
      {
        step: 5,
        chapter: en ? 'Step 5' : 'Шаг 5',
        title: en ? 'Meridian Breakthrough: Flawless Pill' : 'Прорыв меридианов: 100% чистая пилюля',
        summary: en ? 'Refining a flawless pill without a speck of impurity, unleashing the primordial flood of true Qi.' : 'Сплавить безупречную пилюлю без крупицы примесей, обрушив первозданный поток истинной ци.',
        status: step > 5 ? 'completed' : (step === 5 ? 'current' : 'locked'),
        chosenId: (step > 5 || s.realm >= 1) ? 'breakthrough' : null,
        options: [
          {
            id: 'breakthrough',
            title: en ? 'Shatter Congenital Channel Spasms' : 'Сокрушить врождённые спазмы каналов',
            desc: en ? 'Refine a flawless pill without a speck of impurity, unleashing the primordial flood of true Qi.' : 'Сплавить безупречную пилюлю без крупицы примесей, обрушив первозданный поток истинной ци.',
            chosen: Boolean(step > 5 || s.realm >= 1),
            impact: en
              ? 'All 54 profound channels forcefully blasted open! The frail invalid body was permanently reborn into a divine martial vessel.'
              : 'Все 54 глубоких канала с грохотом распахнулись! Хрупкое немощное тело переродилось в совершенный сосуд культивации.',
            reward: en ? 'Realm 1 Breakthrough, +30 Max Stamina, Profound Vitality' : 'Прорыв на 1-ю Ступень, +30 к выносливости, Истинная ци',
            unlocked: en ? 'Dialogue: Uncle Ba\'s awe & Old Ren\'s joyful roar' : 'Диалог: Изумление дяди Ба и ликующий возглас старика Жэня'
          }
        ]
      },
      {
        step: 6,
        chapter: en ? 'Step 6' : 'Шаг 6',
        title: en ? 'Bridge Roadblock: Three Resolves' : 'Застава на мосту: Три Пути',
        summary: en ? 'White Fang extortionists blockade the bridge; choosing combat, service, or archival diplomacy.' : 'Вымогатели Белого Клыка перекрыли мост; выбор между боем, взаимовыручкой и дипломатией Архива.',
        status: step > 6 ? 'completed' : (step === 6 ? 'current' : 'locked'),
        chosenId: s.chapterOneRoute || null,
        options: [
          {
            id: 'combat',
            title: en ? 'Martial Duel: White Fang Extortionist' : 'Боевой поединок: Вымогатель Белого Клыка',
            desc: en ? 'Protect Uncle Ba\'s wagon with blade and fist, defeating the arrogant disciple in single combat.' : 'Защитить повозку дяди Ба оружием и кулаками, сокрушив надменного ученика в открытом бою.',
            chosen: s.chapterOneRoute === 'combat',
            impact: en
              ? 'Defeated disciple Bai with flawless martial mastery. Cart crossed safely. The White Fang Clan marked you as an insolent rival, but the common folk cheered.'
              : 'Ученик Бай повержен безупречным стилем. Повозка спасена. Клан Белого Клыка затаил злобу, но жители долины чествуют тебя как защитника.',
            reward: en ? '+1 Trial Victory, Martial Renown, White Fang Rivalry' : '+1 Победа в Испытаниях, Воинская слава, Вражда с Белым Клыком',
            unlocked: en ? 'Dialogue: Bai\'s grudging retreat & Ba\'s heartfelt tears' : 'Диалог: Неохотное отступление Бая и слёзы благодарности Ба'
          },
          {
            id: 'service',
            title: en ? 'Community Labor: Earned Safe-Passage' : 'Трудовая взаимовыручка: Печать старейшин',
            desc: en ? 'Assist local craftsmen and farmers with 3 arduous tasks to earn the village council\'s official seal.' : 'Помочь местным мастерам и земледельцам с 3 тяжёлыми поручениями, заслужив печать совета старейшин.',
            chosen: s.chapterOneRoute === 'service',
            impact: en
              ? 'United the villagers behind Uncle Ba. The village elders presented an official guild decree that forced the guards to step aside without a drop of blood.'
              : 'Сплотил жителей вокруг обоза. Старейшины выставили официальную гильдейскую грамоту, заставив стражу отступить без единой капли крови.',
            reward: en ? '+3 Village Recognition, Elders\' Safe-Conduct Decree' : '+3 Признания жителей, Охранная грамота старейшин',
            unlocked: en ? 'Dialogue: Council elder\'s blessing & peaceful transit' : 'Диалог: Благословение совета старейшин и мирный проезд'
          },
          {
            id: 'diplomacy',
            title: en ? 'Wei\'s Dispatch: Archival Seal' : 'Письмо архивиста Вэя: Печать Библиотеки',
            desc: en ? 'Deliver Lady Mei\'s sealed dispatch to Archivist Wei in Crescent City, securing his scholarly immunity pass.' : 'Доставить запечатанное письмо Мэй архивисту Вэю в Город Полумесяца, получив неприкосновенную грамоту.',
            chosen: s.chapterOneRoute === 'diplomacy',
            impact: en
              ? 'Archivist Wei recognized the ancient seal. In return for comparing temple runes, he issued an Imperial Archive charter that nullified the roadblock.'
              : 'Архивист Вэй узнал древнюю печать. В обмен на сверку храмовых знаков он выдал подорожную грамоту Архива, аннулировавшую поборы.',
            reward: en ? 'Archivist Wei\'s Charter, Unlocked Ancient Symbol Lore' : 'Грамота архивиста Вэя, Открытие тайн древних символов',
            unlocked: en ? 'Dialogue: Wei\'s esoteric analysis of the Evil God ruins' : 'Диалог: Эзотерический анализ руин Злого Бога от Вэя'
          }
        ]
      },
      {
        step: 7,
        chapter: en ? 'Step 7' : 'Шаг 7',
        title: en ? 'The Grand Recruitment: Four Great Sects' : 'Великий набор: Четыре Великие Секты',
        summary: en ? 'The plaza of Crescent City; four cornerstone sects test applicants for lifelong oaths.' : 'Площадь Города Полумесяца; четыре столпа культивации принимают клятвы послушников.',
        status: (s.world?.admission || stage >= 1) ? 'completed' : (step === 7 ? 'current' : 'locked'),
        chosenId: s.world?.admission || null,
        options: [
          {
            id: 'rescue',
            title: en ? 'Jade Grove Sect' : 'Секта Нефритовой Рощи',
            desc: en ? 'Path of Alchemy, Medicine, and Life Preservation.' : 'Путь Алхимии, Лекарского искусства и сохранения жизни.',
            chosen: s.world?.admission === 'rescue',
            impact: en
              ? 'Accepted into the emerald halls of healers. The Sky Poison Pearl resonates with celestial herbs, doubling medicine yields.'
              : 'Принят в изумрудные чертоги целителей. Жемчужина Яда резонирует с небесными травами, удваивая алхимический сбор.',
            reward: en ? 'Gift: Medicine Cauldron, +15 Herbs, Herbalist Path' : 'Дар: Котёл исцеления, +15 Трав, Путь травника',
            unlocked: en ? 'Dialogue: Elder Mu\'s secret formula & medicinal gardens' : 'Диалог: Тайный рецепт старейшины Му и лекарственные сады'
          },
          {
            id: 'remains',
            title: en ? 'Cloud Reach Sect' : 'Секта Облачного Предела',
            desc: en ? 'Path of Soaring Swords, Wind Steps, and Martial Prowess.' : 'Путь Парящего Меча, Небесного Шага и воинского величия.',
            chosen: s.world?.admission === 'remains',
            impact: en
              ? 'Ascended the azure cloud peaks. Mastered flying sword intent to cut through mountain gales and enemy ranks alike.'
              : 'Взошёл на лазурные облачные пики. Овладел искусством парящего меча, рассекающим горные вихри и ряды врагов.',
            reward: en ? 'Gift: Cloud Steel Blade, +2 Weapon Mastery, Sword Path' : 'Дар: Клинок Облачной Стали, +2 к Оружию, Путь меча',
            unlocked: en ? 'Dialogue: Sword Saint\'s test & cloud terrace duel' : 'Диалог: Испытание Мастера Меча и дуэль на облачной террасе'
          },
          {
            id: 'invitation',
            title: en ? 'Empty Sky Sect' : 'Секта Пустого Неба',
            desc: en ? 'Path of Spatial Void Laws, Secret Seals, and Jasmine\'s Affinity.' : 'Путь Законов Пустоты, Тайных Печатей и связи с Жасмин.',
            chosen: s.world?.admission === 'invitation',
            impact: en
              ? 'Stepped into the ethereal void sanctuary. Ancient runes align with the Evil God Sutra, empowering domain manipulation.'
              : 'Вступил в эфирное святилище пустоты. Древние руны совпали с Сутрой Злого Бога, усилив контроль над пространством.',
            reward: en ? 'Gift: Void Ba-Gua Seal, +50 Qi, Void Heritage' : 'Дар: Печать Пустоты Ба-Гуа, +50 к Ци, Наследие пустоты',
            unlocked: en ? 'Dialogue: Grand Elder\'s revelation of stellar fractures' : 'Диалог: Откровение Великого Старейшины о разломах небес'
          },
          {
            id: 'gates',
            title: en ? 'Stone Bastion Sect' : 'Секта Каменного Оплота',
            desc: en ? 'Path of Basalt Fortitude, Indomitable Poise, and Iron Bones.' : 'Путь Базальтовой Твердыни, Непоколебимой Стойки и Железных Костей.',
            chosen: s.world?.admission === 'gates',
            impact: en
              ? 'Anchored atop the impenetrable fortress walls. The body becomes harder than tempered meteorite iron.'
              : 'Встал на неприступных крепостных стенах. Тело обрело прочность закалённого метеоритного железа.',
            reward: en ? 'Gift: Basalt Aegis, +10 Max Stamina, Bastion Shield' : 'Дар: Базальтовый щит, +10 к выносливости, Базальтовая броня',
            unlocked: en ? 'Dialogue: Iron Commander\'s oath & mountain siege tactics' : 'Диалог: Клятва Железного Командующего и тактика осады'
          }
        ]
      }
    ];
  }

  const npcGlyphs = {
    mei: '🍵', ren: '🏋️', lin: '🌿', wei: '📜', sen: '🧘', ho: '⚖️', bai: '⚔️', wanderer: '🧭', master: '🗡️',
    tong: '🔨', sui: '🌱', qiao: '🪞', bo: '🧪', yun: '⚔️'
  };

  function getNpcBonds(s, lang){
    const en = lang === 'en';
    const memoryApi = root.IsekaiNpcMemory || (typeof require === 'function' ? (()=>{ try { return require('./npc-memory.js'); } catch { return null; } })() : null);
    if (!memoryApi || !memoryApi.people) return [];

    const peopleList = memoryApi.people(s, lang);

    return peopleList.map(p => {
      const glyph = npcGlyphs[p.id] || '👤';
      const trust = Number.isFinite(p.trust) ? p.trust : 0;
      const trustPercent = Math.max(0, Math.min(100, Math.round(((trust + 5) / 15) * 100)));

      // Extra narrative karma lines based on prologue and story choices
      const extraDeeds = [];
      if (p.id === 'mei') {
        if (s.prologueAction === 'shoulder') extraDeeds.push(en ? 'Uncle Ba reported your selflessness: cart axle lifted with bare hands (+1 Trust)' : 'Дядя Ба рассказал о твоём подвиге: ось повозки поднята голыми руками (+1 к доверию)');
        if (s.prologueAction === 'stones') extraDeeds.push(en ? 'Uncle Ba praised your calm judgment with mountain stones' : 'Дядя Ба похвалил твоё хладнокровие с горными камнями');
        if (s.fed || (s.storyStep && s.storyStep >= 1)) extraDeeds.push(en ? 'Flooded inn yard cleared with heavy bamboo broom' : 'Затопленный двор постоялого двора расчищен бамбуковой метлой');
      } else if (p.id === 'ren') {
        if (s.chapterOneTraining === 'body') extraDeeds.push(en ? 'Mastered stone horse stance and deep squats by the village well' : 'Освоил стойку всадника и глубокие приседания у каменного колодца');
        if (s.body >= 20) extraDeeds.push(en ? 'Acknowledged your relentless physical endurance (+2 Trust)' : 'Признал твою несокрушимую телесную выносливость (+2 к доверию)');
      } else if (p.id === 'lin') {
        if (s.prologueAction === 'stones') extraDeeds.push(en ? 'Heard of your observant eye for mineral deposits and herbs' : 'Услышала о твоём внимательном взгляде на минералы и травы');
      } else if (p.id === 'bai') {
        if (s.chapterOneRoute === 'combat') extraDeeds.push(en ? 'Defeated in fair martial duel at the wooden bridge' : 'Повержен в честном поединке на деревянном мосту');
      } else if (p.id === 'wei') {
        if (s.chapterOneRoute === 'diplomacy') extraDeeds.push(en ? 'Verified ancient temple rubbings against Imperial Archive codices' : 'Сверил древние храмовые знаки с кодексами Императорского Архива');
      }

      const allMemories = [...extraDeeds, ...(p.memories || [])];
      const uniqueMemories = Array.from(new Set(allMemories));

      return {
        id: p.id,
        glyph,
        name: p.name,
        role: p.role,
        location: p.location || p.place,
        trust,
        trustPercent,
        status: p.status,
        relationship: p.relationship,
        summary: p.summary,
        deeds: uniqueMemories
      };
    });
  }

  function getFactions(s, lang){
    const en = lang === 'en';
    const admission = s.world?.admission || null;
    const route = s.chapterOneRoute || null;
    const fed = Boolean(s.fed || (s.storyStep && s.storyStep >= 1));
    const step = Number.isInteger(s.storyStep) ? s.storyStep : 0;

    const valleyDeeds = [];
    if (s.prologueAction === 'shoulder') valleyDeeds.push(en ? 'Uncle Ba\'s wagon rescued at the pass' : 'Повозка дяди Ба спасена на перевале');
    if (fed) valleyDeeds.push(en ? 'Lady Mei\'s inn yard cleared and restored' : 'Двор постоялого двора Мэй расчищен');
    if (route === 'service') valleyDeeds.push(en ? 'Aided local craftsmen and earned village elder safe-conduct seal' : 'Оказана помощь мастерам, получена охранная грамота старейшин');

    const baiDeeds = [];
    if (route === 'combat') baiDeeds.push(en ? 'Extortionist disciple Bai defeated in duel at the bridge' : 'Ученик-вымогатель Бай повержен в поединке на мосту');
    else if (step >= 6) baiDeeds.push(en ? 'Roadblock bypassed through village diplomacy' : 'Застава обойдена мирным путём');

    const scholarDeeds = [];
    if (s.found) scholarDeeds.push(en ? 'Purified Evil God shrine and deciphered ancient glyphs' : 'Очищено святилище Злого Бога, расшифрованы древние знаки');
    if (route === 'diplomacy') scholarDeeds.push(en ? 'Delivered Lady Mei\'s sealed dispatch to Archivist Wei' : 'Доставлено секретное письмо Мэй архивисту Вэю');

    const sectDeeds = [];
    if (admission) sectDeeds.push(en ? `Sworn disciple of ${admission.toUpperCase()} Sect` : `Посвящённый ученик секты ${admission.toUpperCase()}`);
    else if (step >= 7) sectDeeds.push(en ? 'Auditioned at the Crescent City recruitment plaza' : 'Прошёл смотр на площади Города Полумесяца');

    return [
      {
        id: 'valley',
        glyph: '🏡',
        name: en ? 'Floating Cloud Valley Villagers' : 'Жители Долины Плывущих Облаков',
        role: en ? 'Common folk, craftsmen, and Uncle Ba\'s caravan' : 'Мирные жители, ремесленники и обоз дяди Ба',
        status: step >= 6 ? (en ? 'Revered Protector' : 'Почитаемый защитник') : (fed ? (en ? 'Trusted Ally' : 'Доверенный друг') : (en ? 'Friendly Stranger' : 'Доброжелательный путник')),
        repPercent: step >= 6 ? 100 : (fed ? 65 : 35),
        desc: en
          ? 'Peaceful mountain valley folk sheltered by towering cliffs. In gratitude for rescuing Uncle Ba and restoring Mei\'s courtyard, they offer shelter, sustenance, and safe haven.'
          : 'Мирные жители долины под сенью горных пиков. В благодарность за спасение дяди Ба и помощь Мэй они предлагают кров, горячую пищу и верный приют.',
        deeds: valleyDeeds.length ? valleyDeeds : [en ? 'First meetings in the valley' : 'Первые знакомства в долине']
      },
      {
        id: 'white-fang',
        glyph: '🐺',
        name: en ? 'White Fang Clan' : 'Клан Белого Клыка',
        role: en ? 'Aggressive trade syndicate & road extortionists' : 'Воинский синдикат и дорожные вымогатели',
        status: route === 'combat' ? (en ? 'Sworn Rival' : 'Заклятый соперник') : (en ? 'Tense Truce' : 'Осторожное перемирие'),
        repPercent: route === 'combat' ? 15 : 45,
        desc: en
          ? 'A ruthless syndicate dominating the mountain highways and squeezing tribute from passing caravans. They view resilient independent cultivators as a threat.'
          : 'Синдикат, держащий горные тракты железной хваткой и взимающий дань с караванов. Воспринимает независимых практиков как прямую угрозу.',
        deeds: baiDeeds.length ? baiDeeds : [en ? 'Rumors heard along the highway' : 'Слухи на горных дорогах']
      },
      {
        id: 'scholars',
        glyph: '📜',
        name: en ? 'Scholar & Herbalist Guild' : 'Гильдия Архивистов и Травников',
        role: en ? 'Keepers of ancient scrolls and medical codices' : 'Хранители древних свитков и лекарских трактатов',
        status: s.found ? (en ? 'Honored Scholar' : 'Уважаемый исследователь') : (en ? 'Recognized Seeker' : 'Признанный искатель'),
        repPercent: s.found ? 90 : 50,
        desc: en
          ? 'An alliance of scholars, archivists, and herbalists dedicated to preserving the memory of ancient eras before the great calamity.'
          : 'Содружество учёных, архивистов и травников, сберегающих наследие древних эпох до великого небесного бедствия.',
        deeds: scholarDeeds.length ? scholarDeeds : [en ? 'Initial research at local archives' : 'Первые поиски в архивах']
      },
      {
        id: 'four-sects',
        glyph: '⛩️',
        name: en ? 'The Four Great Sects of Crescent City' : 'Четыре Великие Секты Города Полумесяца',
        role: en ? 'Jade Grove, Cloud Reach, Empty Sky, and Stone Bastion' : 'Нефритовая Роща, Облачный Предел, Пустое Небо и Каменный Оплот',
        status: admission ? (en ? 'Sworn Disciple' : 'Посвящённый ученик') : (step >= 7 ? (en ? 'Qualified Candidate' : 'Допущенный кандидат') : (en ? 'Aspiring Outsider' : 'Внешний соискатель')),
        repPercent: admission ? 100 : (step >= 7 ? 60 : 25),
        desc: en
          ? 'The four foundational pillars of cultivation governing Crescent City. Each school offers unique martial traditions, exclusive techniques, and divine sect artifacts.'
          : 'Четыре столпа культивации Города Полумесяца. Каждая школа предлагает уникальные техники, наследие и священные реликвии.',
        deeds: sectDeeds.length ? sectDeeds : [en ? 'Preparing foundation for the grand recruitment' : 'Подготовка фундамента к смотру сект']
      }
    ];
  }

  function getChapterTwoBranches(s, lang){
    const ch2 = typeof module !== 'undefined' && module.exports ? require('./chapter-two.js') : (root.IsekaiChapterTwo || (typeof window !== 'undefined' ? window.IsekaiChapterTwo : null));
    return ch2 ? ch2.getStoryBranches(s, lang) : [];
  }

  function getChapterThreeBranches(s, lang){
    const ch3 = typeof module !== 'undefined' && module.exports ? require('./chapter-three.js') : (root.IsekaiChapterThree || (typeof window !== 'undefined' ? window.IsekaiChapterThree : null));
    return ch3 ? ch3.getStoryBranches(s, lang) : [];
  }

  function getChapterFourBranches(s, lang){
    const ch4 = typeof module !== 'undefined' && module.exports ? require('./chapter-four.js') : (root.IsekaiChapterFour || (typeof window !== 'undefined' ? window.IsekaiChapterFour : null));
    return ch4 ? ch4.getStoryBranches(s, lang) : [];
  }

  function renderTreeHtml(s, activeTab, lang){
    const en = lang === 'en';
    const tab = activeTab || 'story';

    if (tab === 'story') {
      const branches = getStoryBranches(s, lang);
      const ch2Branches = s.stage >= 1 ? getChapterTwoBranches(s, lang) : [];
      const ch3Branches = s.stage >= 2 ? getChapterThreeBranches(s, lang) : [];
      const ch4Branches = s.stage >= 3 ? getChapterFourBranches(s, lang) : [];
      const allBranches = [...branches, ...ch2Branches, ...ch3Branches, ...ch4Branches];
      return `
        <div class="fate-branches-list">
          ${allBranches.map(b => {
            const isLocked = b.status === 'locked';
            const statusClass = b.status === 'completed' ? 'fate-step-completed' : (b.status === 'current' ? 'fate-step-current' : 'fate-step-locked');
            const statusLabel = b.status === 'completed' ? (en ? '✓ Completed' : '✓ Завершено') : (b.status === 'current' ? (en ? '● Current' : '● Текущий шаг') : (en ? '🔒 Veiled' : '🔒 Сокрыто'));
            const cardTitle = isLocked ? (en ? `${b.chapter} · Veiled by Destiny` : `${b.chapter} · Сокрыто туманом судьбы`) : b.title;
            const cardSummary = isLocked ? (en ? 'The threads of karma are not yet woven. Advance your cultivation to pierce the veil.' : 'Нити кармы ещё не сплетены. Продвигайся вперёд по пути культивации, чтобы прозреть грядущее.') : b.summary;

            if (isLocked) {
              return `
                <div class="fate-step-card ${statusClass}">
                  <div class="fate-step-header">
                    <div class="fate-step-badge">${b.chapter}</div>
                    <h3 class="fate-step-title">${cardTitle}</h3>
                    <span class="fate-step-status">${statusLabel}</span>
                  </div>
                  <p class="fate-step-summary">${cardSummary}</p>
                  <div class="fate-options-grid fate-options-veiled">
                    <div class="fate-option-card locked fate-veiled-card">
                      <div class="fate-option-top">
                        <strong class="fate-option-title">${en ? '✦ Veiled Crossroads' : '✦ Сокрытый перекрёсток'}</strong>
                        <span class="fate-option-badge">${en ? '🔒 Unknown' : '🔒 Неведомо'}</span>
                      </div>
                      <p class="fate-option-desc">${en ? 'Choices and karmic consequences will manifest once you arrive at this milestone.' : 'Выборы и их кармические последствия проявятся, когда ты достигнешь этого рубежа.'}</p>
                    </div>
                  </div>
                </div>
              `;
            }

            return `
              <div class="fate-step-card ${statusClass}">
                <div class="fate-step-header">
                  <div class="fate-step-badge">${b.chapter}</div>
                  <h3 class="fate-step-title">${b.title}</h3>
                  <span class="fate-step-status">${statusLabel}</span>
                </div>
                <p class="fate-step-summary">${b.summary}</p>
                <div class="fate-options-grid">
                  ${b.options.map(opt => {
                    const optState = opt.chosen ? 'chosen' : (b.chosenId ? 'unchosen' : (b.status === 'current' ? 'available' : 'locked'));
                    const badgeText = opt.chosen ? (en ? '✓ Chosen' : '✓ Выбрано') : (b.chosenId ? (en ? '◇ Alternate Path' : '◇ Иной путь') : (b.status === 'current' ? (en ? '✦ Available Choice' : '✦ Доступный выбор') : (en ? '🔒 Unlocked later' : '🔒 Откроется позже')));
                    return `
                      <div class="fate-option-card ${optState}">
                        <div class="fate-option-top">
                          <strong class="fate-option-title">${opt.title}</strong>
                          <span class="fate-option-badge">${badgeText}</span>
                        </div>
                        <p class="fate-option-desc">${opt.desc}</p>
                        <div class="fate-impact-box">
                          <div class="fate-impact-label">✦ ${en ? 'Karmic Consequence:' : 'Кармическое влияние:'}</div>
                          <div class="fate-impact-text">${opt.impact}</div>
                        </div>
                        <div class="fate-option-meta">
                          <span class="fate-reward-pill">🎁 ${opt.reward}</span>
                          <span class="fate-unlocked-pill">📜 ${opt.unlocked}</span>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    if (tab === 'npc') {
      const bonds = getNpcBonds(s, lang);
      if (!bonds.length) {
        return `<p class="intro">${en ? 'No karmic bonds recorded yet. Meet people in the valley to build relationships.' : 'Пока нет записей об узах кармы. Знакомься с жителями долины, чтобы развивать отношения.'}</p>`;
      }
      return `
        <div class="fate-npc-grid">
          ${bonds.map(n => {
            const trustClass = n.trust >= 6 ? 'trust-high' : (n.trust >= 3 ? 'trust-good' : (n.trust < 0 ? 'trust-wary' : 'trust-neutral'));
            return `
              <div class="fate-npc-card ${trustClass}">
                <div class="fate-npc-top">
                  <span class="fate-npc-glyph">${n.glyph}</span>
                  <div class="fate-npc-info">
                    <h3 class="fate-npc-name">${n.name}</h3>
                    <div class="fate-npc-role">${n.role} · <span class="fate-npc-loc">${n.location}</span></div>
                  </div>
                  <span class="fate-trust-badge">${n.relationship}</span>
                </div>
                <div class="fate-trust-gauge-box">
                  <div class="fate-trust-label-row">
                    <span>${en ? 'Karmic Trust' : 'Уровень доверия'}</span>
                    <strong>${n.trust > 0 ? '+' : ''}${n.trust} / 10</strong>
                  </div>
                  <div class="fate-trust-track">
                    <div class="fate-trust-fill" style="width: ${n.trustPercent}%"></div>
                  </div>
                </div>
                ${n.summary ? `<p class="fate-npc-summary"><em>«${n.summary}»</em></p>` : ''}
                <div class="fate-deeds-section">
                  <div class="fate-deeds-label">✦ ${en ? 'Chronicle of Deeds:' : 'Хроника деяний:'}</div>
                  <ul class="fate-deeds-list">
                    ${n.deeds.map(d => `<li>${d}</li>`).join('')}
                  </ul>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    if (tab === 'factions') {
      const factions = getFactions(s, lang);
      return `
        <div class="fate-factions-grid">
          ${factions.map(f => `
            <div class="fate-faction-card">
              <div class="fate-faction-top">
                <span class="fate-faction-glyph">${f.glyph}</span>
                <div class="fate-faction-info">
                  <h3 class="fate-faction-name">${f.name}</h3>
                  <div class="fate-faction-role">${f.role}</div>
                </div>
                <span class="fate-standing-badge">${f.status}</span>
              </div>
              <div class="fate-standing-meter">
                <div class="fate-standing-fill" style="width: ${f.repPercent}%"></div>
              </div>
              <p class="fate-faction-desc">${f.desc}</p>
              <div class="fate-faction-deeds">
                <div class="fate-deeds-label">✦ ${en ? 'Recorded Milestones:' : 'Значимые вехи:'}</div>
                <ul class="fate-deeds-list">
                  ${f.deeds.map(d => `<li>${d}</li>`).join('')}
                </ul>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    return '';
  }

  function renderCompact(s, lang){
    const en = lang === 'en';
    const branches = getStoryBranches(s, lang);
    const ch2Branches = s.stage >= 1 ? getChapterTwoBranches(s, lang) : [];
    const ch3Branches = s.stage >= 2 ? getChapterThreeBranches(s, lang) : [];
    const ch4Branches = s.stage >= 3 ? getChapterFourBranches(s, lang) : [];
    const allBranches = [...branches, ...ch2Branches, ...ch3Branches, ...ch4Branches];
    const completedCount = allBranches.filter(b => b.status === 'completed').length;
    const bonds = getNpcBonds(s, lang);
    const friendlyCount = bonds.filter(b => b.trust >= 3).length;

    return `
      <div class="legacy-fate-summary-card">
        <div class="legacy-fate-stats-row">
          <div class="legacy-fate-stat">
            <span class="legacy-fate-val">${completedCount} / ${allBranches.length}</span>
            <small class="legacy-fate-lbl">${en ? 'Story Branches' : 'Ветвей Судьбы'}</small>
          </div>
          <div class="legacy-fate-stat">
            <span class="legacy-fate-val">${bonds.length}</span>
            <small class="legacy-fate-lbl">${en ? 'Karmic Bonds' : 'Уз Кармы'}</small>
          </div>
          <div class="legacy-fate-stat">
            <span class="legacy-fate-val">${friendlyCount}</span>
            <small class="legacy-fate-lbl">${en ? 'Trusted Allies' : 'Верных союзников'}</small>
          </div>
        </div>
        <div class="legacy-fate-highlights">
          <p><strong>${en ? 'Key Destiny Choices:' : 'Ключевые решения судьбы:'}</strong></p>
          <ul class="legacy-fate-list">
            ${branches.slice(0, 4).map(b => {
              const chosenOpt = b.options.find(o => o.chosen);
              return `<li><strong>${b.chapter}:</strong> ${chosenOpt ? chosenOpt.title : (en ? 'Path open' : 'Путь открыт')}</li>`;
            }).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  const api = {
    getStoryBranches,
    getChapterTwoBranches,
    getChapterThreeBranches,
    getChapterFourBranches,
    getNpcBonds,
    getFactions,
    renderTreeHtml,
    renderCompact
  };

  root.IsekaiFateTree = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
