(function(root){
  'use strict';
  const places=['village','forest','city','ruins','mountains'];
  const journalPlaces=[...places,'village-mill','forest-garden','ruins-observatory','city-apothecary','mountains-cliff'],resourceKeys=['gold','herbs','qi','relics','wood','ore','pills','reputation','influence','supplies','cosmic','worlds'];
  const fresh=()=>({notes:{},pins:[],surveys:{},cooldown:0,discoveries:{},secrets:[],fragments:[],assembledMap:false});
  const labels={village:['Окрестности деревни','Village surroundings'],forest:['Светлая опушка','Bright forest edge'],city:['Торговые проходы','Market passages'],ruins:['Внешняя стена храма','Outer temple wall'],mountains:['Нижняя тропа перевала','Lower pass trail'],'village-mill':['Старая мельница','Old mill'],'forest-garden':['Скрытый сад','Hidden garden'],'ruins-observatory':['Обсерватория под плющом','Ivy observatory'],'city-apothecary':['Алхимическая лаборатория Хо','Huo’s alchemy lab'],'mountains-cliff':['Облачный утёс Юнь','Yun’s Cloud Cliff']};
  const danger={village:['Безопасная деревенская дорога.','A safe village road.'],forest:['Опушка безопасна; в тёмной чаще видны звериные глаза.','The edge is safe; animal eyes watch from the dark thicket.'],city:['Стража проверяет право входа. Конфликт с учениками опасен.','Guards check entry rights. Conflicts with disciples are dangerous.'],ruins:['Внешний двор безопасен. Печати под алтарём требуют подготовки.','The outer yard is safe. Seals beneath the altar require preparation.'],mountains:['Нижний склон доступен. Верхнюю тропу охраняет страж.','The lower slope is accessible. A guard protects the upper trail.'],'village-mill':['Безопасная мельница мастера Туна.','Fastening craftsman Tong’s safe mill.'],'forest-garden':['Уединённый лекарственный сад Суй.','Sui’s secluded medicinal garden.'],'ruins-observatory':['Башня обсерватории за внешней стеной храма.','Observatory tower behind the outer temple wall.'],'city-apothecary':['Запах трав и горящих углей. Безопасная мастерская.','Smell of herbs and burning embers. A safe workshop.'],'mountains-cliff':['Сильный горный ветер над обрывом. Нужна устойчивая стойка.','Strong mountain wind over the chasm. Requires steady stance.']};
  function validate(input){const a=fresh();if(!input||typeof input!=='object')return a;
    for(const[id,note]of Object.entries(input.notes||{}))if(typeof note==='string'&&id.length<=180&&/^(village|forest|city|ruins|mountains|dark-forest|sealed-crypt|upper-pass|site:|lead:|cache:)/.test(id))a.notes[id]=note.slice(0,600);
    a.pins=Array.isArray(input.pins)?[...new Set(input.pins.filter(id=>typeof id==='string'&&id.length<=180))].slice(0,80):[];
    for(const k of places){const n=input.surveys?.[k];if(Number.isSafeInteger(n)&&n>=0)a.surveys[k]=Math.min(1000000,n);}
    for(const k of journalPlaces)if(Array.isArray(input.discoveries?.[k]))a.discoveries[k]=[...new Set(input.discoveries[k].filter(v=>resourceKeys.includes(v)))].sort();
    if(Number.isFinite(input.cooldown)&&input.cooldown>=0)a.cooldown=Math.min(300,input.cooldown);
    a.secrets=Array.isArray(input.secrets)?[...new Set(input.secrets.filter(id=>typeof id==='string'&&id.length<=80))].slice(0,50):[];
    a.fragments=Array.isArray(input.fragments)?[...new Set(input.fragments.filter(id=>typeof id==='string'&&id.length<=80))].slice(0,10):[];
    a.assembledMap=Boolean(input.assembledMap);
    return a;
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
    if(!Array.isArray(s.atlas.fragments))s.atlas.fragments=[];
    if(place==='ruins'&&!s.atlas.fragments.includes('fragment-ruins')){
      s.atlas.fragments.push('fragment-ruins');
      if(E?.log)E.log(s,'Найден древний обрывок карты: Руины Алтаря (1/3).');
    }else if(place==='forest'&&!s.atlas.fragments.includes('fragment-forest')){
      s.atlas.fragments.push('fragment-forest');
      if(E?.log)E.log(s,'Найден древний обрывок карты: Корни Дракона (2/3).');
    }else if(place==='city'&&!s.atlas.fragments.includes('fragment-city')){
      s.atlas.fragments.push('fragment-city');
      if(E?.log)E.log(s,'Найден древний обрывок карты: Городской Архив (3/3).');
    }
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
  const details=(s,place,lang='ru')=>{
    const en=lang==='en',say=(ru,english)=>en?english:ru;
    const visited=(s.world.visits[place]||0)>0||(s.world.location===place&&!s.world.journey&&(s.storyStep>0||s.stage>0));
    const sCount=s.atlas.surveys[place]||0;
    let dText=danger[place]?.[en?1:0]||'';
    if(sCount===0){
      if(!visited){
        const rList=rumors(s,lang).filter(r=>r.place===place);
        dText=rList.length?say(`По слухам: ${rList[0].text}`,`From rumours: ${rList[0].text}`):say('Опасности не разведаны.','Hazards are unmapped.');
      }else{
        dText=say('Окрестности ещё не проверены осмотром.','Surroundings have not been personally surveyed yet.');
      }
    }
    return {danger:dText,survey:sCount,trail:trail(s,place),label:labels[place]?.[en?1:0]||''};
  };
  function observe(s,place,reward){if(!journalPlaces.includes(place))return;const keys=resourceKeys.filter(k=>reward?.[k]>0);if(!keys.length)return;s.atlas.discoveries[place]=[...new Set([...(s.atlas.discoveries[place]||[]),...keys])].sort();}
  function migrate(s,E){for(const[place,scenes]of Object.entries(E.world.encounters))for(const scene of scenes)for(const c of scene.choices)if(s.world.director.decisions[`${scene.id}/${c.id}`])observe(s,place,c.reward);
    for(const place of places)if(s.atlas.surveys[place]>0)observe(s,place,place==='village'||place==='city'?{gold:1}:place==='forest'||place==='ruins'?{herbs:1}:{ore:1});}
  function overview(s,E,place,lang='ru'){
    const en=lang==='en',say=(ru,english)=>en?english:ru;
    const visited=(s.world.visits[place]||0)>0||(s.world.location===place&&!s.world.journey&&(s.storyStep>0||s.stage>0));
    const surveys=s.atlas?.surveys[place]||0;
    const placeRumors=rumors(s,lang).filter(r=>r.place===place);
    const people=E.world?.memory?E.world.memory.people(s,lang).filter(p=>p.location===place):[];
    const bonuses={
      village:['Тренировка тела +10%.','Body training +10%.'],
      forest:['При исследовании травы +50%.','Exploration herbs +50%.'],
      city:['Оплата принятых здесь заказов +25%.','New contracts accepted here pay +25%.'],
      ruins:['Осколки за исследование +50%.','Exploration relic shards +50%.'],
      mountains:['Понимание от медитации +20%.','Meditation insight +20%.']
    };
    const canonicalDesc=en&&E.world?.locations[place]?.en?.desc?E.world.locations[place].en.desc:E.world?.locations[place]?.desc||'';
    const canonicalBonus=bonuses[place]?bonuses[place][en?1:0]:(en&&E.world?.locations[place]?.en?.bonus?E.world.locations[place].en.bonus:E.world?.locations[place]?.bonus||'');
    const canonicalDanger=danger[place]?.[en?1:0]||'';

    let tier=0,desc='',bonus='',dangerText='';
    if(visited){
      tier=surveys>=1?(surveys>=2&&people.length>0?4:3):2;
    }else if(placeRumors.length>0||(place==='city'&&s.world?.contacts?.includes('scholar'))){
      tier=1;
    }

    if(tier===0){
      desc=say('Неизведанная область. Ты знаешь лишь название и ещё ничего не выяснил об этом месте.','Unexplored area. You only know the name and have learned nothing about this place yet.');
      bonus=say('Особенности ещё не разведаны.','Local traits have not yet been surveyed.');
      dangerText=say('Опасности не разведаны.','Hazards are unmapped.');
    }else if(tier===1){
      if(placeRumors.length){
        desc=say(`По слухам (${placeRumors[0].source}): «${placeRumors[0].text}»`,`From rumours (${placeRumors[0].source}): “${placeRumors[0].text}”`);
      }else if(place==='city'&&s.world?.contacts?.includes('scholar')){
        desc=say('По письму Мэй: в городском архиве служит библиотекарь Вэй.','From Mei’s letter: scholar Wei serves in the city archive.');
      }else{
        desc=say('О месте ходят смутные слухи, но точных сведений пока нет.','Vague rumours surround this place, but no certain facts are known.');
      }
      bonus=say('Особенности известны лишь по слухам.','Local traits are known only through rumours.');
      dangerText=place==='forest'
        ?say('По слухам: в глубине леса путники видят звериные глаза.','From rumours: travellers see animal eyes deeper in the forest.')
        :place==='ruins'
        ?say('По слухам: под алтарём есть опасные печати.','From rumours: dangerous seals lie beneath the altar.')
        :place==='city'
        ?say('По слухам: стража у ворот проверяет чужаков.','From rumours: guards at the gate check strangers.')
        :place==='mountains'
        ?say('По слухам: страж охраняет проход на верхнюю тропу.','From rumours: a guardian protects the upper trail.')
        :say('Опасности известны лишь по слухам.','Hazards are known only through rumours.');
    }else if(tier===2){
      const impressions={
        village:['Деревня у колодца — тихое поселение у тракта. В центре колодец с чистой водой, у постоялого двора останавливаются обозы.','Wellside Village — a quiet roadside settlement. A stone well stands at the centre, and caravans halt by the inn.'],
        forest:['Лес Шепчущих Корней — вековой сосновый бор у подножия холмов. Воздух пахнет смолой и мхом, в глубине темнеет чаща.','Whispering Roots Forest — an ancient pine woodland. The air smells of resin and moss, with thickets deepening beyond.'],
        city:['Город Серебряного Моста — каменный город за высокими воротами. Заставы охраняют въезд, внутри шумят торговые ряды.','Silver Bridge City — a stone walled city behind tall gates. Outposts guard the entrance, while bustling stalls fill the streets.'],
        ruins:['Заброшенный храм — полуразрушенное древнее святилище на каменистом холме. Мох покрывает ступени и расколотые плиты алтаря.','Abandoned Temple — a half-ruined ancient sanctuary on a rocky crest. Moss covers stone steps and cracked altar slabs.'],
        mountains:['Перевал Облачного Меча — продуваемый ветром горный хребет. Узкая тропа ведёт сквозь туман вдоль обрыва.','Cloud Sword Pass — a windswept mountain ridge. A narrow path climbs through the mist along sheer cliffs.']
      };
      desc=impressions[place]?say(impressions[place][0],impressions[place][1]):canonicalDesc;
      if(people.length>0){
        desc+=say(` Здесь встречены: ${people.map(p=>`${p.name} (${p.role})`).join(', ')}.`,` Met here: ${people.map(p=>`${p.name} (${p.role})`).join(', ')}.`);
      }
      bonus=say('Особенности прояснятся после осмотра окрестностей.','Local traits will become clear after surveying the surroundings.');
      dangerText=say('Окрестности ещё не проверены осмотром.','Surroundings have not been personally surveyed yet.');
    }else{
      const impressions={
        village:['Деревня у колодца — безопасное поселение с колодцем и постоялым двором.','Wellside Village — a safe settlement with a well and roadside inn.'],
        forest:['Лес Шепчущих Корней — светлая опушка безопасна для сбора трав, но дальние тропы опасны.','Whispering Roots Forest — bright edge is safe for gathering herbs, but distant trails are dangerous.'],
        city:['Город Серебряного Моста — оживлённый торговый центр и архив Пустого Неба.','Silver Bridge City — a busy market hub and the Empty Sky archives.'],
        ruins:['Заброшенный храм — внешний двор безопасен для осмотра; под алтарём скрыты печати.','Abandoned Temple — outer yard is safe to survey; seals lie beneath the altar.'],
        mountains:['Перевал Облачного Меча — нижний склон доступен; верхнюю тропу охраняет страж.','Cloud Sword Pass — lower slope is accessible; a guardian protects the upper trail.']
      };
      desc=impressions[place]?say(impressions[place][0],impressions[place][1]):canonicalDesc;
      if(people.length>0){
        desc+=say(` Здесь живут и работают: ${people.map(p=>`${p.name} (${p.role})`).join(', ')}.`,` Living and working here: ${people.map(p=>`${p.name} (${p.role})`).join(', ')}.`);
      }
      bonus=canonicalBonus;
      dangerText=canonicalDanger;
    }
    return {tier,desc,bonus,danger:dangerText,visited,surveys,trail:surveys>=2,people};
  }
  function journal(s,E,place,lang='ru'){
    const en=lang==='en',say=(ru,english)=>en?english:ru,
      visited=(s.world.visits[place]||0)>0||s.world.location===place&&!s.world.journey&&(s.storyStep>0||s.stage>0),
      people=E.world.memory.people(s,lang).filter(p=>p.location===place),
      resources=(s.atlas.discoveries[place]||[]).map(k=>en?({gold:'Coins',herbs:'Herbs',qi:'Qi',relics:'Shards',wood:'Wood',ore:'Ore',pills:'Pills',reputation:'Reputation',influence:'Influence',supplies:'Supplies',cosmic:'Star essence',worlds:'Worlds'}[k]):E.names[k]),
      placeRumors=rumors(s,lang).filter(r=>r.place===place),
      facts=[];

    if(!visited&&!people.length&&!resources.length){
      return {
        visited:false,
        people:[],
        resources:[],
        facts:placeRumors.map(r=>say(`Слух (${r.source}): «${r.text}»`,`Rumour (${r.source}): “${r.text}”`)),
        summary:placeRumors.length
          ?say('Ты ещё не был здесь лично. Все сведения записаны исключительно со слов и слухов.','You have not been here personally. All knowledge is recorded purely from hearsay and rumours.')
          :say('Дорога известна, но собственных наблюдений пока нет.','The route is known, but you have no observations of your own yet.')
      };
    }

    const impressions={
      village:['Деревня у колодца — тихое поселение у тракта, где останавливаются обозы.','Wellside Village — a quiet roadside settlement where caravans halt.'],
      forest:['Лес Шепчущих Корней — древний сосновый бор, пахнущий смолой и мхом.','Whispering Roots Forest — an ancient pine woodland smelling of resin and moss.'],
      city:['Город Серебряного Моста — каменный город за высокими воротами с оживлёнными лавками.','Silver Bridge City — a stone walled city behind tall gates with lively market stalls.'],
      ruins:['Заброшенный храм — полуразрушенное древнее святилище на каменистом склоне.','Abandoned Temple — a half-ruined ancient sanctuary on a rocky slope.'],
      mountains:['Перевал Облачного Меча — продуваемый ветром горный хребет над ущельем.','Cloud Sword Pass — a windswept mountain ridge high above the chasm.']
    };
    if(visited&&impressions[place])facts.push(say(`Личные впечатления: ${impressions[place][0]}`,`Firsthand impression: ${impressions[place][1]}`));

    for(const r of placeRumors)facts.push(say(`Слух (${r.source}): «${r.text}»`,`Rumour (${r.source}): “${r.text}”`));

    const residentDesc={
      mei:['Здесь живёт хозяйка постоялого двора Мэй: кров и работа у очага.','Innkeeper Mei lives here: shelter and work by the hearth.'],
      ren:['У колодца живёт и обучает наставник Жэнь: стойка и дыхание.','Mentor Ren lives by the well: stance and breathing.'],
      lin:['На лесной тропе живёт травница Линь: знает целебные травы.','Herbalist Lin lives along the forest trail: knows medicinal herbs.'],
      sen:['В лесной чаще тренируется наставник Сэнь из Нефритовой Рощи.','Mentor Sen of Jade Grove trains in the forest thicket.'],
      wei:['В городском архиве служит библиотекарь Вэй: хранит древние свитки.','Scholar Wei serves in the city archive: keeps ancient scrolls.'],
      ho:['В торговом квартале держит лавку аптекарь Хо.','Apothecary Huo keeps a shop in the merchant quarter.'],
      wanderer:['Среди алтарей храма бродит странник в сером плаще.','A grey-cloaked wanderer roams among the temple altars.'],
      yun:['На ветреном перевале тренируется наставница Облачного Предела Юнь.','Sword mentor Yun of Cloud Reach trains on the windswept pass.'],
      tong:['На старой мельнице работает мастер креплений Тун.','Fastening craftsman Tong works at the old mill.'],
      sui:['В скрытом саду живёт хранительница семян Суй.','Seed keeper Sui lives in the hidden garden.'],
      qiao:['В обсерватории ведёт наблюдения исследовательница Цяо.','Researcher Qiao conducts observations in the observatory.'],
      bo:['В алхимической лаборатории работает аптекарь Бо.','Apothecary Bo works in the alchemy laboratory.']
    };
    for(const p of people){
      const note=residentDesc[p.id];
      if(note)facts.push(say(note[0],note[1]));
    }
    if(place==='city'&&s.world?.contacts?.includes('scholar')&&!people.some(p=>p.id==='wei')){
      facts.push(say('По письму Мэй: в городском архиве служит библиотекарь Вэй.','From Mei’s letter: scholar Wei serves in the city archive.'));
    }

    if(s.atlas.surveys[place])facts.push(say(`Осмотры окрестностей: ${s.atlas.surveys[place]}.`,`Local surveys: ${s.atlas.surveys[place]}.`));
    if(trail(s,place))facts.push(say('Найдена короткая тропа: переход сюда быстрее на 20%.','A shortcut was found: travel here is 20% faster.'));
    if(place==='ruins'&&s.found)facts.push(say('В храме найдено древнее наследие.','An ancient legacy was found in the temple.'));

    if(s.atlas.discoveries[place]?.includes('herbs'))facts.push(say('Сбор трав проверен лично: на светлых участках растут лекарственные растения.','Herb gathering personally confirmed: medicinal plants grow in bright clearings.'));
    if(s.atlas.discoveries[place]?.includes('ore'))facts.push(say('Добыча руды проверена лично: в породе есть жилы ценного камня.','Ore extraction personally confirmed: rock seams contain valuable ore.'));
    if(s.atlas.discoveries[place]?.includes('relics'))facts.push(say('Поиск осколков проверен лично: древние реликвии скрыты среди камней.','Shard search personally confirmed: ancient relics lie hidden among the stones.'));
    if(s.atlas.discoveries[place]?.includes('gold')&&place!=='village')facts.push(say('Заработок проверен лично: за местную работу платят монетами.','Earnings personally confirmed: local work pays in coins.'));

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
  const secretsCatalog=[
    {
      id:'hermit-cave',
      name:['Заросшая пещера отшельника','Overgrown Hermit Cave'],
      desc:['Укрытая в плюще расщелина среди скал. Внутри ощущается след древнего спокойствия.','An ivy-choked cleft among the rocks. A faint trace of ancient tranquility lingers inside.'],
      icon:'⛰',
      x:390, y:520,
      reward:{calm:2,herbs:3,xp:0.5},
      rewardText:['Спокойствие +2, травы +3, эхо понимания','Calm +2, herbs +3, echo of insight'],
      ready:s=>s.storyStep>=1||s.stage>=1||(s.atlas?.surveys?.ruins||0)>=1
    },
    {
      id:'spirit-spring',
      name:['Духовный ключ в ущелье','Profound Spring in Chasm'],
      desc:['Из разлома скалы бьёт мерцающий родник чистейшей ци, окутанный лазурным паром.','A shimmering spring of pure qi wells from a rock fissure, cloaked in azure mist.'],
      icon:'♨',
      x:1030, y:130,
      reward:{stamina:30,qi:1},
      rewardText:['Восстановление выносливости (+30) и 1 ци','Stamina recovery (+30) and 1 qi'],
      ready:s=>s.storyStep>=2||s.stage>=1||(s.atlas?.surveys?.forest||0)>=1
    },
    {
      id:'peddler-camp',
      name:['Стоянка бродячего торговца','Wandering Peddler’s Camp'],
      desc:['Одинокий костёр у старой дороги. Старый путник прячет повозку от разбойников.','A lonely campfire off the old road. An old traveler conceals his cart from bandits.'],
      icon:'🏕',
      x:145, y:520,
      reward:{gold:10},
      rewardText:['Монеты +10 и дорожный совет','Coins +10 and trail advice'],
      ready:s=>s.storyStep>=1||s.stage>=1
    },
    {
      id:'herb-glade',
      name:['Потайная поляна трав','Hidden Herb Glade'],
      desc:['Скрытая за густым терновником поляна, где цветут дикорастущие целебные травы.','A glade concealed behind dense briars where wild medicinal herbs flourish.'],
      icon:'🌿',
      x:635, y:520,
      reward:{herbs:8},
      rewardText:['Редкие травы +8','Rare herbs +8'],
      ready:s=>((s.world?.visits?.forest||0)>0||(s.atlas?.surveys?.forest||0)>=1)
    },
    {
      id:'ancient-grotto',
      name:['Тайный Грот Древнего Мастера','Ancient Master’s Secret Grotto'],
      desc:['Сокрытая завесой иллюзий пещера, найденная по древней карте. Здесь струится первозданная энергия ци.','A cavern veiled in illusion wards, revealed by the ancient assembled map. Primordial qi flows within.'],
      icon:'🌌',
      x:820, y:220,
      reward:{qi:20,xp:15,herbs:15,calm:5},
      rewardText:['Первозданная ци +20, понимание +15, травы +15, спокойствие +5','Primordial qi +20, insight +15, herbs +15, calm +5'],
      ready:s=>Boolean(s.atlas?.assembledMap)
    }
  ];
  const fragmentsCatalog={
    'fragment-ruins':{id:'fragment-ruins',name:['Обрывок карты: Руины Алтаря','Map Fragment: Altar Ruins'],desc:['Пожелтевший пергамент со схемой подземных вен храма.','Yellowed parchment charting underground spiritual veins beneath the temple.'],icon:'📜',place:'ruins'},
    'fragment-forest':{id:'fragment-forest',name:['Обрывок карты: Корни Дракона','Map Fragment: Dragon Roots'],desc:['Кусок шёлка с нанесённым руслом духовного ручья в чащах.','Silk fragment tracing the spiritual creek’s flow in the forest deeps.'],icon:'📜',place:'forest'},
    'fragment-city':{id:'fragment-city',name:['Обрывок карты: Городской Архив','Map Fragment: City Archive'],desc:['Страница из книги Вэя с координатами запечатанных гротов.','Leaf from Wei’s tome marking coordinates of sealed ancient grottoes.'],icon:'📜',place:'city'}
  };
  function fragments(s,lang='ru'){
    const en=lang==='en',held=s.atlas?.fragments||[];
    return Object.values(fragmentsCatalog).map(f=>({
      id:f.id,
      name:f.name[en?1:0],
      desc:f.desc[en?1:0],
      icon:f.icon,
      place:f.place,
      found:held.includes(f.id)
    }));
  }
  const canAssembleMap=s=>(s.atlas?.fragments?.length||0)>=3&&!s.atlas?.assembledMap;
  function assembleMap(s,E){
    if(!canAssembleMap(s))return false;
    s.atlas.assembledMap=true;
    if(E?.log)E.log(s,'Древняя карта сокровищ собрана воедино! На карте проявился вход в Тайный Грот Древнего Мастера.');
    return true;
  }
  function secrets(s,lang='ru'){
    const en=lang==='en';
    return secretsCatalog.filter(sec=>sec.ready(s)).map(sec=>({
      id:sec.id,
      name:sec.name[en?1:0],
      desc:sec.desc[en?1:0],
      icon:sec.icon,
      x:sec.x,
      y:sec.y,
      rewardText:sec.rewardText[en?1:0],
      found:(s.atlas?.secrets||[]).includes(sec.id)
    }));
  }
  function claimSecret(s,id,E){
    if(!s.atlas)s.atlas=fresh();
    if(!Array.isArray(s.atlas.secrets))s.atlas.secrets=[];
    if(s.atlas.secrets.includes(id))return false;
    const sec=secretsCatalog.find(item=>item.id===id);
    if(!sec||!sec.ready(s))return false;
    s.atlas.secrets.push(id);
    if(sec.reward.gold)s.resources.gold=(s.resources.gold||0)+sec.reward.gold;
    if(sec.reward.herbs)s.resources.herbs=(s.resources.herbs||0)+sec.reward.herbs;
    if(sec.reward.qi)s.resources.qi=(s.resources.qi||0)+sec.reward.qi;
    if(sec.reward.calm)s.calm=Math.min(100,(s.calm||0)+sec.reward.calm);
    if(sec.reward.stamina)s.stamina=Math.min(E?.staminaMax?E.staminaMax(s):100,(s.stamina||0)+sec.reward.stamina);
    if(sec.reward.xp)s.xp=Math.min(E?.needed?E.needed(s):100,(s.xp||0)+sec.reward.xp);
    if(E?.log)E.log(s,`Тайник обнаружен: ${sec.name[0]}. ${sec.rewardText[0]}`);
    return true;
  }
  const api={fresh,validate,trail,hint,canSurvey,survey,rumors,details,overview,locationKnowledge:overview,observe,migrate,journal,secretsCatalog,secrets,claimSecret,fragmentsCatalog,fragments,canAssembleMap,assembleMap};root.IsekaiAtlas=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
