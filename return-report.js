(function(root){
  'use strict';
  const snapshot=s=>JSON.parse(JSON.stringify(s));
  function describe(E,before,after,elapsed,language='ru'){
    const en=language==='en',say=(ru,english)=>en?english:ru,changes=[],reasons=[],opportunities=[];
    const labels={body:['Тело','Body'],mastery:['Освоение','Mastery'],xp:['Понимание','Understanding'],calm:['Спокойствие','Calm'],stamina:['Выносливость','Stamina'],explored:['Исследование, сек','Research, sec']};
    const resources={gold:'Coins',herbs:'Herbs',qi:'Qi',relics:'Shards',wood:'Wood',ore:'Ore',pills:'Pills',reputation:'Reputation',influence:'Influence',supplies:'Supplies',cosmic:'Star essence',worlds:'Worlds'};
    const techniqueNames={sky:'Empty Sky Sutra',ink:'Ink Trace',stance:'Stone Roots',herb:'Green Vein Listening',breath:'Quiet River Breathing',sword:'Cloud Pass Sword',grove:'Jade Circle',cloud:'Returning Blade',seal:'Starless Sky Script',iron:'Iron Sinews'},techName=k=>en?techniqueNames[k]:E.techniques[k].name;
    for(const[k,value]of Object.entries(after.resources)){const delta=value-before.resources[k];if(Math.abs(delta)>1e-7)changes.push({label:en?resources[k]||k:E.names[k],delta});}
    for(const[k,label]of Object.entries(labels)){const delta=after[k]-before[k];if(Math.abs(delta)>1e-7)changes.push({label:label[en?1:0],delta});}
    const activityNames={rest:'Rest',work:'Contract work',train:'Body training',meditate:'Meditation',technique:'Technique practice',explore:'Local exploration',mission:'Sect duties',govern:'Governance',laws:'Study of laws'};
    let activity=en?activityNames[before.activity]:E.activities[before.activity]?.name;
    if(before.world.journey){const dest=before.world.journey.destination,name=E.world.locations[dest].name;activity=say('Переход к месту: ','Travelling to: ')+(en?({village:'Wellside Village',forest:'Whispering Roots Forest',city:'Silver Bridge City',ruins:'Abandoned Temple',mountains:'Cloud Sword Pass'}[dest]||E.world.questPlaces.pairs.find(p=>p[0]===name)?.[1]||'a discovered place'):name);if(!after.world.journey)reasons.push(say('Переход завершён. Герой ждёт твоего решения на месте; прежнее занятие не возобновляется само.','The journey is complete. Your hero awaits your decision locally; the previous activity does not resume automatically.'));}
    const order=after.employment.order;
    if(before.activity==='work'){
      if(order&&order.progress>=E.orders[order.kind].target)reasons.push(say('Заказ выполнен. Работа остановилась; получи оплату у заказчика. Новый заказ сам не принимается.','The contract is complete. Work stopped; collect payment from the employer. No new contract is accepted automatically.'));
      else if(!E.canWorkOrder(after))reasons.push(say('Работа приостановлена: герой находится не у заказчика. Вернись в место заказа.','Work is paused: your hero is away from the employer. Return to the contract location.'));
    }
    if(before.activity==='train'&&after.body>=10*(after.realm+1))reasons.push(say('Достигнут предел тела. Для дальнейшего роста нужен прорыв.','The body limit has been reached. Further growth requires a breakthrough.'));
    if(['meditate','laws'].includes(before.activity)){
      if(!after.found)reasons.push(say('Понимание и энергия ещё закрыты: сначала найди наследие в храме. Спокойствие могло расти.','Understanding and qi are still locked: first discover the temple legacy. Calm may have grown.'));
      else if(after.xp>=E.needed(after))reasons.push(say('Понимание достигло предела; нужен прорыв. Остальные доступные эффекты занятия продолжаются.','Understanding reached its limit; a breakthrough is needed. Other available effects continue.'));
      if(after.calm>=100)reasons.push(say('Спокойствие достигло предела 100.','Calm reached its limit of 100.'));
    }
    const active=after.cultivation.active,learned=after.cultivation.learned[active];
    if(before.activity==='technique'&&learned&&(learned.rank>=5||learned.progress>=E.techniqueNeeded(learned.rank)))reasons.push(say('Практика выбранной техники достигла предела ранга. Повышение ранга требует твоего решения и оплаты.','Practice reached the active technique’s rank limit. Raising its rank requires your decision and payment.'));
    if(!before.world.journey&&!E.activityRunning(after)&&!reasons.length)reasons.push(say('Занятие приостановлено: его условия или подходящее место недоступны. Выбери доступное занятие.','The activity is paused: its conditions or required location are unavailable. Select an available activity.'));
    if(before.activity==='rest'&&!before.world.journey)reasons.push(say('Герой отдыхал. Работа, тренировка и медитация запускаются отдельным выбором.','Your hero rested. Work, training and meditation each require a separate choice.'));
    if(after.stage>=3&&after.workers.alchemist>0&&(after.resources.herbs<5||after.resources.qi<10))reasons.push(say('Алхимикам не хватает сырья: для следующей пилюли нужны 5 трав и 10 энергии.','Alchemists lack ingredients: the next pill needs 5 herbs and 10 qi.'));
    if(!reasons.length)reasons.push(say('Занятие продолжается.','The activity continues.'));
    if(order&&order.progress>(before.employment.order?.progress||0))changes.push({label:say('Прогресс заказа','Contract progress'),delta:order.progress-(before.employment.order?.progress||0)});
    for(const[k,t]of Object.entries(after.cultivation.learned)){const delta=t.progress-(before.cultivation.learned[k]?.progress||0);if(delta>1e-7)changes.push({label:say('Практика: ','Practice: ')+techName(k),delta});}
    if(!before.found&&after.found)opportunities.push(say('Найдено наследие храма: доступны понимание, энергия и первая рукопись.','The temple legacy was discovered: understanding, qi and the first manuscript are available.'));
    if(E.canClaimOrder(after))opportunities.push(say('Можно забрать оплату завершённого заказа.','Payment for the completed contract can be collected.'));
    if(E.canAdvance(after)&&!E.canAdvance(before))opportunities.push(say('Выполнены условия следующей главы.','The next chapter’s requirements are met.'));
    if(after.found&&after.xp>=E.needed(after)&&E.affordable(after,E.breakthroughCost(after))&&!(before.found&&before.xp>=E.needed(before)&&E.affordable(before,E.breakthroughCost(before))))opportunities.push(say('Можно совершить духовный прорыв.','A spiritual breakthrough is available.'));
    for(const k of Object.keys(E.techniques))if(E.canLearn(after,k)&&!E.canLearn(before,k))opportunities.push(say('Доступно изучение или повышение: ','Learning or rank advancement available: ')+techName(k));
    if(after.atlas.cooldown===0&&before.atlas.cooldown>0&&E.atlas.canSurvey(after))opportunities.push(say('Снова доступен осмотр окрестностей.','A local survey is available again.'));
    for(const a of E.achievements.list(after,language))if(a.earned&&!before.achievements.earned[a.id])opportunities.push(say('Достижение: ','Achievement: ')+a.name);
    const scene=E.world.current(after);if(scene){let title=E.world.sceneText(scene,'title',language,after);if(en&&/[А-Яа-яЁё]/.test(title))title='a local encounter';opportunities.push(say('Встреча ждёт решения: ','An encounter awaits your decision: ')+title);}
    const beat=E.storyBeat(after);if(beat?.ready(after))opportunities.push(say('Можно продолжить текущую историю.','The current story can continue.'));
    return {activity,elapsed:Math.max(0,elapsed),simulated:Math.max(0,after.age-before.age),changes,reasons,opportunities:[...new Set(opportunities)],safety:say('Сюжетные решения, опасные действия и переход в новую главу не выбирались автоматически.','Story decisions, dangerous actions and chapter advancement were not chosen automatically.')};
  }
  const api={snapshot,describe};root.IsekaiReturnReport=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
