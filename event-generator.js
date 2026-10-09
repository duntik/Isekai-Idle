(function(root){
  'use strict';
  // Compose compatible local situations, rather than mixing arbitrary sentences.
  const places={
    village:{actors:[['Возчик','Carter'],['Плотник','Carpenter'],['Лекарь','Healer']],tasks:[['починить мостки у колодца','repair the walkway by the well'],['подготовить обоз с лекарствами','prepare a medicine caravan'],['восстановить дорожные указатели','restore the road signs'],['оборудовать убежище для путников','equip a travellers’ shelter']],resource:'wood',technique:'stance'},
    forest:{actors:[['Следопыт','Tracker'],['Травница','Herbalist'],['Смотритель троп','Trail keeper']],tasks:[['открыть тропу к лекарственным полянам','open a trail to the herb clearings'],['уберечь саженцы у ручья','protect the saplings by the stream'],['разобрать следы у заброшенного лагеря','study the tracks at an abandoned camp'],['доставить сбор в лесной приют','deliver herbs to the forest shelter']],resource:'herbs',technique:'herb'},
    city:{actors:[['Архивист','Archivist'],['Аптекарь','Apothecary'],['Мастер обозов','Caravan master']],tasks:[['восстановить записи лечебницы','restore the clinic records'],['наладить снабжение городского приюта','organise supplies for the city shelter'],['сверить договоры торгового двора','check the trading yard contracts'],['оборудовать учебный двор','equip a training courtyard']],resource:'gold',technique:'breath'},
    ruins:{actors:[['Переписчик','Scribe'],['Исследователь','Researcher'],['Хранитель раскопок','Excavation keeper']],tasks:[['укрепить проход к внешнему залу','shore up the passage to the outer hall'],['снять отпечатки старых письмен','copy the ancient inscriptions'],['перенести образцы из осыпающейся стены','move samples from a crumbling wall'],['обозначить границы опасной печати','mark the boundary of a dangerous seal']],resource:'ore',technique:'sky'},
    mountains:{actors:[['Горняк','Miner'],['Проводник','Guide'],['Смотритель перевала','Pass keeper']],tasks:[['укрепить тропу над ущельем','secure the path above the gorge'],['восстановить сигнальную площадку','restore the signal platform'],['доставить припасы горному приюту','deliver supplies to the mountain shelter'],['защитить отмеченную выработку','protect the marked mine']],resource:'ore',technique:'sword'}
  };
  const names=[['Лэй','Lei'],['Шу','Shu'],['Нин','Ning']];
  const phases=[
    {min:0,max:1,ru:'Помощь нужна небольшой группе местных жителей.',en:'A small group of local residents needs help.',body:2,rank:1,cost:5,danger:60,reward:8},
    {min:2,max:3,ru:'Сектантская артель ведёт здесь работы. Она принимает помощь только от практиков с поручительством секты.',en:'A sect work crew operates here. It accepts help only from practitioners sponsored by a sect.',body:20,rank:2,cost:20,danger:1500,reward:30},
    {min:4,max:7,ru:'Это местный участок сети снабжения твоих владений. Руководитель просит решить задачу на месте; расширять владения вместо тебя он не будет.',en:'This is a local branch of your domain’s supply network. Its supervisor asks you to solve a local problem; they will not expand your domain for you.',body:100,rank:3,cost:100,danger:40000,reward:100}
  ];
  const obstacles=[
    {id:'weather',ru:'После ливня инструменты и запасы испорчены.',en:'Heavy rain has damaged the tools and supplies.'},
    {id:'mistake',ru:'Предыдущая бригада ошиблась в расчётах; работу нужно проверить заново.',en:'The previous crew made a calculation error; the work needs checking again.'},
    {id:'raiders',ru:'На подступах появились вымогатели. Рабочие боятся продолжать.',en:'Extortionists have appeared on the approaches. The workers are afraid to continue.'}
  ];
  const labels={labor:['Помочь работой и выносливостью','Help with labour and stamina'],study:['Применить изученную технику','Apply a learned technique'],supply:['Оплатить инструменты и припасы','Pay for tools and supplies'],fight:['Прогнать вымогателей','Drive the extortionists away'],skip:['Отказаться и продолжить путь','Decline and continue travelling'],claim:['Принять благодарность и признание','Accept thanks and recognition'],lesson:['Попросить совместную практику вместо припасов','Ask for joint practice instead of supplies']};
  const pairs=Object.values(labels);
  const techniqueNames={stance:['Корни камня','Roots of Stone'],herb:['Слух зелёных жил','Listening to Green Veins'],breath:['Дыхание тихой реки','Quiet River Breathing'],sky:['Сутра Пустого Неба','Empty Sky Sutra'],sword:['Меч облачного перевала','Cloud Pass Sword']};
  const outcomes={help:['Твоя работа позволила бригаде продолжить без потерь.','Your work allowed the crew to continue without losses.'],study:['Показанный тобой приём помог исправить порядок работы и избежать повторения ошибки.','The method you demonstrated helped improve the work and prevent another mistake.'],trade:['На переданные припасы купили инструменты и наняли сопровождающих.','Your supplies paid for tools and escorts.'],combat:['После твоей победы вымогатели ушли, и бригада смогла вернуться к работе.','After your victory the extortionists left, allowing the crew to resume work.']};
  function build(){
    const result=Object.fromEntries(Object.keys(places).map(k=>[k,[]]));
    for(const[location,p]of Object.entries(places))for(const[phaseIndex,phase]of phases.entries())for(const[actorIndex,actor]of p.actors.entries())for(const[taskIndex,task]of p.tasks.entries())for(const obstacle of obstacles){
      const id=`${location}:generated:${phaseIndex}:${actorIndex}:${taskIndex}:${obstacle.id}`;
      const person=`${actor[0]} ${names[actorIndex][0]}`,personEn=`${actor[1]} ${names[actorIndex][1]}`;
      const title=`${person}: ${task[0]}`,titleEn=`${personEn}: ${task[1]}`;
      const eligible=s=>s.stage>=phase.min&&s.stage<=phase.max&&(phase.min!==2||!!s.world.admission);
      const solved=s=>!!s.world.director.pending[id]&&['labor','study','supply','fight'].some(k=>s.world.director.decisions[`${id}/${k}`]);
      const choice=(key,options={})=>({id:key,label:labels[key][0],en:{label:labels[key][1]},...options});
      const resource=phase.min===0&&p.resource==='wood'?'gold':p.resource;
      const stamina=obstacle.id==='weather'?40:30,cost=phase.cost*(obstacle.id==='weather'?2:1);
      const choices=[
        choice('labor',{requires:s=>s.body>=phase.body&&s.stamina>=stamina,requirement:`Тело ≥ ${phase.body}; выносливость ≥ ${stamina}`,en:{label:labels.labor[1],requirement:`Body ≥ ${phase.body}; stamina ≥ ${stamina}`},stamina,route:'help'}),
        choice('study',{requires:s=>(s.cultivation.learned[p.technique]?.rank||0)>=phase.rank,requirement:`Техника: ${techniqueNames[p.technique][0]}; ранг ≥ ${phase.rank}`,en:{label:labels.study[1],requirement:`Technique: ${techniqueNames[p.technique][1]}; rank ≥ ${phase.rank}`},technique:p.technique,route:'study'}),
        choice('supply',{cost:{[resource]:cost},route:'trade'})
      ];
      if(obstacle.id==='raiders')choices.push(choice('fight',{danger:phase.danger,route:'combat'}));
      choices.push(choice('skip',{skip:true}));
      result[location].push({id,generated:true,once:true,title,en:{title:titleEn,text:`${personEn} asks you to ${task[1]}. ${phase.en} ${obstacle.en} You may help with labour, knowledge or supplies${obstacle.id==='raiders'?', or challenge the extortionists':''}. After a successful choice, find this person here again to learn the outcome.`},text:`${person} просит ${task[0]}. ${phase.ru} ${obstacle.ru} Можно помочь трудом, знаниями или припасами${obstacle.id==='raiders'?', а можно бросить вызов вымогателям':''}. После успешного выбора найди этого человека здесь снова, чтобы узнать результат.`,requires:eligible,choices});
      result[location].push({id:`${id}:return`,generated:true,payoff:true,once:true,title:`${person}: работа завершена`,text:s=>`${person} узнаёт тебя. ${outcomes[s?.world.director.pending[id]?.route||'help'][0]} Удалось ${task[0]}. За этот поступок ты получаешь награду и признание в той главе, где помог бригаде. Вместо припасов можно попросить время для совместной практики уже известного приёма. Он не заменяет личную культивацию.`,en:{title:`${personEn}: work completed`,text:s=>`${personEn} recognises you. ${outcomes[s?.world.director.pending[id]?.route||'help'][1]} Your help made it possible to ${task[1]}. You receive a reward and recognition in the chapter where you helped the crew. Instead of supplies, you may ask for time to practise a method you already know together. This does not replace personal cultivation.`},requires:s=>s.stage>=phase.min&&solved(s),choices:[choice('claim',{reward:{[resource]:phase.reward,...(phase.min>=2?{reputation:phase.reward/2}:{})},recognition:id}),choice('lesson',{requires:s=>!!s.cultivation.learned[p.technique],requirement:`Техника: ${techniqueNames[p.technique][0]}`,en:{label:labels.lesson[1],requirement:`Technique: ${techniqueNames[p.technique][1]}`},practice:{technique:p.technique,amount:60*(phaseIndex+1)},calm:2,recognition:id})]});
    }
    return result;
  }
  const api={build,pairs};root.IsekaiEventGenerator=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
