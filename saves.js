(function(root) {
  'use strict';
  function init(hooks) {
    const $=id=>document.getElementById(id), E=root.Isekai, codec=root.IsekaiSaveCode;
    const cloud=root.IsekaiCloud.create(root.IsekaiCloudConfig||{url:'',key:''});
    let revision=null,busy=false, lastBackup=0;
    const t=text=>root.IsekaiLocale?root.IsekaiLocale.text(text):text;
    const message=text=>{$('save-status').textContent=text;root.IsekaiLocale?.translateDOM();};
    const summary=s=>`Цикл ${s.life}; этап ${s.stage+1}; уровень ${s.realm}; ${Math.floor(s.age/3600)} ч развития`;
    function backups(){try{const list=JSON.parse(localStorage.getItem('isekai-idle-backups')||'[]');return Array.isArray(list)?list.slice(0,8):[];}catch{return [];}}
    function backup(reason='Автоматическая копия') {
      try {const list=backups();list.unshift({at:Date.now(),reason,state:hooks.get()});localStorage.setItem('isekai-idle-backups',JSON.stringify(list.slice(0,8)));lastBackup=Date.now();}
      catch{message('Не удалось создать резервную копию. Можно экспортировать код или файл.');}
    }
    function renderBackups(){const items=backups();$('save-backups').replaceChildren(...items.map((item,index)=>{const div=document.createElement('div');div.className='backup-row';const text=document.createElement('span');text.textContent=`${new Date(item.at).toLocaleString(root.IsekaiLocale?.locale||'ru-RU')} · ${item.reason}`;const b=document.createElement('button');b.textContent='Восстановить';b.addEventListener('click',()=>{try{replace(E.validate(items[index].state),'Резервная копия');}catch{message('Копия повреждена');}});div.append(text,b);return div;}));if(!items.length)$('save-backups').textContent='Копий пока нет.';}
    function replace(state,source){if(!confirm(t(`${source}: ${summary(state)}. Заменить текущий прогресс?`)))return false;backup('Перед заменой');hooks.set(state);revision=null;$('cloud-auto').checked=false;renderBackups();message('Данные восстановлены. Облачную отправку нужно согласовать заново.');return true;}
    async function run(fn){if(busy)return;busy=true;try{await fn();}catch(e){if(e.message==='CONFLICT'){revision=null;$('cloud-auto').checked=false;message('Конфликт: облачная копия изменена другим устройством. Загрузите её или подтвердите замену кнопкой отправки.');}else message(e.message||'Не удалось выполнить операцию');}finally{busy=false;}}
    function cloudStatus(){ $('cloud-status').textContent=!cloud.configured?'Облако ещё не подключено владельцем сайта. Код и файлы работают.':cloud.user?'Вход выполнен. Можно согласовать копии.':'Войди в один аккаунт на всех устройствах.';}
    async function upload(automatic=false){
      if(!cloud.user)throw Error('Сначала войди в аккаунт');
      if(revision===null){if(automatic)return;const remote=await cloud.read();if(remote){const state=E.validate(remote.state);if(!confirm(t(`В облаке: ${summary(state)} (${new Date(remote.updated_at).toLocaleString(root.IsekaiLocale?.locale||'ru-RU')}). Заменить этой локальной копией?`)))return;revision=remote.revision;}else revision=0;}
      const result=await cloud.write(hooks.get(),revision);revision=result.revision;message(`Облако обновлено: ${new Date(result.updated_at).toLocaleString(root.IsekaiLocale?.locale||'ru-RU')}`);
    }
    $('open-saves').addEventListener('click',()=>{renderBackups();cloudStatus();$('save-dialog').showModal();root.IsekaiLocale?.translateDOM();});
    $('close-saves').addEventListener('click',()=>$('save-dialog').close());
    $('make-code').addEventListener('click',()=>run(async()=>{$('save-code').value=await codec.encode(hooks.get());message('Код создан. Скопируй его на другое устройство.');}));
    $('copy-code').addEventListener('click',()=>run(async()=>{if(!$('save-code').value)throw Error('Сначала создай код');if(!navigator.clipboard)throw Error('Выдели код и скопируй вручную');await navigator.clipboard.writeText($('save-code').value);message('Код скопирован');}));
    $('load-code').addEventListener('click',()=>run(async()=>{replace(await codec.decode($('save-code').value,E),'Импорт кода');}));
    $('cloud-auth').addEventListener('submit',e=>{e.preventDefault();run(async()=>{await cloud.login($('cloud-email').value.trim(),$('cloud-password').value);$('cloud-password').value='';revision=null;cloudStatus();message('Вход выполнен. Сначала выбери загрузку или отправку.');});});
    $('cloud-signup').addEventListener('click',()=>run(async()=>{if(!$('cloud-auth').reportValidity())return;await cloud.signup($('cloud-email').value.trim(),$('cloud-password').value);$('cloud-password').value='';revision=null;cloudStatus();message(cloud.user?'Аккаунт создан':'Подтверди почту по письму и войди.');}));
    $('cloud-logout').addEventListener('click',()=>run(async()=>{await cloud.logout();revision=null;$('cloud-auto').checked=false;cloudStatus();message('Выход выполнен');}));
    $('cloud-upload').addEventListener('click',()=>run(()=>upload()));
    $('cloud-download').addEventListener('click',()=>run(async()=>{const remote=await cloud.read();if(!remote)throw Error('Облачного сохранения пока нет');const loaded=E.validate(remote.state);if(replace(loaded,'Облако')){revision=remote.revision;message('Облачная копия загружена. Можно включить автоотправку.');}}));
    setInterval(()=>{if(Date.now()-lastBackup>=3600000)backup();},60000);
    setInterval(()=>{if($('cloud-auto').checked&&cloud.user&&revision!==null)run(()=>upload(true));},300000);
    cloudStatus();backup();return {backup,replace};
  }
  root.IsekaiSaves={init};
})(globalThis);
