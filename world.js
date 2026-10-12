(function(root){
  'use strict';
  const G=typeof module!=='undefined'&&module.exports?require('./event-generator.js'):root.IsekaiEventGenerator;
  const locations={
    village:{name:'Деревня у колодца',neutral:'Базовый участок',stage:0,time:30,desc:'Мэй и Жэнь, безопасная работа и помощь в тренировках.',bonus:'Тренировка тела +10%.'},
    forest:{name:'Лес Шепчущих Корней',neutral:'Участок A',stage:0,time:60,desc:'Лекарственные травы, травница Линь и звери на дальних тропах.',bonus:'При исследовании травы +50%.'},
    city:{name:'Город Серебряного Моста',neutral:'Участок B',stage:0,time:90,desc:'Торговцы, библиотекарь Вэй и ученики влиятельных кланов.',bonus:'Оплата принятых здесь заказов +25%.'},
    ruins:{name:'Заброшенный храм',neutral:'Участок C',stage:0,time:60,desc:'Осколки наследия, странник и опасные печати под алтарём.',bonus:'Осколки за исследование +50%.'},
    mountains:{name:'Перевал Облачного Меча',neutral:'Участок D',stage:1,time:120,desc:'Горная руда, одинокий мастер и стражи прохода.',bonus:'Понимание от медитации +20%.'}
  };
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
    gates:{name:'Облачный Предел · общий набор',neutral:'Допуск D',gift:{reputation:10},text:'Ты самостоятельно пришёл в городское представительство. Без поручителя придётся пройти общий отбор и начинать с внешних учеников. Успешное испытание даст 10 репутации при вступлении.'}
  };
  encounters.forest[2].text='У дерева лежит раненый Сэнь, наставник Нефритовой Рощи. Если поделиться травами, он покажет дыхательный приём и предложит стать его учеником после подготовки к вступлению.';
  encounters.forest[2].choices[0].admission='rescue';
  encounters.ruins.push(
    {id:'ruins:3',title:'Последний путь ученика',text:'Под обвалом лежит погибший ученик Облачного Предела. На жетоне имя: Цзинь. Можно бережно завернуть останки и вернуть их школе через представительство в городе. Это поступок благодарности, а не добыча.',choices:[choice('return-remains','Забрать останки для возвращения в секту','Оформить передачу',{admission:'remains'}),choice('respect','Почтить память и уйти','Завершить осмотр',{calm:1})]},
    {id:'ruins:4',title:'Карта приглашения',text:'В тайнике сохранилась карта с печатью Пустого Неба. На обороте указан адрес городского представительства. Карта позволяет подать заявку, но испытание силы всё равно придётся пройти.',choices:[choice('invitation','Сохранить карту приглашения','Сохранить допуск',{admission:'invitation'}),choice('leave-card','Оставить карту в тайнике','Пропустить документ',{calm:1})]}
  );
  const canApply=(s,k)=>s.stage===1&&!s.world.journey&&s.world.location==='city'&&!!admissions[k]&&(k==='gates'||s.world.admissionRoutes.includes(k));
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
  for(const[k,list]of Object.entries(G.build()))encounters[k].push(...list);
  for(const[k,list]of Object.entries(encounters))for(const[e,scene]of list.entries())scene.id??=`${k}:${e}`;
  const uniqueIds=['forest:2','ruins:3','ruins:4',...Object.values(encounters).flat().filter(e=>e.once).map(e=>e.id)];
  const opportunity=(s,scene)=>scene.choices.some(c=>(c.mentor&&!s.world.mentors.includes(c.mentor))||(c.admission&&!s.world.admissionRoutes.includes(c.admission)))||(scene.once&&!scene.generated)||scene.payoff;
  const eligible=(s,scene)=>!s.world.completed.includes(scene.id)&&(!scene.requires||scene.requires(s));
  function random(w){let x=w.seed;x^=x<<13;x^=x>>>17;x^=x<<5;w.seed=x>>>0;return w.seed/4294967296;}
  const physical=['gold','herbs','qi','relics','wood','ore','pills','supplies','cosmic'];
  const fresh=()=>({location:'village',journey:null,encounter:null,map:{explored:[],sites:[]},visits:Object.fromEntries(Object.keys(locations).map(k=>[k,0])),mentors:[],contacts:[],admissionRoutes:[],admission:null,director:{misses:{},decisions:{},paths:{},pending:{}},seed:Math.floor(Math.random()*4294967295)+1,recent:[],completed:[],deaths:0,encounterCooldown:0});
  const sceneText=(item,field,language='ru',state)=>{const value=language==='en'&&item.en?.[field]?item.en[field]:item[field]||'';return typeof value==='function'?value(state):value;};
  const recognition=(s,chapter=s.stage)=>Object.values(s.world.director.paths[chapter]||{}).reduce((sum,n)=>sum+n,0);
  const recognitionNeeded=s=>12+Math.max(0,s.stage-1)*8;
  const pathNames={help:'Помощь людям',study:'Знания и техники',trade:'Снабжение',combat:'Защита от вымогателей'};
  const pendingQuests=s=>Object.entries(s.world.director.pending).map(([id,deed])=>{const location=id.split(':')[0];return {scene:encounters[location].find(e=>e.id===id),location,...deed};});
  const canChoice=(s,c,E)=>!!c&&!s.world.journey&&(!current(s)?.generated||c.skip||eligible(s,current(s)))&&(!c.requires||c.requires(s))&&E.affordable(s,c.cost||{})&&(!c.recognition||!!s.world.director.pending[c.recognition]);
  const current=s=>{const e=s.world.encounter;return e?(e.id?encounters[e.location].find(scene=>scene.id===e.id):encounters[e.location][e.index]):null;};
  const frontiers={
    'dark-forest':{base:'forest',name:'Тёмная чаща',en:'Dark thicket',x:5,y:1,scene:'forest:1',ready:s=>s.body>=8&&s.calm>=5||s.realm>=1,reason:'Из темноты смотрят звериные глаза. Ноги не слушаются: ты отступаешь к светлой опушке. Укрепи тело до 8 и накопи 5 спокойствия или достигни первого духовного уровня.',reasonEn:'Animal eyes watch from the darkness. Your legs refuse to move: you retreat to the bright forest edge. Train your body to 8 and gain 5 calm, or reach spiritual realm 1.'},
    'sealed-crypt':{base:'ruins',name:'Запечатанный склеп',en:'Sealed crypt',x:1,y:0,scene:'ruins:1',ready:s=>s.found&&s.realm>=1,reason:'Печать давит на грудь. Пока ты не нашёл наследие и не достиг первого духовного уровня, тело не выдержит даже подхода к двери.',reasonEn:'The seal presses against your chest. Discover the legacy and reach spiritual realm 1 before approaching this door.'},
    'upper-pass':{base:'mountains',name:'Верхняя тропа перевала',en:'Upper pass trail',x:6,y:0,scene:'mountains:1',ready:s=>s.realm>=3,reason:'Страж опускает копьё: дальше идут только практики третьего духовного уровня. Нижний склон остаётся открыт.',reasonEn:'The guard lowers his spear: only practitioners of spiritual realm 3 may pass. The lower slope remains open.'}
  };
  encounters.forest[1].requires=s=>frontiers['dark-forest'].ready(s);
  encounters.ruins[1].requires=s=>frontiers['sealed-crypt'].ready(s);
  encounters.mountains[1].requires=s=>frontiers['upper-pass'].ready(s);
  function knownLocations(s){return Object.keys(locations).filter(k=>locations[k].stage<=s.stage&&(k==='village'||k==='city'&&(s.world.contacts.includes('scholar')||s.world.admissionRoutes.length)||k===s.world.location||s.world.visits[k]>0||(s.storyStep>=1||s.stage>=1)&&k!=='mountains'||s.stage>=1&&k==='mountains'));}
  function travelReason(s,k,language='ru'){
    const say=(ru,en)=>language==='en'?en:ru;
    if(!locations[k]||!knownLocations(s).includes(k))return say('Дорога ещё неизвестна.','This route is not yet known.');
    if(s.world.journey)return say('Сначала закончи текущий переход.','Finish the current journey first.');
    if(s.world.location===k)return say('Ты уже здесь.','You are already here.');
    if(k==='city'&&s.stage<1&&!s.world.contacts.includes('scholar')&&!s.world.admissionRoutes.length)return say('Страж не пускает безымянного оборванца за ворота. Получи у Мэй письмо для Вэя, поручительство наставника или приглашение секты; начинающих практиков также пропускают.','The guard refuses an unknown ragged stranger. Obtain Mei’s letter for Wei, a mentor’s recommendation or a sect invitation; novice practitioners are also admitted.');
    return '';
  }
  const canTravel=(s,k)=>!!locations[k]&&!travelReason(s,k);
  function map(s,language='ru'){
    const coords={village:[2,3],forest:[4,2],city:[0,4],ruins:[1,1],mountains:[5,0]};
    const known=knownLocations(s),nodes=known.map(id=>({id,kind:'location',name:locations[id].name,x:coords[id][0],y:coords[id][1],visited:s.world.visits[id]>0||s.world.location===id,locked:!!travelReason(s,id,language),reason:travelReason(s,id,language),detail:locations[id].desc}));
    for(const[id,f]of Object.entries(frontiers))if(s.world.location===f.base||s.world.visits[f.base]>0)nodes.push({id,kind:'frontier',name:language==='en'?f.en:f.name,x:f.x,y:f.y,visited:s.world.map.explored.includes(id),locked:!f.ready(s),reason:f.ready(s)?'':language==='en'?f.reasonEn:f.reason,detail:language==='en'?'A deeper route. Approach here from the nearby location.':'Путь вглубь. Подойти можно из ближайшей локации.',base:f.base});
    for(const[id,index]of s.world.map.sites.entries()){const base=index.split(':')[0],scene=encounters[base]?.find(e=>e.id===(s.world.director.pending[index]?index+':return':index));if(!scene||!known.includes(base))continue;nodes.push({id:`site:${index}`,kind:'site',base,name:sceneText(scene,'title',language,s),x:coords[base][0]+(id%3-1)*.6,y:coords[base][1]+1+Math.floor(id/3)*.55,visited:true,locked:!eligible(s,scene),reason:eligible(s,scene)?'':language==='en'?'This meeting has been resolved.':'Эта встреча уже завершена.',detail:sceneText(scene,'text',language,s)});}
    const ordinary=nodes.filter(n=>n.kind!=='site');for(const node of ordinary){node.x=70+node.x*260;node.y=70+node.y*200;}
    const bottom=Math.max(70,...ordinary.map(n=>n.y))+240;
    for(const[index,node]of nodes.filter(n=>n.kind==='site').entries()){node.x=70+index%5*260;node.y=bottom+Math.floor(index/5)*200;}
    return {nodes,edges:[...known.filter(id=>id!=='village').map(id=>({from:'village',to:id})),...nodes.filter(n=>n.base).map(n=>({from:n.base,to:n.id}))],fogCount:Math.max(1,8-known.length),width:Math.max(900,...nodes.map(n=>n.x+240)),height:Math.max(750,...nodes.map(n=>n.y+240))};
  }
  const canEncounter=s=>!s.world.journey&&!s.world.encounter&&s.world.encounterCooldown<=0;
  function offer(s,E){const w=s.world,k=w.location;let pool=encounters[k].map((scene,index)=>({scene,index})).filter(({scene})=>eligible(s,scene));
    for(const{scene}of pool)if(opportunity(s,scene))w.director.misses[scene.id]=Math.min(1000000,(w.director.misses[scene.id]||0)+1);
    const varied=pool.filter(({scene})=>!w.recent.includes(scene.id));if(varied.length)pool=varied;if(!pool.length)return;
    const urgent=pool.filter(({scene})=>opportunity(s,scene)&&(w.director.misses[scene.id]||0)>=6);if(urgent.length){const oldest=Math.max(...urgent.map(e=>w.director.misses[e.scene.id]));pool=urgent.filter(e=>w.director.misses[e.scene.id]===oldest);}
    const needsHerbs=s.resources.herbs<(E?.breakthroughCost(s).herbs||10);
    const generatedCount=pool.filter(e=>e.scene.generated&&!e.scene.payoff).length;
    const authoredCount=pool.length-generatedCount;
    const weighted=pool.map(e=>({...e,weight:(e.scene.generated&&!e.scene.payoff?Math.max(1,authoredCount)/Math.max(1,generatedCount):1)*(e.scene.choices.some(c=>c.danger)?(s.realm>=2?1.2:.6):1)*(needsHerbs&&e.scene.choices.some(c=>(c.reward?.herbs||0)>(c.cost?.herbs||0))?1.6:1)*(opportunity(s,e.scene)?1+(w.director.misses[e.scene.id]||0)*.15:1)}));let roll=random(w)*weighted.reduce((n,e)=>n+e.weight,0);let picked=weighted[weighted.length-1];for(const e of weighted){roll-=e.weight;if(roll<0){picked=e;break;}}
    w.director.misses[picked.scene.id]=0;w.encounter={location:k,index:picked.index,id:picked.scene.id};w.visits[k]++;w.recent=[...w.recent,picked.scene.id].slice(-2);
    if(picked.scene.generated&&!picked.scene.payoff&&!w.map.sites.includes(picked.scene.id))w.map.sites.push(picked.scene.id);
  }
  function die(s,E){
    for(const k of physical)s.resources[k]*=.5;
    s.world.deaths++;s.world.location='village';s.world.journey=null;s.world.encounter=null;
    E.log(s,'Ты погиб. Отпечаток узла возвращения, связанный с тобой с момента попадания, вернул тебя к деревенскому колодцу. Половина переносимых ресурсов потеряна; тело, техники, понимание, связи и путь главы сохранены.');
  }
  function action(s,type,value,E){
    const w=s.world;
    if(type==='apply-sect'){if(!canApply(s,value))return false;w.admission=value;E.log(s,`${admissions[value].name}: ${admissions[value].text} Поручительство принято. Для вступления заверши подготовку и оплати общий запас снаряжения, указанный в следующей главе.`);}
    else if(type==='map-inspect'){
      const f=frontiers[value],id=value.startsWith('site:')?value.slice(5):null,base=f?.base||id?.split(':')[0];
      if(w.journey||w.encounter)return false;
      if(!base||!map(s).nodes.some(n=>n.id===value))return false;
      if(w.location!==base){E.log(s,`Сначала вернись: ${locations[base].name}.`);return true;}
      if(f&&!f.ready(s)){E.log(s,f.reason);return true;}
      if(w.encounterCooldown>0){E.log(s,'Нужно дождаться новой встречи: сейчас местные люди заняты.');return true;}
      const scene=encounters[base].find(e=>e.id===(f?.scene||(w.director.pending[id]?id+':return':id)));if(!scene||!eligible(s,scene))return false;
      if(f&&!w.map.explored.includes(value))w.map.explored.push(value);
      w.encounter={location:base,index:encounters[base].indexOf(scene),id:scene.id};E.log(s,`Ты осмотрел местность: ${f?.name||scene.title}.`);
    }
    else if(type==='travel'){if(!canTravel(s,value))return false;w.encounter=null;w.journey={destination:value,remaining:locations[value].time};E.log(s,`Ты отправился: ${locations[value].name}.`);}
    else if(type==='encounter'){if(!canEncounter(s))return false;offer(s,E);}
    else if(type==='choice'){
      const c=current(s)?.choices.find(c=>c.id===value);if(!canChoice(s,c,E))return false;
      for(const [k,v]of Object.entries(c.cost||{}))s.resources[k]-=v;
      const scene=current(s);w.encounterCooldown=300;
      if(c.danger&&E.power(s)<c.danger){die(s,E);return true;}
      if(c.stamina)s.stamina-=c.stamina;
      if(c.route)w.director.pending[scene.id]={stage:s.stage,route:c.route};
      if(c.recognition){const deed=w.director.pending[c.recognition];const paths=w.director.paths[deed.stage]??={};paths[deed.route]=Math.min(1000000,(paths[deed.route]||0)+1);delete w.director.pending[c.recognition];}
      const decision=`${scene.id}/${c.id}`;w.director.decisions[decision]=Math.min(1000000000,(w.director.decisions[decision]||0)+1);
      if(uniqueIds.includes(scene.id)&&(c.admission||scene.once)&&!c.skip&&!w.completed.includes(scene.id))w.completed.push(scene.id);
      for(const [k,v]of Object.entries(c.reward||{}))s.resources[k]+=v;
      E.taskPractice(s,E.choicePractice(c));
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
  function advance(s,dt,E){const w=s.world;w.encounterCooldown=Math.max(0,w.encounterCooldown-dt);if(w.journey){w.journey.remaining-=dt;if(w.journey.remaining<=0){w.location=w.journey.destination;w.journey=null;E.log(s,`Ты прибыл: ${locations[w.location].name}.`);if(!w.encounter&&w.encounterCooldown<=0)offer(s,E);}}}
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
    if(admission!==null&&(!admissions[admission]||stage===0||(admission!=='gates'&&!routes.includes(admission))))throw Error('Неверный допуск');w.admission=admission;
    for(const k of ['deaths','encounterCooldown']){if(!Number.isFinite(input[k])||input[k]<0||(k==='deaths'?!Number.isSafeInteger(input[k]):input[k]>300))throw Error('Неверное путешествие');w[k]=input[k];}
    for(const k of Object.keys(locations)){const n=input.visits?.[k];if(!Number.isSafeInteger(n)||n<0)throw Error('Неверные посещения');w.visits[k]=n;}
    if(!Array.isArray(input.mentors)||input.mentors.some(k=>!Object.hasOwn(mentorNames,k))||new Set(input.mentors).size!==input.mentors.length)throw Error('Неверный наставник');w.mentors=[...input.mentors];
    if(!Array.isArray(input.contacts)||input.contacts.some(k=>k!=='scholar')||input.contacts.length>1)throw Error('Неверные связи');w.contacts=[...input.contacts];
    if(input.journey!==null){const j=input.journey;if(!j||!locations[j.destination]||locations[j.destination].stage>stage||!Number.isFinite(j.remaining)||j.remaining<=0||j.remaining>locations[j.destination].time)throw Error('Неверный маршрут');w.journey={destination:j.destination,remaining:j.remaining};}
    if(input.encounter!==null){const e=input.encounter;if(!e||e.location!==w.location||!Number.isInteger(e.index)||w.journey)throw Error('Неверная встреча');const index=e.id===undefined?e.index:encounters[e.location]?.findIndex(scene=>scene.id===e.id);if(index===undefined||index<0||!encounters[e.location]?.[index])throw Error('Неверная встреча');w.encounter={location:e.location,index,...(e.id===undefined?{}:{id:e.id})};}
    return w;
  }
  const api={eligible,admissions,canApply,locations,encounters,mentorNames,physical,fresh,current,knownLocations,travelReason,map,frontiers,canTravel,canEncounter,canChoice,sceneText,pathNames,pendingQuests,recognition,recognitionNeeded,action,advance,bonus,validate};root.IsekaiWorld=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
