'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),W=E.world;
function put(s,scene){const location=scene.id.split(':')[0];s.world.location=location;s.world.journey=null;s.world.encounter={location,index:W.encounters[location].indexOf(scene),id:scene.id};}
function explain(s,scene,c,lang='en'){const before=JSON.stringify(s),result=E.choiceExplanation(s,scene,c,lang);assert.equal(JSON.stringify(s),before,'preview must not mutate state or RNG: '+scene.id+'/'+c.id);return result;}
let count=0;
for(const scene of Object.values(W.encounters).flat())for(const c of scene.choices){
  for(const rich of [false,true]){
    const s=E.fresh();if(rich){s.body=100;s.realm=5;s.calm=100;s.found=true;s.stamina=200;for(const k of Object.keys(s.resources))s.resources[k]=100000;for(const k of Object.keys(E.techniques))s.cultivation.learned[k]={rank:3,progress:0};}
    put(s,scene);
    for(const lang of ['ru','en']){
      const p=explain(s,scene,c,lang);assert.equal(p.available,W.canChoice(s,c,E),'availability agrees with actual action');
      for(const key of ['intent','cost','risk','benefit','relationship','requirement'])assert.equal(typeof p[key],'string',scene.id+'/'+c.id+' '+key);
      assert(p.intent.trim(),scene.id+'/'+c.id+' intention');assert(p.risk.trim(),scene.id+'/'+c.id+' risk');
      if(lang==='en')assert(!/[А-Яа-яЁё]/.test(Object.values(p).filter(v=>typeof v==='string').join(' ')),'native English '+scene.id+'/'+c.id);
    }
  }count++;
}
const find=id=>Object.values(W.encounters).flat().find(e=>e.id===id);
const low=E.fresh(),dangerScene=find('forest:1'),fight=dangerScene.choices.find(c=>c.danger);put(low,dangerScene);
const risk=explain(low,dangerScene,fight);assert(/death|die|killed/i.test(risk.risk));assert(/50|half/i.test(risk.risk),'death penalty explained');
assert(E.action(low,'choice',fight.id));assert.equal(low.world.deaths,1);assert.equal(low.body,0,'failed combat earns no body');
const tradeScene=find('village:2'),trade=tradeScene.choices.find(c=>c.cost),poor=E.fresh();put(poor,tradeScene);
const blocked=explain(poor,tradeScene,trade);assert.equal(blocked.available,false);assert(blocked.requirement.trim(),'missing resources explained');
const before=JSON.stringify(poor);assert(!E.action(poor,'choice',trade.id));assert.equal(JSON.stringify(poor),before,'blocked choice changes nothing');
const journey=E.fresh();put(journey,find('village:0'));journey.world.journey={destination:'forest',remaining:10};
assert.equal(explain(journey,find('village:0'),find('village:0').choices[0]).available,false);
console.log('PASS: '+count+' choice previews in both languages, read-only rendering, engine availability, death and resource blockers');
