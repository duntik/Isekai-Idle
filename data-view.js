(function(root) {
  'use strict';
  const labels = { gold:'Бюджет', herbs:'Сырьё A', qi:'Резерв', relics:'Компоненты', reputation:'Рейтинг', wood:'Материал B', ore:'Материал C', pills:'Продукт', influence:'Охват', supplies:'Запасы', cosmic:'Потенциал', worlds:'Объекты' };
  const tabs = {hero:'Обзор',combat:'Проверки',sect:'Персонал',city:'Логистика',planet:'Сеть',galaxy:'Развёртывание',legacy:'Архив',roadmap:'Этапы'};
  const activityLabels = {work:'Обработка заявок',explore:'Сбор исходных данных',train:'Подготовка',meditate:'Анализ',technique:'Оптимизация',mission:'Внутренние задачи',govern:'Координация',laws:'Моделирование'};
  const projectLabels = {dorm:'Расширение штата',garden:'Источник сырья',market:'Транспортный отдел',granary:'Склад',node:'Сетевой узел',fleet:'Транспортная единица',observatory:'Аналитический центр'};
  const jobs = {herb:'Сырьё A',lumber:'Материал B',miner:'Материал C',alchemist:'Производство',disciple:'Координация'};
  function render(s,tab,E) {
    const f = n=>n.toLocaleString('ru-RU',{maximumFractionDigits:2});
    const cost = c=>Object.entries(c).map(([k,v])=>`${labels[k]}: ${f(v)}`).join('; ');
    const btn = (action,value,label,enabled=true)=>`<button data-action="${action}" data-value="${value}" ${enabled?'':'disabled'}>${label}</button>`;
    const rows=[];
    const row=(name,value,note,operation='—')=>rows.push(`<tr><th scope="row">${name}</th><td>${value}</td><td>${note}</td><td>${operation}</td></tr>`);
    const build=levels=>Object.entries(E.projects).filter(([,p])=>levels.includes(p.stage)&&p.stage<=s.stage).forEach(([k])=>row(projectLabels[k],s.buildings[k],cost(E.buildCost(s,k)),btn('build',k,'Добавить',E.affordable(s,E.buildCost(s,k)))));
    if(tab==='hero') {
      row('Контур',`${s.stage+1} / 8`,'Текущий этап обработки');
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
      if(s.stage<2) {
        row('Лимит операций',`${f(s.stamina)}/100`,'Восстановление +0,4/сек; интервал 0,6 сек');
        row('Концентрация',`${f(s.calm)}/100`,'Развитие коротким анализом или фоновым анализом');
        const notes={squat:'Подготовка +0,04',run:'Подготовка +0,07',breathe:'Концентрация +0,2; после данных анализ +0,12, резерв +0,25',sweep:'Бюджет +0,4',haul:'Бюджет +0,7; подготовка +0,02',scout:'Исходные данные +2 сек; сырьё A +0,05'};
        for(const [k,c] of Object.entries(E.clicks))row(c.neutral,s.clicks[k],`${notes[k]}; лимит −${c.stamina}`,btn('click',k,'Выполнить',E.canClick(s,k)));
      }
      for(const [k,a] of Object.entries(E.activities).filter(([,a])=>a.stage<=s.stage)) row(activityLabels[k],s.activity===k?'Активно':'Ожидание',Object.entries(a.rates||{}).map(([r,v])=>`${labels[r]} +${f(v*60*E.speed(s))}/мин`).join('; ')||'Развитие показателя',btn('activity',k,'Назначить',s.activity!==k));
      if(s.stage>=1) {
        for(const [k,label] of Object.entries({balanced:'Базовый',swift:'Профиль A',piercing:'Профиль B',ward:'Профиль C'})) row(label,s.style===k?'Выбран':'—','Конфигурация проверки',btn('style',k,'Применить'));
        const c={gold:Math.ceil(40*1.8**s.weapon),...(s.stage>=3?{ore:Math.ceil(10*1.4**s.weapon)}:{})};
        row('Оснащение',s.weapon,cost(c),btn('weapon','','Обновить',s.weapon<(s.realm+1)*2&&E.affordable(s,c)));
      }
      if(s.stage<7) {const gate=E.stages[s.stage];row('Следующий контур',s.stage+2,`Уровень ${s.realm}/${gate.realm}; проверки ${s.wins}/${gate.wins}; ${cost(gate.cost)}${s.stage===0?`; контрольные точки ${s.storyStep}/${E.story.length}`:''}`,btn('advance','','Перейти',s.found&&s.realm>=gate.realm&&s.wins>=gate.wins&&E.affordable(s,gate.cost)&&(s.stage>0||s.storyStep>=E.story.length)));}
    }
    if(tab==='combat') {
      row('Проверка',s.wins+1,`Порог: ${f(E.enemy(s).power)}; результат: ${f(E.battlePower(s))}`,btn('fight','','Выполнить',!s.cooldown&&E.battlePower(s)>=E.enemy(s).power));
      row('Рекомендуемый профиль',{swift:'A',armored:'B',mystic:'C'}[E.enemy(s).type],'Соответствие даёт +35%');
      row('Интервал',`${Math.ceil(s.cooldown)} сек`,'Пять минут после успешной проверки');
      row('Результат',s.wins,`Бюджет +${f(30*1.8**s.wins)}; сырьё A +${(s.wins+1)*10}; компоненты +1`);
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
