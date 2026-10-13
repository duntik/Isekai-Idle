(function(root){
  'use strict';
  const places=['village','forest','city','ruins','mountains'];
  const journalPlaces=[...places,'village-mill','forest-garden','ruins-observatory','city-apothecary','mountains-cliff'],resourceKeys=['gold','herbs','qi','relics','wood','ore','pills','reputation','influence','supplies','cosmic','worlds'];
  const fresh=()=>({notes:{},pins:[],surveys:{},cooldown:0,discoveries:{}});
  const labels={village:['Окрестности деревни','Village surroundings'],forest:['Светлая опушка','Bright forest edge'],city:['Торговые проходы','Market passages'],ruins:['Внешняя стена храма','Outer temple wall'],mountains:['Нижняя тропа перевала','Lower pass trail'],'village-mill':['Старая мельница','Old mill'],'forest-garden':['Скрытый сад','Hidden garden'],'ruins-observatory':['Обсерватория под плющом','Ivy observatory'],'city-apothecary':['Алхимическая лаборатория Хо','Huo’s alchemy lab'],'mountains-cliff':['Облачный утёс Юнь','Yun’s Cloud Cliff']};
  const danger={village:['Безопасная деревенская дорога.','A safe village road.'],forest:['Опушка безопасна; в тёмной чаще видны звериные глаза.','The edge is safe; animal eyes watch from the dark thicket.'],city:['Стража проверяет право входа. Конфликт с учениками опасен.','Guards check entry rights. Conflicts with disciples are dangerous.'],ruins:['Внешний двор безопасен. Печати под алтарём требуют подготовки.','The outer yard is safe. Seals beneath the altar require preparation.'],mountains:['Нижний склон доступен. Верхнюю тропу охраняет страж.','The lower slope is accessible. A guard protects the upper trail.'],'village-mill':['Безопасная мельница мастера Туна.','Fastening craftsman Tong’s safe mill.'],'forest-garden':['Уединённый лекарственный сад Суй.','Sui’s secluded medicinal garden.'],'ruins-observatory':['Башня обсерватории за внешней стеной храма.','Observatory tower behind the outer temple wall.'],'city-apothecary':['Запах трав и горящих углей. Безопасная мастерская.','Smell of herbs and burning embers. A safe workshop.'],'mountains-cliff':['Сильный горный ветер над обрывом. Нужна устойчивая стойка.','Strong mountain wind over the chasm. Requires steady stance.']};
  function validate(input){const a=fresh();if(!input||typeof input!=='object')return a;
    for(const[id,note]of Object.entries(input.notes||{}))if(typeof note==='string'&&id.length<=180&&/^(village|forest|city|ruins|mountains|dark-forest|sealed-crypt|upper-pass|site:|lead:)/.test(id))a.notes[id]=note.slice(0,600);
    a.pins=Array.isArray(input.pins)?[...new Set(input.pins.filter(id=>typeof id==='string'&&id.length<=180))].slice(0,80):[];
    for(const k of places){const n=input.surveys?.[k];if(Number.isSafeInteger(n)&&n>=0)a.surveys[k]=Math.min(1000000,n);}
    for(const k of journalPlaces)if(Array.isArray(input.discoveries?.[k]))a.discoveries[k]=[...new Set(input.discoveries[k].filter(v=>resourceKeys.includes(v)))].sort();
    if(Number.isFinite(input.cooldown)&&input.cooldown>=0)a.cooldown=Math.min(300,input.cooldown);return a;
  }
  const trail=(s,place)=>(s.atlas.surveys[place]||0)>=2;
  function hint(s,lang='ru'){const en=lang==='en';if(s.world.journey)return en?'Finish the journey before surveying.':'Закончи переход перед осмотром.';
    if(!places.includes(s.world.location))return en?'This small place is explored through its local encounters. Return to the nearby area for a survey.':'Это небольшое место исследуется через местные встречи. Для осмотра окрестностей вернись в ближайшую область.';
    if(s.world.encounter)return en?'Resolve the current encounter first.':'Сначала заверши текущую встречу.';
    if(s.storyStep===0&&s.stage===0)return en?'Reach the village in the story first.':'Сначала доберись до деревни по сюжету.';
    if(s.atlas.cooldown>0)return en?`Survey available in ${Math.ceil(s.atlas.cooldown)} s.`:`Новый осмотр через ${Math.ceil(s.atlas.cooldown)} сек.`;
    if(s.stamina<15)return en?'Requires 15 stamina.':'Нужно 15 выносливости.';
    return en?'Survey safe surroundings: costs 15 stamina, recovery 5 minutes. Two surveys reveal a trail that shortens travel by 20%. Later surveys provide local supplies.':'Осмотр безопасных окрестностей: 15 выносливости, восстановление 5 минут. Два осмотра открывают тропу, сокращающую переход на 20%. Дальнейшие осмотры дают местные припасы.';
  }
  const canSurvey=s=>places.includes(s.world.location)&&!s.world.journey&&!s.world.encounter&&(s.storyStep>0||s.stage>0)&&s.stamina>=15&&s.atlas.cooldown<=0;
  function survey(s,E){if(!canSurvey(s))return false;const place=s.world.location;s.stamina-=15;s.atlas.cooldown=300;s.atlas.surveys[place]=Math.min(1000000,(s.atlas.surveys[place]||0)+1);E.interruptActivity(s);
    if(place==='village'||place==='city')s.resources.gold+=3;
    else if(place==='forest')s.resources.herbs+=2;
    else if(place==='ruins'){s.resources.herbs+=1;if(!s.found){s.explored=Math.min(600,s.explored+15);if(s.explored>=600)s.found=true;}}
    else s.resources.ore+=1;
    observe(s,place,place==='village'||place==='city'?{gold:3}:place==='forest'||place==='ruins'?{herbs:1}:{ore:1});s.calm=Math.min(100,s.calm+.1);return true;
  }
  function rumors(s,lang='ru'){const en=lang==='en',out=[],add=(id,place,ru,english,source)=>out.push({id,place,text:en?english:ru,source:en?source:({Mei:'Мэй',Ren:'Жэнь',Lin:'Линь',Wei:'Вэй',Carters:'Возчики',Yun:'Юнь',Ho:'Хо'}[source]||source),confirmed:trail(s,place)});
    if(s.storyStep>=1||s.stage>0){add('mei-forest','forest','Мэй слышала о светлой опушке с лекарственными травами. В глубине леса путники видят звериные глаза.','Mei has heard of a bright edge with medicinal herbs. Travellers see animal eyes deeper in the forest.','Mei');add('mei-temple','ruins','Мэй знает заброшенный храм за деревней. Обвалившийся двор можно осмотреть; под алтарём есть опасные печати.','Mei knows an abandoned temple beyond the village. Its collapsed yard can be surveyed; dangerous seals lie beneath the altar.','Mei');}
    if(s.world.mentors.includes('trainer'))add('ren-path','village','Жэнь показывает, по каким мосткам лучше носить тяжёлые ящики. Осмотр позволит запомнить короткую дорогу.','Ren points out walkways suitable for heavy crates. Surveying will help you remember a shorter route.','Ren');
    if(s.world.mentors.includes('herbalist'))add('lin-clearing','forest','Линь советует искать листья у светлой кромки, не приближаясь к звериным следам.','Lin advises looking for leaves near the bright edge, away from animal tracks.','Lin');
    if(s.world.mentors.includes('scholar'))add('wei-passage','city','Вэй отметил проход между архивом и торговым двором. Его нужно проверить на месте.','Wei marked a passage between the archive and trading yard. Check it locally.','Wei');
    if(s.stage>=1)add('lower-pass','mountains','Возчики говорят о нижней тропе перевала. Дорога выше остаётся под охраной.','Carters speak of a lower pass trail. The upper road remains guarded.','Carters');
    if(s.world.mentors.includes('swordsman'))add('yun-cliff','mountains','Юнь говорит об узкой тропе на ветреный утёс: там воздух чист и учит точности.','Yun speaks of a narrow path to the windy cliff: clean air there teaches precision.','Yun');
    if(s.world.director?.decisions?.['city:2/assist']||s.world.director?.decisions?.['city:huo-clinic/clinic-pill'])add('ho-workshop','city','Аптекарь Хо упомянул тихую мастерскую за торговым двором: там варят лекарства без лишних глаз.','Apothecary Huo mentioned a quiet workshop behind the trading yard: medicines are brewed there away from prying eyes.','Ho');
    return out;
  }
  const details=(s,place,lang='ru')=>({danger:danger[place]?.[lang==='en'?1:0]||'',survey:s.atlas.surveys[place]||0,trail:trail(s,place),label:labels[place]?.[lang==='en'?1:0]||''});
  function observe(s,place,reward){if(!journalPlaces.includes(place))return;const keys=resourceKeys.filter(k=>reward?.[k]>0);if(!keys.length)return;s.atlas.discoveries[place]=[...new Set([...(s.atlas.discoveries[place]||[]),...keys])].sort();}
  function migrate(s,E){for(const[place,scenes]of Object.entries(E.world.encounters))for(const scene of scenes)for(const c of scene.choices)if(s.world.director.decisions[`${scene.id}/${c.id}`])observe(s,place,c.reward);
    for(const place of places)if(s.atlas.surveys[place]>0)observe(s,place,place==='village'||place==='city'?{gold:1}:place==='forest'||place==='ruins'?{herbs:1}:{ore:1});}
  function journal(s,E,place,lang='ru'){
    const en=lang==='en',say=(ru,english)=>en?english:ru,visited=(s.world.visits[place]||0)>0||s.world.location===place&&!s.world.journey&&(s.storyStep>0||s.stage>0),people=E.world.memory.people(s,lang).filter(p=>p.location===place),resources=(s.atlas.discoveries[place]||[]).map(k=>en?({gold:'Coins',herbs:'Herbs',qi:'Qi',relics:'Shards',wood:'Wood',ore:'Ore',pills:'Pills',reputation:'Reputation',influence:'Influence',supplies:'Supplies',cosmic:'Star essence',worlds:'Worlds'}[k]):E.names[k]),facts=[];
    if(!visited&&!people.length&&!resources.length)return {visited:false,people:[],resources:[],facts:[],summary:say('Дорога известна, но собственных наблюдений пока нет.','The route is known, but you have no observations of your own yet.')};
    if(s.atlas.surveys[place])facts.push(say(`Осмотры окрестностей: ${s.atlas.surveys[place]}.`,`Local surveys: ${s.atlas.surveys[place]}.`));
    if(trail(s,place))facts.push(say('Найдена короткая тропа: переход сюда быстрее на 20%.','A shortcut was found: travel here is 20% faster.'));
    if(place==='ruins'&&s.found)facts.push(say('В храме найдено древнее наследие.','An ancient legacy was found in the temple.'));
    const did=k=>!!s.world.director.decisions[k];
    if(place==='forest-garden'&&did('forest-garden:0/seeds'))facts.push(say('Суй доверила тебе лекарственные семена и показала, как сохранять сбор.','Sui entrusted medicinal seeds to you and showed how to preserve the harvest.'));
    if(place==='village-mill'&&did('village-mill:0/beam'))facts.push(say('Тун показал, как удерживать балку и беречь силы при подъёме груза.','Tong showed how to brace a beam and conserve strength when lifting.'));
    if(place==='ruins-observatory'&&did('ruins-observatory:0/mirror'))facts.push(say('Свет небесного зеркала помогает различать стёртые храмовые знаки.','The celestial mirror’s light reveals worn temple signs.'));
    if(place==='city-apothecary'&&did('city-apothecary:0/distill'))facts.push(say('Бо показал тонкую очистку трав и сохранение эссенции.','Bo showed delicate herb purification and preserving plant essence.'));
    if(place==='mountains-cliff'&&did('mountains-cliff:0/breeze'))facts.push(say('Юнь показала, как держать равновесие под порывами горного ветра.','Yun showed how to maintain balance against mountain wind gusts.'));
    if(place==='city'&&did('city:wei-letter/deliver-letter'))facts.push(say('Письмо Мэй доставлено библиотекарю Вэю; доступ к архиву открыт.','Mei’s letter was delivered to scholar Wei; archive access is granted.'));
    if(place==='city'&&did('city:2/assist'))facts.push(say('Аптекарь Хо доверил тебе разбор трав в городской лавке.','Apothecary Huo trusted you with sorting herbs in the city apothecary.'));
    if(place==='mountains'&&s.world.mentors.includes('swordsman'))facts.push(say('Наставница Юнь показала владение мечом у обрыва.','Mentor Yun demonstrated sword mastery at the cliff.'));
    if(place==='forest'&&s.world.map.explored.includes('dark-forest'))facts.push(say('Тёмная чаща разведана: тропа к редким травам пройдена.','The dark thicket was scouted: the path to rare herbs was traversed.'));
    if(place==='ruins'&&s.world.map.explored.includes('sealed-crypt'))facts.push(say('Запечатанный склеп открыт: защитные печати преодолены.','The sealed crypt was breached: warding seals were overcome.'));
    if(place==='mountains'&&s.world.map.explored.includes('upper-pass'))facts.push(say('Верхняя тропа перевала открыта: страж признал твою силу.','The upper pass trail is open: the guardian acknowledged your strength.'));
    for(const[id,f]of Object.entries(E.world.frontiers))if(f.base===place&&s.world.map.explored.includes(id))facts.push(say('Проверен путь: '+f.name+'.','Route inspected: '+f.en+'.'));
    const encounters=Object.values(E.world.encounters).flat().filter(scene=>scene.id.startsWith(place+':')&&s.world.completed.includes(scene.id));if(encounters.length)facts.push(say(`Завершено местных историй: ${encounters.length}.`,`Local stories completed: ${encounters.length}.`));
    return {visited,people:people.map(p=>({name:p.name,role:p.role})),resources,facts,summary:say('Собственные наблюдения. Новые встречи и находки дополняют запись.','Your own observations. New encounters and discoveries add to this record.')};
  }
  const api={fresh,validate,trail,hint,canSurvey,survey,rumors,details,observe,migrate,journal};root.IsekaiAtlas=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
