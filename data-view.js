(function(root) {
  'use strict';
  const labels = {gold:'Монеты',herbs:'Травы',qi:'Духовная энергия',relics:'Осколки',reputation:'Репутация',wood:'Древесина',ore:'Руда',pills:'Пилюли',influence:'Влияние',supplies:'Припасы',cosmic:'Звёздная эссенция',worlds:'Миры'};
  const tabs = {hero:'Путь героя',combat:'Испытания',world:'Путешествия',sect:'Секта',city:'Город',planet:'Планета',galaxy:'Галактика',legacy:'Наследие',roadmap:'Горизонты'};
  const activityLabels = {work:'Работать над заказом',explore:'Исследовать местность',train:'Тренировать тело',meditate:'Медитировать',technique:'Осваивать технику',mission:'Поручения секты',govern:'Управлять владениями',laws:'Постигать законы'};
  const projectLabels = {dorm:'Обитель учеников',garden:'Духовный сад',market:'Торговый район',granary:'Склад снабжения',node:'Мировой узел',fleet:'Звёздный корабль',observatory:'Обсерватория законов'};
  const jobs = {herb:'Садовники',lumber:'Лесорубы',miner:'Рудокопы',alchemist:'Алхимики',disciple:'Ученики'};
  function render(s,tab,E) {
    const f = n=>n.toLocaleString(root.IsekaiLocale?.locale||'ru-RU',{maximumFractionDigits:2});
    const cost = c=>Object.entries(c).map(([k,v])=>`${labels[k]}: ${f(v)}`).join('; ');
    const btn = (action,value,label,enabled=true)=>`<button data-action="${action}" data-value="${value}" ${enabled&&(action!=='advance'||E.canAdvance(s))&&(action!=='activity'||E.canActivity(s,value))?'':'disabled'}>${label}</button>`;
    const rows=[];
    const row=(name,value,note,operation='—')=>rows.push(`<tr><th scope="row">${name}</th><td>${value}</td><td>${note}</td><td>${operation}</td></tr>`);
    const build=levels=>Object.entries(E.projects).filter(([,p])=>levels.includes(p.stage)&&p.stage<=s.stage).forEach(([k])=>row(projectLabels[k],s.buildings[k],cost(E.buildCost(s,k)),btn('build',k,'Добавить',E.affordable(s,E.buildCost(s,k)))));
    if(tab==='hero') {
      if(!E.activityRunning(s))row('Занятие','Приостановлено: смени место или занятие.');
      row('Глава',`${s.stage+1} / 8`,E.stages[s.stage].name);
      for(const[k,t]of Object.entries(E.techniques)){const learned=s.cultivation.learned[k],known=t.available(s)||!!learned;if(known)row(t.name,`${learned?.rank||0}/5`,`${t.source}. ${t.desc} ${cost(E.techniqueCost(s,k))}; ${learned&&learned.rank<5?`${f(learned.progress)}/${E.techniqueNeeded(learned.rank)} сек`:'Первичное освоение'}`,btn('learn-technique',k,learned?'Повысить ранг':'Изучить',E.canLearn(s,k))+(learned?btn('equip-technique',k,s.cultivation.active===k?'Активна':'Применить',s.cultivation.active!==k):''));}
      row('Уровень',s.realm,`${f(s.xp)} / ${f(E.needed(s))}; ${cost(E.breakthroughCost(s))}`,btn('breakthrough','','Повысить',s.found&&s.xp>=E.needed(s)&&E.affordable(s,E.breakthroughCost(s))));
      row('Тело',`${f(s.body)} / ${(s.realm+1)*10}`,'Лимит зависит от уровня');
      row('Освоение техники',`${f(s.mastery)} / ${(s.realm+1)*10}`,`Скорость развития: ${f(E.speed(s))}`);
      row('Древнее наследие',s.found?'Найдено':`${Math.min(100,Math.floor(s.explored/6))}%`,'600 сек исследования до находки');
      if(s.stage===0) {
        const beat=E.story[s.storyStep];
        if(beat)row(beat.title,`${s.storyStep+1}/${E.story.length}`,`${beat.goal}; ${cost(beat.reward)}`,btn('story','',beat.button,beat.ready(s)));
        else row('Сюжет','Завершён','Доступна следующая глава');
      }
      {
        row('Выносливость',`${f(s.stamina)}/100`,'Восстановление +0,4/сек; интервал 0,6 сек');
        row('Спокойствие',`${f(s.calm)}/100`,'Растёт от медитации');
        for(const [k,c] of Object.entries(E.clicks).filter(([k])=>k!=='scout'||s.stage<2))row(c.name,s.clicks[k],`${c.desc}; выносливость −${c.stamina}`,btn('click',k,'Выполнить',E.canClick(s,k)));
      }
      for(const [k,a] of Object.entries(E.activities).filter(([,a])=>a.stage<=s.stage)) row(activityLabels[k],s.activity===k?(E.activityRunning(s)?'Активно':'Приостановлено'):'Ожидание',a.desc+' '+Object.entries(a.rates||{}).map(([r,v])=>`${labels[r]} +${f(v*60*E.speed(s))}/мин`).join('; ')||'Развитие героя',btn('activity',k,'Назначить',s.activity!==k));
      if(s.stage>=1) {
        for(const [k,label] of Object.entries({balanced:'Равновесие',swift:'Быстрый шаг',piercing:'Пробивающий удар',ward:'Духовный заслон'})) row(label,s.style===k?'Выбран':'—','Боевой стиль',btn('style',k,'Применить'));
        const c={gold:Math.ceil(40*1.8**s.weapon),...(s.stage>=3?{ore:Math.ceil(10*1.4**s.weapon)}:{})};
        row('Оружие',s.weapon,cost(c),btn('weapon','','Обновить',s.weapon<(s.realm+1)*2&&E.affordable(s,c)));
      }
      if(s.stage<7) {const gate=E.stages[s.stage];row('Следующая глава',E.stages[s.stage+1].name,`Уровень ${s.realm}/${gate.realm}; победы ${s.wins}/${gate.wins}; ${cost(gate.cost)}${s.stage===0?`; сюжет ${s.storyStep}/${E.story.length}`:''}`,btn('advance','','Перейти',E.canAdvance(s)));}
      row('Выполненные заказы',s.employment.completed,'Расценки +10% за каждые 5; до +100%; город +25%');
      row('Приём заявок',['village','city'].includes(s.world.location)&&!s.world.journey?'Доступен':'Недоступен','В деревне и городе; уборка и разгрузка приостанавливаются в пути');
      const order=s.employment.order;
      if(order){row('Активный заказ',`${E.orders[order.kind].name}: ${f(order.progress)}/${E.orders[order.kind].target}`,`Монеты +${order.pay}`,btn('claim-order','','Получить',order.progress>=E.orders[order.kind].target));row('Отмена','Без оплаты','Текущий прогресс заказа сбросится',btn('cancel-order','','Отменить'));}
      for(const[k,o]of Object.entries(E.orders))row(o.name,`Монеты +${E.orderPay(s,k)}`,`${o.target} ${k==='ledger'?'сек фоновой работы':'операций'}; тело от ${o.body}`,btn('order',k,'Принять',E.canOrder(s,k)));
    }
    if(tab==='combat') {
      row('Соперник',E.enemy(s).name,`Порог: ${f(E.enemy(s).power)}; результат: ${f(E.battlePower(s))}`,btn('fight','','Выполнить',!s.cooldown&&E.battlePower(s)>=E.enemy(s).power));
      row('Подходящий стиль',{swift:'Быстрый шаг',armored:'Пробивающий удар',mystic:'Духовный заслон'}[E.enemy(s).type],'Соответствие даёт +35%');
      row('Интервал',`${Math.ceil(s.cooldown)} сек`,'Пять минут после победы');
      row('Результат',s.wins,`Монеты +${f(30*1.8**s.wins)}; травы +${(s.wins+1)*10}; осколки +1`);
    }
    if(tab==='world') {
      const W=E.world,w=s.world,scene=W.current(s);
      row('Текущее место',W.locations[w.location].name,'Занятие продолжается в пути');
      row('Выбор встречи','Случайный','Зависит от места, уровня и знакомств; без повторной выдачи уникальных находок');
      row('История','Важные доступные знакомства не теряются из-за долгого невезения; прошлые поступки открывают продолжения встреч.');
      row('Переход',w.journey?`${W.locations[w.journey.destination].name}; ${Math.ceil(w.journey.remaining)} сек`:'Отсутствует','При прибытии доступна встреча');
      const bonuses={village:'Тело +10%',forest:'Травы при сборе +50%',city:'Оплата нового заказа +25%',ruins:'Осколки при сборе +50%',mountains:'Понимание +20%'};
      for(const[k,p]of Object.entries(W.locations).filter(([,p])=>p.stage<=s.stage))row(p.name,`${p.time} сек`,bonuses[k],btn('travel',k,'Перейти',W.canTravel(s,k)));
      row('Поиск встречи',`${Math.ceil(w.encounterCooldown)} сек`,'Интервал 300 сек',btn('encounter','','Найти',W.canEncounter(s)));
      if(scene)row('Встреча',scene.title,scene.text);
      if(scene)for(const c of scene.choices)row(c.label,c.danger?`Порог ${c.danger}; показатель ${E.power(s)}`:'Без риска',`${c.danger&&E.power(s)<c.danger?'Гибель: потеря 50% ресурсов. ':''}${c.cost?`Расход: ${cost(c.cost)}. `:''}${c.reward?`Результат: ${cost(c.reward)}. `:''}${c.mentor?'Урок наставника. ':''}${c.explore?`Исследование +${c.explore} сек. `:''}${c.restore?'Восстановление выносливости. ':''}${c.body?`Тело +${c.body}. `:''}${c.calm?`Спокойствие +${c.calm}. `:''}${c.mastery?`Освоение техники +${c.mastery}. `:''}`,btn('choice',c.id,c.danger?'Выполнить с риском':'Выбрать',E.affordable(s,c.cost||{})));
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
    if(tab==='roadmap') for(let i=0;i<8;i++) row(E.stages[i].name,i<s.stage?'Завершён':i===s.stage?'Активен':'Ожидание',['Древнее наследие','Техники и испытания','Жизнь ученика','Управление сектой','Управление городом','Мировые порталы','Звёздные колонии','Наследие души'][i]);
    return `<h2>${tabs[tab]}</h2><p class="data-summary">Глава ${s.stage+1} · Уровень ${s.realm} · Активно: ${activityLabels[s.activity]} · Автосохранение · Офлайн до 24 ч</p><div class="table-scroll"><table class="data-table"><caption>Показатели и действия</caption><thead><tr><th scope="col">Показатель</th><th scope="col">Значение</th><th scope="col">Условия</th><th scope="col">Действие</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
  }
  root.IsekaiDataView={labels,tabs,render};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.IsekaiDataView;
})(globalThis);
