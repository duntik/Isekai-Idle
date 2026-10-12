(function (root) {
  'use strict';
  const W = typeof module !== 'undefined' && module.exports ? require('./world.js') : root.IsekaiWorld;
  const N = typeof module !== 'undefined' && module.exports ? require('./names.js') : root.IsekaiNames;
  const A = typeof module !== 'undefined' && module.exports ? require('./achievements.js') : root.IsekaiAchievements;
  const Atlas = typeof module !== 'undefined' && module.exports ? require('./atlas.js') : root.IsekaiAtlas;
  const S = typeof module !== 'undefined' && module.exports ? require('./sects.js') : root.IsekaiSects;
  const R = typeof module !== 'undefined' && module.exports ? require('./return-report.js') : root.IsekaiReturnReport;
  const stages = [
    { name: 'Безвестный чужак', subtitle: 'Выжить и найти свой путь', realm: 1, wins: 1, cost: { herbs: 10 }, intro: 'Ты очнулся у дороги. Ни денег, ни техники, ни покровителя. В руинах неподалёку что-то зовёт тебя.' },
    { name: 'Начинающий практик', subtitle: 'Техники, снаряжение и первые испытания', realm: 3, wins: 3, cost: { gold: 150, relics: 3 }, intro: 'В осколке обнаружена техника Пустого Неба. Теперь предстоит заслужить место в секте.' },
    { name: 'Ученик секты', subtitle: 'Поручения, репутация и турнир', realm: 6, wins: 6, cost: { reputation: 100, gold: 600 }, intro: 'Ты принят во внешние ученики. Доступ к библиотеке придётся заслужить. Побеждённый соперник уже ищет поддержки своего клана.' },
    { name: 'Глава слабой секты', subtitle: 'Ученики, рабочие и алхимия', realm: 10, wins: 10, cost: { influence: 300, pills: 60 }, intro: 'После конфликта с кланом тебе досталось разорённое убежище. Трое последователей решили остаться. Теперь их будущее зависит от тебя.' },
    { name: 'Правитель города', subtitle: 'Районы, торговые маршруты и снабжение', realm: 14, wins: 14, cost: { influence: 2500, supplies: 500 }, intro: 'Секта защитила долину. Поселения признали твою власть. Город требует торговли, снабжения и устойчивого управления.' },
    { name: 'Владыка планеты', subtitle: 'Мировые узлы, порталы и вторжения', realm: 18, wins: 18, cost: { cosmic: 500, influence: 10000 }, intro: 'Разрозненные земли объединены. В мировом ядре обнаружен след древней сети порталов. За пределами неба есть другие владыки.' },
    { name: 'Звёздная держава', subtitle: 'Колонии, флот и галактическая экспансия', realm: 22, wins: 22, cost: { cosmic: 10000, worlds: 12 }, intro: 'Первый межзвёздный переход совершён. Теперь сила героя должна поддерживать целую сеть миров.' },
    { name: 'Хранитель галактики', subtitle: 'Законы мироздания и наследие души', realm: 26, wins: 26, cost: { cosmic: 100000 }, intro: 'Твои миры связаны в галактический союз. Дальнейший путь лежит через понимание законов пространства и новое рождение.' }
  ];
  const names = { gold: 'Монеты', herbs: 'Травы', qi: 'Духовная энергия', relics: 'Осколки', reputation: 'Репутация', wood: 'Древесина', ore: 'Руда', pills: 'Пилюли', influence: 'Влияние', supplies: 'Припасы', cosmic: 'Звёздная эссенция', worlds: 'Миры' };
  const activities = {
    train: { name: 'Тренировать тело', stage: 0, desc: 'Распорядок Жэня: упражнения без постоянных кликов. Только в деревне или городе; занимает всё внимание и не даёт духовную энергию.' },
    rest: { name: 'Отдыхать', stage: 0, desc: 'Восстанавливает выносливость. Для медитации или освоения техники выбери занятие отдельно.', rates: {} },
    work: { name: 'Работать над заказом', stage: 0, desc: 'Выполняет принятый заказ на месте: накладные сразу, физическую работу после освоения. На время работы медитация останавливается.', rates: {} },
    explore: { name: 'Исследовать местность', stage: 0, desc: 'В лесу — травы; в храме — травы, осколки и находка после 10 минут исследования. В пути занятие приостановлено.', rates: { herbs: .025, relics: 1 / 600 } },
    meditate: { name: 'Медитировать', stage: 0, desc: 'Успокаивает разум. После находки накапливает понимание и духовную энергию.', xp: .05, calm: .02, rates: { qi: .1 } },
    technique: { name: 'Осваивать технику', stage: 0, desc: 'После изучения приёма: практика выбранной техники и рост освоения. Можно заниматься до открытия наследия. Медитация на это время останавливается.', mastery: .01 },
    mission: { name: 'Поручения секты', stage: 2, desc: 'В городе и на перевале: репутация, монеты и травы. В других местах и в пути поручение приостановлено.', rates: { reputation: .025, gold: .15, herbs: .02 } },
    govern: { name: 'Управлять владениями', stage: 3, desc: 'Лично укреплять влияние организации.', rates: { influence: .035 } },
    laws: { name: 'Постигать законы', stage: 5, desc: 'Ускоренная культивация и сбор звёздной эссенции.', xp: .08, rates: { cosmic: .012 } }
  };
  const projects = {
    dorm: { name: 'Обитель учеников', stage: 3, desc: 'Вместимость +3; пригласить последователей можно отдельно.', cost: { wood: 100, gold: 200 } },
    garden: { name: 'Духовный сад', stage: 3, desc: '+0,06 трав/сек.', cost: { wood: 60, gold: 100 } },
    market: { name: 'Торговый район', stage: 4, desc: 'Открывает дополнительный торговый маршрут.', cost: { wood: 600, ore: 300, gold: 1500 } },
    granary: { name: 'Склад снабжения', stage: 4, desc: '+0,08 припасов/сек. для караванов и флота.', cost: { wood: 300, gold: 1000 } },
    node: { name: 'Мировой узел', stage: 5, desc: '+0,015 эссенции/сек. и +20 силы планетарного щита.', cost: { ore: 1500, qi: 3000, pills: 100 } },
    fleet: { name: 'Звёздный корабль', stage: 6, desc: 'Увеличивает дальность экспансии. Флот расходует припасы во время похода.', cost: { ore: 4000, cosmic: 150, supplies: 100 } },
    observatory: { name: 'Обсерватория законов', stage: 7, desc: '+20% скорости личного развития за каждую обсерваторию.', cost: { cosmic: 3000, gold: 100000 } }
  };
  const jobs = { herb: 'Садовники', lumber: 'Лесорубы', miner: 'Рудокопы', alchemist: 'Алхимики', disciple: 'Ученики' };
  const clicks = {
    squat: { name: 'Присесть', neutral: 'Упражнение A', stamina: 3, body: .04, desc: '+0,04 тела' },
    run: { name: 'Пробежать отрезок', neutral: 'Упражнение B', stamina: 5, body: .07, desc: '+0,07 тела' },
    sweep: { name: 'Подмести двор', neutral: 'Малая операция', stamina: 2, desc: '+1 шаг заказа на уборку' },
    haul: { name: 'Перенести ящики', neutral: 'Обработка партии', stamina: 4, desc: '+1 шаг заказа на разгрузку' },
    scout: { name: 'Осмотреть развалины', neutral: 'Проверить данные', stamina: 4, explore: 2, herbs: .05, desc: '+2 сек исследования и +0,05 трав' }
  };
  const orders={
    sweep:{name:'Уборка двора Мэй',neutral:'Заказ A',target:10,pay:8,body:0,desc:'10 подметаний. Каждый клик останавливает фоновое занятие: уборка требует движения.'},
    haul:{name:'Разгрузка телеги',neutral:'Заказ B',target:8,pay:12,body:1,desc:'8 переносов ящика. Нужен показатель тела 1; выполняется кликами.'},
    ledger:{name:'Сверить накладные',neutral:'Заказ C',target:180,pay:20,body:0,desc:'3 минуты фоновой работы. Пока работаешь, медитация не идёт.'}
  };
  const orderPay=(s,k)=>Math.floor(orders[k].pay*(1+Math.min(10,Math.floor(s.employment.completed/5))*.1)*(s.world.location==='city'&&!s.world.journey?1.25:1));
  const orderAvailable=(s,k)=>{
    if(!Object.hasOwn(orders,k)||s.world.journey)return false;
    const place=s.world.location,d=s.world.director.decisions;
    if(place==='village')return k==='sweep'?s.storyStep>=1:!!(d['village:1/work']||d['village:0/help']);
    if(place==='city')return k==='ledger'?!!(d['city:0/study']||d['city:wei-letter/deliver-letter']):!!(d['city:0/job']||d['city:3/courier-help']);
    return false;
  };
  const canWorkOrder=s=>!!s.employment.order&&!s.world.journey&&s.world.location===(s.employment.order.place||'village');
  const canClaimOrder=s=>canWorkOrder(s)&&s.employment.order.progress>=orders[s.employment.order.kind].target;
  const canOrder=(s,k)=>orderAvailable(s,k)&&!s.employment.order&&s.body>=orders[k].body;
  const story = [
    { title: 'Чужое небо', text: 'Последнее, что ты помнишь, — свет фар. Теперь над тобой два бледных солнца. На дороге скрипит телега. Женщина протягивает флягу: «Живой? Тогда помоги поднять колесо. До деревни довезу». Никто не называет тебя избранным.', goal: 'Принять помощь и добраться до деревни.', ready: () => true, reward: { gold: 5, herbs: 5 }, button: 'Подняться и пойти за телегой' },
    { title: 'Работа за место у очага', text: 'Хозяйка постоялого двора Мэй даёт тебе метлу. «За красивые истории не кормят. Подметёшь двор — получишь ужин». У ворот ученики секты смеются над твоей потрёпанной одеждой. Их лёгкие шаги почему-то оставляют трещины в камне.', goal: 'Подмести двор 10 раз или накопить 15 монет любой работой.', ready: s => s.clicks.sweep >= 10 || s.resources.gold >= 15, reward: { gold: 10 }, button: 'Получить первую плату' },
    { title: 'Тело, которое не слушается', text: 'Одного ящика хватает, чтобы руки задрожали. Мэй замечает твой взгляд на учеников: «Начни с ног. Старик у колодца каждое утро приседает и бегает до мостика. Не сила небес, но лучше, чем ничего». Ты решаешь завтра не быть таким же слабым.', goal: 'Развить тело до 2 приседаниями или бегом либо изучить первый ранг любой техники.', ready: s => s.body >= 2 || Object.keys(s.cultivation.learned).length>0, reward: { herbs: 5 }, button: 'Показать, что стал крепче' },
    { title: 'Тишина между вдохами', text: 'Старик у колодца представляется: Жэнь. «В твоём мире всё спешили? Здесь сначала слушай». Он учит считать вдохи. Когда мысли затихают, из заброшенного храма за деревней доносится тонкий звон. Остальные его не слышат.', goal: 'Накопить 5 спокойствия фоновой медитацией.', ready: s => s.calm >= 5, reward: { herbs: 3 }, button: 'Рассказать Жэню о звоне' },
    { title: 'Осколок под пеплом', text: 'Жэнь показывает тропу к храму. Под обвалившимся алтарём лежит чёрный осколок. Он теплеет в твоей ладони, и в сознании проступают слова: «Пустое Небо». Это лишь повреждённая первая страница. Но на ней есть путь, которого вчера у тебя не было.', goal: 'Найти технику: 10 минут исследования, ускоряемого осмотром развалин.', ready: s => s.found, reward: { relics: 1 }, button: 'Прочитать первую страницу' },
    { title: 'Первый прорыв', text: 'Травы горчат. Каждый вдох заставляет осколок отвечать слабым теплом. Ты снова и снова теряешь ощущение потока, пока однажды оно не остаётся. Жэнь впервые смотрит на тебя серьёзно: «Теперь это твоя сила. И твоя ответственность».', goal: 'Заполнить понимание, собрать травы и совершить первый прорыв.', ready: s => s.realm >= 1, reward: { herbs: 10 }, button: 'Принять наставление' },
    { title: 'За право идти дальше', text: 'На дороге человек с повязкой Белого Клыка отбирает плату у возчиков. Ты узнаёшь телегу, на которой приехал. На этот раз ты можешь вмешаться. После победы Мэй даёт адрес городского представительства сект: туда можно прийти на общий набор. Но на лесных тропах и в храме можно найти другой путь и своего наставника. Побеждённый обещает, что его старший брат тебя запомнит.', goal: 'Победить дорожного разбойника во вкладке испытаний.', ready: s => s.wins >= 1, reward: { gold: 25 }, button: 'Узнать о наборе и собраться в путь' }
  ];
  const baseFresh = () => ({ version: 2, stage: 0, realm: 0, xp: 0, body: 0, mastery: 0, style: 'balanced', weapon: 0, study: 0, found: false, explored: 0, wins: 0, activity: 'work', age: 0, cooldown: 0, souls: 0, life: 1, population: 0, stamina: 100, clickCooldown: 0, calm: 0, storyStep: 0, clicks: Object.fromEntries(Object.keys(clicks).map(k => [k, 0])), resources: Object.fromEntries(Object.keys(names).map(k => [k, 0])), buildings: Object.fromEntries(Object.keys(projects).map(k => [k, 0])), workers: Object.fromEntries(Object.keys(jobs).map(k => [k, 0])), routes: [], expedition: null, events: [], last: Date.now() });
  const techniques={
    sky:{name:'Сутра Пустого Неба',source:'Наследие из храма',desc:'Понимание от медитации +8% за ранг.',effect:'xp',available:s=>s.found},
    ink:{name:'След туши',source:'Урок библиотекаря Вэя',desc:'Понимание +8% за ранг. Позволяет читать повреждённые надписи в храме.',effect:'xp',available:s=>s.world.mentors.includes('scholar')},
    stance:{name:'Корни камня',source:'Урок Жэня в деревне',desc:'Тело от кликов +8% за ранг.',effect:'body',practiceBody:.004,available:s=>s.world.mentors.includes('trainer')},
    herb:{name:'Слух зелёных жил',source:'Помощь Линь в лесу',desc:'Травы при исследовании +8% за ранг.',effect:'herbs',available:s=>s.world.mentors.includes('herbalist')},
    breath:{name:'Дыхание тихой реки',source:'Спасение Сэня в лесу',desc:'Энергия от медитации +8% за ранг.',effect:'qi',available:s=>s.world.mentors.includes('breathing')},
    sword:{name:'Меч облачного перевала',source:'Урок Юнь в горах',desc:'Боевая сила +8% за ранг.',effect:'power',practiceBody:.003,available:s=>s.world.mentors.includes('swordsman')},
    grove:{name:'Нефритовый круг',source:'Ученичество в Нефритовой Роще',desc:'Травы при исследовании +8% и энергия медитации +4% за ранг.',effect:'herbs',secondary:'qi',available:s=>S.library(s,'rescue')},
    cloud:{name:'Возвращающийся клинок',source:'Учёба в Облачном Пределе',desc:'Боевая сила +8% и освоение техники +4% за ранг.',effect:'power',secondary:'mastery',practiceBody:.003,available:s=>S.library(s,'remains')},
    seal:{name:'Письмена беззвёздного неба',source:'Архив секты Пустого Неба',desc:'Понимание +8% и энергия медитации +4% за ранг.',effect:'xp',secondary:'qi',available:s=>S.library(s,'invitation')},
    iron:{name:'Железные сухожилия',source:'Закрытая библиотека Каменного Оплота',desc:'Рост тела +8% и боевая сила +4% за ранг. Двигательная практика.',effect:'body',secondary:'power',practiceBody:.005,available:s=>S.library(s,'gates')}
  };
  const fresh = () => ({...baseFresh(), atlas:Atlas.fresh(), achievements:A.fresh(), playerName:null, chapterOneRoute:null, chapterOneTraining:null, activity:'meditate', world:W.fresh(), cultivation:{active:null,learned:{}}, employment:{completed:0,order:null}});
  const firstRoutes={combat:'Защитить обоз силой',service:'Провести обоз при поддержке жителей',diplomacy:'Показать рекомендацию Вэя'};
  const firstRouteReady=(s,k)=>s.realm>=1&&(k==='combat'?s.wins>=1:k==='service'?W.recognition(s,0)>=3:k==='diplomacy'?s.world.completed.includes('city:wei-letter'):false);
  const firstResolution=s=>s.chapterOneRoute||Object.keys(firstRoutes).find(k=>firstRouteReady(s,k));
  function storyBeat(s,index=s.storyStep){
    const original=story[index];if(!original)return null;
    const location=index===4?'ruins':'village',beat={...original,location};
    if(index===2&&(s.chapterOneTraining==='technique'||(!s.chapterOneTraining&&s.body<2&&Object.keys(s.cultivation.learned).length))){beat.title='Сила начинается со знания';beat.text='Мэй замечает, как ты повторяешь изученный приём. Ты выбрал начать с понимания техники, а не с тяжёлых ящиков. Тело можно укреплять позже; сейчас у тебя уже есть собственный способ стать сильнее.';beat.button='Показать изученный приём';}
    if(index===3&&s.world.mentors.includes('trainer'))beat.text='Жэнь узнаёт тебя у колодца. Стойку ты уже учил у него; сегодня речь о другом. «Между движениями тоже есть работа. Считай вдохи и слушай». Когда мысли затихают, из заброшенного храма доносится тонкий звон.';
    if(index===6){
      beat.goal='Помочь обозу: победить разбойника, заслужить 3 признания местными поручениями или доставить письмо Вэю и получить рекомендацию.';
      beat.text='Возчики у деревенской дороги жалуются на человека с повязкой Белого Клыка: он требует плату за проход. После первого прорыва ты можешь защитить обоз силой. Другие пути — заручиться помощью жителей, которым ты помог, или предъявить рекомендацию библиотекаря Вэя. Выбирай, как заслужить право идти дальше.';
      beat.button='Завершить первую арку';
      if(s.chapterOneRoute==='combat')beat.text=original.text;
      if(s.chapterOneRoute==='service'){beat.title='Дорога без потерь';beat.text='Жители помнят твою помощь. Вместе с возчиками они подготовили обходную тропу и провели обоз без драки. Мэй даёт тебе адрес представительства сект: доверие людей открыло дорогу дальше.';}
      if(s.chapterOneRoute==='diplomacy'){beat.title='Слово из городского архива';beat.text='Ты показываешь рекомендацию Вэя, полученную за доставленное письмо. Возчики обращаются к дорожному смотрителю, и вымогатель отступает перед официальным разрешением на проход. Мэй даёт адрес представительства сект. Ты решил конфликт через знакомство и выполненное обещание.';}
    }
    const ready=index===6?state=>!!firstResolution(state):original.ready;
    beat.goal+=` Место: ${W.locations[location].name}.`;
    beat.ready=state=>state.stage===0&&!state.world.journey&&state.world.location===location&&ready(state);
    return beat;
  }
  const techniqueSource=(s,k)=>k==='breath'?(s.world.admissionRoutes.includes('rescue')?'Спасение Сэня в лесу':'Дыхательный ритм храмовых письмен'):techniques[k].source;
  const orderName=(s,k,place=s.world.location)=>place==='city'?({sweep:'Уборка торгового двора',haul:'Разгрузка городского склада',ledger:orders.ledger.name})[k]:orders[k].name;
  const techniqueCost=(s,k)=>!s.found&&!s.cultivation.learned[k]&&['stance','herb','breath','ink'].includes(k)?{gold:5,herbs:2}:({qi:20*2**(s.cultivation.learned[k]?.rank||0),herbs:5*2**(s.cultivation.learned[k]?.rank||0)});
  const techniqueNeeded=rank=>120*2**rank;
  const techniqueBonus=(s,effect)=>{const k=s.cultivation.active,t=techniques[k],rank=s.cultivation.learned[k]?.rank||0;return (1+rank*(t?.effect===effect ? .08 : t?.secondary===effect ? .04 : 0))*(s.stage>=2&&S.schools[s.world.admission]?.bonus===effect?1.15:1);};
  const canLearn=(s,k)=>Object.hasOwn(techniques,k)&&(techniques[k].available(s)||!!s.cultivation.learned[k])&&affordable(s,techniqueCost(s,k))&&(!s.cultivation.learned[k]||(s.cultivation.learned[k].rank<5&&s.cultivation.learned[k].progress>=techniqueNeeded(s.cultivation.learned[k].rank)));
  const log = (s, text) => { s.events.unshift({ text, day: Math.floor(s.age / 3600) + 1 }); s.events = s.events.slice(0, 30); };
  const speed = s => [1, 1, 1, 2, 12, 100, 1000, 10000][s.stage] * (1 + s.souls * .1) * (1 + s.study * .15) * (1 + s.buildings.observatory * .2);
  const needed = s => Math.ceil(60 * 2 ** s.realm);
  const power = s => Math.floor((8 + s.body * 2 + s.mastery * 3 + s.weapon * 12) * 1.55 ** s.realm * techniqueBonus(s,'power'));
  const enemy = s => ({ name: ['Дорожный разбойник', 'Страж руин', 'Ученик Белого Клыка', 'Первый соперник', 'Внутренний ученик', 'Наследник клана', 'Старейшина соперников', 'Чемпион долины', 'Лорд приграничья', 'Владыка города', 'Хранитель континента', 'Небесный посланник', 'Владыка океанов', 'Страж мирового ядра', 'Звёздный захватчик', 'Лорд спутника', 'Пожиратель миров', 'Страж портала', 'Чемпион звёзд', 'Владыка системы', 'Адмирал пустоты', 'Галактический претендент', 'Хранитель законов', 'Древний бессмертный', 'Судья пространства', 'Страж вечности'][s.wins] || 'Эхо бесконечности', power: Math.floor(18 * 1.75 ** s.wins), type: ['swift', 'armored', 'mystic'][s.wins % 3] });
  const battlePower = s => power(s) * (({ swift: 'swift', armored: 'piercing', mystic: 'ward' })[enemy(s).type] === s.style ? 1.35 : 1);
  const affordable = (s, c) => Object.entries(c).every(([k, v]) => s.resources[k] >= v);
  const spend = (s, c) => Object.entries(c).forEach(([k, v]) => s.resources[k] -= v);
  const buildCost = (s, k) => Object.fromEntries(Object.entries(projects[k].cost).map(([r, v]) => [r, Math.ceil(v * 1.5 ** s.buildings[k])]));
  const breakthroughCost = s => ({ herbs: Math.ceil(10 * 1.45 ** s.realm), ...(s.realm >= 3 ? { relics: Math.ceil(s.realm / 2) } : {}), ...(s.realm >= 6 ? { pills: Math.ceil(s.realm * 2) } : {}) });
  const canAdvance = s => s.stage<7 && s.found && s.realm>=stages[s.stage].realm && (s.stage===0?!!firstResolution(s):(s.wins>=stages[s.stage].wins||W.recognition(s)>=W.recognitionNeeded(s))) && affordable(s,stages[s.stage].cost) && (s.stage>0||s.storyStep>=story.length) && (s.stage!==1||!!s.world.admission);
  const canFight=s=>!s.world.journey&&s.cooldown<=0&&battlePower(s)>=enemy(s).power&&(s.stage>0||(s.realm>=1&&s.storyStep===6&&s.wins===0&&s.world.location==='village'));
  function chapterIntro(s){
    const peaceful=s.stage>1&&W.recognition(s,s.stage-1)>=W.recognitionNeeded({stage:s.stage-1});
    if(peaceful&&s.stage===2)return 'Ты принят во внешние ученики. За тебя говорят выполненные поручения и люди, которым ты помог. Доступ к библиотеке и доверие старших ещё предстоит заслужить.';
    if(peaceful&&s.stage===3)return 'Твои знания и помощь объединили небольшую общину. Трое последователей доверили тебе разорённое убежище. Теперь предстоит превратить его в самостоятельную секту.';
    if(peaceful&&s.stage===4)return 'Секта наладила помощь и снабжение долины. Поселения доверили тебе управление городом. Теперь нужны торговля, запасы и устойчивое управление.';
    return stages[s.stage].intro;
  }
  const routineReady=s=>s.world.mentors.includes('trainer')&&s.body>=2&&(s.clicks.squat+s.clicks.run>=20||(s.cultivation.learned.stance?.rank||0)>=2);
  const workMastered=(s,k)=>k==='ledger'||(s.employment.completed>=3&&s.clicks[k]>=orders[k].target*2);
  const canActivity=(s,k)=>Object.hasOwn(activities,k)&&activities[k].stage<=s.stage&&(!s.world.journey||k==='rest')&&(k!=='train'||(routineReady(s)&&['village','city'].includes(s.world.location)))&&(k!=='work'||(s.employment.order&&workMastered(s,s.employment.order.kind)&&canWorkOrder(s)&&!canClaimOrder(s)))&&(k!=='technique'||!!s.cultivation.active)&&(!['explore','mission'].includes(k)||(!s.world.journey&&(k==='explore'?['forest','ruins']:['city','mountains']).includes(s.world.location)));
  function automationHint(s,language='ru'){
    const en=language==='en',moves=s.clicks.squat+s.clicks.run;
    const training=routineReady(s)?(en?'Ren’s routine is available: select Body training. Exercises continue offline, separately from meditation.':'Распорядок Жэня доступен: выбери «Тренировать тело». Упражнения продолжаются офлайн, отдельно от медитации.'):(en?`Ren can prepare a routine after his lesson, body 2 and 20 manual exercises (${moves}/20), or Stone Roots rank 2.`:`Жэнь составит распорядок после знакомства, тела 2 и 20 ручных упражнений (${moves}/20) либо второго ранга «Корней камня».`);
    const work=en?`Familiar physical work becomes a background activity after 3 paid contracts (${s.employment.completed}/3) and two contracts’ worth of manual actions of that kind. Accept a contract, select Work on contract, then collect payment locally. No new contract is accepted automatically.`:`Знакомая физическая работа становится фоновой после 3 оплаченных заказов (${s.employment.completed}/3) и ручного выполнения двух заказов этого вида. Прими заказ, выбери «Работать над заказом», затем получи оплату на месте. Новые заказы автоматически не принимаются.`;
    return training+' '+work;
  }
  const interruptActivity=s=>{s.activity='rest';};
  const techniqueActionDefs={
    'stone-load':{technique:'stance',places:['village','city'],stamina:12,cooldown:60,name:['Перенести тяжёлую связку','Carry a heavy bundle'],desc:['+0,16 тела; при разгрузке выполняет 2 переноса.','+0.16 body; completes 2 lifts during a hauling contract.']},
    'herb-listen':{technique:'herb',places:['forest'],stamina:8,cooldown:60,name:['Прислушаться к зелёным жилам','Listen to green veins'],desc:['Безопасно собрать 2 травы и успокоить разум на 0,1.','Safely gather 2 herbs and gain 0.1 calm.']},
    'river-breath':{technique:'breath',places:['village','forest','ruins'],stamina:4,cooldown:45,name:['Выравнять дыхание','Steady your breathing'],desc:['+0,4 спокойствия; после находки +2 энергии и +0,5 понимания.','+0.4 calm; after discovery, +2 qi and +0.5 understanding.']},
    'sky-read':{technique:'sky',places:['ruins'],stamina:6,cooldown:90,name:['Сопоставить строки сутры','Compare sutra verses'],desc:['+1,5 понимания и практика техники.','+1.5 understanding and technique practice.']},
    'ink-read':{technique:'ink',places:['ruins'],stamina:6,cooldown:90,name:['Разобрать стёртые письмена','Decipher faded inscriptions'],desc:['До находки +30 секунд исследования; после неё +1 понимания.','Before discovery, +30 seconds of research; afterwards, +1 understanding.']},
    'sword-drill':{technique:'sword',places:['village','mountains'],stamina:12,cooldown:60,name:['Отработать ответный удар','Drill a counterstrike'],desc:['+0,12 освоения, +0,04 тела и практика техники.','+0.12 mastery, +0.04 body and technique practice.']},
    'grove-gather':{technique:'grove',places:['forest'],stamina:8,cooldown:60,name:['Замкнуть нефритовый круг','Close the jade circle'],desc:['Собрать 3 травы и 1 энергии.','Gather 3 herbs and 1 qi.']},
    'cloud-drill':{technique:'cloud',places:['village','mountains'],stamina:12,cooldown:60,name:['Вернуть клинок в стойку','Return the blade to stance'],desc:['+0,16 освоения, +0,04 тела и практика техники.','+0.16 mastery, +0.04 body and technique practice.']},
    'seal-read':{technique:'seal',places:['ruins','city'],stamina:6,cooldown:90,name:['Восстановить последовательность знаков','Restore the sequence of signs'],desc:['+2 понимания и практика техники.','+2 understanding and technique practice.']},
    'iron-lift':{technique:'iron',places:['village','city'],stamina:14,cooldown:60,name:['Поднять связку на железных сухожилиях','Lift a bundle with Iron Sinews'],desc:['+0,2 тела; при разгрузке выполняет 3 переноса.','+0.2 body; completes 3 lifts during a hauling contract.']}
  };
  function techniqueActionHint(s,id,language='ru'){
    const d=techniqueActionDefs[id],en=language==='en';if(!d)return '';
    if(s.world.journey)return en?'Finish your journey first.':'Сначала закончи переход.';
    if(!s.cultivation.learned[d.technique])return en?'Learn the technique first.':'Сначала изучи технику.';
    if(s.cultivation.active!==d.technique)return en?'Equip this technique first.':'Сначала выбери эту технику.';
    if(!d.places.includes(s.world.location))return (en?'Available at: ':'Доступно: ')+d.places.map(p=>en?({village:'Village',city:'City',forest:'Forest',ruins:'Ruins',mountains:'Mountain pass'})[p]:W.locations[p].name).join(', ')+'.';
    const wait=s.cultivation.actionCooldowns?.[id]||0;
    if(wait>0)return en?`Recover the technique: ${Math.ceil(wait)} s.`:`Восстановление приёма: ${Math.ceil(wait)} сек.`;
    if(s.stamina<d.stamina)return en?`Need ${d.stamina} stamina.`:`Нужно ${d.stamina} выносливости.`;
    return en?`Costs ${d.stamina} stamina; recovery ${d.cooldown} s. Stops your current activity.`:`Расход: ${d.stamina} выносливости; восстановление ${d.cooldown} сек. Прерывает текущее занятие.`;
  }
  const canTechniqueAction=(s,id)=>{const d=techniqueActionDefs[id];return !!d&&!s.world.journey&&!!s.cultivation.learned[d.technique]&&s.cultivation.active===d.technique&&d.places.includes(s.world.location)&&!(s.cultivation.actionCooldowns?.[id]>0)&&s.stamina>=d.stamina;};
  const techniqueActions=(s,language='ru')=>Object.entries(techniqueActionDefs).filter(([,d])=>s.cultivation.learned[d.technique]&&d.places.includes(s.world.location)).map(([id,d])=>({id,technique:d.technique,name:d.name[language==='en'?1:0],description:d.desc[language==='en'?1:0],hint:techniqueActionHint(s,id,language),enabled:canTechniqueAction(s,id)}));
  function useTechniqueAction(s,id){
    if(!canTechniqueAction(s,id))return false;
    const d=techniqueActionDefs[id];interruptActivity(s);s.stamina-=d.stamina;(s.cultivation.actionCooldowns||(s.cultivation.actionCooldowns={}))[id]=d.cooldown;
    const body=v=>{s.body=Math.min(10*(s.realm+1),s.body+v*W.bonus(s).body*techniqueBonus(s,'body'));};
    const understanding=v=>{if(s.found)s.xp=Math.min(needed(s),s.xp+v);};
    if(id==='stone-load'){body(.16);if(canWorkOrder(s)&&s.employment.order.kind==='haul')s.employment.order.progress=Math.min(orders.haul.target,s.employment.order.progress+2);}
    if(id==='iron-lift'){body(.2);if(canWorkOrder(s)&&s.employment.order.kind==='haul')s.employment.order.progress=Math.min(orders.haul.target,s.employment.order.progress+3);}
    if(id==='herb-listen'||id==='grove-gather'){s.resources.herbs+=id==='grove-gather'?3:2;s.calm=Math.min(100,s.calm+.1);if(id==='grove-gather')s.resources.qi++;}
    if(id==='river-breath'){s.calm=Math.min(100,s.calm+.4);if(s.found)s.resources.qi+=2;understanding(.5);}
    if(id==='ink-read'){if(!s.found){s.explored=Math.min(600,s.explored+30);discover(s);}else understanding(1);}
    if(id==='sky-read')understanding(1.5);
    if(id==='seal-read')understanding(2);
    if(id==='sword-drill'||id==='cloud-drill'){body(.04);s.mastery=Math.min(10*(s.realm+1),s.mastery+(id==='cloud-drill'?.16:.12));}
    // The action's stamina price includes its short practice segment.
    const paid=s.stamina;s.stamina+=.3;techniquePractice(s,d.technique,3);s.stamina=paid;
    log(s,`${d.name[0]}. ${d.desc[0]}`);return true;
  }
  function techniquePractice(s,k,amount){
    const learned=s.cultivation.learned[k],definition=techniques[k];
    if(!learned||learned.rank>=5||amount<=0)return 0;
    const practiced=Math.max(0,Math.min(amount,techniqueNeeded(learned.rank)-learned.progress,definition.practiceBody?s.stamina/.1:Infinity));
    learned.progress+=practiced;
    if(definition.practiceBody){
      s.stamina=Math.max(0,s.stamina-practiced*.1);
      s.body=Math.min(10*(s.realm+1),s.body+practiced*definition.practiceBody*W.bonus(s).body*techniqueBonus(s,'body'));
    }
    return practiced;
  }
  const activityRunning=s=>canActivity(s,s.activity);
  const staminaMax=s=>100+Math.min(100,Math.floor(s.body*2));
  const staminaRecovery=s=>.4+Math.min(.2,s.body*.002);
  const taskGains={sweep:{body:.012,calm:.01},haul:{body:.035},scout:{calm:.005},ledger:{calm:.005,xp:.005},explore:{calm:.001,xp:.001},physical:{body:.15},focus:{calm:.3,xp:.3},combat:{body:.1,mastery:.1}};
  function taskPractice(s,kind,amount=1){
    const gains=taskGains[kind];if(!gains||amount<=0)return;
    if(gains.body||gains.mastery)interruptActivity(s);
    s.body=Math.min(10*(s.realm+1),s.body+(gains.body||0)*amount*W.bonus(s).body*techniqueBonus(s,'body'));
    s.calm=Math.min(100,s.calm+(gains.calm||0)*amount);
    if(s.found)s.xp=Math.min(needed(s),s.xp+(gains.xp||0)*amount);
    s.mastery=Math.min(10*(s.realm+1),s.mastery+(gains.mastery||0)*amount);
  }
  function choicePractice(c){
    if(c.training&&!c.skip&&['physical','focus'].includes(c.training))return c.training;
    if(c.skip||c.recognition||c.practice||c.restore)return null;
    if(c.route)return {help:'physical',study:'focus',trade:'focus',combat:'combat'}[c.route];
    if(c.danger)return 'combat';
    if(['help','work','job','assist','carpenter-help','courier-help','mine','learn','guide','return-remains','rescue'].includes(c.id))return 'physical';
    if(c.mentor||c.explore||['study','heal','trade','buy','understand','gather','collect','search'].includes(c.id))return 'focus';
    return null;
  }
  function taskPracticeText(kind,language='ru'){
    const en=language==='en',g=taskGains[kind];if(!g)return '';
    const gains=[g.body?`${en?'Body':'Тело'} +${g.body}`:'',g.calm?`${en?'Calm':'Спокойствие'} +${g.calm}`:'',g.xp?`${en?'Understanding (after discovery)':'Понимание (после находки)'} +${g.xp}`:'',g.mastery?`${en?'Mastery':'Освоение'} +${g.mastery}`:''].filter(Boolean).join(' · ');
    return gains+(kind==='ledger'||kind==='explore'?(en?' per second of actual work.':' за секунду фактической работы.'):(en?' per completed action.':' за выполненное действие.'))+(g.body?(en?' A stronger body raises stamina capacity and recovery.':' Рост тела увеличивает запас и восстановление выносливости.'):'');
  }
  function choiceExplanation(s,scene,c,language='ru') {
    const en=language==='en',say=(ru,english)=>en?english:ru;
    if(!c)return {intent:'',cost:'',risk:'',benefit:'',relationship:'',requirement:'',available:false};
    const n=v=>Number(v.toFixed(3)).toLocaleString(en?'en-US':'ru-RU');
    const resourceNames={gold:'coins',herbs:'herbs',qi:'qi',relics:'shards',reputation:'reputation',wood:'wood',ore:'ore',pills:'pills',influence:'influence',supplies:'supplies',cosmic:'stellar essence',worlds:'worlds'};
    const resourceList=values=>Object.entries(values||{}).map(([k,v])=>`${n(v)} ${en?resourceNames[k]||k:names[k]||k}`).join(', ');
    const profile=choicePractice(c),failed=!!c.danger&&power(s)<c.danger;
    let intent=c.skip?say('Отложить эту возможность и продолжить путь.','Put this opportunity aside and continue travelling.'):
      c.danger?say('Решить препятствие силой; проверить свою боевую подготовку.','Overcome the obstacle by force and test your combat preparation.'):
      c.route?say({help:'Помочь местным жителям физической работой.',study:'Применить знакомую технику для решения местной задачи.',trade:'Обеспечить работу инструментами и припасами.',combat:'Защитить людей от вымогателей.'}[c.route],{help:'Help local people with physical work.',study:'Use a learned technique to solve a local problem.',trade:'Supply the work with tools and provisions.',combat:'Protect people from extortionists.'}[c.route]):
      c.recognition?say('Встретиться после выполненной помощи и получить благодарность.','Meet after your completed help and collect thanks.'):
      c.practice?say('Практиковать уже изученную технику с собеседником.','Practise an already learned technique with your companion.'):
      c.mentor?say('Учиться у собеседника и открыть его наставления.','Learn from your companion and gain access to their teaching.'):
      c.contact?say('Принять поручение для нового знакомого; доставка ещё впереди.','Accept an errand for a new contact; delivery is still ahead.'):
      c.admission?say('Заслужить поручительство для будущего вступления в секту.','Earn sponsorship for a future sect application.'):
      c.restore?say('Перевести дыхание и восстановить силы.','Take a breather and recover your strength.'):
      c.explore?say('Исследовать местные следы и продвинуть поиск наследия.','Study local clues and advance the search for the legacy.'):
      c.cost?say('Передать указанные ресурсы в обмен на предложенную помощь.','Hand over the listed resources in exchange for the offered help.'):
      profile==='physical'?say('Выполнить местную работу и потренировать тело.','Perform local work and exercise your body.'):
      profile==='focus'?say('Внимательно выполнить местную задачу.','Complete the local task attentively.'):
      say('Воспользоваться предложенной здесь возможностью.','Take the opportunity offered here.');
    const promise=c.memory?.kind==='promise';
    if(promise)intent=scene?.id==='village:mei-caravan'?say('Передать припасы и принять поручение; оплата будет после доставки.','Hand over supplies and accept an errand; payment follows delivery.'):say('Передать сведения Линь, чтобы она смогла помочь раненому.','Tell Lin where the injured traveller is so she can help him.');
    const costs=[];if(Object.keys(c.cost||{}).length)costs.push(resourceList(c.cost));
    if(!c.skip)costs.push(say('Прерывает текущее занятие.','Interrupts the current activity.'));
    if(c.stamina)costs.push(say(`${n(c.stamina)} выносливости`,`${n(c.stamina)} stamina`));
    const learned=c.practice&&s.cultivation.learned[c.practice.technique],definition=c.practice&&techniques[c.practice.technique];
    const practiced=learned&&learned.rank<5?Math.max(0,Math.min(c.practice.amount,techniqueNeeded(learned.rank)-learned.progress,definition?.practiceBody?Math.max(0,s.stamina-(c.stamina||0))/.1:Infinity)):0;
    if(practiced&&definition?.practiceBody)costs.push(say(`до ${n(practiced*.1)} выносливости на движения техники`,`up to ${n(practiced*.1)} stamina for technique movements`));
    const benefits=[];
    if(Object.keys(c.reward||{}).length)benefits.push(say('Награда: ','Reward: ')+resourceList(c.reward));
    if(c.restore)benefits.push(say('Восстановление выносливости до максимума.','Restore stamina to its maximum.'));
    if(c.calm)benefits.push(say(`Спокойствие +${n(c.calm)} (до предела 100).`,`Calm +${n(c.calm)} (up to 100).`));
    if(c.mastery)benefits.push(say(`Освоение +${n(c.mastery)} (до предела ступени).`,`Mastery +${n(c.mastery)} (up to the realm limit).`));
    if(profile)benefits.push(taskPracticeText(profile,language));
    if(c.practice){
      const growth=practiced&&definition?.practiceBody?Math.max(0,Math.min(10*(s.realm+1)-s.body,practiced*definition.practiceBody*W.bonus(s).body*techniqueBonus(s,'body'))):0;
      benefits.push(practiced?say(`Практика изученной техники +${n(practiced)}.${growth?` Тело +${n(growth)} от движений.`:''}`,`Learned technique practice +${n(practiced)}.${growth?` Body +${n(growth)} from movements.`:''}`):say('Практика не прибавится: сначала изучи технику или повысь её ранг после заполнения освоения.','Practice will not increase: first learn the technique or raise its rank after filling practice.'));
    }
    const mentorHints={trainer:['Тренировка тела +15%; доступ к урокам Жэня.','Body training +15%; access to Ren’s lessons.'],herbalist:['Травы при исследовании +20%; доступ к урокам Линь.','Herbs from exploration +20%; access to Lin’s lessons.'],breathing:['Понимание +10%; доступ к дыхательному приёму.','Understanding +10%; access to a breathing method.'],scholar:['Понимание +15%; доступ к рукописи Вэя.','Understanding +15%; access to Wei’s manuscript.'],swordsman:['Освоение +15%; доступ к урокам Юнь.','Mastery +15%; access to Yun’s lessons.']};
    if(c.mentor&&!s.world.mentors.includes(c.mentor))benefits.push(say(...mentorHints[c.mentor]));
    if(c.contact&&!s.world.contacts.includes(c.contact))benefits.push(say('Контакт и возможность доставить письмо; это ещё не завершённое поручение.','A contact and a letter-delivery opportunity; the errand is not completed yet.'));
    if(c.admission&&!s.world.admissionRoutes.includes(c.admission))benefits.push(say('Открывает путь подачи заявки в секту; членство не выдаётся автоматически.','Opens a sect application route; membership is not granted automatically.'));
    if(c.explore)benefits.push(say(`Исследование +${n(c.explore)} сек; находка открывается при 600 сек в храме.`,`Research +${n(c.explore)} sec; the discovery opens at 600 sec in the temple.`));
    if(c.route)benefits.push(say('Начинает местное поручение. Награда и признание — при следующей встрече здесь.','Starts a local task. Reward and recognition come at a follow-up meeting here.'));
    if(c.recognition)benefits.push(say('Признание +1 в главе, где была выполнена помощь.','Recognition +1 in the chapter where you provided the help.'));
    const requirements=[];
    const authored={'village:ren-balance/carry':['Тело ≥ 2','Body ≥ 2'],'ruins:wei-compare/compare':['Спокойствие ≥ 3','Calm ≥ 3'],'city:rival-rumor/witnesses':['Спокойствие ≥ 3','Calm ≥ 3'],'city:rival-rumor/wei':['Знакомство с Вэем или его наставления','Meet Wei or obtain his teaching'],'village:ren-recovery/work':['Выносливость ≥ 15','Stamina ≥ 15']};
    const requirement=c.requirement?W.sceneText(c,'requirement',language,s):authored[`${scene?.id}/${c.id}`]?say(...authored[`${scene.id}/${c.id}`]):'';
    if(c.requires)requirements.push((c.requires(s)?say('Выполнено: ','Met: '):say('Нужно: ','Required: '))+(requirement||say('условия указанной встречи','the conditions stated in this encounter')));
    const deficits=Object.fromEntries(Object.entries(c.cost||{}).filter(([k,v])=>s.resources[k]<v).map(([k,v])=>[k,v-s.resources[k]]));
    if(Object.keys(deficits).length)requirements.push(say('Не хватает: ','Missing: ')+resourceList(deficits));
    if(s.world.journey)requirements.push(say('Дождись прибытия.','Wait until you arrive.'));
    if(scene&&!c.skip&&!W.eligible(s,scene))requirements.push(say('Эта возможность уже завершена или её условия изменились.','This opportunity is already completed or its conditions changed.'));
    const preview=W.memory?.preview?.(s,scene,c,language,failed?'failure':c.skip?'declined':'success');
    if(profile)benefits.push(say('Рост ограничен текущими пределами развития.','Growth is limited by current progression caps.'));
    return {intent,cost:costs.join(' · ')||say('Ресурсы не расходуются.','No resources are spent.'),risk:c.riskCue?W.sceneText(c,'riskCue',language,s)+say(' Можно отступить до сближения. При гибели теряется половина переносимых ресурсов, развитие сохраняется.',' You can retreat before approaching. Death loses half of carried resources; progression is retained.'):c.danger?say(`Проверка силы: ${n(power(s))}/${n(c.danger)}. ${failed?'Сейчас сил недостаточно: действие приведёт к гибели.':'Сейчас силы достаточно для победы.'} При гибели теряется половина переносимых ресурсов; развитие и сюжет сохраняются. Указанные расходы списываются до проверки.`,`Power check: ${n(power(s))}/${n(c.danger)}. ${failed?'Your power is insufficient: this action leads to death.':'You currently have enough power to win.'} Death loses half of carried resources; progression and story are retained. Listed resource costs are spent before the check.`):say('Смертельной проверки нет.','No lethal check.'),benefit:(failed&&!c.riskCue?say('При текущей силе награды и развитие не будут получены. Возможная польза после достаточной подготовки: ','At your current power, no rewards or progression will be gained. Potential benefit after sufficient preparation: '):c.danger?say('При победе: ','If victorious: '):'')+(benefits.join(' ')||say('Без немедленной прибавки к ресурсам или развитию.','No immediate resource or progression gain.')),relationship:preview?.text||'',requirement:requirements.join(' '),available:W.canChoice(s,c,api)};
  }
  function guidance(s,action,key='',language='ru') {
    if(action==='atlas-survey')return Atlas.hint(s,language);
    if(action==='achievement-action'){
      const en=language==='en',wait=s.achievements.cooldowns[key]||0,cost=key==='carry'?3:5;
      if(s.world.journey)return en?'Finish your journey first.':'Сначала закончи переход.';
      if(key==='carry'&&!canWorkOrder(s))return en?'Return to the employer’s location.':'Вернись в место принятого заказа.';
      if(wait>0)return en?`Recovery: ${Math.ceil(wait)} s.`:`Восстановление: ${Math.ceil(wait)} сек.`;
      if(s.stamina<cost)return en?`Requires ${cost} stamina; wait for recovery.`:`Нужно ${cost} выносливости; подожди восстановления.`;
      return en?'Uses your current activity slot; meditation stops.':'Занимает текущее занятие; медитация останавливается.';
    }
    if(action==='technique-action')return techniqueActionHint(s,key,language);
    const en=language==='en',say=(ru,english)=>en?english:ru;
    const n=value=>Number(value.toFixed(2)).toLocaleString(en?'en-US':'ru-RU');
    const remaining=(target,current)=>n(Math.max(0,target-current));
    const resourceNames={gold:'coins',herbs:'herbs',qi:'qi',relics:'shards',pills:'pills',reputation:'reputation',influence:'influence',supplies:'supplies',cosmic:'stellar essence',worlds:'worlds'};
    const missing=cost=>Object.entries(cost).filter(([k,v])=>s.resources[k]<v).map(([k,v])=>`${remaining(v,s.resources[k])} ${en?resourceNames[k]:names[k]}`).join(', ');
    const resourcesHint=cost=>{
      const deficit=missing(cost);if(!deficit)return '';
      const sources=[];
      if(cost.herbs>s.resources.herbs)sources.push(say('травы — исследуй лес или руины, выбирай сбор во встречах','herbs — explore the forest or ruins and choose gathering encounters'));
      if(cost.qi>s.resources.qi)sources.push(say('энергия — медитируй после находки древней техники','qi — meditate after discovering the ancient technique'));
      if(cost.gold>s.resources.gold)sources.push(say('монеты — выполни заказ и получи оплату','coins — complete a contract and collect payment'));
      if(cost.relics>s.resources.relics)sources.push(say('осколки — ищи встречи в руинах или побеждай в испытаниях','shards — seek encounters in the ruins or win trials'));
      return say(`Не хватает: ${deficit}.${sources.length?' '+sources.join('; ')+'.':''}`,`Missing: ${deficit}.${sources.length?' '+sources.join('; ')+'.':''}`);
    };
    if(action==='story'){
      const beat=storyBeat(s);if(!beat)return guidance(s,'advance','',language);
      if(s.world.journey)return say('Дождись прибытия. Затем вернись к сюжетной цели.','Wait until you arrive, then return to the story objective.');
      if(s.world.location!==beat.location)return say(`Открой «Путешествия» и отправься: ${W.locations[beat.location].name}. Прогресс цели сохранится.`,`Open Travel and go to ${beat.location==='ruins'?'the ruins':'the village'}. Your objective progress is kept.`);
      if(beat.ready(s)&&(s.storyStep!==6||!key||firstRouteReady(s,key)))return say('Условия выполнены. Нажми сюжетную кнопку, чтобы получить награду и продолжить.','Requirements met. Press the story button to collect your reward and continue.');
      if(s.storyStep===1){
        if(s.employment.order)return guidance(s,'claim-order','',language)+' '+say(`Цель: 10 подметаний (${s.clicks.sweep}/10) ИЛИ 15 монет (${n(s.resources.gold)}/15).`,`Objective: 10 sweeps (${s.clicks.sweep}/10) OR 15 coins (${n(s.resources.gold)}/15).`);
        return say(`На доске подработок возьми уборку → нажми «Подмести двор» ещё ${remaining(10,s.clicks.sweep)} раз → получи оплату. Альтернатива: накопи ещё ${remaining(15,s.resources.gold)} монет.`,`Accept a cleaning contract → use Sweep ${remaining(10,s.clicks.sweep)} more times → collect payment. Alternative: earn ${remaining(15,s.resources.gold)} more coins.`);
      }
      if(s.storyStep===2)return say(`Тело ${n(s.body)}/2. Нажимай «Присесть» или «Пробежать отрезок»; выносливость восстанавливается сама. Можно вместо этого изучить любую доступную технику.`,`Body ${n(s.body)}/2. Click Squat or Run; stamina recovers automatically. Alternatively, learn any available technique.`);
      if(s.storyStep===3)return say(`Спокойствие ${n(s.calm)}/5. Выбери «Медитировать» и подожди; клики не нужны.`,`Calm ${n(s.calm)}/5. Select Meditate and wait; no clicks are needed.`);
      if(s.storyStep===4)return say(`Исследование ${n(s.explored)}/600 сек. В руинах выбери «Исследовать местность»; «Осмотреть развалины» ускоряет поиск. После находки нажми сюжетную кнопку.`,`Research ${n(s.explored)}/600 sec. In the ruins, select Explore; Inspect ruins speeds up the search. After the discovery, press the story button.`);
      if(s.storyStep===5)return guidance(s,'breakthrough','',language);
      if(s.storyStep===6){
        if(key==='combat')return guidance(s,'fight','',language);
        if(key==='service')return say(`Признание ${W.recognition(s,0)}/3. В путешествиях помогай людям и завершай продолжения поручений. Затем вернись в деревню.`,`Recognition ${W.recognition(s,0)}/3. Help people during travels and complete follow-up tasks, then return to the village.`);
        if(key==='diplomacy')return say('Найди встречу с письмом в деревне, возьми письмо и доставь Вэю в городе. Затем вернись с рекомендацией в деревню.','Find the village letter encounter, take the letter and deliver it to Wei in the city. Then return to the village with his recommendation.');
        return say(`Выбери любой путь: победа в «Испытаниях» (${s.wins}/1), помощь людям (${W.recognition(s,0)}/3 признания) или доставка письма Вэю в городе.`,`Choose any route: win a Trial (${s.wins}/1), help people (${W.recognition(s,0)}/3 recognition), or deliver Wei’s letter in the city.`);
      }
    }
    if(action==='breakthrough'){
      if(!s.found)return say('Сначала найди древнюю технику: отправься в руины и исследуй их 600 секунд. Осмотр развалин ускоряет поиск.','First discover the ancient technique: travel to the ruins and research for 600 seconds. Inspecting ruins speeds up the search.');
      const parts=[];
      if(s.xp<needed(s))parts.push(say(`Понимание ${n(s.xp)}/${needed(s)}. Выбери «Медитировать» и подожди.`,`Understanding ${n(s.xp)}/${needed(s)}. Select Meditate and wait.`));
      const deficit=resourcesHint(breakthroughCost(s));if(deficit)parts.push(deficit);
      return parts.join(' ')||say('Всё готово. Нажми «Совершить прорыв»: ресурсы спишутся, ступень и пределы развития вырастут.','Ready. Press Break through: resources are spent, your realm and development limits increase.');
    }
    if(action==='learn-technique'&&techniques[key]){
      const learned=s.cultivation.learned[key];
      if(learned?.rank>=5)return say('Достигнут максимальный ранг: 5/5.','Maximum rank reached: 5/5.');
      const parts=[];
      if(learned&&learned.progress<techniqueNeeded(learned.rank))parts.push(say(`Освоение ${n(learned.progress)}/${techniqueNeeded(learned.rank)} сек. Примени эту технику, выбери «Осваивать технику» и подожди.`,`Practice ${n(learned.progress)}/${techniqueNeeded(learned.rank)} sec. Equip this technique, select Practise technique and wait.`));
      const deficit=resourcesHint(techniqueCost(s,key));if(deficit)parts.push(deficit);
      return parts.join(' ')||say('Условия выполнены. Нажми кнопку изучения; указанные ресурсы будут потрачены.','Requirements met. Press the learn button; the listed resources will be spent.');
    }
    if(action==='order'&&orders[key]){
      if(s.world.journey||!['village','city'].includes(s.world.location))return say('Заказы принимают в деревне и городе. Открой «Путешествия» и отправься в поселение.','Contracts are accepted in the village and city. Open Travel and go to a settlement.');
      if(!orderAvailable(s,key))return say('Сначала познакомься с заказчиком во встрече в этом поселении: он предложит работу.','First meet the employer in an encounter in this settlement: they will offer work.');
      if(s.body<orders[key].body)return say(`Нужно тело ${orders[key].body}; сейчас ${n(s.body)}. Нажимай «Присесть» или «Пробежать отрезок».`,`Requires body ${orders[key].body}; you have ${n(s.body)}. Click Squat or Run.`);
      return key==='ledger'?say('Прими заказ: начнётся фоновая сверка накладных. Через 180 секунд работы нажми «Получить оплату».','Accept the contract to start background invoice checking. After 180 seconds of work, press Collect payment.'):say(`Прими заказ → выполни ${orders[key].target} кликов «${clicks[key].name}» → нажми «Получить оплату».`,`Accept the contract → perform ${orders[key].target} ${key==='sweep'?'Sweep':'Carry crates'} clicks → press Collect payment.`);
    }
    if(action==='activity'){
      if(key==='rest')return say('Фоновое развитие остановлено. Выносливость восстанавливается; для продолжения выбери медитацию, технику или работу.','Background progress is stopped. Stamina recovers; select meditation, technique practice or work to continue.');
      if(key==='work')return guidance(s,'claim-order','',language);
      if(key==='train')return say('Распорядок: тело +0,003/сек × помощь наставника и техники; прорывы постепенно ускоряют упражнения. Выносливость −0,18/сек. Только деревня и город; медитация остановлена.','Routine: body +0.003/sec × mentor and technique bonuses; breakthroughs gradually accelerate exercises. Stamina −0.18/sec. Village and city only; meditation is stopped.');
      if(key==='meditate')return s.found?say('Идёт автоматически: растут спокойствие, понимание и энергия. На пределе понимания соверши прорыв.','Runs automatically: calm, understanding and qi grow. At the understanding limit, break through.'):say('Пока растёт только спокойствие. Для понимания и энергии сначала найди древнюю технику в руинах.','Only calm grows for now. To gain understanding and qi, first discover the ancient technique in the ruins.');
      if(key==='technique')return say('Практика идёт автоматически для активной техники. Когда освоение заполнится, оплати повышение её ранга в блоке техник.','Practice runs automatically for the active technique. When practice is full, pay to increase its rank in the techniques section.');
      if(key==='explore')return say('Сбор идёт автоматически в лесу и руинах. Для древней находки нужны руины и 600 секунд исследования. Переход останавливает сбор.','Gathering runs automatically in the forest and ruins. The ancient discovery requires the ruins and 600 seconds of research. Travel pauses gathering.');
    }
    if(action==='claim-order'){
      const order=s.employment.order;if(!order)return '';
      if(!canWorkOrder(s)){const place=order.place||'village';return say(`Работа и оплата доступны только у заказчика: ${W.locations[place].name}. Вернись туда через «Путешествия». Прогресс сохранён.`,`Work and payment are available only at the employer's location: ${place==='city'?'Silver Bridge City':'Wellside Village'}. Return through Travel. Progress is saved.`);}
      if(order.progress>=orders[order.kind].target)return say('Заказ завершён. Нажми «Получить оплату» — деньги не выдаются автоматически.','Contract complete. Press Collect payment — payment is not automatic.');
      if(order.kind==='ledger')return say(`Осталось ${remaining(orders.ledger.target,order.progress)} сек работы. Выбери «Работать над заказом» и подожди, затем получи оплату.`,`Work remaining: ${remaining(orders.ledger.target,order.progress)} sec. Select Work on contract and wait, then collect payment.`);
      if(workMastered(s,order.kind))return say('Работа освоена: выбери «Работать над заказом», чтобы выполнять её без кликов. Выносливость расходуется; затем получи оплату у заказчика.','Work is familiar: select Work on contract to perform it without clicks. It uses stamina; then collect payment from the employer.');
      return say(`Осталось ${remaining(orders[order.kind].target,order.progress)} действий. Оставайся у заказчика и нажимай «${clicks[order.kind].name}», затем получи оплату.`,`Actions remaining: ${remaining(orders[order.kind].target,order.progress)}. Stay at the employer's location, click ${order.kind==='sweep'?'Sweep':'Carry crates'}, then collect payment.`);
    }
    if(action==='click'&&clicks[key]){
      if(s.stamina<clicks[key].stamina)return say(`Нужно ${clicks[key].stamina} выносливости; сейчас ${n(s.stamina)}. Подожди восстановления (+${n(staminaRecovery(s))}/сек).`,`Requires ${clicks[key].stamina} stamina; you have ${n(s.stamina)}. Wait for recovery (+${n(staminaRecovery(s))}/sec).`);
      if(clicks[key].body&&s.body>=10*(s.realm+1))return say('Достигнут предел тела. Соверши прорыв, чтобы продолжить тренировку.','Body limit reached. Break through to continue training.');
      if(['sweep','haul'].includes(key))return guidance(s,'claim-order','',language);
    }
    if(action==='fight'){
      if(s.stage===0&&(s.storyStep!==6||s.realm<1||s.world.location!=='village'))return say('Первый бой откроется в деревне на последнем шаге сюжета, после первого прорыва.','The first fight opens in the village at the last story step, after your first breakthrough.');
      if(s.world.journey)return say('Дождись окончания перехода.','Wait until your journey ends.');
      if(s.cooldown>0)return say(`Отдых после боя: ещё ${Math.ceil(s.cooldown)} сек.`,`Rest after battle: ${Math.ceil(s.cooldown)} sec remaining.`);
      if(battlePower(s)<enemy(s).power)return say(`Сила ${n(battlePower(s))}/${n(enemy(s).power)}. Тренируй тело кликами, изучай техники и совершай прорывы.`,`Power ${n(battlePower(s))}/${n(enemy(s).power)}. Train your body through clicks, learn techniques and break through.`);
      return say('Силы достаточно. Нажми «Принять вызов», чтобы победить и получить награду.','You have enough power. Press Accept challenge to win and collect the reward.');
    }
    if(action==='advance'&&s.stage<7){
      if(canAdvance(s))return say('Все условия выполнены. Нажми кнопку перехода в следующую главу.','All requirements met. Press the button to begin the next chapter.');
      const parts=[];
      if(s.stage===0&&s.storyStep<story.length)parts.push(say(`Заверши текущий сюжет: ${s.storyStep}/${story.length} шагов.`,`Complete the current story: ${s.storyStep}/${story.length} steps.`));
      if(s.realm<stages[s.stage].realm)parts.push(say(`Ступень ${s.realm}/${stages[s.stage].realm}: медитируй и совершай прорывы.`,`Realm ${s.realm}/${stages[s.stage].realm}: meditate and break through.`));
      if(s.stage>0&&s.wins<stages[s.stage].wins&&W.recognition(s)<W.recognitionNeeded(s))parts.push(say(`Победы ${s.wins}/${stages[s.stage].wins} ИЛИ признание ${W.recognition(s)}/${W.recognitionNeeded(s)}: испытания или завершённые поручения.`,`Wins ${s.wins}/${stages[s.stage].wins} OR recognition ${W.recognition(s)}/${W.recognitionNeeded(s)}: trials or completed tasks.`));
      if(s.stage===1&&!s.world.admission)parts.push(say('Подай заявку в секту в городе, во вкладке «Путешествия».','Apply to a sect in the city through Travel.'));
      const deficit=resourcesHint(stages[s.stage].cost);if(deficit)parts.push(deficit);
      return parts.join(' ');
    }
    return '';
  }
  // Visibility follows context, independently of stamina, cooldowns and progress.
  const clickVisible=(s,k)=>Object.hasOwn(clicks,k)&&(['sweep','haul'].includes(k)?s.employment.order?.kind===k:k==='scout'?s.stage<2&&!s.found&&s.world.location==='ruins'&&!s.world.journey:true);
  const activityVisible=(s,k)=>Object.hasOwn(activities,k)&&activities[k].stage<=s.stage&&(k==='work'?s.employment.order&&workMastered(s,s.employment.order.kind):canActivity(s,k)||s.activity===k);
  const canClick = (s,k) => !!clicks[k] && !s.world.journey && s.clickCooldown<=0 && s.stamina>=clicks[k].stamina && (!clicks[k].body||s.body<10*(s.realm+1)) && (k!=='scout'||(s.stage<2&&!s.found&&!s.world.journey&&s.world.location==='ruins')) && (!['sweep','haul'].includes(k)||(canWorkOrder(s)&&s.employment.order?.kind===k&&s.employment.order.progress<orders[k].target));
  function discover(s) { if (!s.found && s.explored >= 600 && s.world.location==='ruins'&&!s.world.journey) { s.found = true; log(s,'Найдена техника Пустого Неба. Накапливай понимание и травы для первого прорыва.'); } }
  function performAction(s, type, value) {
    if(type==='technique-action')return useTechniqueAction(s,value);
    if(type==='name'){const name=N.normalize(value);if(s.playerName||!name)return false;s.playerName=name;s.last=Date.now();return true;}
    if(type==='learn-technique'){if(!canLearn(s,value))return false;spend(s,techniqueCost(s,value));const t=s.cultivation.learned[value]||(s.cultivation.learned[value]={rank:0,progress:0});if(t.rank)t.progress-=techniqueNeeded(t.rank);t.rank++;if(!s.cultivation.active)s.cultivation.active=value;log(s,`Изучена техника: ${techniques[value].name}, ранг ${t.rank}.`);return true;}
    if(type==='equip-technique'){if(!Object.hasOwn(s.cultivation.learned,value))return false;s.cultivation.active=value;return true;}
    if (['travel','encounter','choice','apply-sect','map-inspect','forest-search'].includes(type)) {
      const choice=type==='choice'?W.current(s)?.choices.find(c=>c.id===value):null;
      const result=W.action(s,type,value,api);
      if(result&&(type==='travel'||(type==='choice'&&choice&&!choice.skip)))interruptActivity(s);
      return result;
    }
    if(type==='order'){
      if(!canOrder(s,value))return false;s.employment.order={kind:value,progress:0,pay:orderPay(s,value),place:s.world.location};
      if(value==='ledger')s.activity='work';
    }else if(type==='claim-order'){
      const order=s.employment.order;if(!canClaimOrder(s))return false;
      s.resources.gold+=order.pay;s.employment.completed++;log(s,`Заказ выполнен: ${orderName(s,order.kind,order.place||'village')}. Получено ${order.pay} монет.`);s.employment.order=null;
      if(s.activity==='work')interruptActivity(s);
    }else if(type==='cancel-order'){
      if(!s.employment.order)return false;s.employment.order=null;if(s.activity==='work')interruptActivity(s);
    }else if (type === 'click') {
      if (!canClick(s,value)) return false;
      interruptActivity(s);
      const c=clicks[value];s.stamina-=c.stamina;s.clickCooldown=.6;s.clicks[value]++;
      const mentors=s.world.mentors;
      s.body=Math.min(10*(s.realm+1),s.body+(c.body||0)*W.bonus(s).body*techniqueBonus(s,'body'));s.calm=Math.min(100,s.calm+(c.calm||0));
      s.resources.gold+=c.gold||0;s.resources.herbs+=(c.herbs||0)*(mentors.includes('herbalist')?1.2:1);
      if(s.found){s.xp=Math.min(needed(s),s.xp+(c.xp||0)*(mentors.includes('breathing')?1.1:1)*(mentors.includes('scholar')?1.15:1));s.resources.qi+=c.qi||0;}
      s.explored+=c.explore||0;discover(s);
      if(['sweep','haul'].includes(value)){s.employment.order.progress++;taskPractice(s,value);}
      if(value==='scout')taskPractice(s,'scout');
    } else if (type === 'story') {
      const beat=storyBeat(s);if(!beat||!beat.ready(s))return false;
      if(s.storyStep===2)s.chapterOneTraining=s.body>=2?'body':'technique';
      if(s.storyStep===6){const route=value||firstResolution(s);if(!firstRouteReady(s,route))return false;s.chapterOneRoute=route;log(s,`Путь первой главы: ${firstRoutes[route]}.`);}
      for(const [k,v] of Object.entries(beat.reward))s.resources[k]+=v;
      W.memory?.recordStory(s,s.storyStep);
      log(s,`История: ${beat.title}.`);s.storyStep++;
    } else if (type === 'activity' && canActivity(s,value)) s.activity = value;
    else if (type === 'style' && s.stage >= 1 && ['balanced', 'swift', 'piercing', 'ward'].includes(value)) s.style = value;
    else if (type === 'advance') {
      const next = stages[s.stage];
      if (!canAdvance(s)) return false;
      spend(s, next.cost); s.stage++; if (s.stage === 3) s.population = 3; log(s, chapterIntro(s));
      if(s.stage===2){const a=W.admissions[s.world.admission];for(const[k,v]of Object.entries(a.gift||{}))s.resources[k]+=v;if(a.mastery)s.mastery=Math.min(10*(s.realm+1),s.mastery+a.mastery);log(s,`Ты вступил: ${a.name}. ${a.text}`);}
    } else if (type === 'breakthrough') {
      const c = breakthroughCost(s);
      if (!s.found || s.xp < needed(s) || !affordable(s, c)) return false;
      spend(s, c); s.xp -= needed(s); s.realm++; log(s, `Прорыв: ${realmName(s.realm)}. Тело и техники получили новый предел развития.`);
    } else if (type === 'fight') {
      if (!canFight(s)) return false;
      log(s, `Победа: ${enemy(s).name}. Твои успехи привлекли внимание более сильных противников.`);
      s.resources.gold += 30 * 1.8 ** s.wins; s.resources.herbs += 10 * (s.wins + 1); s.resources.relics += 1; s.wins++; s.cooldown = 300;
      taskPractice(s,'combat');
    } else if (type === 'weapon') {
      const c = { gold: Math.ceil(40 * 1.8 ** s.weapon), ...(s.stage >= 3 ? { ore: Math.ceil(10 * 1.4 ** s.weapon) } : {}) };
      if (s.stage < 1 || !affordable(s, c) || s.weapon >= (s.realm + 1) * 2) return false;
      spend(s, c); s.weapon++;
    } else if (type === 'study') {
      const c = { reputation: 20 * (s.study + 1), gold: 100 * (s.study + 1) };
      if (s.stage < 2 || s.study >= 10 || !affordable(s, c)) return false;
      spend(s, c); s.study++;
    } else if (type === 'build' && projects[value]) {
      const c = buildCost(s, value); if (projects[value].stage > s.stage || !affordable(s, c)) return false;
      spend(s, c); s.buildings[value]++;
    } else if (type === 'recruit') {
      if (s.stage < 3 || s.population >= 3 + s.buildings.dorm * 3 || !affordable(s, { gold: 100, herbs: 20 })) return false;
      spend(s, { gold: 100, herbs: 20 }); s.population++;
    } else if (type === 'worker') {
      const [job, deltaText] = value.split(':'), delta = Number(deltaText);
      if (s.stage < 3 || !Object.hasOwn(jobs, job) || ![-1, 1].includes(delta)) return false;
      const used = Object.values(s.workers).reduce((a, b) => a + b, 0);
      if ((delta < 0 && s.workers[job] === 0) || (delta > 0 && used >= s.population)) return false;
      s.workers[job] += delta;
    } else if (type === 'route') {
      if (s.stage < 4 || s.routes.length >= s.buildings.market || !affordable(s, { gold: 300, supplies: 30 })) return false;
      spend(s, { gold: 300, supplies: 30 }); s.routes.push({ remaining: 1800 });
    } else if (type === 'portal' || type === 'colonize') {
      const colonize = type === 'colonize';
      const c = colonize ? { cosmic: 60, supplies: 100 } : { qi: 500, supplies: 50 };
      if (s.stage < (colonize ? 6 : 5) || s.expedition || (colonize ? s.buildings.fleet < s.resources.worlds + 1 : power(s) + s.buildings.node * 20 < 10000 * (s.resources.worlds + 1)) || !affordable(s, c)) return false;
      spend(s, c); s.expedition = { kind: type, remaining: colonize ? 14400 : 7200 };
    } else if (type === 'rebirth') {
      if (s.stage < 7 || s.realm < 24) return false;
      const next = fresh(); next.achievements.earned={...s.achievements.earned}; next.playerName=s.playerName; next.souls = s.souls + Math.max(1, Math.floor(s.realm / 6)); next.life = s.life + 1; Object.assign(s, next); log(s, 'Новая жизнь началась. Наследие души ускоряет развитие.');
    } else return false;
    return true;
  }
  const achievementActions=s=>[
    ...(A.unlocked(s,'heavy')&&s.employment.order?.kind==='haul'?[{id:'carry',name:['Перенести с устойчивой стойкой','Carry with a steady stance'],description:['Продвигает разгрузку на 1 шаг и укрепляет тело. Расход: 3 выносливости; восстановление 60 сек.','Advances hauling by 1 step and trains the body. Costs 3 stamina; recovery 60 sec.'],enabled:canWorkOrder(s)&&s.employment.order.progress<orders.haul.target&&!s.world.journey&&s.stamina>=3&&!(s.achievements.cooldowns.carry>0)}]:[]),
    ...(A.unlocked(s,'practice')&&s.cultivation.active?[{id:'practice',name:['Короткая отработка приёма','Short technique practice'],description:['До 5 освоения выбранной техники. Расход: 5 выносливости; восстановление 60 сек.','Up to 5 practice for the active technique. Costs 5 stamina; recovery 60 sec.'],enabled:!s.world.journey&&s.stamina>=5&&!(s.achievements.cooldowns.practice>0)&&s.cultivation.learned[s.cultivation.active].rank<5&&s.cultivation.learned[s.cultivation.active].progress<techniqueNeeded(s.cultivation.learned[s.cultivation.active].rank)}]:[])
  ];
  function action(s,type,value){
    if(type==='atlas-survey'){const result=Atlas.survey(s,api);if(result)A.sync(s);return result;}
    if(type==='atlas-note'){
      if(!value||typeof value.id!=='string'||typeof value.text!=='string'||!W.map(s).nodes.some(n=>n.id===value.id))return false;
      const note=value.text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').slice(0,600).trim();if(note)s.atlas.notes[value.id]=note;else delete s.atlas.notes[value.id];return true;
    }
    if(type==='atlas-pin'){
      if(!W.map(s).nodes.some(n=>n.id===value))return false;const index=s.atlas.pins.indexOf(value);if(index>=0)s.atlas.pins.splice(index,1);else if(s.atlas.pins.length<80)s.atlas.pins.push(value);else return false;return true;
    }
    const detail={orderKind:s.employment.order?.kind};
    if(type==='achievement-action'){
      const choice=achievementActions(s).find(a=>a.id===value);if(!choice?.enabled)return false;
      interruptActivity(s);s.stamina-=value==='carry'?3:5;s.achievements.cooldowns[value]=60;
      if(value==='carry'){s.employment.order.progress++;taskPractice(s,'haul');}
      else{const remaining=s.stamina;s.stamina+=5;techniquePractice(s,s.cultivation.active,5);s.stamina=remaining;}
      A.sync(s);return true;
    }
    const result=performAction(s,type,value);if(result)A.record(s,type,detail);return result;
  }
  function advance(s, seconds) {
    let left = Math.max(0, Math.min(seconds, 86400));
    while (left > 0) {
      const dt = Math.min(left, 10, s.world.journey?.remaining || Infinity); left -= dt; const a = activityRunning(s)?activities[s.activity]:{}, mult = speed(s), wb = W.bonus(s);
      s.stamina=Math.min(staminaMax(s),s.stamina+staminaRecovery(s)*dt);s.clickCooldown=Math.max(0,s.clickCooldown-dt);
      for(const id of Object.keys(s.cultivation.actionCooldowns||{}))s.cultivation.actionCooldowns[id]=Math.max(0,s.cultivation.actionCooldowns[id]-dt);
      for(const id of Object.keys(s.achievements.cooldowns))s.achievements.cooldowns[id]=Math.max(0,s.achievements.cooldowns[id]-dt);
      s.atlas.cooldown=Math.max(0,s.atlas.cooldown-dt);
      if(s.activity==='train'&&activityRunning(s)){
        const work=Math.min(dt,s.stamina/.18);s.stamina-=work*.18;
        s.body=Math.min(10*(s.realm+1),s.body+.003*work*Math.min(3,1+s.realm*.15)*wb.body*techniqueBonus(s,'body'));
      }
      if(s.activity==='work'&&s.employment.order?.kind!=='ledger'&&activityRunning(s)){
        const o=s.employment.order,k=o.kind,rate=Math.min(.15,.08+s.employment.completed*.005),work=Math.min(dt*rate,orders[k].target-o.progress,s.stamina/clicks[k].stamina);
        s.stamina-=work*clicks[k].stamina;o.progress+=work;taskPractice(s,k,work);s.activity='work';
      }
      s.calm=Math.min(100,s.calm+(a.calm||0)*dt);
      for (const [k, v] of Object.entries(a.rates || {})) if((k!=='qi'||s.found)&&(s.activity!=='explore'||k!=='relics'||s.world.location==='ruins'))s.resources[k] += v * mult * dt * (k==='gold'&&s.activity==='work'?wb.gold:['herbs','relics'].includes(k)&&s.activity==='explore'?wb[k]:1) * (s.activity==='meditate'&&k==='qi'?techniqueBonus(s,'qi'):s.activity==='explore'&&k==='herbs'?techniqueBonus(s,'herbs'):1);
      if(s.activity==='work'&&s.employment.order?.kind==='ledger'&&activityRunning(s)){
        const work=Math.min(dt,orders.ledger.target-s.employment.order.progress);
        s.employment.order.progress+=work;taskPractice(s,'ledger',work);
      }
      if(s.activity==='explore'&&activityRunning(s))taskPractice(s,'explore',dt);
      s.mastery = Math.min(10 * (s.realm + 1), s.mastery + (a.mastery || 0) * mult * dt * wb.mastery * techniqueBonus(s,'mastery'));
      if(s.activity==='technique'&&activityRunning(s))techniquePractice(s,s.cultivation.active,dt*mult);
      if (s.found) s.xp = Math.min(needed(s), s.xp + (a.xp || 0) * mult * dt * wb.xp * (s.activity==='meditate'?techniqueBonus(s,'xp'):1));
      if (s.activity === 'explore' && activityRunning(s) && s.world.location==='ruins') { s.explored += dt; discover(s); }
      if (s.stage >= 3) {
        s.resources.herbs += (s.workers.herb * .04 + s.buildings.garden * .06) * dt;
        s.resources.wood += s.workers.lumber * .1 * dt; s.resources.ore += s.workers.miner * .06 * dt;
        const pills = Math.min(s.workers.alchemist * .005 * dt, s.resources.herbs / 5, s.resources.qi / 10);
        s.resources.pills += pills; s.resources.herbs -= pills * 5; s.resources.qi -= pills * 10;
        s.resources.influence += s.workers.disciple * .015 * dt;
      }
      if (s.stage >= 4) { s.resources.supplies += s.buildings.granary * .08 * dt;
        for (const route of s.routes) { route.remaining -= dt; while (route.remaining <= 0) { s.resources.gold += 500; s.resources.influence += 30; route.remaining += 1800; } }
      }
      if (s.stage >= 5) s.resources.cosmic += (s.buildings.node * .015 + s.resources.worlds * .01) * dt;
      if (s.expedition) { s.expedition.remaining -= dt; if (s.expedition.remaining <= 0) { s.resources.worlds++; s.resources.cosmic += 80; log(s, s.expedition.kind === 'portal' ? 'Портал закреплён: новый мир присоединился к твоей сети.' : 'Колония основана. Флот вернулся из звёздного похода.'); s.expedition = null; } }
      W.advance(s,dt,api);
      s.age += dt; s.cooldown = Math.max(0, s.cooldown - dt);
    }
    A.sync(s);
  }
  function validate(input) {
    const base = fresh(); if (!input || input.version !== 2) throw Error('Неверная версия сохранения');
    for (const k of ['stage', 'realm', 'xp', 'body', 'mastery', 'weapon', 'study', 'explored', 'wins', 'age', 'cooldown', 'souls', 'life', 'population', 'last']) if (!Number.isFinite(input[k]) || input[k] < 0 || input[k] > 1e100) throw Error('Неверные значения');
    for (const k of ['stage', 'realm', 'weapon', 'study', 'wins', 'souls', 'life', 'population']) if (!Number.isInteger(input[k])) throw Error('Неверный уровень');
    const activity=input.activity==='train'&&!(input.world?.mentors?.includes('trainer')&&input.body>=2&&((input.clicks?.squat||0)+(input.clicks?.run||0)>=20||(input.cultivation?.learned?.stance?.rank||0)>=2))?'meditate':input.activity;
    if (input.stage > 7 || input.realm > 100 || input.weapon > 202 || input.study > 10 || input.wins > 100 || typeof input.found !== 'boolean' || !activities[activity] || activities[activity].stage > input.stage || !['balanced', 'swift', 'piercing', 'ward'].includes(input.style)) throw Error('Неверное состояние');
    for (const group of ['resources', 'buildings', 'workers']) for (const k of Object.keys(base[group])) { const v = input[group]?.[k]; if (!Number.isFinite(v) || v < 0 || v > 1e100 || (group !== 'resources' && !Number.isInteger(v))) throw Error('Неверный ресурс'); base[group][k] = v; }
    if (Object.values(base.workers).reduce((a, b) => a + b, 0) > input.population || input.population > 3 + base.buildings.dorm * 3) throw Error('Неверные назначения');
    if (!Array.isArray(input.routes) || input.routes.length > base.buildings.market || input.routes.some(r => !Number.isFinite(r.remaining) || r.remaining <= 0 || r.remaining > 1800)) throw Error('Неверные маршруты');
    if (input.expedition !== null && (!input.expedition || !['portal', 'colonize'].includes(input.expedition.kind) || !Number.isFinite(input.expedition.remaining) || input.expedition.remaining <= 0 || input.expedition.remaining > 14400)) throw Error('Неверная экспедиция');
    // Existing v2 saves acquire the new systems without resetting progression.
    for(const k of ['stamina','clickCooldown','calm','storyStep']) {
      const v=input[k]??(k==='storyStep'&&input.stage>0?story.length:base[k]);
      if(!Number.isFinite(v)||v<0||v>(k==='storyStep'?story.length:k==='clickCooldown'?.6:k==='stamina'?staminaMax(input):100)||(k==='storyStep'&&!Number.isInteger(v)))throw Error('Неверное активное развитие');base[k]=v;
    }
    for(const k of Object.keys(clicks)){const v=input.clicks?.[k]??0;if(!Number.isSafeInteger(v)||v<0)throw Error('Неверные действия');base.clicks[k]=v;}
    for (const k of Object.keys(base)) if (!['atlas','achievements','resources', 'buildings', 'workers', 'events', 'routes', 'expedition', 'stamina', 'clickCooldown', 'calm', 'storyStep', 'clicks', 'world','employment','cultivation','activity','playerName','chapterOneRoute','chapterOneTraining'].includes(k)) base[k] = input[k];
    base.activity=activity;
    if(input.employment!==undefined){const e=input.employment;if(!e||!Number.isSafeInteger(e.completed)||e.completed<0)throw Error('Неверная работа');base.employment.completed=e.completed;
      if(e.order!==null){const o=e.order;if(!o||!orders[o.kind]||!Number.isFinite(o.progress)||o.progress<0||o.progress>orders[o.kind].target||!Number.isSafeInteger(o.pay)||o.pay<1||o.pay>50)throw Error('Неверный заказ');base.employment.order={kind:o.kind,progress:o.progress,pay:o.pay,place:'village'};if(o.place!==undefined){if(!['village','city'].includes(o.place))throw Error('Неверный заказ');base.employment.order.place=o.place;}}}
    if(base.activity==='work'&&!base.employment.order)base.activity='meditate';
    base.world=W.validate(input.world,input.stage);
    if(input.world?.people===undefined&&W.memory)base.world.people=W.memory.validate(undefined,input);
    if(input.playerName!==undefined&&input.playerName!==null){const name=N.normalize(input.playerName);if(!name)throw Error('Неверное имя героя');base.playerName=name;}
    if(input.chapterOneRoute!==undefined&&input.chapterOneRoute!==null){if(!Object.hasOwn(firstRoutes,input.chapterOneRoute))throw Error('Неверный путь первой главы');base.chapterOneRoute=input.chapterOneRoute;}
    if(input.chapterOneTraining!==undefined&&input.chapterOneTraining!==null){if(!['body','technique'].includes(input.chapterOneTraining))throw Error('Неверная подготовка героя');base.chapterOneTraining=input.chapterOneTraining;}
    if(input.cultivation!==undefined){const c=input.cultivation;if(!c||!c.learned||typeof c.learned!=='object'||Array.isArray(c.learned))throw Error('Неверные техники');
      for(const[k,t]of Object.entries(c.learned)){if(!Object.hasOwn(techniques,k)||!t||!Number.isInteger(t.rank)||t.rank<1||t.rank>5||!Number.isFinite(t.progress)||t.progress<0||t.progress>techniqueNeeded(t.rank))throw Error('Неверное освоение');base.cultivation.learned[k]={rank:t.rank,progress:t.progress};}
      if(c.active!==null&&!base.cultivation.learned[c.active])throw Error('Неверная активная техника');base.cultivation.active=c.active;
      if(c.actionCooldowns!==undefined){if(!c.actionCooldowns||typeof c.actionCooldowns!=='object'||Array.isArray(c.actionCooldowns))throw Error('Неверное восстановление техники');base.cultivation.actionCooldowns={};for(const[id,v]of Object.entries(c.actionCooldowns)){if(!Object.hasOwn(techniqueActionDefs,id)||!Number.isFinite(v)||v<0||v>techniqueActionDefs[id].cooldown)throw Error('Неверное восстановление техники');base.cultivation.actionCooldowns[id]=v;}}
    }
    base.routes = input.routes.map(r => ({ remaining: r.remaining })); base.expedition = input.expedition ? { kind: input.expedition.kind, remaining: input.expedition.remaining } : null;
    if (!Array.isArray(input.events)) throw Error('Неверная хроника'); base.events = input.events.filter(e => e && typeof e.text === 'string' && Number.isFinite(e.day)).slice(0, 30).map(e => ({ text: e.text.slice(0, 500), day: e.day }));
    base.achievements=A.validate(input.achievements,base);
    base.atlas=Atlas.validate(input.atlas);
    return base;
  }
  const realmName = n => `${['Смертный', 'Пробуждение', 'Сбор энергии', 'Основание', 'Духовное ядро', 'Пробуждение души', 'Небесный путь', 'Звёздный дух', 'Закон пространства'][Math.min(8, Math.floor((n + 2) / 3))]} · ступень ${n}`;
  function heroHeading(s){
    const headings=[
      ['Под чужим небом','начать с первого шага.'],
      ['Собственный путь','найти технику и наставника.'],
      ['Среди учеников','заслужить своё имя.'],
      ['Твоя первая секта','дать другим опору.'],
      ['Город под твоей защитой','связать судьбы жителей.'],
      ['За пределами одного неба','объединить источники мира.'],
      ['От мира к миру','проложить дороги среди звёзд.'],
      ['На границе мироздания','оставить наследие новой жизни.']
    ];
    let [title,accent]=headings[s.stage];
    if(s.stage===0){
      if(s.realm>=1&&firstResolution(s)){title='Первый рубеж пройден';accent='пора выбрать дальнейший путь.';}
      else if(s.found){title='Слова Пустого Неба';accent='превратить понимание в силу.';}
      else if(s.world.location==='ruins'){title='Под пеплом старого храма';accent='найти первую страницу пути.';}
      else if(s.world.location==='forest'){title='Среди шепчущих корней';accent='искать помощь на лесных тропах.';}
      else if(s.world.location==='city'){title='Чужак у городских ворот';accent='найти работу, знания и связи.';}
      else if(s.storyStep>=3){title='Тишина между вдохами';accent='услышать зов за деревней.';}
      else if(s.storyStep>=2){title='Тело, которое не слушается';accent='стать крепче своими усилиями.';}
      else if(s.storyStep>=1){title='Место у деревенского очага';accent='заработать на первый день.';}
    }else if(s.stage===1){
      if(s.world.admission){title='Поручительство принято';accent='подготовиться к жизни ученика.';}
      else if(s.world.location==='mountains'){title='На перевале Облачного Меча';accent='испытать себя и найти учителя.';}
      else if(s.world.location==='forest'){title='Лесные пути культивации';accent='найти того, кто поделится знанием.';}
      else if(s.world.location==='city'){title='Перед дверями трёх сект';accent='выбрать своё ученичество.';}
    }
    if(s.stage===2&&s.wins>=5){title='Имя, которое запомнили';accent='готовиться к следующему испытанию.';}
    if(s.stage>=2&&s.stage<7&&canAdvance(s)){title=stages[s.stage+1].name;accent='пора открыть новую главу.';}
    const place=W.locations[s.world.location].name;
    if(s.world.journey){title='В дороге к новой вехе';accent=W.locations[s.world.journey.destination].name;}
    const objective=s.stage===0&&storyBeat(s)?storyBeat(s).goal:stages[s.stage].subtitle;
    const affiliation=s.stage>=1&&s.world.admission?` · ${W.admissions[s.world.admission].name}`:'';
    return {title,accent,description:`${s.world.journey?'В пути: '+W.locations[s.world.journey.destination].name:'Место: '+place}${affiliation} · ${objective}`};
  }
  const api = { returnReport:R, sects:S, routineReady, workMastered, automationHint, atlas:Atlas, achievements:A, achievementActions, world:W, techniqueActions, canTechniqueAction, techniqueActionHint, techniques, techniqueCost, techniqueNeeded, techniqueBonus, canLearn, stages, names, activities, projects, jobs, clicks, orders, orderPay, orderAvailable, canWorkOrder, canClaimOrder, canOrder, story, interruptActivity, techniquePractice, staminaMax, staminaRecovery, taskPractice, choicePractice, taskPracticeText, choiceExplanation, guidance, clickVisible, activityVisible, canClick, canAdvance, canActivity, activityRunning, fresh, log, speed, needed, power, enemy, battlePower, affordable, buildCost, breakthroughCost, action, advance, validate, realmName, heroHeading, chapterIntro, storyBeat, firstRoutes, firstRouteReady, firstResolution, techniqueSource, orderName, canFight };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Isekai = api;
})(globalThis);
