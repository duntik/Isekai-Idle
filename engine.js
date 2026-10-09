(function (root) {
  'use strict';
  const W = typeof module !== 'undefined' && module.exports ? require('./world.js') : root.IsekaiWorld;
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
    work: { name: 'Работать над заказом', stage: 0, desc: 'Сверяет накладные для принятого заказа. На время работы медитация останавливается.', rates: {} },
    explore: { name: 'Исследовать местность', stage: 0, desc: 'В лесу — травы; в храме — травы, осколки и находка после 10 минут исследования. В пути занятие приостановлено.', rates: { herbs: .025, relics: 1 / 600 } },
    meditate: { name: 'Медитировать', stage: 0, desc: 'Успокаивает разум. После находки накапливает понимание и духовную энергию.', xp: .05, calm: .02, rates: { qi: .1 } },
    technique: { name: 'Осваивать технику', stage: 1, desc: 'Постепенно усиливает выбранный боевой стиль.', mastery: .01 },
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
    sweep:{name:'Уборка двора Мэй',neutral:'Заказ A',target:10,pay:8,body:0,desc:'10 подметаний. Выполняется кликами, пока ты медитируешь.'},
    haul:{name:'Разгрузка телеги',neutral:'Заказ B',target:8,pay:12,body:1,desc:'8 переносов ящика. Нужен показатель тела 1; выполняется кликами.'},
    ledger:{name:'Сверить накладные',neutral:'Заказ C',target:180,pay:20,body:0,desc:'3 минуты фоновой работы. Пока работаешь, медитация не идёт.'}
  };
  const orderPay=(s,k)=>Math.floor(orders[k].pay*(1+Math.min(10,Math.floor(s.employment.completed/5))*.1)*(s.world.location==='city'&&!s.world.journey?1.25:1));
  const canOrder=(s,k)=>Object.hasOwn(orders,k)&&!s.world.journey&&['village','city'].includes(s.world.location)&&!s.employment.order&&s.body>=orders[k].body;
  const story = [
    { title: 'Чужое небо', text: 'Последнее, что ты помнишь, — свет фар. Теперь над тобой два бледных солнца. На дороге скрипит телега. Женщина протягивает флягу: «Живой? Тогда помоги поднять колесо. До деревни довезу». Никто не называет тебя избранным.', goal: 'Принять помощь и добраться до деревни.', ready: () => true, reward: { gold: 5, herbs: 5 }, button: 'Подняться и пойти за телегой' },
    { title: 'Работа за место у очага', text: 'Хозяйка постоялого двора Мэй даёт тебе метлу. «За красивые истории не кормят. Подметёшь двор — получишь ужин». У ворот ученики секты смеются над твоей потрёпанной одеждой. Их лёгкие шаги почему-то оставляют трещины в камне.', goal: 'Подмести двор 10 раз или накопить 15 монет любой работой.', ready: s => s.clicks.sweep >= 10 || s.resources.gold >= 15, reward: { gold: 10 }, button: 'Получить первую плату' },
    { title: 'Тело, которое не слушается', text: 'Одного ящика хватает, чтобы руки задрожали. Мэй замечает твой взгляд на учеников: «Начни с ног. Старик у колодца каждое утро приседает и бегает до мостика. Не сила небес, но лучше, чем ничего». Ты решаешь завтра не быть таким же слабым.', goal: 'Развить тело до 2 активными приседаниями или бегом.', ready: s => s.body >= 2, reward: { herbs: 5 }, button: 'Показать, что стал крепче' },
    { title: 'Тишина между вдохами', text: 'Старик у колодца представляется: Жэнь. «В твоём мире всё спешили? Здесь сначала слушай». Он учит считать вдохи. Когда мысли затихают, из заброшенного храма за деревней доносится тонкий звон. Остальные его не слышат.', goal: 'Накопить 5 спокойствия фоновой медитацией.', ready: s => s.calm >= 5, reward: { herbs: 3 }, button: 'Рассказать Жэню о звоне' },
    { title: 'Осколок под пеплом', text: 'Жэнь показывает тропу к храму. Под обвалившимся алтарём лежит чёрный осколок. Он теплеет в твоей ладони, и в сознании проступают слова: «Пустое Небо». Это лишь повреждённая первая страница. Но на ней есть путь, которого вчера у тебя не было.', goal: 'Найти технику: 10 минут исследования, ускоряемого осмотром развалин.', ready: s => s.found, reward: { relics: 1 }, button: 'Прочитать первую страницу' },
    { title: 'Первый прорыв', text: 'Травы горчат. Каждый вдох заставляет осколок отвечать слабым теплом. Ты снова и снова теряешь ощущение потока, пока однажды оно не остаётся. Жэнь впервые смотрит на тебя серьёзно: «Теперь это твоя сила. И твоя ответственность».', goal: 'Заполнить понимание, собрать травы и совершить первый прорыв.', ready: s => s.realm >= 1, reward: { herbs: 10 }, button: 'Принять наставление' },
    { title: 'За право идти дальше', text: 'На дороге человек с повязкой Белого Клыка отбирает плату у возчиков. Ты узнаёшь телегу, на которой приехал. На этот раз ты можешь вмешаться. После победы Мэй даёт адрес городского представительства сект: туда можно прийти на общий набор. Но на лесных тропах и в храме можно найти другой путь и своего наставника. Побеждённый обещает, что его старший брат тебя запомнит.', goal: 'Победить дорожного разбойника во вкладке испытаний.', ready: s => s.wins >= 1, reward: { gold: 25 }, button: 'Узнать о наборе и собраться в путь' }
  ];
  const baseFresh = () => ({ version: 2, stage: 0, realm: 0, xp: 0, body: 0, mastery: 0, style: 'balanced', weapon: 0, study: 0, found: false, explored: 0, wins: 0, activity: 'work', age: 0, cooldown: 0, souls: 0, life: 1, population: 0, stamina: 100, clickCooldown: 0, calm: 0, storyStep: 0, clicks: Object.fromEntries(Object.keys(clicks).map(k => [k, 0])), resources: Object.fromEntries(Object.keys(names).map(k => [k, 0])), buildings: Object.fromEntries(Object.keys(projects).map(k => [k, 0])), workers: Object.fromEntries(Object.keys(jobs).map(k => [k, 0])), routes: [], expedition: null, events: [], last: Date.now() });
  const techniques={
    sky:{name:'Сутра Пустого Неба',source:'Наследие из храма',desc:'Понимание от медитации +8% за ранг.',effect:'xp',available:s=>s.found},
    stance:{name:'Корни камня',source:'Урок Жэня в деревне',desc:'Тело от кликов +8% за ранг.',effect:'body',available:s=>s.world.mentors.includes('trainer')},
    herb:{name:'Слух зелёных жил',source:'Помощь Линь в лесу',desc:'Травы при исследовании +8% за ранг.',effect:'herbs',available:s=>s.world.mentors.includes('herbalist')},
    breath:{name:'Дыхание тихой реки',source:'Спасение Сэня в лесу',desc:'Энергия от медитации +8% за ранг.',effect:'qi',available:s=>s.world.mentors.includes('breathing')},
    sword:{name:'Меч облачного перевала',source:'Урок Юнь в горах',desc:'Боевая сила +8% за ранг.',effect:'power',available:s=>s.world.mentors.includes('swordsman')},
    grove:{name:'Нефритовый круг',source:'Ученичество в Нефритовой Роще',desc:'Травы при исследовании +8% и энергия медитации +4% за ранг.',effect:'herbs',secondary:'qi',available:s=>s.stage>=2&&s.world.admission==='rescue'},
    cloud:{name:'Возвращающийся клинок',source:'Учёба в Облачном Пределе',desc:'Боевая сила +8% и освоение техники +4% за ранг.',effect:'power',secondary:'mastery',available:s=>s.stage>=2&&['remains','gates'].includes(s.world.admission)},
    seal:{name:'Письмена беззвёздного неба',source:'Архив секты Пустого Неба',desc:'Понимание +8% и энергия медитации +4% за ранг.',effect:'xp',secondary:'qi',available:s=>s.stage>=2&&s.world.admission==='invitation'}
  };
  const fresh = () => ({...baseFresh(), activity:'meditate', world:W.fresh(), cultivation:{active:null,learned:{}}, employment:{completed:0,order:null}});
  const techniqueCost=(s,k)=>({qi:20*2**(s.cultivation.learned[k]?.rank||0),herbs:5*2**(s.cultivation.learned[k]?.rank||0)});
  const techniqueNeeded=rank=>120*2**rank;
  const techniqueBonus=(s,effect)=>{const k=s.cultivation.active,t=techniques[k],rank=s.cultivation.learned[k]?.rank||0;return 1+rank*(t?.effect===effect ? .08 : t?.secondary===effect ? .04 : 0);};
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
  const canAdvance = s => s.stage<7 && s.found && s.realm>=stages[s.stage].realm && (s.wins>=stages[s.stage].wins || (s.stage>0&&W.recognition(s)>=W.recognitionNeeded(s))) && affordable(s,stages[s.stage].cost) && (s.stage>0||s.storyStep>=story.length) && (s.stage!==1||!!s.world.admission);
  function chapterIntro(s){
    const peaceful=s.stage>1&&W.recognition(s,s.stage-1)>=W.recognitionNeeded({stage:s.stage-1});
    if(peaceful&&s.stage===2)return 'Ты принят во внешние ученики. За тебя говорят выполненные поручения и люди, которым ты помог. Доступ к библиотеке и доверие старших ещё предстоит заслужить.';
    if(peaceful&&s.stage===3)return 'Твои знания и помощь объединили небольшую общину. Трое последователей доверили тебе разорённое убежище. Теперь предстоит превратить его в самостоятельную секту.';
    if(peaceful&&s.stage===4)return 'Секта наладила помощь и снабжение долины. Поселения доверили тебе управление городом. Теперь нужны торговля, запасы и устойчивое управление.';
    return stages[s.stage].intro;
  }
  const canActivity=(s,k)=>Object.hasOwn(activities,k)&&activities[k].stage<=s.stage&&(k!=='work'||s.employment.order?.kind==='ledger')&&(!['explore','mission'].includes(k)||(!s.world.journey&&(k==='explore'?['forest','ruins']:['city','mountains']).includes(s.world.location)));
  const activityRunning=s=>canActivity(s,s.activity);
  const canClick = (s,k) => !!clicks[k] && s.clickCooldown<=0 && s.stamina>=clicks[k].stamina && (!clicks[k].body||s.body<10*(s.realm+1)) && (k!=='scout'||(s.stage<2&&!s.found&&!s.world.journey&&s.world.location==='ruins')) && (!['sweep','haul'].includes(k)||(!s.world.journey&&['village','city'].includes(s.world.location)&&s.employment.order?.kind===k&&s.employment.order.progress<orders[k].target));
  function discover(s) { if (!s.found && s.explored >= 600 && s.world.location==='ruins'&&!s.world.journey) { s.found = true; log(s,'Найдена техника Пустого Неба. Накапливай понимание и травы для первого прорыва.'); } }
  function action(s, type, value) {
    if(type==='learn-technique'){if(!canLearn(s,value))return false;spend(s,techniqueCost(s,value));const t=s.cultivation.learned[value]||(s.cultivation.learned[value]={rank:0,progress:0});if(t.rank)t.progress-=techniqueNeeded(t.rank);t.rank++;if(!s.cultivation.active)s.cultivation.active=value;log(s,`Изучена техника: ${techniques[value].name}, ранг ${t.rank}.`);return true;}
    if(type==='equip-technique'){if(!Object.hasOwn(s.cultivation.learned,value))return false;s.cultivation.active=value;return true;}
    if (['travel','encounter','choice','apply-sect'].includes(type)) return W.action(s,type,value,api);
    if(type==='order'){
      if(!canOrder(s,value))return false;s.employment.order={kind:value,progress:0,pay:orderPay(s,value)};
      if(value==='ledger')s.activity='work';
    }else if(type==='claim-order'){
      const order=s.employment.order;if(!order||order.progress<orders[order.kind].target)return false;
      s.resources.gold+=order.pay;s.employment.completed++;log(s,`Заказ выполнен: ${orders[order.kind].name}. Получено ${order.pay} монет.`);s.employment.order=null;
      if(s.activity==='work')s.activity='meditate';
    }else if(type==='cancel-order'){
      if(!s.employment.order)return false;s.employment.order=null;if(s.activity==='work')s.activity='meditate';
    }else if (type === 'click') {
      if (!canClick(s,value)) return false;
      const c=clicks[value];s.stamina-=c.stamina;s.clickCooldown=.6;s.clicks[value]++;
      const mentors=s.world.mentors;
      s.body=Math.min(10*(s.realm+1),s.body+(c.body||0)*W.bonus(s).body*techniqueBonus(s,'body'));s.calm=Math.min(100,s.calm+(c.calm||0));
      s.resources.gold+=c.gold||0;s.resources.herbs+=(c.herbs||0)*(mentors.includes('herbalist')?1.2:1);
      if(s.found){s.xp=Math.min(needed(s),s.xp+(c.xp||0)*(mentors.includes('breathing')?1.1:1)*(mentors.includes('scholar')?1.15:1));s.resources.qi+=c.qi||0;}
      s.explored+=c.explore||0;discover(s);
      if(['sweep','haul'].includes(value))s.employment.order.progress++;
    } else if (type === 'story') {
      const beat=story[s.storyStep];if(s.stage!==0||!beat||!beat.ready(s))return false;
      for(const [k,v] of Object.entries(beat.reward))s.resources[k]+=v;
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
      if (s.cooldown > 0 || battlePower(s) < enemy(s).power) return false;
      log(s, `Победа: ${enemy(s).name}. Твои успехи привлекли внимание более сильных противников.`);
      s.resources.gold += 30 * 1.8 ** s.wins; s.resources.herbs += 10 * (s.wins + 1); s.resources.relics += 1; s.wins++; s.cooldown = 300;
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
      const next = fresh(); next.souls = s.souls + Math.max(1, Math.floor(s.realm / 6)); next.life = s.life + 1; Object.assign(s, next); log(s, 'Новая жизнь началась. Наследие души ускоряет развитие.');
    } else return false;
    return true;
  }
  function advance(s, seconds) {
    let left = Math.max(0, Math.min(seconds, 86400));
    while (left > 0) {
      const dt = Math.min(left, 10, s.world.journey?.remaining || Infinity); left -= dt; const a = activityRunning(s)?activities[s.activity]:{}, mult = speed(s), wb = W.bonus(s);
      s.stamina=Math.min(100,s.stamina+.4*dt);s.clickCooldown=Math.max(0,s.clickCooldown-dt);
      s.calm=Math.min(100,s.calm+(a.calm||0)*dt);
      for (const [k, v] of Object.entries(a.rates || {})) if((k!=='qi'||s.found)&&(s.activity!=='explore'||k!=='relics'||s.world.location==='ruins'))s.resources[k] += v * mult * dt * (k==='gold'&&s.activity==='work'?wb.gold:['herbs','relics'].includes(k)&&s.activity==='explore'?wb[k]:1) * (s.activity==='meditate'&&k==='qi'?techniqueBonus(s,'qi'):s.activity==='explore'&&k==='herbs'?techniqueBonus(s,'herbs'):1);
      if(s.activity==='work'&&s.employment.order?.kind==='ledger')s.employment.order.progress=Math.min(orders.ledger.target,s.employment.order.progress+dt);
      s.mastery = Math.min(10 * (s.realm + 1), s.mastery + (a.mastery || 0) * mult * dt * wb.mastery * techniqueBonus(s,'mastery'));
      const practicing=s.cultivation.learned[s.cultivation.active];if(s.activity==='technique'&&practicing&&practicing.rank<5)practicing.progress=Math.min(techniqueNeeded(practicing.rank),practicing.progress+dt*mult);
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
  }
  function validate(input) {
    const base = fresh(); if (!input || input.version !== 2) throw Error('Неверная версия сохранения');
    for (const k of ['stage', 'realm', 'xp', 'body', 'mastery', 'weapon', 'study', 'explored', 'wins', 'age', 'cooldown', 'souls', 'life', 'population', 'last']) if (!Number.isFinite(input[k]) || input[k] < 0 || input[k] > 1e100) throw Error('Неверные значения');
    for (const k of ['stage', 'realm', 'weapon', 'study', 'wins', 'souls', 'life', 'population']) if (!Number.isInteger(input[k])) throw Error('Неверный уровень');
    const activity=input.activity==='train'?'meditate':input.activity;
    if (input.stage > 7 || input.realm > 100 || input.weapon > 202 || input.study > 10 || input.wins > 100 || typeof input.found !== 'boolean' || !activities[activity] || activities[activity].stage > input.stage || !['balanced', 'swift', 'piercing', 'ward'].includes(input.style)) throw Error('Неверное состояние');
    for (const group of ['resources', 'buildings', 'workers']) for (const k of Object.keys(base[group])) { const v = input[group]?.[k]; if (!Number.isFinite(v) || v < 0 || v > 1e100 || (group !== 'resources' && !Number.isInteger(v))) throw Error('Неверный ресурс'); base[group][k] = v; }
    if (Object.values(base.workers).reduce((a, b) => a + b, 0) > input.population || input.population > 3 + base.buildings.dorm * 3) throw Error('Неверные назначения');
    if (!Array.isArray(input.routes) || input.routes.length > base.buildings.market || input.routes.some(r => !Number.isFinite(r.remaining) || r.remaining <= 0 || r.remaining > 1800)) throw Error('Неверные маршруты');
    if (input.expedition !== null && (!input.expedition || !['portal', 'colonize'].includes(input.expedition.kind) || !Number.isFinite(input.expedition.remaining) || input.expedition.remaining <= 0 || input.expedition.remaining > 14400)) throw Error('Неверная экспедиция');
    // Existing v2 saves acquire the new systems without resetting progression.
    for(const k of ['stamina','clickCooldown','calm','storyStep']) {
      const v=input[k]??(k==='storyStep'&&input.stage>0?story.length:base[k]);
      if(!Number.isFinite(v)||v<0||v>(k==='storyStep'?story.length:k==='clickCooldown'?.6:100)||(k==='storyStep'&&!Number.isInteger(v)))throw Error('Неверное активное развитие');base[k]=v;
    }
    for(const k of Object.keys(clicks)){const v=input.clicks?.[k]??0;if(!Number.isSafeInteger(v)||v<0)throw Error('Неверные действия');base.clicks[k]=v;}
    for (const k of Object.keys(base)) if (!['resources', 'buildings', 'workers', 'events', 'routes', 'expedition', 'stamina', 'clickCooldown', 'calm', 'storyStep', 'clicks', 'world','employment','cultivation','activity'].includes(k)) base[k] = input[k];
    base.activity=activity;
    if(input.employment!==undefined){const e=input.employment;if(!e||!Number.isSafeInteger(e.completed)||e.completed<0)throw Error('Неверная работа');base.employment.completed=e.completed;
      if(e.order!==null){const o=e.order;if(!o||!orders[o.kind]||!Number.isFinite(o.progress)||o.progress<0||o.progress>orders[o.kind].target||!Number.isSafeInteger(o.pay)||o.pay<1||o.pay>50)throw Error('Неверный заказ');base.employment.order={kind:o.kind,progress:o.progress,pay:o.pay};}}
    if(base.activity==='work'&&!base.employment.order)base.activity='meditate';
    base.world=W.validate(input.world,input.stage);
    if(input.cultivation!==undefined){const c=input.cultivation;if(!c||!c.learned||typeof c.learned!=='object'||Array.isArray(c.learned))throw Error('Неверные техники');
      for(const[k,t]of Object.entries(c.learned)){if(!Object.hasOwn(techniques,k)||!t||!Number.isInteger(t.rank)||t.rank<1||t.rank>5||!Number.isFinite(t.progress)||t.progress<0||t.progress>techniqueNeeded(t.rank))throw Error('Неверное освоение');base.cultivation.learned[k]={rank:t.rank,progress:t.progress};}
      if(c.active!==null&&!base.cultivation.learned[c.active])throw Error('Неверная активная техника');base.cultivation.active=c.active;
    }
    base.routes = input.routes.map(r => ({ remaining: r.remaining })); base.expedition = input.expedition ? { kind: input.expedition.kind, remaining: input.expedition.remaining } : null;
    if (!Array.isArray(input.events)) throw Error('Неверная хроника'); base.events = input.events.filter(e => e && typeof e.text === 'string' && Number.isFinite(e.day)).slice(0, 30).map(e => ({ text: e.text.slice(0, 500), day: e.day }));
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
      if(s.realm>=1&&s.wins>=1){title='Первый рубеж пройден';accent='пора выбрать дальнейший путь.';}
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
    const objective=s.stage===0&&story[s.storyStep]?story[s.storyStep].goal:stages[s.stage].subtitle;
    const affiliation=s.stage>=1&&s.world.admission?` · ${W.admissions[s.world.admission].name}`:'';
    return {title,accent,description:`${s.world.journey?'В пути: '+W.locations[s.world.journey.destination].name:'Место: '+place}${affiliation} · ${objective}`};
  }
  const api = { world:W, techniques, techniqueCost, techniqueNeeded, techniqueBonus, canLearn, stages, names, activities, projects, jobs, clicks, orders, orderPay, canOrder, story, canClick, canAdvance, canActivity, activityRunning, fresh, log, speed, needed, power, enemy, battlePower, affordable, buildCost, breakthroughCost, action, advance, validate, realmName, heroHeading, chapterIntro };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Isekai = api;
})(globalThis);
