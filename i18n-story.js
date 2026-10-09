(function(root){
  'use strict';
  const L=root.IsekaiLocale,E=root.Isekai;if(!L||!E)return;
  const pairs=[];
  for(const stage of E.stages)pairs.push([stage.name.toUpperCase(),L.text(stage.name,'en').toUpperCase()]);
  const register=(source,values,fields)=>fields.forEach((field,i)=>{if(source[field]&&values[i])pairs.push([source[field],values[i]]);});
  const stories=[
    ['An unfamiliar sky','The last thing you remember is the glare of headlights. Now two pale suns hang overhead. A cart creaks along the road. A woman offers a flask. “Alive? Help me lift the wheel, then. I’ll take you to the village.” Nobody calls you the chosen one.','Accept help and reach the village.','Stand up and follow the cart'],
    ['Work for a place by the fire','Mei, the innkeeper, hands you a broom. “Stories don’t put food on the table. Sweep the yard and you’ll get dinner.” Sect disciples laugh at your worn clothes by the gate. Somehow their light footsteps crack the stone.','Sweep the yard 10 times or earn 15 coins through any work.','Collect your first wages'],
    ['A body that will not obey','One crate is enough to make your arms shake. Mei notices you watching the disciples. “Start with your legs. The old man by the well does squats and runs to the bridge every morning. It isn’t heavenly strength, but it’s a start.” You resolve to be stronger tomorrow.','Raise body to 2 by clicking squats or running.','Show that you have grown stronger'],
    ['Silence between breaths','The old man by the well introduces himself as Zhen. “Was everyone in your world always rushing? Here, listen first.” He teaches you to count your breaths. As your thoughts settle, you hear a faint chime from the abandoned temple. Nobody else hears it.','Accumulate 5 calm through idle meditation.','Tell Zhen about the chime'],
    ['A shard beneath the ashes','Zhen shows you the temple path. A black shard lies beneath the collapsed altar. It warms in your palm, and words appear in your mind: “Empty Sky.” It is only a damaged first page, but it offers a path you did not have yesterday.','Find the technique through 10 minutes of exploration; inspecting ruins speeds it up.','Read the first page'],
    ['The first breakthrough','The herbs taste bitter. With each breath, the shard answers with faint warmth. You lose the flow again and again, until one day it stays. For the first time, Zhen looks at you seriously. “This is your strength now. And your responsibility.”','Fill your insight, gather herbs and make your first breakthrough.','Accept his guidance'],
    ['The right to go further','A man wearing a White Fang armband extorts the cart drivers. You recognize the cart that brought you here. This time you can intervene. After your victory, Mei gives you the address of the city sect office, where open recruitment is held. The forest and temple may offer other paths and mentors. The defeated man promises his older brother will remember you.','Defeat the road bandit in the Trials tab.','Learn about recruitment and prepare to leave']
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
      ['A letter from the city','A messenger has mixed up the address. The letter belongs to Wei the librarian. Mei suggests delivering it, or trading old herbs with a passing apothecary.',['Remember the librarian’s name','Trade 5 herbs for 15 coins']],
      ['Dao the carpenter','Dao is fixing the inn’s door. He offers pay if you hold the boards in place. You could ask him about the abandoned temple instead.',['Help fix the door','Ask about the temple']],
      ['Another lesson with Zhen','Zhen recognizes you by the well. “Remember your stance? Now steady your breathing.” He offers a quiet review of the movement, without any miraculous jump in strength.',['Review the lesson','Rest beside your mentor']]
    ],
    forest:[
      ['An herbalist on the trail','Lin gathers silver wormwood leaves. “Don’t pull the roots. There will be more to gather tomorrow.” She will show you good spots if you help carry her basket.',['Help Lin and learn to gather','Gather ordinary herbs']],
      ['A beast by the stream','A rare root gleams in the water, but a fanged beast stands between you and the stream. Lin warned you that this trail is not for beginners. You can leave with ordinary herbs.',['Fight for the rare root','Retreat and gather herbs along the way']],
      ['An injured traveler','Sen, a mentor from the Jade Grove, lies wounded beside a tree. Share some herbs, and he will teach you a breathing method and offer discipleship once you are ready to join.',['Give 5 herbs and listen to his advice','Point out a safe trail']],
      ['An the tracker','An examines tracks at a forest fork. Help sort a bundle of herbs, and he will explain how to gather safely. You can decline and take another trail.',['Sort herbs with the tracker','Continue along the trail']],
      ['A basket for Lin','Lin recognizes her helper. Today she needs five ordinary herbs for the village clinic. She offers fair pay instead of repeating your first lesson.',['Trade 5 herbs for 12 coins','Discuss gathering spots']]
    ],
    city:[
      ['Wei the librarian','Wei will not let you into the cultivation hall, but offers an old manuscript in exchange for help with the catalogue. You could keep your coins and take an unloading job instead.',['Pay 10 coins for access','Help at the warehouse']],
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
      ['A master at the cliff','Master Yun watches the clouds. He will show you a sword movement for some qi. Or help him gather ore and receive part of the haul without paying.',['Pay 10 qi for a lesson','Gather ore together']],
      ['Guardian of the pass','The guardian demands proof that you deserve to pass. Spirit stone deposits lie behind him. The detour is longer but does not require a fight.',['Accept the guardian’s trial','Take the detour']],
      ['A quiet spring','A narrow cave hides a spring of pure energy. Calm your thoughts here, or fill a flask for future breakthroughs.',['Sit beside the spring','Collect spirit water']],
      ['Bo the miner','Bo rests by a marked, safe excavation. He offers ore in exchange for medicinal herbs. You do not need to fight the mountain guardian to make this trade.',['Trade 3 herbs for 8 ore','Rest beside the excavation']]
    ]
  };for(const[location,list]of Object.entries(scenes))list.forEach((values,i)=>{const source=E.world.encounters[location][i];register(source,values,['title','text']);source.choices.forEach((c,j)=>pairs.push([c.label,values[2][j]]));});
  const admissions={
    rescue:['Jade Grove · mentor Sen','Sen, whom you rescued in the forest, vouches for you. He will accept you as his personal disciple and give you 20 medicinal herbs when you join.'],
    remains:['Cloud’s Edge · mentor Yun','You will return the missing disciple’s remains. Yun is grateful for the chance to say goodbye and offers a place in her sword school. Her personal lesson grants +1 martial mastery when you join.'],
    invitation:['Empty Sky · keeper Wei','Your invitation map grants access to the ancient seal keepers’ recruitment. The keeper gives you 40 qi to study the legacy when you join.'],
    gates:['Cloud’s Edge · open recruitment','You came to the city sect office on your own. Without a sponsor, you must pass the general selection and begin as an outer disciple. Passing grants 10 reputation when you join.']
  };for(const[k,values]of Object.entries(admissions))register(E.world.admissions[k],values,['name','text']);
  const mentors={trainer:'Zhen’s guidance: body +15%',herbalist:'Lin’s advice: exploration herbs +20%',breathing:'Breathing method: insight +10%',scholar:'Wei’s manuscript: insight +15%',swordsman:'Yun’s lesson: martial mastery +15%'};for(const[k,en]of Object.entries(mentors))pairs.push([E.world.mentorNames[k],en]);
  L.add(pairs);
})(globalThis);
