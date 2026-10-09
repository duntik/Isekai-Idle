'use strict';
const assert=require('node:assert/strict'),N=require('./names.js'),E=require('./engine.js');
let parts=0,combinations=0;
for(const[key,pool]of Object.entries(N.styles)){
  parts+=pool.given.length+pool.family.length;combinations+=pool.given.length*pool.family.length;
  for(const language of ['ru','en']){const seen=new Set();for(let g=0;g<pool.given.length;g++)for(let f=0;f<pool.family.length;f++){const name=N.format(key,g,f,language);assert.equal(N.normalize(name),name);assert(!seen.has(name));seen.add(name);assert(language==='ru'?!/[a-z]/i.test(name):!/\p{Script=Cyrillic}/u.test(name));}const suggestions=N.suggestions(key,language,()=>0);assert.equal(suggestions.length,8);assert.equal(new Set(suggestions).size,8);}
}
assert.equal(parts,240);assert.equal(combinations,4800);
assert.equal(N.normalize('  Ли   Юнь  '),'Ли Юнь');assert.equal(N.normalize('Éloïse O’Connor'),'Éloïse O’Connor');assert.equal(N.normalize('魏 无羡'),'魏 无羡');
for(const bad of ['',null,42,'a','a'.repeat(41),'<img src=x onerror=alert(1)>','A\nB','A\u202eB','A\u0000B','-Ren'])assert.equal(N.normalize(bad),null);
const s=E.fresh(),seed=s.world.seed;assert(E.action(s,'name','Рэн Хосино'));assert.equal(s.playerName,'Рэн Хосино');assert.equal(s.world.seed,seed);assert(!E.action(s,'name','Другое имя'));
assert.equal(E.validate(JSON.parse(JSON.stringify(s))).playerName,s.playerName);
s.stage=1;s.world.location='city';s.world.encounter={location:'city',index:1};assert(E.action(s,'choice','challenge'));assert.equal(s.world.deaths,1);assert.equal(s.playerName,'Рэн Хосино');
s.stage=7;s.realm=24;assert(E.action(s,'rebirth'));assert.equal(s.playerName,'Рэн Хосино');assert.equal(s.life,2);
const old=E.fresh();old.age=3600;old.resources.gold=42;delete old.playerName;const migrated=E.validate(old);assert.equal(migrated.playerName,null);assert.equal(migrated.age,3600);assert.equal(migrated.resources.gold,42);
for(const name of ['<script>',{},'a'.repeat(41)]){const bad=E.fresh();bad.playerName=name;assert.throws(()=>E.validate(bad));}
console.log('PASS: 240 bilingual name parts, 4800 combinations, custom Unicode names, migration, death and rebirth persistence, independent randomness');
