(function (root) {
  'use strict';
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
    work: { name: 'Работать', stage: 0, desc: 'Мелкие поручения: +12 монет/мин.', rates: { gold: .2 } },
    explore: { name: 'Исследовать руины', stage: 0, desc: 'Травы, осколки и первая находка после 10 минут исследования.', rates: { herbs: .025, relics: 1 / 600 } },
    train: { name: 'Тренировать тело', stage: 0, desc: 'Укрепляет тело и боевую силу. Тело имеет предел для каждой ступени.', body: .01 },
    meditate: { name: 'Медитировать', stage: 0, desc: 'Успокаивает разум. После находки накапливает понимание и духовную энергию.', xp: .05, calm: .02, rates: { qi: .1 } },
    technique: { name: 'Осваивать технику', stage: 1, desc: 'Постепенно усиливает выбранный боевой стиль.', mastery: .01 },
    mission: { name: 'Поручения секты', stage: 2, desc: 'Репутация, монеты и травы. Репутация открывает библиотеку.', rates: { reputation: .025, gold: .15, herbs: .02 } },
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
    breathe: { name: 'Медитировать: один вдох', neutral: 'Короткий анализ', stamina: 2, calm: .2, xp: .12, qi: .25, desc: '+0,2 спокойствия; после находки +0,12 понимания и +0,25 энергии' },
    sweep: { name: 'Подмести двор', neutral: 'Малая операция', stamina: 2, gold: .4, desc: '+0,4 монеты' },
    haul: { name: 'Перенести ящики', neutral: 'Обработка партии', stamina: 4, gold: .7, body: .02, desc: '+0,7 монеты и +0,02 тела' },
    scout: { name: 'Осмотреть развалины', neutral: 'Проверить данные', stamina: 4, explore: 2, herbs: .05, desc: '+2 сек исследования и +0,05 трав' }
  };
  const story = [
    { title: 'Чужое небо', text: 'Последнее, что ты помнишь, — свет фар. Теперь над тобой два бледных солнца. На дороге скрипит телега. Женщина протягивает флягу: «Живой? Тогда помоги поднять колесо. До деревни довезу». Никто не называет тебя избранным.', goal: 'Принять помощь и добраться до деревни.', ready: () => true, reward: { gold: 5, herbs: 5 }, button: 'Подняться и пойти за телегой' },
    { title: 'Работа за место у очага', text: 'Хозяйка постоялого двора Мэй даёт тебе метлу. «За красивые истории не кормят. Подметёшь двор — получишь ужин». У ворот ученики секты смеются над твоей потрёпанной одеждой. Их лёгкие шаги почему-то оставляют трещины в камне.', goal: 'Подмести двор 10 раз или накопить 15 монет любой работой.', ready: s => s.clicks.sweep >= 10 || s.resources.gold >= 15, reward: { gold: 10 }, button: 'Получить первую плату' },
    { title: 'Тело, которое не слушается', text: 'Одного ящика хватает, чтобы руки задрожали. Мэй замечает твой взгляд на учеников: «Начни с ног. Старик у колодца каждое утро приседает и бегает до мостика. Не сила небес, но лучше, чем ничего». Ты решаешь завтра не быть таким же слабым.', goal: 'Развить тело до 2: приседания, бег, перенос ящиков или фоновая тренировка.', ready: s => s.body >= 2, reward: { herbs: 5 }, button: 'Показать, что стал крепче' },
    { title: 'Тишина между вдохами', text: 'Старик у колодца представляется: Жэнь. «В твоём мире всё спешили? Здесь сначала слушай». Он учит считать вдохи. Когда мысли затихают, из заброшенного храма за деревней доносится тонкий звон. Остальные его не слышат.', goal: 'Накопить 5 спокойствия короткими вдохами или фоновым медитированием.', ready: s => s.calm >= 5, reward: { herbs: 3 }, button: 'Рассказать Жэню о звоне' },
    { title: 'Осколок под пеплом', text: 'Жэнь показывает тропу к храму. Под обвалившимся алтарём лежит чёрный осколок. Он теплеет в твоей ладони, и в сознании проступают слова: «Пустое Небо». Это лишь повреждённая первая страница. Но на ней есть путь, которого вчера у тебя не было.', goal: 'Найти технику: 10 минут исследования, ускоряемого осмотром развалин.', ready: s => s.found, reward: { relics: 1 }, button: 'Прочитать первую страницу' },
    { title: 'Первый прорыв', text: 'Травы горчат. Каждый вдох заставляет осколок отвечать слабым теплом. Ты снова и снова теряешь ощущение потока, пока однажды оно не остаётся. Жэнь впервые смотрит на тебя серьёзно: «Теперь это твоя сила. И твоя ответственность».', goal: 'Заполнить понимание, собрать травы и совершить первый прорыв.', ready: s => s.realm >= 1, reward: { herbs: 10 }, button: 'Принять наставление' },
    { title: 'За право идти дальше', text: 'На дороге человек с повязкой Белого Клыка отбирает плату у возчиков. Ты узнаёшь телегу, на которой приехал. На этот раз ты можешь вмешаться. После победы Мэй вручает письмо: через горный перевал набирают новых учеников. А побеждённый обещает, что его старший брат тебя запомнит.', goal: 'Победить дорожного разбойника во вкладке испытаний.', ready: s => s.wins >= 1, reward: { gold: 25 }, button: 'Взять письмо и собраться в путь' }
  ];
  const fresh = () => ({ version: 2, stage: 0, realm: 0, xp: 0, body: 0, mastery: 0, style: 'balanced', weapon: 0, study: 0, found: false, explored: 0, wins: 0, activity: 'work', age: 0, cooldown: 0, souls: 0, life: 1, population: 0, stamina: 100, clickCooldown: 0, calm: 0, storyStep: 0, clicks: Object.fromEntries(Object.keys(clicks).map(k => [k, 0])), resources: Object.fromEntries(Object.keys(names).map(k => [k, 0])), buildings: Object.fromEntries(Object.keys(projects).map(k => [k, 0])), workers: Object.fromEntries(Object.keys(jobs).map(k => [k, 0])), routes: [], expedition: null, events: [], last: Date.now() });
  const log = (s, text) => { s.events.unshift({ text, day: Math.floor(s.age / 3600) + 1 }); s.events = s.events.slice(0, 30); };
  const speed = s => [1, 1, 1, 2, 12, 100, 1000, 10000][s.stage] * (1 + s.souls * .1) * (1 + s.study * .15) * (1 + s.buildings.observatory * .2);
  const needed = s => Math.ceil(60 * 2 ** s.realm);
  const power = s => Math.floor((8 + s.body * 2 + s.mastery * 3 + s.weapon * 12) * 1.55 ** s.realm);
  const enemy = s => ({ name: ['Дорожный разбойник', 'Страж руин', 'Ученик Белого Клыка', 'Первый соперник', 'Внутренний ученик', 'Наследник клана', 'Старейшина соперников', 'Чемпион долины', 'Лорд приграничья', 'Владыка города', 'Хранитель континента', 'Небесный посланник', 'Владыка океанов', 'Страж мирового ядра', 'Звёздный захватчик', 'Лорд спутника', 'Пожиратель миров', 'Страж портала', 'Чемпион звёзд', 'Владыка системы', 'Адмирал пустоты', 'Галактический претендент', 'Хранитель законов', 'Древний бессмертный', 'Судья пространства', 'Страж вечности'][s.wins] || 'Эхо бесконечности', power: Math.floor(18 * 1.75 ** s.wins), type: ['swift', 'armored', 'mystic'][s.wins % 3] });
  const battlePower = s => power(s) * (({ swift: 'swift', armored: 'piercing', mystic: 'ward' })[enemy(s).type] === s.style ? 1.35 : 1);
  const affordable = (s, c) => Object.entries(c).every(([k, v]) => s.resources[k] >= v);
  const spend = (s, c) => Object.entries(c).forEach(([k, v]) => s.resources[k] -= v);
  const buildCost = (s, k) => Object.fromEntries(Object.entries(projects[k].cost).map(([r, v]) => [r, Math.ceil(v * 1.5 ** s.buildings[k])]));
  const breakthroughCost = s => ({ herbs: Math.ceil(10 * 1.45 ** s.realm), ...(s.realm >= 3 ? { relics: Math.ceil(s.realm / 2) } : {}), ...(s.realm >= 6 ? { pills: Math.ceil(s.realm * 2) } : {}) });
  const canAdvance = s => s.stage<7 && s.found && s.realm>=stages[s.stage].realm && s.wins>=stages[s.stage].wins && affordable(s,stages[s.stage].cost) && (s.stage>0||s.storyStep>=story.length);
  const canClick = (s,k) => !!clicks[k] && s.stage < 2 && s.clickCooldown <= 0 && s.stamina >= clicks[k].stamina && (!(clicks[k].body && !clicks[k].gold) || s.body < 10*(s.realm+1)) && (k !== 'breathe' || s.calm < 100 || (s.found && s.xp < needed(s))) && (k !== 'scout' || !s.found);
  function discover(s) { if (!s.found && s.explored >= 600) { s.found = true; log(s,'Найдена техника Пустого Неба. Накапливай понимание и травы для первого прорыва.'); } }
  function action(s, type, value) {
    if (type === 'click') {
      if (!canClick(s,value)) return false;
      const c=clicks[value];s.stamina-=c.stamina;s.clickCooldown=.6;s.clicks[value]++;
      s.body=Math.min(10*(s.realm+1),s.body+(c.body||0));s.calm=Math.min(100,s.calm+(c.calm||0));
      s.resources.gold+=c.gold||0;s.resources.herbs+=c.herbs||0;
      if(s.found){s.xp=Math.min(needed(s),s.xp+(c.xp||0));s.resources.qi+=c.qi||0;}
      s.explored+=c.explore||0;discover(s);
    } else if (type === 'story') {
      const beat=story[s.storyStep];if(s.stage!==0||!beat||!beat.ready(s))return false;
      for(const [k,v] of Object.entries(beat.reward))s.resources[k]+=v;
      log(s,`История: ${beat.title}.`);s.storyStep++;
    } else if (type === 'activity' && activities[value] && activities[value].stage <= s.stage) s.activity = value;
    else if (type === 'style' && s.stage >= 1 && ['balanced', 'swift', 'piercing', 'ward'].includes(value)) s.style = value;
    else if (type === 'advance') {
      const next = stages[s.stage];
      if (!canAdvance(s)) return false;
      spend(s, next.cost); s.stage++; if (s.stage === 3) s.population = 3; log(s, stages[s.stage].intro);
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
      const dt = Math.min(left, 10); left -= dt; const a = activities[s.activity], mult = speed(s);
      s.stamina=Math.min(100,s.stamina+.4*dt);s.clickCooldown=Math.max(0,s.clickCooldown-dt);
      s.calm=Math.min(100,s.calm+(a.calm||0)*dt);
      for (const [k, v] of Object.entries(a.rates || {})) if(k!=='qi'||s.found)s.resources[k] += v * mult * dt;
      s.body = Math.min(10 * (s.realm + 1), s.body + (a.body || 0) * mult * dt);
      s.mastery = Math.min(10 * (s.realm + 1), s.mastery + (a.mastery || 0) * mult * dt);
      if (s.found) s.xp = Math.min(needed(s), s.xp + (a.xp || (s.stage === 0 ? .015 : 0)) * mult * dt);
      if (s.activity === 'explore') { s.explored += dt; discover(s); }
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
      s.age += dt; s.cooldown = Math.max(0, s.cooldown - dt);
    }
  }
  function validate(input) {
    const base = fresh(); if (!input || input.version !== 2) throw Error('Неверная версия сохранения');
    for (const k of ['stage', 'realm', 'xp', 'body', 'mastery', 'weapon', 'study', 'explored', 'wins', 'age', 'cooldown', 'souls', 'life', 'population', 'last']) if (!Number.isFinite(input[k]) || input[k] < 0 || input[k] > 1e100) throw Error('Неверные значения');
    for (const k of ['stage', 'realm', 'weapon', 'study', 'wins', 'souls', 'life', 'population']) if (!Number.isInteger(input[k])) throw Error('Неверный уровень');
    if (input.stage > 7 || input.realm > 100 || input.weapon > 202 || input.study > 10 || input.wins > 100 || typeof input.found !== 'boolean' || !activities[input.activity] || activities[input.activity].stage > input.stage || !['balanced', 'swift', 'piercing', 'ward'].includes(input.style)) throw Error('Неверное состояние');
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
    for (const k of Object.keys(base)) if (!['resources', 'buildings', 'workers', 'events', 'routes', 'expedition', 'stamina', 'clickCooldown', 'calm', 'storyStep', 'clicks'].includes(k)) base[k] = input[k];
    base.routes = input.routes.map(r => ({ remaining: r.remaining })); base.expedition = input.expedition ? { kind: input.expedition.kind, remaining: input.expedition.remaining } : null;
    if (!Array.isArray(input.events)) throw Error('Неверная хроника'); base.events = input.events.filter(e => e && typeof e.text === 'string' && Number.isFinite(e.day)).slice(0, 30).map(e => ({ text: e.text.slice(0, 500), day: e.day }));
    return base;
  }
  const realmName = n => `${['Смертный', 'Пробуждение', 'Сбор энергии', 'Основание', 'Духовное ядро', 'Пробуждение души', 'Небесный путь', 'Звёздный дух', 'Закон пространства'][Math.min(8, Math.floor((n + 2) / 3))]} · ступень ${n}`;
  const api = { stages, names, activities, projects, jobs, clicks, story, canClick, canAdvance, fresh, log, speed, needed, power, enemy, battlePower, affordable, buildCost, breakthroughCost, action, advance, validate, realmName };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Isekai = api;
})(globalThis);
