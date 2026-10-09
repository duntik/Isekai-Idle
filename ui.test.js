'use strict';
const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const E = require('./engine.js');
const D = require('./data-view.js');
const visualControls = new Map();
for (const view of ['visual', 'data']) {
for (let stage = 0; stage < 8; stage++) {
  const state = E.fresh(); state.stage = stage; state.found = stage > 0;
  const elements = new Map(), handlers = {};
  const element = id => { if (!elements.has(id)) elements.set(id, { textContent: '', innerHTML: '', style: {}, replaceChildren(){}, append(){}, addEventListener(t,f){this[t]=f;} }); return elements.get(id); };
  let stored = JSON.stringify(state);
  let preference = view;
  const context = { Isekai:E, IsekaiDataView:D, document:{documentElement:{dataset:{}},querySelectorAll:()=>[], getElementById:element, addEventListener:(t,f)=>handlers[t]=f, createElement:()=>({append(){},click(){}}), createTextNode:t=>t }, localStorage:{getItem:k=>k==='isekai-idle-interface'?preference:stored,setItem:(k,v)=>{if(k==='isekai-idle-interface') preference=v;else stored=v;}}, window:{addEventListener(){}}, Date, Blob, URL, setTimeout:()=>0, clearTimeout(){}, setInterval(){}, confirm:()=>true };
  vm.runInNewContext(fs.readFileSync('game.js','utf8'), context);
  assert(element('content').innerHTML.includes(view==='data'?'Показатели и операции':E.stages[stage].name));
  assert.equal(context.document.documentElement.dataset.interface,view);
  assert.equal(context.document.title,view==='data'?'Сводные данные':'Isekai Idle — новая жизнь');
  const tabs = ['hero','combat','world','roadmap',...(stage>=2?['sect']:[]),...(stage>=4?['city']:[]),...(stage>=5?['planet']:[]),...(stage>=6?['galaxy']:[]),...(stage>=7?['legacy']:[])];
  for (const tab of tabs) {
    handlers.click({target:{closest:()=>({dataset:{tab},disabled:false})}});
    const html=element('content').innerHTML;
    assert(html.length > 100); assert(!html.includes('NaN'));
    const controls=[...html.matchAll(/data-action="([^"]+)" data-value="([^"]*)"([^>]*)/g)].map(m=>`${m[1]}:${m[2]}:${m[3].includes('disabled')}`).sort();
    if(view==='visual') visualControls.set(`${stage}:${tab}`,controls);
    else {assert(!/секта|герой|галактик|перерод|монет|духовн|Isekai/i.test(html));assert.deepEqual(controls,visualControls.get(`${stage}:${tab}`));}
  }
  const before=JSON.parse(stored);
  handlers.click({target:{closest:()=>({dataset:{view:view==='data'?'visual':'data'},disabled:false})}});
  assert.equal(preference,view==='data'?'visual':'data');
  assert.equal(context.document.documentElement.dataset.interface,preference);
  const after=JSON.parse(stored);assert.deepEqual(after.resources,before.resources);assert.equal(after.stage,before.stage);
  E.validate(JSON.parse(stored));
}
}
console.log('PASS: both interfaces across all chapters, neutral labels, title, switching, preference persistence, unchanged progression');
