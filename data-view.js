(function(root) {
  'use strict';
  const labels = { gold:'Бюджет', herbs:'Сырьё A', qi:'Резерв', relics:'Компоненты', reputation:'Рейтинг', wood:'Материал B', ore:'Материал C', pills:'Продукт', influence:'Охват', supplies:'Запасы', cosmic:'Потенциал', worlds:'Объекты' };
  const tabs = {hero:'Обзор',combat:'Проверки',world:'Маршруты',sect:'Персонал',city:'Логистика',planet:'Сеть',galaxy:'Развёртывание',legacy:'Архив',roadmap:'Этапы'};
  const activityLabels = {work:'Обработка заявок',explore:'Сбор исходных данных',train:'Подготовка',meditate:'Анализ',technique:'Оптимизация',mission:'Внутренние задачи',govern:'Координация',laws:'Моделирование'};
  const projectLabels = {dorm:'Расширение штата',garden:'Источник сырья',market:'Транспортный отдел',granary:'Склад',node:'Сетевой узел',fleet:'Транспортная единица',observatory:'Аналитический центр'};
  const jobs = {herb:'Сырьё A',lumber:'Материал B',miner:'Материал C',alchemist:'Производство',disciple:'Координация'};
  function render(s,tab,E) {
    const f = n=>n.toLocaleString('ru-RU',{maximumFractionDigits:2});
    const cost = c=>Object.entries(c).map(([k,v])=>`${labels[k]}: ${f(v)}`).join('; ');
    const btn = (action,value,label,enabled=true)=>`<button data-action="${action}" data-value="${value}" ${enabled&&(action!=='advance'||E.canAdvance(s))&&(action!=='activity'||value!=='work'||s.employment.order?.kind==='ledger')?'':'disabled'}>${label}</button>`;
    const rows=[];
    const row=(name,value,note,operation='—')=>rows.push(`<tr><th scope="row">${name}</th><td>${value}</td><td>${note}</td><td>${operation}</td></tr>`);
    const build=levels=>Object.entries(E.projects).filter(([,p])=>levels.includes(p.stage)&&p.stage<=s.stage).forEach(([k])=>row(projectLabels[k],s.buildings[k],cost(E.buildCost(s,k)),btn('build',k,'Добавить',E.affordable(s,E.buildCost(s,k)))));
    if(tab==='hero') {
      row('Контур',`${s.stage+1} / 8`,'Текущий этап обработки');
      for(const[k,t]of Object.entries(E.techniques)){const learned=s.cultivation.learned[k],known=t.available(s)||!!learned;if(known)row(`Метод ${Object.keys(E.techniques).indexOf(k)+1}`,`${learned?.rank||0}/5`,`${cost(E.techniqueCost(s,k))}; ${learned&&learned.rank<5?`${f(learned.progress)}/${E.techniqueNeeded(learned.rank)} сек`:'Первичное освоение'}; коэффициент растёт с уровнем`,btn('learn-technique',k,learned?'Повысить':'Изучить',E.canLearn(s,k))+(learned?btn('equip-technique',k,s.cultivation.active===k?'Активен':'Применить',s.cultivation.active!==k):''));}
      row('Уровень',s.realm,`${f(s.xp)} / ${f(E.needed(s))}; ${cost(E.breakthroughCost(s))}`,btn('breakthrough','','Повысить',s.found&&s.xp>=E.needed(s)&&E.affordable(s,E.breakthroughCost(s))));
      row('Подготовка',`${f(s.body)} / ${(s.realm+1)*10}`,'Лимит зависит от уровня');
      row('Оптимизация',`${f(s.mastery)} / ${(s.realm+1)*10}`,`Коэффициент обработки: ${f(E.speed(s))}`);
      row('Исходные данные',s.found?'Получены':`${Math.min(100,Math.floor(s.explored/6))}%`,'600 секунд сбора для первого набора');
      if(s.stage===0) {
        const beat=E.story[s.storyStep];
        const goals=['Подтвердить старт','10 малых операций или бюджет 15','Подготовка 2','Концентрация 5','Исходные данные получены','Уровень 1','Одна успешная проверка'];
        if(beat)row('Контрольная точка',`${s.storyStep+1}/${E.story.length}`,`${goals[s.storyStep]}; ${cost(beat.reward)}`,btn('story','','Подтвердить',beat.ready(s)));
        else row('Контрольные точки','Завершены','Доступен следующий контур');
      }
      {
        row('Лимит операций',`${f(s.stamina)}/100`,'Восстановление +0,4/сек; интервал 0,6 сек');
        row('Концентрация',`${f(s.calm)}/100`,'Развитие фоновым анализом');
        const notes={squat:'Подготовка +0,04',run:'Подготовка +0,07',sweep:'Заказ A: +1 шаг',haul:'Заказ B: +1 шаг',scout:'Исходные данные +2 сек; сырьё A +0,05'};
        for(const [k,c] of Object.entries(E.clicks).filter(([k])=>k!=='scout'||s.stage<2))row(c.neutral,s.clicks[k],`${notes[k]}; лимит −${c.stamina}`,btn('click',k,'Выполнить',E.canClick(s,k)));
      }
      for(const [k,a] of Object.entries(E.activities).filter(([,a])=>a.stage<=s.stage)) row(activityLabels[k],s.activity===k?'Активно':'Ожидание',Object.entries(a.rates||{}).map(([r,v])=>`${labels[r]} +${f(v*60*E.speed(s))}/мин`).join('; ')||'Развитие показателя',btn('activity',k,'Назначить',s.activity!==k));
      if(s.stage>=1) {
        for(const [k,label] of Object.entries({balanced:'Базовый',swift:'Профиль A',piercing:'Профиль B',ward:'Профиль C'})) row(label,s.style===k?'Выбран':'—','Конфигурация проверки',btn('style',k,'Применить'));
        const c={gold:Math.ceil(40*1.8**s.weapon),...(s.stage>=3?{ore:Math.ceil(10*1.4**s.weapon)}:{})};
        row('Оснащение',s.weapon,cost(c),btn('weapon','','Обновить',s.weapon<(s.realm+1)*2&&E.affordable(s,c)));
      }
      if(s.stage<7) {const gate=E.stages[s.stage];row('Следующий контур',s.stage+2,`Уровень ${s.realm}/${gate.realm}; проверки ${s.wins}/${gate.wins}; ${cost(gate.cost)}${s.stage===0?`; контрольные точки ${s.storyStep}/${E.story.length}`:''}`,btn('advance','','Перейти',s.found&&s.realm>=gate.realm&&s.wins>=gate.wins&&E.affordable(s,gate.cost)&&(s.stage>0||s.storyStep>=E.story.length)));}
      row('Выполненные заказы',s.employment.completed,'Расценки +10% за каждые 5; до +100%; участок B +25%');
      const order=s.employment.order;
      if(order){row('Активный заказ',`${E.orders[order.kind].neutral}: ${f(order.progress)}/${E.orders[order.kind].target}`,`Бюджет +${order.pay}`,btn('claim-order','','Получить',order.progress>=E.orders[order.kind].target));row('Отмена','Без оплаты','Текущий прогресс заказа сбросится',btn('cancel-order','','Отменить'));}
      for(const[k,o]of Object.entries(E.orders))row(o.neutral,`Бюджет +${E.orderPay(s,k)}`,`${o.target} ${k==='ledger'?'сек фоновой работы':'операций'}; подготовка от ${o.body}`,btn('order',k,'Принять',E.canOrder(s,k)));
    }
    if(tab==='combat') {
      row('Проверка',s.wins+1,`Порог: ${f(E.enemy(s).power)}; результат: ${f(E.battlePower(s))}`,btn('fight','','Выполнить',!s.cooldown&&E.battlePower(s)>=E.enemy(s).power));
      row('Рекомендуемый профиль',{swift:'A',armored:'B',mystic:'C'}[E.enemy(s).type],'Соответствие даёт +35%');
      row('Интервал',`${Math.ceil(s.cooldown)} сек`,'Пять минут после успешной проверки');
      row('Результат',s.wins,`Бюджет +${f(30*1.8**s.wins)}; сырьё A +${(s.wins+1)*10}; компоненты +1`);
    }
    if(tab==='world') {
      const W=E.world,w=s.world,scene=W.current(s);
      row('Текущий участок',W.locations[w.location].neutral,'Процесс продолжается на маршруте');
      row('Переход',w.journey?`${W.locations[w.journey.destination].neutral}; ${Math.ceil(w.journey.remaining)} сек`:'Отсутствует','При прибытии доступна операция');
      const bonuses={village:'Подготовка +10%',forest:'Сырьё A при сборе +50%',city:'Оплата нового заказа +25%',ruins:'Компоненты при сборе +50%',mountains:'Анализ +20%'};
      for(const[k,p]of Object.entries(W.locations).filter(([,p])=>p.stage<=s.stage))row(p.neutral,`${p.time} сек`,bonuses[k],btn('travel',k,'Перейти',W.canTravel(s,k)));
      row('Локальная операция',`${Math.ceil(w.encounterCooldown)} сек`,'Интервал 300 сек',btn('encounter','','Найти',W.canEncounter(s)));
      if(scene)for(const c of scene.choices)row(c.neutral,c.danger?`Порог ${c.danger}; показатель ${E.power(s)}`:'Без риска',`${c.danger&&E.power(s)<c.danger?'Сбой: потеря 50% запасов. ':''}${c.cost?`Расход: ${cost(c.cost)}. `:''}${c.reward?`Результат: ${cost(c.reward)}. `:''}${c.mentor?'Постоянная оптимизация. ':''}${c.explore?`Данные +${c.explore} сек. `:''}${c.restore?'Восстановление лимита. ':''}${c.body?`Подготовка +${c.body}. `:''}${c.calm?`Концентрация +${c.calm}. `:''}${c.mastery?`Оптимизация +${c.mastery}. `:''}`,btn('choice',c.id,c.danger?'Выполнить с риском':'Выбрать',E.affordable(s,c.cost||{})));
      row('Оптимизации',w.mentors.length,'A: подготовка +15%; B: сырьё +20%; C: анализ +10%; D: анализ +15%; E: оптимизация +15%');
      if(s.stage===1)for(const[k,a]of Object.entries(W.admissions))row(a.neutral,w.admission===k?'Выбран':'Не выбран',k==='gates'?'Общий доступ на участке B':w.admissionRoutes.includes(k)?'Документ получен; оформление на участке B':'Требуется документ из участка A или C',btn('apply-sect',k,'Оформить',W.canApply(s,k)));
      if(s.stage>=2&&w.admission)row('Основание допуска',W.admissions[w.admission].neutral,'Сохранено в личном деле');
      row('Восстановления',w.deaths,'После сбоя теряется 50% переносимых запасов; показатели, контур, персонал, охват и объекты сохраняются');
    }
    if(tab==='sect') {
      const c={reputation:20*(s.study+1),gold:100*(s.study+1)};
      row('Регламент',`${s.study}/10`,cost(c),btn('study','','Изучить',s.study<10&&E.affordable(s,c)));
      if(s.stage>=3) {
        const used=Object.values(s.workers).reduce((a,b)=>a+b,0);
        row('Штат',`${s.population}/${3+s.buildings.dorm*3}`,`Свободно ${s.population-used}; бюджет 100; сырьё A 20`,btn('recruit','','Добавить',s.population<3+s.buildings.dorm*3&&E.affordable(s,{gold:100,herbs:20})));
        for(const [k,label] of Object.entries(jobs)) row(label,s.workers[k],k==='alchemist'?'На продукт: 5 сырья A и 10 резерва':'Назначение персонала',btn('worker',`${k}:-1`,'−',s.workers[k]>0)+' '+btn('worker',`${k}:1`,'+',used<s.population));
        build([3]);
      }
    }
    if(tab==='city') {
      build([4]);row('Маршруты',`${s.routes.length}/${s.buildings.market}`,'Бюджет 300; запасы 30',btn('route','','Добавить',s.routes.length<s.buildings.market&&E.affordable(s,{gold:300,supplies:30})));
      s.routes.forEach((r,i)=>row(`Маршрут ${i+1}`,`${Math.ceil(r.remaining/60)} мин`,'Возврат: бюджет +500; охват +30'));
    }
    if(tab==='planet') {
      build([5]);row('Пропускная способность',f(E.power(s)+s.buildings.node*20),`Порог ${f(10000*(s.resources.worlds+1))}`);
      row('Подключение','120 мин','Резерв 500; запасы 50',btn('portal','','Запустить',!s.expedition&&E.power(s)+s.buildings.node*20>=10000*(s.resources.worlds+1)&&E.affordable(s,{qi:500,supplies:50})));
    }
    if(tab==='galaxy') {
      build([6,7]);row('Развёртывание','240 мин',`Транспорт: ${s.buildings.fleet}/${s.resources.worlds+1}; потенциал 60; запасы 100`,btn('colonize','','Запустить',!s.expedition&&s.buildings.fleet>=s.resources.worlds+1&&E.affordable(s,{cosmic:60,supplies:100})));
    }
    if(['planet','galaxy'].includes(tab)) row('Текущий процесс',s.expedition?`${Math.ceil(s.expedition.remaining/60)} мин`:'Отсутствует','Один слот; завершение добавляет объект и 80 потенциала');
    if(tab==='legacy') {row('Цикл',s.life,`Накопленный коэффициент +${s.souls*10}%`);row('Перезапуск',`+${Math.max(1,Math.floor(s.realm/6))}`,'Требуется уровень 24; показатели и объекты сбросятся',btn('rebirth','','Новый цикл',s.realm>=24));}
    if(tab==='roadmap') for(let i=0;i<8;i++) row(`Контур ${i+1}`,i<s.stage?'Завершён':i===s.stage?'Активен':'Ожидание',['Исходные данные','Настройка','Внутренние процессы','Производство','Логистика','Сетевые узлы','Развёртывание','Архивирование'][i]);
    return `<h2>${tabs[tab]}</h2><p class="data-summary">Контур ${s.stage+1} · Уровень ${s.realm} · Активно: ${activityLabels[s.activity]} · Автосохранение · Фоновая обработка до 24 ч</p><div class="table-scroll"><table class="data-table"><caption>Показатели и операции</caption><thead><tr><th scope="col">Показатель</th><th scope="col">Значение</th><th scope="col">Условия</th><th scope="col">Операция</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
  }
  root.IsekaiDataView={labels,tabs,render};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.IsekaiDataView;
})(globalThis);
