(function(root) {
  'use strict';
  function create(config,fetcher=fetch) {
    const configured=!!config.url&&!!config.key;
    if(config.url&&!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.url))throw Error('Неверный адрес Supabase');
    let session=null;
    async function request(path,body,authenticated=false) {
      if(!configured)throw Error('Облако ещё не подключено владельцем сайта');
      if(authenticated) {if(!session)throw Error('Сначала войди в аккаунт');if(Date.now()/1000>=session.expires_at-60)await refresh();}
      const response=await fetcher(config.url+path,{method:body===undefined?'GET':'POST',headers:{apikey:config.key,'Content-Type':'application/json',...(authenticated?{Authorization:`Bearer ${session.access_token}`}:{})},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(15000)});
      const data=await response.json().catch(()=>null);if(!response.ok){if(data?.code==='40001')throw Error('CONFLICT');throw Error(data?.msg||data?.message||data?.error_description||'Ошибка соединения с облаком');}return data;
    }
    const accept=data=>{if(!data?.access_token||!data?.refresh_token||!data?.user?.id)throw Error('Проверь почту и подтверди регистрацию, затем войди');session={...data,expires_at:data.expires_at||Date.now()/1000+data.expires_in};return session.user;};
    async function refresh(){try{accept(await request('/auth/v1/token?grant_type=refresh_token',{refresh_token:session.refresh_token}));}catch(e){session=null;throw e;}}
    return {configured,get user(){return session?.user||null;},async login(email,password){return accept(await request('/auth/v1/token?grant_type=password',{email,password}));},async signup(email,password){const data=await request('/auth/v1/signup',{email,password});if(data?.access_token)return accept(data);return null;},async logout(){try{if(session)await request('/auth/v1/logout',{},true);}finally{session=null;}},async read(){return request('/rest/v1/rpc/read_idle_save',{},true);},async write(state,revision){return request('/rest/v1/rpc/write_idle_save',{p_state:state,p_expected:revision},true);} };
  }
  root.IsekaiCloud={create};if(typeof module!=='undefined'&&module.exports)module.exports=root.IsekaiCloud;
})(globalThis);
