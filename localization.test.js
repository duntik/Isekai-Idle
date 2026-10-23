'use strict';
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict'),E=require('./engine.js');
const missing=new Set();
function check(html){for(const text of html.split(/<[^>]*>/g))if(/[А-Яа-яЁё]/.test(text))missing.add(text.trim());}
function boot(state,view='visual',language='en'){
  const elements=new Map(),handlers={},storage=new Map([['isekai-idle-v2',JSON.stringify(state)],['isekai-idle-interface',view],['isekai-idle-language',language]]);
  const element=id=>{if(!elements.has(id))elements.set(id,{textContent:'',innerHTML:'',style:{},replaceChildren(){},append(){},addEventListener(type,fn){this[type]=fn;}});return elements.get(id);};
  const context=vm.createContext({Isekai:E,document:{documentElement:{dataset:{}},querySelectorAll:()=>[],getElementById:element,addEventListener:(t,f)=>handlers[t]=f,createElement:()=>({append(){},click(){}}),createTextNode:t=>t},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},window:{addEventListener(){}},Date,Blob,URL,setTimeout:()=>0,clearTimeout(){},setInterval(){},confirm:()=>true});
  for(const path of ['npc-memory.js','causal-events.js','names.js','event-generator.js','combat.js','fate-tree.js','alchemy.js','sound.js','i18n.js','i18n-story.js','i18n-ui.js','chapter-one-locale.js','chapter-two.js','chapter-three.js','data-view.js','quotes.js','game.js'])vm.runInContext(fs.readFileSync(path,'utf8'),context);
  return {context,element,handlers,storage};
}
for(const view of ['visual','data']){
  const previewState=E.fresh();previewState.world.location='forest';previewState.world.encounter={location:'forest',index:2,id:'forest:2'};
  const previewApp=boot(previewState,view);previewApp.handlers.click({target:{closest:()=>({dataset:{tab:'world'},disabled:false})}});
  const previewHTML=previewApp.element('content').innerHTML;
  for(const label of ['Intent','Cost','Benefit','Relationships'])assert(previewHTML.includes(label),`${view} explains ${label}`);
  assert(previewHTML.includes('5 herbs'));assert(previewHTML.includes('No lethal check'));
  const state=E.fresh();state.storyStep=1;state.world.location='forest';state.world.visits.forest=1;
  state.world.map.sites=[E.world.encounters.forest.find(scene=>scene.generated&&!scene.payoff).id];
  const app=boot(state,view);app.element('open-map').click();
  check(app.element('map-canvas').innerHTML);check(app.element('map-status').textContent);
  check(app.element('map-intelligence').innerHTML);check(app.element('map-note-place').innerHTML);check(app.element('map-note-label').textContent);
  assert(app.element('map-canvas').innerHTML.includes('Dark thicket'));
}
for(const view of ['visual','data'])for(let stage=0;stage<8;stage++){
  const s=E.fresh();s.stage=stage;s.found=true;s.world.mentors=Object.keys(E.world.mentorNames);s.world.admissionRoutes=['rescue','remains','invitation'];s.world.admission=stage>=1?'invitation':null;
  s.cultivation.learned=Object.fromEntries(Object.keys(E.techniques).map(k=>[k,{rank:1,progress:0}]));s.cultivation.active='sky';
  s.employment.order={kind:'ledger',progress:60,pay:20};s.routes=stage>=4?[{remaining:100}]:[];s.buildings.market=stage>=4?1:0;
  const {context,element,handlers,storage}=boot(s,view);
  assert.equal(context.document.documentElement.lang,'en');assert.equal(context.document.title,view==='data'?'Data overview':'Isekai Idle — a new life');check(element('hero-title').innerHTML);
  for(const tab of ['hero','combat','world','roadmap',...(stage>=2?['sect']:[]),...(stage>=4?['city']:[]),...(stage>=5?['planet']:[]),...(stage>=6?['galaxy']:[]),...(stage>=7?['legacy']:[])]){handlers.click({target:{closest:()=>({dataset:{tab},disabled:false})}});check(element('content').innerHTML);check(element('navigation').innerHTML);check(element('resources').innerHTML);for(const id of ['chapter','hero-description','life','souls','day','aside-quote','aside-quote-source'])check(element(id).textContent);}
  const before=JSON.parse(storage.get('isekai-idle-v2'));handlers.click({target:{closest:()=>({dataset:{language:'ru'},disabled:false})}});assert.equal(storage.get('isekai-idle-language'),'ru');assert.equal(context.document.documentElement.lang,'ru');const after=JSON.parse(storage.get('isekai-idle-v2'));assert.deepEqual(after.cultivation,before.cultivation);assert.deepEqual(after.resources,before.resources);
}
const sample=boot(E.fresh()).context,L=sample.IsekaiLocale;
for(const view of ['visual','data'])for(const route of Object.keys(E.firstRoutes)){
  const s=E.fresh();s.found=true;s.realm=1;s.storyStep=6;s.wins=1;s.world.director.paths[0]={help:3};s.world.completed.push('city:wei-letter');
  const before=boot(s,view);for(const tab of ['hero','combat']){before.handlers.click({target:{closest:()=>({dataset:{tab},disabled:false})}});check(before.element('content').innerHTML);}
  assert(E.action(s,'story',route));const app=boot(s,view);check(app.element('content').innerHTML);for(const event of s.events)check(app.context.IsekaiLocale.text(event.text));
}
// Generated continuations retain causal text and pending-task labels in either view.
for(const view of ['visual','data'])for(const method of ['labor','study','supply','fight']){
  const s=E.fresh();s.stage=1;s.realm=3;s.body=30;s.resources.herbs=100;s.cultivation.learned.herb={rank:1,progress:0};
  const scene=E.world.encounters.forest.find(e=>e.id==='forest:generated:0:0:0:raiders');s.world.location='forest';s.world.encounter={location:'forest',id:scene.id,index:E.world.encounters.forest.indexOf(scene)};
  assert(E.action(s,'choice',method));const app=boot(s,view);app.handlers.click({target:{closest:()=>({dataset:{tab:'world'},disabled:false})}});check(app.element('content').innerHTML);
  for(const event of s.events)check(L.text(event.text));
  s.world.encounter={location:'forest',id:scene.id+':return',index:E.world.encounters.forest.findIndex(e=>e.id===scene.id+':return')};const followup=boot(s,view);followup.handlers.click({target:{closest:()=>({dataset:{tab:'world'},disabled:false})}});check(followup.element('content').innerHTML);
}
for(const view of ['visual','data']){const app=boot(E.fresh(),view,'ru');assert.equal(app.context.document.documentElement.lang,'ru');app.handlers.click({target:{closest:()=>({dataset:{language:'en'},disabled:false})}});check(app.element('chapter').textContent);check(app.element('content').innerHTML);assert.equal(app.context.document.title,view==='data'?'Data overview':'Isekai Idle — a new life');}
for(const[location,list]of Object.entries(E.world.encounters))for(let index=0;index<list.length;index++){const s=E.fresh();s.stage=1;s.world.location=location;s.world.encounter={location,index};check(L.html(sample.IsekaiDataView.render(s,'world',E)));const app=boot(s);app.handlers.click({target:{closest:()=>({dataset:{tab:'world'},disabled:false})}});check(app.element('content').innerHTML);}
for(const beat of E.story)for(const key of ['title','text','goal','button'])check(L.text(beat[key]));
for(const view of ['visual','data']){
  for(let step=0;step<=E.story.length;step++){const s=E.fresh();s.storyStep=step;check(boot(s,view).element('content').innerHTML);}
  for(const kind of Object.keys(E.orders)){const s=E.fresh();s.employment.order={kind,progress:1,pay:8};check(boot(s,view).element('content').innerHTML);}
  const s=E.fresh();s.stage=6;s.found=true;s.world.journey={destination:'city',remaining:12};s.expedition={kind:'portal',remaining:7200};
  const app=boot(s,view);for(const tab of ['world','planet','galaxy']){app.handlers.click({target:{closest:()=>({dataset:{tab},disabled:false})}});check(app.element('content').innerHTML);}
}
// Translate persisted journal entries when displayed, without mutating the save.
const logs=E.fresh();logs.stage=1;logs.found=true;logs.realm=3;for(const k of Object.keys(logs.resources))logs.resources[k]=10000;
E.action(logs,'learn-technique','sky');E.action(logs,'order','ledger');E.advance(logs,180);E.action(logs,'claim-order');E.action(logs,'fight');E.action(logs,'travel','forest');E.advance(logs,60);
logs.world.journey=null;logs.world.location='forest';logs.world.encounter={location:'forest',index:2};E.action(logs,'choice','heal');logs.world.location='city';E.action(logs,'apply-sect','rescue');logs.wins=3;E.action(logs,'advance');logs.xp=E.needed(logs);E.action(logs,'breakthrough');
for(const event of logs.events)check(L.text(event.text));
for(const path of ['engine.js','world.js','cloud.js','save-code.js','saves.js'])for(const match of fs.readFileSync(path,'utf8').matchAll(/(?:Error|message)\('([^']*)'\)/g))check(L.text(match[1]));
const index=fs.readFileSync('index.html','utf8').replace(/<script[\s\S]*?<\/script>/g,'');check(L.html(index));
if(missing.size){console.log('Untranslated text:',JSON.stringify([...missing],null,2));throw Error(`${missing.size} untranslated text fragments`);}
assert.equal(L.html('<button data-action="choice" data-value="heal">Выбрать</button>'),'<button data-action="choice" data-value="heal">Choose</button>');
// Static DOM text reverses on a language switch; editable save codes are untouched.
const nodes=[{nodeValue:'Монеты',parentElement:{tagName:'SPAN'}},{nodeValue:'код Монеты',parentElement:{tagName:'TEXTAREA'}},{nodeValue:'Монеты',parentElement:{tagName:'SPAN',closest:()=>({})}}];
sample.document.body={};sample.document.createTreeWalker=()=>{let i=0;return {nextNode:()=>nodes[i++]||null};};
L.translateDOM();assert.equal(nodes[0].nodeValue,'Coins');assert.equal(nodes[1].nodeValue,'код Монеты');L.setLanguage('ru');L.translateDOM();assert.equal(nodes[0].nodeValue,'Монеты');
assert.equal(nodes[2].nodeValue,'Монеты');
console.log('PASS: English and Russian switching, both interfaces, every chapter and encounter, static UI, persistence and unchanged progression');
