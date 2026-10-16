(function(root){
  if(root.IsekaiCausalEvents)root.IsekaiLocale.add(root.IsekaiCausalEvents.pairs);
  if(root.Isekai?.sects)root.IsekaiLocale.add(root.Isekai.sects.pairs);
  if(root.Isekai?.world.questPlaces)root.IsekaiLocale.add(root.Isekai.world.questPlaces.pairs);
  root.IsekaiLocale.add([
    ['Открыта дорога:','Route discovered:'],
    ['Железные сухожилия','Iron Sinews'],['Закрытая библиотека Каменного Оплота','Stone Bastion restricted library'],['Рост тела +8% и боевая сила +4% за ранг. Двигательная практика.','Body growth +8% and combat power +4% per rank. Movement practice.'],
    ['Выполняет принятый заказ на месте: накладные сразу, физическую работу после освоения. На время работы медитация останавливается.','Performs the accepted contract locally: ledgers immediately, physical work after mastery. Meditation stops during work.'],
    ['Распорядок Жэня: упражнения без постоянных кликов. Только в деревне или городе; занимает всё внимание и не даёт духовную энергию.','Ren’s routine: exercises without repeated clicks. Village or city only; occupies your attention and generates no qi.'],
    ['После изучения приёма: практика выбранной техники и рост освоения. Можно заниматься до открытия наследия. Медитация на это время останавливается.','After learning a method, practise your active technique and improve mastery. Practice is available before discovering the legacy. Meditation pauses during practice.'],
    ['Неверное восстановление техники','Invalid technique recovery'],
    ['След туши','Trail of Ink'],['Урок библиотекаря Вэя','Librarian Wei’s lesson'],['Понимание +8% за ранг. Позволяет читать повреждённые надписи в храме.','Understanding +8% per rank. Allows reading damaged temple inscriptions.'],
    ['После находки и изучения приёма: практика выбранной техники и рост освоения. Медитация на это время останавливается.','After discovering and learning a method, practise your active technique and improve mastery. Meditation pauses during practice.'],
    ['Развить тело до 2 приседаниями или бегом либо изучить первый ранг любой техники.','Raise body to 2 through squats or running, or learn the first rank of any technique.'],
    ['Защитить обоз силой','Protect the caravan by force'],['Провести обоз при поддержке жителей','Guide the caravan with local support'],['Показать рекомендацию Вэя','Present Wei’s recommendation'],
    ['Сила начинается со знания','Strength begins with knowledge'],['Показать изученный приём','Demonstrate your learned method'],
    ['Мэй замечает, как ты повторяешь изученный приём. Ты выбрал начать с понимания техники, а не с тяжёлых ящиков. Тело можно укреплять позже; сейчас у тебя уже есть собственный способ стать сильнее.','Mei notices you repeating a learned method. You chose to start with understanding a technique rather than lifting heavy crates. You can strengthen your body later; you already have your own way to grow stronger.'],
    ['Вместо подъёма неподъёмных ящиков ты методично повторяешь движения изученного приёма. Точная траектория и распределение веса заменяют слепую силу: каждое повторение укрепляет баланс тела надёжнее бездумных нагрузок.','Instead of struggling with heavy crates, you methodically repeat the forms of your learned technique. Precise lines and balanced weight distribution replace blind muscle: each repetition builds body stability far better than reckless strain.'],
    ['Жэнь узнаёт тебя у колодца. Стойку ты уже учил у него; сегодня речь о другом. «Между движениями тоже есть работа. Считай вдохи и слушай». Когда мысли затихают, из заброшенного храма доносится тонкий звон.','Zhen recognises you by the well. You already learned a stance from him; today’s lesson is different. “There is work between movements too. Count your breaths and listen.” When your thoughts quieten, a faint chime comes from the abandoned temple.'],
    ['Закрепив стойку у колодца, ты садишься перевести дух. Жэнь показывает, как сменить мышечное напряжение ровным ритмом вдохов и выдохов. Когда бег мыслей затихает и наступает полная тишина, Небесная Жемчужина Яда в ладони отзывается на резонанс: из заброшенного храма за деревней доносится тонкий вибрирующий звон, неслышимый для окружающих.','Having reinforced your stance at the well, you sit to recover your breath. Zhen shows how to trade muscular strain for a steady rhythm of inhalation and exhalation. When rushing thoughts subside into total silence, the Sky Poison Pearl in your palm responds to a resonance: from the abandoned temple beyond the village comes a faint vibrating chime, unheard by anyone else.'],
    ['Помочь обозу: победить разбойника, заслужить 3 признания местными поручениями или доставить письмо Вэю и получить рекомендацию.','Help the caravan: defeat the bandit, earn 3 recognition through local tasks, or deliver Wei’s letter and obtain his recommendation.'],
    ['Возчики у деревенской дороги жалуются на человека с повязкой Белого Клыка: он требует плату за проход. После первого прорыва ты можешь защитить обоз силой. Другие пути — заручиться помощью жителей, которым ты помог, или предъявить рекомендацию библиотекаря Вэя. Выбирай, как заслужить право идти дальше.','Carters near the village complain about a man wearing a White Fang armband who demands a toll. After your first breakthrough, you may protect the caravan by force. Other paths are to seek support from people you helped or present librarian Wei’s recommendation. Choose how to earn your right to continue.'],
    ['На выезде из деревни перекрыт мост: повозка дяди Ба готова к отправке в город, но вымогатель с повязкой Белого Клыка заблокировал проезд и требует непомерную плату. Дядя Ба спас тебя на перевале, а Мэй дала кров — пришло время отплатить за добро. После первого прорыва и открытия глубоких каналов ты можешь дать отпор в схватке. Другие пути — провести повозку при сплочённой поддержке жителей, которым ты помог, или предъявить дорожную грамоту с печатью городского архивариуса Вэя. Выбирай, как заслужить право идти дальше.','At the village exit, the bridge is blocked: Uncle Ba’s wagon is ready to depart for the city, but an extortionist wearing a White Fang armband has barred the way, demanding an exorbitant toll. Uncle Ba saved you on the ridge, and Mei gave you shelter — the time has come to repay their kindness. After your breakthrough and unsealing your profound channels, you can drive him off in combat. Other paths are to guide the wagon with the united backing of locals you helped, or to present travel papers bearing city archivist Wei’s seal. Choose how to earn your right to proceed.'],
    ['Завершить первую арку','Complete the first arc'],['Дорога без потерь','A road without losses'],['Слово из городского архива','A word from the city archive'],
    ['Жители помнят твою помощь. Вместе с возчиками они подготовили обходную тропу и провели обоз без драки. Мэй даёт тебе адрес представительства сект: доверие людей открыло дорогу дальше.','The residents remember your help. Together with the carters, they prepared a detour and guided the caravan without a fight. Mei gives you the sect office address: people’s trust has opened the road ahead.'],
    ['Благодарные жители деревни, помнящие твою помощь, выходят к мосту сплочённой группой и помогают провести повозку дяди Ба в брод в обход заставы. Увидев решимость людей, вымогатель не решается на столкновение и освобождает путь. Мэй передаёт дорожный знак и адрес городского представительства: взаимное доверие открыло дорогу дальше.','The grateful villagers who remember your help gather at the bridge in a solid group, guiding Uncle Ba’s wagon through a nearby ford around the roadblock. Seeing their united resolve, the extortionist chooses not to fight and yields the road. Mei gives you travel credentials and the city sect office address: shared trust has opened the way ahead.'],
    ['Ты показываешь рекомендацию Вэя, полученную за доставленное письмо. Возчики обращаются к дорожному смотрителю, и вымогатель отступает перед официальным разрешением на проход. Мэй даёт адрес представительства сект. Ты решил конфликт через знакомство и выполненное обещание.','You show Wei’s recommendation, received for delivering his letter. The carters appeal to the road keeper, and the extortionist withdraws before an official passage permit. Mei gives you the sect office address. You resolved the conflict through a contact and a kept promise.'],
    ['Ты предъявляешь дорожную грамоту с официальной архивной печатью библиотекаря Вэя, полученную за доставку письма. Увидев официальный знак городской канцелярии, надсмотрщик опускает перекладину и без споров пропускает повозку дяди Ба. Мэй передаёт адрес городского представительства: выполненное обещание открыло путь дальше.','You present travel papers bearing librarian Wei’s official archive seal, earned by delivering his letter. Seeing the official mark of the city registry, the guard lowers his staff and lets Uncle Ba’s wagon pass without dispute. Mei provides the city sect office address: a kept promise has opened the road ahead.'],
    ['Дыхательный ритм храмовых письмен','Breathing rhythm of the temple inscriptions'],['Уборка торгового двора','Trading yard cleanup'],['Разгрузка городского склада','City warehouse unloading'],
    ['Личный прорыв и помощь обозу: победа, 3 признания или рекомендация Вэя.','A personal breakthrough and help for the caravan: a victory, 3 recognition or Wei’s recommendation.'],
    ['Первый бой: в деревне, после прорыва и перед финалом первой арки. Можно завершить арку без боя.','First battle: in the village, after a breakthrough and before the first arc’s finale. You can complete the arc without fighting.'],
    ['После прорыва и перед финалом первой арки. Можно завершить арку без боя.','After a breakthrough and before the first arc’s finale. You can complete the arc without fighting.'],['Первый бой','First battle'],['Деревня','Village'],['Путь первой главы','First chapter path'],['Неверный путь первой главы','Invalid first chapter path'],['Первичное освоение','Initial learning'],['Неверная подготовка героя','Invalid character preparation']
  ]);
  root.IsekaiLocale.add([
  [
    "Вес груза",
    "The weight of a load"
  ],
  [
    "Жэнь видит, как ты берёшься за работу. «Сила не в рывке: поставь ноги, подними ногами, дыши на усилии». После твоего знакомства с возчиками он готов провести первый урок с пустыми ящиками. Можно учиться или попросить отдых: заказ на чужом дворе отсюда не выполнить.",
    "Ren watches you work. “Strength is not a sudden pull: plant your feet, lift with your legs and breathe out on effort.” Now that you know the carters, he offers a lesson with empty crates. Learn or rest; work at another yard cannot be done here."
  ],
  [
    "Освоить безопасный подъём",
    "Learn safe lifting"
  ],
  [
    "Пока отдохнуть",
    "Rest for now"
  ],
  [
    "Корзины на коромысле",
    "Buckets in balance"
  ],
  [
    "Жэнь предлагает перенести два небольших ведра от колодца до очага Мэй. Это урок равновесия, а не обещание лёгких денег. Сначала нужен крепкий шаг: тело 2. После помощи Мэй поделится едой и даст травы на восстановление.",
    "Ren offers a balance lesson: carry two small buckets from the well to Mei’s hearth. It takes a steady step: body 2. Mei will share food and herbs for recovery afterward."
  ],
  [
    "Перенести вёдра: тело 2",
    "Carry the buckets: body 2"
  ],
  [
    "Вернуться после тренировок",
    "Return after training"
  ],
  [
    "Надёжный помощник",
    "A reliable helper"
  ],
  [
    "Возчики запомнили твою аккуратность. Они предлагают выбрать: припасы для дороги в храм или спокойный разбор стойки с Жэнем. Рекомендация не делает тебя членом секты; найденный в пути наставник всё ещё может изменить твою жизнь.",
    "The carters remember your careful work. Choose supplies for the temple road or a quiet stance review with Ren. Their trust does not make you a sect disciple; a mentor found along the way can still change your life."
  ],
  [
    "Взять припасы для дороги",
    "Take road supplies"
  ],
  [
    "Разобрать стойку с Жэнем",
    "Review your stance with Ren"
  ],
  [
    "Настой дошёл до очага",
    "The infusion reaches the hearth"
  ],
  [
    "Мэй читает записку Линь и принимает приготовленный настой. «Теперь я знаю, кому доверить травы». Она оплачивает доставку. Можно попросить запас трав или отдых; лекарское обучение доступно и тому, кто продолжает укреплять тело.",
    "Mei reads Lin’s note and accepts the infusion. “Now I know whom to trust with herbs.” She pays for delivery. Ask for herbs or rest; learning medicine remains open even while training your body."
  ],
  [
    "Передать настой и получить травы",
    "Deliver the infusion and receive herbs"
  ],
  [
    "Передать настой и отдохнуть",
    "Deliver the infusion and rest"
  ],
  [
    "Лист, стебель и корень",
    "Leaf, stem and root"
  ],
  [
    "Линь узнаёт помощника и раскладывает похожие растения на ткани. Одно лечит, другое раздражает кожу. «Назови признаки, прежде чем сорвать». Можно пройти спокойный урок или взять обычные травы: оба решения оставляют другие пути открытыми.",
    "Lin recognises her helper and lays similar plants on cloth. One heals; another irritates skin. “Name the signs before picking.” Take a quiet lesson or collect ordinary herbs. Both choices leave other paths open."
  ],
  [
    "Учиться различать растения",
    "Learn to identify plants"
  ],
  [
    "Собрать обычные травы и вернуться позже",
    "Gather common herbs and return later"
  ],
  [
    "Для деревенской лечебницы",
    "For the village clinic"
  ],
  [
    "Линь собирается отправить лекарство Мэй. Она доверит тебе рецепт настоя, если ты отдашь пять обычных трав. Сначала проверь сырьё, потом отнеси записку в деревню. Лечение требует внимания, а благодарность получишь после доставки.",
    "Lin is preparing medicine for Mei. Give her five common herbs and she will show the infusion recipe. Check the ingredients, then carry her note to the village; thanks come after delivery."
  ],
  [
    "Передать 5 трав и приготовить настой",
    "Give 5 herbs and prepare an infusion"
  ],
  [
    "Вернуться с травами",
    "Return with herbs"
  ],
  [
    "Заметка на полях",
    "A note in the margin"
  ],
  [
    "Вэй видит, что рукопись заинтересовала тебя. На полях нарисован знак заброшенного храма. Он предлагает сделать точную копию: не вскрывать печати, а сравнить линии. Это исследование можно совместить с работой или уроками других наставников.",
    "Wei sees your interest in the manuscript. A temple symbol is drawn in the margin. Make a careful copy, then compare its lines at the abandoned temple without opening seals. This research can be combined with work or other mentors’ lessons."
  ],
  [
    "Скопировать знак для сверки в храме",
    "Copy the symbol to compare at the temple"
  ],
  [
    "Сначала отдохнуть",
    "Rest first"
  ],
  [
    "Один знак — часть сети",
    "One symbol in a network"
  ],
  [
    "Вэй сверяет твою копию с архивом. «Значит, храм был узлом, а не дворцом. Ты сделал полезное наблюдение». За работу он платит и предлагает материалы для дальнейшего обучения. Даже хороший исследователь может нуждаться в сильном теле или помощи травника.",
    "Wei compares your copy with the archive. “So the temple was a node, not a palace. A useful observation.” He pays for your work and offers study materials. A good researcher may still need a strong body or a herbalist’s help."
  ],
  [
    "Получить плату и материалы для обучения",
    "Receive payment and study materials"
  ],
  [
    "Получить плату и дорожные травы",
    "Receive payment and travel herbs"
  ],
  [
    "Знак на внешней стене",
    "The outer-wall symbol"
  ],
  [
    "Копия Вэя совпадает со знаком на внешней стене. Здесь нет стража: опасные печати глубже. Сопоставить линии можно с ясной головой — спокойствие 3. Исследование помогает понять устройство храма, но само наследие ещё предстоит найти.",
    "Wei’s copy matches a symbol on the outer wall. No guardian stands here; the dangerous seals are deeper. Comparing the lines takes calm 3. The study helps you understand the temple, but the legacy must still be found."
  ],
  [
    "Сверить линии: спокойствие 3",
    "Compare the lines: calm 3"
  ],
  [
    "Вернуться после отдыха",
    "Return after resting"
  ]
]);
root.IsekaiLocale.add([
  ['Неизведанная область. Ты знаешь лишь название и ещё ничего не выяснил об этом месте.','Unexplored area. You only know the name and have learned nothing about this place yet.'],
  ['Неизведанная область. Ты знаешь лишь название и направление.','Unexplored area. You only know the name and direction.'],
  ['Особенности ещё не разведаны.','Local traits have not yet been surveyed.'],
  ['Опасности не разведаны.','Hazards are unmapped.'],
  ['Особенности известны лишь по слухам.','Local traits are known only through rumours.'],
  ['Опасности известны лишь по слухам.','Hazards are known only through rumours.'],
  ['Особенности прояснятся после осмотра окрестностей.','Local traits will become clear after surveying the surroundings.'],
  ['Окрестности ещё не проверены осмотром.','Surroundings have not been personally surveyed yet.'],
  ['О месте ходят смутные слухи, но точных сведений пока нет.','Vague rumours surround this place, but no certain facts are known.'],
  ['По слухам: в глубине леса путники видят звериные глаза.','From rumours: travellers see animal eyes deeper in the forest.'],
  ['По слухам: под алтарём есть опасные печати.','From rumours: dangerous seals lie beneath the altar.'],
  ['По слухам: стража у ворот проверяет чужаков.','From rumours: guards at the gate check strangers.'],
  ['По слухам: страж охраняет проход на верхнюю тропу.','From rumours: a guardian protects the upper trail.'],
  ['По слухам от Мэй: на светлой опушке растут целебные травы, но в глубине леса путники видят звериные глаза.','From Mei’s rumours: travellers speak of a bright forest edge with medicinal herbs, but beasts lurk deeper in.'],
  ['По слухам от Мэй: за деревней есть заброшенный храм; под его алтарём скрыты опасные печати.','From Mei’s rumours: an abandoned temple lies beyond the village; dangerous seals lie beneath its altar.'],
  ['По письму от Мэй: в городском архиве служит библиотекарь Вэй.','From Mei’s letter: scholar Wei serves in the city archive.'],
  ['По письму Мэй: в городском архиве служит библиотекарь Вэй.','From Mei’s letter: scholar Wei serves in the city archive.'],
  ['Деревня у колодца — тихое поселение у тракта. В центре колодец с чистой водой, у постоялого двора останавливаются обозы.','Wellside Village — a quiet roadside settlement. A stone well stands at the centre, and caravans halt by the inn.'],
  ['Лес Шепчущих Корней — вековой сосновый бор у подножия холмов. Воздух пахнет смолой и мхом, в глубине темнеет чаща.','Whispering Roots Forest — an ancient pine woodland. The air smells of resin and moss, with thickets deepening beyond.'],
  ['Город Серебряного Моста — каменный город за высокими воротами. Заставы охраняют въезд, внутри шумят торговые ряды.','Silver Bridge City — a stone walled city behind tall gates. Outposts guard the entrance, while bustling stalls fill the streets.'],
  ['Заброшенный храм — полуразрушенное древнее святилище на каменистом холме. Мох покрывает ступени и расколотые плиты алтаря.','Abandoned Temple — a half-ruined ancient sanctuary on a rocky crest. Moss covers stone steps and cracked altar slabs.'],
  ['Перевал Облачного Меча — продуваемый ветром горный хребет. Узкая тропа ведёт сквозь туман вдоль обрыва.','Cloud Sword Pass — a windswept mountain ridge. A narrow path climbs through the mist along sheer cliffs.'],
  ['Деревня у колодца — безопасное поселение с колодцем и постоялым двором.','Wellside Village — a safe settlement with a well and roadside inn.'],
  ['Лес Шепчущих Корней — светлая опушка безопасна для сбора трав, но дальние тропы опасны.','Whispering Roots Forest — bright edge is safe for gathering herbs, but distant trails are dangerous.'],
  ['Город Серебряного Моста — оживлённый торговый центр и архив Пустого Неба.','Silver Bridge City — a busy market hub and the Empty Sky archives.'],
  ['Заброшенный храм — внешний двор безопасен для осмотра; под алтарём скрыты печати.','Abandoned Temple — outer yard is safe to survey; seals lie beneath the altar.'],
  ['Перевал Облачного Меча — нижний склон доступен; верхнюю тропу охраняет страж.','Cloud Sword Pass — lower slope is accessible; a guardian protects the upper trail.'],
  ['Деревня у колодца — тихое поселение у тракта, где останавливаются обозы.','Wellside Village — a quiet roadside settlement where caravans halt.'],
  ['Лес Шепчущих Корней — древний сосновый бор, пахнущий смолой и мхом.','Whispering Roots Forest — an ancient pine woodland smelling of resin and moss.'],
  ['Город Серебряного Моста — каменный город за высокими воротами с оживлёнными лавками.','Silver Bridge City — a stone walled city behind tall gates with lively market stalls.'],
  ['Заброшенный храм — полуразрушенное древнее святилище на каменистом склоне.','Abandoned Temple — a half-ruined ancient sanctuary on a rocky slope.'],
  ['Перевал Облачного Меча — продуваемый ветром горный хребет над ущельем.','Cloud Sword Pass — a windswept mountain ridge high above the chasm.']
]);
root.IsekaiLocale.add([
  ['Личные впечатления: ','Firsthand impression: '],
  ['Здесь встречены: ','Met here: '],
  ['Здесь живут и работают: ','Living and working here: '],
  ['Здесь живёт хозяйка постоялого двора Мэй: кров и работа у очага.','Innkeeper Mei lives here: shelter and work by the hearth.'],
  ['У колодца живёт и обучает наставник Жэнь: стойка и дыхание.','Mentor Ren lives by the well: stance and breathing.'],
  ['На лесной тропе живёт травница Линь: знает целебные травы.','Herbalist Lin lives along the forest trail: knows medicinal herbs.'],
  ['В лесной чаще тренируется наставник Сэнь из Нефритовой Рощи.','Mentor Sen of Jade Grove trains in the forest thicket.'],
  ['В городском архиве служит библиотекарь Вэй: хранит древние свитки.','Scholar Wei serves in the city archive: keeps ancient scrolls.'],
  ['В торговом квартале держит лавку аптекарь Хо.','Apothecary Huo keeps a shop in the merchant quarter.'],
  ['Среди алтарей храма бродит странник в сером плаще.','A grey-cloaked wanderer roams among the temple altars.'],
  ['На ветреном перевале тренируется наставница Облачного Предела Юнь.','Sword mentor Yun of Cloud Reach trains on the windswept pass.'],
  ['На старой мельнице работает мастер креплений Тун.','Fastening craftsman Tong works at the old mill.'],
  ['В скрытом саду живёт хранительница семян Суй.','Seed keeper Sui lives in the hidden garden.'],
  ['В обсерватории ведёт наблюдения исследовательница Цяо.','Researcher Qiao conducts observations in the observatory.'],
  ['В алхимической лаборатории работает аптекарь Бо.','Apothecary Bo works in the alchemy laboratory.'],
  ['Сбор трав проверен лично: на светлых участках растут лекарственные растения.','Herb gathering personally confirmed: medicinal plants grow in bright clearings.'],
  ['Добыча руды проверена лично: в породе есть жилы ценного камня.','Ore extraction personally confirmed: rock seams contain valuable ore.'],
  ['Поиск осколков проверен лично: древние реликвии скрыты среди камней.','Shard search personally confirmed: ancient relics lie hidden among the stones.'],
  ['Заработок проверен лично: за местную работу платят монетами.','Earnings personally confirmed: local work pays in coins.'],
  ['Ты ещё не был здесь лично. Все сведения записаны исключительно со слов и слухов.','You have not been here personally. All knowledge is recorded purely from hearsay and rumours.'],
  ['Собственные наблюдения. Новые встречи, осмотры и находки дополняют запись.','Your own observations. New encounters, surveys and discoveries add to this record.'],
  ['Слух (Мэй): «','Rumour (Mei): “'],
  ['Слух (Жэнь): «','Rumour (Ren): “'],
  ['Слух (Линь): «','Rumour (Lin): “'],
  ['Слух (Вэй): «','Rumour (Wei): “'],
  ['Слух (Возчики): «','Rumour (Carters): “'],
  ['Слух (Юнь): «','Rumour (Yun): “'],
  ['Слух (Хо): «','Rumour (Ho): “'],
  ['По слухам (Мэй): «','From rumours (Mei): “'],
  ['По слухам (Жэнь): «','From rumours (Ren): “'],
  ['По слухам (Линь): «','From rumours (Lin): “'],
  ['По слухам (Вэй): «','From rumours (Wei): “'],
  ['По слухам (Возчики): «','From rumours (Carters): “'],
  ['По слухам (Юнь): «','From rumours (Yun): “'],
  ['По слухам (Хо): «','From rumours (Ho): “'],
  ['Сведения о месте','Location details'],
  ['Подробнее о месте','Full details'],
  ['Подробнее','Details'],
  ['Местность и впечатления','Atmosphere and surroundings'],
  ['Особенность места','Local trait'],
  ['Безопасность и разведка','Hazards and scouting'],
  ['Жители и наставники','Residents and mentors'],
  ['Найденные ресурсы','Discovered resources'],
  ['Твоя личная заметка','Your personal note'],
  ['● Ты здесь','● You are here'],
  ['✓ Исследовано лично','✓ Personally discovered'],
  ['? Известно по слухам','? Known from rumours'],
  ['◇ Неизведанные земли','◇ Unexplored lands'],
  ['Время пути: ','Travel time: '],
  ['Осмотров окрестностей: ','Local surveys: '],
  ['Тропа найдена: переход −20%','Shortcut trail found: travel −20%'],
  ['Для короткой тропы: 2 осмотра','For shortcut trail: 2 surveys needed'],
  ['Источник: ','Source: '],
  ['В пути: осталось ','Travelling: remaining '],
  ['Налечь плечом на ось','Heave your shoulder against the axle'],
  ['Подложить камни под колесо','Wedge stones under the wheel'],
  ['Осмотреть размытую колею','Inspect the washed-out rut'],
  ['Навалиться на ось всем весом: тело +0,1; 5 монет и 5 трав.','Push with full body weight: body +0.1; 5 coins and 5 herbs.'],
  ['Замостить колею камнями и хворостом: спокойствие +1; 5 монет и 8 трав.','Pave the rut with stones and brush: calm +1; 5 coins and 8 herbs.'],
  ['Поддеть ось вагой и осмотреть глину: находка 1 осколка; 10 монет и 3 травы.','Lever the axle and inspect the mud: find 1 shard; 10 coins and 3 herbs.'],
  ['Выбери действие у застрявшей повозки, чтобы продолжить путь.','Choose an action at the stuck wagon to continue your journey.'],
  ['Неверное начальное действие','Invalid prologue action'],
  ['Большой набор у городских ворот','Great recruitment at the city gates'],
  ['Вступить в секту','Join a sect'],
  ['Выбрать одну из открытых сект и принести клятву ученика.','Choose one of the open sects and take the disciple’s oath.'],
  ['Выбрать одну из открытых сект и принести клятву ученика','Choose one of the open sects and take the disciple’s oath'],
  ['Клятва принесена','Oath taken'],
  ['Первая глава завершена','First chapter complete'],
  ['Начать следующую главу во вкладке «Путь героя».','Begin the next chapter in the Hero’s Path tab.'],
  ['Клятва принесена. Начни следующую главу во вкладке «Путь героя».','Oath taken. Begin the next chapter in the Hero’s Path tab.'],
  ['Нефритовая Роща · Наставник Сэнь','Jade Grove · Master Sen'],
  ['Облачный Предел · Наставница Юнь','Cloud Reach · Master Yun'],
  ['Пустое Небо · Хранитель Вэй','Empty Sky · Keeper Wei'],
  ['Каменный Оплот · Общий набор','Stone Bastion · Open recruitment'],
  ['Алхимия и лекарственные растения','Alchemy and medicinal plants'],
  ['Путь меча и поединки чести','Sword path and duels of honor'],
  ['Духовные практики и печати','Spiritual practice and seals'],
  ['Закалка тела и стойкость','Body tempering and endurance'],
  ['Путь исцеления и трав. Техника «Нефритовый круг». Стартовый дар: 20 трав.','Path of healing and herbs. Jade Circle technique. Starting gift: 20 herbs.'],
  ['Путь клинка и боевой точности. Техника «Возвращающийся клинок». Стартовый дар: +1 освоения.','Path of the blade and martial precision. Returning Blade technique. Starting gift: +1 mastery.'],
  ['Путь древних сутр и печатей. Техника «Письмена беззвёздного неба». Стартовый дар: 40 духовной энергии.','Path of ancient sutras and seals. Starless Sky Script technique. Starting gift: 40 qi.'],
  ['Путь закалки тела и несгибаемой воли. Техника «Железные сухожилия». Стартовый дар: 10 репутации.','Path of body tempering and endurance. Iron Sinews technique. Starting gift: 10 reputation.'],
  ['20 трав','20 herbs'],
  ['+1 освоения','+1 mastery'],
  ['40 духовной энергии','40 qi'],
  ['10 репутации','10 reputation'],
  ['Дар: 20 трав','Gift: 20 herbs'],
  ['Дар: +1 освоения','Gift: +1 mastery'],
  ['Дар: 40 духовной энергии','Gift: 40 qi'],
  ['Дар: 10 репутации','Gift: 10 reputation'],
  ['Требуется спасти наставника Сэня в лесу.','Requires rescuing Master Sen in the forest.'],
  ['Требуется вернуть останки ученика из руин.','Requires returning disciple remains from the ruins.'],
  ['Требуется найти карту приглашения в руинах или доставить письмо Вэю.','Requires finding the invitation map in the ruins or delivering the letter to Wei.'],
  ['Ты принёс клятву ученика и получил жетон школы: Нефритовая Роща. Первая глава завершена. Теперь предстоит начать жизнь полноправного адепта.','You took the disciple’s oath and received the school token: Jade Grove. The first chapter is complete. Now you begin your life as a full adept.'],
  ['Ты принёс клятву ученика и получил жетон школы: Облачный Предел. Первая глава завершена. Теперь предстоит начать жизнь полноправного адепта.','You took the disciple’s oath and received the school token: Cloud Reach. The first chapter is complete. Now you begin your life as a full adept.'],
  ['Ты принёс клятву ученика и получил жетон школы: Пустое Небо. Первая глава завершена. Теперь предстоит начать жизнь полноправного адепта.','You took the disciple’s oath and received the school token: Empty Sky. The first chapter is complete. Now you begin your life as a full adept.'],
  ['Ты принёс клятву ученика и получил жетон школы: Каменный Оплот. Первая глава завершена. Теперь предстоит начать жизнь полноправного адепта.','You took the disciple’s oath and received the school token: Stone Bastion. The first chapter is complete. Now you begin your life as a full adept.'],
  ['Ты принёс клятву ученика и получил жетон школы: . Первая глава завершена. Теперь предстоит начать жизнь полноправного адепта.','You took the disciple’s oath and received the school token. The first chapter is complete. Now you begin your life as a full adept.']
]);
root.IsekaiLocale.add([
  ['ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 1 · ГЛАВА 1', 'AGAINST THE GODS · VOL. 1 · CH. 1'],
  ['ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 1 · ГЛАВА 2', 'AGAINST THE GODS · VOL. 1 · CH. 2'],
  ['ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 1 · ГЛАВА 3', 'AGAINST THE GODS · VOL. 1 · CH. 3'],
  ['ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 1 · ГЛАВА 4', 'AGAINST THE GODS · VOL. 1 · CH. 4'],
  ['ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 1 · ГЛАВА 5', 'AGAINST THE GODS · VOL. 1 · CH. 5'],
  ['ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 1 · ГЛАВА 6', 'AGAINST THE GODS · VOL. 1 · CH. 6'],
  ['ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 1 · ГЛАВА 7', 'AGAINST THE GODS · VOL. 1 · CH. 7'],
  ['ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 1 · ГЛАВА 8', 'AGAINST THE GODS · VOL. 1 · CH. 8'],
  ['ВОССТАВШИЙ ПРОТИВ НЕБА · ТОМ 1 · ЭПИЛОГ', 'AGAINST THE GODS · VOL. 1 · EPILOGUE'],
  ['ХРОНИКА ГЛАВЫ', 'CHAPTER CHRONICLE'],
  ['Повозка увязла задним колесом в размытой колее. Выбери способ помочь возчику, чтобы продолжить путь в долину.',
   'The wagon’s rear wheel is trapped in a washed-out rut. Choose how to assist the carter to continue toward the valley.'],
  ['Колесо вызволено из глины, и телега скрипит по сухому настилу. Ты едешь на облучке рядом с дядей Ба навстречу Долине Плывущих Облаков и постоялому двору Мэй.',
   'The wheel is freed from the mud, and the wagon creaks over dry timbers. You ride on the box beside Uncle Ba toward Floating Cloud Valley and Lady Mei’s inn.'],
  ['Двор завален щебнем и размытой глиной. Мэй ждёт расчистки проезда у навеса, а метла прислонена к стене.',
   'The yard is choked with rubble and washed-out mud. Mei waits for the path to the shed to be cleared, and a broom leans against the wall.'],
  ['Тяжёлая бамбуковая метла скребёт по базальтовым булыжникам. Спазмированные каналы ноют от каждого взмаха, но первые дорожки уже очищены от грязи.',
   'The heavy bamboo broom scrapes against the basalt cobbles. Blocked channels ache with every stroke, but the first pathways are cleared of mud.'],
  ['Половина площадки расчищена. Возчики начинают перекатывать телегу под навес. Хозяйка Мэй одобрительно кивает из дверей кухни.',
   'Half of the courtyard is cleared. The carters begin rolling the wagon under the shed. Hostess Mei nods approvingly from the kitchen doorway.'],
  ['Проезд к навесу свободен. Пыль осела, и телега встала под крышу до темноты. Мэй ставит у очага горячую похлёбку и чистую воду.',
   'The way to the shed is clear. The dust settles, and the wagon is safely parked under the roof before dark. Mei sets a hot bowl of soup and fresh water by the hearth.'],
  ['Вместо слепого напряжения ты выверяешь форму изученного приёма. Точная траектория заменяет грубую силу, и тело находит устойчивое равновесие.',
   'Instead of blind exertion, you calibrate the forms of your learned technique. Precise trajectories replace brute force, and the body finds resilient balance.'],
  ['Ноги подкашиваются от непривычной нагрузки. Спазмированные каналы простреливает тупой болью, а дыхание сбивается уже на первых движениях.',
   'Your legs tremble under the unaccustomed strain. Blocked channels throb with dull pain, and your breath falters on the very first movements.'],
  ['Жэнь поправляет постановку стоп: «Спину держи прямо, толкайся пятками, дыши ровно». Мышечная боль сменяется упругим теплом в бёдрах.',
   'Zhen corrects your footing: “Keep your spine straight, drive through your heels, breathe steadily.” Muscle aches give way to resilient warmth in your thighs.'],
  ['Стойка у колодца обретает монолитную крепость. Дрожь в коленях утихла, и Жэнь скупо кивает: бренное тело заложило первый надёжный фундамент.',
   'Your stance by the well gains solid firmness. The trembling in your knees has ceased, and Zhen gives a curt nod: the mortal vessel has forged its first reliable foundation.'],
  ['Сидя на каменном парапете колодца, трудно унять мысли. Шум деревенского двора, ржание лошадей и скрип колёс заглушают внутреннюю тишину.',
   'Sitting on the stone well curb, it is hard to quieten your thoughts. The din of the village yard, whinnying horses, and creaking wheels drown out inner stillness.'],
  ['Следуя счёту дыхания Жэня, пульс замедляется. Суета отступает, а в центре левой ладони Небесная Жемчужина Яда отзывается мягким согревающим теплом.',
   'Following Zhen’s breathing count, your pulse slows. Turmoil recedes, and in the center of your left palm the Sky Poison Pearl answers with gentle warming heat.'],
  ['Наступает полная внутренняя тишина. Сквозь безмолвие с холма за деревней отчётливо доносится вибрирующий звон древней храмовой печати.',
   'Complete inner silence settles in. Through the stillness from the hill beyond the village, the vibrating chime of an ancient temple seal rings out clearly.'],
  ['Заросшая тропа ведёт на холм к святилищу. Каменные ступени раскрошились от времени, а входной портал завален упавшими балками и золой.',
   'An overgrown trail climbs the hill toward the sanctuary. Stone steps have crumbled with age, and the entrance portal is choked with fallen beams and ash.'],
  ['Разгребая вековой щебень, ты находишь расколотые стелы с древними символами. Воздух в глубине святилища холодеет и наливается духовным давлением.',
   'Clearing centuries of rubble, you uncover cracked steles etched with ancient symbols. The air deep within the sanctuary grows cold and heavy with spiritual pressure.'],
  ['Под рухнувшим алтарём темнеет толстый слой холодного пепла. Пальцы нащупывают край скрытой каменной шкатулки; ладонь покалывает от скрытой силы.',
   'Beneath the collapsed altar lies a thick layer of cold ash. Your fingers brush the edge of a hidden stone coffer; your palm tingles from concealed power.'],
  ['Холодная пластина чёрного нефрита в твоих руках! Небесная Жемчужина Яда вспыхивает багровым светом, пробуждая письмена Сутры Злого Неба.',
   'The cold tablet of black jade is in your grasp! The Sky Poison Pearl flares with crimson brilliance, awakening the script of the Evil Sky Sutra.'],
  ['Узор Сутры Злого Неба запечатлён в сознании, но каналам требуется очищающий настой трав и время медитации для полного понимания схемы.',
   'The pattern of the Evil Sky Sutra is seared into your mind, but your channels require purified herbal essence and meditation to fully comprehend the path.'],
  ['Лечебные травы собраны у очага. Осталось углубить медитацию, чтобы мысленный взор до конца проследил все узловые точки божественного осколка.',
   'Medicinal herbs are gathered by the hearth. All that remains is to deepen your meditation until your inner vision traces every focal junction of the divine shard.'],
  ['Понимание схемы меридианов достигло предела, но для безопасного прорыва не хватает свежих трав: Жемчужина ждёт сырья для очищения эссенции.',
   'Understanding of the meridian pathways has reached its peak, but fresh herbs are needed for a safe breakthrough: the Pearl awaits raw leaves to refine the elixir.'],
  ['Капля чистейшей эссенции готова в ладони, а меридианы выстроены по схеме сутры. Всё готово для сокрушения заблокированных с рождения оков!',
   'A drop of purest essence rests ready in your palm, and your meridians align with the sutra. Everything is prepared to shatter the channels blocked since birth!'],
  ['Заблокированные каналы разошлись с громоподобным треском! Плотный поток истинной ци циркулирует по телу, знаменуя восхождение на первую ступень.',
   'The blocked channels have burst open with a resounding crack! A dense flow of true qi circulates through your body, marking ascension to the first realm.'],
  ['Вымогатель Белого Клыка перекрыл мост на выезде. Докажи право идти дальше боем, помощью жителям или городской рекомендацией Вэя.',
   'A White Fang extortionist blocks the bridge out of the village. Prove your right to proceed through combat, helping locals, or Wei’s city recommendation.'],
  ['Застава преодолена, и дорога свободна. Хозяйка Мэй передаёт дорожный знак и адрес городского представительства сект.',
   'The roadblock is surmounted, and the road is clear. Hostess Mei hands you travel credentials and the address of the city sect bureau.'],
  ['Перед каменными вратами Города Серебряного Моста шатры великих сект ждут твоего выбора. Принеси клятву ученика.',
   'Before the stone gates of Silver Bridge City, pavilions of the great sects await your choice. Take the disciple’s oath.'],
  ['Клятва принесена, и жетон ученика скрепляет твой статус адепта. Первая глава пути завершена — впереди жизнь в великой секте.',
   'The oath is sworn, and a disciple token confirms your status as an adept. The first chapter is complete — life in a great sect lies ahead.'],
  ['Ты принёс клятву ученика и получил жетон школы: Каменный Оплот · общий набор. Первая глава завершена. Теперь предстоит начать жизнь полноправного адепта.',
   'You took the disciple’s oath and received the school token: Stone Bastion · open recruitment. The first chapter is complete. Now you begin your life as a full adept.'],
  ['Ты принёс клятву ученика и получил жетон школы: Пустое Небо · хранитель Вэй. Первая глава завершена. Теперь предстоит начать жизнь полноправного адепта.',
   'You took the disciple’s oath and received the school token: Empty Sky · Keeper Wei. The first chapter is complete. Now you begin your life as a full adept.'],
  ['Ты принёс клятву ученика и получил жетон школы: Нефритовая Роща · наставник Сэнь. Первая глава завершена. Теперь предстоит начать жизнь полноправного адепта.',
   'You took the disciple’s oath and received the school token: Jade Grove · Mentor Sen. The first chapter is complete. Now you begin your life as a full adept.'],
  ['Ты принёс клятву ученика и получил жетон школы: Облачный Предел · наставница Юнь. Первая глава завершена. Теперь предстоит начать жизнь полноправного адепта.',
   'You took the disciple’s oath and received the school token: Cloud Reach · Mentor Yun. The first chapter is complete. Now you begin your life as a full adept.'],
  ['Архив прочитанной главы', 'Archived Chapter'],
  ['Все сделанные выборы уже запечатлены в твоей судьбе.', 'Your choices have already been woven into destiny.'],
  ['↩ К текущей главе', '↩ Return to current'],
  ['СДЕЛАННЫЙ ВЫБОР', 'CHOICE MADE'],
  ['АРХИВ ГЛАВЫ', 'CHAPTER ARCHIVE'],
  ['АРХИВ ПАМЯТИ', 'MEMORY ARCHIVE'],
  ['Ты читаешь архив пройденных событий. Сделанные выборы уже запечатлены в твоей судьбе.', 'Reading the archive of completed events. Your choices are already woven into destiny.'],
  ['Директива успешно выполнена', 'Directive successfully completed'],
  ['Пройденные события', 'Past events'],
  ['Твоя история только начинается.', 'Your story is just beginning.'],
  ['📖 Открыть эту главу', '📖 Open this chapter'],
  ['Выбор: ', 'Choice: '],
  ['Помощь повозке на тракте', 'Assisting the wagon on the highway'],
  ['Ты помог возчику вызволить застрявшую повозку из размытого рва на сухой настил.', 'You helped the driver free his stuck wagon from the washed-out ditch onto dry road.'],
  ['Результат: спасение от ночного холода и путь к постоялому двору Мэй.', 'Outcome: Rescued from the mountain cold, traveling to Lady Mei\'s inn.'],
  ['Результат: место на облучке повозки и безопасный путь в Долину Плывущих Облаков к Мэй.', 'Outcome: A seat beside the wagon driver and safe passage to Floating Cloud Valley.'],
  ['Уборка двора и пробуждение системы', 'Sweeping the yard & system awakening'],
  ['Ты расчистил площадку для повозки тяжёлой бамбуковой метлой. На пике истощения Небесная Жемчужина Яда активировала строки духовного интерфейса подсказок.', 'You cleared the yard with Lady Mei\'s bamboo broom. At the brink of exhaustion, the Sky Poison Pearl awakened your spiritual guidance interface.'],
  ['Результат: горячая похлёбка, ночлег у очага и инициализация системы.', 'Outcome: Warm stew, hearth shelter, and spiritual interface initialization.'],
  ['Путь знания: Изучение техники', 'Path of Knowledge: Technique Mastery'],
  ['Вместо слепого подъёма тяжестей ты применил точную траекторию и распределение веса изученной техники. Баланс заменил грубую силу.', 'Instead of brute hauling, you applied the precise balance and weight distribution of your learned technique.'],
  ['Результат: рост мастерства без лишнего надрыва заблокированных каналов.', 'Outcome: Mastery growth without overtaxing blocked meridians.'],
  ['Путь закалки: Упорные упражнения', 'Path of Tempering: Physical Conditioning'],
  ['Ты тренировал истощённое тело глубокими приседаниями, пробежками и работой у колодца под наставничеством старика Жэня.', 'You tempered your body with squats, sprints, and wellside conditioning under Old Ren\'s guidance.'],
  ['Результат: укрепление сухожилий, рост запаса и восстановления выносливости.', 'Outcome: Hardened tendons and expanded stamina capacity.'],
  ['Тишина между вдохами: Ритм дыхания', 'Silence Between Breaths: Steady Respiration'],
  ['Обуздав суетливые мысли, ты восстановил дыхание у колодца. В глубокой тишине Жемчужина Яда уловила вибрирующий звон печати древнего святилища.', 'Stilling turbulent thoughts, you calmed your breath. In deep stillness, the Poison Pearl resonated with the ancient seal in the mountain ruins.'],
  ['Результат: достигнуто спокойствие разума, открыт путь к Развалинам храма.', 'Outcome: Deep mental calm achieved, revealing the trail to the Ancient Temple Ruins.'],
  ['Древний алтарь и Сутра Злого Неба', 'Ancient Altar & Evil God Sutra'],
  ['В полуразрушенном горном святилище ты очистил алтарь от скверны и нашёл священный осколок Сутры Злого Неба, а также собрал редкие целебные травы.', 'At the ruined sanctuary, you cleansed the corrupted altar, uncovering the Evil God Sutra and gathering rare healing herbs.'],
  ['Результат: обретена божественная техника «Путь Пустого Неба» и алхимические ингредиенты.', 'Outcome: Acquired the Evil God technique and purified alchemical ingredients.'],
  ['Сокрушение спазмов: Прорыв на 1-ю ступень', 'Shattering Blockages: Realm 1 Breakthrough'],
  ['Жемчужина Яда очистила травы в безупречный 100% эликсир. Мощная волна ци разорвала врождённые спазмы, открыв глубокие каналы.', 'The Poison Pearl refined the herbs into a 100% pure elixir. A surge of qi shattered congenital spasms, opening your profound channels.'],
  ['Результат: статус культиватора 1-й ступени (Начальная ступень ци) и взрывной прилив сил.', 'Outcome: Attained Realm 1 (Elementary Qi Cultivator) with surging inner power.'],
  ['Путь меча: Поединок на мосту', 'Path of Might: Duel at the Bridge'],
  ['Ты дал открытый бой главарю вымогателей Белого Клыка на мосту и сокрушил его новой силой открытых каналов.', 'You confronted the White Fang extortionist on the bridge, overpowering him with your unsealed channels.'],
  ['Результат: первая боевая победа, спасение повозки и право идти в город.', 'Outcome: First combat victory, saving the wagon and earning passage to the city.'],
  ['Путь сплочения: Дорога без потерь', 'Path of Unity: Passage Without Loss'],
  ['Жители деревни сплочённо вышли к реке и помогли провести повозку в брод в обход заставы. Бандиты не посмели напасть на людей.', 'United villagers came to the river and helped ferry the wagon across the shallows, making the bandits back down without a fight.'],
  ['Результат: 3 признания людей, мирный проход обоза и рекомендательный знак хозяйки Мэй.', 'Outcome: 3 community recognitions, peaceful passage, and Mei\'s token.'],
  ['Слово из архива: Дорожная грамота Вэя', 'Word from the Archive: Wei\'s Charter'],
  ['Ты предъявил официальную гербовую грамоту городского архивариуса Вэя, полученную за доставку письма. Застава открыла путь без споров.', 'You presented the official sealed charter from scholar Wei. The checkpoint guards opened the barrier without argument.'],
  ['Результат: беспрепятственный проезд через заставу силой городского авторитета.', 'Outcome: Uncontested passage through the roadblock backed by city authority.'],
  ['Застава на выезде из долины', 'Outpost at the Valley Exit'],
  ['Решение конфликта с бандой Белого Клыка на мосту.', 'Resolving the confrontation at the White Fang bridge.'],
  ['Великий набор у городских ворот', 'Grand Recruitment at City Gates'],
  ['Выбор одной из четырёх сект Долины Плывущих Облаков.', 'Choosing one of the four great sects of the valley.'],
  ['Истощение от холода и голода: выносливость не восстанавливается! Осталось: ', 'Starving and freezing: stamina will not recover! Remaining: '],
  ['(хватит на уборку до похлёбки)', '(barely enough to sweep until food)'],
  ['Похлёбка Мэй съедена: силы восстановлены, регенерация активна (+0.4/сек)', 'Mei’s stew eaten: stamina restored, recovery active (+0.4/s)'],
  ['Дорожные сухари возчика и место на облучке повозки', 'Carter’s trail rations and a seat on the wagon box'],
  ['Пробуждение Небесной Жемчужины Яда · Слияние с сосудом: 0.1%', 'Sky Poison Pearl awakened · Vessel fusion: 0.1%'],
  ['Дымящаяся мясная похлёбка Мэй и рис (восстановление сил) + 10 монет', 'Lady Mei’s steaming meat stew & rice (full stamina recovery) + 10 coins'],
  ['Очищение меридианов +1%, снятие истощения, циркуляция сил разблокирована (+0.4/сек)', 'Profound channels cleansed +1%, starvation removed, stamina circulation unlocked (+0.4/s)'],
  ['Лекарственная растирка Жэня для ноющих мышц и сухожилий (5 трав)', 'Old Ren’s medicinal muscle & sinew liniment (5 herbs)'],
  ['Укрепление мышечного каркаса +0.1, предел выносливости расширен', 'Muscular framework tempered +0.1, stamina threshold expanded'],
  ['Успокаивающий горный травяной сбор и родниковая вода (3 травы)', 'Soothing valley herb brew & mountain spring water (3 herbs)'],
  ['Духовное чутьё +1, координаты святилища Злого Бога зафиксированы на карте', 'Spiritual sense +1, Evil God sanctuary coordinates locked on map'],
  ['Осколок алтаря из чёрного нефрита с древними символами (1 реликвия)', 'Black jade altar shard engraved with ancient symbols (1 shard)'],
  ['Сутра Злого Неба активирована · Разблокирована 100% алхимическая очистка трав без токсинов', 'Evil Sky Sutra activated · 100% toxin-free herbal alchemy purification unlocked'],
  ['Очищенная эссенция горных трав стопроцентной чистоты (10 трав)', '100% pure refined essence of mountain herbs (10 herbs)'],
  ['Великий прорыв! 54 спазмированных канала сокрушены · Ступень Начальной Ци достигнута', 'Grand Breakthrough! 54 crippled channels shattered · Elementary Profound Realm reached'],
  ['Дорожные припасы и кошель от дяди Ба и госпожи Мэй (25 монет)', 'Travel provisions and road purse from Uncle Ba & Lady Mei (25 coins)'],
  ['Первое боевое крещение · Признание Долины Плывущих Облаков, открыт путь в город', 'First baptism of battle · Floating Cloud Valley recognition, path to city opened'],
  ['Жетон ученика великой секты и начальное содержание адепта', 'Great Sect disciple token and starting adept allowance'],
  ['Статус официального ученика утверждён · Том 1 завершён, открыт Том 2: Путь Секты', 'Official disciple status confirmed · Volume 1 complete, Volume 2 Sect Path unlocked'],
  ['Награда в мире: ', 'In-world reward: '],
  ['Система Прозрения: ', 'Insight System: '],
  ['Прибытие на постоялый двор Мэй. Тело продрогло и истощено от голода; Мэй предлагает миску горячей похлёбки за расчистку двора.', 'Arrival at Mei’s inn. Vessel frozen and starving; Mei offers a bowl of hot stew for clearing the yard.'],
  ['Госпожа Мэй подаёт дымящуюся мясную похлёбку и рис. Голод утолён, выносливость полностью восстановлена!', 'Lady Mei serves steaming meat stew and rice. Hunger sated, stamina fully restored!'],
  ['【Система Прозрения】 Очищение меридианов +1%. Истощение снято, циркуляция выносливости разблокирована (+0.4/сек).', '【Insight System】 Profound channels cleansed +1%. Starvation removed, stamina circulation unlocked (+0.4/s).']
]);
})(globalThis);
