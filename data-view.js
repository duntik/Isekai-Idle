(function(root) {
  'use strict';
  const labels = {gold:'Монеты',herbs:'Травы',qi:'Духовная энергия',relics:'Осколки',reputation:'Репутация',wood:'Древесина',ore:'Руда',pills:'Пилюли',influence:'Влияние',supplies:'Припасы',cosmic:'Звёздная эссенция',worlds:'Миры'};
  const tabs = {hero:'Путь героя',combat:'Испытания',world:'Путешествия',sect:'Секта',city:'Город',planet:'Планета',galaxy:'Галактика',legacy:'Наследие',roadmap:'Горизонты'};
  const activityLabels = {rest:'Отдыхать',work:'Работать над заказом',explore:'Исследовать местность',train:'Тренировать тело',meditate:'Медитировать',technique:'Осваивать технику',mission:'Поручения секты',govern:'Управлять владениями',laws:'Постигать законы'};
  const projectLabels = {dorm:'Обитель учеников',garden:'Духовный сад',market:'Торговый район',granary:'Склад снабжения',node:'Мировой узел',fleet:'Звёздный корабль',observatory:'Обсерватория законов'};
  const jobs = {herb:'Садовники',lumber:'Лесорубы',miner:'Рудокопы',alchemist:'Алхимики',disciple:'Ученики'};
  function render(s,tab,E) {
    const uiText=(ru,en)=>root.IsekaiLocale?.language==='en'?en:ru;
    const f = n=>n.toLocaleString(root.IsekaiLocale?.locale||'ru-RU',{maximumFractionDigits:2});
    const cost = c=>Object.entries(c).map(([k,v])=>`${labels[k]}: ${f(v)}`).join('; ');
    const btn = (action,value,label,enabled=true)=>`<button data-action="${action}" data-value="${value}" ${enabled&&(action!=='advance'||E.canAdvance(s))&&(action!=='activity'||E.canActivity(s,value))&&(action!=='fight'||E.canFight(s))?'':'disabled'}>${label}</button>`;
    const rows=[],entries=[];
    const row=(name,value,note='',operation='—')=>{
      const hints=[...operation.matchAll(/data-action="([^"]+)" data-value="([^"]*)"/g)].map(m=>E.guidance(s,m[1],m[2],root.IsekaiLocale?.language||'ru')).filter(Boolean);
      rows.push(`<tr><th scope="row">${name}</th><td>${value}</td><td>${note}${[...new Set(hints)].map(hint=>`<div class="action-hint">${hint}</div>`).join('')}</td><td>${operation}</td></tr>`);
      entries.push({name,operation,html:rows[rows.length-1]});
    };
    const build=levels=>Object.entries(E.projects).filter(([,p])=>levels.includes(p.stage)&&p.stage<=s.stage).forEach(([k])=>row(projectLabels[k],s.buildings[k],cost(E.buildCost(s,k)),btn('build',k,'Добавить',E.affordable(s,E.buildCost(s,k)))));
    if(tab==='hero') {
      const milestones=E.achievements.list(s,root.IsekaiLocale?.language||'ru');
      for(const a of [...milestones.filter(a=>a.earned),...E.achievements.upcoming(s,root.IsekaiLocale?.language||'ru')])row(a.name,a.earned?'✓':'◇',a.description);
      for(const a of milestones.filter(a=>a.special&&!a.earned))row(a.name,'◇',a.description);
      for(const a of E.achievementActions(s))row(a.name[root.IsekaiLocale?.language==='en'?1:0],s.achievements.cooldowns[a.id]>0?`${Math.ceil(s.achievements.cooldowns[a.id])} s`:'—',a.description[root.IsekaiLocale?.language==='en'?1:0],btn('achievement-action',a.id,uiText('Выполнить','Perform'),a.enabled));
      const isStoryActive = (s.stage === 0 && E.storyBeat(s)) || (s.stage === 1 && E.chapterTwoBeat && E.chapterTwoBeat(s, s.chapterTwoStep));
      const hint = E.guidance(s, isStoryActive ? 'story' : 'advance', '', root.IsekaiLocale?.language || 'ru');
      if(hint) row(root.IsekaiLocale?.language === 'en' ? 'Next step' : 'Следующий шаг', '→', hint);
      if(s.stage === 0) {
        const beat = E.storyBeat(s);
        if(beat) row(beat.title, `${s.storyStep + 1}/${E.story.length}`, `${beat.goal}${Object.keys(beat.reward || {}).length ? `; ${cost(beat.reward)}` : ''}`, s.storyStep === 0 ? Object.entries(beat.prologueChoices).map(([k,c]) => btn('story', k, uiText(c.name, c.enName), beat.ready(s))).join(' ') : s.storyStep === 6 ? Object.entries(E.firstRoutes).map(([k,label]) => btn('story', k, label, beat.ready(s) && E.firstRouteReady(s, k))).join('') : s.storyStep === 7 && !s.world.admission ? Object.entries(beat.sectChoices).map(([k,c]) => btn('story', k, uiText(c.name, c.enName), beat.ready(s) && c.ready(s))).join(' ') : btn('story', '', beat.button, beat.ready(s) && (s.storyStep !== 7 || !s.world.admission)));
        else row('Сюжет', 'Завершён', 'Доступна следующая глава');
        if(s.storyStep > 0) for(const p of E.world.developmentPaths?.(s, root.IsekaiLocale?.language || 'ru') || []) row(p.name, `${p.progress}/${p.total}`, `${p.description} ${p.next}`, `<button data-tab="world">${uiText('Искать встречи', 'Look for encounters')}</button>`);
      }
      if(s.stage === 1) {
        const beat = E.chapterTwoBeat ? E.chapterTwoBeat(s, s.chapterTwoStep, root.IsekaiLocale?.language || 'ru') : null;
        if(beat) row(beat.title, `${(s.chapterTwoStep || 0) + 1}/9`, `${beat.goal}${Object.keys(beat.reward || {}).length ? `; ${cost(beat.reward)}` : ''}`, btn('story', '', beat.button, beat.ready(s)));
        else row(uiText('Глава 2: Врата секты', 'Chapter 2: Sect Gates'), uiText('Завершена', 'Completed'), uiText('Доступна следующая глава', 'Next chapter available'));
      }
      const journey=s.world.journey;
      row('Текущее место',E.world.locations[s.world.location].name,journey?`${uiText('В пути:','Travelling to:')} ${E.world.locations[journey.destination].name} · ${Math.ceil(journey.remaining)} ${uiText('сек','sec')}`:activityLabels[s.activity]);
      const pendingScene=E.world.current(s);
      if(pendingScene)row(uiText('Ожидает решения','Awaiting your decision'),E.world.sceneText(pendingScene,'title',root.IsekaiLocale?.language),uiText('Встреча ждёт твоего выбора; открой путешествия, чтобы продолжить.','An encounter awaits your choice; open Travel to continue.'),`<button data-tab="world">${uiText('Продолжить встречу','Continue encounter')}</button>`);
      row('Занятие',activityLabels[s.activity],(E.activityRunning(s)?'Активно':'Приостановлено: смени место или занятие.')+' '+uiText('Ручные действия, бой и путешествие прерывают занятие. Выбери его снова, когда закончишь.','Manual actions, combat and travel interrupt your activity. Select it again when finished.'));
      row(uiText('Тренировочный распорядок','Training routine'),E.routineReady(s)?uiText('Доступен','Available'):'—',E.automationHint(s,root.IsekaiLocale?.language||'ru'));
      if(s.employment.order&&E.workMastered(s,s.employment.order.kind))row(uiText('Освоенная работа','Familiar work'),'—',E.guidance(s,'claim-order','',root.IsekaiLocale?.language||'ru'),btn('activity','work',uiText('Работать над заказом','Work on contract'),s.activity!=='work'&&E.canActivity(s,'work')));
      row('Глава',`${s.stage+1} / 8`,E.stages[s.stage].name);
      row('Уровень',s.realm,`${f(s.xp)} / ${f(E.needed(s))}; ${cost(E.breakthroughCost(s))}`,btn('breakthrough','','Повысить',s.found&&s.xp>=E.needed(s)&&E.affordable(s,E.breakthroughCost(s))));
      row('Тело',`${f(s.body)} / ${(s.realm+1)*10}`,uiText('Растёт от физических действий, работы и двигательных техник. Медитация тело не развивает.','Grows through physical actions, work and movement techniques. Meditation does not train the body.'));
      row('Освоение техники',`${f(s.mastery)} / ${(s.realm+1)*10}`,`Скорость развития: ${f(E.speed(s))}`);
      row('Древнее наследие',s.found?'Найдено':`${Math.min(100,Math.floor(s.explored/6))}%`,'600 сек исследования до находки');
      {
        row('Выносливость',`${f(s.stamina)}/${E.staminaMax(s)}`,root.IsekaiLocale?.language==='en'?`Recovery +${f(E.staminaRecovery(s))}/sec; interval 0.6 sec`:`Восстановление +${f(E.staminaRecovery(s))}/сек; интервал 0,6 сек`);
        row('Спокойствие',`${f(s.calm)}/100`,'Растёт от медитации');
        for(const [k,c] of Object.entries(E.clicks).filter(([k])=>E.clickVisible(s,k)&&(!['sweep','haul'].includes(k)||E.canWorkOrder(s))))row(c.name,s.clicks[k],`${c.desc}; выносливость −${c.stamina}; ${E.taskPracticeText(k,root.IsekaiLocale?.language||'ru')}`,btn('click',k,'Выполнить',E.canClick(s,k)));
      }
      for(const [k,a] of Object.entries(E.activities).filter(([k])=>E.activityVisible(s,k))) row(activityLabels[k],s.activity===k?(E.activityRunning(s)?'Активно':'Приостановлено'):'Ожидание',a.desc+' '+E.taskPracticeText(k,root.IsekaiLocale?.language||'ru')+' '+Object.entries(a.rates||{}).map(([r,v])=>`${labels[r]} +${f(v*60*E.speed(s))}/мин`).join('; ')||'Развитие героя',btn('activity',k,'Назначить',s.activity!==k));
      if(s.stage>=1) {
        for(const [k,label] of Object.entries({balanced:'Равновесие',swift:'Быстрый шаг',piercing:'Пробивающий удар',ward:'Духовный заслон'})) row(label,s.style===k?'Выбран':'—','Боевой стиль',btn('style',k,'Применить'));
        const c={gold:Math.ceil(40*1.8**s.weapon),...(s.stage>=3?{ore:Math.ceil(10*1.4**s.weapon)}:{})};
        row('Оружие',s.weapon,cost(c),btn('weapon','','Обновить',s.weapon<(s.realm+1)*2&&E.affordable(s,c)));
      }
      row('Выполненные заказы',s.employment.completed,'Расценки +10% за каждые 5; до +100%; город +25%');
      row(uiText('Необязательные обеты','Optional vows'),'—',E.achievements.challengeHint(s,root.IsekaiLocale?.language||'ru'));
      for(const a of E.achievements.challenges(s,root.IsekaiLocale?.language||'ru')){const statuses={available:uiText('Не выбран','Not selected'),active:uiText('Соблюдается','Active'),failed:uiText('Нарушен','Failed'),complete:uiText('Завершён','Complete')};row(a.name,statuses[a.status],a.description,btn('choose-vow',a.id,uiText('Принять обет','Take the vow'),a.enabled));}
      row('Приём заявок',Object.keys(E.orders).some(k=>E.orderAvailable(s,k))?'Доступен':'Недоступен','У знакомого заказчика; работа и оплата только в месте принятого заказа');
      const order=s.employment.order;
      if(!order&&!Object.keys(E.orders).some(k=>E.orderAvailable(s,k)))row('Поручения','—','Сначала познакомься с заказчиком. Поручения появляются после встреч; принятый заказ нужно выполнять и сдавать в указанном месте.');
      if(order){const place=order.place||'village',away=s.world.location!==place;row('Активный заказ',`${E.orderName(s,order.kind,place)}: ${f(order.progress)}/${E.orders[order.kind].target}`,`${E.world.locations[place]?.name||place}; Монеты +${order.pay}. ${uiText('Выполняется и сдаётся здесь.','Work and payment take place here.')}`,btn('claim-order','','Получить',E.canClaimOrder(s))+(away&&!s.world.journey?btn('travel',place,uiText('Вернуться к заказу','Return to contract'),E.world.canTravel(s,place)):''));row('Отмена','Без оплаты','Текущий прогресс заказа сбросится',btn('cancel-order','','Отменить'));}
      for(const[k,o]of Object.entries(E.orders).filter(([k])=>!order&&E.orderAvailable(s,k)))row(E.orderName(s,k),`Монеты +${E.orderPay(s,k)}`,`${o.target} ${k==='ledger'?'сек фоновой работы':'операций'}; тело от ${o.body}`,btn('order',k,'Принять',E.canOrder(s,k)));
      for(const[k,t]of Object.entries(E.techniques)){const learned=s.cultivation.learned[k],known=t.available(s)||!!learned;if(known)row(t.name,`${learned?.rank||0}/5`,`${E.techniqueSource(s,k)}. ${t.desc}${t.practiceBody?uiText(" Практика этой двигательной техники также укрепляет тело и расходует выносливость."," Practicing this movement technique also strengthens the body and uses stamina."):""} ${cost(E.techniqueCost(s,k))}; ${learned&&learned.rank<5?`${f(learned.progress)}/${E.techniqueNeeded(learned.rank)} сек`:'Первичное освоение'}`,btn('learn-technique',k,learned?'Повысить ранг':'Изучить',E.canLearn(s,k))+(learned?btn('equip-technique',k,s.cultivation.active===k?'Активна':'Применить',s.cultivation.active!==k):''));}
      if(s.stage<7) {const gate=E.stages[s.stage];row('Ближайшая цель',E.stages[s.stage+1].name,`Уровень ${s.realm}/${gate.realm}; ${s.stage===0?'Личный прорыв и помощь обозу: победа, 3 признания или рекомендация Вэя.':`победы ${s.wins}/${gate.wins} или признание ${E.world.recognition(s)} / ${E.world.recognitionNeeded(s)}`}; ${cost(gate.cost)}${s.stage===0?`; сюжет ${s.storyStep}/${E.story.length}`:''}`,btn('advance','','Перейти',E.canAdvance(s)));}
    }
    if(['hero','world'].includes(tab))for(const a of E.techniqueActions?.(s,root.IsekaiLocale?.language||'ru')||[])row(a.name,a.hint,`${E.techniques[a.technique].name}. ${a.description}`,btn('technique-action',a.id,uiText('Выполнить приём','Use method'),a.enabled)+(s.cultivation.active!==a.technique?btn('equip-technique',a.technique,uiText('Выбрать эту технику','Equip this technique')):''));
    if(tab==='combat') {
      const Combat = typeof module !== 'undefined' && module.exports ? require('./combat.js') : (root.IsekaiCombat || E.combat);
      const isShrouded = s.stage === 0 && (s.storyStep || 0) < 6;
      if(s.stage===0) {
        if(isShrouded) row(uiText('Боевое предчувствие','Martial intuition'),uiText('Завеса тумана','Shroud of mist'),uiText('Опасности сокрыты до пробуждения ци.','Perils remain veiled until qi awakens.'));
        else row(uiText('Тревога на мосту','Bridge alarm'),uiText('Белый Клык','White Fang'),uiText('Повозка заблокирована у моста бандитами.','Cart blocked at the bridge by bandits.'));
      }
      if(s.combat) {
        const c=s.combat;
        if(c.finished) {
          row(uiText('Результат поединка','Duel result'),c.victory?uiText('Победа','Victory'):uiText('Отступление','Retreat'),c.victory?uiText('Соперник повержен. Трофеи начислены.','Opponent defeated. Rewards claimed.'):uiText('Силы иссякли. Защитный покров Жемчужины позволил отступить.','Endurance depleted. Sky Poison Pearl enabled safe retreat.'),btn('combat-retreat','',uiText('Завершить поединок','Conclude duel')));
        } else {
          row(uiText('Раунд поединка','Duel round'),c.round,`${c.foeName} (${c.foeType}); ${uiText('Намерение:','Intent:')} ${(Combat?.intents?.[c.enemyIntent]?.[root.IsekaiLocale?.language==='en'?'en':'ru'])||c.enemyIntent}`);
          row(uiText('Здоровье героя','Hero health'),`${c.playerHp}/${c.playerMaxHp}`,`${uiText('Стойка:','Poise:')} ${c.playerPoise}/${c.playerMaxPoise}; ${uiText('Выносливость:','Stamina:')} ${c.playerStamina}/${c.playerMaxStamina}`);
          row(uiText('Здоровье врага','Foe health'),`${c.enemyHp}/${c.enemyMaxHp}`,`${uiText('Стойка:','Poise:')} ${c.enemyPoise}/${c.enemyMaxPoise}${c.enemyStunned?(' · '+uiText('Стойка пробита!','Guard broken!')):''}`);
          row(uiText('Боевой импульс','Combat Momentum'),`${c.momentum||0}/3`,c.evilGodAwakened?uiText('Врата Злого Бога пробуждены (+35% урона)','Evil God Gate awakened (+35% damage)'):uiText('Накапливай контрударами','Build with counter strikes'));
          row(uiText('Действия поединка','Duel actions'),'—',uiText('Выбери приём против замысла врага','Choose technique against enemy intent'),
            btn('combat-act','thrust',uiText('Быстрый выпад','Swift thrust'))+' '+
            btn('combat-act','heavy',uiText('Тяжёлый удар','Heavy strike'))+' '+
            btn('combat-act','parry',uiText('Парирование','Parry'))+' '+
            btn('combat-act','technique',uiText('Боевая техника','Martial technique'))+' '+
            btn('combat-act','pearl',uiText('Жемчужина','Pearl'),!c.pearlUsed)+' '+
            btn('combat-act','pill',uiText('Пилюля','Pill'),s.resources.pills>=1)+' '+
            btn('combat-retreat','',uiText('Отступить','Retreat'))+' '+
            btn('fight','',uiText('Авто-бой','Auto-fight'),!s.cooldown&&E.battlePower(s)>=E.enemy(s).power)
          );
        }
      } else {
        if(isShrouded) {
          row(uiText('Соперник','Rival'),uiText('Неведомая опасность','Unknown Peril'),`Порог: ???; результат: ${f(E.battlePower(s))}`,btn('combat-start','',uiText('Вступить в поединок','Enter tactical duel'),false)+' '+btn('fight','',uiText('Быстрый бой','Quick fight'),false));
          row(uiText('Подходящий стиль','Recommended style'),uiText('Неизвестно','Unknown'),uiText('Раскроется при столкновении','Revealed upon encounter'));
          row(uiText('Интервал','Interval'),`${Math.ceil(s.cooldown)} сек`,uiText('Пять минут после победы','Five minutes after a victory'));
          row(uiText('Результат','Reward'),s.wins,uiText('Раскроется в схватке','Revealed in battle'));
        } else {
          let foeName = E.enemy(s).name;
          if (s.stage === 0 && s.storyStep === 6 && foeName === 'Дорожный разбойник') foeName = uiText('Головорез Белого Клыка', 'White Fang Thug');
          row(uiText('Соперник','Rival'),foeName,`Порог: ${f(E.enemy(s).power)}; результат: ${f(E.battlePower(s))}`,btn('combat-start','',uiText('Вступить в поединок','Enter tactical duel'),!s.cooldown&&E.battlePower(s)>=E.enemy(s).power)+' '+btn('fight','',uiText('Быстрый бой','Quick fight'),!s.cooldown&&E.battlePower(s)>=E.enemy(s).power));
          row(uiText('Подходящий стиль','Recommended style'),{swift:uiText('Быстрый шаг','Swift Step'),armored:uiText('Пробивающий удар','Piercing Strike'),mystic:uiText('Духовный заслон','Spirit Ward')}[E.enemy(s).type],uiText('Соответствие даёт +35%','Matching style grants +35%'));
          row(uiText('Интервал','Interval'),`${Math.ceil(s.cooldown)} сек`,uiText('Пять минут после победы','Five minutes after a victory'));
          row(uiText('Результат','Reward'),s.wins,`Монеты +${f(30*1.8**s.wins)}; травы +${(s.wins+1)*10}; осколки +1`);
        }
      }
    }
    if(tab==='world') {
      const memoryScene=E.world.current(s),context=memoryScene&&E.world.memory?.context(s,memoryScene,root.IsekaiLocale?.language||'ru');
      if(context)row(uiText('Вы уже знакомы','You have met before'),'—',context);
      for(const q of E.world.causalLeads(s,root.IsekaiLocale?.language||'ru'))row(uiText('Нить истории','Story thread'),q.title,`${E.world.locations[q.location].name}. ${uiText('Возможное продолжение после прошлых поступков; ищи встречи на месте.','A possible continuation of your past deeds; seek encounters here.')}`);
      for(const p of E.world.memory?.people(s,root.IsekaiLocale?.language||'ru')||[])row(p.name,p.status,`${p.role}; ${E.world.locations[p.location]?.name||p.location}; ${(p.memories||[]).join(' ')}`);
      const W=E.world,w=s.world,scene=W.current(s);
      row(uiText('Осмотр окрестностей','Survey surroundings'),s.atlas.surveys[w.location]||0,E.atlas.hint(s,root.IsekaiLocale?.language||'ru'),btn('atlas-survey','',uiText('Осмотреть','Survey'),E.atlas.canSurvey(s)));
      if(w.location==='forest'){
        row(uiText('Лесная тропа','Forest trail'),'15',uiText('Птицы ещё поют; у ручья свежие следы. Можно отступить после осмотра. Отдых 5 минут.','Birds still sing; fresh tracks by the stream. You can retreat after inspecting. Recovery 5 minutes.'),btn('forest-search','trail',uiText('Осторожно пройти','Walk cautiously'),E.atlas.canSurvey(s)));
        row(uiText('Лесная чаща','Forest thicket'),'15',uiText('Сломанные ветви, затихшие птицы. Редкие корни и их обитатели. Можно отступить. Отдых 5 минут.','Broken branches, silent birds. Rare roots and their inhabitants. You can retreat. Recovery 5 minutes.'),btn('forest-search','deep',uiText('Пойти за следами','Follow the tracks'),E.atlas.canSurvey(s)));
      }
      row('Текущее место',W.locations[w.location].name,E.activityRunning(s)?'Активно':'Приостановлено: смени место или занятие.');
      row('Переход',w.journey?`${W.locations[w.journey.destination].name}; ${Math.ceil(w.journey.remaining)} сек`:'Отсутствует','При прибытии доступна встреча');
      if(scene)row('Встреча',W.sceneText(scene,'title',root.IsekaiLocale?.language),W.sceneText(scene,'text',root.IsekaiLocale?.language,s));
      if(scene)for(const c of scene.choices){const x=E.choiceExplanation(s,scene,c,root.IsekaiLocale?.language||'ru');const fields=[[uiText('Намерение','Intent'),x.intent],[uiText('Потребуется','Cost'),x.cost],[uiText('Польза','Benefit'),x.benefit],[uiText('Отношения','Relationships'),x.relationship],[uiText('Условия','Requirements'),x.requirement]].filter(([,value])=>value).map(([label,value])=>`<div class="choice-detail"><strong>${label}:</strong> ${value}</div>`).join('');row(W.sceneText(c,'label',root.IsekaiLocale?.language),x.risk,fields,btn('choice',c.id,c.danger?uiText('Принять риск','Accept the risk'):uiText('Выбрать','Choose'),x.available));}
      row('Поиск встречи',`${Math.ceil(w.encounterCooldown)} сек`,'Интервал 300 сек',btn('encounter','','Найти',W.canEncounter(s)));
      for(const q of W.pendingQuests(s))row('Ожидают продолжения',W.sceneText(q.scene,'title',root.IsekaiLocale?.language),`${W.locations[q.location].name}; ${W.pathNames[q.route]}; Глава ${q.stage+1}; признание +1`);
      for(const[k,p]of Object.entries(W.locations).filter(([k])=>W.knownLocations(s).includes(k))){
        const know=E.atlas.overview(s,E,k,root.IsekaiLocale?.language||'ru');
        row(p.name,`${W.travelTime(s,k)} сек`,`${know.bonus} ${W.travelReason(s,k,root.IsekaiLocale?.language||'ru')}`,btn('travel',k,'Перейти',W.canTravel(s,k)));
      }
      row('Выбор встречи','Случайный','Зависит от места, уровня и знакомств; без повторной выдачи уникальных находок');
      row('История','Важные доступные знакомства не теряются из-за долгого невезения; прошлые поступки открывают продолжения встреч.');
      row('Наставники',w.mentors.length,w.mentors.map(k=>W.mentorNames[k]).join('; '));
      if(s.stage===1)for(const[k,a]of Object.entries(W.admissions))row(a.name,w.admission===k?'Выбран':'Не выбран',k==='gates'?'Общий набор в городе':w.admissionRoutes.includes(k)?'Поручительство получено; подай заявку в городе':'Найди встречу в лесу или храме',btn('apply-sect',k,'Оформить',W.canApply(s,k)));
      if(s.stage>=2&&w.admission)row('Твоя секта',W.admissions[w.admission].name,'Сохранено в личном деле');
      if(s.stage===1||s.stage>=2&&w.admission)for(const k of s.stage===1?Object.keys(E.sects.schools):[w.admission]){const lang=root.IsekaiLocale?.language||'ru',a=E.sects.info(s,k,lang);row(a.name,a.role,a.teacher+' · '+a.perk+' '+a.rule+' '+E.sects.progress(s,k,lang));}
      row('Возвращения после гибели',w.deaths,'После гибели теряется 50% переносимых ресурсов; прокачка, знания, сюжет и владения сохраняются');
      const lang=root.IsekaiLocale?.language||'ru',en=lang==='en';
      for(const[id,f]of Object.entries(W.frontiers)){
        if(w.location===f.base||w.visits[f.base]>0){
          const explored=w.map.explored.includes(id),ready=f.ready(s);
          const status=explored?uiText('Разведано','Explored'):ready?uiText('Готов к разведке','Ready to explore'):uiText('Требования не выполнены','Requirements not met');
          const desc=ready?(explored?uiText('Тропа проверена. Осмотр доступен на карте.','Route inspected. Accessible on the map.'):uiText('Безопасный подход готов. Исследуй на карте.','Safe approach ready. Explore on the map.')):(en?f.reasonEn:f.reason);
          row(uiText('Рубеж: ','Frontier: ')+(en?f.en:f.name),status,desc);
        }
      }
      const j=E.atlas.journal(s,E,w.location,lang);
      if(j.visited||j.facts.length||j.resources.length||j.people.length){
        const details=[
          j.people.length?`<strong>${uiText('Знакомые:','People:')}</strong> ${j.people.map(p=>`${p.name} (${p.role})`).join('; ')}`:'',
          j.resources.length?`<strong>${uiText('Ресурсы:','Resources:')}</strong> ${j.resources.join(', ')}`:'',
          j.facts.length?j.facts.join(' '):''
        ].filter(Boolean).join('<br>');
        row(uiText('Дневник: ','Journal: ')+W.locations[w.location].name,j.visited?uiText('Исследовано','Explored'):uiText('Не посещено','Not visited'),details||j.summary);
      }
      for(const r of E.atlas.rumors(s,lang)){
        row(uiText('Слух: ','Rumour: ')+r.source,r.confirmed?uiText('Подтверждён ✓','Confirmed ✓'):uiText('Не проверен ?','Unverified ?'),`${r.text} (${W.locations[r.place]?.name||r.place})`);
      }
    }
    if(tab==='sect') {
      if(s.world.admission){const lang=root.IsekaiLocale?.language||'ru',a=E.sects.info(s,s.world.admission,lang);row(a.name,a.role,a.rule+' '+a.perk+' '+E.sects.progress(s,s.world.admission,lang));}
      const c={reputation:20*(s.study+1),gold:100*(s.study+1)};
      row('Библиотека',`${s.study}/10`,cost(c),btn('study','','Изучить',s.study<10&&E.affordable(s,c)));
      if(s.stage>=3) {
        const used=Object.values(s.workers).reduce((a,b)=>a+b,0);
        row('Последователи',`${s.population}/${3+s.buildings.dorm*3}`,`Свободно ${s.population-used}; монеты 100; травы 20`,btn('recruit','','Добавить',s.population<3+s.buildings.dorm*3&&E.affordable(s,{gold:100,herbs:20})));
        for(const [k,label] of Object.entries(jobs)) row(label,s.workers[k],k==='alchemist'?'На пилюлю: 5 трав и 10 энергии':'Назначить последователей',btn('worker',`${k}:-1`,'−',s.workers[k]>0)+' '+btn('worker',`${k}:1`,'+',used<s.population));
        build([3]);
      }
    }
    if(tab==='city') {
      build([4]);row('Маршруты',`${s.routes.length}/${s.buildings.market}`,'Монеты 300; припасы 30',btn('route','','Добавить',s.routes.length<s.buildings.market&&E.affordable(s,{gold:300,supplies:30})));
      s.routes.forEach((r,i)=>row(`Маршрут ${i+1}`,`${Math.ceil(r.remaining/60)} мин`,'Возвращение: монеты +500; влияние +30'));
    }
    if(tab==='planet') {
      build([5]);row('Сила планетарного щита',f(E.power(s)+s.buildings.node*20),`Порог ${f(10000*(s.resources.worlds+1))}`);
      row('Межмировой портал','120 мин','Энергия 500; припасы 50',btn('portal','','Запустить',!s.expedition&&E.power(s)+s.buildings.node*20>=10000*(s.resources.worlds+1)&&E.affordable(s,{qi:500,supplies:50})));
    }
    if(tab==='galaxy') {
      build([6,7]);row('Колониальный поход','240 мин',`Корабли: ${s.buildings.fleet}/${s.resources.worlds+1}; эссенция 60; припасы 100`,btn('colonize','','Запустить',!s.expedition&&s.buildings.fleet>=s.resources.worlds+1&&E.affordable(s,{cosmic:60,supplies:100})));
    }
    if(['planet','galaxy'].includes(tab)) row('Экспедиция',s.expedition?`${Math.ceil(s.expedition.remaining/60)} мин`:'Отсутствует','Один слот; награда: мир и 80 эссенции');
    if(tab==='legacy') {row('Цикл',s.life,`Бонус душ +${s.souls*10}%`);row('Перерождение',`+${Math.max(1,Math.floor(s.realm/6))}`,'Требуется ступень 24; ресурсы и владения сбросятся',btn('rebirth','','Переродиться',s.realm>=24));}
    if(tab==='roadmap') for(let i=0;i<=Math.min(7,s.stage+1);i++) row(E.stages[i].name,i<s.stage?'Завершён':i===s.stage?'Активен':'Ожидание',['Древнее наследие','Техники и испытания','Жизнь ученика','Управление сектой','Управление городом','Мировые порталы','Звёздные колонии','Наследие души'][i]);
    if(tab==='roadmap'&&s.stage>0&&s.stage<7){row('Ближайшая цель',E.stages[s.stage+1].name,`Уровень ${s.realm}/${E.stages[s.stage].realm}; победы ${s.wins}/${E.stages[s.stage].wins} или признание ${E.world.recognition(s)} / ${E.world.recognitionNeeded(s)}; ${cost(E.stages[s.stage].cost)}`,btn('advance','','Перейти',E.canAdvance(s)));for(const[k,n]of Object.entries(s.world.director.paths[s.stage]||{}))row(E.world.pathNames[k],n);}
    const table=(items,caption)=>`<div class="table-scroll" tabindex="0" role="region" aria-label="${caption}"><table class="data-table"><caption>${caption}</caption><thead><tr><th scope="col">Показатель</th><th scope="col">Значение</th><th scope="col">Условия</th><th scope="col">Действие</th></tr></thead><tbody>${items.join('')}</tbody></table></div>`;
    let content=table(rows,'Показатели и действия');
    if(tab==='hero') {
      const lang=root.IsekaiLocale?.language||'ru',beat=s.stage===0&&E.storyBeat(s);
      const achievementNames=new Set(E.achievements.list(s,lang).map(a=>a.name));
      const vowNames=new Set(E.achievements.challenges(s,lang).map(a=>a.name));
      const techniqueNames=new Set(Object.values(E.techniques).map(t=>t.name));
      const groups={overview:[],contract:[],actions:[],development:[],techniques:[],achievements:[],vows:[]};
      for(const e of entries){
        let group='development';
        if(['Текущее место','Занятие','Ближайшая цель','Следующий шаг','Next step','Сюжет',beat?.title,'Ожидает решения','Awaiting your decision'].includes(e.name))group='overview';
        else if(['Активный заказ','Отмена','Приём заявок','Поручения','Освоенная работа','Familiar work'].includes(e.name)||/data-action="(?:order|claim-order|cancel-order)"/.test(e.operation))group='contract';
        else if(vowNames.has(e.name)||['Необязательные обеты','Optional vows'].includes(e.name))group='vows';
        else if(achievementNames.has(e.name))group='achievements';
        else if(techniqueNames.has(e.name))group='techniques';
        else if(/data-action="(?:click|activity|technique-action|achievement-action|breakthrough)"/.test(e.operation)||['Выносливость','Спокойствие'].includes(e.name))group='actions';
        groups[group].push(e);
      }
      const rank={'Текущее место':0,'Занятие':1,'Ближайшая цель':2,'Следующий шаг':3,'Next step':3};
      groups.overview.sort((a,b)=>(rank[a.name]??4)-(rank[b.name]??4));
      const headings={overview:uiText('Сейчас и ближайшая цель','Current situation and next goal'),contract:uiText('Поручения и работа','Contracts and work'),actions:uiText('Доступные действия','Available actions'),development:uiText('Развитие и пути героя','Progression and personal paths'),techniques:uiText('Техники и их освоение','Techniques and learning'),achievements:uiText('Достижения','Achievements'),vows:uiText('Необязательные обеты','Optional vows')};
      content=Object.entries(groups).filter(([,items])=>items.length).map(([key,items])=>{
        const body=table(items.map(e=>e.html),headings[key]);
        return ['overview','contract','actions'].includes(key)?`<section class="data-hero-section" data-hero-section="${key}">${body}</section>`:`<details class="data-hero-section" data-hero-section="${key}" data-panel="hero-data-${key}"><summary>${headings[key]}</summary>${body}</details>`;
      }).join('');
    }
    return `<h2>${tabs[tab]}</h2><p class="data-summary">Глава ${s.stage+1} · Уровень ${s.realm} · ${E.activityRunning(s)?'Активно':'Приостановлено'}: ${activityLabels[s.activity]} · Автосохранение · Офлайн до 24 ч</p><div aria-label="Показатели и действия">${content}</div>`;
  }
  root.IsekaiDataView={labels,tabs,render};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.IsekaiDataView;
})(globalThis);
