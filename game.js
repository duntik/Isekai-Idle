(() => {
  'use strict';
  const KEY = 'isekai-idle-v1';
  const names = { food: 'Ягоды', wood: 'Древесина', stone: 'Камень', mana: 'Мана', gold: 'Золото' };
  const icons = { food: '❧', wood: '♧', stone: '◇', mana: '✧', gold: '◉' };
  const buildings = {
    hut: { name: 'Дом поселенца', icon: '⌂', desc: 'Пригласи нового жителя. Каждый дом добавляет одного работника.', cost: { wood: 15, stone: 5 } },
    farm: { name: 'Лесной сад', icon: '❧', desc: 'Даёт 0,5 ягод в секунду. Жители расходуют ягоды на работу.', cost: { wood: 10 } },
    mill: { name: 'Лесопилка', icon: '♧', desc: 'Даёт 0,3 древесины в секунду — основу будущего поселения.', cost: { wood: 25, stone: 10 } },
    shrine: { name: 'Святилище', icon: '✧', desc: 'Даёт 0,15 маны в секунду. Магия открывает путь к новой жизни.', cost: { wood: 40, stone: 30 } }
  };
  const fresh = () => ({ version: 1, life: 1, souls: 0, age: 0, resources: { food: 0, wood: 0, stone: 0, mana: 0, gold: 0 }, buildings: { hut: 0, farm: 0, mill: 0, shrine: 0 }, workers: { food: 0, wood: 0, stone: 0 }, events: [], last: Date.now(), cooldown: 0 });
  function validate(s) {
    if (!s || s.version !== 1) throw Error('Неверный формат');
    for (const k of ['life', 'souls', 'age', 'last', 'cooldown']) if (!Number.isFinite(s[k]) || s[k] < 0) throw Error('Неверные значения');
    for (const group of ['resources', 'buildings', 'workers']) for (const k of Object.keys(fresh()[group])) if (!Number.isFinite(s[group]?.[k]) || s[group][k] < 0 || (group !== 'resources' && !Number.isInteger(s[group][k]))) throw Error('Неверные ресурсы');
    if (Object.values(s.workers).reduce((a, b) => a + b, 0) > s.buildings.hut || !Array.isArray(s.events)) throw Error('Неверные жители');
    s.events = s.events.filter(e => e && typeof e.text === 'string' && typeof e.day === 'number').slice(0, 12);
    return s;
  }
  let state = fresh(), tab = 'village';
  let storageIssue = false;
  try { const saved = localStorage.getItem(KEY); if (saved) state = validate(JSON.parse(saved)); } catch { storageIssue = true; }
  const $ = id => document.getElementById(id);
  const fmt = n => n.toLocaleString('ru-RU', { maximumFractionDigits: 1 });
  const bonus = () => 1 + state.souls * .1;
  const cost = key => Object.fromEntries(Object.entries(buildings[key].cost).map(([k, v]) => [k, Math.ceil(v * 1.18 ** state.buildings[key])]));
  const afford = c => Object.entries(c).every(([k, v]) => state.resources[k] >= v);
  const pay = c => Object.entries(c).forEach(([k, v]) => state.resources[k] -= v);
  const costText = c => Object.entries(c).map(([k, v]) => `${fmt(v)} ${names[k].toLowerCase()}`).join(' · ');
  const log = text => { state.events.unshift({ text, day: Math.floor(state.age / 60) + 1 }); state.events = state.events.slice(0, 12); };
  let toastTimer;
  function toast(text) { $('toast').textContent = text; $('toast').style.display = 'block'; clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').style.display = 'none', 3000); }
  function save(manual = false) { try { localStorage.setItem(KEY, JSON.stringify(state)); if (manual) toast('Прогресс сохранён'); } catch { if (manual) toast('Сохранение недоступно. Используй экспорт.'); } }
  function rates() {
    const active = state.resources.food > 0 || state.workers.food > 0 || state.buildings.farm > 0;
    const employed = Object.values(state.workers).reduce((a, b) => a + b, 0);
    return { food: (state.buildings.farm * .5 + (active ? state.workers.food * .6 : 0)) * bonus() - (active ? employed * .1 : 0), wood: (state.buildings.mill * .3 + (active ? state.workers.wood * .4 : 0)) * bonus(), stone: (active ? state.workers.stone * .25 : 0) * bonus(), mana: state.buildings.shrine * .15 * bonus(), gold: 0 };
  }
  function advance(seconds) {
    // Short steps preserve food starvation behavior during offline progress.
    for (let left = seconds; left > 0;) { const dt = Math.min(left, 1), r = rates(); for (const k in r) state.resources[k] = Math.max(0, state.resources[k] + r[k] * dt); state.age += dt; state.cooldown = Math.max(0, state.cooldown - dt); left -= dt; }
  }
  function render() {
    $('life').textContent = `↻ Жизнь ${state.life}`; $('souls').textContent = `✧ Души: ${state.souls} · бонус ${Math.round((bonus() - 1) * 100)}%`; $('day').textContent = `◷ День ${Math.floor(state.age / 60) + 1}`;
    const r = rates();
    $('resources').innerHTML = Object.keys(names).map(k => `<div class="resource"><div class="label">${icons[k]} ${names[k]}</div><div class="value">${fmt(state.resources[k])}</div><div class="rate">${r[k] >= 0 ? '+' : ''}${fmt(r[k])} / сек</div></div>`).join('');
    const employed = Object.values(state.workers).reduce((a, b) => a + b, 0);
    if (tab === 'village') $('content').innerHTML = `<div class="section-head"><h2>Твоё поселение</h2><small>${state.buildings.hut} жителей</small></div><p class="intro">Собирай ресурсы и преврати лесную поляну в новый дом.</p><div class="actions">${['food', 'wood', 'stone'].map(k => `<button data-gather="${k}">${icons[k]} Собрать: ${names[k].toLowerCase()} +${fmt(bonus())}</button>`).join('')}</div><div class="cards">${Object.entries(buildings).map(([k, b]) => `<article class="card"><div class="card-icon">${b.icon}</div><h3>${b.name} <span style="color:var(--muted)">· ${state.buildings[k]}</span></h3><p>${b.desc}</p><div class="cost">${costText(cost(k))}</div><button data-build="${k}" ${afford(cost(k)) ? '' : 'disabled'}>Построить +</button></article>`).join('')}</div><div class="workers"><h3>Занятия жителей <small>· свободно ${state.buildings.hut - employed}</small></h3><p class="intro">Работающий житель расходует 0,1 ягод/сек. Без еды работа приостанавливается.</p>${Object.keys(state.workers).map(k => `<div class="worker"><span>${names[k]}</span><div><button data-worker="${k}" data-delta="-1" ${state.workers[k] ? '' : 'disabled'} aria-label="Убрать работника: ${names[k]}">−</button>${state.workers[k]}<button data-worker="${k}" data-delta="1" ${employed < state.buildings.hut ? '' : 'disabled'} aria-label="Назначить работника: ${names[k]}">+</button></div></div>`).join('')}</div>`;
    if (tab === 'adventure') $('content').innerHTML = `<h2>За пределами долины</h2><p class="intro">Приключения приносят золото и магию. Каждая вылазка занимает 15 секунд до следующего отправления.</p><div class="cards"><article class="card"><div class="card-icon">♧</div><h3>Шепчущий лес</h3><p>Найди древние руины. Награда: 8 золота и 5 маны.</p><div class="cost">20 ягод · 5 древесины</div><button data-adventure="forest" ${afford({food:20,wood:5}) && !state.cooldown ? '' : 'disabled'}>${state.cooldown ? `Отдых: ${Math.ceil(state.cooldown)} сек` : 'Отправиться'}</button></article><article class="card"><div class="card-icon">◇</div><h3>Забытый лабиринт</h3><p>Пройди испытание духа. Награда: 25 золота и 20 маны.</p><div class="cost">50 ягод · 10 маны</div><button data-adventure="dungeon" ${afford({food:50,mana:10}) && !state.cooldown ? '' : 'disabled'}>Исследовать</button></article></div>`;
    if (tab === 'rebirth') { const earned = Math.floor(state.resources.mana / 100); $('content').innerHTML = `<h2>Круг перерождений</h2><p class="intro">Оставь прежний мир и начни следующую жизнь с силой накопленного опыта.</p><div class="rebirth"><div class="eyebrow">НАСЛЕДИЕ ДУШИ</div><p><strong>+${earned}</strong> душ за эту жизнь</p><p>Каждые 100 накопленной маны дают одну душу. Каждая душа навсегда увеличивает сбор и производство на 10%.</p><p>Ресурсы, здания, жители и день сбросятся. Сохранённые души останутся.</p><button id="rebirth" ${earned ? '' : 'disabled'}>Переродиться</button></div>`; }
    $('journal').replaceChildren(...state.events.slice(0, 6).map(e => { const div = document.createElement('div'); div.className = 'event'; const small = document.createElement('small'); small.textContent = `ДЕНЬ ${e.day}`; div.append(small, document.createTextNode(e.text)); return div; }));
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.tab) { tab = b.dataset.tab; document.querySelectorAll('.tab').forEach(el => el.classList.toggle('active', el.dataset.tab === tab)); }
    if (b.dataset.gather) state.resources[b.dataset.gather] += bonus();
    if (b.dataset.build) { const k = b.dataset.build, c = cost(k); if (afford(c)) { pay(c); state.buildings[k]++; log(`Построено: ${buildings[k].name}.`); } }
    if (b.dataset.worker) { const k = b.dataset.worker, d = Number(b.dataset.delta), used = Object.values(state.workers).reduce((a, x) => a + x, 0); if ((d === -1 && state.workers[k] > 0) || (d === 1 && used < state.buildings.hut)) state.workers[k] += d; }
    if (b.dataset.adventure && !state.cooldown) { const dungeon = b.dataset.adventure === 'dungeon', c = dungeon ? { food: 50, mana: 10 } : { food: 20, wood: 5 }; if (afford(c)) { pay(c); state.resources.gold += dungeon ? 25 : 8; state.resources.mana += dungeon ? 20 : 5; state.cooldown = 15; log(dungeon ? 'Лабиринт пройден. Древняя магия теперь твоя.' : 'Из лесных руин принесены золото и мана.'); } }
    if (b.id === 'rebirth' && state.resources.mana >= 100 && confirm('Начать новую жизнь? Здания, жители и ресурсы сбросятся. Души сохранятся.')) { const souls = state.souls + Math.floor(state.resources.mana / 100), life = state.life + 1; state = fresh(); state.souls = souls; state.life = life; log('Ты вновь открываешь глаза. Память души остаётся с тобой.'); save(); }
    if (b.id === 'save') save(true);
    if (b.id === 'export') { const url = URL.createObjectURL(new Blob([JSON.stringify(state)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = 'isekai-idle-save.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
    render();
  });
  $('import').addEventListener('change', async e => { const file = e.target.files[0]; if (!file) return; try { if (file.size > 1000000) throw Error(); const loaded = validate(JSON.parse(await file.text())); if (confirm('Заменить текущий прогресс импортированным сохранением?')) { state = loaded; state.last = Date.now(); save(); render(); toast('Сохранение импортировано'); } } catch { toast('Не удалось прочитать сохранение'); } e.target.value = ''; });
  if (!state.events.length) log('Ты появился в долине Первого Света. Новая история начинается.');
  const offline = Math.max(0, Math.min((Date.now() - state.last) / 1000, 28800));
  if (offline > 30) { advance(offline); log(`Пока тебя не было, прошло ${Math.floor(offline / 60)} мин. Жители продолжали работать.`); }
  state.last = Date.now(); render();
  if (storageIssue) toast('Сохранение недоступно или повреждено. Доступен экспорт.');
  setInterval(() => { const now = Date.now(); advance(Math.max(0, Math.min((now - state.last) / 1000, 28800))); state.last = now; render(); }, 1000);
  setInterval(() => save(), 10000);
  window.addEventListener('pagehide', () => save());
})();
