'use strict';
const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const E = require('./engine.js');
for (let stage = 0; stage < 8; stage++) {
  const state = E.fresh(); state.stage = stage; state.found = stage > 0;
  const elements = new Map(), handlers = {};
  const element = id => { if (!elements.has(id)) elements.set(id, { textContent: '', innerHTML: '', style: {}, replaceChildren(){}, append(){}, addEventListener(t,f){this[t]=f;} }); return elements.get(id); };
  let stored = JSON.stringify(state);
  const context = { Isekai:E, document:{ getElementById:element, addEventListener:(t,f)=>handlers[t]=f, createElement:()=>({append(){},click(){}}), createTextNode:t=>t }, localStorage:{getItem:()=>stored,setItem:(k,v)=>stored=v}, window:{addEventListener(){}}, Date, Blob, URL, setTimeout:()=>0, clearTimeout(){}, setInterval(){}, confirm:()=>true };
  vm.runInNewContext(fs.readFileSync('game.js','utf8'), context);
  assert(element('content').innerHTML.includes(E.stages[stage].name));
  const tabs = ['hero','combat','roadmap',...(stage>=2?['sect']:[]),...(stage>=4?['city']:[]),...(stage>=5?['planet']:[]),...(stage>=6?['galaxy']:[]),...(stage>=7?['legacy']:[])];
  for (const tab of tabs) { handlers.click({target:{closest:()=>({dataset:{tab},disabled:false})}}); assert(element('content').innerHTML.length > 100); assert(!element('content').innerHTML.includes('NaN')); }
  E.validate(JSON.parse(stored));
}
console.log('PASS: UI startup, all unlocked chapter panels, save serialization');
