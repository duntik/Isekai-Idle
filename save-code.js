(function(root) {
  'use strict';
  const MAX = 1000000;
  function checksum(bytes) { let crc = -1; for (const b of bytes) { crc ^= b; for(let i=0;i<8;i++) crc=(crc>>>1)^((crc&1)?0xedb88320:0); } return ((crc^-1)>>>0).toString(16).padStart(8,'0'); }
  const envelope = state => ({ format:'isekai-idle', version:1, savedAt:new Date().toISOString(), state });
  function parse(text,E) { if(text.length>MAX)throw Error('Сохранение слишком большое'); const value=JSON.parse(text); return E.validate(value.format==='isekai-idle'&&value.version===1?value.state:value); }
  async function transform(bytes,kind) {
    const stream=new Blob([bytes]).stream().pipeThrough(kind==='zip'?new CompressionStream('gzip'):new DecompressionStream('gzip'));
    const reader=stream.getReader(), chunks=[]; let size=0;
    try { while(true) { const {done,value}=await reader.read(); if(done)break; size+=value.length;if(size>MAX)throw Error('Сохранение слишком большое'); chunks.push(value); } }
    catch(e){await reader.cancel().catch(()=>{});throw e;}
    const result=new Uint8Array(size);let offset=0;for(const chunk of chunks){result.set(chunk,offset);offset+=chunk.length;}return result;
  }
  async function encode(state) {
    const raw=new TextEncoder().encode(JSON.stringify(envelope(state)));if(raw.length>MAX)throw Error('Сохранение слишком большое');
    const zip=typeof CompressionStream!=='undefined';const bytes=zip?await transform(raw,'zip'):raw;
    let binary='';for(const b of bytes)binary+=String.fromCharCode(b);
    return `II2.${zip?'G':'J'}.${checksum(raw)}.${btoa(binary)}`;
  }
  async function decode(code,E) {
    const text=code.trim();if(text.length>MAX*2)throw Error('Сохранение слишком большое');if(text.startsWith('{'))return parse(text,E);
    const parts=text.replace(/\s/g,'').split('.');if(parts.length!==4||parts[0]!=='II2'||!['G','J'].includes(parts[1]))throw Error('Неверный код');
    const bytes=Uint8Array.from(atob(parts[3]),c=>c.charCodeAt(0));
    const raw=parts[1]==='G'?await transform(bytes,'unzip'):bytes;if(raw.length>MAX||checksum(raw)!==parts[2])throw Error('Код повреждён');
    return parse(new TextDecoder('utf-8',{fatal:true}).decode(raw),E);
  }
  const api={encode,decode,envelope,parse};root.IsekaiSaveCode=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
