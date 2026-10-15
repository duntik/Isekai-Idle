(function(root){
  'use strict';
  const L=root.IsekaiLocale,E=root.Isekai;if(!L||!E)return;
  const pairs=[];
  for(const stage of E.stages)pairs.push([stage.name.toUpperCase(),L.text(stage.name,'en').toUpperCase()]);
  const register=(source,values,fields)=>fields.forEach((field,i)=>{if(source[field]&&values[i])pairs.push([source[field],values[i]]);});
  const stories=[
    [
      'An unfamiliar sky',
      'The blinding glare of headlights and the deafening screech of truck brakes on a rain-slicked highway are the final memories of your past life. A crushing impact, the snap of breaking bones, an icy flare of agony, and then — the abyss of void... A violent gasp jerks your consciousness back from nonexistence. An unfamiliar, damp chill burns your lungs, smelling of crushed pine needles, soaked earth, and mountain clay. You try to push yourself up, but this alien body cries out in racking weakness: muscles withered and hollow, with a sharp, constricting spasm throbbing along your spine and chest. Fragments of another life crash into your mind: an outcast youth branded worthless trash by his clan. His profound channels were crippled and knotted from birth — unable to gather even a single wisp of spiritual qi. Left to perish in soaked rags by the roadside. Yet suddenly, a searing, sweet heat flares within your left palm. Beneath the skin glows a familiar emerald mark — the Sky Poison Pearl! The supreme divine relic, for which the mightiest sovereigns slaughtered one another in your previous life, has inexplicably bound to your immortal soul and reincarnated with you! Forcing your feverish eyes open, you gaze upon an unfamiliar sky: through jagged leaden stormclouds shine two pale, eerie suns. You lie in the mud of a rain-swept mountain highway. Steps away, an exhausted horse whinnies in distress: a heavily laden wagon sits hopelessly mired, its rear axle sunk deep into a washed-out ditch. An old, gray-bearded carter, Uncle Ba, in an oiled cape heaves frantically against the wheel. Spotting you stirring, he shouts: “Hey, lad! You alive?! Can’t leave you to freeze out on this wild ridge before nightfall! Help me heave this cart onto dry timbers, and I’ll give you a seat on the box and take you down to Floating Cloud Valley!”',
      'Accept help and reach the village.',
      'Stand up and follow the cart'
    ],
    [
      'Work for a place by the fire',
      'As the wagon creaked heavily down the mountain descent, Uncle Ba asked about your plight. Learning that you were an outcast without clan or home, cursed from birth with crippled profound channels, the old carter shook his head sympathetically: “This world is ruthless to the weak, lad. But you saved my cart on the ridge, and I won’t forget it. I’m hauling provisions to Lady Mei’s inn at the crossroads of Floating Cloud Valley. Mei is sharp-tongued and stern, but fair to the bone: she’s always short of working hands. I’ll speak for you — she’ll feed you hot stew, give you a warm spot by the hearth, and pay a few coppers for chores.” When the wagon rolls into Mei’s courtyard, it cannot reach the shelter: a recent downpour choked the ground with thick mud and sharp rubble. Uncle Ba introduces you to the hostess as his lifesaver from the pass. Glancing over your emaciated frame and sensing your crippled channels, Lady Mei sighs, but honors Ba’s word: “If Old Ba vouches for you, I won’t turn you out into the dark. But nobody eats for free under my roof. Clear the path to the shed before nightfall, and you’ll get a hot bowl of meat stew, a place by the fire, and honest coppers.” She thrusts a heavy bamboo broom into your hands. But the moment your fingers grip the handle, a searing shock flares through your left palm! Shimmering emerald characters flash before your eyes with a soft chime: “【Spiritual interface initializing... Vessel critically depleted. Recommended: clear courtyard and replenish calories】”. The Sky Poison Pearl has awakened a divine guidance system! While your meridians sleep, you must trust the interface and take up the broom.',
      'Sweep the yard 10 times or earn 15 coins through any work.',
      'Collect your first wages'
    ],
    [
      'A body that will not obey',
      'Having earned a bowl of hot stew and a place by the hearth, you set out to help Uncle Ba unload heavy cargo crates. But the moment you heave a crate, your crippled profound channels seize with an excruciating spasm: your muscles lock up, your grip fails, and the iron-bound crate crashes onto the cobblestones. Darkness creeps across your vision. Instantly, an amber alert flashes before your eyes: “【Warning: profound channels blocked. Muscular foundation unstable. Recommendation: temper physical body to rank 2.0】”. Across the yard by the stone well rests Old Ren — a veteran martial instructor who diagnoses your affliction at a glance: “Boy, your profound channels have been knotted dead from birth. If you try to force spiritual qi, your veins will burst. But the heavens never seal every path: while your meridians sleep, a mortal’s only foundation is the iron tempering of sinews and flawless balance!” Ren drops into a rooted stance, demonstrating deep squats and rhythmic breathing. The Sky Poison Pearl’s system confirms his counsel: without a hardened physical vessel, survival in this world is impossible.',
      'Raise body to 2 by clicking squats or running.',
      'Show that you have grown stronger'
    ],
    [
      'Silence between breaths',
      'After grueling conditioning, your muscles throb with exhaustion and blood pounds in your temples. Sinking onto the mossy stone curb of the well, you struggle for breath. Old Ren sits beside you and places a heavy hand on your shoulder: “Strength without a tranquil mind is like water poured on sand. Count your breaths, close your eyes, and listen to the stillness between heartbeats.” You close your eyes and steady your respiration. As turbulent thoughts recede, the emerald lines before you stabilize with crystalline clarity: “【Synchronization complete. Heavenly Insight System calibrated. Current status: accumulating mental tranquility】”. When your inner calm reaches its peak, the Sky Poison Pearl in your left palm surges with pulsing heat: through the silence from the wooded mountain peak overlooking the village comes the vibrating chime of an ancient seal, echoing deep within your soul.',
      'Accumulate 5 calm through idle meditation.',
      'Tell Zhen about the chime'
    ],
    [
      'A shard beneath the ashes',
      'Guided by the spiritual call of the Pearl, you climb an overgrown trail to the mountain peak, where ancient pines shelter the ruins of a forgotten sanctuary. The temple roof collapsed centuries ago, its steps buried under stone slabs and ash. Clearing through the rubble beneath the shattered altar, your fingers find a tablet of cold black jade radiating a primordial aura. The moment your left palm touches it, the Sky Poison Pearl flares with brilliant crimson flame, instantly dispelling centuries of stagnant miasma! Blazing characters of an ancient legacy awaken across the cleansed jade: the opening verses of the Evil Sky Sutra. The profound pattern of primordial energy circulation imprints forever into your memory, and around the altar you discover rare mountain herbs nourished by a spiritual vein.',
      'Find the technique through 10 minutes of exploration; inspecting ruins speeds it up.',
      'Read the first page'
    ],
    [
      'The first breakthrough',
      'Returning to the hearth’s warmth, you clasp the gathered mountain herbs in your left palm. The Sky Poison Pearl instantly unleashes its divine purifying power: in a vortex of emerald light, it draws out all bitterness and toxicity, refining the raw leaves into a single drop of spiritual dew with one hundred percent absolute purity! You swallow the refined essence. Focusing on the formula of the Evil Sky Sutra, you guide the untainted energy through your body. The profound channels crippled since birth burst open with a resounding internal crack, as though ancient chains were shattered! A dense flow of true qi floods your meridians for the first time — achieving a triumphant breakthrough to the first realm! Explosive vigor rushes through your muscles, and your senses sharpen as never before.',
      'Fill your insight, gather herbs and make your first breakthrough.',
      'Accept his guidance'
    ],
    [
      'The right to go further',
      'At the wooden bridge leaving the village, the road is barred: Uncle Ba readied his wagon for a trip to the city, but ruffians of the White Fang gang have blocked the crossing. An extortionist plants his boot against the front wheel, demanding a double toll while threatening to burn the cart and cripple the old driver. Remembering the kindness of Uncle Ba and Hostess Mei, you cannot stand idly by. Unleashing the explosive power of your unsealed profound channels, you knock the extortionist leader to the bridge planks in a fierce clash. The routed thugs flee in panic. Hostess Mei and Uncle Ba gratefully hand you travel credentials and the address of the city sect bureau: the road to the city is open!',
      'Defeat the road bandit in the Trials tab.',
      'Learn about recruitment and prepare to leave'
    ],
    [
      'Great recruitment at the city gates',
      'Uncle Ba’s wagon safely delivers you to the wide square before the towering stone gates of Silver Bridge City. Here, four great sects of the valley have pitched their grand pavilions. Elders and senior disciples closely evaluate the arriving newcomers. Your deeds along the road and hard-won recognition have determined which schools are ready to welcome you. Choose a sect and take the disciple’s oath to conclude the first chapter and begin your path as a true adept.',
      'Choose one of the open sects and take the disciple’s oath.',
      'Join a sect'
    ]
  ];stories.forEach((values,i)=>register(E.story[i],values,['title','text','goal','button']));
  const locations={
    village:['Village by the Well','Mei and Zhen, safe work and help with training.','Body training +10%.'],
    forest:['Whispering Roots Forest','Medicinal herbs, Lin the herbalist, and beasts on the distant trails.','Exploration herbs +50%.'],
    city:['Silver Bridge City','Merchants, Wei the librarian, and disciples of powerful clans.','New contracts accepted here pay +25%.'],
    ruins:['Abandoned Temple','Fragments of a legacy, a wanderer, and dangerous seals beneath the altar.','Exploration relic shards +50%.'],
    mountains:['Cloud Sword Pass','Mountain ore, a solitary master, and guardians of the pass.','Meditation insight +20%.']
  };for(const[k,values]of Object.entries(locations))register(E.world.locations[k],values,['name','desc','bonus']);
  const scenes={
    village:[
      ['Zhen corrects your stance','The old man by the well silently watches your squats. “You’re pushing through your heels. Keep your back straight. Try again?” His lesson can help with every future workout.',['Accept Zhen’s lesson','Help Mei with a delivery']],
      ['By the hearth','Mei notices your exhaustion. “Hot tea first. Then back on the road.” Cart drivers are waiting by the table. They need help, and you need either money or a moment to rest.',['Drink tea and rest','Unload a cart']],
      ['A letter from the city','A messenger has mixed up the address. The sealed letter belongs to Wei the librarian in Silver Bridge City. Mei asks you to take it along: payment and thanks will come from its recipient. You may decline for now and trade herbs with a passing apothecary.',['Take the letter for Wei','Trade 5 herbs for 15 coins']],
      ['Dao the carpenter','Dao is fixing the inn’s door. He offers pay if you hold the boards in place. You could ask him about the abandoned temple instead. Dao explains where the trail begins and warns you not to touch the seals: a clear plan is reassuring, but you must explore the temple yourself.',['Help fix the door','Ask about the temple']],
      ['Another lesson with Zhen','Zhen recognizes you by the well. “Remember your stance? Now steady your breathing.” He offers a quiet review of the movement, without any miraculous jump in strength.',['Review the lesson','Rest beside your mentor']]
    ],
    forest:[
      ['An herbalist on the trail','Lin gathers silver wormwood leaves. “Don’t pull the roots. There will be more to gather tomorrow.” She will show you good spots if you help carry her basket.',['Help Lin and learn to gather','Gather ordinary herbs']],
      ['A beast by the stream','A rare root gleams in the water, but a fanged beast stands between you and the stream. Broken branches and deep claw marks show that this trail is not for beginners. You can leave with ordinary herbs.',['Fight for the rare root','Retreat and gather herbs along the way']],
      ['An injured traveler','Sen, a mentor from the Jade Grove, lies wounded beside a tree. Share some herbs, and he will teach you a breathing method and offer discipleship once you are ready to join.',['Give 5 herbs and listen to his advice','Point out a safe trail']],
      ['An the tracker','An examines tracks at a forest fork. Help sort a bundle of herbs, and he will explain how to gather safely. You can decline and take another trail.',['Sort herbs with the tracker','Continue along the trail']],
      ['A basket for Lin','Lin recognizes her helper. Today she needs five ordinary herbs for the village clinic. She offers fair pay instead of repeating your first lesson.',['Trade 5 herbs for 12 coins','Discuss gathering spots']]
    ],
    city:[
      ['Wei the librarian','Wei, the city librarian, also keeps the Empty Sky archives. For 10 coins he grants access to an old manuscript. If you lack the money, help at the warehouse first and earn the reading fee.',['Pay 10 coins for access','Help at the warehouse']],
      ['An arrogant disciple','A youth in White Fang robes bumps your shoulder. “Commoner, watch your step!” His companions spread out around you. You can answer the insult, but you may lack the strength.',['Answer the insult and fight','Avoid the fight']],
      ['The alchemist’s shop','Ho the apothecary recognizes the forest herbs. He offers a rare pill for one shard, or a small job with leftover medicines as part of the pay.',['Trade a shard for a pill','Sort herbs in the shop']],
      ['Zhu the courier','Zhu is looking for help on the square: scrolls need delivering to the market stalls. This is a short city job, not a journey into dangerous lands.',['Deliver the scrolls','Ask about sect recruitment']],
      ['An assignment from your sect office','The attendant recognizes your sect insignia. Help sort a shipment of herbs, and it will count as an assignment. An unknown outsider would not be trusted with internal work.',['Give 5 herbs to your sect','Ask about the disciples']]
    ],
    ruins:[
      ['A wanderer by the altar','The man in the gray cloak has already explored the temple. “There is a sign beneath the ashes. Don’t rush to break the seals.” He offers to show you an inscription, or you can search the rubble for materials.',['Listen to the wanderer','Sort through the rubble']],
      ['A seal beneath the stone','A glowing shard lies behind a cracked slab. As you reach for it, a guardian’s silhouette awakens. It will not let the weak pass. You can leave the seal untouched.',['Break through the guardian’s seal','Step back and copy the inscriptions']],
      ['An echo of the former master','A brief line appears on the wall: “Technique without understanding is empty movement.” You can study its rhythm, or take a small shard nearby.',['Remember the breathing rhythm','Take the loose shard']],
      ['A disciple’s final journey','A fallen disciple of Cloud’s Edge lies beneath a cave-in. His token names him Jin. You can carefully wrap his remains and return them through the city sect office. This is an act of respect, not looting.',['Take the remains to return to his sect','Pay your respects and leave']],
      ['An invitation map','A map bearing the Empty Sky seal survives in a hidden cache. The city office address is written on the back. The map grants access to recruitment, but you must still prove your strength.',['Keep the invitation map','Leave the map in the cache']],
      ['Tan the researcher','Tan copies inscriptions by the entrance. There is no need to touch the dangerous seal: help make an impression, or search the surface rubble.',['Help copy the symbols','Inspect the surface rubble']]
    ],
    mountains:[
      ['A mentor at the cliff','Mentor Yun of Cloud’s Edge watches the clouds. She will show you a sword movement for some qi. Or help her gather ore and receive part of the haul without paying.',['Pay 10 qi for a lesson','Gather ore together']],
      ['Guardian of the pass','The guardian demands proof that you deserve to pass. Spirit stone deposits lie behind him. The detour is longer but does not require a fight.',['Accept the guardian’s trial','Take the detour']],
      ['A quiet spring','A narrow cave hides a spring of pure energy. Calm your thoughts here, or fill a flask for future breakthroughs.',['Sit beside the spring','Collect spirit water']],
      ['Bo the miner','Bo rests by a marked, safe excavation. He offers ore in exchange for medicinal herbs. You do not need to fight the mountain guardian to make this trade.',['Trade 3 herbs for 8 ore','Rest beside the excavation']]
    ]
  };for(const[location,list]of Object.entries(scenes))list.forEach((values,i)=>{const source=E.world.encounters[location].find(e=>e.id===`${location}:${i}`);register(source,values,['title','text']);source.choices.forEach((c,j)=>pairs.push([c.label,values[2][j]]));});
  const followups={
    'city:wei-letter':['The letter reaches Wei','Wei checks the seal on the letter you brought from Mei. “The messenger lost his way. Thank you for bringing it.” He pays you for the delivery and lets you read a manuscript about spiritual currents. Wei writes a recommendation for the village cart drivers: his archive has the support of the city sect office, and extortionists usually leave sponsored caravans alone. Show the letter to the drivers in the village if you choose to help without fighting.',['Deliver the letter and receive a recommendation']],
    'village:road-return':['News from the city road','Mei heard that you refused to let the White Fang disciple drag you into a fight. “Sometimes saving your strength matters more than answering an insult.” The cart drivers offer a small delivery job, while Mei offers herbs for your journey.',['Help the cart drivers with a delivery','Accept herbs from Mei']],
    'forest:sen-followup':['Sen keeps his word','Sen can walk on his own again. He recognizes the person who shared their herbs. “A debt is not forgotten. Here are supplies for your first breakthroughs.” Ask for medicine or a quiet breathing lesson. This continues your encounter rather than repeating the rescue.',['Accept medicinal herbs','Review the breathing method']],
    'city:lin-delivery':['A note from Lin to Ho','Ho received a note from Lin: you supplied herbs to the village clinic. He will share medicine or pay for your help. Connections between people prove more useful than pure luck.',['Accept Ho’s pill','Collect payment for helping the clinic']],
    'ruins:archive-clue':['Compare the temple symbols','Your acquaintance with Wei’s archives helps you recognize the symbol: the temple belonged to a network of spirit sources. This explains the shard’s warmth without granting instant power. Keep a sample or study the inscription calmly.',['Keep a sample of the seal','Study the inscription']]
  };for(const[id,values]of Object.entries(followups)){const source=Object.values(E.world.encounters).flat().find(e=>e.id===id);register(source,values,['title','text']);source.choices.forEach((c,i)=>pairs.push([c.label,values[2][i]]));}
  const admissions={
    rescue:['Jade Grove · mentor Sen','Sen, whom you rescued in the forest, vouches for you. He will accept you as his personal disciple and give you 20 medicinal herbs when you join.'],
    remains:['Cloud’s Edge · mentor Yun','You will return the missing disciple’s remains. Yun is grateful for the chance to say goodbye and offers a place in her sword school. Her personal lesson grants +1 martial mastery when you join.'],
    invitation:['Empty Sky · keeper Wei','Your invitation map grants access to the ancient seal keepers’ recruitment. The keeper gives you 40 qi to study the legacy when you join.'],
    gates:['Cloud’s Edge · open recruitment','You came to the city sect office on your own. Without a sponsor, you must pass the general selection and begin as an outer disciple. Passing grants 10 reputation when you join.']
  };for(const[k,values]of Object.entries(admissions))register(E.world.admissions[k],values,['name','text']);
  const mentors={trainer:'Zhen’s guidance: body +15%',herbalist:'Lin’s advice: exploration herbs +20%',breathing:'Breathing method: insight +10%',scholar:'Wei’s manuscript: insight +15%',swordsman:'Yun’s lesson: martial mastery +15%'};for(const[k,en]of Object.entries(mentors))pairs.push([E.world.mentorNames[k],en]);
  L.add([...pairs,...root.IsekaiEventGenerator.pairs,
    ['БЛИЖАЙШАЯ ЦЕЛЬ','NEXT GOAL'],['Ближайшая цель','Next goal'],['Ближайший горизонт','The next horizon'],['Признание','Recognition'],['признание','recognition'],['или','or'],
    ['Помощь людям','Helping people'],['Знания и техники','Knowledge and techniques'],['Снабжение','Supply work'],['Защита от вымогателей','Protection from extortionists'],['Местное поручение','Local task'],
    ['Неверное признание','Invalid recognition'],['Неверное поручение','Invalid local task'],
    ['практики','practice'],
    ['ПЕРВЫЙ ШАГ','FIRST STEP'],['Как тебя зовут?','What is your name?'],['Имя героя','Character name'],['Варианты имён','Name suggestions'],['Другие варианты','More suggestions'],['Стиль имени','Name style'],['Мир культивации','Cultivation world'],['Японское ранобэ','Japanese light novel'],['Фэнтезийный исекай','Fantasy isekai'],['Начать путь','Begin your journey'],['Неверное имя героя','Invalid character name'],
    ['В новом мире ты выбираешь своё имя. Введи любое подходящее имя или воспользуйся подсказками.','Choose your name in this new world. Enter your own name or pick a suggestion.'],['2–40 символов: буквы, цифры, пробел, дефис или апостроф. Фамилия необязательна.','2–40 characters: letters, digits, spaces, hyphens or apostrophes. A surname is optional.'],['Введи имя от 2 до 40 символов без необычных знаков.','Enter a name of 2–40 characters using letters, digits, spaces, hyphens or apostrophes.'],
    ['Ты принят во внешние ученики. За тебя говорят выполненные поручения и люди, которым ты помог. Доступ к библиотеке и доверие старших ещё предстоит заслужить.','You have been accepted as an outer disciple. Completed tasks and the people you helped speak for you. Library access and the elders’ trust must still be earned.'],
    ['Твои знания и помощь объединили небольшую общину. Трое последователей доверили тебе разорённое убежище. Теперь предстоит превратить его в самостоятельную секту.','Your knowledge and help brought a small community together. Three followers entrusted a ruined shelter to you. Now you must build it into an independent sect.'],
    ['Секта наладила помощь и снабжение долины. Поселения доверили тебе управление городом. Теперь нужны торговля, запасы и устойчивое управление.','The sect organised aid and supplies for the valley. Its settlements entrusted the city to you. Trade, reserves and stable administration are now needed.'],
    ['Ожидают продолжения','Awaiting follow-up'],['Вернись в указанное место и ищи встречи. За каждое завершённое поручение: признание +1 в главе, где ты оказал помощь.','Return to the indicated location and search for encounters. Each completed task grants +1 recognition in the chapter where you helped.'],
    ['Представительства находятся в городе Серебряного Моста. Выбери путь поступления. Затем подготовь третью ступень и запас снаряжения. Заслужи три победы или 12 признания за завершённые поручения. Можно сменить заявку до вступления.','The sect offices are in Silver Bridge City. Choose an admission path, prepare realm 3 and equipment supplies, then earn three victories or 12 recognition from completed tasks. You can change your application before joining.'],
    ['Тебе известна только ближайшая цель. Дальнейший путь откроется, когда ты до неё доберёшься. Поручения, знания, помощь людям и испытания позволяют заслужить признание разными способами. Личная культивация и запас ресурсов по-прежнему необходимы.','You know only your next goal. More of the path is revealed when you reach it. Tasks, knowledge, helping people and trials offer different ways to earn recognition. Personal cultivation and resources are still required.']
  ]);
})(globalThis);
