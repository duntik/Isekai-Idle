'use strict';
const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const E = require('./engine.js');
const D = require('./data-view.js');
const Q = require('./quotes.js');
assert.equal(Q.catalog.length,240);
assert.equal(new Set(Q.catalog.map(q=>q.ru)).size,240);
assert.equal(new Set(Q.catalog.map(q=>q.en)).size,240);
const quoteState=E.fresh(),rotator=Q.createRotator(()=>0),seed=quoteState.world.seed;
const firstQuote=rotator.get(quoteState,0);
assert.equal(rotator.get(quoteState,29999).id,firstQuote.id);
assert.equal(rotator.get(quoteState,29999,'en').text,Q.catalog.find(q=>q.id===firstQuote.id).en);
const seenQuotes=new Set([firstQuote.id]);
const pool=Q.catalog.filter(q=>q.min<=0&&q.max>=0);
for(let i=1;i<pool.length;i++){const q=rotator.get(quoteState,i*30000);assert(!seenQuotes.has(q.id));seenQuotes.add(q.id);}
quoteState.stage=7;
const lateQuote=rotator.get(quoteState,pool.length*30000);
assert(Q.catalog.some(q=>q.id===lateQuote.id&&q.min<=7&&q.max>=7));
assert.equal(quoteState.world.seed,seed);
assert.deepEqual(D.labels,E.names);
const visualControls = new Map();
for (const view of ['visual', 'data']) {
for (let stage = 0; stage < 8; stage++) {
  const state = E.fresh(); state.stage = stage; state.found = stage > 0;
  if(stage===1)state.employment.order={kind:'ledger',progress:180,pay:20};
  if(stage===1){state.cultivation.learned.stance={rank:1,progress:0};state.cultivation.active='stance';}
  if(stage===1){state.achievements.counts.techniqueUses=5;E.achievements.sync(state);}
  if(stage===2)state.employment.order={kind:'sweep',progress:3,pay:8};
  const elements = new Map(), handlers = {};
  const element = id => { if (!elements.has(id)) elements.set(id, { textContent: '', innerHTML: '', style: {}, replaceChildren(){}, append(){}, addEventListener(t,f){this[t]=f;} }); return elements.get(id); };
  let stored = JSON.stringify(state);
  let preference = view;
  let intervalRender;
  const context = { Isekai:E, IsekaiDataView:D, IsekaiQuotes:Q, IsekaiNames:require('./names.js'), document:{documentElement:{dataset:{}},querySelectorAll:()=>[], getElementById:element, addEventListener:(t,f)=>handlers[t]=f, createElement:()=>({append(){},click(){}}), createTextNode:t=>t }, localStorage:{getItem:k=>k==='isekai-idle-interface'?preference:stored,setItem:(k,v)=>{if(k==='isekai-idle-interface') preference=v;else stored=v;}}, window:{addEventListener(){}}, Date, Blob, URL, setTimeout:()=>0, clearTimeout(){}, setInterval(fn,delay){if(delay===1000)intervalRender=fn;}, confirm:()=>true };
  vm.runInNewContext(fs.readFileSync('game.js','utf8'), context);
  if(view==='visual'&&stage===0){
    const content=element('content'),oldDetail={open:true},newDetail={open:false};
    let restoredSummary=false,restoredButton=false,detailReads=0,summaryReads=0;
    const oldSummary={},newSummary={focus(options){restoredSummary=options.preventScroll;}};
    content.querySelectorAll=selector=>selector==='details'?[detailReads++%2===0?oldDetail:newDetail]:selector==='details summary'?[summaryReads++%2===0?oldSummary:newSummary]:[];
    context.document.activeElement=oldSummary;
    intervalRender();assert.equal(newDetail.open,true);assert.equal(restoredSummary,true);
    const oldButton={dataset:{action:'click',value:'squat'}},newButton={dataset:{action:'click',value:'squat'},focus(options){restoredButton=options.preventScroll;}};
    content.contains=node=>node===oldButton;
    content.querySelectorAll=selector=>selector==='button'?[newButton]:[];
    context.document.activeElement=oldButton;
    intervalRender();assert.equal(restoredButton,true);
    content.querySelectorAll=()=>[];content.contains=()=>false;context.document.activeElement=null;
  }
  assert(element('navigation').innerHTML.includes('data-tab="world"'));
  assert(element('hero-title').innerHTML.includes(E.heroHeading(state).accent));
  assert(element('chapter').textContent.includes(E.stages[stage].name.toUpperCase()));
  assert(element('content').innerHTML.includes(view==='data'?'Показатели и действия':'data-action="breakthrough"'));
  assert.equal(context.document.documentElement.dataset.interface,view);
  assert.equal(context.document.title,view==='data'?'Сводные данные':'Isekai Idle — новая жизнь');
  element('open-map').click();
  const mapHTML=element('map-canvas').innerHTML;
  assert(mapHTML.includes('data-map-node="village"'));
  if(stage===0)assert(!mapHTML.includes('data-map-node="city"'));
  assert(!mapHTML.includes('NaN'));assert(!mapHTML.includes('undefined'));
  assert(mapHTML.includes('class="map-icon"'));
  assert(element('map-intelligence').innerHTML.includes('Дневник исследователя'));
  if(stage===0){
    element('map-note-text').value='Мой план <img src=x onerror=alert(1)>';
    element('map-note-form').submit({preventDefault(){}});
    assert.equal(JSON.parse(stored).atlas.notes.village,'Мой план <img src=x onerror=alert(1)>');
    assert(!element('map-canvas').innerHTML.includes('<img src=x'));
    element('map-note-text').value='Несохранённый черновик';element('map-filter').click();
    assert.equal(element('map-note-text').value,'Несохранённый черновик');element('map-filter').click();
  }
  element('map-zoom-in').click();
  assert.equal(element('map-zoom-level').textContent,'115%');
  assert.equal(element('map-canvas').style.transform,'scale(1.15)');
  element('map-zoom-out').click();
  assert.equal(element('map-zoom-level').textContent,'100%');
  for(let i=0;i<20;i++)element('map-zoom-out').click();
  assert.equal(element('map-zoom-level').textContent,'45%');
  for(let i=0;i<20;i++)element('map-zoom-in').click();
  assert.equal(element('map-zoom-level').textContent,'160%');
  element('map-fit').click();
  assert(parseFloat(element('map-stage').style.width)>0);
  element('map-center').click();
  assert(element('map-viewport').scrollLeft>=0);
  const tabs = ['hero','combat','world','roadmap',...(stage>=2?['sect']:[]),...(stage>=4?['city']:[]),...(stage>=5?['planet']:[]),...(stage>=6?['galaxy']:[]),...(stage>=7?['legacy']:[])];
  for (const tab of tabs) {
    handlers.click({target:{closest:()=>({dataset:{tab},disabled:false})}});
    const html=element('content').innerHTML;
    if(stage===1&&['hero','world'].includes(tab))assert(html.includes('data-action="technique-action" data-value="stone-load"'));
    if(stage===1&&tab==='hero')assert(html.includes('data-action="achievement-action" data-value="practice"'));
    if(tab==='roadmap'){for(const future of E.stages.slice(stage+2))assert(!html.includes(future.name));assert(html.includes(E.stages[Math.min(7,stage+1)].name));}
    assert(html.length > 100); assert(!html.includes('NaN'));
    const controls=[...html.matchAll(/data-action="([^"]+)" data-value="([^"]*)"([^>]*)/g)].map(m=>`${m[1]}:${m[2]}:${m[3].includes('disabled')}`).sort();
    if(view==='visual') visualControls.set(`${stage}:${tab}`,controls);
    else {assert(!html.includes('data-value="undefined"'));assert.deepEqual(controls,visualControls.get(`${stage}:${tab}`));if(tab==='world')assert(html.includes(E.world.locations[state.world.location].name));if(tab==='hero')assert(html.includes(E.clicks.squat.name));}
  }
  const before=JSON.parse(stored);
  handlers.click({target:{closest:()=>({dataset:{view:view==='data'?'visual':'data'},disabled:false})}});
  assert.equal(preference,view==='data'?'visual':'data');
  assert.equal(context.document.documentElement.dataset.interface,preference);
  const after=JSON.parse(stored);assert.deepEqual(after.resources,before.resources);assert.equal(after.stage,before.stage);
  E.validate(JSON.parse(stored));
  assert.equal(element('identity-panel').hidden,false);
  const draft='Рэн Хосино';element('player-name-input').value=draft;
  handlers.click({target:{closest:()=>({dataset:{nameStyle:'japanese'},disabled:false})}});assert.equal(element('player-name-input').value,draft);
  handlers.click({target:{closest:()=>({dataset:{namePick:'0'},disabled:false})}});assert(require('./names.js').normalize(element('player-name-input').value));
  element('player-name-input').value='<script>';element('identity-form').submit({preventDefault(){}});assert.equal(element('identity-panel').hidden,false);
  element('player-name-input').value=draft;element('identity-form').submit({preventDefault(){}});assert.equal(element('identity-panel').hidden,true);assert.equal(element('player-name').textContent,draft);assert.equal(JSON.parse(stored).playerName,draft);
}
}
console.log('PASS: both interfaces across all chapters, neutral labels, title, switching, preference persistence, unchanged progression');
