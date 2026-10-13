(() => {
  'use strict';
  const E = Isekai, KEY = 'isekai-idle-v2', $ = id => document.getElementById(id);
  const L=typeof IsekaiLocale!=='undefined'?IsekaiLocale:null,t=value=>L?L.text(value):value,h=value=>L?L.html(value):value;
  const uiText=(ru,en)=>L?.language==='en'?en:ru;
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
  const card = (title, desc, controls, cost = '') => `<article class="card"><h3>${title}</h3><p>${desc}</p>${cost ? `<div class="cost">${cost}</div>` : ''}${controls}</article>`;
  let toastTimer;
  function toast(text) { $('toast').textContent = t(text); $('toast').style.display = 'block'; clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').style.display = 'none', 4500); }
  function save(manual = false) { try { localStorage.setItem(KEY, JSON.stringify(s)); if (manual) toast('Прогресс сохранён'); } catch { if (manual) toast('Не удалось сохранить. Используй экспорт.'); } }
  function tick() { const now = Date.now(),elapsed=Math.max(0,(now-s.last)/1000);const pending=!s.playerName&&s.age===0&&s.storyStep===0,before=elapsed>=60&&!pending&&!awaySnapshot?E.returnReport.snapshot(s):null;E.advance(s,pending?0:elapsed);s.last=now;if(before)returnSummary={before,after:E.returnReport.snapshot(s),elapsed};return pending?0:elapsed; }
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
  let mapZoom=1,mapPendingOnly=false,noteSelection=null;
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
    const edges=map.edges.map(edge=>{const from=byId.get(edge.from),to=byId.get(edge.to);return from&&to?`<line class="${to.locked?'map-blocked':E.atlas.trail(s,to.id)?'map-trail':''}" x1="${from.x+90}" y1="${from.y+40}" x2="${to.x+90}" y2="${to.y+40}"/>`:'';}).join('');
    $('map-canvas').style.width=`${width}px`;$('map-canvas').style.height=`${height}px`;
    canvas.style.transform=`scale(${mapZoom})`;canvas.style.transformOrigin='0 0';
    $('map-stage').style.width=`${width*mapZoom}px`;$('map-stage').style.height=`${height*mapZoom}px`;
    $('map-zoom-level').textContent=`${Math.round(mapZoom*100)}%`;
    $('map-center').textContent=en?'My location':'Где я';$('map-fit').textContent=en?'All routes':'Все пути';
    $('map-survey').textContent=en?'Survey surroundings':'Осмотреть окрестности';$('map-survey').disabled=!E.atlas.canSurvey(s);
    $('map-filter').textContent=mapPendingOnly?(en?'Show all landmarks':'Все ориентиры'):(en?'Unfinished and bookmarked':'Ожидающие и отмеченные');$('map-filter').setAttribute?.('aria-pressed',String(mapPendingOnly));
    const local=E.atlas.details(s,s.world.location,language),rumors=E.atlas.rumors(s,language),leads=E.world.causalLeads(s,language);
    $('map-intelligence').innerHTML=h(`<h3>${en?'Explorer’s journal':'Дневник исследователя'}</h3><p class="map-local-warning">${local.danger}</p><p>${E.atlas.hint(s,language)}</p><p>${en?'Local surveys':'Осмотры области'}: ${local.survey} · ${local.trail?(en?'Trail discovered: travel −20%':'Тропа найдена: переход −20%'):(en?'Trail: 2 surveys needed':'Для тропы: 2 осмотра')}</p>${s.stage<7?`<div class="map-horizon"><small>${en?'Next horizon':'Следующий горизонт'}</small><strong>${t(E.stages[s.stage+1].name)}</strong></div>`:''}<details><summary>${en?'Rumours':'Слухи'} (${rumors.length})</summary>${rumors.map(r=>`<p><strong>${r.confirmed?'✓':'?'}</strong> ${r.text}<br><small>${r.source}</small></p>`).join('')}</details><details open><summary>${en?'Unfinished stories':'Незавершённые истории'} (${leads.length})</summary>${leads.map(q=>`<p>${q.title}<br><small>${t(E.world.locations[q.location].name)}</small></p>`).join('')||`<p>${en?'New threads appear after encounters.':'Новые нити появятся после встреч.'}</p>`}</details>`);
    $('map-note-label').textContent=en?'Personal note · up to 600 characters':'Личная заметка · до 600 символов';$('map-note-save').textContent=en?'Save note':'Сохранить заметку';
    if(s.world.encounter){const scene=E.world.current(s);$('map-intelligence').innerHTML+=h(`<div class="map-horizon"><small>${en?'Current unresolved encounter':'Текущая незавершённая встреча'}</small><strong>${E.world.sceneText(scene,'title',language,s)}</strong><button data-tab="world" id="map-show-encounter">${en?'Return to the encounter':'Вернуться к встрече'}</button></div>`);}
    Array.from($('map-intelligence').querySelectorAll?.('details')||[]).forEach((node,index)=>{if(sidebarOpen[index]!==undefined)node.open=sidebarOpen[index];});
    $('map-note-text').setAttribute?.('aria-label',en?'Your personal note':'Твоя личная заметка');
    const noteNodes=map.nodes;if(!noteNodes.some(n=>n.id===noteSelection)){noteSelection=s.world.location;$('map-note-text').value=s.atlas.notes[noteSelection]||'';}
    if(document.activeElement!==$('map-note-place')){$('map-note-place').innerHTML=h(noteNodes.map(n=>`<option value="${n.id}">${n.name}</option>`).join(''));$('map-note-place').value=noteSelection;}
    $('map-zoom-in').setAttribute?.('aria-label',en?'Zoom in':'Приблизить');$('map-zoom-out').setAttribute?.('aria-label',en?'Zoom out':'Отдалить');
    $('map-help').textContent=en?'Drag the background to move. Use + / − or the mouse wheel to zoom. Icons mark settlements, wilderness and meetings.':'Тяни фон, чтобы перемещаться. Масштаб: + / − или колёсико мыши. Значки обозначают поселения, природу и встречи.';
    $('map-canvas').innerHTML=h(`<svg class="map-roads" width="${width}" height="${height}" aria-hidden="true">${edges}</svg><div class="map-fog-label" aria-hidden="true">${en?'Unknown lands':'Неизведанные земли'}</div>${map.nodes.filter(nodeVisible).map(node=>{
      const place=node.kind==='location',current=place&&s.world.location===node.id,action=place?'travel':'map-inspect';
      const status=current?(en?'You are here':'Ты здесь'):node.locked?(en?'Route blocked':'Путь закрыт'):node.visited?(en?'Discovered':'Исследовано'):(en?'Known route':'Известная дорога');
      const info=(node.pending?node.detail:node.kind==='site'?(en?'A recorded meeting. Return to this area to look for its continuation.':'Известное место встречи. Вернись сюда, чтобы искать продолжение.'):node.reason||node.detail)+(place?placeJournal(node.id):'');
      const icon=node.kind==='site'?'♧':({village:'⌂',city:'♜',forest:'♠',ruins:'▥',mountains:'▲','dark-forest':'♠','sealed-crypt':'▥','upper-pass':'▲','village-mill':'⚙','forest-garden':'❧','ruins-observatory':'☉','city-apothecary':'⚗','mountains-cliff':'⚔'}[node.id]||'◇');
      const trail=place&&E.atlas.trail(s,node.id),pending=node.pending?(en?' · Continuation':' · Продолжение'):'';
      const disc=s.atlas.discoveries?.[node.id]||[];
      const resourceBadges=place&&disc.length?`<span class="map-resources" title="${en?'Observed resources':'Найденные ресурсы'}">${disc.map(r=>({gold:'🪙',herbs:'🌿',qi:'✦',relics:'🔷',wood:'🪵',ore:'🪨',pills:'💊',reputation:'📜',influence:'🏛',supplies:'📦',cosmic:'✧',worlds:'🌐'}[r]||'•')).join('')}</span>`:'';
      return `<article data-map-node="${node.id}" class="map-node ${node.kind} ${node.locked?'locked':''} ${current?'current':''} ${node.pending?'pending':''} ${trail?'known-trail':''}" style="left:${node.x}px;top:${node.y}px"><strong><span class="map-icon" aria-hidden="true">${icon}</span>${node.name}${resourceBadges}</strong><small>${current?'● ':node.locked?'⊘ ':'○ '}${status}${pending}${trail?' · −20%':''}</small><details ${openNodes.includes(node.id)?'open':''}><summary>${en?'Route details':'Об этой дороге'}</summary><div>${info}</div>${place?`<p>${E.atlas.details(s,node.id,language).danger}</p><button type="button" class="location-details-btn map-node-details" data-place="${node.id}">${en?'Location details':'Подробнее о месте'}</button>`:''}</details><button data-action="${action}" data-value="${node.id}" ${s.world.journey||current||!place&&!!s.world.encounter||node.kind==='site'&&node.locked?'disabled':''}>${place?(node.locked?(en?'Approach the gate':'Подойти к проходу'):(en?'Travel here':'Отправиться')):(en?'Explore route':'Исследовать путь')}</button><div class="map-node-tools"><button data-map-note="${node.id}" title="${en?'Edit note':'Редактировать заметку'}">${s.atlas.notes[node.id]?'▤':'✎'}</button><button data-action="atlas-pin" data-value="${node.id}" aria-pressed="${s.atlas.pins.includes(node.id)}" title="${en?'Bookmark':'Отметить'}">${s.atlas.pins.includes(node.id)?'★':'☆'}</button></div></article>`;
    }).join('')}`);
    $('map-status').textContent=(en?`Known routes: ${map.nodes.length}. New encounters leave landmarks on the map.`:`Известных мест: ${map.nodes.length}. Новые встречи оставляют ориентиры на карте.`)+(s.world.encounter?(en?' Resolve your current encounter before exploring a deeper route.':' Заверши текущую встречу, прежде чем исследовать путь вглубь.'):'');
    if(focus){const target=Array.from(canvas.querySelectorAll?.(focus.summary?'summary':'button')||[]).find(node=>focus.summary?node.closest('[data-map-node]')?.dataset.mapNode===focus.node:node.dataset.action===focus.action&&node.dataset.value===focus.value);target?.focus?.({preventScroll:true});}
    viewport.scrollLeft=scroll[0];viewport.scrollTop=scroll[1];
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
    const focusData=focused&&(focused.dataset?.action!==undefined||focused.dataset?.tab!==undefined)&&((content.contains?.(focused))||(navigation.contains?.(focused)))?{action:focused.dataset?.action,value:focused.dataset?.value,tab:focused.dataset?.tab}:null;
    let nextChapterHtml='',heroStory='',heroProgress='',heroActivities='',heroEquipment='',heroTraining='',heroTechniques='',heroRoutine='';
    $('identity-panel').hidden=!!s.playerName;
    document.documentElement.dataset.naming=s.playerName?'complete':'required';
    $('player-name').textContent=s.playerName||'';
    const stage = E.stages[s.stage], next = E.stages[s.stage];
    $('chapter').textContent = `ГЛАВА ${s.stage + 1} · ${stage.name.toUpperCase()}`;
    const heading=E.heroHeading(s);
    $('hero-title').innerHTML=h(`${heading.title}<br><em>${heading.accent}</em>`);
    $('hero-description').textContent = heading.description;
    $('life').textContent = `✧ ${E.realmName(s.realm)}`; $('souls').textContent = `⚔ Сила ${fmt(E.power(s))}`; $('day').textContent = `◷ День ${Math.floor(s.age / 3600) + 1}`;
    const available = ['gold', 'herbs', ...(s.found ? ['qi', 'relics'] : []), ...(s.stage >= 2 ? ['reputation'] : []), ...(s.stage >= 3 ? ['wood', 'ore', 'pills', 'influence'] : []), ...(s.stage >= 4 ? ['supplies'] : []), ...(s.stage >= 5 ? ['cosmic', 'worlds'] : [])];
    const visible = [...new Set([...available,...Object.keys(E.names).filter(k=>s.resources[k]>0)])];
    $('resources').innerHTML = view === 'data' ? `<div class="table-scroll" tabindex="0" role="region" aria-label="Текущие показатели"><table class="data-table resource-table"><caption>Текущие показатели</caption><thead><tr><th scope="col">Показатель</th><th scope="col">Значение</th></tr></thead><tbody>${visible.map(k => `<tr><th scope="row">${IsekaiDataView.labels[k]}</th><td>${fmt(s.resources[k])}</td></tr>`).join('')}</tbody></table></div>` : visible.map(k => `<div class="resource"><div class="label">${E.names[k]}</div><div class="value">${fmt(s.resources[k])}</div></div>`).join('');
    const tabs = [['hero', 'Путь героя', 0], ['combat', 'Испытания', 0], ['world', 'Путешествия', 0], ['sect', 'Секта', 2], ['city', 'Город', 4], ['planet', 'Планета', 5], ['galaxy', 'Галактика', 6], ['legacy', 'Наследие', 7], ['roadmap', 'Горизонты', 0]];
    $('navigation').innerHTML = tabs.filter(t => t[2] <= s.stage).map(([id, title]) => `<button class="tab ${tab === id ? 'active' : ''}" data-tab="${id}" ${tab===id?'aria-current="page"':''}>${view === 'data' ? IsekaiDataView.tabs[id] : title}</button>`).join('');
    let html = '';
    if (tab === 'hero') {
      const need = E.needed(s), bc = E.breakthroughCost(s);
      heroProgress = `<div class="progress-box"><div class="section-head"><h3>${E.realmName(s.realm)}</h3><small>${fmt(s.xp)} / ${fmt(need)} понимания</small></div><progress max="${need}" value="${s.xp}" aria-label="Понимание для прорыва"></progress><p class="intro">${s.found ? `Для прорыва: ${costs(bc)}. На пределе понимание перестаёт накапливаться.` : `Исследуй руины: ${duration(s.explored)} / 10 мин до первой находки.`}</p>${button('breakthrough', '', 'Совершить прорыв', s.found && s.xp >= need && E.affordable(s, bc))}</div>`;
      heroActivities = `<h3>Одно занятие — один путь</h3><p class="intro">Занятие продолжается офлайн до 24 часов. Его можно сменить в любой момент.</p><div class="cards">${Object.entries(E.activities).filter(([k]) => E.activityVisible(s,k)).map(([k, a]) => card(a.name, a.desc + ' '+E.taskPracticeText(k,L?.language||'ru') + (['meditate', 'train', 'technique', 'laws'].includes(k) ? ` Скорость развития ×${fmt(E.speed(s))}.` : ''), button('activity', k, s.activity === k ? '● Текущее занятие' : 'Выбрать занятие', s.activity !== k))).join('')}</div>`;
      heroEquipment = `<div class="workers"><h3>Тело ${fmt(s.body)} / ${(s.realm + 1) * 10} · Техника ${fmt(s.mastery)} / ${(s.realm + 1) * 10}</h3><p class="intro">${uiText("Тело растёт от физических действий, работы и двигательных техник. Медитация развивает спокойствие, понимание и энергию, но не тело.","The body grows through physical actions, work and movement techniques. Meditation develops calm, understanding and energy, but not the body.")}</p>${s.stage >= 1 ? `<p class="intro">Стиль даёт +35% силы против подходящего противника.</p><div class="actions">${Object.entries({ balanced: 'Равновесие', swift: 'Быстрый шаг', piercing: 'Пробивающий удар', ward: 'Духовный заслон' }).map(([k, v]) => button('style', k, (s.style === k ? '● ' : '') + v)).join('')}</div>${button('weapon', '', `Улучшить оружие · ур. ${s.weapon}`, s.weapon < (s.realm + 1) * 2 && E.affordable(s, { gold: Math.ceil(40 * 1.8 ** s.weapon), ...(s.stage >= 3 ? { ore: Math.ceil(10 * 1.4 ** s.weapon) } : {}) }))}<p class="intro">Цена: ${costs({gold:Math.ceil(40 * 1.8 ** s.weapon), ...(s.stage >= 3 ? {ore:Math.ceil(10 * 1.4 ** s.weapon)} : {})})}</p>` : ''}</div>`;
      if (s.stage < 7) nextChapterHtml = `<div class="rebirth"><div class="eyebrow">БЛИЖАЙШАЯ ЦЕЛЬ · ${E.stages[s.stage + 1].name}</div><p>Ступень ${s.realm} / ${next.realm} · ${s.stage===0?'Личный прорыв и помощь обозу: победа, 3 признания или рекомендация Вэя.':`Победы ${s.wins} / ${next.wins} или признание ${E.world.recognition(s)} / ${E.world.recognitionNeeded(s)}`}</p><p>Требуется: ${costs(next.cost)}${!s.found ? ' · найти древнюю технику' : ''}</p>${button('advance', '', 'Начать следующую главу', E.canAdvance(s))}</div>`;
      if(s.stage===0) {
        const beat=E.storyBeat(s);
        const storyHtml=beat?`<article class="story-panel"><div class="eyebrow">ИСТОРИЯ · ${s.storyStep+1} / ${E.story.length}</div><h2>${beat.title}</h2><p>${beat.text}</p><div class="story-goal"><strong>Твоя цель</strong><p>${beat.goal}</p>${Object.keys(beat.reward||{}).length?`<small>Награда: ${costs(beat.reward)}</small>`:''}</div>${s.storyStep===0?`<div class="cards prologue-cards">${Object.entries(beat.prologueChoices).map(([k,c])=>card(uiText(c.name,c.enName),uiText(c.desc,c.enDesc),button('story',k,uiText(c.name,c.enName),beat.ready(s)))).join('')}</div>`:s.storyStep===6?Object.entries(E.firstRoutes).map(([k,label])=>button('story',k,label,beat.ready(s)&&E.firstRouteReady(s,k))).join(''):s.storyStep===7&&!s.world.admission?`<div class="cards sect-cards">${Object.entries(beat.sectChoices).map(([k,c])=>{const unlocked=c.ready(s);return card(uiText(c.name,c.enName),`${uiText(c.role,c.enRole)}. ${uiText(c.desc,c.enDesc)}`,button('story',k,uiText(c.name,c.enName),beat.ready(s)&&unlocked)+(unlocked?'':`<small class="sect-lock">${uiText(c.reason,c.enReason)}</small>`),uiText(`Дар: ${c.gift}`,`Gift: ${c.enGift}`));}).join('')}</div>`:button('story','',beat.button,beat.ready(s)&&(s.storyStep!==7||!s.world.admission))} <details data-panel="story-archive"><summary>Пройденные события</summary>${E.story.slice(0,s.storyStep).map((_,i)=>E.storyBeat(s,i)).map(b=>`<h3>${b.title}</h3><p>${b.text}</p>`).join('')||'<p>Твоя история только начинается.</p>'}</details></article>`:`<article class="story-panel"><div class="eyebrow">ПЕРВАЯ АРКА ЗАВЕРШЕНА</div><h2>Письмо через перевал</h2><p>${E.storyBeat(s,6).text}</p></article>`;
      heroStory=storyHtml;
      }
      heroTraining=`<section class="clicker-panel"><div class="section-head"><h3>Маленькие шаги — твоя сила</h3><small>Выносливость ${fmt(s.stamina)} / ${E.staminaMax(s)}</small></div><progress value="${s.stamina}" max="${E.staminaMax(s)}" aria-label="Выносливость"></progress><p class="intro">+${fmt(E.staminaRecovery(s))} ${t('выносливости/сек.')} ${uiText("Активные действия прерывают фоновое занятие. После них выбери занятие заново.","Manual actions interrupt your background activity. Select an activity again afterwards.")} Спокойствие: ${fmt(s.calm)} / 100.</p><div class="cards">${Object.entries(E.clicks).filter(([k])=>E.clickVisible(s,k)&&(!['sweep','haul'].includes(k)||E.canWorkOrder(s))).map(([k,c])=>card(c.name,c.desc+' '+E.taskPracticeText(k,L?.language||'ru'),button('click',k,'Выполнить',E.canClick(s,k)),`${c.stamina} выносливости · выполнено ${s.clicks[k]}`)).join('')}</div><p class="intro">Пауза между действиями — 0,6 сек. Тело и понимание сохраняют свои пределы; осмотр развалин доступен до находки.</p></section>`;
    }
    if (tab === 'world') html = worldView();
    if(tab==='hero')heroRoutine=`<section class="story-panel"><h3>${uiText('От упражнений к распорядку','From exercises to a routine')}</h3><p>${E.automationHint(s,L?.language||'ru')}</p></section><p class="intro">${!E.activityRunning(s)?'Приостановлено: смени место или занятие. ':''}${uiText("Работа требует нужного места. В пути, во время ручных действий и боя медитация и практика прерываются; они не возобновляются автоматически.","Work requires its assigned location. Travel, manual actions and combat interrupt meditation and practice; they do not resume automatically.")}</p>`;
    if(tab==='hero')heroTechniques=`<section class="workers"><h3>Техники и наставники</h3><p class="intro">Знакомства открывают разные знания. Изученные техники остаются с тобой; можно свободно менять активную. Эффект даёт одна выбранная техника. Для следующего ранга занимайся «Осваивать технику», затем оплати изучение. Физическая работа и помощь также укрепляют тело.</p><div class="cards">${Object.entries(E.techniques).filter(([k,t])=>t.available(s)||!!s.cultivation.learned[k]).map(([k,t])=>{const learned=s.cultivation.learned[k],known=t.available(s)||!!learned;return card(t.name,`${E.techniqueSource(s,k)}. ${t.desc}${t.practiceBody?uiText(" Практика этой двигательной техники также укрепляет тело и расходует выносливость."," Practicing this movement technique also strengthens the body and uses stamina."):""}`,known?button('learn-technique',k,learned?'Повысить ранг':'Изучить',E.canLearn(s,k))+(learned?button('equip-technique',k,s.cultivation.active===k?'● Активна':'Применить',s.cultivation.active!==k):''):'<small>Найди источник знаний</small>',known?`Ранг ${learned?.rank||0}/5 · ${costs(E.techniqueCost(s,k))}${learned&&learned.rank<5?` · освоение ${fmt(learned.progress)}/${E.techniqueNeeded(learned.rank)} сек`:''}`:'Не изучена');}).join('')}</div></section>`;
    if (tab === 'hero') {
      const fold=(id,title,body)=>body?`<details class="hero-fold" data-panel="${id}"><summary>${title}</summary><div class="hero-fold-body">${body}</div></details>`:'';
      const hint=E.guidance(s,s.stage===0&&E.storyBeat(s)?'story':'advance','',L?.language||'ru');
      const place=E.world.locations[s.world.location].name;
      const activity=E.activityRunning(s)?uiText('Занятие продолжается','Activity running'):uiText('Занятие приостановлено','Activity paused');
      const journey=s.world.journey?uiText('В пути: ','Travelling to ')+t(E.world.locations[s.world.journey.destination].name)+' · '+Math.ceil(s.world.journey.remaining)+' '+uiText('сек.','s'):t(place);
      const overview=`<section class="hero-overview" data-hero-section="overview"><div class="hero-status"><div><small>${uiText('Место','Location')}</small><strong>${journey}</strong></div><div><small>${activity}</small><strong>${t(E.activities[s.activity].name)}</strong></div><div><small>${uiText('Выносливость','Stamina')}</small><strong>${fmt(s.stamina)} / ${E.staminaMax(s)}</strong></div></div><div class="hero-goal"><small>${uiText('Ближайшая цель','Current goal')}</small><p>${hint||t(E.stages[s.stage].subtitle)}</p></div></section>`;
      const order=s.employment.order;
      const work=order?`<section class="hero-current-order" data-hero-section="order">${employmentView()}${E.workMastered(s,order.kind)?button('activity','work',uiText('Работать над заказом','Work on contract'),s.activity!=='work'&&E.canActivity(s,'work')):''}${!E.canWorkOrder(s)&&!s.world.journey?button('travel',order.place||'village',uiText('Вернуться к месту работы','Return to the workplace'),E.world.canTravel(s,order.place||'village')):''}</section>`:'';
      const scene=E.world.current(s);
      const meeting=scene?`<section class="hero-meeting"><strong>${E.world.sceneText(scene,'title',L?.language||'ru',s)}</strong><p>${uiText('Встреча ждёт твоего решения.','An encounter awaits your decision.')}</p><button data-tab="world">${uiText('Вернуться к встрече','Return to encounter')}</button></section>`:'';
      html=overview+work+meeting+heroStory+`<section data-hero-section="actions">${heroTraining}${heroActivities}${techniqueActionsView()}</section>`+heroProgress+heroTechniques+heroEquipment+nextChapterHtml;
      html+=fold('paths',uiText('Способы развития','Ways to grow'),developmentView());
      html+=!order?fold('work',uiText('Доступная работа','Available work'),employmentView()):'';
      html+=fold('achievements',uiText('Маленькие победы','Small victories'),achievementsView());
      html+=fold('vows',uiText('Необычные пути и обеты','Unusual paths and vows'),challengesView());
      html+=fold('reference',uiText('Распорядок и правила занятий','Routine and activity rules'),heroRoutine);

    }
    if (tab === 'combat') {
      const foe = E.enemy(s), counter = { swift: 'Быстрый шаг', armored: 'Пробивающий удар', mystic: 'Духовный заслон' };
      html = `<h2>${s.stage === 2 ? 'Турнир и соперники' : 'Испытания пути'}</h2>${s.stage===0?'<p class="intro">Первый бой: в деревне, после прорыва и перед финалом первой арки. Можно завершить арку без боя.</p>':''}<p class="intro">Соперники остаются сильными, пока ты не подготовишь тело, технику и оружие. Результат предсказуем: случайность не отнимает награды.</p><div class="rebirth"><div class="eyebrow">СЛЕДУЮЩИЙ СОПЕРНИК</div><h2>${foe.name}</h2><p>Сила соперника: <strong>${fmt(foe.power)}</strong></p><p>Твоя сила в этом бою: ${fmt(E.battlePower(s))}. Подходящий стиль: ${counter[foe.type]}.</p><p>Награда: ${fmt(30 * 1.8 ** s.wins)} монет · ${(s.wins + 1) * 10} трав · 1 осколок.</p>${button('fight', '', s.cooldown > 0 ? `Отдых: ${duration(s.cooldown)}` : 'Принять вызов', s.cooldown === 0 && E.battlePower(s) >= foe.power)}<p class="intro">Побед: ${s.wins}. После боя — 5 минут отдыха.</p></div>`;
    }
    if (tab === 'sect') {
      html = (s.world.admission?schoolView(s.world.admission):'')+`<h2>${s.stage === 2 ? 'Жизнь ученика' : 'Твоя секта'}</h2><p class="intro">${s.stage === 2 ? 'Выполняй поручения, заслуживай репутацию и получай доступ к знаниям.' : 'Распредели последователей. Алхимикам нужны травы и духовная энергия; без них производство останавливается.'}</p>`;
      html += card('Библиотека · ур. ' + s.study, 'Каждое изучение увеличивает скорость личного развития на 15%. Максимум 10.', button('study', '', 'Изучить трактат', s.study < 10 && E.affordable(s, { reputation:20*(s.study+1), gold:100*(s.study+1) })), costs({reputation:20*(s.study+1),gold:100*(s.study+1)}));
      if (s.stage >= 3) { const used = Object.values(s.workers).reduce((a, b) => a + b, 0); html += `<div class="workers"><h3>Последователи ${s.population} / ${3 + s.buildings.dorm * 3} · свободны ${s.population - used}</h3>${button('recruit', '', 'Пригласить · 100 монет, 20 трав', s.population < 3 + s.buildings.dorm * 3 && E.affordable(s, {gold:100,herbs:20}))}${Object.entries(E.jobs).map(([k, name]) => `<div class="worker"><span>${name}</span><div>${button('worker', `${k}:-1`, '−', s.workers[k] > 0)} ${s.workers[k]} ${button('worker', `${k}:1`, '+', used < s.population)}</div></div>`).join('')}<p class="intro">На работника: сад +2,4 трав/мин; лес +6 древесины/мин; шахта +3,6 руды/мин; алхимия +0,3 пилюли/мин (5 трав и 10 энергии за пилюлю); ученики +0,9 влияния/мин.</p></div>` + projects([3]); }
    }
    if (tab === 'city') html = `<h2>Город и торговля</h2><p class="intro">Производство секты снабжает город. Каждый район позволяет открыть постоянный маршрут: караван приносит 500 монет и 30 влияния каждые 30 минут.</p>${projects([4])}<div class="workers"><h3>Маршруты ${s.routes.length} / ${s.buildings.market}</h3>${button('route', '', 'Открыть маршрут · 300 монет, 30 припасов', s.routes.length < s.buildings.market && E.affordable(s,{gold:300,supplies:30}))}${s.routes.map((r,i)=>`<p class="intro">Караван ${i+1}: возвращение через ${duration(r.remaining)}</p>`).join('')}</div>`;
    if (tab === 'planet') html = `<h2>Мировая сеть</h2><p class="intro">Узлы производят эссенцию и усиливают щит. Для следующего портала нужна сила щита ${fmt(10000 * (s.resources.worlds + 1))}; сейчас ${fmt(E.power(s) + s.buildings.node * 20)}.</p>${projects([5])}<div class="rebirth"><h3>Закрепить межмировой портал</h3><p>Переход занимает 2 часа. Награда: один мир и 80 эссенции. Каждый мир производит 0,01 эссенции/сек.</p>${expedition()}${button('portal', '', 'Открыть портал · 500 энергии, 50 припасов', !s.expedition && E.power(s) + s.buildings.node * 20 >= 10000*(s.resources.worlds+1) && E.affordable(s,{qi:500,supplies:50}))}</div>`;
    if (tab === 'galaxy') html = `<h2>Звёздная экспансия</h2><p class="intro">Для освоения следующего мира нужен флот из ${s.resources.worlds + 1} кораблей. Расширяй снабжение города и строй корабли из руды и эссенции.</p>${projects([6,7])}<div class="rebirth"><h3>Колониальный поход</h3><p>Поход занимает 4 часа; основание колонии добавляет мир и 80 эссенции.</p>${expedition()}${button('colonize', '', 'Отправить флот · 60 эссенции, 100 припасов', !s.expedition && s.buildings.fleet >= s.resources.worlds+1 && E.affordable(s,{cosmic:60,supplies:100}))}</div>`;
    if (tab === 'legacy') html = `<h2>Наследие души</h2><p class="intro">Жизнь ${s.life} · Души ${s.souls} · Постоянный бонус ${s.souls * 10}%.</p><div class="rebirth"><h3>Новый круг</h3><p>После 24-й ступени можно переродиться. Все владения, ресурсы и навыки сбросятся. Останутся души: +${Math.max(1, Math.floor(s.realm/6))}, каждая ускоряет личное развитие на 10%.</p>${button('rebirth', '', 'Переродиться', s.realm >= 24)}</div>`;
    if (tab === 'roadmap') html = `<h2>Ближайший горизонт</h2><p class="intro">Тебе известна только ближайшая цель. Дальнейший путь откроется, когда ты до неё доберёшься. Поручения, знания, помощь людям и испытания позволяют заслужить признание разными способами. Личная культивация и запас ресурсов по-прежнему необходимы.</p><div class="cards">${E.stages.slice(0,s.stage+2).map((st,i)=>card(`${i < s.stage ? '✓' : i === s.stage ? '●' : '◇'} ${st.name}`, st.subtitle, `<small>${i === s.stage ? 'Текущая глава' : i < s.stage ? 'Пройдена' : 'Ближайшая цель'}</small>`)).join('')}</div>${s.stage>0&&s.stage<7?card('Признание',`Победы ${s.wins} / ${next.wins} или признание ${E.world.recognition(s)} / ${E.world.recognitionNeeded(s)}`,Object.entries(s.world.director.paths[s.stage]||{}).map(([k,n])=>`${t(E.world.pathNames[k])}: ${n}`).join(' · '),button('advance','','Перейти',E.canAdvance(s))) : ''}`;
    $('content').innerHTML = h(returnSummaryView()+(view === 'data' ? IsekaiDataView.render(s, tab, E) : html));
    $('journal').replaceChildren(...s.events.slice(0, 7).map(e => { const div = document.createElement('div'); div.className = 'event'; const small = document.createElement('small'); small.textContent = t(`ДЕНЬ ${e.day}`); div.append(small, document.createTextNode(t(e.text))); return div; }));
    for(const id of ['chapter','hero-description','life','souls','day'])$(id).textContent=t($(id).textContent);
    for(const id of ['resources','navigation'])$(id).innerHTML=h($(id).innerHTML);
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
      const replacement=buttons.find(node=>focusData.tab!==undefined?node.dataset?.tab===focusData.tab:node.dataset?.action===focusData.action&&node.dataset?.value===focusData.value);
      replacement?.focus?.({preventScroll:true});
    }
  }
  function projects(levels) { return `<div class="cards">${Object.entries(E.projects).filter(([, p])=>levels.includes(p.stage) && p.stage <= s.stage).map(([k,p])=>card(`${p.name} · ${s.buildings[k]}`,p.desc,button('build',k,'Построить',E.affordable(s,E.buildCost(s,k))),costs(E.buildCost(s,k)))).join('')}</div>`; }
  function expedition() { return s.expedition ? `<p class="intro">Экспедиция в пути: осталось ${duration(s.expedition.remaining)}. Порталы и флот используют один слот экспедиции.</p>` : ''; }
  function schoolView(k){const lang=L?.language||'ru',a=E.sects.info(s,k,lang);return a?`<article class="story-panel sect-profile"><div class="eyebrow">${a.role}</div><h3>${a.name}</h3><p>${a.teacher} · ${a.perk}</p><p><strong>${uiText('Правило школы','School rule')}:</strong> ${a.rule}</p><p>${E.sects.progress(s,k,lang)}</p></article>`:'';}
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
  function worldView() {
    const W=E.world,w=s.world,scene=W.current(s);
    let html=`<h2>Дороги другого мира</h2><p class="intro">Сейчас: ${W.locations[w.location].name}. ${w.journey?`В пути: ${W.locations[w.journey.destination].name}, осталось ${Math.ceil(w.journey.remaining)} сек.`:'Можно выбрать маршрут или поискать встречу на месте.'}</p>`;
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
    if(s.stage===1)html+=`<section class="workers"><h3>Вступление в секту</h3><p class="intro">Представительства находятся в городе Серебряного Моста. Выбери путь поступления. Затем подготовь третью ступень и запас снаряжения. Заслужи три победы или 12 признания за завершённые поручения. Можно сменить заявку до вступления.</p><div class="cards">${Object.entries(W.admissions).map(([k,a])=>card(a.name,a.text,button('apply-sect',k,w.admission===k?'Заявка выбрана':'Подать заявку',W.canApply(s,k)),k==='gates'?'Доступно без знакомства':w.admissionRoutes.includes(k)?'Поручительство получено':'Найди соответствующую встречу в лесу или храме')).join('')}</div></section>`;
    if(s.stage>=2&&w.admission)html+=`<p class="intro">Твой путь: ${W.admissions[w.admission].name}. ${W.admissions[w.admission].text}</p>`;
    return html;
  }
  function employmentView(){
    const order=s.employment.order;
    if(order)return `<section class="active-order"><div class="eyebrow">${uiText('ТВОЁ ПОРУЧЕНИЕ','YOUR CONTRACT')}</div><h3>${E.orderName(s,order.kind,order.place||'village')}</h3><p>${t(E.world.locations[order.place||'village'].name)} · ${fmt(order.progress)} / ${E.orders[order.kind].target} ${order.kind==='ledger'?uiText('сек.','s'):uiText('шагов','steps')} · ${uiText('Оплата','Payment')}: ${order.pay} ${t(E.names.gold)}</p><progress value="${order.progress}" max="${E.orders[order.kind].target}" aria-label="${uiText('Прогресс заказа','Contract progress')}"></progress><div class="actions">${button('claim-order','',uiText('Получить оплату','Collect payment'),E.canClaimOrder(s))}${button('cancel-order','',uiText('Отменить без оплаты','Cancel without payment'))}</div></section>`;
    return `<section class="workers"><p class="intro">Сначала познакомься с заказчиком. Поручения появляются после встреч; принятый заказ нужно выполнять и сдавать в указанном месте.</p><h3>Доска подработок</h3><p class="intro">${uiText("Выполнено заказов:","Completed contracts:")} ${s.employment.completed}. ${uiText("Каждые 5 заказов расценки растут на 10%, до +100%. В городе оплата нового заказа выше на 25%.","Rates increase by 10% per five contracts, up to +100%. New city contracts pay 25% more.")} ${uiText("Уборка и разгрузка требуют физической работы и прерывают медитацию. Сверка накладных занимает фоновое занятие.","Cleaning and hauling require physical work and interrupt meditation. Checking ledgers occupies your background activity.")}</p>${order?`<div class="progress-box"><h3>${E.orderName(s,order.kind,order.place||'village')}</h3><p class="intro">Выполнено ${fmt(order.progress)} / ${E.orders[order.kind].target}${order.kind==='ledger'?' сек':''} · оплата ${order.pay} монет</p><progress value="${order.progress}" max="${E.orders[order.kind].target}" aria-label="Прогресс заказа"></progress><div class="actions">${button('claim-order','','Получить оплату',E.canClaimOrder(s))}${button('cancel-order','','Отменить без оплаты')}</div><p class="intro">Отмена удаляет только прогресс текущего заказа. Кнопки уборки и разгрузки находятся в блоке активных действий.</p></div>`:''}<div class="cards">${Object.entries(E.orders).filter(([k])=>!order&&E.orderAvailable(s,k)).map(([k,o])=>card(E.orderName(s,k),o.desc,button('order',k,'Взять заказ',E.canOrder(s,k)),`${E.orderPay(s,k)} монет · тело от ${o.body}`)).join('')}</div></section>`;
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || b.disabled) return; tick();const placesBefore=E.world.knownLocations(s).length;
    if(b.dataset?.place&&b.classList?.contains?.('location-details-btn')){openLocationDialog(b.dataset.place);return;}
    if(b.id==='close-location-dialog'||b.id==='close-location-dialog-btn'){$('location-dialog')?.close?.();currentDialogPlace=null;return;}
    if(b.dataset?.mapNote){noteSelection=b.dataset.mapNote;$('map-note-place').value=noteSelection;$('map-note-text').value=s.atlas.notes[noteSelection]||'';$('map-note-text').focus?.();return;}
    if(b.id==='map-show-encounter')$('world-map-dialog').close?.();
    if(b.id==='dismiss-return-report'){returnSummary=null;render();return;}
    if(b.dataset.language&&L){L.setLanguage(b.dataset.language);applyView();refreshNames();}
    if(b.dataset.nameStyle&&N.styles[b.dataset.nameStyle]){nameStyle=b.dataset.nameStyle;refreshNames();}
    if(b.id==='random-names')refreshNames();
    if(b.dataset.namePick!==undefined&&nameOptions[Number(b.dataset.namePick)]){$('player-name-input').value=nameOptions[Number(b.dataset.namePick)];$('identity-error').textContent='';}
    if (['visual','data'].includes(b.dataset.view)) { view = b.dataset.view; try { localStorage.setItem('isekai-idle-interface',view); } catch {} applyView(); }
    if (b.dataset.tab) tab = b.dataset.tab;
    if(['travel','map-inspect'].includes(b.dataset.action)&&b.closest?.('#world-map-dialog')){tab='world';if(b.dataset.action==='travel'&&E.world.canTravel(s,b.dataset.value))$('world-map-dialog').close();}
    if(b.dataset.action==='travel'&&b.closest?.('#location-dialog')){$('location-dialog')?.close?.();currentDialogPlace=null;}
    if (b.dataset.action) { if (b.dataset.action === 'rebirth') { if (!confirm(t(view === 'data' ? 'Начать новый цикл? Показатели и объекты сбросятся. Накопленный коэффициент сохранится.' : 'Начать новую жизнь? Все ресурсы и владения сбросятся; души сохранятся.'))) return; saves?.backup('Перед новым циклом'); } if (E.action(s,b.dataset.action,b.dataset.value)) {save();if(b.dataset.action==='atlas-survey')toast(uiText('Окрестности осмотрены. Сведения и припасы обновлены.','Surroundings surveyed. Information and supplies updated.'));if(b.dataset.action==='map-inspect'){toast(s.events[0]?.text||'Условия пока не выполнены');if(s.world.encounter)$('world-map-dialog').close?.();}} else toast(b.dataset.action==='travel'?E.world.travelReason(s,b.dataset.value,L?.language||'ru')||'Условия пока не выполнены':'Условия пока не выполнены'); }
    if(b.dataset.action==='choice'&&E.world.knownLocations(s).length>placesBefore&&s.events[0]?.text.startsWith('Открыта дорога:'))toast(s.events[0].text);
    if (b.id === 'save') save(true);
    if (b.id === 'export') { const value = typeof IsekaiSaveCode !== 'undefined' ? IsekaiSaveCode.envelope(s) : s; const url = URL.createObjectURL(new Blob([JSON.stringify(value)],{type:'application/json'})); const a = document.createElement('a'); a.href = url; a.download = `${view === 'data' ? 'data-snapshot' : 'isekai-idle'}-${new Date().toISOString().slice(0,10)}.json`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000); }
    if (s.stage === 0 && !['hero','combat','world','roadmap'].includes(tab)) tab = 'hero'; render();
  });
  $('close-location-dialog')?.addEventListener('click',()=>{$('location-dialog')?.close?.();currentDialogPlace=null;});
  $('location-dialog')?.addEventListener('click',e=>{if(e.target===$('location-dialog')){$('location-dialog')?.close?.();currentDialogPlace=null;}});
  $('open-map').addEventListener('click',()=>{
    renderMap();$('world-map-dialog').showModal?.();
    centerMap();
  });
  $('map-zoom-in').addEventListener('click',()=>zoomMap(mapZoom+.15));
  $('map-zoom-out').addEventListener('click',()=>zoomMap(mapZoom-.15));
  $('map-center').addEventListener('click',centerMap);
  $('map-filter').addEventListener('click',()=>{mapPendingOnly=!mapPendingOnly;renderMap();});
  $('map-note-place').addEventListener('change',()=>{noteSelection=$('map-note-place').value;$('map-note-text').value=s.atlas.notes[noteSelection]||'';centerMap(noteSelection);});
  $('map-note-form').addEventListener('submit',e=>{e.preventDefault();if(E.action(s,'atlas-note',{id:noteSelection,text:$('map-note-text').value})){save();toast(uiText('Заметка сохранена.','Note saved.'));renderMap();}});
  $('map-fit').addEventListener('click',()=>{const m=E.world.map(s),v=$('map-viewport');zoomMap(Math.min((v.clientWidth||800)/m.width,(v.clientHeight||500)/m.height));v.scrollLeft=0;v.scrollTop=0;});
  $('map-viewport').addEventListener('wheel',e=>{e.preventDefault();const r=$('map-viewport').getBoundingClientRect();zoomMap(mapZoom*(e.deltaY<0?1.12:1/1.12),[e.clientX-r.left,e.clientY-r.top]);},{passive:false});
  let mapDrag;
  $('map-viewport').addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('button,details,.map-node'))return;const v=$('map-viewport');mapDrag={x:e.clientX,y:e.clientY,left:v.scrollLeft,top:v.scrollTop};v.setPointerCapture?.(e.pointerId);});
  $('map-viewport').addEventListener('pointermove',e=>{if(!mapDrag)return;const v=$('map-viewport');v.scrollLeft=mapDrag.left+mapDrag.x-e.clientX;v.scrollTop=mapDrag.top+mapDrag.y-e.clientY;});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])$('map-viewport').addEventListener(event,()=>{mapDrag=null;});
  $('close-map').addEventListener('click',()=>$('world-map-dialog').close?.());
  $('import').addEventListener('change', async e => { const file = e.target.files[0]; if (!file) return; try { if (file.size > 1000000) throw Error(); const text=await file.text();const loaded = typeof IsekaiSaveCode !== 'undefined' ? await IsekaiSaveCode.decode(text,E) : E.validate(JSON.parse(text)); if(saves) saves.replace(loaded,'Импорт файла'); else if (confirm(t('Заменить текущий прогресс?'))) { s = loaded; tick(); tab = 'hero'; save(); render(); } } catch { toast('Не удалось прочитать сохранение v2'); } e.target.value = ''; });
  $('identity-form').addEventListener('submit',e=>{
    e.preventDefault();
    if(!E.action(s,'name',$('player-name-input').value)){$('identity-error').textContent=t('Введи имя от 2 до 40 символов без необычных знаков.');return;}
    $('identity-error').textContent='';save();render();
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
