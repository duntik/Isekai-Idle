(function(root){
  'use strict';
  const G=typeof module!=='undefined'&&module.exports?require('./event-generator.js'):root.IsekaiEventGenerator;
  const C=typeof module!=='undefined'&&module.exports?require('./causal-events.js'):root.IsekaiCausalEvents;
  const M=typeof module!=='undefined'&&module.exports?require('./npc-memory.js'):root.IsekaiNpcMemory;
  const S=typeof module!=='undefined'&&module.exports?require('./sects.js'):root.IsekaiSects;
  const Q=typeof module!=='undefined'&&module.exports?require('./quest-places.js'):root.IsekaiQuestPlaces;
  const locations={
    village:{name:'Деревня у колодца',neutral:'Базовый участок',stage:0,time:30,desc:'Мэй и Жэнь, безопасная работа и помощь в тренировках.',bonus:'Тренировка тела +10%.'},
    forest:{name:'Лес Шепчущих Корней',neutral:'Участок A',stage:0,time:60,desc:'Лекарственные травы, травница Линь и звери на дальних тропах.',bonus:'При исследовании травы +50%.'},
    city:{name:'Город Серебряного Моста',neutral:'Участок B',stage:0,time:90,desc:'Торговцы, библиотекарь Вэй и ученики влиятельных кланов.',bonus:'Оплата принятых здесь заказов +25%.'},
    ruins:{name:'Заброшенный храм',neutral:'Участок C',stage:0,time:60,desc:'Осколки наследия, странник и опасные печати под алтарём.',bonus:'Осколки за исследование +50%.'},
    mountains:{name:'Перевал Облачного Меча',neutral:'Участок D',stage:1,time:120,desc:'Горная руда, одинокий мастер и стражи прохода.',bonus:'Понимание от медитации +20%.'}
  };
  Object.assign(locations,Q.locations);
  const choice=(id,label,neutral,options={})=>({id,label,neutral,...options});
  const encounters={
    village:[
      {id:'village:0',title:'Жэнь поправляет стойку',text:'У колодца старик молча смотрит на твои приседания. «Ты толкаешь землю пятками, а должен держать спину. Повторишь?» Его урок может помочь во всех будущих тренировках.',choices:[choice('lesson','Принять урок Жэня','Оптимизировать подготовку',{mentor:'trainer'}),choice('help','Помочь Мэй с доставкой','Обработать заявку',{reward:{gold:8}})]},
      {id:'village:1',title:'У очага',text:'Мэй замечает усталость: «Сначала горячий чай. Потом снова в дорогу». У стола ждут возчики: им нужен помощник, а тебе — деньги или время перевести дыхание.',choices:[choice('rest','Выпить чай и отдохнуть','Восстановить лимит',{restore:true,reward:{herbs:2}}),choice('work','Разгрузить телегу','Получить оплату',{reward:{gold:12}})]},
      {id:'village:2',title:'Письмо из города',text:'Мальчик-посыльный перепутал адрес. Запечатанное письмо предназначалось библиотекарю Вэю в городе Серебряного Моста. Мэй просит взять его с собой: плату за доставку и благодарность получишь у адресата. Можно пока отказаться и обменять травы у проезжего аптекаря.',requires:s=>!s.world.contacts.includes('scholar')&&!s.world.director.decisions['village:2/letter'],choices:[choice('letter','Взять письмо для Вэя','Принять доставку',{contact:'scholar'}),choice('trade','Обменять 5 трав на 15 монет','Обменять сырьё',{cost:{herbs:5},reward:{gold:15}})]}
    ],
    forest:[
      {id:'forest:0',title:'Травница на тропе',text:'Линь собирает листья серебряной полыни. «Не рви корни — завтра здесь снова будет что собрать». Она готова показать хорошие места, если ты поможешь донести корзину.',choices:[choice('learn','Помочь Линь и научиться сбору','Улучшить сбор',{mentor:'herbalist',reward:{herbs:6}}),choice('gather','Собрать обычные травы','Получить сырьё',{reward:{herbs:10}})]},
      {id:'forest:1',title:'Зверь у ручья',text:'В воде блестит редкий корень. Но между тобой и ручьём стоит клыкастый зверь. Обломанные ветви и глубокие следы когтей показывают: эта тропа не для неопытных. Можно уйти с обычными травами.',choices:[choice('fight','Сразиться за редкий корень','Пройти проверку A',{danger:45,reward:{herbs:25,relics:1}}),choice('leave','Отступить и собрать травы по дороге','Выбрать безопасный сбор',{reward:{herbs:4}})]},
      {id:'forest:2',title:'Раненый путник',text:'У дерева лежит человек с разбитой ногой. Он обещает показать дыхательный приём в обмен на лекарственные травы. Можно поделиться или лишь указать дорогу к деревне.',choices:[choice('heal','Отдать 5 трав и выслушать совет','Получить методику',{cost:{herbs:5},mentor:'breathing',calm:3}),choice('guide','Указать безопасную тропу','Завершить контакт',{reward:{gold:5}})]}
    ],
    city:[
      {id:'city:0',title:'Библиотекарь Вэй',text:'Городской библиотекарь Вэй также хранит архив Пустого Неба. За 10 монет он даст доступ к старой рукописи. Если денег не хватает, можно сначала помочь на складе и заработать плату за чтение.',choices:[choice('study','Оплатить доступ: 10 монет','Получить доступ',{cost:{gold:10},mentor:'scholar',calm:2}),choice('job','Помочь на складе','Выполнить заказ',{reward:{gold:15}})]},
      {id:'city:1',title:'Высокомерный ученик',text:'Юноша в одежде Белого Клыка задевает тебя плечом. «Простолюдин, смотри под ноги!» Его спутники расходятся полукругом. Ответить можно, но твоя сила ещё может оказаться недостаточной.',choices:[choice('challenge','Ответить и принять драку','Пройти проверку B',{danger:80,reward:{gold:30,relics:2}}),choice('avoid','Не вступать в драку','Избежать проверки',{reward:{gold:3}})]},
      {id:'city:2',title:'Лавка алхимика',text:'Аптекарь Хо узнаёт травы из леса. За один осколок он даст редкую пилюлю. Или предложит мелкую работу и поделится остатками лекарств.',choices:[choice('buy','Обменять осколок на пилюлю','Обменять компонент',{cost:{relics:1},reward:{pills:1}}),choice('assist','Разобрать травы в лавке','Выполнить сортировку',{reward:{herbs:5,gold:7}})]}
    ],
    ruins:[
      {id:'ruins:0',title:'Странник у алтаря',text:'Человек в сером плаще уже осмотрел храм. «Под пеплом есть знак. Не спеши вскрывать печати». Он предлагает показать надпись; другой путь — поискать материалы среди камней.',choices:[choice('listen','Выслушать странника','Продвинуть исследование',{explore:60,reward:{herbs:3}}),choice('search','Разобрать обломки','Получить материалы',{reward:{ore:5,relics:1}})]},
      {id:'ruins:1',title:'Печать под камнем',text:'За треснувшей плитой виднеется светящийся осколок. Когда ты тянешь руку, оживает силуэт стража. Слабого он не пропустит. Можно оставить печать нетронутой.',choices:[choice('break','Пробить печать стража','Пройти проверку C',{danger:65,reward:{relics:3,qi:15}}),choice('retreat','Отойти и переписать надписи','Сохранить наблюдения',{explore:20,calm:1})]},
      {id:'ruins:2',title:'Эхо прежнего мастера',text:'Короткая строка проявляется на стене: «Техника без понимания — пустое движение». Ты можешь долго повторять её ритм или забрать небольшой осколок рядом.',choices:[choice('understand','Запомнить ритм дыхания','Изучить образец',{mentor:'breathing',calm:2}),choice('take','Взять свободный осколок','Забрать компонент',{reward:{relics:1}})]}
    ],
    mountains:[
      {id:'mountains:0',title:'Наставница у обрыва',text:'Наставница Юнь из Облачного Предела следит за облаками. За духовную энергию она согласна показать движение меча. Без платы можно помочь ей собрать руду и получить часть находок.',choices:[choice('lesson','Отдать 10 энергии за урок','Получить настройку',{cost:{qi:10},mastery:1,mentor:'swordsman'}),choice('mine','Собрать руду вместе','Получить материал C',{reward:{ore:12}})]},
      {id:'mountains:1',title:'Страж прохода',text:'Страж требует доказать право пройти дальше. За его спиной видны залежи духовного камня. Обход длиннее, зато не требует боя.',choices:[choice('fight','Принять испытание стража','Пройти проверку D',{danger:250,reward:{ore:30,relics:3}}),choice('detour','Выбрать обходную тропу','Безопасный маршрут',{reward:{ore:5}})]},
      {id:'mountains:2',title:'Тихий источник',text:'Узкая пещера скрывает источник чистой энергии. Здесь можно успокоить мысли или наполнить флягу для будущих прорывов.',choices:[choice('meditate','Посидеть у источника','Восстановить концентрацию',{calm:5,restore:true}),choice('collect','Набрать духовную воду','Получить резерв',{reward:{qi:20}})]}
    ]
  };
  const mentorNames={trainer:'Наставления Жэня: тело +15%',herbalist:'Совет Линь: травы при исследовании +20%',breathing:'Дыхательный приём: понимание +10%',scholar:'Рукопись Вэя: понимание +15%',swordsman:'Урок Юнь: освоение техники +15%'};
  const admissions={
    rescue:{name:'Нефритовая Роща · наставник Сэнь',neutral:'Допуск A',gift:{herbs:20},text:'Спасённый в лесу Сэнь поручился за тебя. Он примет тебя личным учеником и передаст 20 лекарственных трав при вступлении.'},
    remains:{name:'Облачный Предел · наставница Юнь',neutral:'Допуск B',mastery:1,text:'Ты вернёшь останки пропавшего ученика. Юнь благодарна за возможность проститься и предлагает место в школе меча. Её личный урок при вступлении даст +1 освоения техники.'},
    invitation:{name:'Пустое Небо · хранитель Вэй',neutral:'Допуск C',gift:{qi:40},text:'Найденная карта открывает доступ к отбору хранителей древних печатей. При вступлении хранитель передаст 40 духовной энергии для изучения наследия.'},
    gates:{name:'Каменный Оплот · общий набор',neutral:'Допуск D',gift:{reputation:10},text:'Ты самостоятельно пришёл в городское представительство. Без поручителя придётся пройти общий отбор и начинать с внешних учеников. Успешное испытание даст 10 репутации при вступлении.'}
  };
  encounters.forest[2].text='У дерева лежит раненый Сэнь, наставник Нефритовой Рощи. Если поделиться травами, он покажет дыхательный приём и предложит стать его учеником после подготовки к вступлению.';
  encounters.forest[2].choices[0].admission='rescue';
  encounters.ruins.push(
    {id:'ruins:3',title:'Последний путь ученика',text:'Под обвалом лежит погибший ученик Облачного Предела. На жетоне имя: Цзинь. Можно бережно завернуть останки и вернуть их школе через представительство в городе. Это поступок благодарности, а не добыча.',choices:[choice('return-remains','Забрать останки для возвращения в секту','Оформить передачу',{admission:'remains'}),choice('respect','Почтить память и уйти','Завершить осмотр',{calm:1})]},
    {id:'ruins:4',title:'Карта приглашения',text:'В тайнике сохранилась карта с печатью Пустого Неба. На обороте указан адрес городского представительства. Карта позволяет подать заявку, но испытание силы всё равно придётся пройти.',choices:[choice('invitation','Сохранить карту приглашения','Сохранить допуск',{admission:'invitation'}),choice('leave-card','Оставить карту в тайнике','Пропустить документ',{calm:1})]}
  );
  const canApply=(s,k)=>(s.stage===1||(s.stage===0&&(s.storyStep>=6||s.chapterOneRoute)))&&!s.world.journey&&s.world.location==='city'&&!!admissions[k]&&(k==='gates'||s.world.admissionRoutes.includes(k));
  encounters.village.push(
    {id:'village:3',title:'Плотник Дао',text:'Дао чинит дверь постоялого двора. Он просит придержать доски и обещает заплатить. Можно вместо работы расспросить его о заброшенном храме. Дао объяснит, где начинается тропа, и посоветует не трогать печати: ясный план успокаивает, но осмотреть храм придётся самому.',choices:[choice('carpenter-help','Помочь с дверью','Выполнить заявку',{reward:{gold:9}}),choice('carpenter-map','Расспросить о храме','Получить сведения',{calm:2})]},
    {id:'village:4',title:'Повторный урок Жэня',text:'Жэнь узнаёт тебя у колодца. «Стойку помнишь? Теперь держи дыхание ровным». Он предлагает спокойно повторить движение, без чудесного роста силы.',requires:s=>s.world.mentors.includes('trainer'),choices:[choice('trainer-review','Повторить урок','Повторить методику',{calm:2}),choice('trainer-rest','Отдохнуть рядом с наставником','Восстановить лимит',{restore:true})]}
  );
  encounters.forest.push(
    {id:'forest:3',title:'Следопыт Ань',text:'Ань проверяет следы у лесной развилки. Он расскажет о безопасном сборе, если помочь разобрать связку трав. Можно отказаться и пойти другой тропой.',choices:[choice('tracker-help','Разобрать травы со следопытом','Обработать сырьё',{reward:{herbs:7,gold:3}}),choice('tracker-leave','Продолжить путь','Завершить контакт',{calm:1})]},
    {id:'forest:4',title:'Корзина для Линь',text:'Линь узнаёт своего помощника. Сегодня ей нужны пять обычных трав для деревенской лечебницы. Она предлагает честную оплату, а не ещё один первый урок.',requires:s=>s.world.mentors.includes('herbalist'),choices:[choice('herbalist-order','Передать 5 трав за 12 монет','Обменять сырьё',{cost:{herbs:5},reward:{gold:12}}),choice('herbalist-talk','Обсудить места сбора','Уточнить методику',{calm:2})]}
  );
  encounters.city.push(
    {id:'city:3',title:'Курьер Жу',text:'На площади Жу ищет помощника: нужно донести свитки до торгового ряда. Это короткая городская работа, не путешествие в опасные земли.',choices:[choice('courier-help','Доставить свитки','Выполнить доставку',{reward:{gold:10}}),choice('courier-talk','Спросить о наборе в секты','Получить сведения',{calm:1})]},
    {id:'city:4',title:'Поручение своего представительства',text:'Служитель узнаёт знак твоей секты. Нужно разобрать привезённые травы; за помощь засчитают поручение. Незнакомого чужака к внутренним делам не допустили бы.',requires:s=>s.stage>=2&&!!s.world.admission,choices:[choice('sect-delivery','Передать 5 трав для секты','Завершить внутреннюю заявку',{cost:{herbs:5},reward:{reputation:8,gold:8}}),choice('sect-news','Узнать новости учеников','Обновить сведения',{calm:2})]}
  );
  encounters.ruins.push({id:'ruins:5',title:'Исследователь Тан',text:'Тан копирует надписи у входа. Он не требует трогать опасную печать: можно помочь снять отпечаток или поискать обломки на поверхности.',choices:[choice('research-help','Помочь переписать знаки','Собрать данные',{explore:30,calm:1}),choice('research-shards','Осмотреть поверхностные обломки','Получить материал',{reward:{ore:3}})]});
  encounters.mountains.push({id:'mountains:3',title:'Горняк Бо',text:'Бо отдыхает у отмеченной безопасной выработки. Он отдаст несколько кусков руды за лекарственные травы. Драться с горным стражем ради этой сделки не нужно.',choices:[choice('miner-trade','Обменять 3 травы на 8 руды','Обменять материалы',{cost:{herbs:3},reward:{ore:8}}),choice('miner-rest','Перевести дыхание у выработки','Восстановить лимит',{restore:true})]});
  encounters.village[0].requires=s=>!s.world.mentors.includes('trainer');
  encounters.forest[0].requires=s=>!s.world.mentors.includes('herbalist');
  encounters.forest[2].requires=s=>s.stage<=1&&!s.world.admissionRoutes.includes('rescue');
  encounters.ruins[3].requires=s=>s.stage<=1&&!s.world.admissionRoutes.includes('remains');
  encounters.ruins[4].requires=s=>s.stage<=1&&!s.world.admissionRoutes.includes('invitation');
  encounters.city[1].requires=s=>s.stage<=2;
  encounters.village[0].text+=' После помощи Мэй познакомит тебя с возчиками: у них бывают заказы на ящики и сверку накладных.';
  encounters.village[1].text+=' Если согласишься помочь возчикам, они будут предлагать заказы на перенос ящиков и сверку накладных здесь, в деревне.';
  encounters.city[0].text+=' Работа на складе открывает местные заказы на ящики и уборку двора. После чтения рукописи Вэй доверит тебе сверку накладных своего архива.';
  encounters.city[3].text+=' После доставки Жу познакомит тебя с городскими складскими хозяевами: они поручают перенос ящиков и уборку двора.';
  const chose=(s,id)=>!!s.world.director.decisions[id];
  encounters.village.push({id:'village:road-return',once:true,title:'Весть с городской дороги',text:'Мэй слышала, что ты не дал ученику Белого Клыка втянуть тебя в драку. «Иногда сохранить силы важнее, чем ответить». Возчики предлагают небольшую доставку, а Мэй — запас трав для дальнейшего пути.',requires:s=>chose(s,'city:1/avoid'),choices:[choice('road-work','Помочь возчикам с доставкой','Выполнить доставку',{reward:{gold:12}}),choice('road-herbs','Принять травы от Мэй','Получить помощь',{reward:{herbs:8}})]});
  encounters.forest.push({id:'forest:sen-followup',once:true,title:'Сэнь держит слово',text:'Сэнь уже может идти сам. Он узнаёт того, кто поделился травами: «Долг не забывают. Вот припасы для твоих первых прорывов». Можно попросить лекарства или спокойный урок дыхания. Это продолжение вашей встречи, а не новое спасение.',requires:s=>chose(s,'forest:2/heal')||s.world.admissionRoutes.includes('rescue'),choices:[choice('sen-herbs','Принять лекарственные травы','Получить помощь',{reward:{herbs:12}}),choice('sen-breath','Повторить дыхательный приём','Повторить методику',{reward:{qi:12},calm:3})]});
  encounters.city.push({id:'city:lin-delivery',once:true,title:'Записка Линь для Хо',text:'Хо получил записку Линь: ты передал травы для деревенской лечебницы. Он готов поделиться лекарством или оплатить помощь. Связь между людьми оказывается полезнее случайной удачи.',requires:s=>chose(s,'forest:4/herbalist-order'),choices:[choice('clinic-pill','Принять пилюлю Хо','Получить лекарство',{reward:{pills:1}}),choice('clinic-pay','Получить плату за помощь лечебнице','Получить оплату',{reward:{gold:18}})]});
  encounters.ruins.push({id:'ruins:archive-clue',once:true,title:'Сверить храмовые знаки',text:'Знакомство с архивом Вэя помогло распознать знак: храм был частью сети духовных источников. Это объясняет тепло осколка, но не делает тебя сильнее мгновенно. Можно сохранить образец или спокойно изучить надпись.',requires:s=>s.found&&s.world.mentors.includes('scholar'),choices:[choice('archive-shard','Сохранить образец печати','Сохранить образец',{reward:{relics:2}}),choice('archive-study','Разобрать надпись','Изучить образец',{reward:{qi:15},calm:3})]});
  encounters.city.push({id:'city:wei-letter',once:true,title:'Письмо дошло до Вэя',text:'Вэй сверяет печать на письме, которое ты принёс от Мэй. «Посыльный сбился с дороги. Спасибо, что довёз». Он выдаёт плату за доставку и разрешает прочитать рукопись о духовных потоках. Для деревенских возчиков Вэй пишет рекомендацию: его архив пользуется поддержкой городского представительства, и обоз с таким поручительством вымогатели обычно оставляют в покое. Покажи письмо возчикам в деревне, если решишь помочь без боя.',requires:s=>s.world.contacts.includes('scholar')||chose(s,'village:2/letter'),choices:[choice('deliver-letter','Передать письмо и получить рекомендацию','Завершить доставку',{reward:{gold:10},mentor:'scholar',calm:2})]});
  // Optional local apprenticeships: every thread remains open, with no exclusive class choice.
  const localScene=(place,id,title,text,enTitle,enText,requires,choices)=>encounters[place].push({id,once:true,title,text,en:{title:enTitle,text:enText},requires,choices});
  const localChoice=(id,label,en,options={})=>choice(id,label,label,{en:{label:en,neutral:en},...options});
  localScene('village','village:ren-load','Вес груза','Жэнь видит, как ты берёшься за работу. «Сила не в рывке: поставь ноги, подними ногами, дыши на усилии». После твоего знакомства с возчиками он готов провести первый урок с пустыми ящиками. Можно учиться или попросить отдых: заказ на чужом дворе отсюда не выполнить.','The weight of a load','Ren watches you work. “Strength is not a sudden pull: plant your feet, lift with your legs and breathe out on effort.” Now that you know the carters, he offers a lesson with empty crates. Learn or rest; work at another yard cannot be done here.',s=>s.stage<=1&&(chose(s,'village:0/help')||chose(s,'village:1/work')),[localChoice('lift','Освоить безопасный подъём','Learn safe lifting',{mentor:'trainer',reward:{gold:5,herbs:3},calm:1}),localChoice('later','Пока отдохнуть','Rest for now',{restore:true,skip:true})]);
  localScene('village','village:ren-balance','Корзины на коромысле','Жэнь предлагает перенести два небольших ведра от колодца до очага Мэй. Это урок равновесия, а не обещание лёгких денег. Сначала нужен крепкий шаг: тело 2. После помощи Мэй поделится едой и даст травы на восстановление.','Buckets in balance','Ren offers a balance lesson: carry two small buckets from the well to Mei’s hearth. It takes a steady step: body 2. Mei will share food and herbs for recovery afterward.',s=>s.stage<=1&&chose(s,'village:ren-load/lift'),[localChoice('carry','Перенести вёдра: тело 2','Carry the buckets: body 2',{requires:s=>s.body>=2,reward:{gold:8,herbs:5},practice:{technique:'stance',amount:30}}),localChoice('later','Вернуться после тренировок','Return after training',{skip:true})]);
  localScene('village','village:ren-route','Надёжный помощник','Возчики запомнили твою аккуратность. Они предлагают выбрать: припасы для дороги в храм или спокойный разбор стойки с Жэнем. Рекомендация не делает тебя членом секты; найденный в пути наставник всё ещё может изменить твою жизнь.','A reliable helper','The carters remember your careful work. Choose supplies for the temple road or a quiet stance review with Ren. Their trust does not make you a sect disciple; a mentor found along the way can still change your life.',s=>s.stage<=1&&chose(s,'village:ren-balance/carry'),[localChoice('supplies','Взять припасы для дороги','Take road supplies',{reward:{gold:12,herbs:8}}),localChoice('practice','Разобрать стойку с Жэнем','Review your stance with Ren',{practice:{technique:'stance',amount:60},calm:2,reward:{herbs:3}})]);
  localScene('forest','forest:lin-leaves','Лист, стебель и корень','Линь узнаёт помощника и раскладывает похожие растения на ткани. Одно лечит, другое раздражает кожу. «Назови признаки, прежде чем сорвать». Можно пройти спокойный урок или взять обычные травы: оба решения оставляют другие пути открытыми.','Leaf, stem and root','Lin recognises her helper and lays similar plants on cloth. One heals; another irritates skin. “Name the signs before picking.” Take a quiet lesson or collect ordinary herbs. Both choices leave other paths open.',s=>s.stage<=1&&s.world.mentors.includes('herbalist'),[localChoice('identify','Учиться различать растения','Learn to identify plants',{calm:2,reward:{herbs:8}}),localChoice('later','Собрать обычные травы и вернуться позже','Gather common herbs and return later',{reward:{herbs:3},skip:true})]);
  localScene('forest','forest:lin-clinic','Для деревенской лечебницы','Линь собирается отправить лекарство Мэй. Она доверит тебе рецепт настоя, если ты отдашь пять обычных трав. Сначала проверь сырьё, потом отнеси записку в деревню. Лечение требует внимания, а благодарность получишь после доставки.','For the village clinic','Lin is preparing medicine for Mei. Give her five common herbs and she will show the infusion recipe. Check the ingredients, then carry her note to the village; thanks come after delivery.',s=>s.stage<=1&&chose(s,'forest:lin-leaves/identify'),[localChoice('prepare','Передать 5 трав и приготовить настой','Give 5 herbs and prepare an infusion',{cost:{herbs:5},calm:3,reward:{herbs:4}}),localChoice('later','Вернуться с травами','Return with herbs',{skip:true})]);
  localScene('village','village:lin-delivered','Настой дошёл до очага','Мэй читает записку Линь и принимает приготовленный настой. «Теперь я знаю, кому доверить травы». Она оплачивает доставку. Можно попросить запас трав или отдых; лекарское обучение доступно и тому, кто продолжает укреплять тело.','The infusion reaches the hearth','Mei reads Lin’s note and accepts the infusion. “Now I know whom to trust with herbs.” She pays for delivery. Ask for herbs or rest; learning medicine remains open even while training your body.',s=>s.stage<=1&&chose(s,'forest:lin-clinic/prepare'),[localChoice('herbs','Передать настой и получить травы','Deliver the infusion and receive herbs',{reward:{gold:12,herbs:10}}),localChoice('rest','Передать настой и отдохнуть','Deliver the infusion and rest',{reward:{gold:12},restore:true,calm:2})]);
  localScene('city','city:wei-margin','Заметка на полях','Вэй видит, что рукопись заинтересовала тебя. На полях нарисован знак заброшенного храма. Он предлагает сделать точную копию: не вскрывать печати, а сравнить линии. Это исследование можно совместить с работой или уроками других наставников.','A note in the margin','Wei sees your interest in the manuscript. A temple symbol is drawn in the margin. Make a careful copy, then compare its lines at the abandoned temple without opening seals. This research can be combined with work or other mentors’ lessons.',s=>s.stage<=1&&s.world.mentors.includes('scholar'),[localChoice('copy','Скопировать знак для сверки в храме','Copy the symbol to compare at the temple',{calm:2,reward:{herbs:3}}),localChoice('later','Сначала отдохнуть','Rest first',{restore:true,skip:true})]);
  localScene('ruins','ruins:wei-compare','Знак на внешней стене','Копия Вэя совпадает со знаком на внешней стене. Здесь нет стража: опасные печати глубже. Сопоставить линии можно с ясной головой — спокойствие 3. Исследование помогает понять устройство храма, но само наследие ещё предстоит найти.','The outer-wall symbol','Wei’s copy matches a symbol on the outer wall. No guardian stands here; the dangerous seals are deeper. Comparing the lines takes calm 3. The study helps you understand the temple, but the legacy must still be found.',s=>s.stage<=1&&chose(s,'city:wei-margin/copy'),[localChoice('compare','Сверить линии: спокойствие 3','Compare the lines: calm 3',{requires:s=>s.calm>=3,explore:90,calm:2,reward:{herbs:4}}),localChoice('later','Вернуться после отдыха','Return after resting',{skip:true})]);
  localScene('city','city:wei-return','Один знак — часть сети','Вэй сверяет твою копию с архивом. «Значит, храм был узлом, а не дворцом. Ты сделал полезное наблюдение». За работу он платит и предлагает материалы для дальнейшего обучения. Даже хороший исследователь может нуждаться в сильном теле или помощи травника.','One symbol in a network','Wei compares your copy with the archive. “So the temple was a node, not a palace. A useful observation.” He pays for your work and offers study materials. A good researcher may still need a strong body or a herbalist’s help.',s=>s.stage<=1&&chose(s,'ruins:wei-compare/compare'),[localChoice('study','Получить плату и материалы для обучения','Receive payment and study materials',{reward:{gold:15,herbs:6},calm:3}),localChoice('medicine','Получить плату и дорожные травы','Receive payment and travel herbs',{reward:{gold:15,herbs:10},calm:1})]);
  const forestSearches=[
    ['trail','Под пологом деревьев','Beneath the canopy','Птицы ещё перекликаются, но на влажной земле видны свежие следы. У ручья растёт полынь. Можно собрать её вдоль тропы или пройти за следами к корням.','Birds still call, but fresh tracks mark the damp soil. Wormwood grows by the stream. You can gather along the trail or follow the tracks towards the roots.',30,8],
    ['deep','За сломанными ветвями','Beyond the broken branches','Свет опушки исчезает. Птицы замолкли; на коре свежие борозды, а у редкого корня шевелится тяжёлая тень. Обратная тропа пока хорошо видна.','The light of the edge fades. Birds have fallen silent; fresh gouges scar the bark and a heavy shadow moves beside a rare root. The way back is still clearly visible.',65,20],
    ['deep-old','След у чёрного ручья','Tracks by the black stream','Под ногами хрустят кости. След шире твоей ладони; из-за камней слышно низкое дыхание. За ручьём блестит духовный корень. Ещё можно уйти, пока тебя не заметили.','Bones crack underfoot. A track is wider than your palm; low breathing comes from behind the rocks. A spirit root glints across the stream. You can still leave before being noticed.',110,30]
  ];
  for(const[key,title,enTitle,text,enText,danger,herbs]of forestSearches)encounters.forest.push({id:`forest:search-${key}`,exploration:true,remote:true,requires:s=>s.world.encounter?.id===`forest:search-${key}`,title,text,en:{title:enTitle,text:enText},choices:[
    choice('gather','Собрать у обратной тропы','Собрать у обратной тропы',{reward:{herbs:3},calm:.2,en:{label:'Gather beside the return trail'}}),
    choice('press','Подойти к корню, не сводя глаз с тени','Подойти к корню',{danger,reward:{herbs,relics:key==='trail'?0:1},riskCue:text,en:{label:'Approach the root, watching the shadow',riskCue:enText}}),
    choice('retreat','Вернуться по своим следам','Вернуться по своим следам',{skip:true,en:{label:'Return along your own tracks'}})
  ]});
  for(const[k,list]of Object.entries(Q.build()))encounters[k]=list;
  for(const[sceneId,ids,place]of [['village:ren-balance',['carry'],'village-mill'],['village:lin-delivered',['herbs','rest'],'forest-garden'],['city:wei-return',['study','medicine'],'ruins-observatory'],['city:2',['assist'],'city-apothecary'],['city:huo-clinic',['clinic-pill','clinic-pay'],'city-apothecary'],['mountains:0',['lesson','mine'],'mountains-cliff']])for(const c of Object.values(encounters).flat().find(e=>e.id===sceneId)?.choices||[])if(ids.includes(c.id))c.opensPlace=place;
  for(const[k,list]of Object.entries(S.build()))encounters[k].push(...list);
  for(const[k,list]of Object.entries(G.build()))encounters[k].push(...list);
  if(C)for(const[k,list]of Object.entries(C.build()))encounters[k].push(...list);
  for(const[k,list]of Object.entries(encounters))for(const[e,scene]of list.entries())scene.id??=`${k}:${e}`;
  const uniqueIds=['forest:2','ruins:3','ruins:4',...Object.values(encounters).flat().filter(e=>e.once).map(e=>e.id)];
  const opportunity=(s,scene)=>scene.choices.some(c=>(c.mentor&&!s.world.mentors.includes(c.mentor))||(c.admission&&!s.world.admissionRoutes.includes(c.admission)))||(scene.once&&!scene.generated)||scene.payoff;
  const eligible=(s,scene)=>!s.world.completed.includes(scene.id)&&(!scene.requires||scene.requires(s));
  function random(w){let x=w.seed;x^=x<<13;x^=x>>>17;x^=x<<5;w.seed=x>>>0;return w.seed/4294967296;}
  const physical=['gold','herbs','qi','relics','wood','ore','pills','supplies','cosmic'];
  const fresh=()=>({location:'village',journey:null,encounter:null,people:M?.fresh()||{},map:{explored:[],sites:[]},visits:Object.fromEntries(Object.keys(locations).map(k=>[k,0])),mentors:[],contacts:[],admissionRoutes:[],admission:null,admissionGiftAwarded:false,director:{misses:{},decisions:{},paths:{},pending:{}},seed:Math.floor(Math.random()*4294967295)+1,recent:[],completed:[],deaths:0,encounterCooldown:0});
  const sceneText=(item,field,language='ru',state)=>{const value=language==='en'&&item.en?.[field]?item.en[field]:item[field]||'';return typeof value==='function'?value(state):value;};
  const recognition=(s,chapter=s.stage)=>Object.values(s.world.director.paths[chapter]||{}).reduce((sum,n)=>sum+n,0);
  const recognitionNeeded=s=>12+Math.max(0,s.stage-1)*8;
  const pathNames={help:'Помощь людям',study:'Знания и техники',trade:'Снабжение',combat:'Защита от вымогателей'};
  function developmentPaths(s,language='ru'){
    const en=language==='en',step=ids=>ids.reduce((n,id)=>n+(chose(s,id)?1:0),0);
    return [
      {id:'labor',name:en?'Carters and Ren':'Возчики и Жэнь',description:en?'Strength, paid work and practical balance.':'Сила, оплачиваемая работа и практическое равновесие.',progress:step(['village:ren-load/lift','village:ren-balance/carry'])+(chose(s,'village:ren-route/supplies')||chose(s,'village:ren-route/practice')?1:0),next:en?'In the village, meet the carters; learn lifting with Ren, train body 2 and carry his buckets.':'В деревне познакомься с возчиками; учись подъёму у Жэня, укрепи тело до 2 и перенеси его вёдра.'},
      {id:'herbal',name:en?'Lin and the clinic':'Линь и лечебница',description:en?'Gathering, careful preparation and medicine deliveries.':'Сбор трав, внимательная подготовка и доставка лекарств.',progress:step(['forest:lin-leaves/identify','forest:lin-clinic/prepare'])+(chose(s,'village:lin-delivered/herbs')||chose(s,'village:lin-delivered/rest')?1:0),next:en?'Meet Lin at the forest edge; identify leaves, prepare 5 herbs and return to Mei in the village.':'Встреть Линь на опушке; различи листья, подготовь 5 трав и вернись к Мэй в деревню.'},
      {id:'archive',name:en?'Wei and the temple signs':'Вэй и храмовые знаки',description:en?'Observation, manuscripts and safe study of the temple.':'Наблюдения, рукописи и безопасное изучение храма.',progress:step(['city:wei-margin/copy','ruins:wei-compare/compare'])+(chose(s,'city:wei-return/study')||chose(s,'city:wei-return/medicine')?1:0),next:en?'Take Mei’s letter to Wei; copy the archive symbol, gain calm 3 and compare it at the temple, then return to the city.':'Отнеси письмо Мэй Вэю; скопируй знак, накопи спокойствие 3, сверь его в храме и вернись в город.'}
    ].map(p=>{
      const say=(ru,english)=>en?english:ru;
      if(p.progress===3)p.next=say('Местные уроки завершены. Продолжай этот путь или учись у другого наставника.','The local lessons are complete. Continue this path or learn from another mentor.');
      else if(p.id==='labor'){
        if(!chose(s,'village:0/help')&&!chose(s,'village:1/work'))p.next=say('Возможность: познакомься с возчиками у Мэй в деревне.','Opportunity: meet Mei’s carters in the village.');
        else if(p.progress===0)p.next=say('В деревне может встретиться Жэнь с уроком безопасного подъёма.','In the village, Ren may offer a safe-lifting lesson.');
        else if(p.progress===1)p.next=s.body<2?say('Для урока с вёдрами укрепи тело до 2 работой или упражнениями; затем встреть Жэня в деревне.','Train body to 2 through work or exercises, then meet Ren in the village for the bucket lesson.'):say('Вернись к колодцу в деревне: Жэнь может предложить урок равновесия.','Return to the village well: Ren may offer the balance lesson.');
        else p.next=say('В деревне возчики могут предложить припасы или повторение стойки.','In the village, the carters may offer supplies or a stance review.');
      }else if(p.id==='herbal'){
        if(!s.world.mentors.includes('herbalist'))p.next=say('Возможность: на лесной опушке встреть травницу Линь и помоги с корзиной.','Opportunity: meet herbalist Lin at the forest edge and help with her basket.');
        else if(p.progress===0)p.next=say('В лесу Линь может показать, как различать похожие растения.','In the forest, Lin may teach you to identify similar plants.');
        else if(p.progress===1)p.next=say('Подготовь 5 трав и встреть Линь в лесу для урока настоя.','Prepare 5 herbs and meet Lin in the forest for the infusion lesson.');
        else p.next=say('Настой готов. Вернись к Мэй в деревню и дождись встречи у очага.','The infusion is ready. Return to Mei in the village and meet her at the hearth.');
      }else{
        if(!s.world.mentors.includes('scholar'))p.next=s.world.contacts.includes('scholar')?say('Отнеси письмо Вэю в город; его рукопись может открыть путь исследователя.','Deliver the letter to Wei in the city; his manuscript may open the researcher’s path.'):say('Возможность: у Мэй в деревне можно узнать о письме для городского библиотекаря.','Opportunity: Mei in the village may have a letter for the city librarian.');
        else if(p.progress===0)p.next=say('В городском архиве Вэй может предложить копирование храмового знака.','At the city archive, Wei may offer a temple-symbol copying lesson.');
        else if(p.progress===1)p.next=say('Копия готова. Накопи спокойствие 3 и осмотри внешнюю стену храма.','The copy is ready. Gain calm 3 and inspect the temple’s outer wall.');
        else p.next=say('Наблюдения собраны. Вернись к Вэю в городской архив.','Your observations are ready. Return to Wei at the city archive.');
      }
      return {...p,total:3};
    });
  }
  const pendingQuests=s=>Object.entries(s.world.director.pending).map(([id,deed])=>{const location=id.split(':')[0];return {scene:encounters[location].find(e=>e.id===id),location,...deed};});
  const canChoice=(s,c,E)=>!!c&&!s.world.journey&&(!(current(s)?.generated||current(s)?.once)||c.skip||eligible(s,current(s)))&&(!c.requires||c.requires(s))&&E.affordable(s,c.cost||{})&&(!c.recognition||!!s.world.director.pending[c.recognition]);
  const current=s=>{const e=s.world.encounter;return e?(e.id?encounters[e.location].find(scene=>scene.id===e.id):encounters[e.location][e.index]):null;};
  const frontiers={
    'dark-forest':{base:'forest',name:'Тёмная чаща',en:'Dark thicket',x:5,y:1,scene:'forest:1',ready:s=>s.body>=8&&s.calm>=5||s.realm>=1,reason:'Из темноты смотрят звериные глаза. Ноги не слушаются: ты отступаешь к светлой опушке. Укрепи тело до 8 и накопи 5 спокойствия или достигни первого духовного уровня.',reasonEn:'Animal eyes watch from the darkness. Your legs refuse to move: you retreat to the bright forest edge. Train your body to 8 and gain 5 calm, or reach spiritual realm 1.'},
    'sealed-crypt':{base:'ruins',name:'Запечатанный склеп',en:'Sealed crypt',x:1,y:0,scene:'ruins:1',ready:s=>s.found&&s.realm>=1,reason:'Печать давит на грудь. Пока ты не нашёл наследие и не достиг первого духовного уровня, тело не выдержит даже подхода к двери.',reasonEn:'The seal presses against your chest. Discover the legacy and reach spiritual realm 1 before approaching this door.'},
    'upper-pass':{base:'mountains',name:'Верхняя тропа перевала',en:'Upper pass trail',x:6,y:0,scene:'mountains:1',ready:s=>s.realm>=3,reason:'Страж опускает копьё: дальше идут только практики третьего духовного уровня. Нижний склон остаётся открыт.',reasonEn:'The guard lowers his spear: only practitioners of spiritual realm 3 may pass. The lower slope remains open.'}
  };
  encounters.forest[1].requires=s=>frontiers['dark-forest'].ready(s);
  encounters.ruins[1].requires=s=>frontiers['sealed-crypt'].ready(s);
  encounters.mountains[1].requires=s=>frontiers['upper-pass'].ready(s);
  function knownLocations(s){return Object.keys(locations).filter(k=>locations[k].stage<=s.stage&&(locations[k].unlock?locations[k].unlock(s):(k==='village'||k==='city'&&(s.world.contacts.includes('scholar')||s.world.admissionRoutes.length)||k===s.world.location||s.world.visits[k]>0||(s.storyStep>=1||s.stage>=1)&&k!=='mountains'||s.stage>=1&&k==='mountains')));}
  function travelReason(s,k,language='ru'){
    const say=(ru,en)=>language==='en'?en:ru;
    if(!locations[k]||!knownLocations(s).includes(k))return say('Дорога ещё неизвестна.','This route is not yet known.');
    if(s.world.journey)return say('Сначала закончи текущий переход.','Finish the current journey first.');
    if(s.world.location===k)return say('Ты уже здесь.','You are already here.');
    if(locations[k].parent&&s.world.location!==locations[k].parent)return say('Сначала вернись в ближайшую область: ','First return to the nearby area: ')+(language==='en'?({village:'Wellside Village',forest:'Whispering Roots Forest',ruins:'Abandoned Temple',city:'Silver Bridge City',mountains:'Cloud Sword Pass'}[locations[k].parent]):locations[locations[k].parent].name);
    if(k==='city'&&s.stage<1&&!s.world.contacts.includes('scholar')&&!s.world.admissionRoutes.length)return say('Страж не пускает безымянного оборванца за ворота. Получи у Мэй письмо для Вэя, поручительство наставника или приглашение секты; начинающих практиков также пропускают.','The guard refuses an unknown ragged stranger. Obtain Mei’s letter for Wei, a mentor’s recommendation or a sect invitation; novice practitioners are also admitted.');
    return '';
  }
  const canTravel=(s,k)=>!!locations[k]&&!travelReason(s,k);
  const travelTime=(s,k)=>Math.ceil(locations[k].time*((s.atlas?.surveys[k]||0)>=2?.8:1));
  function locationDesc(s,id,language='ru'){
    const visited=(s.world.visits[id]||0)>0||s.world.location===id;
    const en=language==='en';
    if(!visited){
      if(id==='forest'&&(s.storyStep>=1||s.stage>0)){
        return en
          ?'From Mei’s rumours: travellers speak of a bright forest edge with medicinal herbs, but beasts lurk deeper in.'
          :'По слухам от Мэй: на светлой опушке растут целебные травы, но в глубине леса путники видят звериные глаза.';
      }
      if(id==='ruins'&&(s.storyStep>=1||s.stage>0)){
        return en
          ?'From Mei’s rumours: an abandoned temple lies beyond the village; dangerous seals lie beneath its altar.'
          :'По слухам от Мэй: за деревней есть заброшенный храм; под его алтарём скрыты опасные печати.';
      }
      if(id==='city'&&s.world.contacts.includes('scholar')){
        return en
          ?'From Mei’s letter: scholar Wei serves in the Silver Bridge City archive.'
          :'По письму от Мэй: в городском архиве служит библиотекарь Вэй.';
      }
      return en
        ?'Unexplored area. You only know the name and direction.'
        :'Неизведанная область. Ты знаешь лишь название и направление.';
    }
    return en&&locations[id].en?.desc?locations[id].en.desc:locations[id].desc;
  }
  function map(s,language='ru'){
    const coords={village:[1,1],forest:[2,1],city:[0,1],ruins:[1,0],mountains:[2,0],...Object.fromEntries(Object.entries(Q.locations).map(([k,p])=>[k,p.coords]))};
    const known=knownLocations(s),nodes=known.map(id=>({id,kind:'location',name:locations[id].name,x:coords[id][0],y:coords[id][1],visited:s.world.visits[id]>0||s.world.location===id,locked:!!travelReason(s,id,language),reason:travelReason(s,id,language),detail:locationDesc(s,id,language)}));
    for(const[id,f]of Object.entries(frontiers))if(s.world.location===f.base||s.world.visits[f.base]>0)nodes.push({id,kind:'frontier',name:language==='en'?f.en:f.name,x:f.x,y:f.y,visited:s.world.map.explored.includes(id),locked:!f.ready(s),reason:f.ready(s)?'':language==='en'?f.reasonEn:f.reason,detail:language==='en'?'A deeper route. Approach here from the nearby location.':'Путь вглубь. Подойти можно из ближайшей локации.',base:f.base});
    for(const[id,index]of s.world.map.sites.entries()){const base=index.split(':')[0],scene=encounters[base]?.find(e=>e.id===(s.world.director.pending[index]?index+':return':index));if(!scene||!known.includes(base))continue;nodes.push({id:`site:${index}`,kind:'site',base,name:sceneText(scene,'title',language,s),x:coords[base][0]+(id%3-1)*.6,y:coords[base][1]+1+Math.floor(id/3)*.55,visited:true,locked:!eligible(s,scene),reason:eligible(s,scene)?'':language==='en'?'This meeting has been resolved.':'Эта встреча уже завершена.',detail:sceneText(scene,'text',language,s)});}
    for(const lead of causalLeads(s,language))if(known.includes(lead.location))nodes.push({id:`lead:${lead.id}`,kind:'site',base:lead.location,name:lead.title,x:0,y:0,visited:true,locked:false,pending:true,detail:language==='en'?'Your previous deed has a continuation here. Return to this area to seek the encounter.':'У прежнего поступка есть продолжение. Вернись в эту область и ищи встречу.'});
    for(const[base,list]of Object.entries(encounters))if(known.includes(base))for(const scene of list)if((scene.causal||scene.school)&&(s.atlas?.notes[`lead:${scene.id}`]||s.atlas?.pins.includes(`lead:${scene.id}`))&&!nodes.some(n=>n.id===`lead:${scene.id}`))nodes.push({id:`lead:${scene.id}`,kind:'site',base,name:sceneText(scene,'title',language,s),x:0,y:0,visited:true,locked:true,detail:language==='en'?'A resolved encounter kept with your note or bookmark.':'Завершённая встреча, сохранённая вместе с заметкой или отметкой.'});
    for(const node of nodes)if(node.kind==='site')node.pending||=!!s.world.director.pending[node.id.slice(5)];
    for(const node of nodes)if(node.kind==='location')node.pending=nodes.filter(n=>n.base===node.id&&n.pending).length;
    const ordinary=nodes.filter(n=>n.kind!=='site');
    const frontierCoords={'dark-forest':[3,1],'sealed-crypt':[0,0],'upper-pass':[3,0]};
    for(const node of ordinary){if(frontierCoords[node.id])[node.x,node.y]=frontierCoords[node.id];node.x=40+node.x*245;node.y=40+node.y*245;}
    const bottom=Math.max(70,...ordinary.map(n=>n.y))+240;
    for(const[index,node]of nodes.filter(n=>n.kind==='site').entries()){node.x=40+index%4*245;node.y=bottom+Math.floor(index/4)*245;}
    return {nodes,edges:[...known.filter(id=>id!=='village').map(id=>({from:locations[id].parent||'village',to:id})),...nodes.filter(n=>n.base).map(n=>({from:n.base,to:n.id}))],fogCount:Math.max(1,8-known.length),width:Math.max(540,...nodes.map(n=>n.x+250)),height:Math.max(400,...nodes.map(n=>n.y+240))};
  }
  const canEncounter=s=>!s.world.journey&&!s.world.encounter&&s.world.encounterCooldown<=0;
  function offer(s,E){const w=s.world,k=w.location;let pool=encounters[k].map((scene,index)=>({scene,index})).filter(({scene})=>eligible(s,scene));
    for(const{scene}of pool)if(opportunity(s,scene))w.director.misses[scene.id]=Math.min(1000000,(w.director.misses[scene.id]||0)+1);
    const varied=pool.filter(({scene})=>!w.recent.includes(scene.id));if(varied.length)pool=varied;if(!pool.length)return;
    const urgent=pool.filter(({scene})=>opportunity(s,scene)&&(w.director.misses[scene.id]||0)>=(s.stage===0&&!scene.generated?2:6));if(urgent.length){const oldest=Math.max(...urgent.map(e=>w.director.misses[e.scene.id]));pool=urgent.filter(e=>w.director.misses[e.scene.id]===oldest);}
    if(s.stage===0&&k==='village'&&w.visits.village===0){const first=pool.find(e=>e.scene.id==='village:0');if(first)pool=[first];}
    const needsHerbs=s.resources.herbs<(E?.breakthroughCost(s).herbs||10);
    const generatedCount=pool.filter(e=>e.scene.generated&&!e.scene.payoff).length;
    const authoredCount=pool.length-generatedCount;
    const weighted=pool.map(e=>({...e,weight:(e.scene.generated&&!e.scene.payoff?Math.max(1,authoredCount)/Math.max(1,generatedCount):1)*(e.scene.choices.some(c=>c.danger)?(s.realm>=2?1.2:.6):1)*(needsHerbs&&e.scene.choices.some(c=>(c.reward?.herbs||0)>(c.cost?.herbs||0))?1.6:1)*(opportunity(s,e.scene)?1+(w.director.misses[e.scene.id]||0)*.15:1)}));let roll=random(w)*weighted.reduce((n,e)=>n+e.weight,0);let picked=weighted[weighted.length-1];for(const e of weighted){roll-=e.weight;if(roll<0){picked=e;break;}}
    if(!picked.scene.remote)M?.recordMeeting(s,picked.scene);w.director.misses[picked.scene.id]=0;w.encounter={location:k,index:picked.index,id:picked.scene.id};w.visits[k]++;w.recent=[...w.recent,picked.scene.id].slice(-2);
    if(picked.scene.generated&&!picked.scene.payoff&&!w.map.sites.includes(picked.scene.id))w.map.sites.push(picked.scene.id);
  }
  function die(s,E){
    for(const k of physical)s.resources[k]*=.5;
    s.world.deaths++;s.world.location='village';s.world.journey=null;s.world.encounter=null;
    E.log(s,'Ты погиб. Отпечаток узла возвращения, связанный с тобой с момента попадания, вернул тебя к деревенскому колодцу. Половина переносимых ресурсов потеряна; тело, техники, понимание, связи и путь главы сохранены.');
  }
  function action(s,type,value,E){
    const w=s.world;
    if(type==='forest-search'){
      if(w.location!=='forest'||!E.atlas.canSurvey(s)||!['trail','deep'].includes(value))return false;
      const key=value==='deep'?(w.seed%2?'deep':'deep-old'):'trail';
      w.seed=(Math.imul(w.seed,1664525)+1013904223)>>>0;
      s.stamina-=15;s.atlas.cooldown=300;E.interruptActivity(s);
      const scene=encounters.forest.find(e=>e.id===`forest:search-${key}`);
      w.encounter={location:'forest',index:encounters.forest.indexOf(scene),id:scene.id};
    }
    else if(type==='apply-sect'){if(!canApply(s,value))return false;w.admission=value;E.log(s,`${admissions[value].name}: ${admissions[value].text} Поручительство принято. Для вступления заверши подготовку и оплати общий запас снаряжения, указанный в следующей главе.`);}
    else if(type==='map-inspect'){
      const f=frontiers[value],id=value.startsWith('site:')?value.slice(5):value.startsWith('lead:')?value.slice(5):null,base=f?.base||id?.split(':')[0];
      if(w.journey||w.encounter)return false;
      if(!base||!map(s).nodes.some(n=>n.id===value))return false;
      if(w.location!==base){E.log(s,`Сначала вернись: ${locations[base].name}.`);return true;}
      if(f&&!f.ready(s)){E.log(s,f.reason);return true;}
      if(w.encounterCooldown>0){E.log(s,'Нужно дождаться новой встречи: сейчас местные люди заняты.');return true;}
      const scene=encounters[base].find(e=>e.id===(f?.scene||(w.director.pending[id]?id+':return':id)));if(!scene||!eligible(s,scene))return false;
      if(f&&!w.map.explored.includes(value))w.map.explored.push(value);
      if(!scene.remote)M?.recordMeeting(s,scene);w.encounter={location:base,index:encounters[base].indexOf(scene),id:scene.id};E.log(s,`Ты осмотрел местность: ${f?.name||scene.title}.`);
    }
    else if(type==='travel'){if(!canTravel(s,value))return false;w.encounter=null;w.journey={destination:value,remaining:travelTime(s,value)};E.log(s,`Ты отправился: ${locations[value].name}.`);}
    else if(type==='encounter'){if(!canEncounter(s))return false;offer(s,E);}
    else if(type==='choice'){
      const c=current(s)?.choices.find(c=>c.id===value);if(!canChoice(s,c,E))return false;
      for(const [k,v]of Object.entries(c.cost||{}))s.resources[k]-=v;
      const scene=current(s),openingLesson=s.stage===0&&!scene.generated&&(scene.once||c.mentor&&!w.mentors.includes(c.mentor)||c.contact&&!w.contacts.includes(c.contact)||c.admission&&!w.admissionRoutes.includes(c.admission)||scene.id==='village:0');w.encounterCooldown=openingLesson?90:300;
      if(c.danger&&E.power(s)<c.danger){M?.recordChoice(s,scene,c,'failure');die(s,E);return true;}
      if(c.stamina)s.stamina-=c.stamina;
      if(c.route)w.director.pending[scene.id]={stage:s.stage,route:c.route};
      if(c.recognition){const deed=w.director.pending[c.recognition];const paths=w.director.paths[deed.stage]??={};paths[deed.route]=Math.min(1000000,(paths[deed.route]||0)+1);delete w.director.pending[c.recognition];}
      const decision=`${scene.id}/${c.id}`;w.director.decisions[decision]=Math.min(1000000000,(w.director.decisions[decision]||0)+1);
      if(uniqueIds.includes(scene.id)&&(c.admission||scene.once)&&!c.skip&&!w.completed.includes(scene.id))w.completed.push(scene.id);
      for(const [k,v]of Object.entries(c.reward||{}))s.resources[k]+=v;
      M?.recordChoice(s,scene,c,c.skip?'declined':'success');E.taskPractice(s,E.choicePractice(c));
      if(c.practice)E.techniquePractice(s,c.practice.technique,c.practice.amount);
      s.mastery=Math.min(10*(s.realm+1),s.mastery+(c.mastery||0));s.calm=Math.min(100,s.calm+(c.calm||0));
      if(c.restore)s.stamina=E.staminaMax(s);
      if(c.mentor&&!w.mentors.includes(c.mentor))w.mentors.push(c.mentor);
      if(c.contact&&!w.contacts.includes(c.contact))w.contacts.push(c.contact);
      if(c.admission&&!w.admissionRoutes.includes(c.admission)){w.admissionRoutes.push(c.admission);E.log(s,`Открыт путь: ${admissions[c.admission].name}. Обратись в представительство в городе, когда станешь начинающим практиком. Поручительство и сюжетные предметы сохраняются после смерти.`);}
      s.explored+=c.explore||0;
      if(!s.found&&s.explored>=600&&w.location==='ruins'){s.found=true;E.log(s,'Находка в храме раскрыла технику Пустого Неба.');}
      E.log(s,scene.generated?`Местное поручение: ${c.label}.`:`${scene.title}: ${c.label}.`);w.encounter=null;
    }else return false;
    return true;
  }
  function advance(s,dt,E){const w=s.world;w.encounterCooldown=Math.max(0,w.encounterCooldown-dt);if(w.journey){w.journey.remaining-=dt;if(w.journey.remaining<=0){w.location=w.journey.destination;w.journey=null;E.log(s,`Ты прибыл: ${locations[w.location].name}.`);if(!w.encounter&&(w.encounterCooldown<=0||locations[w.location].unlock&&w.visits[w.location]===0))offer(s,E);}}}
  function bonus(s){const w=s.world,at=w.journey?'':w.location;return{body:(at==='village'?1.1:1)*(w.mentors.includes('trainer')?1.15:1),herbs:(at==='forest'?1.5:1)*(w.mentors.includes('herbalist')?1.2:1),gold:at==='city'?1.5:1,relics:at==='ruins'?1.5:1,xp:(at==='mountains'?1.2:1)*(w.mentors.includes('breathing')?1.1:1)*(w.mentors.includes('scholar')?1.15:1),mastery:w.mentors.includes('swordsman')?1.15:1};}
  function validate(input,stage){
    if(input===undefined)return fresh();if(!input||typeof input!=='object')throw Error('Неверный мир');const w=fresh();
    if(!locations[input.location]||locations[input.location].stage>stage)throw Error('Неверное место');w.location=input.location;
    const seed=input.seed??2166136261;if(!Number.isSafeInteger(seed)||seed<1||seed>4294967295)throw Error('Неверная случайность');w.seed=seed;
    const ids=new Set(Object.values(encounters).flat().map(e=>e.id));
    if(input.map!==undefined){const m=input.map;if(!m||!Array.isArray(m.explored)||!Array.isArray(m.sites)||m.explored.some(id=>!frontiers[id])||m.sites.some(id=>!Object.values(encounters).flat().some(e=>e.id===id&&e.generated&&!e.payoff))||new Set(m.explored).size!==m.explored.length||new Set(m.sites).size!==m.sites.length)throw Error('Неверная карта');w.map={explored:[...m.explored],sites:[...m.sites]};}
    if(input.director!==undefined){const d=input.director;if(!d||typeof d!=='object')throw Error('Неверная история встреч');
      for(const key of ['paths','pending'])if(d[key]!==undefined&&(!d[key]||typeof d[key]!=='object'||Array.isArray(d[key])))throw Error('Неверное поручение');
      const decisions=new Set(Object.values(encounters).flat().flatMap(e=>e.choices.map(c=>`${e.id}/${c.id}`)));
      for(const[key,allowed,max]of [['misses',ids,1000000],['decisions',decisions,1000000000]]){const values=d[key];if(!values||typeof values!=='object'||Array.isArray(values))throw Error('Неверная история встреч');for(const[id,n]of Object.entries(values)){if(!allowed.has(id)||!Number.isSafeInteger(n)||n<0||n>max)throw Error('Неверная история встреч');w.director[key][id]=n;}}
      for(const[chapter,paths]of Object.entries(d.paths||{})){if(!/^[0-7]$/.test(chapter)||+chapter>stage||!paths||typeof paths!=='object'||Array.isArray(paths))throw Error('Неверное признание');w.director.paths[chapter]={};for(const[route,n]of Object.entries(paths)){if(!['help','study','trade','combat'].includes(route)||!Number.isSafeInteger(n)||n<0||n>1000000)throw Error('Неверное признание');w.director.paths[chapter][route]=n;}}
      for(const[id,deed]of Object.entries(d.pending||{})){const scene=Object.values(encounters).flat().find(e=>e.id===id&&e.generated&&!e.payoff);if(!scene||!deed||!Number.isInteger(deed.stage)||deed.stage<0||deed.stage>stage||!scene.choices.some(c=>c.route===deed.route&&d.decisions[`${id}/${c.id}`]))throw Error('Неверное поручение');w.director.pending[id]={stage:deed.stage,route:deed.route};}
    }
    for(const key of ['recent','completed']){const list=input[key]??[];if(!Array.isArray(list)||list.length>(key==='recent'?2:uniqueIds.length)||list.some(id=>key==='completed'?!uniqueIds.includes(id):!ids.has(id))||new Set(list).size!==list.length)throw Error('Неверная история встреч');w[key]=[...list];}
    const routes=input.admissionRoutes===undefined?[]:input.admissionRoutes;
    if(!Array.isArray(routes)||routes.some(k=>!admissions[k]||k==='gates')||new Set(routes).size!==routes.length)throw Error('Неверное поручительство');w.admissionRoutes=[...routes];
    const admission=input.admission===undefined?null:input.admission;
    if(admission!==null&&(!admissions[admission]||(admission!=='gates'&&!routes.includes(admission))))throw Error('Неверный допуск');w.admission=admission;
    w.admissionGiftAwarded=Boolean(input.admissionGiftAwarded);
    for(const k of ['deaths','encounterCooldown']){if(!Number.isFinite(input[k])||input[k]<0||(k==='deaths'?!Number.isSafeInteger(input[k]):input[k]>300))throw Error('Неверное путешествие');w[k]=input[k];}
    for(const k of Object.keys(locations)){const n=input.visits?.[k]??(Q.locations[k]?0:undefined);if(!Number.isSafeInteger(n)||n<0)throw Error('Неверные посещения');w.visits[k]=n;}
    if(!Array.isArray(input.mentors)||input.mentors.some(k=>!Object.hasOwn(mentorNames,k))||new Set(input.mentors).size!==input.mentors.length)throw Error('Неверный наставник');w.mentors=[...input.mentors];
    if(!Array.isArray(input.contacts)||input.contacts.some(k=>k!=='scholar')||input.contacts.length>1)throw Error('Неверные связи');w.contacts=[...input.contacts];
    if(input.journey!==null){const j=input.journey;if(!j||!locations[j.destination]||locations[j.destination].stage>stage||!Number.isFinite(j.remaining)||j.remaining<=0||j.remaining>locations[j.destination].time)throw Error('Неверный маршрут');w.journey={destination:j.destination,remaining:j.remaining};}
    if(input.encounter!==null){const e=input.encounter;if(!e||e.location!==w.location||!Number.isInteger(e.index)||w.journey)throw Error('Неверная встреча');const index=e.id===undefined?e.index:encounters[e.location]?.findIndex(scene=>scene.id===e.id);if(index===undefined||index<0||!encounters[e.location]?.[index])throw Error('Неверная встреча');w.encounter={location:e.location,index,...(e.id===undefined?{}:{id:e.id})};}
    w.people=M?.validate(input.people,{stage,world:w})||{};return w;
  }
  const causalLeads=(s,language='ru')=>Object.entries(encounters).flatMap(([location,list])=>list.filter(scene=>(scene.causal||scene.school)&&eligible(s,scene)).map(scene=>({id:scene.id,location,title:sceneText(scene,'title',language,s)})));
  const api={questPlaces:Q,travelTime,causalLeads,memory:M,eligible,admissions,canApply,locations,encounters,mentorNames,physical,fresh,current,knownLocations,travelReason,map,frontiers,canTravel,canEncounter,canChoice,sceneText,pathNames,developmentPaths,pendingQuests,recognition,recognitionNeeded,action,advance,bonus,validate};root.IsekaiWorld=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
