'use strict';
const assert=require('node:assert/strict');
const E=require('./engine.js'), C=require('./save-code.js'), Cloud=require('./cloud.js');
(async()=>{
  const s=E.fresh();s.events=[{text:'Первая находка: 空 ✧',day:1}];s.stage=3;s.population=3;s.found=true;s.activity='meditate';
  const code=await C.encode(s);assert(code.startsWith('II2.G.'));assert(code.length<Buffer.from(JSON.stringify(C.envelope(s))).toString('base64').length);
  assert.deepEqual(await C.decode(code,E),s);
  assert.deepEqual(await C.decode(JSON.stringify(s),E),s);
  assert.deepEqual(await C.decode(JSON.stringify(C.envelope(s)),E),s);
  const pieces=code.split('.');pieces[2]='00000000';await assert.rejects(()=>C.decode(pieces.join('.'),E));
  const invalid=E.fresh();invalid.workers.miner=8;await assert.rejects(()=>C.decode(JSON.stringify(invalid),E));
  await assert.rejects(()=>C.decode('X'.repeat(2000001),E));
  const original=global.CompressionStream;global.CompressionStream=undefined;const plain=await C.encode(s);global.CompressionStream=original;assert(plain.startsWith('II2.J.'));assert.deepEqual(await C.decode(plain,E),s);
  let remote=null,calls=0;
  const mock=async(url,options)=>{
    calls++;const payload=options.body?JSON.parse(options.body):{};
    let data,status=200;
    if(url.includes('/token?'))data={access_token:'token',refresh_token:'refresh',expires_in:3600,user:{id:'player'}};
    else {
      assert.equal(options.headers.Authorization,'Bearer token');
      if(url.endsWith('/read_idle_save'))data=remote;
      else if(url.endsWith('/write_idle_save')) {
        if(payload.p_expected!==(remote?.revision||0)){status=409;data={code:'40001',message:'conflict'};}
        else {remote={state:payload.p_state,revision:(remote?.revision||0)+1,updated_at:new Date().toISOString()};data={revision:remote.revision,updated_at:remote.updated_at};}
      } else data={};
    }
    return {ok:status===200,json:async()=>data};
  };
  const config={url:'https://example.supabase.co',key:'public-key'};
  const first=Cloud.create(config,mock),second=Cloud.create(config,mock);
  await assert.rejects(()=>first.read());await first.login('a@example.com','password');await second.login('a@example.com','password');
  assert.equal(await first.read(),null);assert.equal((await first.write(s,0)).revision,1);
  assert.equal((await second.read()).revision,1);assert.equal((await first.write(s,1)).revision,2);
  await assert.rejects(()=>second.write(s,1),/CONFLICT/);assert.equal(remote.revision,2);
  await first.logout();assert.equal(first.user,null);await assert.rejects(()=>first.write(s,2));
  const count=calls;await assert.rejects(()=>Cloud.create({url:'',key:''},mock).login('a','b'));assert.equal(calls,count);
  const elements=new Map(),local=new Map();
  global.document={getElementById:id=>{if(!elements.has(id))elements.set(id,{textContent:'',value:'',checked:false,addEventListener(){},replaceChildren(){},append(){}});return elements.get(id);},createElement:()=>({append(){},addEventListener(){}})};
  global.localStorage={getItem:k=>local.get(k)||null,setItem:(k,v)=>local.set(k,v)};
  let current=E.fresh();global.confirm=()=>true;
  const interval=global.setInterval;global.setInterval=()=>0;
  require('./saves.js');
  const manager=global.IsekaiSaves.init({get:()=>structuredClone(current),set:value=>current=value});
  global.setInterval=interval;
  for(let i=0;i<10;i++)manager.backup('test');
  assert.equal(JSON.parse(local.get('isekai-idle-backups')).length,8);
  const prior=structuredClone(current);assert(manager.replace(s,'test'));assert.equal(current.stage,3);
  assert.deepEqual(JSON.parse(local.get('isekai-idle-backups'))[0].state,prior);
  global.confirm=()=>false;assert.equal(manager.replace(E.fresh(),'test'),false);assert.equal(current.stage,3);
  console.log('PASS: gzip/plain codes, Unicode, JSON compatibility, corruption checks, limits, authentication, revision conflicts, logout, unconfigured cloud');
})().catch(e=>{console.error(e);process.exitCode=1;});
