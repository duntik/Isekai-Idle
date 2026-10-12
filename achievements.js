(function(root){
  'use strict';
  const fresh=()=>({earned:{},counts:{},cooldowns:{},run:{known:true,combatAttempts:0,chapter:null,entry:null,vow:null,failed:false}});
  const vows={peace:['Обет мирной дороги','Vow of a peaceful road','Завершить первую главу без боевых попыток, через помощь или дипломатию.','Finish chapter one through service or diplomacy without attempting combat.'],life:['Обет одной жизни','Vow of one life','Завершить первую главу без гибели.','Finish chapter one without dying.'],solo:['Обет самостоятельного пути','Vow of an independent path','Завершить первую главу без наставников. Общие рукописи и помощь людям разрешены.','Finish chapter one without mentors. General manuscripts and helping people are allowed.']};
  const chapter=s=>s.achievements?.run?.chapter;
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
    ['followers','Теперь учатся у тебя','Now they learn from you','Принять первых последователей.','Welcome your first followers.',s=>s.population>0,3],
    ['trust-road','Дорога доверия','Road of trust','Завершить первую главу через помощь людям, не пытаясь вступить в бой.','Finish chapter one through service without attempting combat.',s=>chapter(s)?.peaceful&&chapter(s).route==='service',0],
    ['word-road','Слово сильнее кулака','Words stronger than fists','Завершить первую главу дипломатией без боевых попыток.','Finish chapter one through diplomacy without attempting combat.',s=>chapter(s)?.peaceful&&chapter(s).route==='diplomacy',0],
    ['three-crafts','Три ремесла','Three crafts','К концу первой главы получить признание за помощь, знания и снабжение.','Earn recognition for help, study and supplies by the end of chapter one.',s=>chapter(s)?.balanced,0],
    ['method-road','Урок важнее мускулов','A lesson before muscle','Выбрать подготовку через технику и завершить первую главу с техникой второго ранга.','Choose technique preparation and finish chapter one with a rank-two technique.',s=>chapter(s)?.technique,0],
    ['kind-entry','За доброту','For kindness','Вступить в Нефритовую Рощу по поручительству спасённого Сэня.','Join Jade Grove through the rescued Sen’s sponsorship.',s=>s.stage>=2&&s.world.admission==='rescue',1],
    ['last-duty','Последний долг','The last duty','Вступить в Облачный Предел после возвращения останков ученика.','Join Cloud Reach after returning the disciple’s remains.',s=>s.stage>=2&&s.world.admission==='remains'&&did(s,'ruins:3/return-remains'),1],
    ['own-entry','Своими силами','On your own merits','Вступить через общий набор, не имея другого поручительства на момент вступления.','Join through open recruitment with no other sponsorship at the moment of entry.',s=>s.achievements.run.entry?.independent,1],
    ['school-answer','Верность школе','True to your school','Применить собственную технику второго ранга при решении школьного соперничества.','Use your school’s rank-two signature technique to resolve its rivalry.',s=>count(s,'rankedSchoolAnswers')>0,2],
    ['shared-duty','Общее дело','A shared purpose','Разрешить школьное соперничество совместным поручением.','Resolve your school rivalry through a shared duty.',s=>Object.keys(decisions(s)).some(k=>/^city:sect-.*-rival\/together$/.test(k)&&did(s,k)),2],
    ...Object.entries(vows).map(([k,v])=>['vow-'+k,v[0],v[1],v[2],v[3],s=>s.achievements.run.vow===k&&chapter(s)?.vowSuccess,0])
  ];
  const ids=new Set(definitions.map(d=>d[0]));
  function sync(s){const a=s.achievements||(s.achievements=fresh());for(const d of definitions)if(!a.earned[d[0]]&&d[5](s))a.earned[d[0]]={age:0,life:s.life};}
  function record(s,type,detail){const a=s.achievements||(s.achievements=fresh()),inc=k=>a.counts[k]=Math.min(1000000,(a.counts[k]||0)+1);
    const r=a.run;
    if(type==='fight'||type==='choice'&&detail.danger)r.combatAttempts=Math.min(1000000,r.combatAttempts+1);
    if(type==='choice'&&detail.schoolRank>=2&&detail.choice==='resolve'&&/-rival$/.test(detail.scene||''))inc('rankedSchoolAnswers');
    if(!r.chapter&&r.vow&&((r.vow==='peace'&&r.combatAttempts>0)||(r.vow==='life'&&s.world.deaths>0)||(r.vow==='solo'&&s.world.mentors.length>0)))r.failed=true;
    if(!r.chapter&&type==='advance'&&detail.stage===0){const p=s.world.director.paths[0]||{};r.chapter={route:s.chapterOneRoute,peaceful:r.known&&r.combatAttempts===0&&s.wins===0,balanced:['help','study','trade'].every(k=>p[k]>0),technique:s.chapterOneTraining==='technique'&&Object.values(s.cultivation.learned).some(t=>t.rank>=2),vowSuccess:!!r.vow&&!r.failed&&r.known&&(r.vow!=='peace'||['service','diplomacy'].includes(s.chapterOneRoute))};}
    if(type==='advance'&&detail.stage===1)r.entry={independent:s.world.admission==='gates'&&s.world.admissionRoutes.length===0};
    if(type==='technique-action')inc('techniqueUses');
    if(type==='claim-order'){if(detail.orderKind==='haul')inc('haulOrders');if(detail.orderKind==='ledger')inc('ledgerOrders');if(s.world.deaths>0)inc('recoveryOrders');}
    sync(s);
  }
  function validate(input,s){const a=fresh();if(input&&typeof input==='object'){
    a.run.known=false;const r=input.run;if(r&&typeof r==='object'){
      const validCombat=Number.isSafeInteger(r.combatAttempts)&&r.combatAttempts>=0;
      a.run.known=r.known===true&&validCombat;a.run.combatAttempts=validCombat?Math.min(1000000,r.combatAttempts):0;
      a.run.vow=Object.hasOwn(vows,r.vow)?r.vow:null;a.run.failed=r.failed===true;
      if(r.chapter&&['combat','service','diplomacy'].includes(r.chapter.route))a.run.chapter={route:r.chapter.route,peaceful:a.run.known&&r.chapter.peaceful===true,balanced:r.chapter.balanced===true,technique:r.chapter.technique===true,vowSuccess:a.run.known&&!!a.run.vow&&!a.run.failed&&r.chapter.vowSuccess===true};
      if(r.entry&&typeof r.entry.independent==='boolean')a.run.entry={independent:r.entry.independent};
    }
    for(const[id,v]of Object.entries(input.earned||{}))if(ids.has(id)&&v&&Number.isFinite(v.age)&&v.age>=0&&Number.isSafeInteger(v.life)&&v.life>=1)a.earned[id]={age:v.age,life:v.life};
    for(const k of ['techniqueUses','haulOrders','ledgerOrders','recoveryOrders','rankedSchoolAnswers']){const v=input.counts?.[k];if(Number.isSafeInteger(v)&&v>=0)a.counts[k]=Math.min(1000000,v);}
    for(const k of ['carry','practice']){const v=input.cooldowns?.[k];if(Number.isFinite(v)&&v>=0)a.cooldowns[k]=Math.min(60,v);}
  }else{a.run.known=false;a.counts.techniqueUses=Object.keys(s.cultivation.actionCooldowns||{}).length;}
    s.achievements=a;if(input===undefined)sync(s);return a;
  }
  const special=new Set(['trust-road','word-road','three-crafts','method-road','kind-entry','last-duty','own-entry','school-answer','shared-duty','vow-peace','vow-life','vow-solo']);
  const list=(s,lang='ru')=>definitions.filter(d=>d[6]<=s.stage||s.achievements?.earned[d[0]]).map(d=>({id:d[0],name:d[lang==='en'?2:1],description:d[lang==='en'?4:3],earned:!!s.achievements?.earned[d[0]],special:special.has(d[0]),age:s.achievements?.earned[d[0]]?.age||0}));
  const unlocked=(s,id)=>!!s.achievements?.earned[id];
  function upcoming(s,lang='ru'){
    const priorities=['wage',...(s.cultivation.active?['use','practice']:[]),'mentor',...(s.world.mentors.length?['method']:[]),'steady','strong','calm',...(s.storyStep>=4?['legacy']:[]),...(s.storyStep>=6?['peace']:[]),...(s.employment.order?.kind==='haul'?['heavy']:[]),...(s.employment.order?.kind==='ledger'?['ledger']:[])];
    const listNow=list(s,lang).filter(a=>!a.earned&&!a.special),ordered=[...new Set(priorities)].map(id=>listNow.find(a=>a.id===id)).filter(Boolean);
    return [...ordered,...listNow.filter(a=>!priorities.includes(a.id))].slice(0,3);
  }
  const pairs=definitions.flatMap(d=>[[d[1],d[2]],[d[3],d[4]]]);
  const canVow=s=>s.achievements.run.known&&!s.achievements.run.vow&&!s.achievements.run.chapter&&s.stage===0&&s.realm===0&&s.storyStep<=1&&s.achievements.run.combatAttempts===0&&s.world.deaths===0&&s.world.mentors.length===0&&s.body===0&&s.employment.completed===0&&Object.keys(s.cultivation.learned).length===0;
  function chooseVow(s,k){if(!Object.hasOwn(vows,k)||!canVow(s))return false;s.achievements.run.vow=k;return true;}
  const challenges=(s,lang='ru')=>Object.entries(vows).map(([id,v])=>({id,name:v[lang==='en'?1:0],description:v[lang==='en'?3:2],selected:s.achievements.run.vow===id,status:s.achievements.run.vow!==id?'available':s.achievements.run.failed?'failed':s.achievements.run.chapter?(s.achievements.run.chapter.vowSuccess?'complete':'failed'):'active',enabled:canVow(s)}));
  function challengeHint(s,lang='ru'){const en=lang==='en';if(!s.achievements.run.known)return en?'Earlier actions in this save were not tracked. Strict vows are available from your next rebirth; ordinary and provable achievements still work.':'Ранние поступки в этом сохранении не отслеживались. Строгие обеты доступны со следующего перерождения; обычные и подтверждённые достижения работают.';return en?'Optional conditions for chapter one. Choose one at the beginning of a life. Breaking it does not block play, but cannot be undone this life. Results are recorded at the chapter transition. Rewards are commemorative achievements, without power bonuses.':'Необязательные условия первой главы. Выбери один обет в начале жизни. Нарушение не блокирует игру, но необратимо на это прохождение. Итог фиксируется при переходе главы. Награда — памятное достижение без усиления характеристик.';}
  const api={fresh,sync,record,validate,list,upcoming,unlocked,pairs,canVow,chooseVow,challenges,challengeHint};root.IsekaiAchievements=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
