(function(root){
  'use strict';
  const places=['village','forest','city','ruins','mountains'];
  const fresh=()=>({notes:{},pins:[],surveys:{},cooldown:0});
  const labels={village:['Окрестности деревни','Village surroundings'],forest:['Светлая опушка','Bright forest edge'],city:['Торговые проходы','Market passages'],ruins:['Внешняя стена храма','Outer temple wall'],mountains:['Нижняя тропа перевала','Lower pass trail']};
  const danger={village:['Безопасная деревенская дорога.','A safe village road.'],forest:['Опушка безопасна; в тёмной чаще видны звериные глаза.','The edge is safe; animal eyes watch from the dark thicket.'],city:['Стража проверяет право входа. Конфликт с учениками опасен.','Guards check entry rights. Conflicts with disciples are dangerous.'],ruins:['Внешний двор безопасен. Печати под алтарём требуют подготовки.','The outer yard is safe. Seals beneath the altar require preparation.'],mountains:['Нижний склон доступен. Верхнюю тропу охраняет страж.','The lower slope is accessible. A guard protects the upper trail.']};
  function validate(input){const a=fresh();if(!input||typeof input!=='object')return a;
    for(const[id,note]of Object.entries(input.notes||{}))if(typeof note==='string'&&id.length<=180&&/^(village|forest|city|ruins|mountains|dark-forest|sealed-crypt|upper-pass|site:|lead:)/.test(id))a.notes[id]=note.slice(0,600);
    a.pins=Array.isArray(input.pins)?[...new Set(input.pins.filter(id=>typeof id==='string'&&id.length<=180))].slice(0,80):[];
    for(const k of places){const n=input.surveys?.[k];if(Number.isSafeInteger(n)&&n>=0)a.surveys[k]=Math.min(1000000,n);}
    if(Number.isFinite(input.cooldown)&&input.cooldown>=0)a.cooldown=Math.min(300,input.cooldown);return a;
  }
  const trail=(s,place)=>(s.atlas.surveys[place]||0)>=2;
  function hint(s,lang='ru'){const en=lang==='en';if(s.world.journey)return en?'Finish the journey before surveying.':'Закончи переход перед осмотром.';
    if(s.world.encounter)return en?'Resolve the current encounter first.':'Сначала заверши текущую встречу.';
    if(s.storyStep===0&&s.stage===0)return en?'Reach the village in the story first.':'Сначала доберись до деревни по сюжету.';
    if(s.atlas.cooldown>0)return en?`Survey available in ${Math.ceil(s.atlas.cooldown)} s.`:`Новый осмотр через ${Math.ceil(s.atlas.cooldown)} сек.`;
    if(s.stamina<15)return en?'Requires 15 stamina.':'Нужно 15 выносливости.';
    return en?'Survey safe surroundings: costs 15 stamina, recovery 5 minutes. Two surveys reveal a trail that shortens travel by 20%. Later surveys provide local supplies.':'Осмотр безопасных окрестностей: 15 выносливости, восстановление 5 минут. Два осмотра открывают тропу, сокращающую переход на 20%. Дальнейшие осмотры дают местные припасы.';
  }
  const canSurvey=s=>!s.world.journey&&!s.world.encounter&&(s.storyStep>0||s.stage>0)&&s.stamina>=15&&s.atlas.cooldown<=0;
  function survey(s,E){if(!canSurvey(s))return false;const place=s.world.location;s.stamina-=15;s.atlas.cooldown=300;s.atlas.surveys[place]=Math.min(1000000,(s.atlas.surveys[place]||0)+1);E.interruptActivity(s);
    if(place==='village'||place==='city')s.resources.gold+=3;
    else if(place==='forest')s.resources.herbs+=2;
    else if(place==='ruins'){s.resources.herbs+=1;if(!s.found){s.explored=Math.min(600,s.explored+15);if(s.explored>=600)s.found=true;}}
    else s.resources.ore+=1;
    s.calm=Math.min(100,s.calm+.1);return true;
  }
  function rumors(s,lang='ru'){const en=lang==='en',out=[],add=(id,place,ru,english,source)=>out.push({id,place,text:en?english:ru,source:en?source:({Mei:'Мэй',Ren:'Жэнь',Lin:'Линь',Wei:'Вэй',Carters:'Возчики'}[source]||source),confirmed:trail(s,place)});
    if(s.storyStep>=1||s.stage>0){add('mei-forest','forest','Мэй слышала о светлой опушке с лекарственными травами. В глубине леса путники видят звериные глаза.','Mei has heard of a bright edge with medicinal herbs. Travellers see animal eyes deeper in the forest.','Mei');add('mei-temple','ruins','Мэй знает заброшенный храм за деревней. Обвалившийся двор можно осмотреть; под алтарём есть опасные печати.','Mei knows an abandoned temple beyond the village. Its collapsed yard can be surveyed; dangerous seals lie beneath the altar.','Mei');}
    if(s.world.mentors.includes('trainer'))add('ren-path','village','Жэнь показывает, по каким мосткам лучше носить тяжёлые ящики. Осмотр позволит запомнить короткую дорогу.','Ren points out walkways suitable for heavy crates. Surveying will help you remember a shorter route.','Ren');
    if(s.world.mentors.includes('herbalist'))add('lin-clearing','forest','Линь советует искать листья у светлой кромки, не приближаясь к звериным следам.','Lin advises looking for leaves near the bright edge, away from animal tracks.','Lin');
    if(s.world.mentors.includes('scholar'))add('wei-passage','city','Вэй отметил проход между архивом и торговым двором. Его нужно проверить на месте.','Wei marked a passage between the archive and trading yard. Check it locally.','Wei');
    if(s.stage>=1)add('lower-pass','mountains','Возчики говорят о нижней тропе перевала. Дорога выше остаётся под охраной.','Carters speak of a lower pass trail. The upper road remains guarded.','Carters');
    return out;
  }
  const details=(s,place,lang='ru')=>({danger:danger[place]?.[lang==='en'?1:0]||'',survey:s.atlas.surveys[place]||0,trail:trail(s,place),label:labels[place]?.[lang==='en'?1:0]||''});
  const api={fresh,validate,trail,hint,canSurvey,survey,rumors,details};root.IsekaiAtlas=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
