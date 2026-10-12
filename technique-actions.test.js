const assert=require('node:assert/strict');
const E=require('./engine.js');
function hero(key,place){const s=E.fresh();s.cultivation.learned[key]={rank:1,progress:0};s.cultivation.active=key;s.world.location=place;s.activity='meditate';return s;}
{
 const s=hero('stance','village');s.employment.order={kind:'haul',progress:7,pay:12,place:'village'};
 assert(E.action(s,'technique-action','stone-load'));assert.equal(s.activity,'rest');assert(s.body>0);assert.equal(s.employment.order.progress,8);
 const body=s.body;assert(!E.action(s,'technique-action','stone-load'));assert.equal(s.body,body);
 const loaded=E.validate(JSON.parse(JSON.stringify(s)));assert.equal(loaded.cultivation.actionCooldowns['stone-load'],60);
 E.advance(loaded,60);assert(E.canTechniqueAction(loaded,'stone-load'));
 loaded.world.location='forest';assert(!E.canTechniqueAction(loaded,'stone-load'));assert.equal(E.techniqueActions(loaded).length,0);
}
{
 const s=hero('herb','forest');assert(E.action(s,'technique-action','herb-listen'));assert.equal(s.resources.herbs,2);assert.equal(s.body,0);assert.equal(E.world.recognition(s,0),0);
 s.cultivation.actionCooldowns={};s.cultivation.active=null;assert(!E.canTechniqueAction(s,'herb-listen'));
 s.cultivation.active='herb';s.stamina=0;assert(!E.action(s,'technique-action','herb-listen'));assert.equal(s.resources.herbs,2);
}
{
 const s=hero('ink','ruins');s.explored=580;assert(E.action(s,'technique-action','ink-read'));assert.equal(s.explored,600);assert(s.found);assert.equal(s.realm,0);
 assert(E.techniqueActions(s,'en')[0].name.includes('Decipher'));
 s.cultivation.actionCooldowns['ink-read']=91;assert.throws(()=>E.validate(s));
}
{
 const s=hero('breath','village');assert(E.action(s,'technique-action','river-breath'));assert.equal(s.body,0);assert.equal(s.resources.qi,0);assert.equal(s.calm,.4);
 s.cultivation.actionCooldowns={};s.world.journey={destination:'forest',remaining:10};assert(!E.canTechniqueAction(s,'river-breath'));
}
{
 const s=E.fresh();s.world.mentors.push('trainer');s.resources.gold=5;s.resources.herbs=2;
 assert(E.canLearn(s,'stance'));assert(E.action(s,'learn-technique','stance'));assert(E.canActivity(s,'technique'));assert(E.action(s,'activity','technique'));E.advance(s,20);assert(s.body>0);assert(!s.found);
}
console.log('Contextual technique actions passed.');
