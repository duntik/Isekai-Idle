'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),W=E.world;
const travel=(s,where)=>{if(s.world.location!==where){assert(E.action(s,'travel',where));E.advance(s,W.locations[where].time);}};
function encounter(s,id,choice){const location=id.split(':')[0];travel(s,location);E.advance(s,s.world.encounterCooldown);s.world.encounter={location,id,index:W.encounters[location].findIndex(e=>e.id===id)};assert(E.action(s,'choice',choice));}
function prepared(){
  const s=E.fresh();assert(E.action(s,'name','Ли Юнь'));assert(E.action(s,'story'));encounter(s,'village:1','work');assert(E.action(s,'order','ledger'));E.advance(s,180);assert(E.action(s,'claim-order'));assert(E.action(s,'story'));
  while(s.body<2){E.advance(s,10);assert(E.action(s,'click','squat'));}assert(E.action(s,'story'));
  E.action(s,'activity','meditate');E.advance(s,250);assert(E.action(s,'story'));
  travel(s,'ruins');assert(E.action(s,'activity','explore'));E.advance(s,600);assert(s.found);assert(E.action(s,'story'));
  assert(E.action(s,'activity','meditate'));E.advance(s,1201);assert(E.action(s,'breakthrough'));travel(s,'village');assert(E.action(s,'story'));return s;
}
// Each finale is playable from a genuine fresh state without free resources.
for(const route of ['combat','service','diplomacy']){
  const s=prepared();
  if(route==='combat')assert(E.action(s,'fight'));
  if(route==='service')for(let i=0;i<3;i++){const id=`village:generated:0:0:${i}:mistake`;encounter(s,id,'supply');encounter(s,id+':return','claim');}
  if(route==='diplomacy'){encounter(s,'village:2','letter');assert(W.eligible(s,W.encounters.city.find(e=>e.id==='city:wei-letter')));encounter(s,'city:wei-letter','deliver-letter');travel(s,'village');}
  assert(E.action(s,'story',route));assert.equal(s.chapterOneRoute,route);assert(E.canAdvance(s));assert.equal(s.wins,route==='combat'?1:0);
  const clone=E.validate(JSON.parse(JSON.stringify(s)));assert.equal(clone.chapterOneRoute,route);assert(E.action(clone,'advance'));assert.equal(clone.stage,1);
  assert(s.age>=1800);console.log(`Chapter one ${route}: ${Math.round(s.age/60)} minutes of preparation, ${s.wins} victories`);
}
const early=E.fresh();early.body=10;assert(!E.action(early,'fight'));early.storyStep=3;early.calm=10;early.world.location='forest';assert(!E.action(early,'story'));early.world.location='village';early.world.journey={destination:'city',remaining:90};assert(!E.action(early,'story'));
const practice=prepared();assert(E.action(practice,'learn-technique','sky'));assert(E.action(practice,'activity','technique'));const body=practice.body;E.advance(practice,E.techniqueNeeded(1));assert.equal(practice.body,body);assert(E.action(practice,'learn-technique','sky'));assert.equal(practice.cultivation.learned.sky.rank,2);
const mind=E.fresh();mind.storyStep=2;mind.found=true;mind.resources.qi=20;mind.resources.herbs=5;assert(E.action(mind,'learn-technique','sky'));assert(E.action(mind,'story'));assert.equal(mind.body,0);
mind.body=10;assert.equal(E.storyBeat(mind,2).title,'Сила начинается со знания');assert.equal(E.validate(mind).chapterOneTraining,'technique');
// An independent knowledge route can also reach the finale without body clicks.
const scholar=E.fresh();assert(E.action(scholar,'name','Лань Юэ'));assert(E.action(scholar,'story'));encounter(scholar,'village:1','work');assert(E.action(scholar,'order','ledger'));E.advance(scholar,180);assert(E.action(scholar,'claim-order'));assert(E.action(scholar,'story'));
travel(scholar,'ruins');assert(E.action(scholar,'activity','explore'));E.advance(scholar,600);assert(E.action(scholar,'activity','meditate'));E.advance(scholar,200);assert(E.action(scholar,'learn-technique','sky'));
travel(scholar,'village');assert(E.action(scholar,'story'));assert(E.action(scholar,'activity','meditate'));E.advance(scholar,250);assert(E.action(scholar,'story'));travel(scholar,'ruins');assert(E.action(scholar,'story'));assert(E.action(scholar,'activity','meditate'));E.advance(scholar,1200);assert(E.action(scholar,'breakthrough'));travel(scholar,'village');assert(E.action(scholar,'story'));
encounter(scholar,'village:2','letter');encounter(scholar,'city:wei-letter','deliver-letter');travel(scholar,'village');assert(E.action(scholar,'story','diplomacy'));assert(E.canAdvance(scholar));assert(scholar.body<2);assert.equal(scholar.clicks.squat,0);assert.equal(scholar.clicks.run,0);assert.equal(scholar.wins,0);
const letter=E.fresh();const gold=letter.resources.gold;encounter(letter,'village:2','letter');assert.equal(letter.resources.gold,gold);encounter(letter,'city:wei-letter','deliver-letter');assert(letter.resources.gold>gold);assert(!W.eligible(letter,W.encounters.city.find(e=>e.id==='city:wei-letter')));assert(!E.action(letter,'choice','deliver-letter'));
const tip=E.fresh();encounter(tip,'village:3','carpenter-map');assert.equal(tip.explored,0);
const city=E.fresh();city.world.location='city';city.world.encounter={location:'city',index:0,id:'city:0'};assert(E.action(city,'choice','job'));assert(E.action(city,'order','sweep'));assert.equal(E.orderName(city,'sweep',city.employment.order.place),'Уборка торгового двора');assert.equal(E.validate(city).employment.order.place,'city');
const old=E.fresh();delete old.chapterOneRoute;assert.equal(E.validate(old).chapterOneRoute,null);
const guided=E.fresh();guided.storyStep=1;
assert.match(E.guidance(guided,'story','','en'),/Accept a cleaning contract/);
guided.employment.order={kind:'haul',progress:3,pay:12};
assert.match(E.guidance(guided,'story','','en'),/Actions remaining: 5/);
guided.employment.order.progress=8;
assert.match(E.guidance(guided,'claim-order','','en'),/payment is not automatic/);
guided.storyStep=4;
assert.match(E.guidance(guided,'story','','en'),/Open Travel/);
guided.world.location='ruins';
assert.match(E.guidance(guided,'story','','en'),/600 sec/);
guided.found=true;guided.xp=20;guided.resources.herbs=4;
assert.match(E.guidance(guided,'breakthrough','','en'),/Understanding 20\/60/);
assert.match(E.guidance(guided,'breakthrough','','en'),/Missing: 6 herbs/);
guided.xp=60;guided.resources.herbs=10;
assert.match(E.guidance(guided,'breakthrough','','en'),/Ready/);
guided.cultivation.learned.sky={rank:1,progress:100};
assert.match(E.guidance(guided,'learn-technique','sky','en'),/Practice 100\/240/);
const snapshot=JSON.stringify(guided);
for(const action of ['story','breakthrough','learn-technique','claim-order','advance','fight','click','activity','order']){
  const hint=E.guidance(guided,action,action==='learn-technique'?'sky':action==='click'?'squat':action==='activity'?'meditate':'haul','en');
  assert(!/[А-Яа-яЁё]/.test(hint));assert(!hint.includes('undefined'));assert(!hint.includes('NaN'));
}
assert.equal(JSON.stringify(guided),snapshot);

// Prologue choices at Step 0: physical actions yield distinct rewards and stats.
for(const [choice,expectedReward,expectedBody,expectedCalm] of [
  ['shoulder',{gold:5,herbs:5},0.11,0],
  ['stones',{gold:5,herbs:8},0,1],
  ['scout',{gold:10,herbs:3,relics:1},0,0]
]){
  const p=E.fresh();
  assert(E.action(p,'story',choice));
  assert.equal(p.prologueAction,choice);
  assert.equal(p.storyStep,1);
  for(const [k,v] of Object.entries(expectedReward))assert.equal(p.resources[k],v);
  if(expectedBody)assert(p.body>=expectedBody);
  if(expectedCalm)assert.equal(p.calm,expectedCalm);
  const validated=E.validate(JSON.parse(JSON.stringify(p)));
  assert.equal(validated.prologueAction,choice);
}
const badPrologue=E.fresh();
assert(!E.action(badPrologue,'story','cheat'));

// Chapter 1 Finale at Step 7: sect choices unlocked by deeds, concluding with sect oath.
for(const [route,unlockFn] of [
  ['rescue',s=>{s.world.admissionRoutes=['rescue'];}],
  ['remains',s=>{s.world.admissionRoutes=['remains'];}],
  ['invitation',s=>{s.world.completed.push('city:wei-letter');}],
  ['gates',()=>true]
]){
  const fin=E.fresh();
  fin.realm=1;fin.found=true;fin.resources.herbs=100;fin.chapterOneRoute='service';
  fin.storyStep=7;
  unlockFn(fin);
  const beat=E.storyBeat(fin);
  assert(beat.sectChoices[route].ready(fin));
  if(route!=='gates'){
    const locked=E.fresh();
    locked.storyStep=7;
    assert(!E.action(locked,'story',route));
  }
  assert(E.action(fin,'story',route));
  assert.equal(fin.world.admission,route);
  assert.equal(fin.storyStep,8);
  assert(fin.world.admissionGiftAwarded);
  assert(E.canAdvance(fin));
  const post=E.storyBeat(fin,7);
  assert.equal(post.title,'Первая глава завершена');
  const cloneFin=E.validate(JSON.parse(JSON.stringify(fin)));
  assert(E.action(cloneFin,'advance'));
  assert.equal(cloneFin.stage,1);
}

console.log('PASS: first-chapter routes and contextual guidance for incomplete and completed objectives');
