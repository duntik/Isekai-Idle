const assert=require('node:assert/strict');
const E=require('./engine.js'),W=require('./world.js');
const s=E.fresh();s.resources.herbs=30;s.body=2;s.calm=3;
function meet(id,choice){const place=id.split(':')[0],scene=W.encounters[place].find(e=>e.id===id);s.world.location=place;s.world.journey=null;assert(W.eligible(s,scene),id);s.world.encounter={location:place,index:W.encounters[place].indexOf(scene),id};assert(E.action(s,'choice',choice),choice);assert(!W.eligible(s,scene),`${id} cannot pay twice`);}
assert(!W.eligible(s,W.encounters.forest.find(e=>e.id==='forest:lin-leaves')));
assert(!W.eligible(s,W.encounters.city.find(e=>e.id==='city:wei-margin')));
// Meet mentors naturally, then pursue all threads on the same save: no exclusive class.
s.world.encounter={location:'village',index:0,id:'village:0'};assert(E.action(s,'choice','help'));
meet('village:ren-load','lift');meet('village:ren-balance','carry');meet('village:ren-route','supplies');
s.world.location='forest';s.world.encounter={location:'forest',index:0,id:'forest:0'};assert(E.action(s,'choice','learn'));
meet('forest:lin-leaves','identify');meet('forest:lin-clinic','prepare');
assert(W.eligible(s,W.encounters.village.find(e=>e.id==='village:lin-delivered')));
meet('village:lin-delivered','herbs');
s.world.location='city';s.world.encounter={location:'city',index:0,id:'city:0'};s.resources.gold+=10;assert(E.action(s,'choice','study'));
meet('city:wei-margin','copy');meet('ruins:wei-compare','compare');meet('city:wei-return','study');
assert.deepEqual(W.developmentPaths(s).map(p=>p.progress),[3,3,3]);
assert.equal(s.resources.qi,0,'ordinary lessons do not create spiritual energy');
assert.deepEqual(E.validate(JSON.parse(JSON.stringify(s))),s);
const fresh=E.fresh();fresh.storyStep=1;assert(E.action(fresh,'encounter'));assert.equal(W.current(fresh).id,'village:0');
assert(W.developmentPaths(fresh,'en').every(p=>!/[А-Яа-яЁё]/.test(p.name+p.description+p.next)));
for(let seed=1;seed<=40;seed++){
  const opening=E.fresh();opening.storyStep=1;opening.world.seed=seed;
  E.action(opening,'encounter');assert.equal(W.current(opening).id,'village:0');E.action(opening,'choice','help');
  let taught=false;
  for(let offers=0;offers<12&&!taught;offers++){
    opening.world.encounterCooldown=0;E.action(opening,'encounter');const scene=W.current(opening);
    const c=scene.choices.find(c=>c.mentor==='trainer')||scene.choices.find(c=>W.canChoice(opening,c,E));
    E.action(opening,'choice',c.id);taught=opening.world.mentors.includes('trainer');
  }
  assert(taught,`seed ${seed} must offer a practical mentor despite distracting scenes`);
}
console.log('PASS: three causal local paths, mixed development, save persistence, introductions and ordinary rewards');
