'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js');
const s=E.fresh();s.found=true;
assert(!E.orderAvailable(s,'sweep'));assert(!E.canOrder(s,'sweep'));
s.storyStep=1;assert(E.orderAvailable(s,'sweep'));
s.world.director.decisions['village:1/work']=1;
assert(E.clickVisible(s,'squat'));assert(E.clickVisible(s,'run'));
assert(!E.clickVisible(s,'sweep'));assert(!E.clickVisible(s,'haul'));assert(!E.activityVisible(s,'work'));
for(const kind of ['sweep','haul','ledger']){
  const state=E.fresh();state.employment.order={kind,progress:0,pay:8};
  assert.equal(E.clickVisible(state,'sweep'),kind==='sweep');
  assert.equal(E.clickVisible(state,'haul'),kind==='haul');
  assert.equal(E.activityVisible(state,'work'),kind==='ledger');
  state.stamina=0;state.clickCooldown=1;
  assert(E.clickVisible(state,'squat')); // Temporary limits disable rather than hide.
}
const ruins=E.fresh();ruins.world.location='ruins';assert(E.clickVisible(ruins,'scout'));
ruins.found=true;assert(!E.clickVisible(ruins,'scout'));
assert(!E.action(s,'order','haul'));assert(!E.action(s,'click','sweep'));assert(E.action(s,'order','sweep'));
assert(!E.action(s,'order','ledger'));assert(!E.action(s,'claim-order'));
for(let i=0;i<10;i++){E.advance(s,1);assert(E.action(s,'click','sweep'));}
assert.equal(s.activity,'rest');assert(Math.abs(s.body-.132)<1e-9);assert(s.xp>0);assert.equal(s.resources.gold,0);
assert(!E.action(s,'click','sweep'));assert(E.action(s,'claim-order'));assert.equal(s.resources.gold,8);
assert.equal(s.employment.completed,1);assert(!E.action(s,'claim-order'));assert.equal(s.resources.gold,8);
s.world.location='city';assert(!E.orderAvailable(s,'sweep'));assert(!E.orderAvailable(s,'haul'));assert(!E.orderAvailable(s,'ledger'));s.world.location='village';
s.body=1;E.advance(s,1);assert(E.action(s,'order','haul'));
s.world.location='city';assert(!E.action(s,'click','haul'));assert.equal(s.employment.order.progress,0);s.world.location='village';
for(let i=0;i<8;i++){E.advance(s,10);assert(E.action(s,'click','haul'));}
assert(Math.abs(s.body-1.308)<1e-9);s.world.location='city';assert(!E.action(s,'claim-order'));s.world.location='village';assert(E.action(s,'claim-order'));assert.equal(s.resources.gold,20);
assert(E.action(s,'order','ledger'));assert.equal(s.activity,'work');const xp=s.xp;
E.advance(s,179);assert(!E.action(s,'claim-order'));assert(s.xp>xp);assert(Math.abs(s.body-1.308)<1e-9);
const restored=E.validate(JSON.parse(JSON.stringify(s)));E.advance(restored,1);assert(E.action(restored,'claim-order'));
assert.equal(restored.resources.gold,40);assert.equal(restored.activity,'rest');assert.equal(restored.employment.completed,3);
restored.world.location='city';restored.world.director.decisions['city:0/study']=1;restored.employment.completed=5;assert.equal(E.orderPay(restored,'ledger'),27);
assert(E.action(restored,'order','ledger'));const lockedPay=restored.employment.order.pay;
restored.world.location='village';E.advance(restored,180);assert.equal(restored.employment.order.pay,lockedPay);assert.equal(restored.employment.order.progress,0);assert(!E.canClaimOrder(restored));
assert(E.action(restored,'cancel-order'));assert.equal(restored.resources.gold,40);assert.equal(restored.activity,'rest');
const old=E.fresh();old.activity='train';delete old.employment;
const migrated=E.validate(old);assert.equal(migrated.activity,'meditate');assert.deepEqual(migrated.employment,{completed:0,order:null});
const offline=E.fresh();offline.found=true;E.advance(offline,86400);assert.equal(offline.body,0);assert.equal(offline.xp,E.needed(offline));
assert.equal(offline.resources.gold,0);
console.log('PASS: active contracts, physical work interrupts meditation, offline accounting, manual claim, no duplicate pay, cancellation, rates, migration, no passive body');
