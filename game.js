(() => {
  'use strict';
  const E = Isekai, KEY = 'isekai-idle-v2', $ = id => document.getElementById(id);
  const L=typeof IsekaiLocale!=='undefined'?IsekaiLocale:null,t=value=>L?L.text(value):value,h=value=>L?L.html(value):value;
  const uiText=(ru,en)=>L?.language==='en'?en:ru;
  const FateTree=typeof IsekaiFateTree!=='undefined'?IsekaiFateTree:(typeof require==='function'?(()=>{try{return require('./fate-tree.js');}catch{return null;}})():null);
  const Alchemy=typeof IsekaiAlchemy!=='undefined'?IsekaiAlchemy:(typeof require==='function'?(()=>{try{return require('./alchemy.js');}catch{return null;}})():null);
  const Sound = typeof IsekaiSound !== 'undefined' ? IsekaiSound : (typeof require === 'function' ? (() => { try { return require('./sound.js'); } catch { return null; } })() : null) || {
    init(){},
    toggle(){ return false; },
    toggleMute(){ return true; },
    isMuted(){ return true; },
    getVolume(){ return 0.4; },
    setVolume(){},
    playBowl(){},
    playSingingBowl(){},
    playBreakthrough(){},
    playParchment(){},
    playClash(){},
    playSwordClash(){},
    playPunch(){},
    playPhysicalStrike(){},
    playVictory(){},
    playVictoryChime(){},
    playTenseDrone(){},
    startQiDrone(){},
    stopQiDrone(){},
    playClick(){},
    playJadeChime(){},
    playTempleBlock(){},
    playTrainingSwoosh(){}
  };
  function updateAudioUi() {
    const toggleBtn = $('audio-toggle');
    const iconSpan = $('audio-icon');
    const volInput = $('audio-volume');
    const isMuted = Sound.isMuted();
    if (toggleBtn) {
      const label = isMuted ? uiText('Звук: выкл.', 'Sound: off') : uiText('Звук: вкл.', 'Sound: on');
      toggleBtn.setAttribute?.('aria-label', label);
      toggleBtn.setAttribute?.('title', label);
      toggleBtn.classList?.toggle?.('audio-active', !isMuted);
    }
    if (iconSpan) {
      iconSpan.textContent = isMuted ? '🔈' : '🔊';
    }
    if (volInput) {
      volInput.value = Math.round(Sound.getVolume() * 100);
      volInput.disabled = isMuted;
    }
  }
  let activeFateTab='story', activeAlchemyTab='cauldron';
  const quotes=typeof IsekaiQuotes!=='undefined'?IsekaiQuotes.createRotator():null;
  const N=IsekaiNames;
  let nameStyle='cultivation',nameOptions=[];
  function refreshNames(){
    nameOptions=N.suggestions(nameStyle,L?.language||'ru');
    $('name-suggestions').innerHTML=nameOptions.map((name,i)=>`<button type="button" data-name-pick="${i}" data-player-name>${name}</button>`).join('');
    document.querySelectorAll('[data-name-style]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.nameStyle===nameStyle)));
  }
  let s = E.fresh(), tab = 'hero', storageWarning = false;
  let saves;
  let returnSummary=null,awaySnapshot=null,awayAt=0;
  let view = 'visual';
  const heroPanels=new Map();
  try { if (localStorage.getItem('isekai-idle-interface') === 'data') view = 'data'; } catch {}
  const getUiPref = k => { try { if (typeof window !== 'undefined' && window.location) return localStorage.getItem(k); } catch {} return null; };
  const setUiPref = (k, v) => { try { if (typeof window !== 'undefined' && window.location) localStorage.setItem(k, v); } catch {} };
  let heroCollapsed = getUiPref('isekai-hero-collapsed') === 'true';
  let novelSerif = getUiPref('isekai-novel-serif') === 'true';
  let novelLarge = getUiPref('isekai-novel-large') === 'true';
  let novelViewStep = null;
  let lastMaintainedActivity = 'meditate';
  let autoResumeRoutine = getUiPref('isekai-auto-resume') === 'true';
  let autoResumeTimer = null;
  let alchemyBatch = 1;
  function applyHeroCollapse() {
    const hero = document.querySelector ? document.querySelector('.hero') : null;
    const toggle = $('hero-collapse-toggle');
    const miniHud = $('mini-hud');
    const resources = $('resources');
    if (hero?.classList) hero.classList.toggle('hero-collapsed', heroCollapsed);
    if (resources?.classList) {
      if (view !== 'data' && heroCollapsed) {
        resources.classList.add('resources-collapsed');
      } else {
        resources.classList.remove('resources-collapsed');
      }
    }
    if (toggle) {
      toggle.setAttribute?.('aria-expanded', String(!heroCollapsed));
      toggle.textContent = heroCollapsed ? '▾' : '▴';
      toggle.title = heroCollapsed ? uiText('Развернуть верхнюю панель', 'Expand top panel') : uiText('Свернуть верхнюю панель', 'Collapse top panel');
    }
    const isScrolled = typeof window !== 'undefined' && ((window.scrollY || 0) > 160 || (window.pageYOffset || 0) > 160);
    if (miniHud) miniHud.hidden = (view === 'data') || !isScrolled;
  }
  if (typeof window !== 'undefined' && window.addEventListener) {
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        scrollTicking = true;
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(() => {
            applyHeroCollapse();
            scrollTicking = false;
          });
        } else {
          applyHeroCollapse();
          scrollTicking = false;
        }
      }
    }, { passive: true });
  }
  function spawnFloating(text, cls, x, y) {
    if (view === 'data') return;
    const layer = $('floating-layer');
    if (!layer || typeof document.createElement !== 'function') return;
    const el = document.createElement('div');
    el.className = `floating-num ${cls || ''}`;
    el.textContent = text;
    const jx = (Math.random() - 0.5) * 20;
    if (el.style) {
      el.style.left = `${Math.max(10, (x || 200) + jx)}px`;
      el.style.top = `${Math.max(10, (y || 200) - 15)}px`;
    }
    layer.appendChild?.(el);
    setTimeout(() => el.remove?.(), 850);
  }
  function resourceRate(k) {
    let rate = 0;
    if (E.activityRunning(s)) {
      const a = E.activities[s.activity] || {};
      const mult = E.speed(s);
      const wb = E.world.bonus(s);
      const v = a.rates?.[k] || 0;
      if (v > 0) {
        if ((k !== 'qi' || s.found) && (s.activity !== 'explore' || k !== 'relics' || s.world.location === 'ruins')) {
          const bonus = (k === 'gold' && s.activity === 'work') ? (wb.gold || 1) :
            (['herbs', 'relics'].includes(k) && s.activity === 'explore') ? (wb[k] || 1) : 1;
          const techBonus = (s.activity === 'meditate' && k === 'qi') ? E.techniqueBonus(s, 'qi') :
            (s.activity === 'explore' && k === 'herbs') ? E.techniqueBonus(s, 'herbs') : 1;
          rate += v * mult * bonus * techBonus;
        }
      }
    }
    if (s.stage >= 3) {
      if (k === 'herbs') rate += (s.workers.herb * 0.04 + s.buildings.garden * 0.06);
      if (k === 'wood') rate += s.workers.lumber * 0.1;
      if (k === 'ore') rate += s.workers.miner * 0.06;
      if (k === 'pills' && s.resources.herbs >= 5 && s.resources.qi >= 10) rate += s.workers.alchemist * 0.005;
      if (k === 'influence') rate += s.workers.disciple * 0.015;
    }
    if (k === 'cosmic' && s.resources.worlds > 0) rate += s.resources.worlds * 0.01;
    return rate;
  }
  function stepDecisionInfo(s, stepIdx) {
    if (stepIdx === 0) {
      const act = s.prologueAction;
      const choice = E.prologueChoices[act];
      if (choice) {
        return {
          title: uiText(choice.name, choice.enName),
          desc: uiText(choice.desc, choice.enDesc),
          detail: uiText('Результат: место на облучке повозки дяди Ба и разговор о постоялом дворе хозяйки Мэй.', 'Outcome: A seat beside Uncle Ba and talk of Hostess Mei’s crossroads inn.')
        };
      }
      return {
        title: uiText('Помощь повозке на тракте', 'Assisting the wagon on the highway'),
        desc: uiText('Ты помог дяде Ба вызволить застрявшую повозку из размытого рва на сухой настил.', 'You helped Uncle Ba free his stuck wagon from the washed-out ditch onto dry road.'),
        detail: uiText('Результат: спасение от ночного холода и путь к постоялому двору Мэй.', 'Outcome: Rescued from the mountain cold, traveling to Lady Mei\'s inn.')
      };
    }
    if (stepIdx === 1) {
      return {
        title: uiText('Уборка двора и пробуждение системы', 'Sweeping the yard & system awakening'),
        desc: uiText('Дядя Ба привёз тебя к хозяйке Мэй. Ты расчистил площадку для повозки от селя тяжёлой бамбуковой метлой. На пике истощения Небесная Жемчужина Яда активировала духовный интерфейс подсказок.', 'Uncle Ba brought you to Hostess Mei. You cleared the yard with her bamboo broom. At the brink of exhaustion, the Sky Poison Pearl awakened your spiritual guidance interface.'),
        detail: uiText('Результат: доверие Мэй, горячая похлёбка, ночлег у очага и инициализация системы.', 'Outcome: Mei’s trust, hot stew, hearth shelter, and spiritual interface initialization.')
      };
    }
    if (stepIdx === 2) {
      const isTech = s.chapterOneTraining === 'technique' || (!s.chapterOneTraining && s.body < 2 && Object.keys(s.cultivation?.learned || {}).length);
      if (isTech) {
        return {
          title: uiText('Путь знания: Изучение техники', 'Path of Knowledge: Technique Mastery'),
          desc: uiText('Вместо слепого подъёма тяжестей ты применил точную траекторию и распределение веса изученной техники. Баланс заменил грубую силу.', 'Instead of brute hauling, you applied the precise balance and weight distribution of your learned technique.'),
          detail: uiText('Результат: рост мастерства без лишнего надрыва заблокированных каналов.', 'Outcome: Mastery growth without overtaxing blocked meridians.')
        };
      }
      return {
        title: uiText('Путь закалки: Упорные упражнения', 'Path of Tempering: Physical Conditioning'),
        desc: uiText('Ты тренировал истощённое тело глубокими приседаниями, пробежками и работой у колодца под наставничеством старика Жэня.', 'You tempered your body with squats, sprints, and wellside conditioning under Old Ren\'s guidance.'),
        detail: uiText('Результат: укрепление сухожилий, рост запаса и восстановления выносливости.', 'Outcome: Hardened tendons and expanded stamina capacity.')
      };
    }
    if (stepIdx === 3) {
      return {
        title: uiText('Тишина между вдохами: Ритм дыхания', 'Silence Between Breaths: Steady Respiration'),
        desc: uiText('Обуздав суетливые мысли, ты восстановил дыхание у колодца. В глубокой тишине Жемчужина Яда уловила вибрирующий звон печати древнего святилища.', 'Stilling turbulent thoughts, you calmed your breath. In deep stillness, the Poison Pearl resonated with the ancient seal in the mountain ruins.'),
        detail: uiText('Результат: достигнуто спокойствие разума, открыт путь к Развалинам храма.', 'Outcome: Deep mental calm achieved, revealing the trail to the Ancient Temple Ruins.')
      };
    }
    if (stepIdx === 4) {
      return {
        title: uiText('Древний алтарь и Сутра Злого Неба', 'Ancient Altar & Evil God Sutra'),
        desc: uiText('В полуразрушенном горном святилище ты очистил алтарь от скверны и нашёл священный осколок Сутры Злого Неба, а также собрал редкие целебные травы.', 'At the ruined sanctuary, you cleansed the corrupted altar, uncovering the Evil God Sutra and gathering rare healing herbs.'),
        detail: uiText('Результат: обретена божественная техника «Путь Пустого Неба» и алхимические ингредиенты.', 'Outcome: Acquired the Evil God technique and purified alchemical ingredients.')
      };
    }
    if (stepIdx === 5) {
      return {
        title: uiText('Сокрушение спазмов: Прорыв на 1-ю ступень', 'Shattering Blockages: Realm 1 Breakthrough'),
        desc: uiText('Жемчужина Яда очистила травы в безупречный 100% эликсир. Мощная волна ци разорвала врождённые спазмы, открыв глубокие каналы.', 'The Poison Pearl refined the herbs into a 100% pure elixir. A surge of qi shattered congenital spasms, opening your profound channels.'),
        detail: uiText('Результат: статус культиватора 1-й ступени (Начальная ступень ци) и взрывной прилив сил.', 'Outcome: Attained Realm 1 (Elementary Qi Cultivator) with surging inner power.')
      };
    }
    if (stepIdx === 6) {
      const route = s.chapterOneRoute;
      if (route === 'combat') {
        return {
          title: uiText('Путь меча: Поединок на мосту', 'Path of Might: Duel at the Bridge'),
          desc: uiText('Ты дал открытый бой главарю вымогателей Белого Клыка на мосту и сокрушил его новой силой открытых каналов.', 'You confronted the White Fang extortionist on the bridge, overpowering him with your unsealed channels.'),
          detail: uiText('Результат: первая боевая победа, спасение повозки дяди Ба и право идти в город.', 'Outcome: First combat victory, saving Uncle Ba’s wagon and earning passage to the city.')
        };
      }
      if (route === 'service') {
        return {
          title: uiText('Путь сплочения: Дорога без потерь', 'Path of Unity: Passage Without Loss'),
          desc: uiText('Жители деревни сплочённо вышли к реке и помогли провести повозку дяди Ба в брод в обход заставы. Бандиты не посмели напасть на людей.', 'United villagers came to the river and helped ferry Uncle Ba’s wagon across the shallows, making the bandits back down without a fight.'),
          detail: uiText('Результат: 3 признания людей, мирный проход обоза и рекомендательный знак хозяйки Мэй.', 'Outcome: 3 community recognitions, peaceful passage, and Mei\'s token.')
        };
      }
      if (route === 'diplomacy') {
        return {
          title: uiText('Слово из архива: Дорожная грамота Вэя', 'Word from the Archive: Wei\'s Charter'),
          desc: uiText('Ты предъявил официальную гербовую грамоту городского архивариуса Вэя, полученную за доставку письма. Застава открыла путь без споров.', 'You presented the official sealed charter from scholar Wei. The checkpoint guards opened the barrier without argument.'),
          detail: uiText('Результат: беспрепятственный проезд через заставу силой городского авторитета.', 'Outcome: Uncontested passage through the roadblock backed by city authority.')
        };
      }
      return {
        title: uiText('Застава на выезде из долины', 'Outpost at the Valley Exit'),
        desc: uiText('Решение конфликта с бандой Белого Клыка на мосту.', 'Resolving the confrontation at the White Fang bridge.'),
        detail: ''
      };
    }
    if (stepIdx === 7) {
      const adm = s.world.admission;
      const sect = E.sectChoices[adm];
      if (sect) {
        return {
          title: uiText(`Клятва верности: ${sect.name}`, `Disciple Oath: ${sect.enName}`),
          desc: uiText(`${sect.role}. ${sect.desc}`, `${sect.enRole}. ${sect.enDesc}`),
          detail: uiText(`Стартовый дар школы: ${sect.gift}. Ты принят в адепты великой секты!`, `Sect gift: ${sect.enGift}. You are welcomed as a disciple!`)
        };
      }
      return {
        title: uiText('Великий набор у городских ворот', 'Grand Recruitment at City Gates'),
        desc: uiText('Выбор одной из четырёх сект Долины Плывущих Облаков.', 'Choosing one of the four great sects of the valley.'),
        detail: ''
      };
    }
    return null;
  }
  function novelStepperHtml(st, activeStep) {
    if (st.stage > 1) return '';
    if (st.stage === 1) {
      const curStep = st.chapterTwoStep || 0;
      const viewing = (activeStep !== undefined && activeStep !== null && activeStep <= curStep) ? activeStep : (novelViewStep !== null && novelViewStep <= curStep ? novelViewStep : curStep);
      const stepLabels = [
        uiText('Врата', 'Gates'),
        uiText('Труд', 'Labor'),
        uiText('Смотр', 'Exam'),
        uiText('Вызов', 'Duel'),
        uiText('Архив', 'Archive'),
        uiText('Турнир', 'Tournament')
      ];
      const steps = stepLabels.map((lbl, idx) => {
        const isPast = idx < curStep;
        const isCurrent = idx === curStep;
        const isViewing = idx === viewing;
        const cls = [
          isPast ? 'step-done' : isCurrent ? 'step-active' : 'step-locked',
          isViewing ? 'step-selected' : ''
        ].filter(Boolean).join(' ');
        const mark = isPast ? '✓' : isCurrent ? '●' : String(idx + 1);
        const isClickable = idx <= curStep;
        if (isClickable) {
          const titleHint = isCurrent
            ? uiText('Текущий эпизод (активный)', 'Current episode (active)')
            : uiText(`Прочитать архив: Эпизод ${idx + 1} (${lbl})`, `Read archive: Episode ${idx + 1} (${lbl})`);
          return `<button type="button" class="novel-step ${cls}" data-novel-step="${idx}" title="${titleHint}"><span class="novel-step-icon">${mark}</span><span class="novel-step-label">${lbl}</span></button>`;
        }
        return `<div class="novel-step ${cls}"><span class="novel-step-icon">${mark}</span><span class="novel-step-label">${lbl}</span></div>`;
      }).join('<div class="novel-step-line" aria-hidden="true"></div>');
      return `<nav class="novel-stepper" aria-label="${uiText('Шаги второй главы', 'Second chapter steps')}">${steps}</nav>`;
    }
    const curStep = st.storyStep;
    const viewing = (activeStep !== undefined && activeStep !== null && activeStep <= curStep) ? activeStep : (novelViewStep !== null && novelViewStep <= curStep ? novelViewStep : curStep);
    const stepLabels = [
      uiText('Пролог', 'Prologue'),
      uiText('Двор', 'Yard'),
      uiText('Закалка', 'Body'),
      uiText('Медитация', 'Meditation'),
      uiText('Святилище', 'Ruins'),
      uiText('Прорыв', 'Breakthrough'),
      uiText('Застава', 'Roadblock'),
      uiText('Секта', 'Sect')
    ];
    const steps = stepLabels.map((lbl, idx) => {
      const isPast = idx < curStep;
      const isCurrent = idx === curStep;
      const isViewing = idx === viewing;
      const cls = [
        isPast ? 'step-done' : isCurrent ? 'step-active' : 'step-locked',
        isViewing ? 'step-selected' : ''
      ].filter(Boolean).join(' ');
      const mark = isPast ? '✓' : isCurrent ? '●' : String(idx + 1);
      const isClickable = idx <= curStep;
      if (isClickable) {
        const titleHint = isCurrent
          ? uiText('Текущая глава (активная)', 'Current chapter (active)')
          : uiText(`Прочитать архив: Глава ${idx + 1} (${lbl})`, `Read archive: Chapter ${idx + 1} (${lbl})`);
        return `<button type="button" class="novel-step ${cls}" data-novel-step="${idx}" title="${titleHint}"><span class="novel-step-icon">${mark}</span><span class="novel-step-label">${lbl}</span></button>`;
      }
      return `<div class="novel-step ${cls}"><span class="novel-step-icon">${mark}</span><span class="novel-step-label">${lbl}</span></div>`;
    }).join('<div class="novel-step-line" aria-hidden="true"></div>');
    return `<nav class="novel-stepper" aria-label="${uiText('Шаги первой главы', 'First chapter steps')}">${steps}</nav>`;
  }
  function tabBadgeHtml(id) {
    if (view === 'data') return '';
    if (id === 'hero') {
      const btReady = s.found && s.xp >= E.needed(s) && E.affordable(s, E.breakthroughCost(s));
      const stReady = s.stage === 0 ? E.storyBeat(s)?.ready(s) : (s.stage === 1 && E.chapterTwo ? E.chapterTwo.isReady(s, s.chapterTwoStep) : false);
      if (btReady || stReady) return ` <span class="tab-badge badge-gold" title="${uiText('Готово действие', 'Action ready')}">●</span>`;
    }
    if (id === 'combat') {
      if (s.cooldown === 0 && E.battlePower(s) >= E.enemy(s).power) {
        return ` <span class="tab-badge badge-red" title="${uiText('Доступен бой', 'Battle ready')}">⚔</span>`;
      }
    }
    if (id === 'world') {
      if (s.world.encounter) {
        return ` <span class="tab-badge badge-blue" title="${uiText('Событие', 'Encounter ready')}">!</span>`;
      }
    }
    return '';
  }
  function applyNovelTypography() {
    const panels = document.querySelectorAll ? document.querySelectorAll('.story-novel-panel') : [];
    panels.forEach?.(p => {
      p.classList?.toggle('novel-serif', novelSerif);
      p.classList?.toggle('novel-large', novelLarge);
    });
  }
  function applyView() {
    document.documentElement.dataset.interface = view;
    document.title = t(view === 'data' ? 'Сводные данные' : 'Isekai Idle — новая жизнь');
    document.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
  }
  try { const raw = localStorage.getItem(KEY); if (raw) s = E.validate(JSON.parse(raw)); else if (localStorage.getItem('isekai-idle-v1')) storageWarning = true; } catch { storageWarning = true; }
  const fmt = n => n.toLocaleString(L?.locale||'ru-RU', { maximumFractionDigits: n < 10 ? 2 : 0 });
  let seenMilestones=new Set(Object.keys(s.achievements.earned));
  const duration = seconds => seconds >= 3600 ? `${fmt(seconds / 3600)} ч` : `${Math.ceil(seconds / 60)} мин`;
  const costs = c => Object.entries(c).map(([k, v]) => `${fmt(v)} ${E.names[k]}`).join(' · ');
  const button = (type, value, text, enabled = true) => {
    const control=`<button data-action="${type}" data-value="${value}" ${enabled && (type !== 'advance' || E.canAdvance(s)) && (type !== 'activity' || E.canActivity(s,value)) && (type !== 'fight' || E.canFight(s)) ? '' : 'disabled'}>${text}</button>`;
    const hint=E.guidance(s,type,value,L?.language||'ru');
    return hint?`<div class="action-control">${control}<small class="action-hint">${hint}</small></div>`:control;
  };
  const sectEmblems = {
    rescue: `<svg viewBox="0 0 48 48" class="sect-emblem-svg sect-emblem-rescue" aria-hidden="true"><circle cx="24" cy="24" r="20" stroke="#10b981" stroke-width="1.5" stroke-dasharray="5 3" fill="none" opacity="0.4"/><circle cx="24" cy="24" r="16" stroke="#10b981" stroke-width="1.8" fill="rgba(16,185,129,0.08)"/><circle cx="24" cy="9" r="2" fill="#34d399"/><circle cx="39" cy="24" r="1.5" fill="#34d399" opacity="0.8"/><circle cx="9" cy="24" r="1.5" fill="#34d399" opacity="0.8"/><path d="M24 13 C29 18, 32 24, 30 31 C28 35, 24 37, 24 37 C24 37, 20 35, 18 31 C16 24, 19 18, 24 13 Z" fill="#10b981" opacity="0.85"/><path d="M24 16 L24 35 M24 23 L28 20 M24 27 L20 24 M24 30 L27 28" stroke="#d1fae5" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    remains: `<svg viewBox="0 0 48 48" class="sect-emblem-svg sect-emblem-remains" aria-hidden="true"><circle cx="24" cy="24" r="20" stroke="#38bdf8" stroke-width="1.5" fill="rgba(56,189,248,0.06)" opacity="0.4"/><path d="M11 36 C10 32, 13 29, 16 29 C17 26, 21 25, 24 27 C27 25, 31 26, 32 29 C35 29, 38 32, 37 36 Z" fill="rgba(56,189,248,0.25)" stroke="#38bdf8" stroke-width="1.2"/><path d="M24 8 L27 18 L25.5 32 L22.5 32 L21 18 Z" fill="#38bdf8"/><path d="M24 8 L24 32" stroke="#e0f2fe" stroke-width="1"/><path d="M19 32 L29 32" stroke="#bae6fd" stroke-width="2" stroke-linecap="round"/><path d="M24 32 L24 38" stroke="#7dd3fc" stroke-width="2"/><circle cx="24" cy="39" r="1.5" fill="#38bdf8"/><circle cx="24" cy="6" r="1.5" fill="#e0f2fe"/><circle cx="16" cy="16" r="1" fill="#7dd3fc" opacity="0.8"/><circle cx="32" cy="16" r="1" fill="#7dd3fc" opacity="0.8"/></svg>`,
    invitation: `<svg viewBox="0 0 48 48" class="sect-emblem-svg sect-emblem-invitation" aria-hidden="true"><polygon points="16,6 32,6 42,16 42,32 32,42 16,42 6,32 6,16" stroke="#a855f7" stroke-width="1.8" fill="rgba(168,85,247,0.08)"/><polygon points="18,10 30,10 38,18 38,30 30,38 18,38 10,30 10,18" stroke="#c084fc" stroke-width="1" stroke-dasharray="3 2" fill="none" opacity="0.7"/><circle cx="24" cy="24" r="8" stroke="#e9d5ff" stroke-width="1.2" fill="rgba(168,85,247,0.25)"/><circle cx="24" cy="24" r="3.5" fill="#f3e8ff"/><line x1="24" y1="7" x2="24" y2="10" stroke="#c084fc" stroke-width="1.5"/><line x1="24" y1="38" x2="24" y2="41" stroke="#c084fc" stroke-width="1.5"/><line x1="7" y1="24" x2="10" y2="24" stroke="#c084fc" stroke-width="1.5"/><line x1="38" y1="24" x2="41" y2="24" stroke="#c084fc" stroke-width="1.5"/></svg>`,
    gates: `<svg viewBox="0 0 48 48" class="sect-emblem-svg sect-emblem-gates" aria-hidden="true"><circle cx="24" cy="24" r="20" stroke="#f59e0b" stroke-width="1.5" fill="rgba(245,158,11,0.08)" opacity="0.4"/><path d="M8 36 L17 18 L24 28 L31 18 L40 36 Z" fill="rgba(245,158,11,0.2)" stroke="#b45309" stroke-width="1"/><path d="M12 18 L36 18 L38 21 L10 21 Z" fill="#f59e0b"/><path d="M14 21 L18 21 L18 38 L14 38 Z" fill="#fbbf24" stroke="#d97706" stroke-width="0.8"/><path d="M30 21 L34 21 L34 38 L30 38 Z" fill="#fbbf24" stroke="#d97706" stroke-width="0.8"/><path d="M18 25 L30 25 L30 38 L18 38 Z" fill="rgba(245,158,11,0.15)"/><path d="M10 18 L24 10 L38 18 Z" fill="none" stroke="#f59e0b" stroke-width="1.8"/><circle cx="24" cy="15" r="2" fill="#fef3c7"/></svg>`
  };
  const tabGlyphs = {
    hero: '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 2 L12.4 7.6 L18 10 L12.4 12.4 L10 18 L7.6 12.4 L2 10 L7.6 7.6 Z"/></svg>',
    combat: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 16 L14 6 M16 4 L14 6 M11 5 L15 9 M3 17 L5 15 M16 16 L6 6 M4 4 L6 6 M9 5 L5 9 M17 17 L15 15"/></svg>',
    world: '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" stroke-width="1.5"/><polygon points="10,4.5 12,9.5 10,8.5 8,9.5"/><polygon points="10,15.5 8,10.5 10,11.5 12,10.5" opacity="0.6"/><polygon points="15.5,10 10.5,8 11.5,10 10.5,12" opacity="0.6"/><polygon points="4.5,10 9.5,12 8.5,10 9.5,8" opacity="0.6"/></svg>',
    sect: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M2 7 C5 5.5 15 5.5 18 7 M5 7 L5 17 M15 7 L15 17 M4 11 L16 11 M8 4 L12 4 L10 2 Z M8 17 L12 17"/></svg>',
    city: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M3 17 L17 17 M4 7.5 L10 3.5 L16 7.5 M6 7.5 L6 17 M10 7.5 L10 17 M14 7.5 L14 17 M2 7.5 L18 7.5"/></svg>',
    planet: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="10" cy="10" r="5"/><ellipse cx="10" cy="10" rx="9" ry="3.5" transform="rotate(-25 10 10)"/></svg>',
    galaxy: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="2" fill="currentColor"/><path d="M10 5 C14 5 17 8 16 11 C15 14 11 16 8 15 C5 14 3 11 4 8 C5 5 9 4 11 5"/></svg>',
    legacy: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><polygon points="10,2 17,7 10,18 3,7"/><line x1="3" y1="7" x2="17" y2="7"/><polyline points="3,7 10,11 17,7"/><line x1="10" y1="11" x2="10" y2="18"/></svg>',
    roadmap: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M5 4 C3.5 4 3.5 6 5 6 L14 6 C15.5 6 15.5 4 14 4 Z M5 6 L5 16 C3.5 16 3.5 14 5 14 L14 14 C15.5 14 15.5 16 14 16 L14 6 M7 9 L12 9 M7 12 L11 12"/></svg>'
  };
  const resourceGlyphs = { gold: '🪙', herbs: '🌿', qi: '✧', relics: '⟡', reputation: '⛩', wood: '🪵', ore: '⛏', pills: '💊', influence: '🏛', supplies: '📦', cosmic: '🌌', worlds: '🌐' };
  const card = (title, desc, controls, cost = '', extraClass = '', emblem = '') => `<article class="card${extraClass ? ' ' + extraClass : ''}">${emblem ? `<div class="sect-card-emblem">${emblem}</div>` : ''}<h3>${title}</h3><p>${desc}</p>${cost ? `<div class="cost">${cost}</div>` : ''}${controls}</article>`;
  let toastTimer;
  function toast(text) { $('toast').textContent = t(text); $('toast').style.display = 'block'; clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').style.display = 'none', 4500); }
  function save(manual = false) { try { localStorage.setItem(KEY, JSON.stringify(s)); if (manual) toast('Прогресс сохранён'); } catch { if (manual) toast('Не удалось сохранить. Используй экспорт.'); } }
  function tick() { const now = Date.now(),elapsed=Math.max(0,(now-s.last)/1000);const pending=!s.playerName&&s.age===0&&s.storyStep===0,before=elapsed>=60&&!pending&&!awaySnapshot?E.returnReport.snapshot(s):null;E.advance(s,pending?0:elapsed);s.last=now;if(s.activity&&s.activity!=='rest')lastMaintainedActivity=s.activity;if(before)returnSummary={before,after:E.returnReport.snapshot(s),elapsed};return pending?0:elapsed; }
  function returnSummaryView(){
    if(!returnSummary)return '';const r=E.returnReport.describe(E,returnSummary.before,returnSummary.after,returnSummary.elapsed,L?.language||'ru'),escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),num=v=>v.toLocaleString(L?.locale||'ru-RU',{maximumFractionDigits:3}),time=v=>`${Math.ceil(v/60)} ${uiText('мин','min')}`;
    return `<section class="return-report" aria-label="${uiText('Отчёт после возвращения','Return report')}"><div class="section-head"><h2>${uiText('Пока тебя не было','While you were away')}</h2><button id="dismiss-return-report">${uiText('Понятно','Dismiss')}</button></div><p>${escape(r.activity)} · ${time(r.elapsed)}${r.elapsed-r.simulated>1?` · ${uiText('Учтено','Simulated')}: ${time(r.simulated)} (${uiText('до 24 ч за один офлайн-период','up to 24 h per offline period')})`:''}</p><details open><summary>${uiText('Изменения запасов и развития','Resource and progression changes')}</summary>${r.changes.length?`<table class="data-table"><tbody>${r.changes.map(c=>`<tr><th scope="row">${escape(c.label)}</th><td>${c.delta>0?'+':''}${num(c.delta)}</td></tr>`).join('')}</tbody></table>`:`<p>${uiText('Запасы и развитие не изменились.','Resources and progression did not change.')}</p>`}</details><p>${r.reasons.map(escape).join(' ')}</p>${r.opportunities.length?`<details open><summary>${uiText('Возможности к возвращению','Opportunities on return')}</summary><ul>${r.opportunities.map(v=>`<li>${escape(v)}</li>`).join('')}</ul></details>`:''}<small>${r.safety}</small></section>`;
  }
  function developmentView(){
    if(s.stage!==0||s.storyStep===0)return '';
    const paths=E.world.developmentPaths?.(s,L?.language||'ru')||[];
    return `<section class="development-paths"><h3>${uiText('Твой способ стать сильнее','Your way to grow stronger')}</h3><p class="intro">${uiText('Это возможности, а не выбор класса. Совмещай работу, знания и тренировки; знакомства открывают новые способы развития.','These are opportunities, not a class choice. Combine work, knowledge and training; contacts open new ways to grow.')}</p><div class="cards">${paths.map(p=>card(p.name,p.description+`<span class="path-next">${p.next}</span>`,`<button data-tab="world">${uiText('Искать встречи','Look for encounters')}</button>`,`${p.progress}/${p.total}`)).join('')}</div></section>`;
  }
  function peopleView(){
    const people=E.world.memory?.people(s,L?.language||'ru')||[];
    if(!people.length)return '';
    return `<section class="people-panel"><h3>${uiText('Знакомые и твои поступки','People and your deeds')}</h3><p class="intro">${uiText('Люди помнят помощь, выполненные обещания и ваши разногласия. Новые возможности появляются после встреч.','People remember help, kept promises and disagreements. New opportunities appear after meetings.')}</p><div class="cards">${people.map(p=>card(p.name,`${p.role} · ${t(E.world.locations[p.location]?.name||p.location)}<br>${p.status}<details><summary>${uiText('Что помнит знакомый','What they remember')}</summary>${(p.memories||[]).map(m=>`<p>${m}</p>`).join('')}</details>`,'')).join('')}</div></section>`;
  }
  function achievementsView(){
    const list=E.achievements.list(s,L?.language||'ru'),earned=list.filter(a=>a.earned),goals=E.achievements.upcoming(s,L?.language||'ru');
    const actions=E.achievementActions(s);
    return `<section class="milestones"><h3>${uiText('Маленькие победы','Small victories')} · ${earned.length}/${list.length}</h3><p class="intro">${uiText('За реальные поступки, без отдельного получения награды. Достижения сохраняются после гибели и перерождения.','Earned through real deeds, with no separate reward claim. Achievements survive death and rebirth.')}</p><div class="cards">${goals.map(a=>card('◇ '+a.name,a.description,'')).join('')}</div>${earned.length?`<details><summary>${uiText('Твои достижения','Your achievements')} (${earned.length})</summary><div class="cards">${earned.map(a=>card('✓ '+a.name,a.description,'')).join('')}</div></details>`:''}${actions.map(a=>card(a.name[L?.language==='en'?1:0],a.description[L?.language==='en'?1:0],button('achievement-action',a.id,uiText('Выполнить','Perform'),a.enabled),s.achievements.cooldowns[a.id]>0?uiText(`Восстановление: ${Math.ceil(s.achievements.cooldowns[a.id])} сек.`,`Recovery: ${Math.ceil(s.achievements.cooldowns[a.id])} s.`):'')).join('')}</section>`;
  }
  function challengesView(){const lang=L?.language||'ru',r=s.achievements.run,status={available:uiText('Не выбран','Not selected'),active:uiText('Соблюдается','Active'),failed:uiText('Нарушен','Failed'),complete:uiText('Завершён','Complete')};return `<section class="milestones"><h3>${uiText('Необычные пути и обеты','Unusual paths and vows')}</h3><p>${E.achievements.challengeHint(s,lang)}</p><div class="cards">${E.achievements.challenges(s,lang).map(a=>card(a.name,a.description,button('choose-vow',a.id,uiText('Принять обет','Take the vow'),a.enabled),status[a.status])).join('')}</div><details><summary>${uiText('Достижения за особые прохождения','Unusual playthrough achievements')}</summary><div class="cards">${E.achievements.list(s,lang).filter(a=>a.special).map(a=>card((a.earned?'✓ ':'◇ ')+a.name,a.description,'')).join('')}</div></details></section>`;}
  function encounterChoiceView(scene,c){
    const explanation=E.choiceExplanation(s,scene,c,L?.language||'ru');
    const labels={intent:uiText('Намерение','Intent'),cost:uiText('Потребуется','Cost'),risk:uiText('Риск','Risk'),benefit:uiText('Польза','Benefit'),relationship:uiText('Отношения','Relationships'),requirement:uiText('Условия','Requirements')};
    return `<article class="card encounter-choice ${c.danger&&!c.riskCue&&E.power(s)<c.danger?'dangerous-choice':''}"><h3>${E.world.sceneText(c,'label',L?.language)}</h3><dl class="choice-explanation">${Object.entries(labels).filter(([key])=>explanation[key]).map(([key,label])=>`<div class="choice-${key}"><dt>${label}</dt><dd>${explanation[key]}</dd></div>`).join('')}</dl>${button('choice',c.id,c.danger?uiText('Принять риск','Accept the risk'):uiText('Выбрать','Choose'),explanation.available)}</article>`;
  }
  function techniqueActionsView(){
    const actions=E.techniqueActions?.(s,L?.language||'ru')||[];
    if(!actions.length)return '';
    return `<section class="technique-actions"><h3>${uiText('Применить знания','Put your knowledge to use')}</h3><p class="intro">${uiText('Приёмы для текущего места. Выбери нужную активную технику; применение прерывает фоновое занятие.','Methods for your current location. Equip the required technique; using a method interrupts your background activity.')}</p><div class="cards">${actions.map(a=>card(a.name,`${t(E.techniques[a.technique].name)}. ${a.description}`,button('technique-action',a.id,uiText('Выполнить приём','Use method'),a.enabled)+(s.cultivation.active!==a.technique?button('equip-technique',a.technique,uiText('Выбрать эту технику','Equip this technique')):''),a.hint)).join('')}</div></section>`;
  }
  let mapZoom=1,mapPendingOnly=false,noteSelection=null,showMapSecrets=true;
  try{if(localStorage.getItem('isekai-show-map-secrets')==='false')showMapSecrets=false;}catch{}
  function placeJournal(place){const en=L?.language==='en',r=E.atlas.journal(s,E,place,L?.language||'ru');return `<div class="place-journal"><strong>${en?'Recorded observations':'Записанные наблюдения'}</strong><p>${r.summary}</p>${r.people.length?`<p><b>${en?'People met here':'Знакомые здесь'}:</b> ${r.people.map(p=>`${p.name} (${p.role})`).join('; ')}</p>`:''}${r.resources.length?`<p><b>${en?'Finds and rewards obtained here':'Здесь находил и получал'}:</b> ${r.resources.join(', ')}</p>`:''}${r.facts.map(f=>`<p>${f}</p>`).join('')}</div>`;}
  function centerMap(targetId){
    const id=targetId||s.world.location;
    const node=E.world.map(s).nodes.find(n=>n.id===id),v=$('map-viewport');
    if(node){v.scrollLeft=Math.max(0,(node.x+105)*mapZoom-(v.clientWidth||800)/2);v.scrollTop=Math.max(0,(node.y+70)*mapZoom-(v.clientHeight||500)/2);}
  }
  function zoomMap(value,anchor){
    const v=$('map-viewport'),old=mapZoom,x=anchor?.[0]??(v.clientWidth||800)/2,y=anchor?.[1]??(v.clientHeight||500)/2;
    mapZoom=Math.max(.45,Math.min(1.6,value));
    const left=((v.scrollLeft||0)+x)/old*mapZoom-x,top=((v.scrollTop||0)+y)/old*mapZoom-y;
    renderMap();v.scrollLeft=Math.max(0,left);v.scrollTop=Math.max(0,top);
  }
  function renderMap(){
    const language=L?.language||'ru',en=language==='en',map=E.world.map(s,language),viewport=$('map-viewport');
    const canvas=$('map-canvas'),openNodes=Array.from(canvas.querySelectorAll?.('details[open]')||[]).map(node=>node.closest('[data-map-node]')?.dataset.mapNode);
    const sidebarOpen=Array.from($('map-intelligence').querySelectorAll?.('details')||[]).map(node=>node.open);
    const focused=document.activeElement,focus=canvas.contains?.(focused)?{action:focused?.dataset?.action,value:focused?.dataset?.value,node:focused?.closest?.('[data-map-node]')?.dataset.mapNode,summary:focused?.tagName==='SUMMARY'}:null;
    const scroll=[viewport.scrollLeft||0,viewport.scrollTop||0],byId=new Map(map.nodes.map(n=>[n.id,n]));
    const width=map.width||1200,height=map.height||900;
    const nodeVisible=node=>!mapPendingOnly||node.kind==='location'||node.pending||s.atlas.pins.includes(node.id);
    const svgDefs = `<defs><linearGradient id="inkMtnGrad1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#244238" stop-opacity="0.65"/><stop offset="100%" stop-color="#0c1815" stop-opacity="0.05"/></linearGradient><linearGradient id="inkMtnGrad2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#325a4c" stop-opacity="0.75"/><stop offset="100%" stop-color="#0c1815" stop-opacity="0.1"/></linearGradient></defs>`;
    const mountainPaths = `<g class="map-ink-mountains" opacity="0.35" stroke="none"><path class="ink-mountain" fill="url(#inkMtnGrad1)" d="M 680 340 L 760 180 L 820 250 L 910 130 L 1020 290 L 960 340 Z"/><path class="ink-mountain" fill="url(#inkMtnGrad2)" d="M 440 220 L 510 120 L 580 200 L 650 110 L 720 230 Z"/><path class="ink-mountain" fill="url(#inkMtnGrad1)" d="M 120 480 L 210 320 L 280 410 L 360 270 L 460 470 Z"/></g>`;
    const riverVein = `<g class="map-river-vein" aria-hidden="true"><path class="map-river-vein-glow" d="M 80 130 Q 300 230 460 340 T 800 420 T 1140 680" fill="none" stroke="#38bdf8" stroke-width="7" stroke-opacity="0.12" stroke-linecap="round"/><path class="map-river-vein-core" d="M 80 130 Q 300 230 460 340 T 800 420 T 1140 680" fill="none" stroke="#7dd3fc" stroke-width="2" stroke-opacity="0.38" stroke-dasharray="9 13"/></g>`;
    const baguaCompass = `<g class="map-bagua-compass" transform="translate(1080, 80)" aria-hidden="true"><circle cx="0" cy="0" r="32" fill="rgba(14,28,24,0.85)" stroke="#e5c382" stroke-width="1.5" stroke-opacity="0.7"/><circle cx="0" cy="0" r="28" fill="none" stroke="#e5c382" stroke-width="0.8" stroke-dasharray="3 3" stroke-opacity="0.5"/><text x="0" y="-16" text-anchor="middle" fill="#e5c382" font-size="11" font-family="serif" font-weight="bold">北</text><text x="0" y="24" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="serif">南</text><text x="20" y="4" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="serif">东</text><text x="-20" y="4" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="serif">西</text><circle cx="0" cy="0" r="4" fill="#e5c382"/></g>`;
    const dragonVeins = `<path class="map-dragon-vein vein-yin" d="M 285 285 Q 430 150 585 140 T 820 220"/><path class="map-dragon-vein vein-yang" d="M 285 285 Q 400 370 530 285 T 775 285"/>`;
    const edges=map.edges.map(edge=>{const from=byId.get(edge.from),to=byId.get(edge.to);return from&&to?`<line class="${to.locked?'map-blocked':E.atlas.trail(s,to.id)?'map-trail':''}" x1="${from.x+78}" y1="${from.y+45}" x2="${to.x+78}" y2="${to.y+45}"/>`:'';}).join('');
    let journeyLine = '';
    let travelerHtml = '';
    let journeyStatus = '';
    let roadEventHtml = '';
    if (s.world.journey) {
      const j = s.world.journey;
      const fromNode = byId.get(s.world.location);
      const toNode = byId.get(j.destination);
      const totalTime = E.world.travelTime(s, j.destination);
      const ratio = Math.max(0, Math.min(1, 1 - (j.remaining / Math.max(1, totalTime))));
      if (fromNode && toNode) {
        const x1 = fromNode.x + 78, y1 = fromNode.y + 45;
        const x2 = toNode.x + 78, y2 = toNode.y + 45;
        journeyLine = `<line class="map-road-active-glow" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><line class="map-road-active" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
        const curX = Math.round(x1 + (x2 - x1) * ratio);
        const curY = Math.round(y1 + (y2 - y1) * ratio);
        const isWagon = s.world.location === 'village' || j.destination === 'village' || j.destination === 'city';
        const avatarTitle = isWagon ? (en ? 'Uncle Ba’s Wagon' : 'Повозка дяди Ба') : (en ? 'Foot cultivator' : 'Пеший путник');
        travelerHtml = `<div class="map-traveler-avatar ${isWagon ? 'traveler-wagon' : 'traveler-foot'}" style="left:${curX}px;top:${curY}px" title="${avatarTitle}"><div class="traveler-pin"><span class="traveler-icon" aria-hidden="true">${isWagon ? '🐎' : '🏃'}</span><span class="traveler-badge">${Math.ceil(j.remaining)}${en ? 's' : 'с'}</span></div><div class="traveler-ripple" aria-hidden="true"></div></div>`;

        const roadEvt = E.world.roadEvent ? E.world.roadEvent(s, language) : null;
        if (roadEvt) {
          const roadX = Math.round(curX + 22);
          const roadY = Math.max(20, Math.round(curY - 32));
          roadEventHtml = `<div class="map-road-event-bubble" style="left:${roadX}px;top:${roadY}px"><div class="road-event-header"><span class="road-event-icon" aria-hidden="true">${roadEvt.icon}</span><strong>${roadEvt.title}</strong></div><p class="road-event-desc">${roadEvt.desc}</p><button type="button" class="map-road-event-btn" data-road-event="claim">${en ? '✦ Wayside stop' : '✦ Свернуть к обочине'} (${roadEvt.effectText})</button></div>`;
        }
      }
      const destName = t(E.world.locations[j.destination]?.name || j.destination);
      journeyStatus = en ? ` In transit to ${destName}: ${Math.ceil(j.remaining)}s remaining.` : ` В пути (${destName}): осталось ${Math.ceil(j.remaining)} сек.`;
    }
    const celestial = E.world.celestialPhenomenon ? E.world.celestialPhenomenon(s, language) : null;
    const celestialBeaconHtml = celestial ? `<div class="map-celestial-beacon ${celestial.aura||''}" style="left:570px;top:28px" title="${celestial.name} · ${celestial.effect}"><span class="beacon-pulse" aria-hidden="true"></span><span class="beacon-icon" aria-hidden="true">${celestial.icon}</span><span class="beacon-title">${celestial.name}</span><span class="beacon-badge">${celestial.remaining}${en?'s':'с'}</span></div>` : '';
    const celestialCardHtml = celestial ? `<div class="map-celestial-card"><div class="map-celestial-head"><span class="celestial-badge-icon" aria-hidden="true">${celestial.icon}</span><div class="celestial-titles"><strong class="celestial-name">${celestial.name}</strong><small class="celestial-effect">${celestial.effect}</small></div></div><p class="celestial-desc">${celestial.desc}</p><div class="celestial-timer"><span class="timer-label">${en?'Tide shift in:':'Смена прилива через:'}</span> <strong>${celestial.remaining} ${en?'s':'сек.'}</strong></div></div>` : '';
    const secretsList = E.atlas.secrets ? E.atlas.secrets(s, language) : [];
    const secretsHtml = showMapSecrets ? secretsList.map(sec => {
      const found = sec.found;
      const statusLabel = found ? (en ? 'Claimed' : 'Найдено') : (en ? 'Available' : 'Доступно');
      return `<button type="button" class="map-landmark-tag ${found ? 'is-claimed' : 'is-ready'}" style="left:${sec.x}px;top:${sec.y}px" data-secret-id="${sec.id}" aria-label="${sec.name} (${statusLabel})"><span class="landmark-icon" aria-hidden="true">${sec.icon}</span><span class="landmark-badge" aria-hidden="true">${found ? '✓' : '✦'}</span><div class="landmark-tooltip" aria-hidden="true"><strong>${sec.name}</strong><small>${statusLabel} · ${sec.rewardText}</small></div></button>`;
    }).join('') : '';
    const cloudsHtml = `<div class="map-clouds-layer" aria-hidden="true"><div class="cloud-puff cloud-1"></div><div class="cloud-puff cloud-2"></div><div class="cloud-puff cloud-3"></div></div>`;
    const dayHour = Math.floor((s.age % 1200) / 50) % 24;
    const timeOfDay = dayHour >= 5 && dayHour < 9 ? 'map-dawn' : (dayHour >= 9 && dayHour < 18 ? 'map-day' : (dayHour >= 18 && dayHour < 22 ? 'map-dusk' : 'map-night'));
    if (canvas.dataset) canvas.dataset.timeOfDay = timeOfDay;
    canvas.setAttribute?.('data-time-of-day', timeOfDay);
    $('map-canvas').style.width=`${width}px`;$('map-canvas').style.height=`${height}px`;
    canvas.style.transform=`scale(${mapZoom})`;canvas.style.transformOrigin='0 0';
    $('map-stage').style.width=`${width*mapZoom}px`;$('map-stage').style.height=`${height*mapZoom}px`;
    $('map-zoom-level').textContent=`${Math.round(mapZoom*100)}%`;
    $('map-center').textContent=en?'My location':'Где я';$('map-fit').textContent=en?'All routes':'Все пути';
    $('map-survey').textContent=en?'Survey surroundings':'Осмотреть окрестности';$('map-survey').disabled=!E.atlas.canSurvey(s);
    $('map-filter').textContent=mapPendingOnly?(en?'Show all landmarks':'Все ориентиры'):(en?'Unfinished and bookmarked':'Ожидающие и отмеченные');$('map-filter').setAttribute?.('aria-pressed',String(mapPendingOnly));
    const toggleSecretsBtn = $('map-toggle-secrets');
    if (toggleSecretsBtn) {
      toggleSecretsBtn.textContent = showMapSecrets ? (en ? '✨ Hide landmarks' : '✨ Скрыть тайники') : (en ? '✨ Landmarks on map' : '✨ Тайники на карте');
      toggleSecretsBtn.setAttribute?.('aria-pressed', String(showMapSecrets));
    }
    const local=E.atlas.details(s,s.world.location,language),rumors=E.atlas.rumors(s,language),leads=E.world.causalLeads(s,language);
    const secretsFoundCount = (s.atlas?.secrets || []).length;
    const secretsSection = secretsList.length ? `<details class="map-secrets-details" open><summary>${en ? 'Hidden caches & landmarks' : 'Тайники и ориентиры'} (${secretsFoundCount} / ${secretsList.length})</summary><div class="map-secrets-list">${secretsList.map(sec => {
      const found = sec.found;
      const statusText = found ? (en ? '✓ Explored' : '✓ Найдено') : (en ? '✦ Available' : '✦ Доступно');
      const claimButton = found
        ? `<span class="secret-card-done">${en ? 'Reward collected' : 'Награда получена'}</span>`
        : `<button type="button" class="secret-card-claim-btn map-secret-claim-btn" data-secret-id="${sec.id}">${en ? '✦ Claim reward' : '✦ Забрать награду'}</button>`;
      return `<div class="map-secret-card ${found ? 'card-claimed' : 'card-ready'}" data-secret-card="${sec.id}"><div class="secret-card-header"><strong class="secret-card-title"><span class="secret-card-icon" aria-hidden="true">${sec.icon}</span> ${sec.name}</strong><small class="secret-card-status ${found ? 'status-done' : 'status-ready'}">${statusText}</small></div><p class="secret-card-desc">${sec.desc}</p><div class="secret-card-reward"><span class="reward-icon" aria-hidden="true">🎁</span> <span class="reward-text">${sec.rewardText}</span></div><div class="secret-card-actions">${claimButton}<button type="button" class="secret-card-locate-btn" data-locate-secret="${sec.id}">${en ? '📍 On map' : '📍 На карте'}</button></div></div>`;
    }).join('')}</div></details>` : '';
    const fragmentsList = E.atlas.fragments ? E.atlas.fragments(s, language) : [];
    const fragmentsFoundCount = (s.atlas?.fragments || []).length;
    const canAssemble = E.atlas.canAssembleMap ? E.atlas.canAssembleMap(s) : false;
    const assembled = !!s.atlas?.assembledMap;
    const fragmentsSection = fragmentsList.length ? `<details class="map-fragments-details"><summary>${en ? 'Ancient map fragments' : 'Обрывки древней карты'} (${fragmentsFoundCount} / 3)</summary><div class="map-fragments-list">${fragmentsList.map(frag => {
      const found = frag.found;
      const locName = frag.locationName || frag.location;
      return `<div class="map-fragment-card ${found ? 'frag-found' : 'frag-missing'}"><div class="fragment-head"><span class="fragment-icon" aria-hidden="true">${frag.icon}</span><strong class="fragment-title">${frag.name}</strong><small class="fragment-status ${found ? 'status-found' : 'status-missing'}">${found ? (en ? '✓ Found' : '✓ Найдено') : (en ? '◇ Lost in ' + locName : '◇ Утеряно в ' + locName)}</small></div><p class="fragment-desc">${frag.desc}</p></div>`;
    }).join('')}${assembled ? `<div class="assembled-map-banner">✓ ${en ? 'Ancient Master’s Secret Grotto revealed!' : 'Тайный грот древнего мастера явлен!'}</div>` : (canAssemble ? `<button type="button" class="btn-assemble-map" data-map-assemble="true">📜 ${en ? 'Assemble Ancient Treasure Map' : 'Собрать карту воедино'}</button>` : '')}</div></details>` : '';

    const inspectPlaceId = (byId.has(noteSelection) ? noteSelection : s.world.location);
    const inspectNode = byId.get(inspectPlaceId);
    let inspectorHtml = '';
    if (inspectNode) {
      const isLoc = inspectNode.kind === 'location';
      const isHere = s.world.location === inspectPlaceId && !s.world.journey;
      const isGoing = s.world.journey && s.world.journey.destination === inspectPlaceId;
      const statusText = isHere ? (en ? '● You are here' : '● Ты здесь') : isGoing ? (en ? `Travelling: ${Math.ceil(s.world.journey.remaining)}s` : `В пути: ${Math.ceil(s.world.journey.remaining)} сек.`) : inspectNode.locked ? (en ? '⊘ Route blocked' : '⊘ Путь закрыт') : inspectNode.visited ? (en ? '✓ Discovered' : '✓ Исследовано') : (en ? '○ Known route' : '○ Известная дорога');
      const inspectIcon = ({village:'⌂',city:'♜',forest:'♠',ruins:'▥',mountains:'▲','dark-forest':'♠','sealed-crypt':'▥','upper-pass':'▲','village-mill':'⚙','forest-garden':'❧','ruins-observatory':'☉','city-apothecary':'⚗','mountains-cliff':'⚔','ancient-grotto':'☯'}[inspectPlaceId] || (inspectNode.kind === 'site' ? '♧' : '◇'));
      
      const inspectDisc = s.atlas.discoveries?.[inspectPlaceId] || [];
      const resBadges = inspectDisc.map(r => {
        const iconGlyph = {gold:'🪙',herbs:'🌿',qi:'✦',relics:'🔷',wood:'🪵',ore:'🪨',pills:'💊',reputation:'📜',influence:'🏛',supplies:'📦',cosmic:'✧',worlds:'🌐'}[r] || '•';
        const resLabel = en
          ? ({gold:'Coins',herbs:'Herbs',qi:'Qi',relics:'Relics',wood:'Wood',ore:'Ore',pills:'Pills',reputation:'Reputation',influence:'Influence',supplies:'Supplies',cosmic:'Essence',worlds:'Worlds'}[r] || r)
          : ({gold:'Монеты',herbs:'Травы',qi:'Ци',relics:'Осколки',wood:'Древесина',ore:'Руда',pills:'Пилюли',reputation:'Репутация',influence:'Влияние',supplies:'Припасы',cosmic:'Эссенция',worlds:'Миры'}[r] || r);
        return `<span class="inspector-res-pill" title="${resLabel}"><span class="inspector-res-icon">${iconGlyph}</span> ${resLabel}</span>`;
      }).join('');

      const inspectTravelTime = isLoc ? E.world.travelTime(s, inspectPlaceId) : 0;
      const canInspectTravel = isLoc && !isHere && !s.world.journey && E.world.canTravel(s, inspectPlaceId);
      const travelBtnText = isHere ? (en ? 'You are here' : 'Ты здесь') : isGoing ? (en ? 'In transit...' : 'Уже в пути...') : (en ? `Travel here · ${inspectTravelTime}s` : `Отправиться в путь · ${inspectTravelTime} сек`);

      const inspectDetails = isLoc ? E.atlas.details(s, inspectPlaceId, language) : null;
      const inspectOverview = isLoc ? E.atlas.overview(s, E, inspectPlaceId, language) : null;
      const inspectNote = s.atlas?.notes?.[inspectPlaceId];

      inspectorHtml = `<div class="map-inspector-card"><div class="inspector-head"><div class="inspector-badge-row"><span class="inspector-status-badge ${isHere ? 'is-here' : ''}">${statusText}</span>${inspectNode.tierLabel ? `<span class="map-node-tier tier-${inspectNode.tier||'mortal'}">${inspectNode.tierLabel}</span>` : ''}</div><h4 class="inspector-title"><span class="inspector-icon" aria-hidden="true">${inspectIcon}</span> ${inspectNode.name}</h4>${inspectOverview?.bonus ? `<span class="inspector-perk">✦ ${inspectOverview.bonus}</span>` : ''}</div><p class="inspector-desc">${inspectDetails?.danger || inspectNode.reason || inspectNode.detail || ''}</p>${resBadges ? `<div class="inspector-section-label">${en ? 'Observed resources' : 'Найденные ресурсы'}</div><div class="inspector-res-grid">${resBadges}</div>` : `<p class="inspector-empty-res">${en ? 'No resource deposits surveyed yet' : 'Залежи ресурсов ещё не исследованы'}</p>`}${inspectNote ? `<div class="inspector-section-label">${en ? 'Explorer’s note' : 'Заметка исследователя'}</div><p class="inspector-desc">«${inspectNote}»</p>` : ''}<div class="inspector-actions">${isLoc ? `<button type="button" class="inspector-travel-btn" data-action="travel" data-value="${inspectPlaceId}" ${canInspectTravel ? '' : 'disabled'}>${travelBtnText}</button><button type="button" class="inspector-details-btn location-details-btn" data-place="${inspectPlaceId}">${en ? 'Full chronicle' : 'Летопись места'}</button>` : ''}</div></div>`;
    }

    $('map-intelligence').innerHTML=h(`${inspectorHtml}<h3>${en?'Explorer’s journal':'Дневник исследователя'}</h3>${celestialCardHtml}<p class="map-local-warning">${local.danger}</p><p>${E.atlas.hint(s,language)}</p><p>${en?'Local surveys':'Осмотры области'}: ${local.survey} · ${local.trail?(en?'Trail discovered: travel −20%':'Тропа найдена: переход −20%'):(en?'Trail: 2 surveys needed':'Для тропы: 2 осмотра')}</p>${secretsSection}${fragmentsSection}${s.stage<7?`<div class="map-horizon"><small>${en?'Next horizon':'Следующий горизонт'}</small><strong>${t(E.stages[s.stage+1].name)}</strong></div>`:''}<details><summary>${en?'Rumours':'Слухи'} (${rumors.length})</summary>${rumors.map(r=>`<p><strong>${r.confirmed?'✓':'?'}</strong> ${r.text}<br><small>${r.source}</small></p>`).join('')}</details><details open><summary>${en?'Unfinished stories':'Незавершённые истории'} (${leads.length})</summary>${leads.map(q=>`<p>${q.title}<br><small>${t(E.world.locations[q.location].name)}</small></p>`).join('')||`<p>${en?'New threads appear after encounters.':'Новые нити появятся после встреч.'}</p>`}</details>`);
    $('map-note-label').textContent=en?'Personal note · up to 600 characters':'Личная заметка · до 600 символов';$('map-note-save').textContent=en?'Save note':'Сохранить заметку';
    if(s.world.encounter){const scene=E.world.current(s);$('map-intelligence').innerHTML+=h(`<div class="map-horizon"><small>${en?'Current unresolved encounter':'Текущая незавершённая встреча'}</small><strong>${E.world.sceneText(scene,'title',language,s)}</strong><button data-tab="world" id="map-show-encounter">${en?'Return to the encounter':'Вернуться к встрече'}</button></div>`);}
    Array.from($('map-intelligence').querySelectorAll?.('details')||[]).forEach((node,index)=>{if(sidebarOpen[index]!==undefined)node.open=sidebarOpen[index];});
    $('map-note-text').setAttribute?.('aria-label',en?'Your personal note':'Твоя личная заметка');
    const noteNodes=map.nodes;if(!noteNodes.some(n=>n.id===noteSelection)){noteSelection=s.world.location;$('map-note-text').value=s.atlas.notes[noteSelection]||'';}
    if(document.activeElement!==$('map-note-place')){$('map-note-place').innerHTML=h(noteNodes.map(n=>`<option value="${n.id}">${n.name}</option>`).join(''));$('map-note-place').value=noteSelection;}
    $('map-zoom-in').setAttribute?.('aria-label',en?'Zoom in':'Приблизить');$('map-zoom-out').setAttribute?.('aria-label',en?'Zoom out':'Отдалить');
    $('map-help').textContent=en?'Drag the background to move. Use + / − or the mouse wheel to zoom. Icons mark settlements, wilderness and meetings.':'Тяни фон, чтобы перемещаться. Масштаб: + / − или колёсико мыши. Значки обозначают поселения, природу и встречи.';
    $('map-canvas').innerHTML=h(`<svg class="map-roads" width="${width}" height="${height}" aria-hidden="true">${svgDefs}${mountainPaths}${riverVein}${dragonVeins}${edges}${journeyLine}${baguaCompass}</svg>${cloudsHtml}${celestialBeaconHtml}${travelerHtml}${roadEventHtml}${secretsHtml}<div class="map-fog-label" aria-hidden="true">${en?'Unknown lands':'Неизведанные земли'}</div>${map.nodes.filter(nodeVisible).map(node=>{
      const isSelected = (noteSelection === node.id);
      const place=node.kind==='location',current=place&&s.world.location===node.id,action=place?'travel':'map-inspect';
      const status=current?(en?'You are here':'Ты здесь'):node.locked?(en?'Route blocked':'Путь закрыт'):node.visited?(en?'Discovered':'Исследовано'):(en?'Known route':'Известная дорога');
      const info=(node.pending?node.detail:node.kind==='site'?(en?'A recorded meeting. Return to this area to look for its continuation.':'Известное место встречи. Вернись сюда, чтобы искать продолжение.'):node.reason||node.detail)+(place?placeJournal(node.id):'');
      const icon=node.kind==='site'?'♧':({village:'⌂',city:'♜',forest:'♠',ruins:'▥',mountains:'▲','dark-forest':'♠','sealed-crypt':'▥','upper-pass':'▲','village-mill':'⚙','forest-garden':'❧','ruins-observatory':'☉','city-apothecary':'⚗','mountains-cliff':'⚔','ancient-grotto':'☯'}[node.id]||'◇');
      const trail=place&&E.atlas.trail(s,node.id),pending=node.pending?(en?' · Continuation':' · Продолжение'):'';
      const disc=s.atlas.discoveries?.[node.id]||[];
      const sealStamp=(node.id==='ancient-grotto'||node.pending||node.tier==='forbidden')?`<span class="map-seal-stamp" title="${en?'Ancient Seal':'Древняя печать'}">秘</span>`:'';
      const tierBadge=node.tierLevel!==undefined?`<span class="map-node-tier tier-${node.tier||'mortal'}"><span class="tier-icon" aria-hidden="true">${node.tierIcon||'🟢'}</span> <span class="tier-label">${node.tierLabel||''}</span></span>`:'';
      const pressureBadge=node.spiritualPressure?`<div class="map-node-pressure" title="${en?'Spiritual pressure':'Духовное давление'}"><span class="pressure-glyph">✦</span> <span class="pressure-text">${node.spiritualPressure}</span></div>`:'';
      const resourceRow=place&&disc.length?`<div class="map-node-resources" title="${en?'Observed resources':'Найденные ресурсы'}">${disc.map(r=>{
        const iconGlyph={gold:'🪙',herbs:'🌿',qi:'✦',relics:'🔷',wood:'🪵',ore:'🪨',pills:'💊',reputation:'📜',influence:'🏛',supplies:'📦',cosmic:'✧',worlds:'🌐'}[r]||'•';
        const resLabel=en
          ?({gold:'Coins',herbs:'Herbs',qi:'Qi',relics:'Relics',wood:'Wood',ore:'Ore',pills:'Pills',reputation:'Reputation',influence:'Influence',supplies:'Supplies',cosmic:'Essence',worlds:'Worlds'}[r]||r)
          :({gold:'Монеты',herbs:'Травы',qi:'Ци',relics:'Осколки',wood:'Древесина',ore:'Руда',pills:'Пилюли',reputation:'Репутация',influence:'Влияние',supplies:'Припасы',cosmic:'Эссенция',worlds:'Миры'}[r]||r);
        return `<span class="map-res-glyph" title="${resLabel}">${iconGlyph}</span>`;
      }).join(' ')}</div>`:'';
      const travelTimeText=place?` · ${E.world.travelTime(s,node.id)}${en?'s':' сек'}`:'';
      const travelLabel=place?(node.locked?(en?'Approach the gate':'Подойти к проходу'):current?(en?'You are here':'Ты здесь'):(en?`Travel here${travelTimeText}`:`Отправиться${travelTimeText}`)):(en?'Explore route':'Исследовать путь');
      return `<article data-map-node="${node.id}" class="map-node ${node.kind} ${node.locked?'locked':''} ${current?'current':''} ${isSelected?'is-selected':''} ${node.pending?'pending':''} ${trail?'known-trail':''} tier-${node.tier||'mortal'}" style="left:${node.x}px;top:${node.y}px">${sealStamp}<div class="map-node-header"><span class="map-icon" aria-hidden="true">${icon}</span><div class="map-node-meta"><strong class="map-node-title"><span class="map-node-name">${node.name}</span></strong>${tierBadge}</div></div><small>${current?'● ':node.locked?'⊘ ':'○ '}${status}${pending}${trail?' · −20%':''}</small>${pressureBadge}${resourceRow}<div class="map-node-actions"><button data-action="${action}" data-value="${node.id}" class="map-node-action-btn ${place&&!current&&!node.locked?'map-action-ready':''}" ${s.world.journey||current||!place&&!!s.world.encounter||node.kind==='site'&&node.locked?'disabled':''}>${travelLabel}</button><div class="map-node-tools"><button type="button" class="btn-tool-note" data-map-note="${node.id}" title="${en?'Edit note':'Редактировать заметку'}">${s.atlas.notes[node.id]?'▤':'✎'}</button><button type="button" class="btn-tool-pin" data-action="atlas-pin" data-value="${node.id}" aria-pressed="${s.atlas.pins.includes(node.id)}" title="${en?'Bookmark':'Отметить'}">${s.atlas.pins.includes(node.id)?'★':'☆'}</button></div></div><details class="map-node-details-drawer" ${openNodes.includes(node.id)?'open':''}><summary>${en?'Route details':'Об этой дороге'}</summary><div class="map-node-drawer-content">${info}</div>${place?`<button type="button" class="location-details-btn map-node-details" data-place="${node.id}">${en?'Location details':'Подробнее о месте'}</button>`:''}</details></article>`;
    }).join('')}`);
    $('map-status').textContent=(en?`Known routes: ${map.nodes.length}. New encounters leave landmarks on the map.`:`Известных мест: ${map.nodes.length}. Новые встречи оставляют ориентиры на карте.`)+(s.world.encounter?(en?' Resolve your current encounter before exploring a deeper route.':' Заверши текущую встречу, прежде чем исследовать путь вглубь.'):'')+journeyStatus;
    if(focus){const target=Array.from(canvas.querySelectorAll?.(focus.summary?'summary':'button')||[]).find(node=>focus.summary?node.closest('[data-map-node]')?.dataset.mapNode===focus.node:node.dataset.action===focus.action&&node.dataset.value===focus.value);target?.focus?.({preventScroll:true});}
    viewport.scrollLeft=scroll[0];viewport.scrollTop=scroll[1];
  }
  function storyGoalTrackerHtml(s) {
    if (s.stage > 1) return '';
    if (s.stage === 1) {
      const step = s.chapterTwoStep || 0;
      let tracker = '';
      let actions = '';
      if (step === 0) {
        const atCity = s.world.location === 'city' && !s.world.journey;
        tracker = `<div class="story-goal-tracker"><div class="story-goal-progress-row"><span class="story-goal-status ${atCity ? 'active' : 'paused'}">${atCity ? '● ' + uiText('Врата секты достигнуты', 'Sect gates reached') : '⚠ ' + uiText('В пути или вне города', 'In transit or outside city')}</span></div></div>`;
        if (!atCity && !s.world.journey) {
          actions = `<button type="button" class="quick-action-btn golden-btn" data-quick-action="travel" data-quick-value="city" ${E.world.canTravel(s, 'city') ? '' : 'disabled'}>${uiText('🏛 Войти в ворота города', '🏛 Enter city gates')}</button>`;
        }
      } else if (step === 1) {
        const bodyVal = s.body || 0;
        const totalClicks = (s.clicks?.squat || 0) + (s.clicks?.run || 0);
        const jobsCompleted = s.employment?.completed || 0;
        const isMet = bodyVal >= 2.5 || totalClicks >= 25 || jobsCompleted >= 1;
        tracker = `<div class="story-goal-tracker"><div class="story-goal-progress-row"><progress max="2.5" value="${Math.min(2.5, bodyVal)}" aria-label="${uiText('Тело', 'Body')}"></progress><span>${uiText('Тело: ', 'Body: ')}${fmt(bodyVal)} / 2.5 ${isMet ? '✓' : ''}</span></div><div class="story-goal-progress-row"><progress max="25" value="${Math.min(25, totalClicks)}" aria-label="${uiText('Упражнения', 'Exercises')}"></progress><span>${uiText('Упражнения: ', 'Exercises: ')}${totalClicks} / 25</span></div></div>`;
        actions = `<button type="button" class="quick-action-btn" data-quick-action="click" data-quick-value="squat" ${E.canClick(s, 'squat') ? '' : 'disabled'}>${uiText('✦ Присесть (-3)', '✦ Squat (-3)')}</button> <button type="button" class="quick-action-btn" data-quick-action="click" data-quick-value="run" ${E.canClick(s, 'run') ? '' : 'disabled'}>${uiText('✦ Пробежка (-5)', '✦ Run (-5)')}</button>`;
      } else if (step === 2) {
        const qiVal = s.resources?.qi || 0;
        const xpVal = s.xp || 0;
        const learnedCount = Object.keys(s.cultivation?.learned || {}).length;
        const isMet = qiVal >= 15 || learnedCount >= 2 || xpVal >= 30;
        const isMeditating = s.activity === 'meditate' && E.activityRunning(s);
        tracker = `<div class="story-goal-tracker"><div class="story-goal-progress-row"><progress max="15" value="${Math.min(15, qiVal)}" aria-label="${uiText('Ци', 'Qi')}"></progress><span>${uiText('Ци: ', 'Qi: ')}${fmt(qiVal)} / 15 ${qiVal >= 15 ? '✓' : ''}</span></div><div class="story-goal-progress-row"><progress max="30" value="${Math.min(30, xpVal)}" aria-label="${uiText('Понимание', 'Insight')}"></progress><span>${uiText('Понимание: ', 'Insight: ')}${fmt(xpVal)} / 30 ${isMet ? '✓' : ''}</span></div></div>`;
        if (!isMeditating) {
          actions = `<button type="button" class="quick-action-btn" data-quick-action="activity" data-quick-value="meditate" ${E.canActivity(s, 'meditate') ? '' : 'disabled'}>${uiText('☯ Постигать основы (медитация)', '☯ Study foundation (meditation)')}</button>`;
        } else {
          actions = `<span class="story-goal-note">${uiText('Постижение свитков идёт', 'Studying scriptures active')}</span>`;
        }
      } else if (step === 3) {
        const qiVal = s.resources?.qi || 0;
        const realmVal = s.realm || 0;
        const isMeditating = s.activity === 'meditate' && E.activityRunning(s);
        const readyBt = s.realm < 2 && s.found && s.xp >= E.needed(s) && E.affordable(s, E.breakthroughCost(s));
        tracker = `<div class="story-goal-tracker"><div class="story-goal-progress-row"><progress max="2" value="${Math.min(2, realmVal)}" aria-label="${uiText('Ступень', 'Realm')}"></progress><span>${uiText('Ступень: ', 'Realm: ')}${realmVal} / 2 ${realmVal >= 2 ? '✓' : ''}</span></div><div class="story-goal-progress-row"><progress max="20" value="${Math.min(20, qiVal)}" aria-label="${uiText('Ци', 'Qi')}"></progress><span>${uiText('Ци: ', 'Qi: ')}${fmt(qiVal)} / 20 ${qiVal >= 20 ? '✓' : ''}</span></div></div>`;
        if (readyBt) {
          actions = `<button type="button" class="quick-action-btn golden-btn" data-quick-action="breakthrough" data-quick-value="">${uiText('⚡ Совершить Прорыв меридианов', '⚡ Perform Meridian Breakthrough')}</button>`;
        } else if (!isMeditating) {
          actions = `<button type="button" class="quick-action-btn" data-quick-action="activity" data-quick-value="meditate" ${E.canActivity(s, 'meditate') ? '' : 'disabled'}>${uiText('☯ Медитировать для накопления ци', '☯ Meditate to accumulate qi')}</button>`;
        } else {
          actions = `<span class="story-goal-note">${uiText('Медитация активна (+ци)', 'Meditation active (+qi)')}</span>`;
        }
      } else if (step === 4) {
        const herbsVal = s.resources?.herbs || 0;
        const brewsCount = s.alchemy?.stats?.brews || 0;
        const pillsCount = s.resources?.pills || 0;
        const isMet = brewsCount >= 1 || herbsVal >= 15 || pillsCount >= 1;
        tracker = `<div class="story-goal-tracker"><div class="story-goal-progress-row"><progress max="15" value="${Math.min(15, herbsVal)}" aria-label="${uiText('Травы', 'Herbs')}"></progress><span>${uiText('Травы: ', 'Herbs: ')}${fmt(herbsVal)} / 15 ${herbsVal >= 15 ? '✓' : ''}</span></div><div class="story-goal-progress-row"><span class="story-goal-status ${isMet ? 'active' : 'paused'}">${isMet ? '● ' + uiText('Сварено пилюль: ', 'Pills brewed: ') + Math.max(brewsCount, pillsCount, 1) + ' ✓' : '⚠ ' + uiText('Сварено пилюль: ', 'Pills brewed: ') + '0'}</span></div></div>`;
        actions = `<button type="button" class="quick-action-btn golden-btn" data-quick-action="alchemy">${uiText('🧪 Открыть Алхимический котёл', '🧪 Open Alchemy Crucible')}</button>`;
      } else if (step === 5) {
        const wepVal = s.weapon || 0;
        const styleVal = s.style || 'balanced';
        const isMet = wepVal >= 1 || (s.mastery || 0) >= 1 || styleVal !== 'balanced' || (s.world?.visits?.mountains > 0);
        const styleName = { balanced: uiText('Равновесие', 'Balanced'), swift: uiText('Быстрый шаг', 'Swift step'), piercing: uiText('Пробивающий удар', 'Piercing strike'), ward: uiText('Духовный заслон', 'Spiritual ward') }[styleVal] || styleVal;
        tracker = `<div class="story-goal-tracker"><div class="story-goal-progress-row"><progress max="1" value="${Math.min(1, wepVal)}" aria-label="${uiText('Оружие: ', 'Weapon: ')}"></progress><span>${uiText('Оружие: ', 'Weapon: ')}${wepVal} / 1 ${wepVal >= 1 ? '✓' : ''}</span></div><div class="story-goal-progress-row"><span class="story-goal-status ${isMet ? 'active' : 'paused'}">${uiText('Боевой стиль: ', 'Combat style: ')}${styleName} ${isMet ? '✓' : ''}</span></div></div>`;
        actions = `<button type="button" class="quick-action-btn" data-quick-action="style" data-quick-value="${styleVal === 'balanced' ? 'swift' : 'balanced'}">${uiText('⚔ Закалить оружие', '⚔ Temper weapon')}</button>`;
      } else if (step === 6) {
        const winsVal = s.wins || 0;
        const pwrVal = E.power(s);
        tracker = `<div class="story-goal-tracker"><div class="story-goal-progress-row"><progress max="2" value="${Math.min(2, winsVal)}" aria-label="${uiText('Победы', 'Victories')}"></progress><span>${uiText('Победы: ', 'Victories: ')}${winsVal} / 2 ${winsVal >= 2 ? '✓' : ''}</span></div><div class="story-goal-progress-row"><progress max="36" value="${Math.min(36, pwrVal)}" aria-label="${uiText('Боевая мощь', 'Power')}"></progress><span>${uiText('Боевая мощь: ', 'Power: ')}${fmt(pwrVal)} / 36 ${pwrVal >= 36 ? '✓' : ''}</span></div></div>`;
        actions = `<button type="button" class="quick-action-btn golden-btn" data-tab="combat">${uiText('⚔ Выйти на арену чести', '⚔ Enter arena of honor')}</button>`;
      } else if (step === 7) {
        const xpVal = s.xp || 0;
        const relicsVal = s.resources?.relics || 0;
        const isMeditating = s.activity === 'meditate' && E.activityRunning(s);
        tracker = `<div class="story-goal-tracker"><div class="story-goal-progress-row"><progress max="50" value="${Math.min(50, xpVal)}" aria-label="${uiText('Понимание', 'Insight')}"></progress><span>${uiText('Понимание: ', 'Insight: ')}${fmt(xpVal)} / 50 ${xpVal >= 50 ? '✓' : ''}</span></div><div class="story-goal-progress-row"><progress max="3" value="${Math.min(3, relicsVal)}" aria-label="${uiText('Реликвии', 'Relics')}"></progress><span>${uiText('Реликвии: ', 'Relics: ')}${relicsVal} / 3</span></div></div>`;
        if (xpVal < 50) {
          if (!isMeditating) {
            actions = `<button type="button" class="quick-action-btn" data-quick-action="activity" data-quick-value="meditate" ${E.canActivity(s, 'meditate') ? '' : 'disabled'}>${uiText('☯ Медитировать для расшифровки', '☯ Meditate for decryption')}</button>`;
          } else {
            actions = `<span class="story-goal-note">${uiText('Постижение свитков идёт', 'Studying scriptures active')}</span>`;
          }
        }
      } else if (step === 8) {
        const realmVal = s.realm || 0;
        const winsVal = s.wins || 0;
        const goldVal = s.resources?.gold || 0;
        tracker = `<div class="story-goal-tracker"><div class="story-goal-progress-row"><progress max="3" value="${Math.min(3, realmVal)}" aria-label="${uiText('Ступень', 'Realm')}"></progress><span>${uiText('Ступень: ', 'Realm: ')}${realmVal} / 3 ${realmVal >= 3 ? '✓' : ''}</span></div><div class="story-goal-progress-row"><progress max="3" value="${Math.min(3, winsVal)}" aria-label="${uiText('Победы', 'Victories')}"></progress><span>${uiText('Победы: ', 'Victories: ')}${winsVal} / 3 ${winsVal >= 3 ? '✓' : ''}</span></div><div class="story-goal-progress-row"><progress max="150" value="${Math.min(150, goldVal)}" aria-label="${uiText('Монеты', 'Gold')}"></progress><span>${uiText('Монеты: ', 'Gold: ')}${fmt(goldVal)} / 150 ${goldVal >= 150 ? '✓' : ''}</span></div></div>`;
        if (realmVal < 3) {
          const readyBt = s.found && s.xp >= E.needed(s) && E.affordable(s, E.breakthroughCost(s));
          if (readyBt) {
            actions = `<button type="button" class="quick-action-btn golden-btn" data-quick-action="breakthrough" data-quick-value="">${uiText('⚡ Совершить Прорыв меридианов', '⚡ Perform Meridian Breakthrough')}</button>`;
          }
        } else if (winsVal < 3) {
          actions = `<button type="button" class="quick-action-btn golden-btn" data-tab="combat">${uiText('⚔ Сразиться на арене турнира', '⚔ Fight in tournament arena')}</button>`;
        }
      }
      if (!tracker && !actions) return '';
      return tracker + (actions ? `<div class="story-quick-actions">${actions}</div>` : '');
    }
    const step = s.storyStep;
    let tracker = '';
    let actions = '';

    if (step === 1) {
      const sweeps = s.clicks?.sweep || 0;
      const stamLeft = Math.floor(s.stamina || 0);
      const isStarving = !s.fed && s.body < 2;
      const hungerWarning = isStarving
        ? `<div class="story-hunger-note">⚠ ${uiText('Истощение от холода и голода: выносливость не восстанавливается! Осталось: ','Starving and freezing: stamina will not recover! Remaining: ')}<strong>${stamLeft}</strong> / 100 ${uiText('(хватит на уборку до похлёбки)','(barely enough to sweep until food)')}</div>`
        : `<div class="story-hunger-note fed">✓ ${uiText('Похлёбка Мэй съедена: силы восстановлены, регенерация активна (+0.4/сек)','Mei’s stew eaten: stamina restored, recovery active (+0.4/s)')}</div>`;
      tracker = `<div class="story-goal-tracker">${hungerWarning}<div class="story-goal-progress-row"><progress max="10" value="${Math.min(10, sweeps)}" aria-label="${uiText('Подметания','Sweeps')}"></progress><span>${uiText('Подметания: ','Sweeps: ')}${sweeps}/10</span></div></div>`;
      if (!s.employment.order) {
        actions = `<button type="button" class="quick-action-btn" data-quick-action="order" data-quick-value="sweep" ${E.canOrder(s, 'sweep') ? '' : 'disabled'}>${uiText('✦ Взять уборку двора у Мэй','✦ Accept courtyard sweeping from Mei')}</button>`;
      } else {
        actions = `<button type="button" class="quick-action-btn" data-quick-action="click" data-quick-value="sweep" ${E.canClick(s, 'sweep') ? '' : 'disabled'}>${uiText('✦ Подмести двор (-2 выносл.)','✦ Sweep courtyard (-2 stam.)')}</button>`;
        if (E.canClaimOrder(s)) {
          actions += ` <button type="button" class="quick-action-btn golden-btn" data-quick-action="claim-order" data-quick-value="">${uiText('✦ Забрать плату за уборку','✦ Collect cleaning payment')}</button>`;
        }
      }
    } else if (step === 2) {
      const bodyVal = s.body || 0;
      tracker = `<div class="story-goal-tracker"><div class="story-goal-progress-row"><progress max="2" value="${Math.min(2, bodyVal)}" aria-label="${uiText('Тело','Body')}"></progress><span>${uiText('Тело: ','Body: ')}${fmt(bodyVal)} / 2.0</span></div></div>`;
      actions = `<button type="button" class="quick-action-btn" data-quick-action="click" data-quick-value="squat" ${E.canClick(s, 'squat') ? '' : 'disabled'}>${uiText('✦ Присесть (-3)','✦ Squat (-3)')}</button> <button type="button" class="quick-action-btn" data-quick-action="click" data-quick-value="run" ${E.canClick(s, 'run') ? '' : 'disabled'}>${uiText('✦ Пробежка (-5)','✦ Run (-5)')}</button>`;
    } else if (step === 3) {
      const calmVal = s.calm || 0;
      const isMeditating = s.activity === 'meditate' && E.activityRunning(s);
      const statusBadge = isMeditating
        ? `<span class="story-goal-status active">${uiText('● активно','● active')}</span>`
        : `<span class="story-goal-status paused">${uiText('⚠ на паузе','⚠ paused')}</span>`;
      tracker = `<div class="story-goal-tracker"><div class="story-goal-progress-row"><progress max="5" value="${Math.min(5, calmVal)}" aria-label="${uiText('Спокойствие','Calm')}"></progress><span>${uiText('Спокойствие: ','Calm: ')}${fmt(calmVal)} / 5.0 ${statusBadge}</span></div></div>`;
      if (!isMeditating) {
        actions = `<button type="button" class="quick-action-btn" data-quick-action="activity" data-quick-value="meditate" ${E.canActivity(s, 'meditate') ? '' : 'disabled'}>${uiText('☯ Начать медитацию (+0.02/сек)','☯ Begin meditation (+0.02/sec)')}</button>`;
      } else {
        actions = `<span class="story-goal-note">${uiText('Медитация идёт (+0.02/сек)','Meditation active (+0.02/sec)')}</span>`;
      }
    } else if (step === 4) {
      const exp = s.explored || 0;
      const curM = String(Math.floor(exp / 60)).padStart(2, '0');
      const curS = String(Math.floor(exp % 60)).padStart(2, '0');
      const isExploring = s.world.location === 'ruins' && !s.world.journey && s.activity === 'explore' && E.activityRunning(s);
      const statusBadge = isExploring
        ? `<span class="story-goal-status active">${uiText('● активно','● active')}</span>`
        : `<span class="story-goal-status paused">${uiText('⚠ на паузе','⚠ paused')}</span>`;
      tracker = `<div class="story-goal-tracker"><div class="story-goal-progress-row"><progress max="600" value="${Math.min(600, exp)}" aria-label="${uiText('Исследование','Exploration')}"></progress><span>${uiText('Исследование: ','Exploration: ')}${curM}:${curS} / 10:00 ${statusBadge}</span></div></div>`;
      if (s.world.journey) {
        actions = `<button type="button" class="quick-action-btn" disabled>${uiText('🏛 В пути: ','🏛 Traveling: ') + Math.ceil(s.world.journey.remaining) + uiText(' сек.',' s')}</button>`;
      } else if (s.world.location !== 'ruins') {
        actions = `<button type="button" class="quick-action-btn" data-quick-action="travel" data-quick-value="ruins" ${E.world.canTravel(s, 'ruins') ? '' : 'disabled'}>${uiText('🏛 Отправиться в Развалины храма (15 сек)','🏛 Travel to Temple Ruins (15 sec)')}</button>`;
      } else if (!isExploring) {
        actions = `<button type="button" class="quick-action-btn" data-quick-action="activity" data-quick-value="explore" ${E.canActivity(s, 'explore') ? '' : 'disabled'}>${uiText('✦ Начать исследование руин','✦ Begin exploring ruins')}</button>`;
      } else {
        actions = `<button type="button" class="quick-action-btn" data-quick-action="click" data-quick-value="scout" ${E.canClick(s, 'scout') ? '' : 'disabled'}>${uiText('✦ Осмотреть развалины (+2 сек)','✦ Inspect ruins (+2 sec)')}</button>`;
      }
    } else if (step === 5) {
      const herbsVal = s.resources?.herbs || 0;
      const xpVal = s.xp || 0;
      const needXp = E.needed(s);
      const readyForBreakthrough = s.realm === 0 && s.found && xpVal >= needXp && E.affordable(s, E.breakthroughCost(s));
      tracker = `<div class="story-goal-tracker"><div class="story-goal-progress-row"><progress max="10" value="${Math.min(10, herbsVal)}" aria-label="${uiText('Травы','Herbs')}"></progress><span>${uiText('Травы: ','Herbs: ')}${fmt(herbsVal)}/10</span></div><div class="story-goal-progress-row"><progress max="${needXp}" value="${Math.min(needXp, xpVal)}" aria-label="${uiText('Понимание','Insight')}"></progress><span>${uiText('Понимание: ','Insight: ')}${fmt(xpVal)}/${fmt(needXp)}</span></div></div>`;
      if (s.realm >= 1) {
        if (s.world.location === 'ruins' && !s.world.journey) {
          actions = `<button type="button" class="quick-action-btn" data-quick-action="travel" data-quick-value="village" ${E.world.canTravel(s, 'village') ? '' : 'disabled'}>${uiText('🏛 Вернуться в деревню к Мэй','🏛 Return to Mei in village')}</button>`;
        }
      } else {
        actions = `<button type="button" class="quick-action-btn ${readyForBreakthrough ? 'golden-btn' : ''}" data-quick-action="breakthrough" data-quick-value="" ${readyForBreakthrough ? '' : 'disabled'}>${uiText('⚡ Совершить Прорыв меридианов','⚡ Perform Meridian Breakthrough')}</button>`;
      }
    } else if (step >= 7) {
      if (s.world.admission || s.sect) {
        actions = `<button type="button" class="quick-action-btn golden-btn" data-quick-action="advance" data-quick-value="" ${E.canAdvance(s) ? '' : 'disabled'}>${uiText('📜 Начать следующую главу (Путь секты)','📜 Start next chapter (Sect path)')}</button>`;
      }
    }

    if (!tracker && !actions) return '';
    return tracker + (actions ? `<div class="story-quick-actions">${actions}</div>` : '');
  }
  function systemBoxHtml(s, beat, stepOverride = (s.stage === 0 ? s.storyStep : (s.chapterTwoStep || 0)), isArchive = false) {
    if (!beat) {
      return `<div class="story-goal system-box system-synced"><div class="system-prompt-header"><span class="system-bracket">【</span><span class="system-prompt-title">${uiText('СИСТЕМА ПРОЗРЕНИЯ · ДИРЕКТИВА', 'INSIGHT SYSTEM · DIRECTIVE')}</span><span class="system-bracket">】</span></div><div class="system-prompt-text"><p>${uiText('«[Начать следующую главу и отправиться в секту]».', '“[Start the next chapter and set out for your sect]”.')}</p></div>${storyGoalTrackerHtml(s)}</div>`;
    }

    if (s.stage === 1) {
      const step = stepOverride !== undefined ? stepOverride : (s.chapterTwoStep || 0);
      const ch2Mod = typeof module !== 'undefined' && module.exports ? require('./chapter-two.js') : (globalThis.IsekaiChapterTwo || (typeof window !== 'undefined' ? window.IsekaiChapterTwo : null));
      const dir = ch2Mod ? ch2Mod.systemDirective(s, step, L?.language || 'ru') : {
        header: uiText('СИСТЕМА ПРОЗРЕНИЯ · ДИРЕКТИВА', 'INSIGHT SYSTEM · DIRECTIVE'),
        prompt: `«[${beat.goal}]».`,
        world: uiText('Награда секты', 'Sect reward'),
        system: uiText('Развитие пути', 'Path advancement')
      };
      const trackerContent = isArchive ? `<div class="system-archive-status">✓ ${uiText('Директива успешно выполнена', 'Directive successfully completed')}</div>` : storyGoalTrackerHtml(s);
      const rewardsBlock = `<div class="system-rewards-container"><div class="system-world-reward"><span class="reward-tag-world">🌿 ${uiText('Награда в мире: ','In-world reward: ')}</span><span>${dir.world}</span></div><div class="system-divine-reward"><span class="reward-tag-system">✧ ${uiText('Система Прозрения: ','Insight System: ')}</span><span>${dir.system}</span></div></div>`;
      return `<div class="story-goal system-box system-synced"><div class="system-prompt-header"><span class="system-bracket">【</span><span class="system-prompt-title">${dir.header}</span><span class="system-bracket">】</span></div><div class="system-prompt-text"><p>${dir.prompt}</p></div>${trackerContent}${rewardsBlock}${(!isArchive && Object.keys(beat.reward || {}).length) ? `<small class="system-reward">${uiText('Награда: ', 'Reward: ')}${costs(beat.reward)}</small>` : ''}</div>`;
    }

    const step = stepOverride !== undefined ? stepOverride : s.storyStep;
    if (step === 0) {
      const trackerContent = isArchive ? `<div class="system-archive-status">✓ ${uiText('Директива успешно выполнена', 'Directive successfully completed')}</div>` : storyGoalTrackerHtml(s);
      const step0Rewards = `<div class="system-rewards-container"><div class="system-world-reward"><span class="reward-tag-world">🌿 ${uiText('Награда в мире: ','In-world reward: ')}</span><span>${uiText('Дорожные сухари возчика и место на облучке повозки', 'Carter’s trail rations and a seat on the wagon box')}</span></div><div class="system-divine-reward"><span class="reward-tag-system">✧ ${uiText('Система Прозрения: ','Insight System: ')}</span><span>${uiText('Пробуждение Небесной Жемчужины Яда · Слияние с сосудом: 0.1%', 'Sky Poison Pearl awakened · Vessel fusion: 0.1%')}</span></div></div>`;
      return `<div class="story-goal system-box system-mortal"><div class="system-prompt-header"><span class="system-prompt-glyph">✦</span> <span class="system-prompt-title">${uiText('ИНСТИНКТ ВЫЖИВАНИЯ', 'SURVIVAL INSTINCT')}</span></div><div class="system-prompt-text"><p>${uiText('Холод размытой глины и тупая боль в спазмированных каналах. Ты ещё не понимаешь, где очнулся, но инстинкт выживания требует выбраться из придорожного рва и опереться на тех, кто знает здешний тракт.', 'The chill of muddy clay and dull ache in crippled channels. You do not yet understand where you woke up, but raw survival instinct urges you to climb out of the roadside ditch and lean on those who know these roads.')}</p></div>${trackerContent}${step0Rewards}${(!isArchive && Object.keys(beat.reward || {}).length) ? `<small class="system-reward">${uiText('Награда: ', 'Reward: ')}${costs(beat.reward)}</small>` : ''}</div>`;
    }

    let boxClass = 'system-synced';
    let headerTitle = '';
    let promptMsg = '';

    if (step === 1) {
      boxClass = 'system-awakening';
      headerTitle = uiText('НЕБЕСНАЯ ЖЕМЧУЖИНА · ПЕРВОЕ ЭХО', 'SKY POISON PEARL · FIRST ECHO');
      promptMsg = uiText(
        '«[Внимание: обнаружен критический упадок сосуда. Рекомендация: очистить двор и получить горячую пищу]». Светящиеся изумрудные строки мерцают прямо в воздухе перед глазами, заставляя вздрогнуть от испуга. Это не мираж — жемчужина проецирует в сознание древнее руководство!',
        '“[Alert: critical vessel depletion detected. Recommendation: clear courtyard and obtain hot sustenance]”. Luminous emerald lines flicker right before your eyes, making you flinch in shock. This is no hallucination — the pearl is projecting an ancient guidance into your consciousness!'
      );
    } else if (step === 2) {
      boxClass = 'system-diagnostic';
      headerTitle = uiText('СИСТЕМА ПРОЗРЕНИЯ · ДИАГНОСТИКА СОСУДА', 'INSIGHT SYSTEM · VESSEL DIAGNOSTICS');
      promptMsg = uiText(
        '«[Предупреждение: глубокие каналы спазмированы от рождения. Мышечный каркас нестабилен. Директива: укрепить физическое тело до ранга 2.0]». Ты начинаешь разбираться в сигналах системы: она безжалостно диагностирует изъяны тела и указывает кратчайший способ выжить.',
        '“[Warning: profound channels crippled from birth. Muscular foundation unstable. Directive: temper physical body to rank 2.0]”. You begin getting accustomed to the system’s signals: it ruthlessly diagnoses flaws of the vessel and indicates the fastest path to survival.'
      );
    } else if (step === 3) {
      boxClass = 'system-synced';
      headerTitle = uiText('СИСТЕМА ПРОЗРЕНИЯ · СИНХРОНИЗАЦИЯ', 'INSIGHT SYSTEM · SYNCHRONIZATION');
      promptMsg = uiText(
        '«[Калибровка завершена. Связь с сознанием устойчива. Директива: накопить 5.0 спокойствия для локализации древнего резонанса]». Голос системы больше не пугает. Ровное дыхание синхронизирует жемчужину с твоим разумом.',
        '“[Calibration complete. Neural link stabilized. Directive: accumulate 5.0 tranquility to lock onto ancient resonance]”. The system’s voice no longer frightens you. Even breathing synchronizes the pearl with your mind.'
      );
    } else if (step === 4) {
      boxClass = 'system-synced';
      headerTitle = uiText('СИСТЕМА ПРОЗРЕНИЯ · СКАНИРОВАНИЕ РУИН', 'INSIGHT SYSTEM · RUINS SCAN');
      promptMsg = uiText(
        '«[Сканирование руин святилища: зафиксирован след древнего божественного наследия. Рекомендация: осмотреть каменные плиты разрушенного алтаря]».',
        '“[Sanctuary ruins scan: ancient divine legacy signature detected. Recommendation: inspect stone slabs of the fallen altar]”.'
      );
    } else if (step === 5) {
      boxClass = 'system-breakthrough';
      headerTitle = uiText('СИСТЕМА ПРОЗРЕНИЯ · ПРОТОКОЛ ПРОРЫВА', 'INSIGHT SYSTEM · BREAKTHROUGH PROTOCOL');
      promptMsg = uiText(
        '«[Очищение Небесной Жемчужиной: устранение ядов из трав завершено со 100% чистотой. Протокол прорыва: разрушить спазмы меридианов и открыть глубокие каналы]».',
        '“[Sky Poison Pearl purification: herb toxin elimination complete with 100% purity. Breakthrough protocol: shatter meridian blocks and open profound channels]”.'
      );
    } else if (step === 6) {
      boxClass = 'system-tactical';
      headerTitle = uiText('СИСТЕМА ПРОЗРЕНИЯ · ТАКТИЧЕСКИЙ АНАЛИЗ', 'INSIGHT SYSTEM · TACTICAL EVALUATION');
      promptMsg = uiText(
        '«[Тактическая оценка: боец Белого Клыка преграждает проход через мост. Варианты преодоления: силовое устранение во вкладке Испытания или использование влияния]».',
        '“[Tactical assessment: White Fang fighter blocking bridge passage. Resolution vectors: direct combat in Trials tab or leveraging social influence]”.'
      );
    } else if (step === 7) {
      boxClass = 'system-synced';
      headerTitle = uiText('СИСТЕМА ПРОЗРЕНИЯ · ОЦЕНКА ВЕЛИКИХ СЕКТ', 'INSIGHT SYSTEM · GREAT SECT EVALUATION');
      promptMsg = uiText(
        '«[Оценка путей развития: 4 великие секты проводят набор у Серебряного Моста. Анализ совместимости: выберите наставничество, соответствующее вашему пути]».',
        '“[Path evaluation: 4 great sects conducting recruitment at Silver Bridge. Affinity analysis: select a mentorship aligned with your chosen path]”.'
      );
    } else {
      boxClass = 'system-synced';
      headerTitle = uiText('СИСТЕМА ПРОЗРЕНИЯ · ДИРЕКТИВА', 'INSIGHT SYSTEM · DIRECTIVE');
      promptMsg = `«[${beat.goal}]».`;
    }

    const trackerContent = isArchive ? `<div class="system-archive-status">✓ ${uiText('Директива успешно выполнена', 'Directive successfully completed')}</div>` : storyGoalTrackerHtml(s);
    const rewardProfiles = {
      0: {
        world: uiText('Дорожные сухари возчика и место на облучке повозки', 'Carter’s trail rations and a seat on the wagon box'),
        system: uiText('Пробуждение Небесной Жемчужины Яда · Слияние с сосудом: 0.1%', 'Sky Poison Pearl awakened · Vessel fusion: 0.1%')
      },
      1: {
        world: uiText('Дымящаяся мясная похлёбка Мэй и рис (восстановление сил) + 10 монет', 'Lady Mei’s steaming meat stew & rice (full stamina recovery) + 10 coins'),
        system: uiText('Очищение меридианов +1%, снятие истощения, циркуляция сил разблокирована (+0.4/сек)', 'Profound channels cleansed +1%, starvation removed, stamina circulation unlocked (+0.4/s)')
      },
      2: {
        world: uiText('Лекарственная растирка Жэня для ноющих мышц и сухожилий (5 трав)', 'Old Ren’s medicinal muscle & sinew liniment (5 herbs)'),
        system: uiText('Укрепление мышечного каркаса +0.1, предел выносливости расширен', 'Muscular framework tempered +0.1, stamina threshold expanded')
      },
      3: {
        world: uiText('Успокаивающий горный травяной сбор и родниковая вода (3 травы)', 'Soothing valley herb brew & mountain spring water (3 herbs)'),
        system: uiText('Духовное чутьё +1, координаты святилища Злого Бога зафиксированы на карте', 'Spiritual sense +1, Evil God sanctuary coordinates locked on map')
      },
      4: {
        world: uiText('Осколок алтаря из чёрного нефрита с древними символами (1 реликвия)', 'Black jade altar shard engraved with ancient symbols (1 shard)'),
        system: uiText('Сутра Злого Неба активирована · Разблокирована 100% алхимическая очистка трав без токсинов', 'Evil Sky Sutra activated · 100% toxin-free herbal alchemy purification unlocked')
      },
      5: {
        world: uiText('Очищенная эссенция горных трав стопроцентной чистоты (10 трав)', '100% pure refined essence of mountain herbs (10 herbs)'),
        system: uiText('Великий прорыв! 54 спазмированных канала сокрушены · Ступень Начальной Ци достигнута', 'Grand Breakthrough! 54 crippled channels shattered · Elementary Profound Realm reached')
      },
      6: {
        world: uiText('Дорожные припасы и кошель от дяди Ба и госпожи Мэй (25 монет)', 'Travel provisions and road purse from Uncle Ba & Lady Mei (25 coins)'),
        system: uiText('Первое боевое крещение · Признание Долины Плывущих Облаков, открыт путь в город', 'First baptism of battle · Floating Cloud Valley recognition, path to city opened')
      },
      7: {
        world: uiText('Жетон ученика великой секты и начальное содержание адепта', 'Great Sect disciple token and starting adept allowance'),
        system: uiText('Статус официального ученика утверждён · Том 1 завершён, открыт Том 2: Путь Секты', 'Official disciple status confirmed · Volume 1 complete, Volume 2 Sect Path unlocked')
      }
    };
    const profile = rewardProfiles[step] || null;
    const rewardsBlock = profile ? `<div class="system-rewards-container"><div class="system-world-reward"><span class="reward-tag-world">🌿 ${uiText('Награда в мире: ','In-world reward: ')}</span><span>${profile.world}</span></div><div class="system-divine-reward"><span class="reward-tag-system">✧ ${uiText('Система Прозрения: ','Insight System: ')}</span><span>${profile.system}</span></div></div>` : '';
    return `<div class="story-goal system-box ${boxClass}"><div class="system-prompt-header"><span class="system-bracket">【</span><span class="system-prompt-title">${headerTitle}</span><span class="system-bracket">】</span></div><div class="system-prompt-text"><p>${promptMsg}</p></div>${trackerContent}${rewardsBlock}${(!isArchive && Object.keys(beat.reward || {}).length) ? `<small class="system-reward">${uiText('Награда: ', 'Reward: ')}${costs(beat.reward)}</small>` : ''}</div>`;
  }
  function renderArchiveList(s) {
    const isCh2 = s.stage >= 1;
    const ch1Html = E.story.slice(0, isCh2 ? E.story.length : s.storyStep).map((_, i) => {
      const b = E.storyBeat(s, i), d = stepDecisionInfo(s, i);
      const openBtn = s.stage === 0 ? `<p><button type="button" class="story-archive-return-btn" data-novel-step="${i}">${uiText('📖 Открыть эту главу', '📖 Open this chapter')}</button></p>` : '';
      return `<h3>${uiText('Глава', 'Chapter')} ${i + 1} · ${b.title}</h3><p>${b.text}</p>${d ? `<p><strong>${uiText('Выбор: ', 'Choice: ')}</strong>${d.title}. ${d.desc}</p>` : ''}${b.chronicle ? `<p class="story-chronicle-past"><em>${b.chronicle}</em></p>` : ''}${openBtn}`;
    }).join('');

    let ch2Html = '';
    if (isCh2) {
      const ch2Mod = typeof module !== 'undefined' && module.exports ? require('./chapter-two.js') : (globalThis.IsekaiChapterTwo || (typeof window !== 'undefined' ? window.IsekaiChapterTwo : null));
      const ch2Step = s.stage > 1 ? (ch2Mod?.beats?.length || 9) : (s.chapterTwoStep || 0);
      if (ch2Mod && ch2Mod.beats) {
        ch2Html = ch2Mod.beats.slice(0, ch2Step).map((b, i) => {
          const beatLocalized = ch2Mod.getBeat(s, i, L?.language || 'ru');
          return `<h3>${uiText('Глава 2 · Эпизод', 'Chapter 2 · Episode')} ${i + 1} · ${beatLocalized.title}</h3><p>${beatLocalized.text}</p>${beatLocalized.chronicle ? `<p class="story-chronicle-past"><em>${beatLocalized.chronicle}</em></p>` : ''}<p><button type="button" class="story-archive-return-btn" data-novel-step="${i}">${uiText('📖 Открыть этот эпизод', '📖 Open this episode')}</button></p>`;
        }).join('');
      }
    }

    const total = ch1Html + ch2Html;
    return total || `<p>${uiText('Твоя история только начинается.', 'Your story is just beginning.')}</p>`;
  }

  function combatArenaView(s, foe) {
    const c = s.combat;
    const Combat = typeof IsekaiCombat !== 'undefined' ? IsekaiCombat : E.combat;
    const lang = L?.language || 'ru';
    const en = lang === 'en';
    const counter = { swift: uiText('Быстрый шаг', 'Swift Step'), armored: uiText('Пробивающий удар', 'Piercing Strike'), mystic: uiText('Духовный заслон', 'Spirit Ward') };
    const archetypes = { swift: uiText('Быстрый клинок', 'Swift Blade'), armored: uiText('Тяжёлый доспех', 'Heavy Armor'), mystic: uiText('Мистический барьер', 'Mystic Barrier') };
    const counterMatches = (({ swift: 'swift', armored: 'piercing', mystic: 'ward' })[c.foeType] === s.style);

    const pPhp = Math.max(0, Math.min(100, Math.round((c.playerHp / c.playerMaxHp) * 100)));
    const pPpoise = Math.max(0, Math.min(100, Math.round((c.playerPoise / c.playerMaxPoise) * 100)));
    const pPstam = Math.max(0, Math.min(100, Math.round((c.playerStamina / c.playerMaxStamina) * 100)));

    const ePhp = Math.max(0, Math.min(100, Math.round((c.enemyHp / c.enemyMaxHp) * 100)));
    const ePpoise = Math.max(0, Math.min(100, Math.round((c.enemyPoise / c.enemyMaxPoise) * 100)));

    const intentDef = Combat?.intents?.[c.enemyIntent];
    const intentTitle = c.enemyStunned
      ? uiText('Стойка пробита!', 'Guard broken!')
      : (intentDef ? (en ? intentDef.en : intentDef.ru) : c.enemyIntent);
    const intentDesc = c.enemyStunned
      ? uiText('Враг ошеломлён и пропускает ход!', 'Foe is staggered and skips turn!')
      : (intentDef ? (en ? intentDef.descEn : intentDef.descRu) : '');

    const counterHint = c.enemyStunned
      ? uiText('Враг беззащитен — атакуй!', 'Foe is defenseless — strike!')
      : c.enemyIntent === 'qi'
      ? uiText('Контратака: Быстрый выпад срывает ци!', 'Counter: Swift thrust ruptures qi!')
      : c.enemyIntent === 'defend'
      ? uiText('Контратака: Тяжёлый удар раскалывает щит!', 'Counter: Heavy strike shatters guard!')
      : c.enemyIntent === 'swift'
      ? uiText('Контратака: Парирование отражает серию!', 'Counter: Parry repels flurry!')
      : uiText('Угроза: Парируй или используй технику!', 'Danger: Parry or use technique!');

    let bannerHtml = '';
    if (c.finished) {
      if (c.victory) {
        bannerHtml = `<div class="duel-banner duel-banner-victory"><span class="duel-banner-title">⚔ ${uiText('БЛЕСТЯЩАЯ ПОБЕДА!', 'RESOUNDING VICTORY!')}</span><p>${uiText('Соперник повержен твоим боевым искусством. Награда начислена!', 'The opponent is defeated by your martial prowess. Rewards claimed!')}</p></div>`;
      } else {
        bannerHtml = `<div class="duel-banner duel-banner-defeat"><span class="duel-banner-title">💨 ${uiText('ТАКТИЧЕСКИЙ ОТХОД', 'TACTICAL RETREAT')}</span><p>${uiText('Силы иссякли. Защитный покров Жемчужины позволил безопасно отступить.', 'Endurance depleted. The Pearl’s veil covered your safe retreat.')}</p></div>`;
      }
    }

    const heroBuffs = [];
    if (c.evilGodAwakened) heroBuffs.push(`<span class="status-buff-badge buff-crimson">🔥 ${uiText('Врата Злого Бога (+35%)', 'Evil God Gate (+35%)')}</span>`);
    if (c.guardBuff) heroBuffs.push(`<span class="status-buff-badge buff-gold">🛡 ${uiText('Каменный покров (-50%)', 'Stone Mantle (-50%)')}</span>`);
    if (c.evasion) heroBuffs.push(`<span class="status-buff-badge buff-azure">💨 ${uiText('Шаг уклонения', 'Evasive Step')}</span>`);
    const heroBuffsHtml = heroBuffs.length ? `<div class="duel-status-row">${heroBuffs.join(' ')}</div>` : '';

    const heroCard = `
      <div class="duel-card duel-card-hero ${c.evilGodAwakened ? 'card-evil-god' : ''}">
        <div class="duel-card-header">
          <span class="duel-card-badge">${uiText('Твой герой', 'Your Hero')}</span>
          <h4>${s.playerName || uiText('Культиватор', 'Cultivator')}</h4>
          <small>${E.realmName(s.realm)} · ${uiText('Тело', 'Body')} ${fmt(s.body)}</small>
        </div>
        ${heroBuffsHtml}
        <div class="duel-gauges">
          <div class="gauge-group">
            <div class="gauge-label"><span>${uiText('Здоровье', 'Health')}</span><strong>${c.playerHp} / ${c.playerMaxHp}</strong></div>
            <div class="gauge-track track-hp"><div class="gauge-fill fill-hp" style="width:${pPhp}%"></div></div>
          </div>
          <div class="gauge-group">
            <div class="gauge-label"><span>${uiText('Стойка', 'Poise')}</span><strong>${c.playerPoise} / ${c.playerMaxPoise}</strong></div>
            <div class="gauge-track track-poise"><div class="gauge-fill fill-poise" style="width:${pPpoise}%"></div></div>
          </div>
          <div class="gauge-group">
            <div class="gauge-label"><span>${uiText('Выносливость', 'Stamina')}</span><strong>${c.playerStamina} / ${c.playerMaxStamina}</strong></div>
            <div class="gauge-track track-stamina"><div class="gauge-fill fill-stamina" style="width:${pPstam}%"></div></div>
          </div>
        </div>
      </div>`;

    const foeBuffs = [];
    if (c.bossPhaseTriggered) foeBuffs.push(`<span class="status-buff-badge buff-crimson">⚡ ${uiText('Ярость соперника', 'Rival Enrage')}</span>`);
    if (c.enemyStunned) foeBuffs.push(`<span class="status-buff-badge buff-gold">💥 ${uiText('Стойка пробита', 'Guard Broken')}</span>`);
    const foeBuffsHtml = foeBuffs.length ? `<div class="duel-status-row">${foeBuffs.join(' ')}</div>` : '';

    const foeCard = `
      <div class="duel-card duel-card-foe ${c.bossPhaseTriggered ? 'card-foe-enraged' : ''} ${c.enemyStunned ? 'card-foe-stunned' : ''}">
        <div class="duel-card-header">
          <span class="duel-card-badge badge-foe">${archetypes[c.foeType] || c.foeType}</span>
          <h4>${c.foeName}</h4>
          <small>${uiText('Базовая сила', 'Base Power')} ${fmt(c.foePower)}</small>
        </div>
        ${foeBuffsHtml}
        <div class="duel-gauges">
          <div class="gauge-group">
            <div class="gauge-label"><span>${uiText('Здоровье', 'Health')}</span><strong>${c.enemyHp} / ${c.enemyMaxHp}</strong></div>
            <div class="gauge-track track-hp"><div class="gauge-fill fill-hp" style="width:${ePhp}%"></div></div>
          </div>
          <div class="gauge-group">
            <div class="gauge-label"><span>${uiText('Стойка', 'Poise')}</span><strong>${c.enemyPoise} / ${c.enemyMaxPoise}</strong></div>
            <div class="gauge-track track-poise"><div class="gauge-fill fill-poise" style="width:${ePpoise}%"></div></div>
          </div>
          <div class="intent-box ${c.enemyStunned ? 'intent-stunned' : ''}">
            <div class="intent-header">
              <span class="intent-icon">${c.enemyStunned ? '💥' : '⚠'}</span>
              <strong>${uiText('Замысел врага:', 'Foe intent:')} ${intentTitle}</strong>
            </div>
            <p class="intent-desc">${intentDesc}</p>
            <div class="intent-hint"><small>${counterHint}</small></div>
          </div>
        </div>
      </div>`;

    const momentumCount = c.momentum || 0;
    const momentumHtml = `
      <div class="duel-momentum-strip">
        <div class="momentum-header">
          <span class="momentum-title">⚡ ${uiText('Боевой импульс', 'Combat Momentum')}</span>
          <span class="momentum-value ${momentumCount === 3 ? 'momentum-val-max' : ''}">${momentumCount} / 3</span>
        </div>
        <div class="momentum-pips">
          <span class="momentum-pip ${momentumCount >= 1 ? 'pip-lit' : ''}">✦</span>
          <span class="momentum-pip ${momentumCount >= 2 ? 'pip-lit' : ''}">✦</span>
          <span class="momentum-pip ${momentumCount >= 3 ? 'pip-lit pip-max' : ''}">✦</span>
        </div>
        ${momentumCount === 3 ? `<div class="momentum-cue">🔥 ${uiText('БОЕВОЙ РАЖ МАКСИМАЛЕН: Следующий выпад или удар станет сокрушающим критическим!', 'FULL MOMENTUM BURST: Next thrust or heavy strike triggers an explosive critical!')}</div>` : ''}
      </div>`;

    let deckHtml = '';
    if (c.finished) {
      deckHtml = `
        <div class="duel-deck duel-deck-finished">
          ${button('combat-retreat', '', uiText('Завершить поединок', 'Conclude duel'))}
        </div>`;
    } else {
      const pouchPills = (s.alchemy?.pouch || []).filter(Boolean);
      let pouchBeltHtml = '';
      if (pouchPills.length > 0) {
        const Alc = typeof IsekaiAlchemy !== 'undefined' ? IsekaiAlchemy : (E.alchemy || Alchemy);
        const pouchItems = pouchPills.map(rId => {
          const recipe = Alc?.RECIPES?.[rId];
          const count = s.alchemy?.inventory?.[rId] || 0;
          const name = recipe ? (en ? recipe.nameEn : recipe.nameRu) : rId;
          const icon = recipe?.icon || '💊';
          const canUse = count > 0 || (s.resources.pills || 0) > 0;
          return `<button type="button" class="combat-pouch-pill-btn" data-quick-action="combat-pill" data-pill-id="${rId}" ${canUse ? '' : 'disabled'}>
            <span class="pouch-pill-icon">${icon}</span>
            <span class="pouch-pill-name">${name}</span>
            <span class="pouch-pill-qty">×${count}</span>
          </button>`;
        }).join('');
        pouchBeltHtml = `
          <div class="combat-pouch-belt">
            <span class="combat-pouch-label">🎒 ${uiText('Боевой пояс пилюль:', 'Combat Pill Belt:')}</span>
            <div class="combat-pouch-slots">${pouchItems}</div>
          </div>`;
      }

      deckHtml = `
        <div class="duel-deck">
          <div class="deck-title"><span>${uiText('Выбери действие на раунд', 'Choose your round action')}</span></div>
          ${pouchBeltHtml}
          <div class="deck-actions">
            ${button('combat-act', 'thrust', uiText('Быстрый выпад', 'Swift thrust'))}
            ${button('combat-act', 'heavy', uiText('Тяжёлый удар', 'Heavy strike'))}
            ${button('combat-act', 'parry', uiText('Парирование', 'Parry'))}
            ${button('combat-act', 'technique', uiText('Боевая техника', 'Martial technique'))}
            ${button('combat-act', 'pearl', uiText('Жемчужина', 'Pearl'), !c.pearlUsed)}
            ${button('combat-act', 'pill', uiText('Пилюля', 'Pill'), s.resources.pills >= 1)}
            ${s.resources.pills === 0 ? `<button type="button" class="combat-alchemy-shortcut" id="combat-alchemy-btn">🧪 ${uiText('Котёл алхимии (0 пилюль)', 'Alchemy cauldron (0 pills)')}</button>` : ''}
          </div>
          <div class="deck-secondary">
            ${button('combat-retreat', '', uiText('Отступить', 'Retreat'))}
            ${button('fight', '', uiText('Авто-бой', 'Auto-fight'), s.cooldown === 0 && E.battlePower(s) >= foe.power)}
          </div>
        </div>`;
    }

    const logItems = (c.log || []).map(item => `
      <div class="combat-log-entry">
        <span class="combat-log-badge">${uiText('Раунд', 'Round')} ${item.round}</span>
        <p class="combat-log-text">${en ? item.en : item.ru}</p>
      </div>`).join('');

    const logHtml = `
      <div class="combat-chronicle">
        <div class="chronicle-header">
          <h4>${uiText('Хроника поединка', 'Combat Chronicle')}</h4>
          <small>${uiText('Записи духовного ока', 'Spiritual Eye records')}</small>
        </div>
        <div class="combat-log-stream">${logItems}</div>
      </div>`;

    const styleSelectorHtml = (s.stage >= 1 || (s.stage === 0 && s.storyStep >= 6)) ? `
      <div class="combat-style-bar">
        <span class="combat-style-label">${uiText('Стойка стиля:', 'Combat stance:')}</span>
        <div class="combat-style-pills">
          ${[
            ['balanced', uiText('☯ Равновесие', '☯ Balanced'), ''],
            ['swift', uiText('💨 Быстрый шаг', '💨 Swift Step'), 'swift'],
            ['piercing', uiText('🗡 Пробивающий удар', '🗡 Piercing Strike'), 'armored'],
            ['ward', uiText('🛡 Духовный заслон', '🛡 Spirit Ward'), 'mystic']
          ].map(([stId, stName, matchesEnemyType]) => {
            const isActive = s.style === stId;
            const isOptimal = foe && foe.type === matchesEnemyType;
            return `<button type="button" class="combat-style-btn ${isActive ? 'is-active' : ''} ${isOptimal ? 'is-counter' : ''}" data-quick-action="style" data-quick-value="${stId}" title="${isOptimal ? uiText('Контр-стиль против этого врага (+35%)', 'Counter-style against this foe (+35%)') : ''}">${stName}${isOptimal ? ' ✦' : ''}</button>`;
          }).join('')}
        </div>
      </div>` : '';

    return `
      <h2>${s.stage === 2 ? uiText('Турнир и соперники', 'Tournament and rivals') : uiText('Испытания пути', 'Trials of the path')}</h2>
      <div class="duel-arena ${c.evilGodAwakened ? 'evil-god-active' : ''}">
        <div class="duel-top-bar">
          <div class="duel-eyebrow">${uiText('РАУНД', 'ROUND')} ${c.round} · ${uiText('ТАКТИЧЕСКИЙ ПОЕДИНОК', 'TACTICAL DUEL')}</div>
          ${c.evilGodAwakened ? `<span class="evil-god-pill">🔥 ${uiText('Врата Злого Бога (+35%)', 'Evil God Gate (+35%)')}</span>` : ''}
          ${counterMatches ? `<span class="style-advantage-pill">✦ ${uiText('Преимущество стиля (+35%)', 'Style Advantage (+35%)')}</span>` : ''}
        </div>
        ${bannerHtml}
        <div class="duel-vs-grid">
          ${heroCard}
          <div class="duel-vs-divider"><span class="vs-emblem">⚔</span></div>
          ${foeCard}
        </div>
        ${momentumHtml}
        ${styleSelectorHtml}
        ${deckHtml}
        ${logHtml}
      </div>`;
  }

  function render() {
    const newlyEarned=E.achievements.list(s,L?.language||'ru').filter(a=>a.earned&&!seenMilestones.has(a.id));
    if(newlyEarned.length){newlyEarned.forEach(a=>seenMilestones.add(a.id));toast(uiText('Достижение: ','Achievement: ')+newlyEarned.slice(0,3).map(a=>a.name).join(' · '));}
    const content=$('content'),navigation=$('navigation');
    const openDetails=Array.from(content.querySelectorAll?.('details')||[]).map((node,i)=>node.open?i:-1).filter(i=>i>=0);
    Array.from(content.querySelectorAll?.('details[data-panel]')||[]).forEach(node=>heroPanels.set(node.dataset.panel,node.open));
    const focused=document.activeElement;
    const focusedPanel=focused?.tagName==='SUMMARY'?focused.parentElement?.dataset?.panel:null;
    const focusedSummary=Array.from(content.querySelectorAll?.('details summary')||[]).indexOf(focused);
    const focusData=focused&&(focused.dataset?.action!==undefined||focused.dataset?.quickAction!==undefined||focused.dataset?.tab!==undefined)&&((content.contains?.(focused))||(navigation.contains?.(focused)))?{action:focused.dataset?.action,quickAction:focused.dataset?.quickAction,value:focused.dataset?.value??focused.dataset?.quickValue,tab:focused.dataset?.tab}:null;
    let nextChapterHtml='',heroStory='',heroProgress='',heroActivities='',heroEquipment='',heroTraining='',heroTechniques='',heroRoutine='';
    $('identity-panel').hidden=!!s.playerName;
    document.documentElement.dataset.naming=s.playerName?'complete':'required';
    $('player-name').textContent=s.playerName||'';
    updateAudioUi();
    const stage = E.stages[s.stage], next = E.stages[s.stage];
    $('chapter').textContent = `ГЛАВА ${s.stage + 1} · ${stage.name.toUpperCase()}`;
    const heading=E.heroHeading(s);
    $('hero-title').innerHTML=h(`${heading.title}<br><em>${heading.accent}</em>`);
    $('hero-description').textContent = heading.description;
    $('life').textContent = `✧ ${E.realmName(s.realm)}`; $('souls').textContent = `⚔ Сила ${fmt(E.power(s))}`; $('day').textContent = `◷ День ${Math.floor(s.age / 3600) + 1}`;
    const available = ['gold', 'herbs', ...(s.found ? ['qi', 'relics'] : []), ...(s.stage >= 2 ? ['reputation'] : []), ...(s.stage >= 3 ? ['wood', 'ore', 'pills', 'influence'] : []), ...(s.stage >= 4 ? ['supplies'] : []), ...(s.stage >= 5 ? ['cosmic', 'worlds'] : [])];
    const visible = [...new Set([...available,...Object.keys(E.names).filter(k=>s.resources[k]>0)])];
    $('resources').innerHTML = h(view === 'data' ? `<div class="table-scroll" tabindex="0" role="region" aria-label="Текущие показатели"><table class="data-table resource-table"><caption>Текущие показатели</caption><thead><tr><th scope="col">Показатель</th><th scope="col">Значение</th></tr></thead><tbody>${visible.map(k => `<tr><th scope="row">${IsekaiDataView.labels[k]}</th><td>${fmt(s.resources[k])}</td></tr>`).join('')}</tbody></table></div>` : visible.map(k => {
      const rate = resourceRate(k);
      let rateHtml = '';
      if (rate > 0) {
        const rateText = rate >= 0.1
          ? `+${rate.toLocaleString(L?.locale || 'ru-RU', { maximumFractionDigits: 1 })}${uiText('/сек', '/s')}`
          : `+${(rate * 60).toLocaleString(L?.locale || 'ru-RU', { maximumFractionDigits: 1 })}${uiText('/мин', '/m')}`;
        rateHtml = `<div class="resource-rate rate-pos">${rateText}</div>`;
      }
      return `<div class="resource resource-${k}"><div class="label"><span class="resource-icon resource-icon-${k}">${resourceGlyphs[k] || '✦'}</span> ${E.names[k]}</div><div class="value">${fmt(s.resources[k])}</div>${rateHtml}</div>`;
    }).join(''));
    const compactResHtml = visible.map(k => {
      const rate = resourceRate(k);
      let rateHtml = '';
      if (rate > 0) {
        const rateText = rate >= 0.1
          ? `+${rate.toLocaleString(L?.locale || 'ru-RU', { maximumFractionDigits: 1 })}${uiText('/сек', '/s')}`
          : `+${(rate * 60).toLocaleString(L?.locale || 'ru-RU', { maximumFractionDigits: 1 })}${uiText('/мин', '/m')}`;
        rateHtml = ` <small class="compact-res-rate">${rateText}</small>`;
      }
      return `<span class="compact-res compact-res-${k}" title="${E.names[k]}: ${fmt(s.resources[k])}"><span class="compact-res-icon" aria-hidden="true">${resourceGlyphs[k] || '✦'}</span> <span class="compact-res-val">${fmt(s.resources[k])}</span>${rateHtml}</span>`;
    }).join(' ');
    if ($('hero-compact-resources')) $('hero-compact-resources').innerHTML = h(compactResHtml);
    if ($('hud-resources')) $('hud-resources').innerHTML = h(compactResHtml);
    const tabs = [['hero', 'Путь героя', 0], ['combat', 'Испытания', 0], ['world', 'Путешествия', 0], ['sect', 'Секта', 1], ['city', 'Город', 4], ['planet', 'Планета', 5], ['galaxy', 'Галактика', 6], ['legacy', 'Наследие', 7], ['roadmap', 'Горизонты', 0]];
    $('navigation').innerHTML = h(tabs.filter(t => t[2] <= s.stage).map(([id, title]) => `<button class="tab ${tab === id ? 'active' : ''} tab-${id}" data-tab="${id}" ${tab===id?'aria-current="page"':''}>${view === 'data' ? IsekaiDataView.tabs[id] : `<span class="tab-glyph">${tabGlyphs[id] || '✦'}</span><span class="tab-label">${title}</span>` + tabBadgeHtml(id)}</button>`).join(''));
    if ($('aside-tools')) {
      const showAlchemy = s.stage >= 1 || (s.alchemy?.recipes?.length > 0);
      $('aside-tools').innerHTML = h(`
        <div class="aside-tools-header">${uiText('ИНСТРУМЕНТЫ', 'TOOLS')}</div>
        <button type="button" class="aside-tool-btn" id="aside-map"><span class="tool-icon">🗺️</span><span class="tool-label">${uiText('Карта мира', 'World Map')}</span></button>
        <button type="button" class="aside-tool-btn" id="aside-fate"><span class="tool-icon">✦</span><span class="tool-label">${uiText('Древо Судьбы', 'Fate Tree')}</span></button>
        ${showAlchemy ? `<button type="button" class="aside-tool-btn" id="aside-alchemy"><span class="tool-icon">🧪</span><span class="tool-label">${uiText('Алхимия', 'Alchemy')}</span></button>` : ''}
      `);
    }
    let html = '';
    if (tab === 'hero') {
      if (['meditate', 'train', 'technique', 'work', 'explore', 'laws'].includes(s.activity)) lastMaintainedActivity = s.activity;
      const need = E.needed(s), bc = E.breakthroughCost(s);
      const Alc = typeof IsekaiAlchemy !== 'undefined' ? IsekaiAlchemy : (E.alchemy || Alchemy);
      const danDu = s.alchemy?.meridians?.danDu || 0;
      const purity = s.alchemy?.meridians?.purity !== undefined ? s.alchemy.meridians.purity : Math.max(0, 100 - danDu);
      const danDuStatus = Alc && Alc.getDanDuStatus ? Alc.getDanDuStatus(s, L?.language || 'ru') : { name: '', desc: '', badgeClass: '' };
      const canBreak = s.found && s.xp >= need && E.affordable(s, bc) && danDu < 80;
      const pillar1Html = `
        <div class="pillar-card pillar-spirit">
          <div class="pillar-header">
            <span class="pillar-icon">✧</span>
            <div>
              <span class="pillar-tag">${uiText('СТОЛП 1 · ДУХ И ДАНЬТЯНЬ', 'PILLAR 1 · SPIRIT & DANTIAN')}</span>
              <h3 class="pillar-title">${E.realmName(s.realm)}</h3>
            </div>
          </div>
          <div class="pillar-gauge">
            <div class="pillar-gauge-labels">
              <span>${uiText('Понимание ци', 'Qi Insight')}</span>
              <strong>${fmt(s.xp)} / ${fmt(need)}</strong>
            </div>
            <progress max="${need}" value="${s.xp}" aria-label="${uiText('Понимание для прорыва', 'Insight for breakthrough')}"></progress>
          </div>
          <div class="pillar-gauge meridian-gauge">
            <div class="pillar-gauge-labels">
              <span>${uiText('Чистота меридианов', 'Meridian Purity')}</span>
              <strong>${purity}% ${danDu > 0 ? `(${uiText('Дань Ду: ', 'Dan Du: ')}${danDu}/100)` : (s.alchemy?.meridians?.pearlPurges > 0 ? `(✧ ${uiText('Безупречные Небесные Меридианы', 'Immaculate Celestial Meridians')})` : `(${uiText('Чистые меридианы', 'Clean Meridians')})`)}</strong>
            </div>
            <progress class="${danDu === 0 ? 'progress-pure' : (danDu > 50 ? 'progress-toxic' : 'progress-warning')}" max="100" value="${purity}" aria-label="${uiText('Чистота меридианов', 'Meridian purity')}"></progress>
          </div>
          <div class="pillar-meridian-badge ${danDuStatus.badgeClass}">
            <span>${danDuStatus.name}</span> · <small>${danDuStatus.desc}</small>
          </div>
          <div class="pillar-substats">
            <span class="pillar-substat">✦ ${uiText('Скорость развития: ', 'Cultivation speed: ')}<strong>×${fmt(E.speed(s))}</strong></span>
            <span class="pillar-substat">✧ ${uiText('Спокойствие разума: ', 'Mind tranquility: ')}<strong>${fmt(s.calm)} / 100</strong></span>
          </div>
          <p class="pillar-hint">${danDu >= 80 ? uiText('Кризис Дань Ду: прорыв заблокирован! Очисти меридианы Небесной Жемчужиной.', 'Dan Du crisis: breakthrough blocked! Purge meridians with the Sky Poison Pearl.') : (s.found ? uiText(`Для прорыва: ${costs(bc)}. На пределе понимание перестаёт накапливаться.`, `For breakthrough: ${costs(bc)}. At the cap, insight ceases to accumulate.`) : uiText(`Исследуй руины: ${duration(s.explored)} / 10 мин до первой находки.`, `Explore ruins: ${duration(s.explored)} / 10 min to first find.`))}</p>
          <div class="pillar-action">
            ${danDu > 0 ? button('meridian-purge', '', uiText('Очистить Жемчужиной', 'Purge with Pearl'), (s.resources.qi || 0) >= 15) : ''}
            ${button('breakthrough', '', uiText('Совершить прорыв', 'Perform breakthrough'), canBreak)}
          </div>
        </div>`;

      const bodyCap = (s.realm + 1) * 10;
      const stamMax = E.staminaMax(s);
      const stamRec = E.staminaRecovery(s);
      const pillar2Html = `
        <div class="pillar-card pillar-body">
          <div class="pillar-header">
            <span class="pillar-icon">🫀</span>
            <div>
              <span class="pillar-tag">${uiText('СТОЛП 2 · ТЕЛО И СОСУД', 'PILLAR 2 · BODY & VESSEL')}</span>
              <h3 class="pillar-title">${uiText('Закалка сосуда', 'Vessel Tempering')}</h3>
            </div>
          </div>
          <div class="pillar-gauge">
            <div class="pillar-gauge-labels">
              <span>${uiText('Тело', 'Body')}</span>
              <strong>${fmt(s.body)} / ${bodyCap}</strong>
            </div>
            <progress max="${bodyCap}" value="${Math.min(bodyCap, s.body)}" aria-label="${uiText('Закалка тела', 'Body tempering')}"></progress>
          </div>
          <div class="pillar-gauge">
            <div class="pillar-gauge-labels">
              <span>${uiText('Выносливость', 'Stamina')}</span>
              <strong>${fmt(s.stamina)} / ${stamMax}</strong>
            </div>
            <progress max="${stamMax}" value="${Math.min(stamMax, s.stamina)}" aria-label="${uiText('Выносливость', 'Stamina')}"></progress>
          </div>
          <div class="pillar-substats">
            <span class="pillar-substat">⚡ +${fmt(stamRec)} ${uiText('выносл./сек', 'stam./s')}</span>
            <span class="pillar-substat">🏛 ${uiText('Заказов: ', 'Contracts: ')}<strong>${s.employment.completed}</strong></span>
          </div>
          <p class="pillar-hint">${uiText("Тело растёт от физических действий, работы и двигательных техник. Медитация развивает спокойствие, понимание и энергию, но не тело.", "The body grows through physical actions, work and movement techniques. Meditation develops calm, understanding and energy, but not the body.")}</p>
        </div>`;

      const masteryCap = (s.realm + 1) * 10;
      const activeTech = s.cultivation.active ? E.techniques[s.cultivation.active] : null;
      const activeTechName = activeTech ? t(activeTech.name) : uiText('Нет активной техники', 'No active technique');
      const weaponCost = { gold: Math.ceil(40 * 1.8 ** s.weapon), ...(s.stage >= 3 ? { ore: Math.ceil(10 * 1.4 ** s.weapon) } : {}) };
      const canUpgradeWeapon = s.weapon < (s.realm + 1) * 2 && E.affordable(s, weaponCost);
      const styleControls = s.stage >= 1 ? `
        <div class="pillar-styles-block">
          <span class="pillar-subhead">${uiText('Боевой стиль (+35%):', 'Combat style (+35%):')}</span>
          <div class="actions">
            ${Object.entries({ balanced: uiText('Равновесие', 'Balanced'), swift: uiText('Быстрый шаг', 'Swift step'), piercing: uiText('Пробивающий удар', 'Piercing strike'), ward: uiText('Духовный заслон', 'Spiritual ward') }).map(([k, v]) => button('style', k, (s.style === k ? '● ' : '') + v)).join('')}
          </div>
        </div>
        <div class="pillar-weapon-block">
          ${button('weapon', '', uiText(`Улучшить оружие · ур. ${s.weapon}`, `Upgrade weapon · lvl ${s.weapon}`), canUpgradeWeapon)}
          <small class="pillar-cost">${uiText('Цена: ', 'Cost: ')}${costs(weaponCost)}</small>
        </div>` : '';

      const pillar3Html = `
        <div class="pillar-card pillar-dao">
          <div class="pillar-header">
            <span class="pillar-icon">⚔</span>
            <div>
              <span class="pillar-tag">${uiText('СТОЛП 3 · БОЕВОЕ ДАО', 'PILLAR 3 · MARTIAL DAO')}</span>
              <h3 class="pillar-title">${uiText('Мастерство и Оружие', 'Mastery & Arsenal')}</h3>
            </div>
          </div>
          <div class="pillar-gauge">
            <div class="pillar-gauge-labels">
              <span>${uiText('Техника', 'Mastery')}</span>
              <strong>${fmt(s.mastery)} / ${masteryCap}</strong>
            </div>
            <progress max="${masteryCap}" value="${Math.min(masteryCap, s.mastery)}" aria-label="${uiText('Мастерство техник', 'Technique mastery')}"></progress>
          </div>
          <div class="pillar-substats">
            <span class="pillar-substat">🗡 ${uiText('Оружие: ', 'Weapon: ')}<strong>ур. ${s.weapon}</strong></span>
            <span class="pillar-substat">📜 ${uiText('Активно: ', 'Active: ')}<strong>${activeTechName}</strong></span>
          </div>
          ${styleControls}
        </div>`;

      heroProgress = `
        <section class="cultivation-chamber">
          <div class="section-head">
            <h3>${uiText('Три Столпа Культивации', 'Three Pillars of Cultivation')}</h3>
            <small>${uiText('Гармония Духа, Тела и Боевого Дао', 'Harmony of Spirit, Vessel & Martial Dao')}</small>
          </div>
          <div class="three-pillars-grid">
            ${pillar1Html}
            ${pillar2Html}
            ${pillar3Html}
          </div>
        </section>`;
      heroEquipment = '';
      heroActivities = `<h3>${uiText('Одно занятие — один путь', 'Choose your idle activity')}</h3><p class="intro">${uiText('Занятие продолжается офлайн до 24 часов. Его можно сменить в любой момент.', 'Your activity continues offline for up to 24 hours. You can change it at any time.')}</p><div class="cards">${Object.entries(E.activities).filter(([k]) => E.activityVisible(s,k)).map(([k, a]) => card(a.name, a.desc + ' '+E.taskPracticeText(k,L?.language||'ru') + (['meditate', 'train', 'technique', 'laws'].includes(k) ? ` ${uiText('Скорость развития', 'Development speed')} ×${fmt(E.speed(s))}.` : ''), button('activity', k, s.activity === k ? uiText('● Текущее занятие', '● Current activity') : uiText('Выбрать занятие', 'Choose activity'), s.activity !== k))).join('')}</div>`;
      if (s.stage < 7) nextChapterHtml = `<div class="rebirth"><div class="eyebrow">${uiText('БЛИЖАЙШАЯ ЦЕЛЬ', 'NEXT CHAPTER')} · ${E.stages[s.stage + 1].name}</div><p>${uiText('Ступень', 'Realm')} ${s.realm} / ${next.realm} · ${s.stage===0?uiText('Личный прорыв и помощь обозу: победа, 3 признания или рекомендация Вэя.', 'Personal breakthrough and helping cart: victory, 3 recognitions or Wei’s recommendation.'):uiText(`Победы ${s.wins} / ${next.wins} или признание ${E.world.recognition(s)} / ${E.world.recognitionNeeded(s)}`, `Victories ${s.wins} / ${next.wins} or recognition ${E.world.recognition(s)} / ${E.world.recognitionNeeded(s)}`)}</p><p>${uiText('Требуется: ', 'Required: ')}${costs(next.cost)}${!s.found ? uiText(' · найти древнюю технику', ' · find ancient technique') : ''}</p>${button('advance', '', uiText('Начать следующую главу', 'Start next chapter'), E.canAdvance(s))}</div>`;
      if(s.stage===0 || s.stage===1) {
        const isCh2 = s.stage === 1;
        const curStep = isCh2 ? (s.chapterTwoStep || 0) : s.storyStep;
        const isViewingArchive = novelViewStep !== null && novelViewStep < curStep;
        const activeStep = isViewingArchive ? novelViewStep : curStep;
        const beat = isCh2
          ? (E.chapterTwoBeat ? E.chapterTwoBeat(s, activeStep, L?.language || 'ru') : null)
          : (isViewingArchive ? E.storyBeat(s, activeStep) : E.storyBeat(s));
        const novelControls=`<div class="novel-controls"><button type="button" id="novel-font-btn" class="novel-control-btn ${novelSerif?'active':''}" title="${uiText('Шрифт с засечками / без засечек','Serif / Sans font')}" aria-label="${uiText('Шрифт','Font')}"><span class="novel-font-glyph ${novelSerif?'glyph-serif':'glyph-sans'}" aria-hidden="true">Aa</span></button><button type="button" id="novel-size-btn" class="novel-control-btn ${novelLarge?'active':''}" title="${uiText('Размер текста','Text size')}" aria-label="${uiText('Размер текста','Text size')}"><span class="novel-size-glyph" aria-hidden="true"><span class="glyph-sm">A</span><span class="glyph-lg">A</span></span></button></div>`;
        let storyHtml;
        if (isViewingArchive && beat) {
          const dec = !isCh2 ? stepDecisionInfo(s, activeStep) : null;
          const decisionHtml = dec ? `
          <div class="story-decision-card">
            <div class="story-decision-header">
              <span class="story-decision-icon">✦</span>
              <span class="story-decision-badge">${uiText('СДЕЛАННЫЙ ВЫБОР', 'CHOICE MADE')}</span>
              <strong class="story-decision-title">${dec.title}</strong>
            </div>
            <p class="story-decision-desc">${dec.desc}</p>
            ${dec.detail ? `<p class="story-decision-detail">${dec.detail}</p>` : ''}
          </div>` : '';

          const eyebrow = isCh2
            ? uiText(`ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 1 · ГЛАВА 2 · ЭПИЗОД ${activeStep+1} · АРХИВ`, `AGAINST THE GODS · VOL. 1 · CH. 2 · EPISODE ${activeStep+1} · ARCHIVE`)
            : uiText(`ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 1 · ГЛАВА ${activeStep+1} · АРХИВ`, `AGAINST THE GODS · VOL. 1 · CH. ${activeStep+1} · ARCHIVE`);

          const currentBeatTitle = isCh2
            ? (E.chapterTwoBeat ? E.chapterTwoBeat(s, curStep, L?.language || 'ru')?.title || '' : '')
            : (E.storyBeat(s)?.title || '');

          storyHtml = `<article class="story-panel story-novel-panel ${novelSerif?'novel-serif':''} ${novelLarge?'novel-large':''}">
            <div class="eyebrow story-novel-eyebrow">${eyebrow}</div>
            ${novelStepperHtml(s, activeStep)}
            <div class="story-archive-banner">
              <div class="story-archive-badge"><span class="archive-icon">📜</span> <strong>${uiText('Архив прочитанной главы', 'Archived Chapter')}</strong> · ${uiText('Все сделанные выборы уже запечатлены в твоей судьбе.', 'Your choices have already been woven into destiny.')}</div>
              <button type="button" class="btn-fate-tree-link-small" id="story-open-fate-tree"><span class="fate-icon">✦</span> ${uiText('Древо Судьбы', 'Fate Tree')}</button>
              <button type="button" class="story-archive-return-btn" data-novel-step="${curStep}">${uiText('↩ К текущей главе', '↩ Return to current')}</button>
            </div>
            <div class="story-header-row">
              <h2>${beat.title}</h2>
              ${novelControls}
            </div>
            <p class="story-narrative">${beat.text}</p>
            ${decisionHtml}
            ${beat.chronicle ? `<div class="story-chronicle"><span class="story-chronicle-badge">${uiText("ХРОНИКА ГЛАВЫ","CHAPTER CHRONICLE")}</span><p>${beat.chronicle}</p></div>` : ""}
            ${systemBoxHtml(s, beat, activeStep, true)}
            <div class="story-archive-bottom-actions">
              <button type="button" class="btn-primary story-archive-return-btn" data-novel-step="${curStep}">
                ${uiText(`↩ Вернуться к текущей главе (${curStep+1} · ${currentBeatTitle})`, `↩ Return to current chapter (${curStep+1} · ${currentBeatTitle})`)}
              </button>
            </div>
            <details data-panel="story-archive"><summary>${uiText('Пройденные события','Past events')}</summary><div class="fate-tree-archive-entry"><button type="button" class="btn-fate-tree-link" id="story-open-fate-tree-archive"><span class="fate-icon">✦</span> <strong>${uiText('Древо Судьбы и Хроника Кармы', 'Fate Tree & Karma Chronicle')}</strong> · ${uiText('Посмотреть древо выборов, узы с персонажами и открытые фракции', 'Inspect choice tree, NPC bonds and unlocked factions')}</button></div>${renderArchiveList(s)}</details>
          </article>`;
        } else if (beat) {
          const eyebrow = isCh2
            ? uiText(`ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 1 · ГЛАВА 2 · ЭПИЗОД ${curStep+1}`, `AGAINST THE GODS · VOL. 1 · CH. 2 · EPISODE ${curStep+1}`)
            : uiText(`ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 1 · ГЛАВА ${s.storyStep+1}`, `AGAINST THE GODS · VOL. 1 · CH. ${s.storyStep+1}`);

          let actionButtons = '';
          if (isCh2) {
            actionButtons = button('story', '', beat.button, beat.ready(s));
          } else {
            if (s.storyStep === 0) {
              actionButtons = `<div class="cards prologue-cards">${Object.entries(beat.prologueChoices).map(([k,c])=>card(uiText(c.name,c.enName),uiText(c.desc,c.enDesc),button('story',k,uiText(c.name,c.enName),beat.ready(s)))).join('')}</div>`;
            } else if (s.storyStep === 6) {
              actionButtons = Object.entries(E.firstRoutes).map(([k,label])=>button('story',k,label,beat.ready(s)&&E.firstRouteReady(s,k))).join('');
            } else if (s.storyStep === 7 && !s.world.admission) {
              actionButtons = `<div class="cards sect-cards">${Object.entries(beat.sectChoices).map(([k,c])=>{const unlocked=c.ready(s);return card(uiText(c.name,c.enName),`${uiText(c.role,c.enRole)}. ${uiText(c.desc,c.enDesc)}`,button('story',k,uiText(c.name,c.enName),beat.ready(s)&&unlocked)+(unlocked?'':`<small class="sect-lock">${uiText(c.reason,c.enReason)}</small>`),uiText(`Дар: ${c.gift}`,`Gift: ${c.enGift}`),`sect-card-${k}`,sectEmblems[k]||'');}).join('')}</div>`;
            } else {
              actionButtons = button('story', '', beat.button, beat.ready(s) && (s.storyStep !== 7 || !s.world.admission));
            }
          }

          storyHtml = `<article class="story-panel story-novel-panel ${novelSerif?'novel-serif':''} ${novelLarge?'novel-large':''}">
            <div class="eyebrow story-novel-eyebrow">${eyebrow}</div>
            ${novelStepperHtml(s, curStep)}
            <div class="story-header-row">
              <h2>${beat.title}</h2>
              ${novelControls}
            </div>
            <p class="story-narrative">${beat.text}</p>
            ${beat.chronicle ? `<div class="story-chronicle"><span class="story-chronicle-badge">${uiText("ХРОНИКА ГЛАВЫ","CHAPTER CHRONICLE")}</span><p>${beat.chronicle}</p></div>` : ""}
            ${systemBoxHtml(s, beat, curStep, false)}
            ${actionButtons}
            <details data-panel="story-archive"><summary>${uiText('Пройденные события','Past events')}</summary><div class="fate-tree-archive-entry"><button type="button" class="btn-fate-tree-link" id="story-open-fate-tree-archive"><span class="fate-icon">✦</span> <strong>${uiText('Древо Судьбы и Хроника Кармы', 'Fate Tree & Karma Chronicle')}</strong> · ${uiText('Посмотреть древо выборов, узы с персонажами и открытые фракции', 'Inspect choice tree, NPC bonds and unlocked factions')}</button></div>${renderArchiveList(s)}</details>
          </article>`;
        } else {
          const eyebrow = isCh2
            ? uiText("ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 1 · ФИНАЛ ВРАТ СЕКТЫ", "AGAINST THE GODS · VOL. 1 · FINALE OF SECT GATES")
            : uiText("ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 1 · ЭПИЛОГ", "AGAINST THE GODS · VOL. 1 · EPILOGUE");
          const epilogueTitle = isCh2
            ? uiText("Первый ученик внешнего круга", "Top Disciple of the Outer Circle")
            : uiText("Письмо через перевал", "A path beyond the village");
          const epilogueNarrative = isCh2
            ? uiText("Турнир завершён, лазурный пояс получен. Врата внутреннего двора распахнуты навстречу истинным тайнам культивации.", "The tournament is won, the azure sash bestowed. The inner gates swing wide toward the true mysteries of cultivation.")
            : E.storyBeat(s, 6).text;

          storyHtml = `<article class="story-panel story-novel-panel ${novelSerif?'novel-serif':''} ${novelLarge?'novel-large':''}">
            <div class="eyebrow story-novel-eyebrow">${eyebrow}</div>
            <div class="story-header-row"><h2>${epilogueTitle}</h2>${novelControls}</div>
            <p>${epilogueNarrative}</p>
            ${systemBoxHtml(s, null)}
          </article>`;
        }
        heroStory=storyHtml;
      }
      heroTraining=`<section class="clicker-panel"><div class="section-head"><h3>Маленькие шаги — твоя сила</h3><small>Выносливость ${fmt(s.stamina)} / ${E.staminaMax(s)}</small></div><progress value="${s.stamina}" max="${E.staminaMax(s)}" aria-label="Выносливость"></progress><p class="intro">+${fmt(E.staminaRecovery(s))} ${t('выносливости/сек.')} ${uiText("Активные действия прерывают фоновое занятие. После них выбери занятие заново.","Manual actions interrupt your background activity. Select an activity again afterwards.")} Спокойствие: ${fmt(s.calm)} / 100.</p><div class="cards">${Object.entries(E.clicks).filter(([k])=>E.clickVisible(s,k)&&(!['sweep','haul'].includes(k)||E.canWorkOrder(s))).map(([k,c])=>card(c.name,c.desc+' '+E.taskPracticeText(k,L?.language||'ru'),button('click',k,'Выполнить',E.canClick(s,k)),`${c.stamina} выносливости · выполнено ${s.clicks[k]}`)).join('')}</div><p class="intro">Пауза между действиями — 0,6 сек. Тело и понимание сохраняют свои пределы; осмотр развалин доступен до находки.</p></section>`;
    }
    if (tab === 'world') html = worldView();
    if(tab==='hero')heroRoutine=`<section class="story-panel"><h3>${uiText('От упражнений к распорядку','From exercises to a routine')}</h3><p>${E.automationHint(s,L?.language||'ru')}</p></section><p class="intro">${!E.activityRunning(s)?'Приостановлено: смени место или занятие. ':''}${uiText("Работа требует нужного места. В пути, во время ручных действий и боя медитация и практика прерываются; они не возобновляются автоматически.","Work requires its assigned location. Travel, manual actions and combat interrupt meditation and practice; they do not resume automatically.")}</p>`;
    if(tab==='hero')heroTechniques=`<section class="workers"><h3>Техники и наставники</h3><p class="intro">Знакомства открывают разные знания. Изученные техники остаются с тобой; можно свободно менять активную. Эффект даёт одна выбранная техника. Для следующего ранга занимайся «Осваивать технику», затем оплати изучение. Физическая работа и помощь также укрепляют тело.</p><div class="cards">${Object.entries(E.techniques).filter(([k,t])=>t.available(s)||!!s.cultivation.learned[k]).map(([k,t])=>{const learned=s.cultivation.learned[k],known=t.available(s)||!!learned;return card(t.name,`${E.techniqueSource(s,k)}. ${t.desc}${t.practiceBody?uiText(" Практика этой двигательной техники также укрепляет тело и расходует выносливость."," Practicing this movement technique also strengthens the body and uses stamina."):""}`,known?button('learn-technique',k,learned?'Повысить ранг':'Изучить',E.canLearn(s,k))+(learned?button('equip-technique',k,s.cultivation.active===k?'● Активна':'Применить',s.cultivation.active!==k):''):'<small>Найди источник знаний</small>',known?`Ранг ${learned?.rank||0}/5 · ${costs(E.techniqueCost(s,k))}${learned&&learned.rank<5?` · освоение ${fmt(learned.progress)}/${E.techniqueNeeded(learned.rank)} сек`:''}`:'Не изучена');}).join('')}</div></section>`;
    if (tab === 'hero') {
      const fold=(id,title,body)=>body?`<details class="hero-fold" data-panel="${id}"><summary>${title}</summary><div class="hero-fold-body">${body}</div></details>`:'';
      const isStoryActive = (s.stage === 0 && E.storyBeat(s)) || (s.stage === 1 && E.chapterTwoBeat && E.chapterTwoBeat(s, s.chapterTwoStep));
      const hint=E.guidance(s,isStoryActive?'story':'advance','',L?.language||'ru');
      const quickGoalBtn = `<button type="button" class="goal-direct-btn" id="goal-quick-nav" title="${uiText('Перейти к текущей директиве', 'Jump to current directive')}">🎯 ${uiText('К цели', 'To goal')}</button>`;
      const overview=`<section class="hero-overview" data-hero-section="overview"><div class="hero-overview-inner"><span class="hero-overview-badge">${uiText('Ближайшая цель','Current goal')}</span><span class="hero-overview-goal">${hint||t(E.stages[s.stage].subtitle)}</span>${quickGoalBtn}</div></section>`;
      const order=s.employment.order;
      const work=order?`<section class="hero-current-order" data-hero-section="order">${employmentView()}${E.workMastered(s,order.kind)?button('activity','work',uiText('Работать над заказом','Work on contract'),s.activity!=='work'&&E.canActivity(s,'work')):''}${!E.canWorkOrder(s)&&!s.world.journey?button('travel',order.place||'village',uiText('Вернуться к месту работы','Return to the workplace'),E.world.canTravel(s,order.place||'village')):''}</section>`:'';
      const scene=E.world.current(s);
      const meeting=scene?`<section class="hero-meeting"><strong>${E.world.sceneText(scene,'title',L?.language||'ru',s)}</strong><p>${uiText('Встреча ждёт твоего решения.','An encounter awaits your decision.')}</p><button data-tab="world">${uiText('Вернуться к встрече','Return to encounter')}</button></section>`:'';
      const resumeAct = (s.activity === 'rest' && lastMaintainedActivity && lastMaintainedActivity !== 'rest') ? lastMaintainedActivity : s.activity;
      const pausedBanner = !E.activityRunning(s) ? `<div class="activity-paused-banner"><span>⏸ ${uiText('Занятие приостановлено (ручное действие, путь или бой).', 'Activity paused (manual action, journey or combat).')}</span><button type="button" class="quick-resume-btn" data-quick-action="activity" data-quick-value="${resumeAct}">▶ ${uiText('Возобновить: ', 'Resume: ') + t(E.activities[resumeAct]?.name || '')}</button><label class="auto-resume-toggle" title="${uiText('Автоматически возвращаться к медитации после упражнений', 'Automatically resume routine after manual training')}"><input type="checkbox" id="auto-resume-cb" ${autoResumeRoutine ? 'checked' : ''}> ${uiText('Авто-возврат', 'Auto-resume')}</label></div>` : '';
      html=overview+work+meeting+heroStory+`<section data-hero-section="actions">${pausedBanner}${heroTraining}${heroActivities}${techniqueActionsView()}</section>`+heroProgress+heroTechniques+heroEquipment+nextChapterHtml;
      html+=fold('paths',uiText('Способы развития','Ways to grow'),developmentView());
      html+=!order?fold('work',uiText('Доступная работа','Available work'),employmentView()):'';
      html+=fold('achievements',uiText('Маленькие победы','Small victories'),achievementsView());
      html+=fold('vows',uiText('Необычные пути и обеты','Unusual paths and vows'),challengesView());
      html+=fold('reference',uiText('Распорядок и правила занятий','Routine and activity rules'),heroRoutine);

    }

    if (tab === 'combat') {
      const foe = E.enemy(s), counter = { swift: uiText('Быстрый шаг', 'Swift Step'), armored: uiText('Пробивающий удар', 'Piercing Strike'), mystic: uiText('Духовный заслон', 'Spirit Ward') };
      const isShrouded = s.stage === 0 && (s.storyStep || 0) < 6;
      if (s.combat) {
        html = combatArenaView(s, foe);
      } else if (isShrouded) {
        html = `<h2>${uiText('Испытания пути · Завеса тумана', 'Trials of the Path · Shroud of Mist')}</h2>
        <p class="intro">${uiText('Твои меридианы скованы, а духовное восприятие ещё дремлет. Пока ты слаб и держишься очага, опасности внешнего мира сокрыты пеленой. Закали тело и открой каналы ци, чтобы встретить грядущую угрозу.', 'Your meridians are sealed and spiritual perception slumbers. While you remain frail by the hearth, the world’s perils remain veiled. Temper your body and unseal your qi channels to face the looming danger.')}</p>
        <div class="rebirth combat-duel combat-shrouded">
          <div class="eyebrow">${uiText('СОКРЫТАЯ УГРОЗА', 'VEILED THREAT')}</div>
          <h2>${uiText('Неведомая опасность', 'Unknown Peril')}</h2>
          <p>${uiText('Сила соперника:', 'Rival power:')} <strong>???</strong></p>
          <p>${uiText('Твоя сила в этом бою:', 'Your power in this fight:')} ${fmt(E.battlePower(s))}. ${uiText('Подходящий стиль:', 'Recommended style:')} ${uiText('Неизвестно', 'Unknown')}.</p>
          <p>${uiText('Награда:', 'Reward:')} ${uiText('Раскроется в схватке', 'Revealed in battle')}.</p>
          <div class="combat-actions-row">
            ${button('combat-start', '', uiText('Вступить в поединок', 'Enter tactical duel'), false)}
            ${button('fight', '', uiText('Быстрый бой', 'Quick fight'), false)}
          </div>
          <p class="intro">${uiText('Побед:', 'Victories:')} ${s.wins}. ${uiText('Противник проявит себя, когда ты столкнёшься с угрозой на пути.', 'The adversary will reveal themselves when a threat blocks your path.')}</p>
        </div>`;
      } else {
        let foeTitle = foe.name;
        let alertBanner = '';
        if (s.stage === 0 && s.storyStep === 6) {
          if (foeTitle === 'Дорожный разбойник') foeTitle = uiText('Головорез Белого Клыка', 'White Fang Thug');
          alertBanner = `<div class="combat-alert-banner">⚔ ${uiText('ОПАСНОСТЬ У ДЕРЕВЕНСКОГО МОСТА · Засада банды Белого Клыка', 'DANGER AT VILLAGE BRIDGE · White Fang Bandits Ambush')}</div>`;
        } else if (s.stage === 1 && s.chapterTwoStep === 6 && E.chapterTwo) {
          const scion = E.chapterTwo.beats?.[6]?.scionName ? E.chapterTwo.beats[6].scionName(s, L?.language || 'ru') : null;
          if (scion) foeTitle = scion;
        }
        const heading = s.stage === 1 ? uiText('Арена чести и турниры секты', 'Honor Arena and Sect Tournaments') : (s.stage === 2 ? uiText('Турнир и соперники', 'Tournament and rivals') : uiText('Испытания пути', 'Trials of the path'));
        const stanceBarHtml = (s.stage >= 1 || (s.stage === 0 && s.storyStep >= 6)) ? `
          <div class="combat-style-bar">
            <span class="combat-style-label">${uiText('Стойка стиля:', 'Combat stance:')}</span>
            <div class="combat-style-pills">
              ${[
                ['balanced', uiText('☯ Равновесие', '☯ Balanced'), ''],
                ['swift', uiText('💨 Быстрый шаг', '💨 Swift Step'), 'swift'],
                ['piercing', uiText('🗡 Пробивающий удар', '🗡 Piercing Strike'), 'armored'],
                ['ward', uiText('🛡 Духовный заслон', '🛡 Spirit Ward'), 'mystic']
              ].map(([stId, stName, matchesEnemyType]) => {
                const isActive = s.style === stId;
                const isOptimal = foe && foe.type === matchesEnemyType;
                return `<button type="button" class="combat-style-btn ${isActive ? 'is-active' : ''} ${isOptimal ? 'is-counter' : ''}" data-quick-action="style" data-quick-value="${stId}" title="${isOptimal ? uiText('Контр-стиль против этого врага (+35%)', 'Counter-style against this foe (+35%)') : ''}">${stName}${isOptimal ? ' ✦' : ''}</button>`;
              }).join('')}
            </div>
          </div>` : '';
        html = `${alertBanner}<h2>${heading}</h2><p class="intro">${uiText('Соперники остаются сильными, пока ты не подготовишь тело, технику и оружие. Результат предсказуем: случайность не отнимает награды.', 'Train your body, techniques and weapons to overcome stronger rivals. Outcomes are predictable; randomness does not take your rewards away.')}</p><div class="rebirth combat-duel"><div class="eyebrow">${uiText('СЛЕДУЮЩИЙ СОПЕРНИК', 'NEXT RIVAL')}</div><h2>${foeTitle}</h2><p>${uiText('Сила соперника:', 'Rival power:')} <strong>${fmt(foe.power)}</strong></p><p>${uiText('Твоя сила в этом бою:', 'Your power in this fight:')} ${fmt(E.battlePower(s))}. ${uiText('Подходящий стиль:', 'Recommended style:')} ${counter[foe.type]}.</p><p>${uiText('Награда:', 'Reward:')} ${fmt(30 * 1.8 ** s.wins)} ${uiText('монет', 'coins')} · ${(s.wins + 1) * 10} ${uiText('трав', 'herbs')} · 1 ${uiText('осколок', 'shard')}.</p>${stanceBarHtml}<div class="combat-actions-row">${button('combat-start', '', uiText('Вступить в поединок', 'Enter tactical duel'), s.cooldown === 0 && E.battlePower(s) >= foe.power)} ${button('fight', '', s.cooldown > 0 ? `${uiText('Отдых: ', 'Rest: ')}${duration(s.cooldown)}` : uiText('Быстрый бой', 'Quick fight'), s.cooldown === 0 && E.battlePower(s) >= foe.power)}</div><p class="intro">${uiText('Побед:', 'Victories:')} ${s.wins}. ${uiText('После боя — 5 минут отдыха.', 'Rest for 5 minutes after a fight.')}</p></div>`;
      }
    }
    if (tab === 'sect') {
      html = (s.world.admission?schoolView(s.world.admission):'')+`<h2>${s.stage === 2 ? 'Жизнь ученика' : 'Твоя секта'}</h2><p class="intro">${s.stage === 2 ? 'Выполняй поручения, заслуживай репутацию и получай доступ к знаниям.' : 'Распредели последователей. Алхимикам нужны травы и духовная энергия; без них производство останавливается.'}</p>`;
      html += card('Библиотека · ур. ' + s.study, 'Каждое изучение увеличивает скорость личного развития на 15%. Максимум 10.', button('study', '', 'Изучить трактат', s.study < 10 && E.affordable(s, { reputation:20*(s.study+1), gold:100*(s.study+1) })), costs({reputation:20*(s.study+1),gold:100*(s.study+1)}));
      if (s.stage >= 3) { const used = Object.values(s.workers).reduce((a, b) => a + b, 0); html += `<div class="workers"><h3>Последователи ${s.population} / ${3 + s.buildings.dorm * 3} · свободны ${s.population - used}</h3>${button('recruit', '', 'Пригласить · 100 монет, 20 трав', s.population < 3 + s.buildings.dorm * 3 && E.affordable(s, {gold:100,herbs:20}))}${Object.entries(E.jobs).map(([k, name]) => `<div class="worker"><span>${name}</span><div>${button('worker', `${k}:-1`, '−', s.workers[k] > 0)} ${s.workers[k]} ${button('worker', `${k}:1`, '+', used < s.population)}</div></div>`).join('')}<p class="intro">На работника: сад +2,4 трав/мин; лес +6 древесины/мин; шахта +3,6 руды/мин; алхимия +0,3 пилюли/мин (5 трав и 10 энергии за пилюлю); ученики +0,9 влияния/мин.</p></div>` + projects([3]); }
    }
    if (tab === 'city') html = `<h2>Город и торговля</h2><p class="intro">Производство секты снабжает город. Каждый район позволяет открыть постоянный маршрут: караван приносит 500 монет и 30 влияния каждые 30 минут.</p>${projects([4])}<div class="workers"><h3>Маршруты ${s.routes.length} / ${s.buildings.market}</h3>${button('route', '', 'Открыть маршрут · 300 монет, 30 припасов', s.routes.length < s.buildings.market && E.affordable(s,{gold:300,supplies:30}))}${s.routes.map((r,i)=>`<p class="intro">Караван ${i+1}: возвращение через ${duration(r.remaining)}</p>`).join('')}</div>`;
    if (tab === 'planet') html = `<h2>Мировая сеть</h2><p class="intro">Узлы производят эссенцию и усиливают щит. Для следующего портала нужна сила щита ${fmt(10000 * (s.resources.worlds + 1))}; сейчас ${fmt(E.power(s) + s.buildings.node * 20)}.</p>${projects([5])}<div class="rebirth"><h3>Закрепить межмировой портал</h3><p>Переход занимает 2 часа. Награда: один мир и 80 эссенции. Каждый мир производит 0,01 эссенции/сек.</p>${expedition()}${button('portal', '', 'Открыть портал · 500 энергии, 50 припасов', !s.expedition && E.power(s) + s.buildings.node * 20 >= 10000*(s.resources.worlds+1) && E.affordable(s,{qi:500,supplies:50}))}</div>`;
    if (tab === 'galaxy') html = `<h2>Звёздная экспансия</h2><p class="intro">Для освоения следующего мира нужен флот из ${s.resources.worlds + 1} кораблей. Расширяй снабжение города и строй корабли из руды и эссенции.</p>${projects([6,7])}<div class="rebirth"><h3>Колониальный поход</h3><p>Поход занимает 4 часа; основание колонии добавляет мир и 80 эссенции.</p>${expedition()}${button('colonize', '', 'Отправить флот · 60 эссенции, 100 припасов', !s.expedition && s.buildings.fleet >= s.resources.worlds+1 && E.affordable(s,{cosmic:60,supplies:100}))}</div>`;
    if (tab === 'legacy') {
      const fateSummary = (FateTree && FateTree.renderCompact) ? FateTree.renderCompact(s, L?.language || 'ru') : '';
      html = `<h2>${uiText('Наследие души','Legacy of the soul')}</h2><p class="intro">${uiText(`Жизнь ${s.life} · Души ${s.souls} · Постоянный бонус ${s.souls * 10}%.`,`Life ${s.life} · Souls ${s.souls} · Permanent bonus ${s.souls * 10}%.`)}</p><div class="rebirth"><h3>${uiText('Новый круг','New cycle')}</h3><p>${uiText(`После 24-й ступени можно переродиться. Все владения, ресурсы и навыки сбросятся. Останутся души: +${Math.max(1, Math.floor(s.realm/6))}, каждая ускоряет личное развитие на 10%.`,`After realm 24 you can be reborn. All possessions, resources and skills will reset. Souls will remain: +${Math.max(1, Math.floor(s.realm/6))}, each accelerating personal cultivation by 10%.`)}</p>${button('rebirth', '', 'Переродиться', s.realm >= 24)}</div><section class="legacy-fate-tree-section"><div class="section-head"><h3>${uiText('Древо Судьбы и Карма Души','Fate Tree & Soul Karma')}</h3><button type="button" class="btn-fate-tree-link" id="legacy-open-fate-tree">${uiText('Развернуть полное Древо','Expand Full Fate Tree')}</button></div><p class="intro">${uiText('Хроника всех принятых решений, уз кармы с жителями мира и открытых путей судьбы.','Chronicle of all decisions made, karmic bonds with the world’s denizens, and unlocked destiny paths.')}</p>${fateSummary}</section>`;
    }
    if (tab === 'roadmap') html = `<h2>Ближайший горизонт</h2><p class="intro">Тебе известна только ближайшая цель. Дальнейший путь откроется, когда ты до неё доберёшься. Поручения, знания, помощь людям и испытания позволяют заслужить признание разными способами. Личная культивация и запас ресурсов по-прежнему необходимы.</p><div class="cards">${E.stages.slice(0,s.stage+2).map((st,i)=>card(`${i < s.stage ? '✓' : i === s.stage ? '●' : '◇'} ${st.name}`, st.subtitle, `<small>${i === s.stage ? 'Текущая глава' : i < s.stage ? 'Пройдена' : 'Ближайшая цель'}</small>`)).join('')}</div>${s.stage>0&&s.stage<7?card('Признание',`Победы ${s.wins} / ${next.wins} или признание ${E.world.recognition(s)} / ${E.world.recognitionNeeded(s)}`,Object.entries(s.world.director.paths[s.stage]||{}).map(([k,n])=>`${t(E.world.pathNames[k])}: ${n}`).join(' · '),button('advance','','Перейти',E.canAdvance(s))) : ''}`;
    $('content').innerHTML = h(returnSummaryView()+(view === 'data' ? IsekaiDataView.render(s, tab, E) : html));
    $('journal').replaceChildren(...s.events.slice(0, 7).map(e => { const div = document.createElement('div'); div.className = 'event'; const small = document.createElement('small'); small.textContent = t(`ДЕНЬ ${e.day}`); div.append(small, document.createTextNode(t(e.text))); return div; }));
    for(const id of ['chapter','hero-description','life','souls','day'])$(id).textContent=t($(id).textContent);
    if($('open-fate-tree'))$('open-fate-tree').textContent=uiText('✦ Древо Судьбы','✦ Fate Tree');
    if($('open-alchemy'))$('open-alchemy').textContent=uiText('🧪 Алхимия','🧪 Alchemy');
    if($('mini-hud')&&view!=='data'){
      const place=E.world.locations[s.world.location]?.name||s.world.location;
      const journey=s.world.journey?(uiText('В пути: ','Travelling: ')+t(E.world.locations[s.world.journey.destination]?.name||'')+` · ${Math.ceil(s.world.journey.remaining)} `+uiText('сек.','s')):t(place);
      if($('hud-realm'))$('hud-realm').textContent=`✧ ${E.realmName(s.realm)}`;
      if($('hud-location'))$('hud-location').textContent=journey;
      const running = E.activityRunning(s);
      if($('hud-activity')) {
        $('hud-activity').textContent = running ? `● ${t(E.activities[s.activity]?.name||'')}` : `⏸ ${uiText('На паузе: ','Paused: ')}${t(E.activities[s.activity]?.name||'')}`;
        $('hud-activity').className = `hud-item hud-activity ${running ? 'activity-active' : 'activity-paused'}`;
      }
      if($('hud-stamina-lbl'))$('hud-stamina-lbl').textContent=uiText('Выносливость','Stamina');
      if($('hud-stamina-val'))$('hud-stamina-val').textContent=`${fmt(s.stamina)} / ${E.staminaMax(s)}`;
      if($('hud-stamina-fill')?.style){
        const pct=Math.max(0,Math.min(100,(s.stamina/E.staminaMax(s))*100));
        $('hud-stamina-fill').style.width=`${pct}%`;
      }
    }
    applyHeroCollapse();
    applyNovelTypography();
    if(quotes){
      const quote=quotes.get(s,Date.now(),L?.language||'ru');
      const text='«'+quote.text+'»',source='— '+quote.source;
      if($('aside-quote').textContent!==text)$('aside-quote').textContent=text;
      if($('aside-quote-source').textContent!==source)$('aside-quote-source').textContent=source;
    }
    L?.translateDOM();
    if($('world-map-dialog').open)renderMap();
    if($('location-dialog')?.open&&currentDialogPlace)renderLocationDialog(currentDialogPlace);
    Array.from(content.querySelectorAll?.('details')||[]).forEach((node,i)=>{node.open=node.dataset?.panel?(heroPanels.get(node.dataset.panel)||false):openDetails.includes(i);});
    if(focusedPanel)Array.from(content.querySelectorAll?.('details[data-panel]')||[]).find(node=>node.dataset.panel===focusedPanel)?.querySelector('summary')?.focus?.({preventScroll:true});
    if(!focusedPanel&&focusedSummary>=0)Array.from(content.querySelectorAll?.('details summary')||[])[focusedSummary]?.focus?.({preventScroll:true});
    if(focusData){
      const buttons=[...Array.from(content.querySelectorAll?.('button')||[]),...Array.from(navigation.querySelectorAll?.('button')||[])];
      const replacement=buttons.find(node=>focusData.tab!==undefined?node.dataset?.tab===focusData.tab:focusData.quickAction!==undefined?node.dataset?.quickAction===focusData.quickAction&&node.dataset?.quickValue===focusData.value:node.dataset?.action===focusData.action&&node.dataset?.value===focusData.value);
      replacement?.focus?.({preventScroll:true});
    }
  }
  function projects(levels) { return `<div class="cards">${Object.entries(E.projects).filter(([, p])=>levels.includes(p.stage) && p.stage <= s.stage).map(([k,p])=>card(`${p.name} · ${s.buildings[k]}`,p.desc,button('build',k,'Построить',E.affordable(s,E.buildCost(s,k))),costs(E.buildCost(s,k)))).join('')}</div>`; }
  function expedition() { return s.expedition ? `<p class="intro">Экспедиция в пути: осталось ${duration(s.expedition.remaining)}. Порталы и флот используют один слот экспедиции.</p>` : ''; }
  function schoolView(k){const lang=L?.language||'ru',a=E.sects.info(s,k,lang);return a?`<article class="story-panel sect-profile sect-profile-${k} sect-card-${k}">${sectEmblems[k]?`<div class="sect-card-emblem">${sectEmblems[k]}</div>`:''}<div class="eyebrow">${a.role}</div><h3>${a.name}</h3><p>${a.teacher} · ${a.perk}</p><p><strong>${uiText('Правило школы','School rule')}:</strong> ${a.rule}</p><p>${E.sects.progress(s,k,lang)}</p></article>`:'';}
  let currentDialogPlace=null;
  function renderLocationDialog(place){
    const lang=L?.language||'ru',en=lang==='en';
    const W=E.world,w=s.world,p=W.locations[place];
    if(!p)return;
    const know=E.atlas.overview(s,E,place,lang);
    const journal=E.atlas.journal(s,E,place,lang);
    const rumors=E.atlas.rumors(s,lang).filter(r=>r.place===place);
    const travelReason=W.travelReason(s,place,lang);
    const travelTime=W.travelTime(s,place);
    const canTravel=W.canTravel(s,place);
    const isCurrent=w.location===place&&!w.journey;
    const isJourney=w.journey&&w.journey.destination===place;
    const note=s.atlas?.notes?.[place];
    const title=t(p.name);
    if($('location-dialog-title'))$('location-dialog-title').textContent=title;
    const statusText=isCurrent?uiText('● Ты здесь','● You are here'):isJourney?uiText(`В пути: осталось ${Math.ceil(w.journey.remaining)} сек.`,`Travelling: ${Math.ceil(w.journey.remaining)} s remaining`):know.visited?uiText('✓ Исследовано лично','✓ Personally discovered'):know.tier===1?uiText('? Известно по слухам','? Known from rumours'):uiText('◇ Неизведанные земли','◇ Unexplored lands');
    let bodyHtml=`<div class="location-status-bar"><span>${statusText}</span><span class="location-status-time">${uiText('Время пути: ','Travel time: ')}${travelTime} ${uiText('сек.','s')}</span></div>`;
    bodyHtml+=`<section class="location-section"><h3>${uiText('Местность и впечатления','Atmosphere and surroundings')}</h3><p class="location-desc-text">${know.desc}</p></section>`;
    bodyHtml+=`<section class="location-section"><h3>${uiText('Особенность места','Local trait')}</h3><div class="location-perk-box"><span class="location-perk-badge">${know.bonus}</span><small class="location-perk-desc">${travelReason}</small></div></section>`;
    bodyHtml+=`<section class="location-section"><h3>${uiText('Безопасность и разведка','Hazards and scouting')}</h3><p class="location-danger-text">${know.danger}</p><div class="location-survey-info"><span>${uiText('Осмотров окрестностей: ','Local surveys: ')}${know.surveys}</span><span> · </span><span>${know.trail?uiText('Тропа найдена: переход −20%','Shortcut trail found: travel −20%'):uiText('Для короткой тропы: 2 осмотра','For shortcut trail: 2 surveys needed')}</span></div></section>`;
    if(know.people&&know.people.length>0){
      const memoryPeople=W.memory?.people?W.memory.people(s,lang):[];
      bodyHtml+=`<section class="location-section"><h3>${uiText('Жители и наставники','Residents and mentors')}</h3><div class="location-people-list">${know.people.map(person=>{const mem=memoryPeople.find(m=>m.id===person.id);const memo=mem?.memories?.[0]||mem?.status||'';return `<div class="location-person-card"><strong>${person.name}</strong><small>${person.role}</small>${memo?`<p>${memo}</p>`:''}</div>`;}).join('')}</div></section>`;
    }
    if(journal.resources&&journal.resources.length>0){
      bodyHtml+=`<section class="location-section"><h3>${uiText('Найденные ресурсы','Discovered resources')}</h3><div class="location-resources-list">${journal.resources.map(r=>`<span class="resource-badge">${r}</span>`).join(' ')}</div></section>`;
    }
    if(journal.facts&&journal.facts.length>0){
      bodyHtml+=`<section class="location-section"><h3>${uiText('Записанные наблюдения','Recorded observations')}</h3><ul class="location-facts-list">${journal.facts.map(f=>`<li>${f}</li>`).join('')}</ul></section>`;
    }
    if(rumors&&rumors.length>0){
      bodyHtml+=`<section class="location-section"><h3>${uiText('Слухи','Rumours')}</h3><div class="location-rumors-list">${rumors.map(r=>`<p class="location-rumor-item"><strong>${r.confirmed?'✓':'?'}</strong> ${r.text}<br><small>${uiText('Источник: ','Source: ')}${r.source}</small></p>`).join('')}</div></section>`;
    }
    if(note){
      bodyHtml+=`<section class="location-section"><h3>${uiText('Твоя личная заметка','Your personal note')}</h3><p class="location-note-text">«${note}»</p></section>`;
    }
    bodyHtml+=`<div class="location-dialog-actions actions">${button('travel',place,isCurrent?uiText('Ты здесь','You are here'):uiText(`Отправиться · ${travelTime} сек`,`Travel · ${travelTime} s`),canTravel)}<button type="button" id="close-location-dialog-btn">${uiText('Закрыть','Close')}</button></div>`;
    if($('location-dialog-body'))$('location-dialog-body').innerHTML=h(bodyHtml);
  }
  function openLocationDialog(place){
    currentDialogPlace=place;
    renderLocationDialog(place);
    $('location-dialog')?.showModal?.();
  }
  function renderFateTree(){
    const body=$('fate-tree-body');
    if(!body)return;
    const lang=L?.language||'ru';
    if($('fate-tree-title'))$('fate-tree-title').textContent=uiText('Древо Судьбы и Хроника Кармы','Fate Tree & Karma Chronicle');
    if($('fate-tree-intro'))$('fate-tree-intro').textContent=uiText('Хроника принятых решений, уз кармы и открытых путей.','Chronicle of choices, karmic bonds and unlocked paths.');
    if($('close-fate-tree'))$('close-fate-tree').textContent=uiText('Закрыть','Close');
    const tabs=$('fate-tree-dialog')?.querySelectorAll?.('.fate-tab');
    if(tabs){
      tabs.forEach(btn=>{
        const isAct=btn.dataset.fateTab===activeFateTab;
        btn.classList.toggle('active',isAct);
        btn.setAttribute('aria-selected',isAct?'true':'false');
        if(btn.dataset.fateTab==='story')btn.textContent=uiText('✦ Ветви Судьбы','✦ Story Branches');
        if(btn.dataset.fateTab==='npc')btn.textContent=uiText('✦ Узы Кармы','✦ Bonds of Karma');
        if(btn.dataset.fateTab==='factions')btn.textContent=uiText('✦ Фракции и Секты','✦ Factions & Sects');
      });
    }
    if(FateTree&&FateTree.renderTreeHtml){
      body.innerHTML=FateTree.renderTreeHtml(s,activeFateTab,lang);
    }else{
      body.innerHTML=`<p class="intro">${uiText('Древо Судьбы временно недоступно.','Fate Tree is currently unavailable.')}</p>`;
    }
  }
  function openFateTreeDialog(){
    renderFateTree();
    const d=$('fate-tree-dialog');
    if(d){
      if(typeof d.showModal==='function')d.showModal();
      else d.setAttribute?.('open','');
    }
  }
  function renderAlchemy(){
    const body=$('alchemy-body');
    if(!body)return;
    const lang=L?.language||'ru';
    const isEn=lang==='en';
    if($('alchemy-title'))$('alchemy-title').textContent=uiText('Алхимический Котёл и Лавка','Alchemy Crucible & Shop');
    if($('alchemy-intro'))$('alchemy-intro').textContent=uiText('Варка снадобий в котле, очищение Жемчужиной Злого Неба и торговля с мастером Хо.','Brewing remedies in crucible, Sky Poison Pearl purification and trading with Master Huo.');
    if($('close-alchemy'))$('close-alchemy').textContent=uiText('Закрыть','Close');
    const tabs=$('alchemy-dialog')?.querySelectorAll?.('.alchemy-tab');
    if(tabs){
      tabs.forEach(btn=>{
        const isAct=btn.dataset.alchemyTab===activeAlchemyTab;
        btn.classList.toggle('active',isAct);
        btn.setAttribute('aria-selected',isAct?'true':'false');
        if(btn.dataset.alchemyTab==='cauldron')btn.textContent=uiText('Котёл и Жемчужина','Crucible & Pearl');
        if(btn.dataset.alchemyTab==='clinic')btn.textContent=uiText('Клиника Лекаря','Miracle Doctor Clinic');
        if(btn.dataset.alchemyTab==='market'||btn.dataset.alchemyTab==='shop')btn.textContent=uiText('Рынки и Сбор','Markets & Gathering');
        if(btn.dataset.alchemyTab==='pouch')btn.textContent=uiText('Боевая Сумка','Combat Pouch');
        if(btn.dataset.alchemyTab==='garden')btn.textContent=uiText('Сад Жемчужины','Pearl Garden');
      });
    }

    const alc=s.alchemy||(E.alchemy?E.alchemy.fresh():null);
    if(!alc){
      body.innerHTML=`<p class="intro">${uiText('Алхимия недоступна.','Alchemy is unavailable.')}</p>`;
      return;
    }

    const Alc=typeof IsekaiAlchemy!=='undefined'?IsekaiAlchemy:(E.alchemy||Alchemy);
    const currentRank=Alc.RANKS[alc.level-1]||Alc.RANKS[0];
    const nextRank=Alc.RANKS[alc.level]||null;
    const xpMax=nextRank?nextRank.xpReq:currentRank.xpReq;

    if(activeAlchemyTab==='clinic'){
      const treatedCount = alc.stats.patientsTreated || 0;
      const clinicHeader = `
        <div class="clinic-header-card">
          <div class="clinic-eyebrow">🩺 ${uiText('КЛИНИКА ЛЕКАРЯ С НЕБЕС', 'MIRACLE DOCTOR CLINIC')} · ${uiText('ОЧИЩЕНИЕ ОТ ЯДОВ И ДАНЬ ДУ', 'VENOM & DAN DU PURGE')}</div>
          <h3>${uiText('Лекарь с Небес · Очищение от ядов и Дань Ду', 'Miracle Doctor · Venom & Dan Du Purge')}</h3>
          <p class="intro">${uiText('Пациенты стекаются со всей округи в надежде на божественное исцеление Жемчужиной Злого Неба или очищенные пилюли.', 'Patients gather from across the realm seeking divine healing through the Sky Poison Pearl or pure remedies.')}</p>
          <div class="clinic-substats">
            <span>✨ ${uiText('Исцелено пациентов: ', 'Patients cured: ')}<strong>${treatedCount}</strong></span>
            <span>✦ ${uiText('Репутация: ', 'Reputation: ')}<strong>${s.resources.reputation || 0}</strong></span>
          </div>
        </div>`;

      const activePatients = alc.patients || ['ba_strained', 'hunter_poison'];
      const patientCards = activePatients.map(pId => {
        const p = Alc.PATIENTS?.[pId];
        if (!p) return '';
        const canPill = Alc.canTreatPatient(s, pId, false);
        const canPearl = Alc.canTreatPatient(s, pId, true);
        const hasReqPill = (alc.inventory?.[p.reqPill] || 0) >= 1;
        const reqRec = Alc.RECIPES[p.reqPill];
        const reqName = isEn ? (p.reqPillNameEn || reqRec?.nameEn) : (p.reqPillNameRu || reqRec?.nameRu);

        const pillBtn = `<button type="button" class="btn-clinic-treat" data-alchemy-action="treat" data-patient="${pId}" data-pearl="false" ${canPill ? '' : 'disabled'}>💊 ${uiText('Исцелить пилюлей', 'Cure with pill')}</button>`;
        const pearlBtn = p.pearlAlt
          ? `<button type="button" class="btn-pearl" data-alchemy-action="treat" data-patient="${pId}" data-pearl="true" ${canPearl ? '' : 'disabled'}>✨ ${uiText('Очистить Жемчужиной', 'Purge with Pearl')} (${p.pearlQi || 15} ${uiText('Ци', 'Qi')})</button>`
          : '';

        return `
          <div class="clinic-patient-card">
            <div class="patient-card-header">
              <span class="patient-avatar">🩺</span>
              <div>
                <h4 class="patient-name">${isEn ? p.nameEn : p.nameRu}</h4>
                <div class="patient-condition">${isEn ? p.conditionEn : p.conditionRu}</div>
              </div>
            </div>
            <div class="patient-details-grid">
              <div class="patient-detail-box">
                <span class="patient-detail-lbl">${uiText('Требуется снадобье:', 'Required remedy:')}</span>
                <strong>${reqName} ${hasReqPill ? `<span class="pill-ready-tag">✓ ${uiText('Есть в сумке', 'In stock')}</span>` : `<span class="pill-missing-tag">× ${uiText('Нет в сумке', 'Missing')}</span>`}</strong>
              </div>
              <div class="patient-detail-box">
                <span class="patient-detail-lbl">${uiText('Награда за исцеление:', 'Treatment reward:')}</span>
                <span class="patient-reward-text">${isEn ? p.rewardEn : p.rewardRu}</span>
              </div>
            </div>
            <div class="patient-actions-row">
              ${pillBtn}
              ${pearlBtn}
            </div>
          </div>`;
      }).join('');

      const patientSection = `
        <div class="section-head"><h3>${uiText('Пациенты клиники', 'Clinic Patients')}</h3></div>
        <div class="clinic-patients-list">
          ${patientCards || `<p class="intro">${uiText('Все пациенты в округе здоровы. Новые больные прибудут со временем.', 'All local patients are healed. New cases will arrive with time.')}</p>`}
        </div>`;

      let logHtml = '';
      if (alc.log && alc.log.length > 0) {
        logHtml = `
          <div class="alchemy-log-box">
            <h4>${uiText('История клиники', 'Clinic History')}</h4>
            ${alc.log.slice(0, 5).map(e => `<div class="alchemy-log-item">${isEn ? e.en : e.ru}</div>`).join('')}
          </div>`;
      }

      body.innerHTML = clinicHeader + patientSection + logHtml;
    } else if (activeAlchemyTab === 'market' || activeAlchemyTab === 'shop') {
      const curLoc = s.world?.location || 'village';
      const fTable = Alc.FORAGE_TABLES?.[curLoc] || Alc.FORAGE_TABLES?.village || { herbs: [] };
      const mTable = Alc.REGIONAL_MARKETS?.[curLoc] || Alc.REGIONAL_MARKETS?.village || { buys: {} };
      const canDoForage = Alc.canForage ? Alc.canForage(s, curLoc) : false;
      const forageCd = Math.ceil(alc.forageCooldown || 0);

      // Section 1: Foraging in current location
      const commonHerbsRu = fTable.herbs.map(h => `${Alc.INGREDIENTS[h.id].icon} ${Alc.INGREDIENTS[h.id].nameRu}`).join(', ');
      const commonHerbsEn = fTable.herbs.map(h => `${Alc.INGREDIENTS[h.id].icon} ${Alc.INGREDIENTS[h.id].nameEn}`).join(', ');
      const rareIng = fTable.rareHerb ? Alc.INGREDIENTS[fTable.rareHerb] : null;

      const forageSection = `
        <div class="apothecary-section market-forage-card">
          <div class="section-head">
            <h3>🌿 ${uiText('Региональное травничество', 'Regional Herbalism')} · ${isEn ? fTable.nameEn : fTable.nameRu}</h3>
            <small>${uiText('Всего сборов: ', 'Total forages: ')}${alc.stats.forages || 0}</small>
          </div>
          <p class="intro">${isEn ? fTable.descEn : fTable.descRu}</p>
          <div class="forage-yield-info">
            <div><span class="forage-lbl">${uiText('Обычные сборы:', 'Common harvest:')}</span> <strong>${isEn ? commonHerbsEn : commonHerbsRu}</strong></div>
            ${rareIng ? `<div><span class="forage-lbl">${uiText('Редкая находка:', 'Rare find:')}</span> <strong class="rare-herb-text">${rareIng.icon} ${isEn ? rareIng.nameEn : rareIng.nameRu} (~35%)</strong></div>` : ''}
          </div>
          <div class="forage-actions-bar">
            <button type="button" class="btn-forage-action" data-alchemy-action="forage" ${canDoForage ? '' : 'disabled'}>
              ${forageCd > 0 ? `${uiText('Отдых травника: ', 'Herbalist rest: ')}${forageCd} ${uiText('сек.', 's.')}` : uiText('Собрать травы в этой местности (10 выносл.)', 'Gather herbs in this area (10 stam.)')}
            </button>
            <span class="forage-cost-hint">⚡ 10 ${uiText('выносливости', 'stamina')} · +10 ${uiText('опыта', 'XP')}</span>
          </div>
        </div>`;

      // Section 2: Regional Trade Board
      const tradeItems = Object.keys(Alc.RECIPES).map(recId => {
        const r = Alc.RECIPES[recId];
        const inStock = alc.inventory?.[recId] || 0;
        const unitPrice = mTable.buys[recId] || 25;
        const canSell1 = inStock >= 1 || (s.resources.pills || 0) >= 1;
        const canSellAll = inStock > 1;

        return `
          <div class="market-trade-card">
            <div class="market-trade-head">
              <span class="alchemy-ing-icon">${r.icon}</span>
              <div>
                <strong class="trade-item-name">${isEn ? r.nameEn : r.nameRu}</strong>
                <div class="trade-item-stock">${uiText('В запасе: ', 'In stock: ')}<strong>${inStock}</strong> ${uiText('шт.', 'pcs')}</div>
              </div>
            </div>
            <div class="trade-price-tag">💰 ${unitPrice} ${uiText('монет', 'coins')} / ${uiText('шт.', 'pc')}</div>
            <div class="trade-actions-row">
              <button type="button" class="trade-btn" data-alchemy-action="trade" data-recipe="${recId}" data-count="1" ${canSell1 ? '' : 'disabled'}>${uiText('Сдать 1 шт.', 'Sell 1 pc')} (+${unitPrice})</button>
              ${canSellAll ? `<button type="button" class="trade-btn" data-alchemy-action="trade" data-recipe="${recId}" data-count="${inStock}">×${inStock} (+${unitPrice * inStock})</button>` : ''}
            </div>
          </div>`;
      }).join('');

      const tradeSection = `
        <div class="apothecary-section">
          <div class="section-head">
            <h3>⚖️ ${uiText('Караванная торговля и спрос поселений', 'Caravan Trade & Regional Demand')}</h3>
            <small>${uiText('Продано пилюль: ', 'Pills traded: ')}${alc.stats.pillsTraded || 0}</small>
          </div>
          <div class="market-regional-banner">
            <strong>🏛 ${isEn ? mTable.nameEn : mTable.nameRu}</strong>
            <p>${isEn ? mTable.descEn : mTable.descRu}</p>
          </div>
          <div class="market-trade-grid">${tradeItems}</div>
        </div>`;

      // Section 3: Master Huo's Apothecary
      const herbsForSale = ['mountain_herb', 'spring_water', 'spirit_clover', 'iron_root', 'frost_lotus', 'flame_bloom', 'poison_sac'];
      const herbCards = herbsForSale.map(ingId => {
        const ing = Alc.INGREDIENTS[ingId];
        const canBuy1 = s.resources.gold >= ing.cost;
        const canBuy5 = s.resources.gold >= ing.cost * 5;
        return `
          <div class="apothecary-card">
            <div class="apothecary-card-head">
              <span class="alchemy-ing-icon">${ing.icon}</span>
              <div>
                <div class="apothecary-card-title">${isEn ? ing.nameEn : ing.nameRu}</div>
                <div class="apothecary-card-price">${ing.cost} ${uiText('монет', 'coins')}</div>
              </div>
            </div>
            <div class="actions" style="gap:4px">
              <button type="button" data-alchemy-action="buy" data-item="${ingId}" data-count="1" ${canBuy1 ? '' : 'disabled'}>${uiText('+1 шт', '+1 pc')}</button>
              <button type="button" data-alchemy-action="buy" data-item="${ingId}" data-count="5" ${canBuy5 ? '' : 'disabled'}>${uiText('+5 шт', '+5 pcs')}</button>
            </div>
          </div>`;
      }).join('');

      const availableRecipes = [
        { id: 'body_pill', cost: 35 },
        { id: 'calm_tea', cost: 45 },
        { id: 'breakthrough_pill', cost: 80 }
      ];
      const recipeCards = availableRecipes.map(item => {
        const r = Alc.RECIPES[item.id];
        const isUnlocked = alc.unlockedRecipes.includes(item.id);
        const canBuy = !isUnlocked && s.resources.gold >= item.cost;
        return `
          <div class="apothecary-card">
            <div class="apothecary-card-head">
              <span class="alchemy-ing-icon">${r.icon}</span>
              <div>
                <div class="apothecary-card-title">${isEn ? r.nameEn : r.nameRu}</div>
                <div class="apothecary-card-price">${item.cost} ${uiText('монет', 'coins')}</div>
              </div>
            </div>
            ${isUnlocked
              ? `<button type="button" disabled>${uiText('Изучен', 'Learned')}</button>`
              : `<button type="button" data-alchemy-action="buy" data-item="recipe_${item.id}" ${canBuy ? '' : 'disabled'}>${uiText('Купить', 'Buy')}</button>`}
          </div>`;
      }).join('');

      const relicsCount = s.resources.relics || 0;
      const canGrind = relicsCount >= 1;

      const shopSection = `
        <div class="apothecary-section">
          <h4>${uiText('Аптекарская лавка мастера Хо', 'Master Huo’s Apothecary')} · ${s.resources.gold} ${uiText('монет', 'coins')}</h4>
          <div class="apothecary-grid">${herbCards}</div>
          <h4 style="margin-top:14px">${uiText('Купить рецепт', 'Buy recipe')}</h4>
          <div class="apothecary-grid">${recipeCards}</div>
          <div style="margin-top:14px" class="apothecary-card">
            <div class="apothecary-card-head">
              <span class="alchemy-ing-icon">🏛️</span>
              <div>
                <div class="apothecary-card-title">${uiText('Ступка алтаря: перетереть осколок', 'Altar mortar: grind relic shard')}</div>
                <div class="apothecary-card-price">${relicsCount} ${uiText('осколков', 'shards')}</div>
              </div>
            </div>
            <button type="button" data-alchemy-action="grind" ${canGrind ? '' : 'disabled'}>${uiText('Перетереть осколок (+2 Нефритовой пыли)', 'Grind shard (+2 Jade Relic Dust)')}</button>
          </div>
        </div>`;

      let logHtml = '';
      if (alc.log && alc.log.length > 0) {
        logHtml = `
          <div class="alchemy-log-box">
            <h4>${uiText('История лавки', 'Shop Log')}</h4>
            ${alc.log.slice(0, 5).map(e => `<div class="alchemy-log-item">${isEn ? e.en : e.ru}</div>`).join('')}
          </div>`;
      }

      body.innerHTML = forageSection + tradeSection + shopSection + logHtml;
    } else if (activeAlchemyTab === 'pouch') {
      const pouchSlots = alc.pouch || ['vigor_broth', null, null];
      const slotsHtml = [0, 1, 2].map(slotIdx => {
        const recId = pouchSlots[slotIdx];
        const r = recId ? Alc.RECIPES[recId] : null;
        const inStock = r ? (alc.inventory?.[recId] || 0) : 0;

        return `
          <div class="pouch-slot-card ${r ? 'slot-occupied' : 'slot-empty'}">
            <div class="slot-header">
              <span class="slot-badge">${uiText('Слот', 'Slot')} ${slotIdx + 1}</span>
              ${r ? `<button type="button" class="slot-remove-btn" data-alchemy-action="unequip-pouch" data-slot="${slotIdx}">✕ ${uiText('Снять', 'Unequip')}</button>` : ''}
            </div>
            ${r ? `
              <div class="slot-body">
                <span class="slot-pill-icon">${r.icon}</span>
                <strong class="slot-pill-name">${isEn ? r.nameEn : r.nameRu}</strong>
                <div class="slot-pill-stock">💊 ${uiText('В запасе: ', 'In stock: ')}<strong>${inStock}</strong> ${uiText('шт.', 'pcs')}</div>
                <p class="slot-pill-effect">${isEn ? r.combatEffectEn : r.combatEffectRu}</p>
              </div>` : `
              <div class="slot-empty-body">
                <span class="slot-empty-icon">👝</span>
                <p>${uiText('Пустой слот пояса', 'Empty belt slot')}</p>
                <small>${uiText('Выбери пилюлю ниже, чтобы снарядить', 'Select a pill below to equip')}</small>
              </div>`}
          </div>`;
      }).join('');

      const unlockedPills = (alc.unlockedRecipes || ['vigor_broth']).map(recId => {
        const r = Alc.RECIPES[recId];
        if (!r) return '';
        const inStock = alc.inventory?.[recId] || 0;

        return `
          <div class="pouch-pill-choice-card">
            <div class="choice-card-head">
              <span class="alchemy-ing-icon">${r.icon}</span>
              <div>
                <strong>${isEn ? r.nameEn : r.nameRu}</strong>
                <div class="choice-stock">${uiText('В запасе: ', 'In stock: ')}<strong>${inStock}</strong> ${uiText('шт.', 'pcs')}</div>
              </div>
            </div>
            <p class="choice-combat-effect">⚔ ${isEn ? r.combatEffectEn : r.combatEffectRu}</p>
            <div class="choice-equip-buttons">
              <span class="choice-equip-label">${uiText('Снарядить в сумку:', 'Equip to pouch:')}</span>
              <button type="button" class="btn-slot-equip" data-alchemy-action="equip-pouch" data-recipe="${recId}" data-slot="0">${uiText('В слот 1', 'To slot 1')}</button>
              <button type="button" class="btn-slot-equip" data-alchemy-action="equip-pouch" data-recipe="${recId}" data-slot="1">${uiText('В слот 2', 'To slot 2')}</button>
              <button type="button" class="btn-slot-equip" data-alchemy-action="equip-pouch" data-recipe="${recId}" data-slot="2">${uiText('В слот 3', 'To slot 3')}</button>
            </div>
          </div>`;
      }).join('');

      const pouchHtml = `
        <div class="pouch-container">
          <div class="pouch-header-card">
            <div class="pouch-eyebrow">🎒 ${uiText('ПОЯСНАЯ СУМКА АЛХИМИКА', 'ALCHEMIST’S TACTICAL BELT POUCH')}</div>
            <h3>${uiText('Поясная сумка пилюль', 'Belt Pill Pouch')}</h3>
            <p class="intro">${uiText('Снаряди до 3 пилюль в быстрые слоты пояса для мгновенного применения в тактических поединках.', 'Equip up to 3 pills into quick belt slots for instant tactical combat use.')}</p>
          </div>
          <div class="section-head"><h3>${uiText('Быстрые слоты пояса', 'Quick Belt Slots')}</h3></div>
          <div class="pouch-slots-grid">${slotsHtml}</div>
          <div class="section-head" style="margin-top:16px"><h3>${uiText('Доступные пилюли для снаряжения', 'Available Pills to Equip')}</h3></div>
          <div class="pouch-choices-grid">${unlockedPills}</div>
        </div>`;

      body.innerHTML = pouchHtml;
    } else if (activeAlchemyTab === 'garden') {
      const garden = alc.garden || (Alc.fresh ? Alc.fresh().garden : { unlockedPlots: 2, dew: 1, dewMax: 5, dewProgress: 0, seeds: {}, plots: [], stats: {} });
      const jasmineQuote = Alc.getJasmineGardenQuote ? Alc.getJasmineGardenQuote(s, lang) : '';
      const hasReadyHarvest = (garden.plots || []).some((p, idx) => idx < garden.unlockedPlots && Alc.canHarvest(s, idx));
      const dewPct = Math.min(100, Math.floor(((garden.dewProgress || 0) / 1800) * 100));

      const formatGardenTimer = (sec) => {
        if (sec <= 0) return isEn ? 'Ready!' : 'Готово!';
        const m = Math.floor(sec / 60);
        const secRem = sec % 60;
        if (m >= 60) {
          const h = Math.floor(m / 60);
          const remM = m % 60;
          return `${h} ${uiText(' ч.', ' hr.')} ${remM} ${uiText(' мин.', ' min.')}`;
        }
        if (m > 0) {
          return `${m} ${uiText(' мин.', ' min.')} ${secRem} ${uiText(' сек.', ' sec.')}`;
        }
        return `${secRem} ${uiText(' сек.', ' sec.')}`;
      };

      const headerHtml = `
        <div class="garden-header-card">
          <div class="garden-eyebrow">🌿 ${uiText('ВНУТРЕННИЙ МИР ЖЕМЧУЖИНЫ', 'PEARL INNER REALM')} · ${uiText('АВТОНОМНОЕ ДУХОВНОЕ ИЗМЕРЕНИЕ', 'AUTONOMOUS SPIRITUAL DIMENSION')}</div>
          <h3>${uiText('Духовный Сад Небесной Жемчужины', 'Sky Poison Pearl Spiritual Garden')}</h3>
          <div class="jasmine-garden-card">
            <div class="jasmine-avatar">👘</div>
            <div class="jasmine-dialog-body">
              <strong>${uiText('Принцесса Жасмин', 'Princess Jasmine')} <small>(${uiText('Звездный Бог Небесной Бойни', 'Heavenly Slaughter Star God')})</small></strong>
              <p class="jasmine-quote-text">«${jasmineQuote.replace(/^«|»$|^“|”$/g, '')}»</p>
            </div>
          </div>
          <div class="dew-status-bar">
            <div class="dew-counter">
              <span class="dew-icon">💧</span>
              <div>
                <strong>${uiText('Живительная Роса: ', 'Life-Giving Dew: ')}<span class="dew-val">${garden.dew || 0}</span> / ${garden.dewMax || 5}</strong>
                <div class="dew-progress-wrap">
                  <div class="dew-progress-bar" style="width:${dewPct}%"></div>
                </div>
                <small class="dew-hint">${uiText('Конденсация росы:', 'Dew condensation:')} ${garden.dew >= garden.dewMax ? (isEn ? 'Full (5/5)' : 'Полный запас (5/5)') : `${dewPct}% (1800 ${uiText(' сек.', ' sec.')})`}</small>
              </div>
            </div>
            <div class="garden-header-actions">
              <button type="button" class="btn-harvest-all" data-alchemy-action="garden-harvest-all" ${hasReadyHarvest ? '' : 'disabled'}>
                🌾 ${uiText('Собрать весь готовый урожай', 'Harvest All Ready Herbs')}
              </button>
            </div>
          </div>
        </div>`;

      // 6 Plots
      const plotCardsHtml = (garden.plots || []).map((plot, idx) => {
        const isUnlocked = idx < (garden.unlockedPlots || 2);
        const req = Alc.PLOT_UNLOCK_REQS?.[idx] || { reqRank: 1, qi: 0, gold: 0, relics: 0, nameRu: `Делянка #${idx + 1}`, nameEn: `Plot #${idx + 1}` };
        const plotName = isEn ? req.nameEn : req.nameRu;

        if (!isUnlocked) {
          const canUnlock = Alc.canUnlockPlot(s, idx);
          const costParts = [];
          if (req.qi) costParts.push(`${req.qi} ${uiText('Ци', 'Qi')}`);
          if (req.gold) costParts.push(`${req.gold} ${uiText('монет', 'coins')}`);
          if (req.relics) costParts.push(`${req.relics} ${uiText('осколков', 'relics')}`);
          const costStr = costParts.join(' · ');

          return `
            <div class="garden-plot-card plot-locked">
              <div class="plot-card-head">
                <span class="plot-badge-locked">🔒 ${uiText('Закрытая делянка', 'Locked Plot')} #${idx + 1}</span>
              </div>
              <strong class="plot-name">${plotName}</strong>
              <div class="plot-lock-info">
                <div>${uiText('Требуется ранг алхимии: ', 'Requires alchemy rank: ')}<strong>${req.reqRank}</strong></div>
                <div>${uiText('Стоимость пробуждения: ', 'Awakening cost: ')}<strong>${costStr}</strong></div>
              </div>
              <button type="button" class="btn-unlock-plot" data-alchemy-action="garden-unlock" data-plot="${idx}" ${canUnlock ? '' : 'disabled'}>
                ✨ ${uiText('Разблокировать делянку', 'Unlock Plot')}
              </button>
            </div>`;
        }

        // Unlocked plot
        if (!plot.seed) {
          // Empty plot
          const availableSeeds = Object.keys(Alc.SEEDS).filter(sId => (garden.seeds?.[sId] || 0) > 0);
          const hasSeeds = availableSeeds.length > 0;
          const seedOptions = availableSeeds.map(sId => {
            const sd = Alc.SEEDS[sId];
            const cnt = garden.seeds[sId];
            return `<option value="${sId}">${sd.icon} ${isEn ? sd.nameEn : sd.nameRu} (${cnt} ${uiText('шт.', 'pcs')})</option>`;
          }).join('');

          return `
            <div class="garden-plot-card plot-empty">
              <div class="plot-card-head">
                <span class="plot-badge-unlocked">🌱 ${uiText('Делянка #', 'Plot #')}${idx + 1}</span>
                <span class="plot-status-empty">${uiText('Пустая делянка', 'Empty Plot')}</span>
              </div>
              <strong class="plot-name">${plotName}</strong>
              <div class="plot-plant-box">
                ${hasSeeds ? `
                  <label class="plot-plant-lbl" for="plot-seed-select-${idx}">${uiText('Выбери семя:', 'Choose seed:')}</label>
                  <select class="plot-seed-select" id="plot-seed-select-${idx}">
                    ${seedOptions}
                  </select>
                  <button type="button" class="btn-plant-seed" data-alchemy-action="garden-plant" data-plot="${idx}">
                    🌱 ${uiText('Посадить семя', 'Plant Seed')}
                  </button>
                ` : `
                  <p class="plot-no-seeds-hint">${uiText('Нет семян в запасе. Собери травы в мире или купи семена у мастера Хо.', 'No seeds in stock. Forage herbs in the world or purchase seeds from Master Huo.')}</p>
                `}
              </div>
            </div>`;
        }

        // Growing plot
        const seed = Alc.SEEDS[plot.seed];
        const stageInfo = Alc.getPlotStage(plot);
        const canWater = Alc.canWater(s, idx);
        const canInfuse = Alc.canInfuse(s, idx);
        const canHarvest = Alc.canHarvest(s, idx);

        return `
          <div class="garden-plot-card plot-growing stage-${stageInfo.stage}">
            <div class="plot-card-head">
              <span class="plot-badge-unlocked">🌱 ${uiText('Делянка #', 'Plot #')}${idx + 1}</span>
              <span class="plot-stage-badge badge-${stageInfo.stage}">${isEn ? stageInfo.labelEn : stageInfo.labelRu}</span>
            </div>
            <div class="plot-crop-head">
              <span class="crop-icon">${seed ? seed.icon : '🌿'}</span>
              <div>
                <strong class="crop-name">${seed ? (isEn ? seed.nameEn : seed.nameRu) : ''}</strong>
                <div class="crop-soil">${plotName}</div>
              </div>
            </div>
            <div class="plot-status-tags">
              ${plot.watered ? `<span class="tag-watered">💧 ${uiText('Орошено росой (+50% скорости)', 'Watered with Dew (+50% speed)')}</span>` : ''}
              ${plot.infused ? `<span class="tag-infused">⚡ ${uiText('Влита Ци (+30 мин)', 'Qi Infused (+30 min)')}</span>` : ''}
            </div>
            <div class="plot-progress-area">
              <div class="plot-progress-track">
                <div class="plot-progress-fill stage-fill-${stageInfo.stage}" style="width:${stageInfo.progressPercent}%"></div>
              </div>
              <div class="plot-progress-label">
                ${stageInfo.stage === 'millennium'
                  ? `<span>🌌 ${uiText('Созрело для сбора!', 'Ready for harvest!')}</span>`
                  : `<span>${uiText('До следующей фазы: ', 'Until next phase: ')}<strong>${formatGardenTimer(stageInfo.nextTime)}</strong></span>`}
              </div>
            </div>
            <div class="plot-actions-row">
              <button type="button" class="btn-plot-water" data-alchemy-action="garden-water" data-plot="${idx}" ${canWater ? '' : 'disabled'}>
                💧 ${uiText('Полить росой', 'Water with Dew')}
              </button>
              <button type="button" class="btn-plot-infuse" data-alchemy-action="garden-infuse" data-plot="${idx}" ${canInfuse ? '' : 'disabled'}>
                ⚡ ${uiText('Влить Ци (15)', 'Infuse Qi (15)')}
              </button>
              <button type="button" class="btn-plot-harvest" data-alchemy-action="garden-harvest" data-plot="${idx}" ${canHarvest ? '' : 'disabled'}>
                🌾 ${uiText('Собрать урожай', 'Harvest Crop')}
              </button>
            </div>
          </div>`;
      }).join('');

      // Seeds Inventory / Drawer
      const seedCardsHtml = Object.keys(Alc.SEEDS).map(sId => {
        const sd = Alc.SEEDS[sId];
        const cnt = garden.seeds?.[sId] || 0;
        const canBuy = (s.resources.gold || 0) >= sd.cost;
        const matureMin = Math.round(sd.matureTime / 60);

        return `
          <div class="garden-seed-card">
            <div class="seed-card-head">
              <span class="seed-icon">${sd.icon}</span>
              <div>
                <strong class="seed-name">${isEn ? sd.nameEn : sd.nameRu}</strong>
                <div class="seed-mature-time">⏱ ${matureMin} ${uiText(' мин.', ' min.')} ${uiText('созревание', 'maturation')}</div>
              </div>
            </div>
            <div class="seed-stock-tag">🌰 ${uiText('В запасе: ', 'In stock: ')}<strong>${cnt}</strong> ${uiText('шт.', 'pcs')}</div>
            <button type="button" class="btn-buy-seed" data-alchemy-action="buy" data-item="${sId}" data-count="1" ${canBuy ? '' : 'disabled'}>
              💰 ${sd.cost} ${uiText('монет', 'coins')} (${uiText('Купить', 'Buy')})
            </button>
          </div>`;
      }).join('');

      const gardenHtml = `
        <div class="garden-container">
          ${headerHtml}
          <div class="section-head"><h3>🌱 ${uiText('Делянки сада', 'Garden Plots')} (${garden.unlockedPlots || 2}/6)</h3></div>
          <div class="garden-plots-grid">${plotCardsHtml}</div>
          <div class="section-head" style="margin-top:20px"><h3>🌰 ${uiText('Запас семян в Жемчужине', 'Seed Reserves in Pearl')}</h3></div>
          <div class="garden-seeds-grid">${seedCardsHtml}</div>
        </div>`;

      body.innerHTML = gardenHtml;
    } else {
      // cauldron tab
      const rankTitle=isEn?currentRank.en:currentRank.ru;
      const rankPerk=isEn?currentRank.perkEn:currentRank.perkRu;

      const rankBanner=`
        <div class="alchemy-rank-banner">
          <div class="alchemy-rank-header">
            <span class="alchemy-rank-title">${uiText('Ранг алхимии:','Alchemy rank:')} ${rankTitle} (${uiText('Ранг','Rank')} ${alc.level}/5)</span>
            <small>${uiText('Опыт алхимии:','Alchemy XP:')} ${alc.xp}${nextRank?` / ${nextRank.xpReq}`:''}</small>
          </div>
          <progress max="${xpMax}" value="${alc.xp}" aria-label="${uiText('Опыт алхимии:','Alchemy XP:')}"></progress>
          <div class="alchemy-rank-perk">✦ ${rankPerk}</div>
          <div class="alchemy-stats-row">
            <span class="alchemy-stat-item">${uiText('Всего сварено:','Total brewed:')} <strong>${alc.stats.brews}</strong></span>
            <span class="alchemy-stat-item">${uiText('Успехов:','Successes:')} <strong>${alc.stats.success}</strong></span>
            <span class="alchemy-stat-item">${uiText('Критических успехов:','Critical successes:')} <strong>${alc.stats.crit}</strong></span>
            <span class="alchemy-stat-item">${uiText('Неудач (шлак):','Failures (slag):')} <strong>${alc.stats.fail}</strong></span>
            <span class="alchemy-stat-item">${uiText('Очищено Жемчужиной:','Purified with Pearl:')} <strong>${alc.stats.pearlPurified}</strong></span>
          </div>
        </div>`;

      const danDu = alc.meridians?.danDu || 0;
      const purity = alc.meridians?.purity !== undefined ? alc.meridians.purity : Math.max(0, 100 - danDu);
      const danDuStatus = Alc && Alc.getDanDuStatus ? Alc.getDanDuStatus(s, lang) : { name: '', desc: '', badgeClass: '' };
      const canPurge = Alc && Alc.canMeridianPurge ? Alc.canMeridianPurge(s) : false;

      const meridianBanner = `
        <div class="alchemy-meridian-card">
          <div class="meridian-card-header">
            <div>
              <span class="meridian-eyebrow">✧ ${uiText('СОСТОЯНИЕ МЕРИДИАНОВ И ТОКСИНОВ ДАНЬ ДУ', 'MERIDIAN PURITY & DAN DU TOXINS')}</span>
              <h4>${uiText('Чистота меридианов', 'Meridian purity')}: ${purity}% ${danDu > 0 ? `(${uiText('Дань Ду: ', 'Dan Du: ')}${danDu}/100)` : (alc.meridians?.pearlPurges > 0 ? `(✧ ${uiText('Безупречные Небесные Меридианы', 'Immaculate Celestial Meridians')})` : `(${uiText('Чистые меридианы', 'Clean Meridians')})`)}</h4>
            </div>
            <div class="pillar-meridian-badge ${danDuStatus.badgeClass}">
              <span>${danDuStatus.name}</span>
            </div>
          </div>
          <progress class="${danDu === 0 ? 'progress-pure' : (danDu > 50 ? 'progress-toxic' : 'progress-warning')}" max="100" value="${purity}" aria-label="${uiText('Чистота меридианов', 'Meridian purity')}"></progress>
          <div class="meridian-card-footer">
            <span class="meridian-effect-hint">✦ ${danDuStatus.desc}</span>
            ${danDu > 0 ? `<button type="button" class="btn-pearl" data-alchemy-action="meridian-purge" ${canPurge ? '' : 'disabled'}>✨ ${uiText('Очистить Жемчужиной (15 Ци)', 'Purge with Pearl (15 Qi)')}</button>` : ''}
          </div>
        </div>`;

      const ingKeys=Object.keys(Alc.INGREDIENTS);
      const ingCards=ingKeys.map(k=>{
        const ing=Alc.INGREDIENTS[k];
        const count=alc.ingredients[k]||0;
        return `
          <div class="alchemy-ing-card" title="${isEn?ing.descEn:ing.descRu}">
            <span class="alchemy-ing-icon">${ing.icon}</span>
            <span class="alchemy-ing-name">${isEn?ing.nameEn:ing.nameRu}</span>
            <span class="alchemy-ing-count">${count}</span>
          </div>`;
      }).join('');

      const ingSection=`
        <div class="section-head"><h3>${uiText('Ингредиенты в сумке','Ingredients in Pouch')}</h3></div>
        <div class="alchemy-ingredients-grid">${ingCards}</div>`;

      const maxCrucibleForRecipe = (rId) => Alc.maxBrew ? Alc.maxBrew(s, rId, 'crucible') : 1;
      const maxPearlForRecipe = (rId) => Alc.maxBrew ? Alc.maxBrew(s, rId, 'pearl') : 1;

      const batchToolbar = `
        <div class="alchemy-batch-toolbar">
          <span class="alchemy-batch-label">${uiText('Количество варки:', 'Brew batch quantity:')}</span>
          <div class="alchemy-batch-buttons">
            <button type="button" class="batch-btn ${alchemyBatch === 1 ? 'active' : ''}" data-alchemy-batch="1">×1</button>
            <button type="button" class="batch-btn ${alchemyBatch === 5 ? 'active' : ''}" data-alchemy-batch="5">×5</button>
            <button type="button" class="batch-btn ${alchemyBatch === 'max' ? 'active' : ''}" data-alchemy-batch="max">${uiText('Макс', 'Max')}</button>
          </div>
        </div>`;

      const unlocked=alc.unlockedRecipes||['vigor_broth'];
      const recipesHtml=unlocked.map(rId=>{
        const r=Alc.RECIPES[rId];
        if(!r)return '';
        const canCrucible=Alc.canBrew(s,rId,'crucible');
        const canPearl=Alc.canBrew(s,rId,'pearl');

        const maxC = maxCrucibleForRecipe(rId);
        const maxP = maxPearlForRecipe(rId);
        const countC = alchemyBatch === 'max' ? maxC : Math.min(Number(alchemyBatch) || 1, maxC);
        const countP = alchemyBatch === 'max' ? maxP : Math.min(Number(alchemyBatch) || 1, maxP);

        const crucibleText = (alchemyBatch !== 1 && countC > 1)
          ? `${uiText('Сварить в котле', 'Brew in crucible')} (×${countC})`
          : uiText('Сварить в котле', 'Brew in crucible');

        const pearlText = (alchemyBatch !== 1 && countP > 1)
          ? `${uiText('Очистить Жемчужиной', 'Purify with Pearl')} (×${countP}, ${r.pearlQi * countP} ${uiText('Ци', 'Qi')})`
          : uiText(`Очистить Жемчужиной (${r.pearlQi} Ци)`, `Purify with Pearl (${r.pearlQi} Qi)`);

        const reqsHtml=Object.entries(r.ingredients).map(([ingId,needed])=>{
          const ing=Alc.INGREDIENTS[ingId];
          const has=alc.ingredients[ingId]||0;
          const isMet=has>=needed;
          return `<span class="alchemy-req-pill ${isMet?'met':'unmet'}">${ing.icon} ${isEn?ing.nameEn:ing.nameRu}: ${has}/${needed}</span>`;
        }).join(' ');

        const inStock = alc.inventory?.[rId] || 0;
        const pureStock = alc.pureInventory?.[rId] || 0;
        const stockTag = `<span class="alchemy-stock-tag">💊 ${uiText('В запасе: ', 'In stock: ')}<strong>${inStock}</strong> ${pureStock > 0 ? `(${pureStock} ✧ ${uiText('100% чист.', '100% pure')})` : ''}</span>`;

        const crucibleBtn=!r.requiresPearl
          ? `<button type="button" class="btn-crucible" data-alchemy-action="craft" data-recipe="${rId}" data-pearl="false" ${canCrucible?'':'disabled'}>${crucibleText}</button>`
          : `<span class="alchemy-req-pill unmet">${uiText('Только очищение Жемчужиной','Pearl purification only')}</span>`;

        const pearlBtn=`<button type="button" class="btn-pearl" data-alchemy-action="craft" data-recipe="${rId}" data-pearl="true" ${canPearl?'':'disabled'}>${pearlText}</button>`;

        return `
          <div class="alchemy-recipe-card ${r.requiresPearl?'requires-pearl':''}">
            <div class="alchemy-recipe-head">
              <span class="alchemy-recipe-title">${r.icon} ${isEn?r.nameEn:r.nameRu}</span>
              ${stockTag}
              <small>${uiText('Требуется ранг:','Required rank:')} ${r.reqLevel}</small>
            </div>
            <p class="alchemy-recipe-desc">${isEn?r.descEn:r.descRu}</p>
            <div class="alchemy-recipe-reqs">${reqsHtml}</div>
            <div class="alchemy-recipe-effect">⚡ ${isEn?r.effectEn:r.effectRu}</div>
            <div class="alchemy-combat-tag">⚔ ${isEn?r.combatEffectEn:r.combatEffectRu}</div>
            <div class="alchemy-recipe-actions">
              ${crucibleBtn}
              ${pearlBtn}
              ${inStock > 0 ? `<button type="button" class="btn-consume-pill" data-alchemy-action="consume-pill" data-recipe="${rId}">💊 ${uiText('Принять пилюлю', 'Consume pill')}</button>` : ''}
            </div>
          </div>`;
      }).join('');

      const recipesSection=`
        <div class="section-head"><h3>${uiText('Рецепты снадобий','Medicine Recipes')}</h3></div>
        ${batchToolbar}
        <div class="alchemy-recipes-list">${recipesHtml}</div>`;

      let logHtml='';
      if(alc.log&&alc.log.length>0){
        logHtml=`
          <div class="alchemy-log-box">
            <h4>${uiText('История варки','Brewing Log')}</h4>
            ${alc.log.slice(0,5).map(e=>`<div class="alchemy-log-item">${isEn?e.en:e.ru}</div>`).join('')}
          </div>`;
      }

      body.innerHTML=rankBanner+meridianBanner+ingSection+recipesSection+logHtml;
    }
  }
  function openAlchemyDialog(){
    renderAlchemy();
    const d=$('alchemy-dialog');
    if(d){
      if(typeof d.showModal==='function')d.showModal();
      else d.setAttribute?.('open','');
    }
  }
  function openMapDialog(){
    renderMap();
    const d=$('world-map-dialog');
    if(d){
      if(typeof d.showModal==='function')d.showModal();
      else d.setAttribute?.('open','');
    }
    centerMap();
    Sound.playScrollOpen ? Sound.playScrollOpen() : Sound.playParchment?.();
  }
  function worldView() {
    const W=E.world,w=s.world,scene=W.current(s);
    const Alc = typeof IsekaiAlchemy !== 'undefined' ? IsekaiAlchemy : (E.alchemy || Alchemy);
    const forageTable = Alc?.FORAGE_TABLES?.[w.location];
    const canForageHere = Alc?.canForage ? Alc.canForage(s, w.location) : false;
    const cd = s.alchemy?.forageCooldown || 0;
    const forageBtnText = cd > 0
      ? `${uiText('Отдых травника: ', 'Foraging rest: ')}${Math.ceil(cd)} ${uiText('сек.', 's.')}`
      : uiText('🌿 Собрать травы в этой области (10 выносл.)', '🌿 Forage herbs in this area (10 stam.)');
    const forageCard = (forageTable && !w.journey) ? `
      <div class="world-forage-card">
        <div class="forage-card-header">
          <span class="forage-card-icon">🌿</span>
          <div class="forage-card-meta">
            <strong>${uiText('Травничество: ', 'Herbalism: ')}${L?.language === 'en' ? forageTable.nameEn : forageTable.nameRu}</strong>
            <small>${L?.language === 'en' ? forageTable.descEn : forageTable.descRu}</small>
          </div>
          <button type="button" class="btn-forage" id="world-forage-btn" data-location="${w.location}" ${canForageHere ? '' : 'disabled'}>
            ${forageBtnText}
          </button>
        </div>
      </div>` : '';

    const mapPortalCard = `
      <div class="world-map-portal-card">
        <div class="portal-header">
          <div class="portal-eyebrow">
            <span class="portal-glyph">🧭</span>
            <span>${uiText('КАРТА ДОЛИНЫ ПЛЫВУЩИХ ОБЛАКОВ', 'MAP OF FLOATING CLOUD VALLEY')}</span>
          </div>
          <button type="button" class="portal-expand-btn" id="world-tab-open-map">
            <span>🗺️ ${uiText('Развернуть свиток карты', 'Open Scroll Map')}</span>
          </button>
        </div>
        <div class="portal-body">
          <div class="portal-location-status">
            <span class="portal-dot">●</span>
            <strong>${uiText('Текущее место: ', 'Current location: ')}${t(W.locations[w.location].name)}</strong>
            ${w.journey ? `<span class="portal-journey-tag">🐎 ${uiText('В пути: ', 'Traveling: ')}${t(W.locations[w.journey.destination].name)} (${Math.ceil(w.journey.remaining)} ${uiText('сек', 's')})</span>` : ''}
          </div>
          <p class="portal-hint">${uiText('Исследуй тайники, древние руины и короткие тропы на древнем свитке.', 'Discover hidden caches, ancient ruins, and secret shortcuts on the ancient scroll.')}</p>
        </div>
      </div>`;
    let html = mapPortalCard + forageCard + `<h2>${uiText('Дороги другого мира', 'Roads of another world')}</h2><p class="intro">${uiText('Сейчас: ', 'Current: ')}${t(W.locations[w.location].name)}. ${w.journey ? (uiText('В пути: ', 'Travelling: ') + t(W.locations[w.journey.destination].name) + uiText(', осталось ', ', remaining ') + Math.ceil(w.journey.remaining) + uiText(' сек.', ' s.')) : uiText('Можно выбрать маршрут или поискать встречу на месте.', 'Choose a destination or look for an encounter here.')}</p>`;
    html+=techniqueActionsView();
    if(s.stage===1)html+=`<section class="story-panel"><h3>${uiText('Школа определяет твой путь','Your school shapes your path')}</h3><p>${E.sects.progress(s,'gates',L?.language||'ru')}</p><div class="cards">${Object.keys(E.sects.schools).map(k=>schoolView(k)).join('')}</div></section>`;
    if(s.stage>=2&&w.admission)html+=schoolView(w.admission);
    html+=`<section class="workers">${button('atlas-survey','',uiText('Осмотреть окрестности','Survey surroundings'),E.atlas.canSurvey(s))}<p class="intro">${E.atlas.hint(s,L?.language||'ru')}</p></section>`;
    if(w.location==='forest')html+=`<section class="cards">${card(uiText('Остаться на опушке','Stay at the edge'),uiText('Свет, голоса путников и обычные травы. Безопасный осмотр окрестностей.','Light, travellers’ voices and common herbs. A safe survey of the surroundings.'),button('atlas-survey','',uiText('Осмотреть опушку','Survey the edge'),E.atlas.canSurvey(s)))}${card(uiText('Следовать тропе','Follow the trail'),uiText('Под деревьями ещё слышны птицы. Следы у ручья стоит осмотреть, прежде чем приближаться. 15 выносливости; отдых 5 минут.','Birds still sing beneath the trees. Examine the tracks by the stream before approaching. 15 stamina; recovery 5 minutes.'),button('forest-search','trail',uiText('Осторожно пройти','Walk cautiously'),E.atlas.canSurvey(s)))}${card(uiText('Углубиться в чащу','Enter the thicket'),uiText('Ветви сломаны, свет гаснет. Здесь встречаются редкие корни — и те, кто их охраняет. 15 выносливости; отдых 5 минут.','Branches are broken and the light fades. Rare roots grow here — with creatures guarding them. 15 stamina; recovery 5 minutes.'),button('forest-search','deep',uiText('Пойти за следами','Follow the tracks'),E.atlas.canSurvey(s)))}</section>`;
    if(scene){const memory=W.memory?.context(s,scene,L?.language||'ru');if(memory)html+=`<aside class="encounter-memory"><strong>${uiText('Вы уже знакомы','You have met before')}</strong><p>${memory}</p></aside>`;}
    if(scene)html+=`<article class="story-panel"><div class="eyebrow">ВСТРЕЧА · ${W.locations[w.location].name}</div><h2>${W.sceneText(scene,'title',L?.language)}</h2><p>${W.sceneText(scene,'text',L?.language,s)}</p><div class="cards">${scene.choices.map(c=>encounterChoiceView(scene,c)).join('')}</div></article>`;
    html+=`<div class="workers">${button('encounter','','Поискать встречу',W.canEncounter(s))}<p class="intro">${w.encounterCooldown>0?`Новая встреча доступна через ${Math.ceil(w.encounterCooldown)} сек.`:'При прибытии появляется встреча; после её завершения — 5 минут до следующей.'} Пока ты офлайн, опасный выбор не делается автоматически. Возвращений после гибели: ${w.deaths}.</p></div>`;
    const pending=W.pendingQuests(s);
    const leads=W.causalLeads(s,L?.language||'ru');
    if(leads.length)html+=`<section class="workers"><h3>${uiText('Нити твоей истории','Threads of your story')}</h3><p class="intro">${uiText('Прошлые поступки могут получить продолжение. Ищи встречи в указанных местах; это возможности, а не автоматически принятые задания.','Your past deeds may have a continuation. Seek encounters in these locations; these are opportunities, not automatically accepted quests.')}</p><div class="cards">${leads.map(q=>card(q.title,t(W.locations[q.location].name),'')).join('')}</div></section>`;
    if(pending.length)html+=`<section class="workers"><h3>Ожидают продолжения</h3><p class="intro">Вернись в указанное место и ищи встречи. За каждое завершённое поручение: признание +1 в главе, где ты оказал помощь.</p><div class="cards">${pending.map(q=>card(W.sceneText(q.scene,'title',L?.language),`${W.locations[q.location].name} · ${W.pathNames[q.route]} · Глава ${q.stage+1}`,'')).join('')}</div></section>`;
    html+=`<div class="cards">${Object.entries(W.locations).filter(([k])=>W.knownLocations(s).includes(k)).map(([k,p])=>{
      const know=E.atlas.overview(s,E,k,L?.language||'ru');
      const cutOff=know.desc.search(/(\s+(Здесь встречены|Met here|Здесь живут|Living and working):)/);
      const base=cutOff>0?know.desc.slice(0,cutOff):know.desc;
      const sentences=base.match(/[^.!?]+[.!?]+/g)||[base];
      const isLong=base.length>120||sentences.length>1||cutOff>0||(know.people&&know.people.length>0)||(s.atlas.discoveries?.[k]?.length>0);
      const teaser=isLong?sentences[0]:base;
      const cardDesc=`${teaser}${isLong&&teaser!==know.desc?'…':''} <span class="location-trait">${know.bonus}</span>`;
      const travelBtn=button('travel',k,w.location===k?'Ты здесь':`Отправиться · ${W.travelTime(s,k)} сек`,W.canTravel(s,k));
      const detailsBtn=`<button type="button" class="location-details-btn" data-place="${k}">${uiText('Подробнее','Details')}</button>`;
      return card(p.name,cardDesc,travelBtn+detailsBtn,W.travelReason(s,k,L?.language||'ru'));
    }).join('')}</div>`;
    html+=`<p class="intro">${uiText("Работа требует нужного места. В пути, во время ручных действий и боя медитация и практика прерываются; они не возобновляются автоматически.","Work requires its assigned location. Travel, manual actions and combat interrupt meditation and practice; they do not resume automatically.")} На месте действует бонус локации к подходящему занятию. Погибнув, ты возвращаешься в деревню и теряешь 50% монет, трав, энергии, осколков и других переносимых ресурсов. Прокачка, сюжет, знакомства, здания, репутация, влияние и миры сохраняются.</p>`;
    html+='<p class="intro">Встречи случайны и зависят от места, знакомств и этапа пути. Недавние события не повторяются подряд. Полученные уникальные находки больше не выдаются; знакомые люди могут предложить новые дела. Важные доступные знакомства не теряются из-за долгого невезения; прошлые поступки открывают продолжения встреч.</p>';
    html+=`<div class="workers"><h3>Люди, которых ты встретил</h3>${w.mentors.length?w.mentors.map(k=>`<p class="intro">${W.mentorNames[k]}</p>`).join(''):'<p class="intro">Наставников пока нет. Помощь можно найти на разных дорогах.</p>'}${w.contacts.includes('scholar')?'<p class="intro">Ты знаешь, где найти библиотекаря Вэя: в городе Серебряного Моста.</p>':''}<p class="intro">Советы действуют постоянно и не складываются повторно. Материалы доступны для дальнейшего развития, даже если получены раньше соответствующей главы.</p></div>`;
    html+=peopleView();
    if(s.stage===1)html+=`<section class="workers"><h3>Вступление в секту</h3><p class="intro">Представительства находятся в городе Серебряного Моста. Выбери путь поступления. Затем подготовь третью ступень и запас снаряжения. Заслужи три победы или 12 признания за завершённые поручения. Можно сменить заявку до вступления.</p><div class="cards">${Object.entries(W.admissions).map(([k,a])=>card(a.name,a.text,button('apply-sect',k,w.admission===k?'Заявка выбрана':'Подать заявку',W.canApply(s,k)),k==='gates'?'Доступно без знакомства':w.admissionRoutes.includes(k)?'Поручительство получено':'Найди соответствующую встречу в лесу или храме',`sect-card-${k}`,sectEmblems[k]||'')).join('')}</div></section>`;
    if(s.stage>=2&&w.admission)html+=`<p class="intro">Твой путь: ${W.admissions[w.admission].name}. ${W.admissions[w.admission].text}</p>`;
    return html;
  }
  function employmentView(){
    const order=s.employment.order;
    if(order)return `<section class="active-order"><div class="eyebrow">${uiText('ТВОЁ ПОРУЧЕНИЕ','YOUR CONTRACT')}</div><h3>${E.orderName(s,order.kind,order.place||'village')}</h3><p>${t(E.world.locations[order.place||'village'].name)} · ${fmt(order.progress)} / ${E.orders[order.kind].target} ${order.kind==='ledger'?uiText('сек.','s'):uiText('шагов','steps')} · ${uiText('Оплата','Payment')}: ${order.pay} ${t(E.names.gold)}</p><progress value="${order.progress}" max="${E.orders[order.kind].target}" aria-label="${uiText('Прогресс заказа','Contract progress')}"></progress><div class="actions">${button('claim-order','',uiText('Получить оплату','Collect payment'),E.canClaimOrder(s))}${button('cancel-order','',uiText('Отменить без оплаты','Cancel without payment'))}</div></section>`;
    return `<section class="workers"><p class="intro">Сначала познакомься с заказчиком. Поручения появляются после встреч; принятый заказ нужно выполнять и сдавать в указанном месте.</p><h3>Доска подработок</h3><p class="intro">${uiText("Выполнено заказов:","Completed contracts:")} ${s.employment.completed}. ${uiText("Каждые 5 заказов расценки растут на 10%, до +100%. В городе оплата нового заказа выше на 25%.","Rates increase by 10% per five contracts, up to +100%. New city contracts pay 25% more.")} ${uiText("Уборка и разгрузка требуют физической работы и прерывают медитацию. Сверка накладных занимает фоновое занятие.","Cleaning and hauling require physical work and interrupt meditation. Checking ledgers occupies your background activity.")}</p>${order?`<div class="progress-box"><h3>${E.orderName(s,order.kind,order.place||'village')}</h3><p class="intro">Выполнено ${fmt(order.progress)} / ${E.orders[order.kind].target}${order.kind==='ledger'?' сек':''} · оплата ${order.pay} монет</p><progress value="${order.progress}" max="${E.orders[order.kind].target}" aria-label="Прогресс заказа"></progress><div class="actions">${button('claim-order','','Получить оплату',E.canClaimOrder(s))}${button('cancel-order','','Отменить без оплаты')}</div><p class="intro">Отмена удаляет только прогресс текущего заказа. Кнопки уборки и разгрузки находятся в блоке активных действий.</p></div>`:''}<div class="cards">${Object.entries(E.orders).filter(([k])=>!order&&E.orderAvailable(s,k)).map(([k,o])=>card(E.orderName(s,k),o.desc,button('order',k,'Взять заказ',E.canOrder(s,k)),`${E.orderPay(s,k)} монет · тело от ${o.body}`)).join('')}</div></section>`;
  }
  document.addEventListener('click', e => {
    const nodeCard = e.target.closest?.('.map-node');
    if (nodeCard && !e.target.closest?.('button, details, summary, input, select, textarea, a')) {
      const placeId = nodeCard.dataset.mapNode;
      if (placeId) {
        noteSelection = placeId;
        if ($('map-note-place')) $('map-note-place').value = placeId;
        if ($('map-note-text')) $('map-note-text').value = s.atlas.notes[placeId] || '';
        renderMap();
        return;
      }
    }
    const b = e.target.closest('button'); if (!b || b.disabled) return; tick();const placesBefore=E.world.knownLocations(s).length;
    if(b.dataset?.roadEvent === 'claim' || b.classList?.contains?.('map-road-event-btn')){
      if(E.action(s, 'claim-road-event')){
        Sound.playCaravanBell?.();
        save();
        toast(uiText('Дорожное событие завершено!', 'Road encounter resolved!'));
        renderMap();
        return;
      }
    }
    if(b.dataset?.mapAssemble || b.classList?.contains?.('btn-assemble-map')){
      if(E.action(s, 'atlas-assemble')){
        Sound.playScrollOpen?.();
        save();
        toast(uiText('Карта сокровищ собрана! Тайный грот явлен на карте!', 'Treasure map assembled! Secret Grotto revealed!'));
        renderMap();
        return;
      }
    }
    if(b.classList?.contains?.('map-secret-claim-btn')||b.dataset?.secretId){
      const secId = b.dataset.secretId;
      if(E.action(s, 'atlas-secret', secId)){
        save();
        toast(uiText('Тайник обнаружен!', 'Cache discovered!'));
        renderMap();
        return;
      } else {
        const sec = (E.atlas.secretsCatalog || []).find(item => item.id === secId);
        if (sec && (s.atlas?.secrets || []).includes(secId)) {
          const secName = L?.language === 'en' ? sec.name[1] : sec.name[0];
          toast(uiText('Тайник уже исследован: ', 'Cache already explored: ') + secName);
          return;
        }
      }
    }
    if(b.dataset?.locateSecret){
      const secId = b.dataset.locateSecret;
      const sec = (E.atlas.secretsCatalog || []).find(item => item.id === secId);
      if(sec){
        if(!showMapSecrets){
          showMapSecrets = true;
          try { localStorage.setItem('isekai-show-map-secrets', 'true'); } catch {}
          renderMap();
        }
        const v = $('map-viewport');
        if(v){
          v.scrollLeft = Math.max(0, sec.x * mapZoom - (v.clientWidth || 800) / 2);
          v.scrollTop = Math.max(0, sec.y * mapZoom - (v.clientHeight || 500) / 2);
        }
        const marker = $('map-canvas')?.querySelector?.(`[data-secret-id="${secId}"]`);
        if(marker){
          marker.classList.add('landmark-pulse-active');
          setTimeout(() => marker.classList.remove('landmark-pulse-active'), 2500);
        }
      }
      return;
    }
    if(b.id==='map-toggle-secrets'){
      showMapSecrets = !showMapSecrets;
      try { localStorage.setItem('isekai-show-map-secrets', String(showMapSecrets)); } catch {}
      renderMap();
      return;
    }
    if(b.id==='audio-toggle'||b.closest?.('#audio-toggle')){Sound.toggle();updateAudioUi();return;}
    if(b.dataset?.fateTab){activeFateTab=b.dataset.fateTab;renderFateTree();return;}
    if(b.id==='open-fate-tree'||b.id==='story-open-fate-tree'||b.id==='story-open-fate-tree-archive'||b.id==='legacy-open-fate-tree'){Sound.playParchment();openFateTreeDialog();return;}
    if(b.id==='close-fate-tree'){$('fate-tree-dialog')?.close?.();return;}
    if(b.id==='open-map'){openMapDialog();return;}
    if(b.id==='close-map'){$('world-map-dialog')?.close?.();return;}
    if(b.id==='open-alchemy'||b.dataset?.quickAction==='alchemy'||b.id==='combat-alchemy-btn'){$('alchemy-dialog')?.showModal?.();renderAlchemy();Sound.playParchment?.();return;}
    if(b.id==='close-alchemy'){$('alchemy-dialog')?.close?.();return;}
    if(b.dataset?.alchemyTab){activeAlchemyTab=b.dataset.alchemyTab;renderAlchemy();return;}
    if(b.dataset?.alchemyBatch){
      const val = b.dataset.alchemyBatch;
      alchemyBatch = val === 'max' ? 'max' : (parseInt(val, 10) || 1);
      renderAlchemy();
      return;
    }
    if(b.dataset?.alchemyAction){
      const act = b.dataset.alchemyAction;
      const Alc = typeof IsekaiAlchemy !== 'undefined' ? IsekaiAlchemy : (E.alchemy || Alchemy);
      if (act === 'craft') {
        const recipeId = b.dataset.recipe;
        const usePearl = b.dataset.pearl === 'true';
        const mode = usePearl ? 'pearl' : 'crucible';
        const maxAvailable = Alc.maxBrew ? Alc.maxBrew(s, recipeId, mode) : 1;
        const desiredCount = alchemyBatch === 'max' ? maxAvailable : (Number(alchemyBatch) || 1);
        const batchCount = Math.max(1, Math.min(desiredCount, maxAvailable || 1));

        const statsBefore = { ...(s.alchemy?.stats || {}) };
        if (E.action(s, 'alchemy-craft', `${recipeId}:${mode}:${batchCount}`)) {
          if (usePearl) Sound.playBreakthrough?.();
          else Sound.playBowl?.();
          save();
          const statsAfter = s.alchemy?.stats || {};
          const successes = (statsAfter.success || 0) - (statsBefore.success || 0);
          const crits = (statsAfter.crit || 0) - (statsBefore.crit || 0);
          const fails = (statsAfter.fail || 0) - (statsBefore.fail || 0);
          if (batchCount > 1) {
            const summary = `${uiText('Сварено пилюль: ', 'Pills brewed: ')}${successes + fails} (${successes - crits} ${uiText('успешно', 'success')}, ${crits} ${uiText('критических', 'critical')}, ${fails} ${uiText('неудач', 'failures')})`;
            toast(summary);
          }
        } else {
          toast(uiText('Не хватает сырья или уровня!', 'Missing ingredients or level!'));
        }
      } else if (act === 'treat') {
        const patientId = b.dataset.patient;
        const usePearl = b.dataset.pearl === 'true';
        if (E.action(s, 'alchemy-treat', `${patientId}:${usePearl ? 'pearl' : 'pill'}`)) {
          if (usePearl) Sound.playBreakthrough?.();
          else Sound.playBowl?.();
          save();
          toast(uiText('Пациент успешно исцелён!', 'Patient successfully cured!'));
        } else {
          toast(uiText('Не хватает снадобья или Ци!', 'Missing required remedy or Qi!'));
        }
      } else if (act === 'forage') {
        const loc = b.dataset.location || s.world?.location || 'village';
        if (E.action(s, 'alchemy-forage', loc)) {
          Sound.playParchment?.();
          save();
          toast(uiText('Дикорастущие травы собраны!', 'Wild herbs foraged!'));
        } else {
          toast(uiText('Сбор трав ещё на перезарядке!', 'Herb foraging is still on cooldown!'));
        }
      } else if (act === 'trade') {
        const recipeId = b.dataset.recipe;
        const count = parseInt(b.dataset.count || '1', 10);
        const place = b.dataset.place || s.world?.location || 'village';
        if (E.action(s, 'alchemy-trade', `${recipeId}:${count}:${place}`)) {
          Sound.playClick?.();
          save();
          toast(uiText('Партия пилюль продана!', 'Pill batch sold!'));
        } else {
          toast(uiText('Нет пилюль для продажи!', 'No pills in inventory to sell!'));
        }
      } else if (act === 'equip-pouch') {
        const slot = b.dataset.slot || '0';
        const recipeId = b.dataset.recipe;
        if (E.action(s, 'alchemy-pouch', `${slot}:${recipeId}`)) {
          Sound.playClick?.();
          save();
          toast(uiText('Пилюля помещена в боевой пояс!', 'Pill equipped to combat belt!'));
        }
      } else if (act === 'unequip-pouch') {
        const slot = b.dataset.slot || '0';
        if (E.action(s, 'alchemy-pouch', `${slot}:none`)) {
          Sound.playClick?.();
          save();
          toast(uiText('Слот боевого пояса очищен.', 'Combat belt slot cleared.'));
        }
      } else if (act === 'buy') {
        const itemId = b.dataset.item;
        const count = parseInt(b.dataset.count || '1', 10);
        if (E.action(s, 'alchemy-buy', `${itemId}:${count}`)) {
          Sound.playClick?.();
          save();
        } else {
          toast(uiText('Не хватает монет!', 'Not enough coins!'));
        }
      } else if (act === 'sell') {
        const kind = b.dataset.kind || 'standard';
        const count = parseInt(b.dataset.count || '1', 10);
        if (E.action(s, 'alchemy-sell', `${kind}:${count}`)) {
          Sound.playClick?.();
          save();
        } else {
          toast(uiText('Нечего продать!', 'Nothing to sell!'));
        }
      } else if (act === 'grind') {
        if (E.action(s, 'alchemy-grind')) {
          Sound.playClick?.();
          save();
        } else {
          toast(uiText('Нет осколков!', 'No relic shards!'));
        }
      } else if (act === 'garden-plant') {
        const plot = b.dataset.plot;
        const sel = $(`plot-seed-select-${plot}`);
        const seedId = sel ? sel.value : b.dataset.seed;
        if (E.action(s, 'alchemy-garden-plant', `${plot}:${seedId}`)) {
          Sound.playParchment?.();
          save();
          toast(uiText('Семя успешно посажено!', 'Seed successfully planted!'));
        } else {
          toast(uiText('Нет семян этого вида!', 'No seeds of this kind!'));
        }
      } else if (act === 'garden-water') {
        const plot = b.dataset.plot;
        if (E.action(s, 'alchemy-garden-water', plot)) {
          Sound.playBowl?.();
          save();
          toast(uiText('Делянка орошена Живительной Росой!', 'Plot watered with Life-Giving Dew!'));
        } else {
          toast(uiText('Не хватает Росы для полива!', 'Not enough Dew to water!'));
        }
      } else if (act === 'garden-infuse') {
        const plot = b.dataset.plot;
        if (E.action(s, 'alchemy-garden-infuse', plot)) {
          Sound.playBreakthrough?.();
          save();
          toast(uiText('Истинная Ци влита в корни растения!', 'True Qi infused into plant roots!'));
        } else {
          toast(uiText('Не хватает Истинной Ци!', 'Not enough True Qi!'));
        }
      } else if (act === 'garden-harvest') {
        const plot = b.dataset.plot;
        if (E.action(s, 'alchemy-garden-harvest', plot)) {
          Sound.playBreakthrough?.();
          save();
          toast(uiText('Урожай успешно собран!', 'Crop successfully harvested!'));
        } else {
          toast(uiText('Растение ещё не созрело!', 'Plant is not mature yet!'));
        }
      } else if (act === 'garden-harvest-all') {
        if (E.action(s, 'alchemy-garden-harvest-all')) {
          Sound.playBreakthrough?.();
          save();
          toast(uiText('Весь созревший урожай собран!', 'All mature crops harvested!'));
        } else {
          toast(uiText('Растение ещё не созрело!', 'Plant is not mature yet!'));
        }
      } else if (act === 'garden-unlock') {
        const plot = b.dataset.plot;
        if (E.action(s, 'alchemy-garden-unlock', plot)) {
          Sound.playBreakthrough?.();
          save();
          toast(uiText('Новая делянка сада разблокирована!', 'New garden plot unlocked!'));
        } else {
          toast(uiText('Не выполнены условия разблокировки!', 'Unlock requirements not met!'));
        }
      } else if (act === 'meridian-purge') {
        if (E.action(s, 'meridian-purge')) {
          Sound.playBreakthrough?.();
          save();
          toast(uiText('Меридианы очищены Небесной Жемчужиной!', 'Meridians purged by the Sky Poison Pearl!'));
        } else {
          toast(uiText('Не хватает Ци или меридианы уже чисты!', 'Not enough Qi or meridians already clean!'));
        }
      } else if (act === 'consume-pill') {
        const recipeId = b.dataset.recipe;
        if (E.action(s, 'alchemy-consume', recipeId)) {
          Sound.playBowl?.();
          save();
          toast(uiText('Пилюля принята!', 'Pill consumed!'));
        } else {
          toast(uiText('Нет пилюли в запасе!', 'No pill in stock!'));
        }
      }
      renderAlchemy();
      render();
      return;
    }
    if (b.id === 'world-forage-btn' || b.closest?.('#world-forage-btn')) {
      const loc = b.dataset.location || s.world?.location || 'village';
      if (E.action(s, 'alchemy-forage', loc)) {
        Sound.playParchment?.();
        save();
        toast(uiText('Дикорастущие травы собраны!', 'Wild herbs foraged!'));
        render();
      } else {
        toast(uiText('Сбор трав ещё на перезарядке!', 'Herb foraging is still on cooldown!'));
      }
      return;
    }
    if (b.dataset?.quickAction === 'combat-pill') {
      const pillId = b.dataset.pillId;
      if (E.combat?.act) {
        if (E.combat.act(s, `pill:${pillId}`, E)) {
          Sound.playClick?.();
          save();
          render();
        } else {
          toast(uiText('Нет пилюли для использования!', 'No pill available to use!'));
        }
      }
      return;
    }
    if(b.id==='goal-quick-nav'||b.closest?.('#goal-quick-nav')){
      const goalEl = document.querySelector('.story-goal') || document.querySelector('.rebirth') || document.querySelector('[data-hero-section="actions"]');
      if(goalEl){
        goalEl.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
        goalEl.classList?.add?.('highlight-pulse');
        setTimeout(() => goalEl.classList?.remove?.('highlight-pulse'), 1200);
      }
      return;
    }
    if(b.id==='world-tab-open-map'||b.closest?.('#world-tab-open-map')){
      openMapDialog();
      return;
    }
    if(b.id==='hero-collapse-toggle'){heroCollapsed=!heroCollapsed;setUiPref('isekai-hero-collapsed',String(heroCollapsed));applyHeroCollapse();return;}
    if(b.id==='novel-font-btn'){novelSerif=!novelSerif;setUiPref('isekai-novel-serif',String(novelSerif));render();return;}
    if(b.id==='novel-size-btn'){novelLarge=!novelLarge;setUiPref('isekai-novel-large',String(novelLarge));render();return;}
    if(b.id==='close-breakthrough'){if($('breakthrough-modal'))$('breakthrough-modal').hidden=true;return;}
    if(b.dataset?.novelStep !== undefined){
      Sound.playParchment();
      const maxStep = s.stage === 0 ? s.storyStep : (s.stage === 1 ? (s.chapterTwoStep || 0) : 0);
      const step = parseInt(b.dataset.novelStep, 10);
      if(!isNaN(step) && step >= 0 && step <= maxStep){
        novelViewStep = (step === maxStep) ? null : step;
        render();
        return;
      }
    }
    if(b.dataset?.place&&b.classList?.contains?.('location-details-btn')){openLocationDialog(b.dataset.place);return;}
    if(b.id==='close-location-dialog'||b.id==='close-location-dialog-btn'){$('location-dialog')?.close?.();currentDialogPlace=null;return;}
    if(b.dataset?.mapNote){noteSelection=b.dataset.mapNote;$('map-note-place').value=noteSelection;$('map-note-text').value=s.atlas.notes[noteSelection]||'';$('map-note-text').focus?.();return;}
    if(b.id==='map-show-encounter')$('world-map-dialog').close?.();
    if(b.id==='dismiss-return-report'){returnSummary=null;render();return;}
    if(b.dataset.language&&L){L.setLanguage(b.dataset.language);applyView();refreshNames();updateAudioUi();}
    if(b.dataset.nameStyle&&N.styles[b.dataset.nameStyle]){nameStyle=b.dataset.nameStyle;refreshNames();}
    if(b.id==='random-names')refreshNames();
    if(b.dataset.namePick!==undefined&&nameOptions[Number(b.dataset.namePick)]){$('player-name-input').value=nameOptions[Number(b.dataset.namePick)];$('identity-error').textContent='';}
    if (['visual','data'].includes(b.dataset.view)) { view = b.dataset.view; try { localStorage.setItem('isekai-idle-interface',view); } catch {} applyView(); }
    if (b.dataset.tab) { tab = b.dataset.tab; Sound.playClick(); }
    if (b.dataset?.quickAction) {
      const act = b.dataset.quickAction;
      const val = b.dataset.quickValue !== undefined ? b.dataset.quickValue : '';
      if (act === 'style') {
        s.style = val;
        Sound.playClash?.();
        save();
        render();
        return;
      }
      if (act === 'click') {
        Sound.playClick();
        const clickKey = val, clickDef = E.clicks[clickKey];
        if (clickDef && E.canClick(s, clickKey)) {
          const rect = b.getBoundingClientRect ? b.getBoundingClientRect() : { left: 240, top: 320, width: 80 };
          const cx = rect.left + rect.width / 2, cy = rect.top;
          spawnFloating(`−${clickDef.stamina} ${uiText('Выносл.','Stam.')}`, 'floating-stamina', cx, cy);
          if (['squat', 'labor', 'sweep', 'haul'].includes(clickKey)) {
            setTimeout(() => spawnFloating(`+0.05 ${uiText('Тело','Body')}`, 'floating-body', cx, cy - 18), 120);
          } else if (['posture', 'breathe'].includes(clickKey)) {
            setTimeout(() => spawnFloating(`+0.5 ${uiText('Спокойствие','Calm')}`, 'floating-xp', cx, cy - 18), 120);
          } else if (clickKey === 'scout' || clickKey === 'search') {
            setTimeout(() => spawnFloating(`+1 ${uiText('Осмотр','Search')}`, 'floating-gold', cx, cy - 18), 120);
          }
          if (autoResumeRoutine && lastMaintainedActivity && lastMaintainedActivity !== 'rest') {
            if (autoResumeTimer) clearTimeout(autoResumeTimer);
            autoResumeTimer = setTimeout(() => {
              if (s.activity === 'rest' && lastMaintainedActivity && lastMaintainedActivity !== 'rest') {
                s.activity = lastMaintainedActivity;
                save();
                render();
              }
            }, 1800);
          }
        } else if (clickDef && s.stamina < clickDef.stamina) {
          b.classList?.add?.('shake-warning');
          setTimeout(() => b.classList?.remove?.('shake-warning'), 400);
          const rect = b.getBoundingClientRect ? b.getBoundingClientRect() : { left: 240, top: 320, width: 80 };
          spawnFloating(uiText('Мало выносливости!', 'Low stamina!'), 'floating-stamina', rect.left + rect.width / 2, rect.top);
        }
      }
      const realmBefore = s.realm;
      if (E.action(s, act, val)) {
        if (['story', 'advance'].includes(act)) { novelViewStep = null; Sound.playParchment(); }
        if (act === 'activity' && val && val !== 'rest') lastMaintainedActivity = val;
        if (act === 'activity' && val === 'meditate') Sound.playBowl();
        if (act === 'rest') Sound.playBowl(260, 2.2);
        if (act === 'breakthrough') Sound.playBreakthrough();
        if (act === 'meridian-purge') {
          Sound.playBreakthrough?.();
          toast(uiText('Меридианы очищены Небесной Жемчужиной!', 'Meridians purged by the Sky Poison Pearl!'));
        }
        if (s.realm > realmBefore) {
          const modal = $('breakthrough-modal');
          if (modal && view !== 'data') {
            if ($('breakthrough-realm')) $('breakthrough-realm').textContent = `✧ ${E.realmName(s.realm)} · ${uiText('Сила','Power')} ${fmt(E.power(s))} ⚔`;
            modal.hidden = false;
          }
          Sound.playBreakthrough();
        }
        save();
      } else {
        toast(act === 'travel' ? E.world.travelReason(s, val, L?.language || 'ru') || uiText('Условия пока не выполнены', 'Requirements are not met yet') : uiText('Условия пока не выполнены', 'Requirements are not met yet'));
      }
      if (s.stage === 0 && !['hero', 'combat', 'world', 'roadmap'].includes(tab)) tab = 'hero';
      render();
      return;
    }
    if(['travel','map-inspect'].includes(b.dataset.action)&&b.closest?.('#world-map-dialog')){tab='world';renderMap();}
    if(b.dataset.action==='travel'&&b.closest?.('#location-dialog')){$('location-dialog')?.close?.();currentDialogPlace=null;}
    if(b.dataset.action==='click'){
      Sound.playClick();
      const clickKey=b.dataset.value,clickDef=E.clicks[clickKey];
      if(clickDef&&E.canClick(s,clickKey)){
        const rect=b.getBoundingClientRect?b.getBoundingClientRect():{left:240,top:320,width:80};
        const cx=rect.left+rect.width/2,cy=rect.top;
        spawnFloating(`−${clickDef.stamina} ${uiText('Выносл.','Stam.')}`,'floating-stamina',cx,cy);
        if(['squat','labor','sweep','haul'].includes(clickKey)){
          setTimeout(()=>spawnFloating(`+0.05 ${uiText('Тело','Body')}`,'floating-body',cx,cy-18),120);
        }else if(['posture','breathe'].includes(clickKey)){
          setTimeout(()=>spawnFloating(`+0.5 ${uiText('Спокойствие','Calm')}`,'floating-xp',cx,cy-18),120);
        }else if(clickKey==='search'){
          setTimeout(()=>spawnFloating(`+1 ${uiText('Осмотр','Search')}`,'floating-gold',cx,cy-18),120);
        }
        if (autoResumeRoutine && lastMaintainedActivity && lastMaintainedActivity !== 'rest') {
          if (autoResumeTimer) clearTimeout(autoResumeTimer);
          autoResumeTimer = setTimeout(() => {
            if (s.activity === 'rest' && lastMaintainedActivity && lastMaintainedActivity !== 'rest') {
              s.activity = lastMaintainedActivity;
              save();
              render();
            }
          }, 1800);
        }
      }else if(clickDef&&s.stamina<clickDef.stamina){
        b.classList?.add?.('shake-warning');
        setTimeout(()=>b.classList?.remove?.('shake-warning'),400);
        const rect=b.getBoundingClientRect?b.getBoundingClientRect():{left:240,top:320,width:80};
        spawnFloating(uiText('Мало выносливости!','Low stamina!'),'floating-stamina',rect.left+rect.width/2,rect.top);
      }
    }
    const realmBefore=s.realm;
    const winsBefore=s.wins;
    const wasEvilGodBefore=s.combat?.evilGodAwakened;
    if (b.dataset.action) {
      if (b.dataset.action === 'rebirth') { if (!confirm(t(view === 'data' ? 'Начать новый цикл? Показатели и объекты сбросятся. Накопленный коэффициент сохранится.' : 'Начать новую жизнь? Все ресурсы и владения сбросятся; души сохранятся.'))) return; saves?.backup('Перед новым циклом'); }
      if (E.action(s,b.dataset.action,b.dataset.value)) {
        if (['story', 'advance'].includes(b.dataset.action)) { novelViewStep = null; Sound.playParchment(); }
        if (b.dataset.action === 'travel') Sound.playCaravanBell?.();
        if (b.dataset.action === 'atlas-survey' || b.id === 'map-survey') Sound.playWindWhisper?.();
        if (b.dataset.action === 'activity' && b.dataset.value && b.dataset.value !== 'rest') lastMaintainedActivity = b.dataset.value;
        if (b.dataset.action === 'activity' && b.dataset.value === 'meditate') Sound.playBowl();
        if (b.dataset.action === 'rest') Sound.playBowl(260, 2.2);
        if (b.dataset.action === 'breakthrough') Sound.playBreakthrough();
        if (b.dataset.action === 'fight') {
          if (s.wins > winsBefore) Sound.playVictory();
          else Sound.playClash();
        }
        if (b.dataset.action === 'combat-act') {
          const actVal = b.dataset.value;
          if (s.combat?.victory || s.wins > winsBefore) {
            Sound.playVictory();
          } else if (s.combat?.enemyStunned) {
            Sound.playGuardBreak?.();
          } else if (s.combat?.evilGodAwakened && !wasEvilGodBefore) {
            Sound.playEvilGodFlame?.();
          } else if (['thrust', 'heavy'].includes(actVal) && (s.combat?.log?.[0]?.ru?.includes('БОЕВОЙ КУРАЖ') || s.combat?.log?.[1]?.ru?.includes('БОЕВОЙ КУРАЖ'))) {
            Sound.playCrit?.();
          } else if (actVal === 'parry' || actVal === 'technique') {
            Sound.playClash();
          } else if (actVal === 'pearl') {
            Sound.playEvilGodFlame?.();
          } else if (actVal === 'pill') {
            Sound.playBowl(360, 0.8);
          } else {
            Sound.playPunch();
          }
        } else if (b.dataset.action?.startsWith('combat-')) {
          if (s.combat?.victory || s.wins > winsBefore) Sound.playVictory();
          else Sound.playClash();
        }
        if(s.realm>realmBefore){
          const modal=$('breakthrough-modal');
          if(modal&&view!=='data'){
            if($('breakthrough-realm'))$('breakthrough-realm').textContent=`✧ ${E.realmName(s.realm)} · ${uiText('Сила','Power')} ${fmt(E.power(s))} ⚔`;
            modal.hidden=false;
          }
          Sound.playBreakthrough();
        }
        save();
        if(b.dataset.action==='atlas-survey')toast(uiText('Окрестности осмотрены. Сведения и припасы обновлены.','Surroundings surveyed. Information and supplies updated.'));
        if(b.dataset.action==='map-inspect'){toast(s.events[0]?.text||'Условия пока не выполнены');if(s.world.encounter)$('world-map-dialog').close?.();}
      } else toast(b.dataset.action==='travel'?E.world.travelReason(s,b.dataset.value,L?.language||'ru')||'Условия пока не выполнены':'Условия пока не выполнены');
    }
    if(b.dataset.action==='choice'&&E.world.knownLocations(s).length>placesBefore&&s.events[0]?.text.startsWith('Открыта дорога:'))toast(s.events[0].text);
    if (b.id === 'save') save(true);
    if (b.id === 'aside-map') { Sound.playClick(); openMapDialog(); return; }
    if (b.id === 'aside-fate') { Sound.playClick(); openFateTreeDialog(); return; }
    if (b.id === 'aside-alchemy' || b.id === 'combat-alchemy-btn') { Sound.playClick(); openAlchemyDialog(); return; }
    if (b.id === 'export') { const value = typeof IsekaiSaveCode !== 'undefined' ? IsekaiSaveCode.envelope(s) : s; const url = URL.createObjectURL(new Blob([JSON.stringify(value)],{type:'application/json'})); const a = document.createElement('a'); a.href = url; a.download = `${view === 'data' ? 'data-snapshot' : 'isekai-idle'}-${new Date().toISOString().slice(0,10)}.json`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000); }
    if (s.stage === 0 && !['hero','combat','world','roadmap'].includes(tab)) tab = 'hero'; render();
  });
  $('audio-volume')?.addEventListener('input', e => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) Sound.setVolume(val / 100);
  });
  $('close-breakthrough')?.addEventListener?.('click',()=>{$('breakthrough-modal')&&($('breakthrough-modal').hidden=true);});
  $('breakthrough-modal')?.addEventListener?.('click',e=>{if(e.target?.classList?.contains?.('breakthrough-backdrop')||e.target?.id==='close-breakthrough'){$('breakthrough-modal')&&($('breakthrough-modal').hidden=true);}});
  $('close-location-dialog')?.addEventListener('click',()=>{$('location-dialog')?.close?.();currentDialogPlace=null;});
  $('location-dialog')?.addEventListener('click',e=>{if(e.target===$('location-dialog')){$('location-dialog')?.close?.();currentDialogPlace=null;}});
  $('open-fate-tree')?.addEventListener('click',openFateTreeDialog);
  $('close-fate-tree')?.addEventListener('click',()=>{$('fate-tree-dialog')?.close?.();});
  $('fate-tree-dialog')?.addEventListener('click',e=>{if(e.target===$('fate-tree-dialog'))$('fate-tree-dialog')?.close?.();});
  $('open-alchemy')?.addEventListener('click',openAlchemyDialog);
  $('close-alchemy')?.addEventListener('click',()=>{$('alchemy-dialog')?.close?.();});
  $('alchemy-dialog')?.addEventListener('click',e=>{if(e.target===$('alchemy-dialog'))$('alchemy-dialog')?.close?.();});
  $('open-map')?.addEventListener('click',openMapDialog);
  $('close-map')?.addEventListener('click',()=>{$('world-map-dialog')?.close?.();});
  $('world-map-dialog')?.addEventListener('click',e=>{if(e.target===$('world-map-dialog'))$('world-map-dialog')?.close?.();});
  $('map-zoom-in').addEventListener('click',()=>zoomMap(mapZoom+.15));
  $('map-zoom-out').addEventListener('click',()=>zoomMap(mapZoom-.15));
  $('map-center').addEventListener('click',centerMap);
  $('map-filter').addEventListener('click',()=>{mapPendingOnly=!mapPendingOnly;renderMap();});
  $('map-note-place').addEventListener('change',()=>{noteSelection=$('map-note-place').value;$('map-note-text').value=s.atlas.notes[noteSelection]||'';centerMap(noteSelection);});
  $('map-note-form').addEventListener('submit',e=>{e.preventDefault();if(E.action(s,'atlas-note',{id:noteSelection,text:$('map-note-text').value})){save();toast(uiText('Заметка сохранена.','Note saved.'));renderMap();}});
  $('map-fit').addEventListener('click',()=>{const m=E.world.map(s),v=$('map-viewport');zoomMap(Math.min((v.clientWidth||800)/m.width,(v.clientHeight||500)/m.height));v.scrollLeft=0;v.scrollTop=0;});
  $('map-viewport').addEventListener('wheel',e=>{e.preventDefault();const r=$('map-viewport').getBoundingClientRect();zoomMap(mapZoom*(e.deltaY<0?1.12:1/1.12),[e.clientX-r.left,e.clientY-r.top]);},{passive:false});
  let mapDrag = null, mapWasDragging = false;
  const mapViewport = $('map-viewport');
  if (mapViewport) {
    mapViewport.addEventListener?.('dragstart', e => e?.preventDefault?.());
    mapViewport.addEventListener?.('pointerdown', e => {
      if ((e.button !== 0 && e.button !== 1) || e.target?.closest?.('button, input, select, textarea, summary, a, label')) return;
      e.preventDefault?.();
      mapDrag = {
        pointerId: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        left: mapViewport.scrollLeft || 0,
        top: mapViewport.scrollTop || 0,
        moved: false
      };
      try { mapViewport.setPointerCapture?.(e.pointerId); } catch {}
    });
    const onMapPointerMove = e => {
      if (!mapDrag) return;
      if (mapDrag.pointerId !== undefined && e.pointerId !== undefined && e.pointerId !== mapDrag.pointerId) return;
      const dx = e.clientX - mapDrag.x, dy = e.clientY - mapDrag.y;
      if (!mapDrag.moved && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
        mapDrag.moved = true;
        mapViewport.classList?.add?.('is-dragging');
      }
      if (mapDrag.moved) {
        mapViewport.scrollLeft = mapDrag.left - dx;
        mapViewport.scrollTop = mapDrag.top - dy;
      }
    };
    const onMapPointerEnd = e => {
      if (!mapDrag) return;
      if (mapDrag.pointerId !== undefined && e && e.pointerId !== undefined && e.pointerId !== mapDrag.pointerId) return;
      if (mapDrag.pointerId !== undefined) {
        try { mapViewport.releasePointerCapture?.(mapDrag.pointerId); } catch {}
      }
      if (mapDrag.moved) {
        mapWasDragging = true;
        setTimeout(() => { mapWasDragging = false; }, 80);
      }
      mapViewport.classList?.remove?.('is-dragging');
      mapDrag = null;
    };
    mapViewport.addEventListener?.('pointermove', onMapPointerMove);
    for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      mapViewport.addEventListener?.(ev, onMapPointerEnd);
    }
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('pointermove', onMapPointerMove);
      window.addEventListener('pointerup', onMapPointerEnd);
      window.addEventListener('pointercancel', onMapPointerEnd);
    }
    mapViewport.addEventListener?.('click', e => {
      if (mapWasDragging) {
        e.stopPropagation?.();
        e.preventDefault?.();
      }
    }, true);
  }
  $('close-map').addEventListener('click',()=>$('world-map-dialog').close?.());
  $('import').addEventListener('change', async e => { const file = e.target.files[0]; if (!file) return; try { if (file.size > 1000000) throw Error(); const text=await file.text();const loaded = typeof IsekaiSaveCode !== 'undefined' ? await IsekaiSaveCode.decode(text,E) : E.validate(JSON.parse(text)); if(saves) saves.replace(loaded,'Импорт файла'); else if (confirm(t('Заменить текущий прогресс?'))) { s = loaded; tick(); tab = 'hero'; save(); render(); } } catch { toast('Не удалось прочитать сохранение v2'); } e.target.value = ''; });
  $('identity-form').addEventListener('submit',e=>{
    e.preventDefault();
    if(!E.action(s,'name',$('player-name-input').value)){$('identity-error').textContent=t('Введи имя от 2 до 40 символов без необычных знаков.');return;}
    $('identity-error').textContent='';save();render();
  });
  document.addEventListener('change', e => {
    if (e.target && e.target.id === 'auto-resume-cb') {
      autoResumeRoutine = e.target.checked;
      setUiPref('isekai-auto-resume', String(autoResumeRoutine));
    }
  });
  document.addEventListener('keydown', e => {
    if (!e || !e.key) return;
    const tag = document.activeElement?.tagName;
    if (['INPUT','TEXTAREA','SELECT'].includes(tag) || document.activeElement?.isContentEditable) return;
    if (e.key === 'Escape') {
      if ($('breakthrough-modal') && !$('breakthrough-modal').hidden) { $('breakthrough-modal').hidden = true; return; }
      if ($('location-dialog')?.open) { $('location-dialog')?.close?.(); currentDialogPlace = null; return; }
      if ($('world-map-dialog')?.open) { $('world-map-dialog')?.close?.(); return; }
      if ($('fate-tree-dialog')?.open) { $('fate-tree-dialog')?.close?.(); return; }
      if ($('alchemy-dialog')?.open) { $('alchemy-dialog')?.close?.(); return; }
      if ($('save-dialog')?.open) { $('save-dialog')?.close?.(); return; }
    }
    if (e.key === ' ' || e.code === 'Space') {
      const clickBtn = document.querySelector ? document.querySelector('#content button[data-action="click"]:not([disabled])') : null;
      if (clickBtn) { e.preventDefault?.(); clickBtn.click?.(); }
      return;
    }
    if (e.key === '1') { tab = 'hero'; render(); return; }
    if (e.key === '2') { tab = 'combat'; render(); return; }
    if (e.key === '3') { tab = 'world'; render(); return; }
    if (e.key === '4' && s.stage >= 2) { tab = 'sect'; render(); return; }
    if ((e.key === 'm' || e.key === 'M' || e.key === 'ь' || e.key === 'Ь') && !e.ctrlKey && !e.altKey && !e.metaKey) {
      if ($('world-map-dialog')?.open) { $('world-map-dialog').close?.(); }
      else { renderMap(); $('world-map-dialog')?.showModal?.(); centerMap(); }
      return;
    }
    if ((e.key === 's' || e.key === 'S' || e.key === 'ы' || e.key === 'Ы') && !e.ctrlKey && !e.altKey && !e.metaKey) {
      save(true);
      return;
    }
  });
  if (!s.events.length) E.log(s,E.stages[0].intro);
  tick();
  refreshNames();
  applyView(); render(); save(); if (storageWarning) toast(view === 'data' ? 'Предыдущая запись недоступна для текущей версии.' : 'Новая система использует сохранения v2. Старое сохранение v1 остаётся в браузере.');
  if(L)L.setLanguage(L.language);
  if(typeof IsekaiSaves !== 'undefined') saves=IsekaiSaves.init({get:()=>{tick();return E.validate(JSON.parse(JSON.stringify(s)));},set:state=>{returnSummary=null;awaySnapshot=null;s=E.validate(state);tick();tab='hero';save();render();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){tick();awaySnapshot=E.returnReport.snapshot(s);awayAt=Date.now();save();}else if(awaySnapshot){tick();const elapsed=Math.max(0,(Date.now()-awayAt)/1000);if(elapsed>=60)returnSummary={before:awaySnapshot,after:E.returnReport.snapshot(s),elapsed};awaySnapshot=null;render();save();}});
  setInterval(()=>{tick();render();},1000); setInterval(()=>save(),10000); window.addEventListener('pagehide',()=>{tick();save();});
})();
