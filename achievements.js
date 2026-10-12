(function(root){
  'use strict';
  const fresh=()=>({earned:{},counts:{},cooldowns:{}});
  const count=(s,k)=>s.achievements?.counts[k]||0;
  const decisions=s=>s.world.director.decisions;
  const did=(s,key)=>!!decisions(s)[key];
  const definitions=[
    ['arrival','Первый очаг','First hearth','Добраться до деревни.','Reach the village.',s=>s.storyStep>=1,0],
    ['wage','Честная плата','An honest wage','Выполнить и сдать первый заказ.','Complete and turn in your first contract.',s=>s.employment.completed>=1,0],
    ['heavy','Надёжные плечи','Reliable shoulders','Сдать заказ на переноску ящиков. Открывает бережную переноску.','Turn in a hauling contract. Unlocks careful carrying.',s=>count(s,'haulOrders')>=1,0],
    ['ledger','Без единой ошибки','Not a single mistake','Сдать заказ на сверку накладных.','Turn in an invoice-checking contract.',s=>count(s,'ledgerOrders')>=1,0],
    ['regular','Своё место у очага','A place by the hearth','Сдать пять заказов.','Turn in five contracts.',s=>s.employment.completed>=5,0],
    ['steady','Уверенный шаг','A steady step','Укрепить тело до 1.','Train body to 1.',s=>s.body>=1,0],
    ['strong','Тело слушается','Your body responds','Укрепить тело до 2.','Train body to 2.',s=>s.body>=2,0],
    ['calm','Тишина внутри','Quiet within','Накопить 5 спокойствия.','Accumulate 5 calm.',s=>s.calm>=5,0],
    ['mentor','Первый наставник','First mentor','Получить наставление во встрече.','Receive teaching during an encounter.',s=>s.world.mentors.length>0,0],
    ['method','Собственный приём','Your own method','Изучить первую технику.','Learn your first technique.',s=>Object.keys(s.cultivation.learned).length>0,0],
    ['use','Знание в деле','Knowledge in action','Успешно применить особый приём техники.','Successfully use a special technique method.',s=>count(s,'techniqueUses')>=1,0],
    ['practice','От урока к привычке','From lesson to habit','Применить особые приёмы пять раз. Открывает короткую тренировку.','Use special methods five times. Unlocks a short practice session.',s=>count(s,'techniqueUses')>=5,0],
    ['versatile','Несколько путей','Several paths','Изучить три разные техники.','Learn three different techniques.',s=>Object.keys(s.cultivation.learned).length>=3,0],
    ['rank','Глубже первого урока','Beyond the first lesson','Повысить любую технику до второго ранга.','Raise any technique to rank 2.',s=>Object.values(s.cultivation.learned).some(t=>t.rank>=2),0],
    ['trail','За деревенской околицей','Beyond the village','Прибыть в лес и встретить местного жителя.','Reach the forest and meet a local resident.',s=>s.world.visits.forest>0,0],
    ['healer','Не пройти мимо','Do not walk past','Помочь вылечить Сэня лично или через Линь.','Help treat Sen yourself or through Lin.',s=>did(s,'forest:2/heal')||did(s,'forest:sen-second-chance/treat')||s.world.completed.includes('forest:sen-lin-treatment'),0],
    ['medicine','Лекарство дошло','Medicine delivered','Доставить настой Линь в деревню.','Deliver Lin’s infusion to the village.',s=>s.world.completed.includes('village:lin-delivered'),0],
    ['letter','Сдержанное слово','A promise kept','Доставить письмо Мэй Вэю.','Deliver Mei’s letter to Wei.',s=>s.world.completed.includes('city:wei-letter'),0],
    ['signs','Язык старых стен','Language of old walls','Сверить храмовые знаки по копии Вэя.','Compare the temple symbols using Wei’s copy.',s=>did(s,'ruins:wei-compare/compare'),0],
    ['legacy','Первая страница','The first page','Найти древнее наследие.','Discover the ancient legacy.',s=>s.found,0],
    ['thanks','Помощь с продолжением','Help with a continuation','Получить признание за завершённое местное поручение.','Receive recognition for a completed local task.',s=>Object.values(s.world.director.paths).some(p=>Object.values(p).some(n=>n>0)),0],
    ['peace','Победа без боя','Victory without battle','Мирно провести обоз или разрешить слух без новой драки.','Guide the caravan peacefully or resolve the rumour without another fight.',s=>['service','diplomacy'].includes(s.chapterOneRoute)||s.world.completed.includes('city:rival-rumor'),0],
    ['reconcile','Без зрителей','Without spectators','Принять извинение соперника.','Accept your rival’s apology.',s=>did(s,'city:rival-apology/accept'),0],
    ['return','Снова на ногах','Back on your feet','После гибели сдать новый заказ.','Turn in a new contract after dying.',s=>count(s,'recoveryOrders')>0,0],
    ['breakthrough','Сила стала своей','Power of your own','Совершить первый духовный прорыв.','Make your first spiritual breakthrough.',s=>s.realm>=1,0],
    ['sponsored','За тебя поручились','Someone vouched for you','Получить поручительство секты.','Receive sect sponsorship.',s=>s.world.admissionRoutes.length>0,1],
    ['disciple','Имя в списке учеников','A name on the disciple list','Вступить в секту.','Join a sect.',s=>s.stage>=2,1],
    ['library','Ответы в книгах','Answers in books','Изучить трактат в библиотеке секты.','Study a treatise in the sect library.',s=>s.study>0,2],
    ['followers','Теперь учатся у тебя','Now they learn from you','Принять первых последователей.','Welcome your first followers.',s=>s.population>0,3]
  ];
  const ids=new Set(definitions.map(d=>d[0]));
  function sync(s){const a=s.achievements||(s.achievements=fresh());for(const d of definitions)if(!a.earned[d[0]]&&d[5](s))a.earned[d[0]]={age:0,life:s.life};}
  function record(s,type,detail){const a=s.achievements||(s.achievements=fresh()),inc=k=>a.counts[k]=Math.min(1000000,(a.counts[k]||0)+1);
    if(type==='technique-action')inc('techniqueUses');
    if(type==='claim-order'){if(detail.orderKind==='haul')inc('haulOrders');if(detail.orderKind==='ledger')inc('ledgerOrders');if(s.world.deaths>0)inc('recoveryOrders');}
    sync(s);
  }
  function validate(input,s){const a=fresh();if(input&&typeof input==='object'){
    for(const[id,v]of Object.entries(input.earned||{}))if(ids.has(id)&&v&&Number.isFinite(v.age)&&v.age>=0&&Number.isSafeInteger(v.life)&&v.life>=1)a.earned[id]={age:v.age,life:v.life};
    for(const k of ['techniqueUses','haulOrders','ledgerOrders','recoveryOrders']){const v=input.counts?.[k];if(Number.isSafeInteger(v)&&v>=0)a.counts[k]=Math.min(1000000,v);}
    for(const k of ['carry','practice']){const v=input.cooldowns?.[k];if(Number.isFinite(v)&&v>=0)a.cooldowns[k]=Math.min(60,v);}
  }else{a.counts.techniqueUses=Object.keys(s.cultivation.actionCooldowns||{}).length;}
    s.achievements=a;if(input===undefined)sync(s);return a;
  }
  const list=(s,lang='ru')=>definitions.filter(d=>d[6]<=s.stage||s.achievements?.earned[d[0]]).map(d=>({id:d[0],name:d[lang==='en'?2:1],description:d[lang==='en'?4:3],earned:!!s.achievements?.earned[d[0]],age:s.achievements?.earned[d[0]]?.age||0}));
  const unlocked=(s,id)=>!!s.achievements?.earned[id];
  function upcoming(s,lang='ru'){
    const priorities=['wage',...(s.cultivation.active?['use','practice']:[]),'mentor',...(s.world.mentors.length?['method']:[]),'steady','strong','calm',...(s.storyStep>=4?['legacy']:[]),...(s.storyStep>=6?['peace']:[]),...(s.employment.order?.kind==='haul'?['heavy']:[]),...(s.employment.order?.kind==='ledger'?['ledger']:[])];
    const listNow=list(s,lang).filter(a=>!a.earned),ordered=[...new Set(priorities)].map(id=>listNow.find(a=>a.id===id)).filter(Boolean);
    return [...ordered,...listNow.filter(a=>!priorities.includes(a.id))].slice(0,3);
  }
  const pairs=definitions.flatMap(d=>[[d[1],d[2]],[d[3],d[4]]]);
  const api={fresh,sync,record,validate,list,upcoming,unlocked,pairs};root.IsekaiAchievements=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
