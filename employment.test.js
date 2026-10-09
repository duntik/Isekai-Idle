'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js');
const s=E.fresh();s.found=true;
assert(!E.action(s,'order','haul'));assert(!E.action(s,'click','sweep'));assert(E.action(s,'order','sweep'));
assert(!E.action(s,'order','ledger'));assert(!E.action(s,'claim-order'));
for(let i=0;i<10;i++){E.advance(s,1);assert(E.action(s,'click','sweep'));}
assert.equal(s.activity,'meditate');assert.equal(s.body,0);assert(s.xp>0);assert.equal(s.resources.gold,0);
assert(!E.action(s,'click','sweep'));assert(E.action(s,'claim-order'));assert.equal(s.resources.gold,8);
assert.equal(s.employment.completed,1);assert(!E.action(s,'claim-order'));assert.equal(s.resources.gold,8);
s.body=1;E.advance(s,1);assert(E.action(s,'order','haul'));
for(let i=0;i<8;i++){E.advance(s,10);assert(E.action(s,'click','haul'));}
assert.equal(s.body,1);assert(E.action(s,'claim-order'));assert.equal(s.resources.gold,20);
assert(E.action(s,'order','ledger'));assert.equal(s.activity,'work');const xp=s.xp;
E.advance(s,179);assert(!E.action(s,'claim-order'));assert.equal(s.xp,xp);assert.equal(s.body,1);
const restored=E.validate(JSON.parse(JSON.stringify(s)));E.advance(restored,1);assert(E.action(restored,'claim-order'));
assert.equal(restored.resources.gold,40);assert.equal(restored.activity,'meditate');assert.equal(restored.employment.completed,3);
restored.world.location='city';restored.employment.completed=5;assert.equal(E.orderPay(restored,'ledger'),27);
assert(E.action(restored,'order','ledger'));const lockedPay=restored.employment.order.pay;
restored.world.location='village';E.advance(restored,180);assert.equal(restored.employment.order.pay,lockedPay);
assert(E.action(restored,'cancel-order'));assert.equal(restored.resources.gold,40);assert.equal(restored.activity,'meditate');
const old=E.fresh();old.activity='train';delete old.employment;
const migrated=E.validate(old);assert.equal(migrated.activity,'meditate');assert.deepEqual(migrated.employment,{completed:0,order:null});
const offline=E.fresh();offline.found=true;E.advance(offline,86400);assert.equal(offline.body,0);assert.equal(offline.xp,E.needed(offline));
assert.equal(offline.resources.gold,0);
console.log('PASS: active contracts, meditation alongside clicks, offline accounting, manual claim, no duplicate pay, cancellation, rates, migration, no passive body');
