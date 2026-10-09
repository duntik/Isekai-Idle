(function(root){
  'use strict';
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
      {id:'village:2',title:'Письмо из города',text:'Мальчик-посыльный перепутал адрес. Письмо предназначалось библиотекарю Вэю. Мэй предлагает доставить его или обменять старые травы у проезжего аптекаря.',choices:[choice('letter','Запомнить имя библиотекаря','Добавить контакт',{contact:'scholar',reward:{gold:5}}),choice('trade','Обменять 5 трав на 15 монет','Обменять сырьё',{cost:{herbs:5},reward:{gold:15}})]}
    ],
    forest:[
      {id:'forest:0',title:'Травница на тропе',text:'Линь собирает листья серебряной полыни. «Не рви корни — завтра здесь снова будет что собрать». Она готова показать хорошие места, если ты поможешь донести корзину.',choices:[choice('learn','Помочь Линь и научиться сбору','Улучшить сбор',{mentor:'herbalist',reward:{herbs:6}}),choice('gather','Собрать обычные травы','Получить сырьё',{reward:{herbs:10}})]},
      {id:'forest:1',title:'Зверь у ручья',text:'В воде блестит редкий корень. Но между тобой и ручьём стоит клыкастый зверь. Линь предупреждала: эта тропа не для неопытных. Можно уйти с обычными травами.',choices:[choice('fight','Сразиться за редкий корень','Пройти проверку A',{danger:45,reward:{herbs:25,relics:1}}),choice('leave','Отступить и собрать травы по дороге','Выбрать безопасный сбор',{reward:{herbs:4}})]},
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
    {id:'village:3',title:'Плотник Дао',text:'Дао чинит дверь постоялого двора. Он просит придержать доски и обещает заплатить. Можно вместо работы расспросить его о заброшенном храме.',choices:[choice('carpenter-help','Помочь с дверью','Выполнить заявку',{reward:{gold:9}}),choice('carpenter-map','Расспросить о храме','Получить сведения',{explore:15})]},
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
  const chose=(s,id)=>!!s.world.director.decisions[id];
  encounters.village.push({id:'village:road-return',once:true,title:'Весть с городской дороги',text:'Мэй слышала, что ты не дал ученику Белого Клыка втянуть тебя в драку. «Иногда сохранить силы важнее, чем ответить». Возчики предлагают небольшую доставку, а Мэй — запас трав для дальнейшего пути.',requires:s=>chose(s,'city:1/avoid'),choices:[choice('road-work','Помочь возчикам с доставкой','Выполнить доставку',{reward:{gold:12}}),choice('road-herbs','Принять травы от Мэй','Получить помощь',{reward:{herbs:8}})]});
  encounters.forest.push({id:'forest:sen-followup',once:true,title:'Сэнь держит слово',text:'Сэнь уже может идти сам. Он узнаёт того, кто поделился травами: «Долг не забывают. Вот припасы для твоих первых прорывов». Можно попросить лекарства или спокойный урок дыхания. Это продолжение вашей встречи, а не новое спасение.',requires:s=>chose(s,'forest:2/heal')||s.world.admissionRoutes.includes('rescue'),choices:[choice('sen-herbs','Принять лекарственные травы','Получить помощь',{reward:{herbs:12}}),choice('sen-breath','Повторить дыхательный приём','Повторить методику',{reward:{qi:12},calm:3})]});
  encounters.city.push({id:'city:lin-delivery',once:true,title:'Записка Линь для Хо',text:'Хо получил записку Линь: ты передал травы для деревенской лечебницы. Он готов поделиться лекарством или оплатить помощь. Связь между людьми оказывается полезнее случайной удачи.',requires:s=>chose(s,'forest:4/herbalist-order'),choices:[choice('clinic-pill','Принять пилюлю Хо','Получить лекарство',{reward:{pills:1}}),choice('clinic-pay','Получить плату за помощь лечебнице','Получить оплату',{reward:{gold:18}})]});
  encounters.ruins.push({id:'ruins:archive-clue',once:true,title:'Сверить храмовые знаки',text:'Знакомство с архивом Вэя помогло распознать знак: храм был частью сети духовных источников. Это объясняет тепло осколка, но не делает тебя сильнее мгновенно. Можно сохранить образец или спокойно изучить надпись.',requires:s=>s.found&&s.world.mentors.includes('scholar'),choices:[choice('archive-shard','Сохранить образец печати','Сохранить образец',{reward:{relics:2}}),choice('archive-study','Разобрать надпись','Изучить образец',{reward:{qi:15},calm:3})]});
  for(const[k,list]of Object.entries(encounters))for(const[e,scene]of list.entries())scene.id??=`${k}:${e}`;
  const uniqueIds=['forest:2','ruins:3','ruins:4',...Object.values(encounters).flat().filter(e=>e.once).map(e=>e.id)];
  const opportunity=(s,scene)=>scene.choices.some(c=>(c.mentor&&!s.world.mentors.includes(c.mentor))||(c.admission&&!s.world.admissionRoutes.includes(c.admission)))||scene.once;
  const eligible=(s,scene)=>!s.world.completed.includes(scene.id)&&(!scene.requires||scene.requires(s));
  function random(w){let x=w.seed;x^=x<<13;x^=x>>>17;x^=x<<5;w.seed=x>>>0;return w.seed/4294967296;}
  const physical=['gold','herbs','qi','relics','wood','ore','pills','supplies','cosmic'];
  const fresh=()=>({location:'village',journey:null,encounter:null,visits:Object.fromEntries(Object.keys(locations).map(k=>[k,0])),mentors:[],contacts:[],admissionRoutes:[],admission:null,director:{misses:{},decisions:{}},seed:Math.floor(Math.random()*4294967295)+1,recent:[],completed:[],deaths:0,encounterCooldown:0});
  const current=s=>{const e=s.world.encounter;return e?(e.id?encounters[e.location].find(scene=>scene.id===e.id):encounters[e.location][e.index]):null;};
  const canTravel=(s,k)=>!!locations[k]&&locations[k].stage<=s.stage&&!s.world.journey&&s.world.location!==k;
  const canEncounter=s=>!s.world.journey&&!s.world.encounter&&s.world.encounterCooldown<=0;
  function offer(s,E){const w=s.world,k=w.location;let pool=encounters[k].map((scene,index)=>({scene,index})).filter(({scene})=>eligible(s,scene));
    for(const{scene}of pool)if(opportunity(s,scene))w.director.misses[scene.id]=Math.min(1000000,(w.director.misses[scene.id]||0)+1);
    const varied=pool.filter(({scene})=>!w.recent.includes(scene.id));if(varied.length)pool=varied;if(!pool.length)return;
    const urgent=pool.filter(({scene})=>opportunity(s,scene)&&(w.director.misses[scene.id]||0)>=6);if(urgent.length){const oldest=Math.max(...urgent.map(e=>w.director.misses[e.scene.id]));pool=urgent.filter(e=>w.director.misses[e.scene.id]===oldest);}
    const needsHerbs=s.resources.herbs<(E?.breakthroughCost(s).herbs||10);
    const weighted=pool.map(e=>({...e,weight:(e.scene.choices.some(c=>c.danger)?(s.realm>=2?1.2:.6):1)*(needsHerbs&&e.scene.choices.some(c=>(c.reward?.herbs||0)>(c.cost?.herbs||0))?1.6:1)*(opportunity(s,e.scene)?1+(w.director.misses[e.scene.id]||0)*.15:1)}));let roll=random(w)*weighted.reduce((n,e)=>n+e.weight,0);let picked=weighted[weighted.length-1];for(const e of weighted){roll-=e.weight;if(roll<0){picked=e;break;}}
    w.director.misses[picked.scene.id]=0;w.encounter={location:k,index:picked.index,id:picked.scene.id};w.visits[k]++;w.recent=[...w.recent,picked.scene.id].slice(-2);
  }
  function die(s,E){
    for(const k of physical)s.resources[k]*=.5;
    s.world.deaths++;s.world.location='village';s.world.journey=null;s.world.encounter=null;
    E.log(s,'Ты погиб. Отпечаток узла возвращения, связанный с тобой с момента попадания, вернул тебя к деревенскому колодцу. Половина переносимых ресурсов потеряна; тело, техники, понимание, связи и путь главы сохранены.');
  }
  function action(s,type,value,E){
    const w=s.world;
    if(type==='apply-sect'){if(!canApply(s,value))return false;w.admission=value;E.log(s,`${admissions[value].name}: ${admissions[value].text} Поручительство принято. Для вступления заверши подготовку и оплати общий запас снаряжения, указанный в следующей главе.`);}
    else if(type==='travel'){if(!canTravel(s,value))return false;w.encounter=null;w.journey={destination:value,remaining:locations[value].time};E.log(s,`Ты отправился: ${locations[value].name}.`);}
    else if(type==='encounter'){if(!canEncounter(s))return false;offer(s,E);}
    else if(type==='choice'){
      const c=current(s)?.choices.find(c=>c.id===value);if(!c||w.journey||!E.affordable(s,c.cost||{}))return false;
      for(const [k,v]of Object.entries(c.cost||{}))s.resources[k]-=v;
      const scene=current(s);w.encounterCooldown=300;
      if(c.danger&&E.power(s)<c.danger){die(s,E);return true;}
      const decision=`${scene.id}/${c.id}`;w.director.decisions[decision]=Math.min(1000000000,(w.director.decisions[decision]||0)+1);
      if(uniqueIds.includes(scene.id)&&(c.admission||scene.once)&&!w.completed.includes(scene.id))w.completed.push(scene.id);
      for(const [k,v]of Object.entries(c.reward||{}))s.resources[k]+=v;
      s.mastery=Math.min(10*(s.realm+1),s.mastery+(c.mastery||0));s.calm=Math.min(100,s.calm+(c.calm||0));
      if(c.restore)s.stamina=100;
      if(c.mentor&&!w.mentors.includes(c.mentor))w.mentors.push(c.mentor);
      if(c.contact&&!w.contacts.includes(c.contact))w.contacts.push(c.contact);
      if(c.admission&&!w.admissionRoutes.includes(c.admission)){w.admissionRoutes.push(c.admission);E.log(s,`Открыт путь: ${admissions[c.admission].name}. Обратись в представительство в городе, когда станешь начинающим практиком. Поручительство и сюжетные предметы сохраняются после смерти.`);}
      s.explored+=c.explore||0;
      if(!s.found&&s.explored>=600&&w.location==='ruins'){s.found=true;E.log(s,'Находка в храме раскрыла технику Пустого Неба.');}
      E.log(s,`${scene.title}: ${c.label}.`);w.encounter=null;
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
    if(input.director!==undefined){const d=input.director;if(!d||typeof d!=='object')throw Error('Неверная история встреч');
      const decisions=new Set(Object.values(encounters).flat().flatMap(e=>e.choices.map(c=>`${e.id}/${c.id}`)));
      for(const[key,allowed,max]of [['misses',ids,1000000],['decisions',decisions,1000000000]]){const values=d[key];if(!values||typeof values!=='object'||Array.isArray(values))throw Error('Неверная история встреч');for(const[id,n]of Object.entries(values)){if(!allowed.has(id)||!Number.isSafeInteger(n)||n<0||n>max)throw Error('Неверная история встреч');w.director[key][id]=n;}}
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
  const api={eligible,admissions,canApply,locations,encounters,mentorNames,physical,fresh,current,canTravel,canEncounter,action,advance,bonus,validate};root.IsekaiWorld=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
