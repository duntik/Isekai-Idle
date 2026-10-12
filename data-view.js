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
    const rows=[];
    const row=(name,value,note='',operation='—')=>{
      const hints=[...operation.matchAll(/data-action="([^"]+)" data-value="([^"]*)"/g)].map(m=>E.guidance(s,m[1],m[2],root.IsekaiLocale?.language||'ru')).filter(Boolean);
      rows.push(`<tr><th scope="row">${name}</th><td>${value}</td><td>${note}${[...new Set(hints)].map(hint=>`<div class="action-hint">${hint}</div>`).join('')}</td><td>${operation}</td></tr>`);
    };
    const build=levels=>Object.entries(E.projects).filter(([,p])=>levels.includes(p.stage)&&p.stage<=s.stage).forEach(([k])=>row(projectLabels[k],s.buildings[k],cost(E.buildCost(s,k)),btn('build',k,'Добавить',E.affordable(s,E.buildCost(s,k)))));
    if(tab==='hero') {
      const milestones=E.achievements.list(s,root.IsekaiLocale?.language||'ru');
      for(const a of [...milestones.filter(a=>a.earned),...E.achievements.upcoming(s,root.IsekaiLocale?.language||'ru')])row(a.name,a.earned?'✓':'◇',a.description);
      for(const a of E.achievementActions(s))row(a.name[root.IsekaiLocale?.language==='en'?1:0],s.achievements.cooldowns[a.id]>0?`${Math.ceil(s.achievements.cooldowns[a.id])} s`:'—',a.description[root.IsekaiLocale?.language==='en'?1:0],btn('achievement-action',a.id,uiText('Выполнить','Perform'),a.enabled));
      const hint=E.guidance(s,s.stage===0&&E.storyBeat(s)?'story':'advance','',root.IsekaiLocale?.language||'ru');
      if(hint)row(root.IsekaiLocale?.language==='en'?'Next step':'Следующий шаг','→',hint);
      if(s.stage===0) {
        const beat=E.storyBeat(s);
        if(beat)row(beat.title,`${s.storyStep+1}/${E.story.length}`,`${beat.goal}; ${cost(beat.reward)}`,s.storyStep===6?Object.entries(E.firstRoutes).map(([k,label])=>btn('story',k,label,beat.ready(s)&&E.firstRouteReady(s,k))).join(''):btn('story','',beat.button,beat.ready(s)));
        else row('Сюжет','Завершён','Доступна следующая глава');
        if(s.storyStep>0)for(const p of E.world.developmentPaths?.(s,root.IsekaiLocale?.language||'ru')||[])row(p.name,`${p.progress}/${p.total}`,`${p.description} ${p.next}`,`<button data-tab="world">${uiText('Искать встречи','Look for encounters')}</button>`);
      }
      row('Текущее место',E.world.locations[s.world.location].name,activityLabels[s.activity]);
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
        for(const [k,c] of Object.entries(E.clicks).filter(([k])=>E.clickVisible(s,k)))row(c.name,s.clicks[k],`${c.desc}; выносливость −${c.stamina}; ${E.taskPracticeText(k,root.IsekaiLocale?.language||'ru')}`,btn('click',k,'Выполнить',E.canClick(s,k)));
      }
      for(const [k,a] of Object.entries(E.activities).filter(([k])=>E.activityVisible(s,k))) row(activityLabels[k],s.activity===k?(E.activityRunning(s)?'Активно':'Приостановлено'):'Ожидание',a.desc+' '+E.taskPracticeText(k,root.IsekaiLocale?.language||'ru')+' '+Object.entries(a.rates||{}).map(([r,v])=>`${labels[r]} +${f(v*60*E.speed(s))}/мин`).join('; ')||'Развитие героя',btn('activity',k,'Назначить',s.activity!==k));
      if(s.stage>=1) {
        for(const [k,label] of Object.entries({balanced:'Равновесие',swift:'Быстрый шаг',piercing:'Пробивающий удар',ward:'Духовный заслон'})) row(label,s.style===k?'Выбран':'—','Боевой стиль',btn('style',k,'Применить'));
        const c={gold:Math.ceil(40*1.8**s.weapon),...(s.stage>=3?{ore:Math.ceil(10*1.4**s.weapon)}:{})};
        row('Оружие',s.weapon,cost(c),btn('weapon','','Обновить',s.weapon<(s.realm+1)*2&&E.affordable(s,c)));
      }
      row('Выполненные заказы',s.employment.completed,'Расценки +10% за каждые 5; до +100%; город +25%');
      row('Приём заявок',Object.keys(E.orders).some(k=>E.orderAvailable(s,k))?'Доступен':'Недоступен','У знакомого заказчика; работа и оплата только в месте принятого заказа');
      const order=s.employment.order;
      if(!order&&!Object.keys(E.orders).some(k=>E.orderAvailable(s,k)))row('Поручения','—','Сначала познакомься с заказчиком. Поручения появляются после встреч; принятый заказ нужно выполнять и сдавать в указанном месте.');
      if(order){row('Активный заказ',`${E.orderName(s,order.kind,order.place||'village')}: ${f(order.progress)}/${E.orders[order.kind].target}`,`Монеты +${order.pay}`,btn('claim-order','','Получить',E.canClaimOrder(s)));row('Отмена','Без оплаты','Текущий прогресс заказа сбросится',btn('cancel-order','','Отменить'));}
      for(const[k,o]of Object.entries(E.orders).filter(([k])=>!order&&E.orderAvailable(s,k)))row(E.orderName(s,k),`Монеты +${E.orderPay(s,k)}`,`${o.target} ${k==='ledger'?'сек фоновой работы':'операций'}; тело от ${o.body}`,btn('order',k,'Принять',E.canOrder(s,k)));
      for(const[k,t]of Object.entries(E.techniques)){const learned=s.cultivation.learned[k],known=t.available(s)||!!learned;if(known)row(t.name,`${learned?.rank||0}/5`,`${E.techniqueSource(s,k)}. ${t.desc}${t.practiceBody?uiText(" Практика этой двигательной техники также укрепляет тело и расходует выносливость."," Practicing this movement technique also strengthens the body and uses stamina."):""} ${cost(E.techniqueCost(s,k))}; ${learned&&learned.rank<5?`${f(learned.progress)}/${E.techniqueNeeded(learned.rank)} сек`:'Первичное освоение'}`,btn('learn-technique',k,learned?'Повысить ранг':'Изучить',E.canLearn(s,k))+(learned?btn('equip-technique',k,s.cultivation.active===k?'Активна':'Применить',s.cultivation.active!==k):''));}
      if(s.stage<7) {const gate=E.stages[s.stage];row('Ближайшая цель',E.stages[s.stage+1].name,`Уровень ${s.realm}/${gate.realm}; ${s.stage===0?'Личный прорыв и помощь обозу: победа, 3 признания или рекомендация Вэя.':`победы ${s.wins}/${gate.wins} или признание ${E.world.recognition(s)} / ${E.world.recognitionNeeded(s)}`}; ${cost(gate.cost)}${s.stage===0?`; сюжет ${s.storyStep}/${E.story.length}`:''}`,btn('advance','','Перейти',E.canAdvance(s)));}
    }
    if(['hero','world'].includes(tab))for(const a of E.techniqueActions?.(s,root.IsekaiLocale?.language||'ru')||[])row(a.name,a.hint,`${E.techniques[a.technique].name}. ${a.description}`,btn('technique-action',a.id,uiText('Выполнить приём','Use method'),a.enabled)+(s.cultivation.active!==a.technique?btn('equip-technique',a.technique,uiText('Выбрать эту технику','Equip this technique')):''));
    if(tab==='combat') {
      if(s.stage===0)row('Первый бой','Деревня','После прорыва и перед финалом первой арки. Можно завершить арку без боя.');
      row('Соперник',E.enemy(s).name,`Порог: ${f(E.enemy(s).power)}; результат: ${f(E.battlePower(s))}`,btn('fight','','Выполнить',!s.cooldown&&E.battlePower(s)>=E.enemy(s).power));
      row('Подходящий стиль',{swift:'Быстрый шаг',armored:'Пробивающий удар',mystic:'Духовный заслон'}[E.enemy(s).type],'Соответствие даёт +35%');
      row('Интервал',`${Math.ceil(s.cooldown)} сек`,'Пять минут после победы');
      row('Результат',s.wins,`Монеты +${f(30*1.8**s.wins)}; травы +${(s.wins+1)*10}; осколки +1`);
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
      const bonuses={village:'Тело +10%',forest:'Травы при сборе +50%',city:'Оплата нового заказа +25%',ruins:'Осколки при сборе +50%',mountains:'Понимание +20%'};
      for(const[k,p]of Object.entries(W.locations).filter(([k])=>W.knownLocations(s).includes(k)))row(p.name,`${W.travelTime(s,k)} сек`,`${bonuses[k]||p.bonus} ${W.travelReason(s,k,root.IsekaiLocale?.language||'ru')}`,btn('travel',k,'Перейти',W.canTravel(s,k)));
      row('Выбор встречи','Случайный','Зависит от места, уровня и знакомств; без повторной выдачи уникальных находок');
      row('История','Важные доступные знакомства не теряются из-за долгого невезения; прошлые поступки открывают продолжения встреч.');
      row('Наставники',w.mentors.length,w.mentors.map(k=>W.mentorNames[k]).join('; '));
      if(s.stage===1)for(const[k,a]of Object.entries(W.admissions))row(a.name,w.admission===k?'Выбран':'Не выбран',k==='gates'?'Общий набор в городе':w.admissionRoutes.includes(k)?'Поручительство получено; подай заявку в городе':'Найди встречу в лесу или храме',btn('apply-sect',k,'Оформить',W.canApply(s,k)));
      if(s.stage>=2&&w.admission)row('Твоя секта',W.admissions[w.admission].name,'Сохранено в личном деле');
      row('Возвращения после гибели',w.deaths,'После гибели теряется 50% переносимых ресурсов; прокачка, знания, сюжет и владения сохраняются');
    }
    if(tab==='sect') {
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
    return `<h2>${tabs[tab]}</h2><p class="data-summary">Глава ${s.stage+1} · Уровень ${s.realm} · ${E.activityRunning(s)?'Активно':'Приостановлено'}: ${activityLabels[s.activity]} · Автосохранение · Офлайн до 24 ч</p><div class="table-scroll" tabindex="0" role="region" aria-label="Показатели и действия"><table class="data-table"><caption>Показатели и действия</caption><thead><tr><th scope="col">Показатель</th><th scope="col">Значение</th><th scope="col">Условия</th><th scope="col">Действие</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
  }
  root.IsekaiDataView={labels,tabs,render};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.IsekaiDataView;
})(globalThis);
