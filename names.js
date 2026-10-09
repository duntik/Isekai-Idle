(function(root){
  'use strict';
  const list=text=>text.split(';').map(item=>item.split('|'));
  // Genre-inspired pools: traditional names and original fantasy houses.
  // These combinations are suggestions, not a catalogue of canonical characters.
  const styles={
    cultivation:{label:['Мир культивации','Cultivation world'],familyFirst:true,
      given:list('Юнь|Yun;Лэй|Lei;Мин|Ming;Фэн|Feng;Чэнь|Chen;Лин|Lin;Хао|Hao;Жуй|Rui;Цзин|Jing;Янь|Yan;Тянь|Tian;Сюань|Xuan;Шэнь|Shen;Цин|Qing;Бо|Bo;Вэй|Wei;Сюэ|Xue;Мэй|Mei;Лань|Lan;Нин|Ning;Юэ|Yue;Сяо|Xiao;Жэнь|Ren;Шу|Shu;Хун|Hong;Цзюнь|Jun;Ань|An;И|Yi;Лун|Long;Чжи|Zhi;Цзя|Jia;Шань|Shan;Жун|Rong;Хэ|He;Цзинь|Jin;Хуэй|Hui;Юй|Yu;Син|Xing;Чэн|Cheng;Дэ|De'),
      family:list('Ли|Li;Ван|Wang;Чжан|Zhang;Лю|Liu;Чэнь|Chen;Ян|Yang;Хуан|Huang;Чжао|Zhao;У|Wu;Чжоу|Zhou;Сюй|Xu;Сунь|Sun;Ма|Ma;Чжу|Zhu;Ху|Hu;Го|Guo;Хэ|He;Линь|Lin;Ло|Luo;Гао|Gao;Чжэн|Zheng;Лян|Liang;Се|Xie;Сун|Song;Тан|Tang;Сюэ|Xue;Хань|Han;Цао|Cao;Фэн|Feng;Юй|Yu;Цзян|Jiang;Цай|Cai;Ду|Du;Е|Ye;Шэнь|Shen;Лу|Lu;Су|Su;Вэй|Wei;Лань|Lan;Цинь|Qin')},
    japanese:{label:['Японское ранобэ','Japanese light novel'],familyFirst:true,
      given:list('Акира|Akira;Хару|Haru;Рэн|Ren;Кай|Kai;Юки|Yuki;Сора|Sora;Рику|Riku;Харуто|Haruto;Юто|Yuto;Казума|Kazuma;Наофуми|Naofumi;Тоя|Touya;Рёма|Ryoma;Макото|Makoto;Такуми|Takumi;Хирото|Hiroto;Ицуки|Itsuki;Кэнто|Kento;Шин|Shin;Харуки|Haruki;Аой|Aoi;Мио|Mio;Рин|Rin;Юна|Yuna;Сакура|Sakura;Хина|Hina;Каэдэ|Kaede;Асука|Asuka;Мисаки|Misaki;Нана|Nana;Хикари|Hikari;Хана|Hana;Сая|Saya;Рэй|Rei;Ая|Aya;Сиори|Shiori;Кохару|Koharu;Хотару|Hotaru;Судзу|Suzu;Харухиро|Haruhiro'),
      family:list('Сато|Sato;Судзуки|Suzuki;Такахаси|Takahashi;Танака|Tanaka;Ватанабэ|Watanabe;Ито|Ito;Ямамото|Yamamoto;Накамура|Nakamura;Кобаяси|Kobayashi;Като|Kato;Ёсида|Yoshida;Ямада|Yamada;Сасаки|Sasaki;Ямагути|Yamaguchi;Мацумото|Matsumoto;Иноуэ|Inoue;Кимура|Kimura;Хаяси|Hayashi;Сайто|Saito;Симидзу|Shimizu;Мори|Mori;Икэда|Ikeda;Хасимото|Hashimoto;Исида|Ishida;Ямасита|Yamashita;Окада|Okada;Огава|Ogawa;Миура|Miura;Хосино|Hoshino;Кирисима|Kirishima;Куросаки|Kurosaki;Сираиси|Shiraishi;Амаги|Amagi;Мидзуно|Mizuno;Амано|Amano;Татибана|Tachibana;Кадзэхая|Kazehaya;Сакураи|Sakurai;Мотидзуки|Mochizuki;Такэбаяси|Takebayashi')},
    fantasy:{label:['Фэнтезийный исекай','Fantasy isekai'],familyFirst:false,
      given:list('Рудеус|Rudeus;Леон|Leon;Кайл|Kyle;Рейн|Rein;Арлен|Arlen;Элиас|Elias;Люциан|Lucian;Роуэн|Rowan;Сириус|Sirius;Седрик|Cedric;Тео|Theo;Адриан|Adrian;Ноэль|Noel;Феликс|Felix;Юлиан|Julian;Эйден|Aiden;Кассиан|Cassian;Дарен|Daren;Эдвин|Edwin;Сайлас|Silas;Лира|Lyra;Элиана|Eliana;Селена|Selena;Ариа|Aria;Лилия|Lilia;Сильвия|Sylvia;Розалия|Rosalia;Серафина|Seraphina;Эвелин|Evelyn;Ирис|Iris;Мира|Mira;Клара|Clara;Луния|Lunia;Аурелия|Aurelia;Виола|Viola;Фрея|Freya;Эстель|Estelle;Селия|Celia;Алтея|Althea;Нерия|Neria'),
      family:list('Эшвейл|Ashvale;Сильвербрук|Silverbrook;Рейвенхилл|Ravenhill;Эмберфорд|Emberford;Винтермир|Wintermere;Мункрест|Mooncrest;Старфелл|Starfell;Дасквуд|Duskwood;Санхарт|Sunhart;Грейхоллоу|Greyhollow;Брайарвуд|Briarwood;Стоунвейл|Stonevale;Фроствейл|Frostvale;Риверблейд|Riverblade;Голдэнлиф|Goldenleaf;Блэкмарш|Blackmarsh;Доунридж|Dawnridge;Айронроуз|Ironrose;Скайфорд|Skyford;Мистборн|Mistborne;Торнвейл|Thornvale;Фэйрвинд|Fairwind;Лайтмир|Lightmere;Эверглен|Everglen;Хартвелл|Hartwell;Уайтберч|Whitebirch;Редклиф|Redcliff;Оукхарт|Oakheart;Флеймвуд|Flamewood;Найтвелл|Nightwell;Фоксглен|Foxglen;Вулфридж|Wolfridge;Старвейл|Starvale;Роземир|Rosemere;Клаудхарт|Cloudheart;Блухейвен|Bluehaven;Гринхолт|Greenholt;Эшкрофт|Ashcroft;Сноуфорд|Snowford;Дипвелл|Deepwell')}
  };
  function normalize(value){
    if(typeof value!=='string')return null;
    const name=value.normalize('NFC').trim().replace(/ +/g,' ');
    return [...name].length>=2&&[...name].length<=40&&/^[\p{L}\p{N}][\p{L}\p{M}\p{N}]*(?:[ '\u2019\u00b7-][\p{L}\p{N}][\p{L}\p{M}\p{N}]*)*$/u.test(name)?name:null;
  }
  function format(style,given,family,language='ru'){const p=styles[style],i=language==='en'?1:0;return(p.familyFirst?[p.family[family][i],p.given[given][i]]:[p.given[given][i],p.family[family][i]]).join(' ');}
  function suggestions(style='cultivation',language='ru',random=Math.random){
    const p=styles[style]||styles.cultivation;style=styles[style]?style:'cultivation';
    const indexes=Array.from({length:p.given.length*p.family.length},(_,i)=>i);
    for(let i=0;i<8;i++){const j=i+Math.floor(random()*(indexes.length-i));[indexes[i],indexes[j]]=[indexes[j],indexes[i]];}
    return indexes.slice(0,8).map(i=>format(style,Math.floor(i/p.family.length),i%p.family.length,language));
  }
  const api={styles,normalize,format,suggestions};root.IsekaiNames=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
